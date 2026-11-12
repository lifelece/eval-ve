import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRevision, verificarFila, verificarConjunto } from './verificar-citas.mjs';
import { segmentarArticulos, articulosCitados, normalizar } from './citas-lib.mjs';

const TEXTO = [
  'Artículo 1°. Esta ley regula los tributos nacionales en todo el territorio de la República.',
  'Artículo 2°. Las mercancías deberán ser declaradas dentro del plazo que fije la Administración',
  'Aduanera, so pena de abandono legal de las mismas.',
  'Artículo 3°. Otro artículo distinto con texto propio y suficiente para las pruebas.',
].join('\n');
const FICHA = 'aduanas/loa-2014-reforma-2020.md';
const preg = (o = {}) => ({ id: 'aduanas-011', norma: 'N', articulo_ref: 'Artículo 2', ...o });
const fila = (f) => ({ id: 'aduanas-011', ficha: FICHA, fragmento: f });
const FRAG = 'Las mercancías deberán ser declaradas dentro del plazo que fije la Administración Aduanera';

test('segmenta articulos y normaliza saltos de linea', () => {
  const s = segmentarArticulos(TEXTO);
  assert.deepEqual(s.map((x) => x.n), [1, 2, 3]);
  assert.ok(s[1].texto.includes('la Administración Aduanera, so pena'));
});
test('articulosCitados lee uno, varios y numerales', () => {
  assert.deepEqual(articulosCitados('Artículo 55, numeral 1'), [55]);
  assert.deepEqual(articulosCitados('Artículos 14 y 15'), [14, 15]);
  assert.deepEqual(articulosCitados('sin articulo'), []);
});
test('fragmento literal dentro del articulo citado: sin errores', () => {
  assert.deepEqual(verificarFila({ pregunta: preg(), fila: fila(FRAG), texto: TEXTO, nombreFicha: 'N' }), []);
});
test('fragmento que no existe en el texto falla', () => {
  const e = verificarFila({ pregunta: preg(), fila: fila('Las mercancías podrán declararse en cualquier momento sin plazo alguno'), texto: TEXTO, nombreFicha: 'N' });
  assert.ok(e.some((x) => x.includes('no aparece literalmente')));
});
test('fragmento de otro articulo falla (articulo citado distinto)', () => {
  const e = verificarFila({ pregunta: preg({ articulo_ref: 'Artículo 3' }), fila: fila(FRAG), texto: TEXTO, nombreFicha: 'N' });
  assert.ok(e.length);
});
test('articulo citado que no esta en el texto falla', () => {
  const e = verificarFila({ pregunta: preg({ articulo_ref: 'Artículo 99' }), fila: fila(FRAG), texto: TEXTO, nombreFicha: 'N' });
  assert.ok(e.some((x) => x.includes('articulo 99 no aparece')));
});
test('fragmento de menos de 40 caracteres falla', () => {
  const e = verificarFila({ pregunta: preg(), fila: fila('Las mercancías deberán ser declaradas'), texto: TEXTO, nombreFicha: 'N' });
  assert.ok(e.some((x) => x.includes('minimo 40')));
});
test('norma distinta a la de la ficha falla', () => {
  const e = verificarFila({ pregunta: preg(), fila: fila(FRAG), texto: TEXTO, nombreFicha: 'Otra norma' });
  assert.ok(e.some((x) => x.includes('no es la de la ficha')));
});
test('ficha fuera del mapa o inexistente falla', () => {
  assert.ok(verificarFila({ pregunta: preg(), fila: { id: 'aduanas-011', ficha: 'x/y.md', fragmento: FRAG }, texto: null, nombreFicha: 'N' }).length);
  assert.ok(verificarFila({ pregunta: preg(), fila: fila(FRAG), texto: null, nombreFicha: null }).length);
});
test('solo estructura (texto null) no lee el texto pero exige fragmento largo', () => {
  assert.deepEqual(verificarFila({ pregunta: preg(), fila: fila(FRAG), texto: null, nombreFicha: 'N' }), []);
  assert.ok(verificarFila({ pregunta: preg(), fila: fila('corto'), texto: null, nombreFicha: 'N' }).length);
});
test('parseRevision lee filas de tabla y el conjunto exige una fila por pregunta', () => {
  const md = `| id | ficha | fragmento |\n|---|---|---|\n| aduanas-011 | \`${FICHA}\` | «${FRAG}» |\n`;
  const filas = parseRevision(md);
  assert.equal(filas.length, 1);
  const ok = verificarConjunto({ preguntas: [preg()], filas, leerTexto: () => TEXTO, nombreFicha: () => 'N' });
  assert.deepEqual(ok.errores, []);
  const sinFila = verificarConjunto({ preguntas: [preg(), preg({ id: 'aduanas-012' })], filas, leerTexto: () => TEXTO, nombreFicha: () => 'N' });
  assert.ok(sinFila.errores.some((x) => x.includes('aduanas-012') && x.includes('sin fila')));
  const huerfana = verificarConjunto({ preguntas: [], filas, leerTexto: () => TEXTO, nombreFicha: () => 'N' });
  assert.ok(huerfana.errores.some((x) => x.includes('fila sin pregunta')));
});
test('eximir salta preguntas del piloto', () => {
  const r = verificarConjunto({ preguntas: [preg({ id: 'aduanas-005' })], filas: [], leerTexto: () => TEXTO, nombreFicha: () => 'N', eximir: () => true });
  assert.deepEqual(r.errores, []);
});
test('normalizar unifica comillas, guiones y espacios', () => {
  assert.equal(normalizar('“a”  —\n b'), '"a" - b');
});
