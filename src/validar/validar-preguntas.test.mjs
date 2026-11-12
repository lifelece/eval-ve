import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarPregunta, validarCorpus, validarLineas } from './validar-preguntas.mjs';

const base = () => ({ id: 'trib-001', dominio: 'tributario', tipo: 'opcion_multiple', pregunta: 'P?',
  opciones: ['a', 'b'], respuesta: 'a', articulo_ref: 'Artículo 1', norma: 'N', gaceta: 'G 6.507',
  dificultad: 2, vigente: true, validado_por: null, fecha_validacion: null });

test('pregunta valida pasa', () => assert.deepEqual(validarPregunta(base()), []));
test('respuesta fuera de opciones falla', () => assert.ok(validarPregunta({ ...base(), respuesta: 'z' }).length));
test('falta gaceta falla', () => { const p = base(); delete p.gaceta; assert.ok(validarPregunta(p).length); });
test('campo extra falla', () => assert.ok(validarPregunta({ ...base(), extra: 1 }).length));
test('abierta con opciones falla', () => assert.ok(validarPregunta({ ...base(), tipo: 'abierta' }).length));
test('dificultad 4 falla', () => assert.ok(validarPregunta({ ...base(), dificultad: 4 }).length));
test('prefijo distinto al dominio falla', () => assert.ok(validarPregunta({ ...base(), dominio: 'aduanas' }).length));
test('validado_por distinto de Luis falla', () => assert.ok(validarPregunta({ ...base(), validado_por: 'Claude' }).length));
test('fecha con validado_por null falla', () => assert.ok(validarPregunta({ ...base(), fecha_validacion: '2026-10-26' }).length));
test('corpus: norma y gaceta coherentes', () => {
  const fichas = [{ nombre: 'N', dominio: 'tributario', gaceta_numero: '6.507', vigente: 'si' }];
  assert.deepEqual(validarCorpus(base(), fichas), []);
  assert.ok(validarCorpus({ ...base(), norma: 'X' }, fichas).length);
  assert.ok(validarCorpus({ ...base(), gaceta: 'G 1' }, fichas).length);
  assert.ok(validarCorpus(base(), [{ ...fichas[0], vigente: 'dudosa' }]).length);
});
test('ids repetidos y reparto', () => {
  const l = JSON.stringify(base());
  const r = validarLineas(`${l}\n${l}`, { esperado: { tributario: 2 } });
  assert.ok(r.resultados[1].errores.includes('id repetido'));
  assert.deepEqual(r.globales, []);
});

// --- F4: modo escala (150) y modo privadas (30) ---
import { ESPERADOS, colisiones } from './validar-preguntas.mjs';

const mk = (id, dominio, extra = {}) => JSON.stringify({ ...base(), id, dominio, pregunta: `P ${id}`, ...extra });
const lote = (prefijo, dominio, n, desde = 1) =>
  Array.from({ length: n }, (_, i) => mk(`${prefijo}-${String(desde + i).padStart(3, '0')}`, dominio)).join('\n');

test('ESPERADOS: piloto 10/10/10, escala 50/50/50, privadas 10/10/10', () => {
  assert.deepEqual(ESPERADOS.piloto, { tributario: 10, aduanas: 10, mercantil: 10 });
  assert.deepEqual(ESPERADOS.escala, { tributario: 50, aduanas: 50, mercantil: 50 });
  assert.deepEqual(ESPERADOS.privadas, { tributario: 10, aduanas: 10, mercantil: 10 });
});
test('escala: 50/50/50 sin errores globales; 49 en un dominio falla', () => {
  const ok = [lote('trib', 'tributario', 50), lote('aduanas', 'aduanas', 50), lote('mercantil', 'mercantil', 50)].join('\n');
  assert.deepEqual(validarLineas(ok, { esperado: ESPERADOS.escala }).globales, []);
  const mal = [lote('trib', 'tributario', 49), lote('aduanas', 'aduanas', 50), lote('mercantil', 'mercantil', 50)].join('\n');
  assert.equal(validarLineas(mal, { esperado: ESPERADOS.escala }).globales.length, 1);
});
test('el modo piloto sigue exigiendo 10/10/10 (no se rompe)', () => {
  const treinta = [lote('trib', 'tributario', 10), lote('aduanas', 'aduanas', 10), lote('mercantil', 'mercantil', 10)].join('\n');
  assert.deepEqual(validarLineas(treinta, { esperado: ESPERADOS.piloto }).globales, []);
  assert.ok(validarLineas(treinta, { esperado: ESPERADOS.escala }).globales.length);
});
test('colisiones: id repetido o enunciado repetido entre privadas y publicas', () => {
  const pub = [mk('trib-001', 'tributario'), mk('aduanas-001', 'aduanas')].join('\n');
  const privOk = mk('trib-9001', 'tributario');
  assert.deepEqual(colisiones(privOk, pub), []);
  assert.ok(colisiones(mk('trib-001', 'tributario', { pregunta: 'otra' }), pub).some((e) => e.includes('id')));
  assert.ok(colisiones(mk('trib-9002', 'tributario', { pregunta: 'P trib-001' }), pub).some((e) => e.includes('enunciado')));
});
