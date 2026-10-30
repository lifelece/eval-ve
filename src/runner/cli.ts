// Comando de corrida:  npm run piloto -- --modelos haiku,lmstudio
// Opciones: --juez <alias> --tope <usd> --dataset <ruta> --limite <n> --solo-validadas --cache <dir>
// Las claves viven en .env / entorno local; nunca en el repo.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { Cache } from '../cache/cache.ts';
import { crearCliente } from '../clientes/index.ts';
import { ErrorFatal } from '../tipos.ts';
import type { ConfigGlobal } from '../tipos.ts';
import { cargarDataset } from './dataset.ts';
import { Presupuesto, estimarPeorCaso } from './presupuesto.ts';
import { construirInformes, resumenMarkdown } from './reporte.ts';
import { ejecutar } from './runner.ts';
import type { EntradaModelo } from './runner.ts';
import { promptPregunta } from './prompts.ts';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

async function principal(): Promise<void> {
  try {
    process.loadEnvFile(join(RAIZ, '.env'));
  } catch {
    // sin .env: se usa el entorno del sistema
  }
  const { values } = parseArgs({
    options: {
      modelos: { type: 'string' },
      juez: { type: 'string' },
      tope: { type: 'string' },
      dataset: { type: 'string', default: 'data/preguntas.jsonl' },
      limite: { type: 'string' },
      cache: { type: 'string', default: '.cache/respuestas' },
      'solo-validadas': { type: 'boolean', default: false },
    },
  });
  const cfg = JSON.parse(readFileSync(join(RAIZ, 'config', 'modelos.json'), 'utf8')) as ConfigGlobal;
  if (!values.modelos) throw new ErrorFatal(`Falta --modelos. Disponibles: ${Object.keys(cfg.modelos).join(', ')}`);

  const alias = values.modelos.split(',').map((s) => s.trim()).filter(Boolean);
  const aliasJuez = values.juez ?? cfg.juez_por_defecto;
  for (const a of [...alias, aliasJuez]) {
    if (!cfg.modelos[a]) throw new ErrorFatal(`Alias desconocido "${a}". Disponibles: ${Object.keys(cfg.modelos).join(', ')}`);
  }
  const tope = values.tope !== undefined ? Number(values.tope) : cfg.tope_gasto_usd_por_defecto;
  if (!(tope >= 0)) throw new ErrorFatal('--tope debe ser un numero >= 0 (USD).');

  const ds = cargarDataset(join(RAIZ, values.dataset), {
    limite: values.limite !== undefined ? Number(values.limite) : undefined,
    soloValidadas: values['solo-validadas'],
  });

  // preparar() de todos ANTES de gastar: clave presente, LM Studio vivo.
  const clientes = new Map<string, EntradaModelo>();
  for (const a of new Set([...alias, aliasJuez])) {
    const config = cfg.modelos[a];
    const cliente = crearCliente(config);
    clientes.set(a, { alias: a, config, cliente, modeloId: await cliente.preparar() });
  }

  const peor = alias.map((a) => clientes.get(a)!).reduce(
    (suma, m) =>
      suma +
      ds.preguntas.reduce(
        (s, p) => {
          const pet = promptPregunta(p);
          return s + estimarPeorCaso(m.config.precio_usd_por_mtok, m.config.max_tokens, pet.system, pet.prompt);
        },
        0,
      ),
    0,
  );
  console.log(`Preguntas: ${ds.preguntas.length} (${ds.validadas} con validado_por). Modelos: ${alias.join(', ')}. Juez: ${aliasJuez}.`);
  console.log(`Tope: $${tope.toFixed(2)}. Peor caso de las respuestas (sin juez, sin cache): $${peor.toFixed(4)}.`);

  const cache = new Cache(join(RAIZ, values.cache));
  const resultado = await ejecutar({
    preguntas: ds.preguntas,
    modelos: alias.map((a) => clientes.get(a)!),
    juez: clientes.get(aliasJuez)!,
    cache,
    presupuesto: new Presupuesto(tope),
    onProgreso: (m) => console.log(m),
  });

  const fecha = new Date().toISOString().replace(/[:]/g, '').replace(/\..+/, '').replace('T', '_');
  const informes = construirInformes(resultado, {
    fecha,
    archivo: values.dataset,
    datasetSha: ds.sha256,
    preguntas: ds.preguntas.length,
    validadas: ds.validadas,
  });
  for (const inf of informes) {
    const dir = join(RAIZ, 'results', inf.modelo.alias);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${fecha}.json`), JSON.stringify(inf, null, 2) + '\n', 'utf8');
  }
  const md = join(RAIZ, 'results', `resumen-${fecha}.md`);
  writeFileSync(md, resumenMarkdown(informes), 'utf8');

  console.log(`\nGasto real: $${resultado.gasto_usd.toFixed(4)} de $${tope.toFixed(2)}. Cache: ${resultado.cache.aciertos} aciertos, ${resultado.cache.fallos} fallos.`);
  if (resultado.cortada_por_tope) console.log('ATENCION: corrida cortada por el tope de gasto.');
  if (resultado.abortada) {
    console.log(`ATENCION: corrida abortada: ${resultado.abortada}`);
    process.exitCode = 1;
  }
  console.log(`Resumen: ${md}`);
}

principal().catch((e: unknown) => {
  if (e instanceof ErrorFatal) console.error(`Error: ${e.message}`);
  else console.error(e);
  process.exitCode = 1;
});
