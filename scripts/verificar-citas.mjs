// Verifica la propiedad que importa de cada pregunta nueva: que el fragmento literal
// citado en la hoja de revision aparezca en el texto de la norma, DENTRO del articulo
// que cita `articulo_ref`. Los textos viven fuera del repo (ADR-003): ruta por
// EVAL_TEXTOS (por defecto C:/dev/eval-ve-textos). Sin dependencias.
//
// Uso:
//   node scripts/verificar-citas.mjs                    publico: data/preguntas.jsonl + docs/fases/REVISION-F4.md
//   node scripts/verificar-citas.mjs --privadas         data/privadas/preguntas-privadas.jsonl + data/privadas/REVISION-privadas.md
//   node scripts/verificar-citas.mjs --solo-estructura  sin leer textos (CI): filas, longitud, ficha, norma
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizar, segmentarArticulos, articulosCitados } from './citas-lib.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
export const MIN_FRAGMENTO = 40;

// ficha de corpus/ -> archivo de texto local (Gaceta oficial servida por la AN, salvo la nota de abajo)
export const TEXTOS = {
  'tributario/cot-2020.md': 'cot.txt',
  'tributario/iva-2020.md': 'iva.txt',
  'tributario/igtf-2022.md': 'igtf2022.txt',
  'aduanas/loa-2014-reforma-2020.md': 'loa.txt',
  'mercantil/codigo-de-comercio.md': 'comercio_dl.txt', // transcripcion de tercero (ver REVISION-F2)
  'mercantil/registros-y-notarias-2021.md': 'registros.txt',
};

export function parseRevision(md) {
  const filas = [];
  for (const l of md.replace(/\r/g, '').split('\n')) {
    const m = l.match(/^\|\s*((?:trib|aduanas|mercantil)-\d{3,4})\s*\|\s*`([^`]+)`\s*\|\s*«(.+)»\s*\|\s*$/);
    if (m) filas.push({ id: m[1], ficha: m[2], fragmento: m[3] });
  }
  return filas;
}

export function nombreDeFicha(dirCorpus, ficha) {
  const ruta = join(dirCorpus, ficha);
  if (!existsSync(ruta)) return null;
  const fm = readFileSync(ruta, 'utf8').replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---/);
  const n = fm && fm[1].match(/^nombre:\s*"?([^"\n]*)"?\s*$/m);
  return n ? n[1] : null;
}

// Devuelve la lista de errores de UNA pregunta contra UNA fila.
// `texto` = contenido crudo del texto local, o null para el modo solo-estructura.
// `nombreFicha`: undefined = no comprobar; null = la ficha no existe; string = nombre esperado.
export function verificarFila({ pregunta, fila, texto, nombreFicha }) {
  const id = pregunta.id;
  if (!fila) return [`${id}: sin fila en la hoja de revision`];
  const e = [];
  if (!(fila.ficha in TEXTOS)) e.push(`${id}: la ficha ${fila.ficha} no esta en el mapa de textos`);
  if (nombreFicha === null) e.push(`${id}: la ficha ${fila.ficha} no existe en corpus/`);
  else if (nombreFicha !== undefined && nombreFicha !== pregunta.norma) e.push(`${id}: la norma de la pregunta no es la de la ficha ${fila.ficha}`);
  const frag = normalizar(fila.fragmento);
  if (frag.length < MIN_FRAGMENTO) e.push(`${id}: fragmento de ${frag.length} caracteres (minimo ${MIN_FRAGMENTO})`);
  const arts = articulosCitados(pregunta.articulo_ref);
  if (!arts.length) e.push(`${id}: no se pudo leer el numero de articulo de "${pregunta.articulo_ref}"`);
  if (texto === null || texto === undefined) return e;
  const segs = segmentarArticulos(texto);
  let encontrado = false;
  for (const n of arts) {
    const delArt = segs.filter((s) => s.n === n);
    if (!delArt.length) { e.push(`${id}: el articulo ${n} no aparece en ${TEXTOS[fila.ficha]}`); continue; }
    if (delArt.some((s) => s.texto.includes(frag))) encontrado = true;
  }
  if (arts.length && !encontrado && !e.some((x) => x.includes('no aparece en'))) {
    e.push(`${id}: el fragmento no aparece literalmente dentro del articulo citado (${arts.join(', ')})`);
  }
  return e;
}

export function verificarConjunto({ preguntas, filas, leerTexto, nombreFicha, eximir = () => false }) {
  const errores = [];
  const porId = new Map();
  for (const f of filas) {
    if (porId.has(f.id)) errores.push(`${f.id}: fila repetida`);
    porId.set(f.id, f);
  }
  const ids = new Set(preguntas.map((p) => p.id));
  for (const f of filas) if (!ids.has(f.id)) errores.push(`${f.id}: la hoja tiene una fila sin pregunta`);
  let verificadas = 0;
  for (const p of preguntas) {
    if (eximir(p)) continue;
    const fila = porId.get(p.id);
    const texto = fila && fila.ficha in TEXTOS ? leerTexto(fila.ficha) : null;
    const nf = fila ? nombreFicha(fila.ficha) : undefined;
    errores.push(...verificarFila({ pregunta: p, fila, texto, nombreFicha: nf }));
    verificadas++;
  }
  return { errores, verificadas };
}

function main() {
  const args = process.argv.slice(2);
  const privadas = args.includes('--privadas');
  const soloEstructura = args.includes('--solo-estructura');
  const dirTextos = process.env.EVAL_TEXTOS || 'C:/dev/eval-ve-textos';
  const jsonl = privadas ? join(RAIZ, 'data', 'privadas', 'preguntas-privadas.jsonl') : join(RAIZ, 'data', 'preguntas.jsonl');
  const hoja = privadas ? join(RAIZ, 'data', 'privadas', 'REVISION-privadas.md') : join(RAIZ, 'docs', 'fases', 'REVISION-F4.md');
  for (const r of [jsonl, hoja]) {
    if (!existsSync(r)) { console.error(`falta ${r}`); process.exit(privadas ? 0 : 2); }
  }
  if (!soloEstructura && !existsSync(dirTextos)) {
    console.error(`No encuentro los textos locales en ${dirTextos} (defina EVAL_TEXTOS o use --solo-estructura).`);
    process.exit(2);
  }
  const preguntas = readFileSync(jsonl, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
  const filas = parseRevision(readFileSync(hoja, 'utf8'));
  const cache = new Map();
  const leerTexto = (ficha) => {
    if (soloEstructura) return null;
    if (!cache.has(ficha)) cache.set(ficha, readFileSync(join(dirTextos, TEXTOS[ficha]), 'utf8'));
    return cache.get(ficha);
  };
  const dirCorpus = join(RAIZ, 'corpus');
  // Publico: las 30 del piloto (correlativo <= 10 por dominio) se cubren en REVISION-F2.
  const eximir = privadas ? () => false : (p) => Number(p.id.split('-')[1]) <= 10;
  const { errores, verificadas } = verificarConjunto({
    preguntas, filas, leerTexto, nombreFicha: (f) => nombreDeFicha(dirCorpus, f), eximir });
  for (const e of errores) console.error(e);
  const malas = new Set(errores.map((x) => x.split(':')[0])).size;
  console.log(`${Math.max(0, verificadas - malas)}/${verificadas} preguntas con cita verificada${soloEstructura ? ' (solo estructura)' : ''}${privadas ? ' [privadas]' : ''}`);
  process.exit(errores.length ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
