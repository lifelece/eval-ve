import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sellar } from './sellar-validacion.mjs';

const q = (id, validado = null) =>
  JSON.stringify({ id, pregunta: 'x', validado_por: validado, fecha_validacion: validado ? '2026-10-26' : null });
const base = [q('trib-001'), q('trib-011'), q('aduanas-010'), q('mercantil-040', 'Luis Carlos Vasquez'), ''];
const leer = (l) => JSON.parse(l);

test('sellar: por ids, solo esas y con el nombre y la fecha', () => {
  const { lineas, sellados } = sellar(base, { ids: ['trib-011'], fecha: '2026-11-12' });
  assert.deepEqual(sellados, ['trib-011']);
  assert.equal(leer(lineas[1]).validado_por, 'Luis Carlos Vasquez');
  assert.equal(leer(lineas[1]).fecha_validacion, '2026-11-12');
  assert.equal(leer(lineas[0]).validado_por, null);
  assert.equal(lineas[4], '');
});

test('sellar: --piloto toma los correlativos 1 a 10; --todas no pisa un sello previo', () => {
  assert.deepEqual(sellar(base, { piloto: true, fecha: '2026-10-26' }).sellados, ['trib-001', 'aduanas-010']);
  const r = sellar(base, { todas: true, fecha: '2026-11-12' });
  assert.deepEqual(r.sellados, ['trib-001', 'trib-011', 'aduanas-010']);
  assert.equal(leer(r.lineas[3]).fecha_validacion, '2026-10-26');
});

test('sellar: fecha invalida o id inexistente es error; sin seleccion no sella nada', () => {
  assert.throws(() => sellar(base, { todas: true, fecha: '12/11/2026' }), /AAAA-MM-DD/);
  assert.throws(() => sellar(base, { ids: ['trib-999'], fecha: '2026-11-12' }), /no existen/);
  assert.deepEqual(sellar(base, { fecha: '2026-11-12' }).sellados, []);
});
