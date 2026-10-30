import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Cache } from './cache.ts';

const nueva = () => new Cache(join(mkdtempSync(join(tmpdir(), 'evalve-')), 'c'));

test('cache: fallo y luego acierto', () => {
  const c = nueva();
  const k = c.clave({ modelo: 'm', pregunta: 'trib-001' });
  assert.equal(c.leer(k), null);
  c.escribir(k, { r: 1 });
  assert.deepEqual(c.leer(k), { r: 1 });
  assert.deepEqual([c.aciertos, c.fallos], [1, 1]);
});

test('cache: el orden de las claves no cambia el hash', () => {
  const c = nueva();
  assert.equal(c.clave({ a: 1, b: { x: 1, y: 2 } }), c.clave({ b: { y: 2, x: 1 }, a: 1 }));
});

test('cache: modelo, parametros o pregunta distintos dan claves distintas', () => {
  const c = nueva();
  const base = { modelo: 'm', parametros: { max_tokens: 10 }, prompt: 'p' };
  const k = c.clave(base);
  assert.notEqual(k, c.clave({ ...base, modelo: 'otro' }));
  assert.notEqual(k, c.clave({ ...base, parametros: { max_tokens: 11 } }));
  assert.notEqual(k, c.clave({ ...base, prompt: 'q' }));
});
