import { test } from 'node:test';
import assert from 'node:assert/strict';
import { puntajeGlobal, posiciones, construirDatos } from '../../web/logica.mjs';

const res = (a, nMc, v, nJ) => ({
  exactitud: { n: nMc, aciertos: a, valor: nMc ? a / nMc : null },
  calidad: { n: nJ, valor: v },
});

test('puntajeGlobal pondera MC y abiertas por n', () => {
  assert.equal(puntajeGlobal(res(18, 20, 0.7, 10)), (18 + 7) / 30);
});
test('puntajeGlobal con solo MC o solo abiertas', () => {
  assert.equal(puntajeGlobal(res(6, 12, null, 0)), 0.5);
  assert.equal(puntajeGlobal(res(0, 0, 0.5, 4)), 0.5);
});
test('puntajeGlobal sin datos es null', () => {
  assert.equal(puntajeGlobal(res(0, 0, null, 0)), null);
  assert.equal(puntajeGlobal(undefined), null);
});
test('posiciones: orden descendente, empates comparten puesto, null al final sin puesto', () => {
  const r = posiciones([
    { alias: 'c', valor: null },
    { alias: 'a', valor: 0.8 },
    { alias: 'b', valor: 0.8 },
    { alias: 'd', valor: 0.5 },
  ]);
  assert.deepEqual(r.map((x) => [x.alias, x.puesto]), [['a', 1], ['b', 1], ['d', 3], ['c', null]]);
});
test('posiciones no muta la entrada', () => {
  const e = [{ alias: 'x', valor: 0.1 }, { alias: 'y', valor: 0.9 }];
  posiciones(e);
  assert.equal(e[0].alias, 'x');
});
test('construirDatos con 0 informes da estado vacio', () => {
  const d = construirDatos([]);
  assert.deepEqual(d.modelos, []);
  assert.deepEqual(d.dominios, []);
  assert.equal(d.fecha, null);
});
test('construirDatos agrega modelos, dominios y metadatos', () => {
  const inf = (alias, v, fecha, dom) => ({
    esquema_version: 1, fecha, modelo: { alias, proveedor: 'p', id: 'id-' + alias }, juez: { id: 'j' },
    dataset: { sha256: 'abc', preguntas: 30, validadas_por_luis: 24 },
    cortada_por_tope: false, abortada: null,
    resumen: { n: 30, respondidas: 30, ...res(v, 10, null, 0), precision_cita: { valor: null }, alucinacion: { tasa: null } },
    por_dominio: dom,
  });
  const d = construirDatos([
    inf('b', 5, '2026-11-12_090000', { mercantil: { n: 10, ...res(5, 10, null, 0) } }),
    inf('a', 9, '2026-11-12_100000', { mercantil: { n: 10, ...res(9, 10, null, 0) }, aduanas: { n: 5, ...res(1, 5, null, 0) } }),
  ]);
  assert.deepEqual(d.modelos.map((m) => m.alias), ['a', 'b']);
  assert.deepEqual(d.dominios, ['aduanas', 'mercantil']);
  assert.equal(d.fecha, '2026-11-12_100000');
  assert.equal(d.modelos[0].global, 0.9);
  assert.equal(d.modelos[0].puesto, 1);
  assert.equal(d.modelos[0].dominios.mercantil.valor, 0.9);
  assert.equal(d.modelos[0].dominios.mercantil.puesto, 1);
  assert.equal(d.modelos[1].dominios.mercantil.puesto, 2);
  assert.equal(d.modelos[1].dominios.aduanas, undefined);
  assert.equal(d.modelos[0].validadas, 24);
  assert.equal(d.juez, 'j');
});
