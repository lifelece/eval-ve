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
