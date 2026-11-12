// Validador minimo de data/preguntas.jsonl contra schema/pregunta.schema.json.
// Sin dependencias (nada nuevo sin ADR). Cubre las reglas del esquema (ADR-001) y
// tres controles de F2: ids unicos, prefijo de id coherente con el dominio y
// trazabilidad contra corpus/ (norma = nombre de una ficha con vigente: si y la
// Gaceta de la pregunta contiene el numero de la ficha).
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CAMPOS = ['id', 'dominio', 'tipo', 'pregunta', 'opciones', 'respuesta', 'articulo_ref', 'norma',
  'gaceta', 'dificultad', 'vigente', 'reemplazada_por', 'validado_por', 'fecha_validacion'];
const REQUERIDOS = ['id', 'dominio', 'tipo', 'pregunta', 'respuesta', 'articulo_ref', 'norma', 'gaceta',
  'dificultad', 'vigente', 'validado_por', 'fecha_validacion'];
const PREFIJO = { tributario: 'trib', aduanas: 'aduanas', mercantil: 'mercantil' };

// Repartos esperados por modo. piloto = F2 (30), escala = F4 (150), privadas = control de contaminacion (30).
export const ESPERADOS = {
  piloto: { tributario: 10, aduanas: 10, mercantil: 10 },
  escala: { tributario: 50, aduanas: 50, mercantil: 50 },
  privadas: { tributario: 10, aduanas: 10, mercantil: 10 },
};

const esTexto = (v) => typeof v === 'string' && v.trim().length > 0;

export function validarPregunta(p) {
  const e = [];
  if (p === null || typeof p !== 'object' || Array.isArray(p)) return ['no es un objeto'];
  for (const k of Object.keys(p)) if (!CAMPOS.includes(k)) e.push(`campo no permitido: ${k}`);
  for (const k of REQUERIDOS) if (!(k in p)) e.push(`falta campo obligatorio: ${k}`);
  if ('id' in p && !(typeof p.id === 'string' && /^(trib|aduanas|mercantil)-[0-9]{3,4}$/.test(p.id))) e.push('id con formato invalido');
  if ('dominio' in p && !Object.keys(PREFIJO).includes(p.dominio)) e.push('dominio invalido');
  if (typeof p.id === 'string' && PREFIJO[p.dominio] && !p.id.startsWith(PREFIJO[p.dominio] + '-')) e.push('prefijo de id no coincide con el dominio');
  if ('tipo' in p && !['opcion_multiple', 'abierta'].includes(p.tipo)) e.push('tipo invalido');
  for (const k of ['pregunta', 'respuesta', 'articulo_ref', 'norma', 'gaceta']) if (k in p && !esTexto(p[k])) e.push(`${k} vacio o no es texto`);
  if ('dificultad' in p && !(Number.isInteger(p.dificultad) && p.dificultad >= 1 && p.dificultad <= 3)) e.push('dificultad fuera de 1-3');
  if ('vigente' in p && typeof p.vigente !== 'boolean') e.push('vigente debe ser booleano');
  if (p.tipo === 'opcion_multiple') {
    if (!Array.isArray(p.opciones)) e.push('opcion_multiple exige opciones');
    else {
      if (p.opciones.length < 2 || p.opciones.length > 6) e.push('opciones: entre 2 y 6');
      if (!p.opciones.every(esTexto)) e.push('opciones: textos no vacios');
      if (new Set(p.opciones).size !== p.opciones.length) e.push('opciones duplicadas');
      if (!p.opciones.includes(p.respuesta)) e.push('respuesta no aparece literal en opciones');
    }
  } else if (p.tipo === 'abierta' && 'opciones' in p) e.push('abierta no lleva opciones');
  if ('validado_por' in p && ![null, 'Luis Carlos Vasquez'].includes(p.validado_por)) e.push('validado_por solo puede ser null o Luis Carlos Vasquez');
  if ('fecha_validacion' in p && p.fecha_validacion !== null && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(p.fecha_validacion)) e.push('fecha_validacion no es AAAA-MM-DD');
  if (p.validado_por === null && p.fecha_validacion !== null) e.push('fecha_validacion debe ser null si validado_por es null');
  if (p.validado_por && p.fecha_validacion === null) e.push('validado_por lleno exige fecha_validacion');
  if (p.vigente === true && p.reemplazada_por) e.push('reemplazada_por solo aplica con vigente=false');
  return e;
}

