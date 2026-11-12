// Sello de validacion humana. Lo ejecuta el AUTOR, nunca un agente (CLAUDE.md, regla 3).
//
//   node scripts/sellar-validacion.mjs --ids trib-011,trib-013 --fecha 2026-11-12 --confirmo
//   node scripts/sellar-validacion.mjs --piloto --fecha 2026-10-26 --confirmo
//   node scripts/sellar-validacion.mjs --todas --fecha 2026-11-12 --confirmo
//
// Sin --confirmo solo muestra que haria. No toca las preguntas que ya tienen sello.
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AUTOR = 'Luis Carlos Vasquez'; // unico valor que admite schema/pregunta.schema.json

/** Devuelve las lineas con el sello aplicado y la lista de ids sellados. Funcion pura. */
export function sellar(lineas, { ids = null, piloto = false, todas = false, fecha }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '')) throw new Error('--fecha debe ser AAAA-MM-DD');
  const pedidos = ids ? new Set(ids) : null;
  const sellados = [];
  const vistos = new Set();
  const salida = lineas.map((l) => {
    if (l.trim() === '') return l;
    const p = JSON.parse(l);
    vistos.add(p.id);
    const esPiloto = Number(p.id.split('-')[1]) <= 10;
    const entra = todas || (piloto && esPiloto) || (pedidos?.has(p.id) ?? false);
    if (!entra || p.validado_por !== null) return l;
    sellados.push(p.id);
    return JSON.stringify({ ...p, validado_por: AUTOR, fecha_validacion: fecha });
  });
  const inexistentes = pedidos ? [...pedidos].filter((id) => !vistos.has(id)) : [];
  if (inexistentes.length) throw new Error(`ids que no existen: ${inexistentes.join(', ')}`);
  return { lineas: salida, sellados };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { values } = parseArgs({
    options: {
      ids: { type: 'string' },
      piloto: { type: 'boolean', default: false },
      todas: { type: 'boolean', default: false },
      fecha: { type: 'string' },
      confirmo: { type: 'boolean', default: false },
      dataset: { type: 'string', default: 'data/preguntas.jsonl' },
    },
  });
  const ruta = join(dirname(fileURLToPath(import.meta.url)), '..', values.dataset);
  const texto = readFileSync(ruta, 'utf8');
  const nl = texto.includes('\r\n') ? '\r\n' : '\n';
  const { lineas, sellados } = sellar(texto.split(/\r?\n/), {
    ids: values.ids ? values.ids.split(',').map((s) => s.trim()).filter(Boolean) : null,
    piloto: values.piloto,
    todas: values.todas,
    fecha: values.fecha,
  });
  console.log(`${sellados.length} pregunta(s) recibirian el sello de ${AUTOR} con fecha ${values.fecha}.`);
  if (!values.confirmo) {
    console.log('Nada escrito. Repite el comando con --confirmo si TU las revisaste contra su fuente.');
  } else {
    writeFileSync(ruta, lineas.join(nl));
    console.log(`Escrito en ${values.dataset}. Ahora: npm run validar && npm test`);
  }
}
