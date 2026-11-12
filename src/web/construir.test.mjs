import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { construir } from '../../scripts/construir-web.mjs';

const FIX = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');

test('construir toma la corrida mas reciente valida por modelo', () => {
  const out = join(mkdtempSync(join(tmpdir(), 'evalve-')), 'datos.json');
  const avisos = [];
  const d = construir(FIX, out, (m) => avisos.push(m));
  assert.deepEqual(d.modelos.map((m) => m.alias), ['alfa', 'beta']);
  assert.equal(d.modelos.find((m) => m.alias === 'alfa').fecha, '2026-11-12_100000');
  assert.equal(d.modelos.find((m) => m.alias === 'beta').cortada, true);
  assert.equal(avisos.length, 1, 'el esquema 2 se omite con aviso');
  assert.deepEqual(JSON.parse(readFileSync(out, 'utf8')), d);
});
test('construir con results/ vacio o inexistente escribe estado vacio', () => {
  const base = mkdtempSync(join(tmpdir(), 'evalve-'));
  mkdirSync(join(base, 'results'));
  const out = join(base, 'datos.json');
  assert.deepEqual(construir(join(base, 'results'), out).modelos, []);
  assert.ok(existsSync(out));
  assert.deepEqual(construir(join(base, 'nada'), out).modelos, []);
});