export function cargarFichas(dirCorpus = join(RAIZ, 'corpus')) {
  const fichas = [];
  for (const dom of readdirSync(dirCorpus, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const f of readdirSync(join(dirCorpus, dom.name)).filter((n) => n.endsWith('.md'))) {
      const fm = readFileSync(join(dirCorpus, dom.name, f), 'utf8').replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---/);
      if (!fm) continue;
      const g = (k) => (fm[1].match(new RegExp(`^${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm')) || [])[1];
      fichas.push({ nombre: g('nombre'), dominio: g('dominio'), gaceta_numero: g('gaceta_numero'), vigente: g('vigente') });
    }
  }
  return fichas;
}

export function validarCorpus(p, fichas) {
  const f = fichas.find((x) => x.nombre === p.norma && x.dominio === p.dominio);
  if (!f) return ['norma no coincide con el nombre de ninguna ficha de corpus/ de ese dominio'];
  const e = [];
  if (f.vigente !== 'si') e.push(`la ficha de la norma no es vigente: si (${f.vigente})`);
  if (!String(p.gaceta).includes(f.gaceta_numero)) e.push(`la Gaceta no contiene el numero de la ficha (${f.gaceta_numero})`);
  return e;
}

// Sesgo de longitud: si la correcta es casi siempre la mas larga (o la mas corta), un modelo
// acierta sin saber derecho. Solo opcion multiple fuera del piloto (correlativo > 10).
export const UMBRAL_SESGO = 0.35;
export function sesgoLongitud(preguntas) {
  const om = preguntas.filter((p) => p && p.tipo === 'opcion_multiple' && Array.isArray(p.opciones)
    && Number(String(p.id).split('-')[1]) > 10 && p.opciones.includes(p.respuesta));
  if (!om.length) return [];
  let larga = 0, corta = 0;
  for (const p of om) {
    const otras = p.opciones.filter((o) => o !== p.respuesta).map((o) => o.length);
    if (p.respuesta.length > Math.max(...otras)) larga++;
    if (p.respuesta.length < Math.min(...otras)) corta++;
  }
  const e = [];
  const pct = (n) => `${n}/${om.length} (${Math.round((100 * n) / om.length)} %)`;
  if (larga / om.length > UMBRAL_SESGO) e.push(`sesgo de longitud: la correcta es estrictamente la mas larga en ${pct(larga)}; maximo ${UMBRAL_SESGO * 100} %`);
  if (corta / om.length > UMBRAL_SESGO) e.push(`sesgo de longitud: la correcta es estrictamente la mas corta en ${pct(corta)}; maximo ${UMBRAL_SESGO * 100} %`);
  return e;
}

export function validarLineas(texto, { fichas = null, esperado = null, sesgo = false } = {}) {
  const resultados = [];
  const ids = new Set();
  const conteo = {};
  const todas = [];
  texto.split('\n').filter((l) => l.trim()).forEach((linea, i) => {
    let p;
    try { p = JSON.parse(linea); } catch { resultados.push({ linea: i + 1, id: '?', errores: ['JSON invalido'] }); return; }
    const errores = validarPregunta(p);
    if (ids.has(p.id)) errores.push('id repetido');
    ids.add(p.id);
    todas.push(p);
    if (fichas) errores.push(...validarCorpus(p, fichas));
    conteo[p.dominio] = (conteo[p.dominio] || 0) + 1;
    resultados.push({ linea: i + 1, id: p.id, errores });
  });
  const globales = [];
  if (esperado) for (const [d, n] of Object.entries(esperado)) if ((conteo[d] || 0) !== n) globales.push(`${d}: ${conteo[d] || 0} preguntas, se esperaban ${n}`);
  if (sesgo) globales.push(...sesgoLongitud(todas));
  return { resultados, conteo, globales };
}

// Una pregunta privada no puede repetir el id ni el enunciado de una publica (control de contaminacion).
export function colisiones(textoPrivado, textoPublico) {
  const leer = (t) => t.split('\n').filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return {}; } });
  const pub = leer(textoPublico);
  const ids = new Set(pub.map((p) => p.id));
  const enunciados = new Set(pub.map((p) => String(p.pregunta || '').trim().toLowerCase()));
  const e = [];
  for (const p of leer(textoPrivado)) {
    if (ids.has(p.id)) e.push(`${p.id}: el id ya existe en el dataset publico`);
    if (enunciados.has(String(p.pregunta || '').trim().toLowerCase())) e.push(`${p.id}: el enunciado repite el de una pregunta publica`);
  }
  return e;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const modo = args.includes('--privadas') ? 'privadas' : args.includes('--escala') ? 'escala' : args.includes('--piloto') ? 'piloto' : null;
  const porDefecto = modo === 'privadas' ? join(RAIZ, 'data', 'privadas', 'preguntas-privadas.jsonl') : join(RAIZ, 'data', 'preguntas.jsonl');
  const archivo = args.find((a) => !a.startsWith('--')) || porDefecto;
  const { resultados, conteo, globales } = validarLineas(readFileSync(archivo, 'utf8'), {
    fichas: cargarFichas(), esperado: modo ? ESPERADOS[modo] : null, sesgo: modo === 'escala' || modo === 'privadas' });
  if (modo === 'privadas') globales.push(...colisiones(readFileSync(archivo, 'utf8'), readFileSync(join(RAIZ, 'data', 'preguntas.jsonl'), 'utf8')));
  let malas = 0;
  for (const r of resultados) if (r.errores.length) { malas++; console.error(`${r.id} (linea ${r.linea}): ${r.errores.join('; ')}`); }
  for (const g of globales) console.error(`GLOBAL: ${g}`);
  console.log(`${resultados.length - malas}/${resultados.length} validas; reparto ${JSON.stringify(conteo)}${modo ? ` [modo ${modo}]` : ''}`);
  process.exit(malas || globales.length ? 1 : 0);
}
