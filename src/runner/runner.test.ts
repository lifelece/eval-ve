import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Cache } from '../cache/cache.ts';
import { clienteSimulado, ok } from '../clientes/simulado.ts';
import type { Guion } from '../clientes/simulado.ts';
import { ErrorFatal, ErrorLlamada } from '../tipos.ts';
import type { ConfigModelo, Pregunta } from '../tipos.ts';
import { Presupuesto } from './presupuesto.ts';
import { construirInformes, resumenMarkdown } from './reporte.ts';
import { ejecutar } from './runner.ts';
import type { EntradaModelo } from './runner.ts';

const config: ConfigModelo = {
  proveedor: 'anthropic', id: 'sim-1', precio_usd_por_mtok: { entrada: 0.1, salida: 0.5 }, max_tokens: 500,
};
const base = { vigente: true, validado_por: null, fecha_validacion: null, norma: 'N', gaceta: 'G 6.507' };
const mc = (id: string, dificultad: 1 | 2 | 3 = 1): Pregunta => ({
  ...base, id, dominio: 'tributario', tipo: 'opcion_multiple', pregunta: `Pregunta ${id}`,
  opciones: ['Tres', 'Seis'], respuesta: 'Seis', articulo_ref: 'Artículo 55', dificultad,
});
const abierta: Pregunta = {
  ...base, id: 'aduanas-001', dominio: 'aduanas', tipo: 'abierta', pregunta: 'Explica el plazo',
  respuesta: 'Seis años', articulo_ref: 'Artículo 66', dificultad: 2,
};
const JUEZ_OK = '{"veredicto":"correcta","justificacion":"Coincide con la referencia","cita_inventada":false}';

async function entrada(alias: string, guion: Guion, id = alias): Promise<EntradaModelo & { sim: ReturnType<typeof clienteSimulado> }> {
  const sim = clienteSimulado(guion, id, { max_tokens: 500 });
  return { alias, config, cliente: sim, modeloId: await sim.preparar(), sim };
}
const nuevaCache = () => new Cache(join(mkdtempSync(join(tmpdir(), 'evalve-')), 'c'));

test('puntua opcion multiple y abierta con juez (rubrica + justificacion + cita)', async () => {
  const m = await entrada('m', (p) => ok(p.prompt.includes('Explica') ? 'Según el artículo 66, seis años.' : 'B', 100, 20));
  const j = await entrada('j', () => ok(JUEZ_OK, 300, 40));
  const r = await ejecutar({ preguntas: [mc('trib-001'), abierta], modelos: [m], juez: j, cache: nuevaCache(), presupuesto: new Presupuesto(2) });
  const [a, b] = r.modelos[0].items;
  assert.deepEqual([a.estado, a.correcta, a.letra_elegida], ['ok', true, 'B']);
  assert.equal(a.estado_juez, null); // opcion multiple: sin juez
  assert.deepEqual([b.veredicto, b.puntaje, b.cita_correcta, b.cita_inventada, b.estado_juez], ['correcta', 1, true, false, 'ok']);
  assert.equal(b.justificacion_juez, 'Coincide con la referencia');
  assert.equal(j.sim.llamadas.length, 1);
  assert.ok(r.gasto_usd > 0 && r.gasto_usd <= 2);
});

test('juez con salida invalida: queda marcado y la corrida sigue', async () => {
  const m = await entrada('m', () => ok('texto'));
  const j = await entrada('j', () => ok('no soy json'));
  const r = await ejecutar({ preguntas: [abierta], modelos: [m], juez: j, cache: nuevaCache(), presupuesto: new Presupuesto(2) });
  assert.equal(r.modelos[0].items[0].estado_juez, 'invalido');
  assert.equal(r.modelos[0].items[0].puntaje, null);
});

test('cache: la segunda corrida no hace llamadas ni gasta; cambiar el modelo si vuelve a llamar', async () => {
  const cache = nuevaCache();
  const preguntas = [mc('trib-001'), abierta];
  const guionM: Guion = (p) => ok(p.prompt.includes('Explica') ? 'artículo 66' : 'B');
  const m1 = await entrada('m', guionM);
  const j1 = await entrada('j', () => ok(JUEZ_OK));
  const r1 = await ejecutar({ preguntas, modelos: [m1], juez: j1, cache, presupuesto: new Presupuesto(2) });
  assert.equal(m1.sim.llamadas.length + j1.sim.llamadas.length, 3);

  const m2 = await entrada('m', guionM);
  const j2 = await entrada('j', () => ok(JUEZ_OK));
  const r2 = await ejecutar({ preguntas, modelos: [m2], juez: j2, cache, presupuesto: new Presupuesto(2) });
  assert.equal(m2.sim.llamadas.length + j2.sim.llamadas.length, 0);
  assert.equal(r2.gasto_usd, 0);
  assert.ok(r2.modelos[0].items.every((i) => i.desde_cache));
  assert.deepEqual(r2.modelos[0].items.map((i) => i.puntaje), r1.modelos[0].items.map((i) => i.puntaje));

  const m3 = await entrada('m', guionM, 'otro-modelo');
  await ejecutar({ preguntas: [mc('trib-001')], modelos: [m3], juez: j2, cache, presupuesto: new Presupuesto(2) });
  assert.equal(m3.sim.llamadas.length, 1);
});

test('cache: si cambia el texto de la pregunta se vuelve a llamar', async () => {
  const cache = nuevaCache();
  const m = await entrada('m', () => ok('B'));
  const j = await entrada('j', () => ok(JUEZ_OK));
  await ejecutar({ preguntas: [mc('trib-001')], modelos: [m], juez: j, cache, presupuesto: new Presupuesto(2) });
  await ejecutar({ preguntas: [{ ...mc('trib-001'), pregunta: 'Otra redaccion' }], modelos: [m], juez: j, cache, presupuesto: new Presupuesto(2) });
  assert.equal(m.sim.llamadas.length, 2);
});

test('tope de gasto: se niega a lanzar la llamada que lo superaria y nunca lo excede', async () => {
  const m = await entrada('m', () => ok('B', 1000, 500)); // costo real 0.00035 por llamada
  const j = await entrada('j', () => ok(JUEZ_OK));
  const tope = new Presupuesto(0.0007);
  const r = await ejecutar({ preguntas: [mc('trib-001'), mc('trib-002'), mc('trib-003')], modelos: [m], juez: j, cache: nuevaCache(), presupuesto: tope });
  assert.equal(m.sim.llamadas.length, 2);
  assert.deepEqual(r.modelos[0].items.map((i) => i.estado), ['ok', 'ok', 'omitida_por_tope']);
  assert.equal(r.cortada_por_tope, true);
  assert.ok(r.gasto_usd <= 0.0007);
});

test('tope cero: no se lanza ninguna llamada y los modelos siguientes tambien quedan omitidos', async () => {
  const a = await entrada('a', () => ok('B'));
  const b = await entrada('b', () => ok('B'));
  const j = await entrada('j', () => ok(JUEZ_OK));
  const r = await ejecutar({ preguntas: [mc('trib-001')], modelos: [a, b], juez: j, cache: nuevaCache(), presupuesto: new Presupuesto(0) });
  assert.equal(a.sim.llamadas.length + b.sim.llamadas.length, 0);
  assert.equal(r.modelos[1].items[0].estado, 'omitida_por_tope');
});

test('tope: si no alcanza para el juez, la pregunta queda sin juzgar y la corrida se corta', async () => {
  const m = await entrada('m', () => ok('respuesta', 100, 50));
  const j = await entrada('j', () => ok(JUEZ_OK));
  // alcanza para la respuesta (peor caso ~0.00026) pero no para sumar el peor caso del juez
  const r = await ejecutar({ preguntas: [abierta], modelos: [m], juez: j, cache: nuevaCache(), presupuesto: new Presupuesto(0.00028) });
  assert.equal(r.modelos[0].items[0].estado_juez, 'sin_tope');
  assert.equal(j.sim.llamadas.length, 0);
  assert.equal(r.cortada_por_tope, true);
});

test('refusal: se registra como rechazo, sin puntuar ni llamar al juez, y se cachea', async () => {
  const cache = nuevaCache();
  const rechazo = { estado: 'rechazo' as const, texto: '', tokens_entrada: 80, tokens_salida: 0, stop_reason: 'refusal', detalle: 'categoria=cyber' };
  const m = await entrada('m', () => rechazo);
  const j = await entrada('j', () => ok(JUEZ_OK));
  const r = await ejecutar({ preguntas: [abierta], modelos: [m], juez: j, cache, presupuesto: new Presupuesto(2) });
  const it = r.modelos[0].items[0];
  assert.deepEqual([it.estado, it.respuesta_modelo, it.puntaje, it.correcta], ['rechazo', null, null, null]);
  assert.equal(j.sim.llamadas.length, 0);
  await ejecutar({ preguntas: [abierta], modelos: [m], juez: j, cache, presupuesto: new Presupuesto(2) });
  assert.equal(m.sim.llamadas.length, 1);
});

test('error de una llamada: el item queda en error, no se cachea y la corrida sigue', async () => {
  const cache = nuevaCache();
  const m = await entrada('m', (_p, n) => (n === 1 ? new ErrorLlamada('429 agotado') : ok('B')));
  const j = await entrada('j', () => ok(JUEZ_OK));
  const preguntas = [mc('trib-001'), mc('trib-002')];
  const r = await ejecutar({ preguntas, modelos: [m], juez: j, cache, presupuesto: new Presupuesto(2) });
  assert.deepEqual(r.modelos[0].items.map((i) => i.estado), ['error', 'ok']);
  await ejecutar({ preguntas, modelos: [m], juez: j, cache, presupuesto: new Presupuesto(2) });
  assert.equal(m.sim.llamadas.length, 3); // el error se reintenta; el acierto viene de cache
});

test('error fatal (LM Studio caido): aborta con el mensaje y conserva lo ya hecho', async () => {
  const a = await entrada('a', () => ok('B'));
  const lm = await entrada('lm', (_p, n) => (n === 2 ? new ErrorFatal('LM Studio no responde. Arranca LM Studio') : ok('B')));
  const j = await entrada('j', () => ok(JUEZ_OK));
  const r = await ejecutar({ preguntas: [mc('trib-001'), mc('trib-002')], modelos: [a, lm], juez: j, cache: nuevaCache(), presupuesto: new Presupuesto(2) });
  assert.match(r.abortada ?? '', /Arranca LM Studio/);
  assert.equal(r.modelos[0].items.length, 2);
  assert.equal(r.modelos[1].items.length, 1);
});

test('reporte: metricas por modelo, dominio y dificultad, JSON y Markdown con aviso', async () => {
  const m = await entrada('m', (p) => ok(p.prompt.includes('Pregunta trib-002') ? 'A' : p.prompt.includes('Explica') ? 'artículo 66' : 'B'));
  const j = await entrada('j', () => ok('{"veredicto":"parcial","justificacion":"Incompleta","cita_inventada":true}'));
  const r = await ejecutar({
    preguntas: [mc('trib-001', 1), mc('trib-002', 3), abierta], modelos: [m], juez: j, cache: nuevaCache(), presupuesto: new Presupuesto(2),
  });
  const [inf] = construirInformes(r, { fecha: '2026-10-26_000000', archivo: 'data/x.jsonl', datasetSha: 'a'.repeat(64), preguntas: 3, validadas: 0 });
  assert.equal(inf.resumen.exactitud.valor, 0.5);
  assert.equal(inf.resumen.calidad.valor, 0.5);
  assert.equal(inf.resumen.precision_cita.valor, 1);
  assert.equal(inf.resumen.alucinacion.tasa, 1);
  assert.deepEqual(Object.keys(inf.por_dominio), ['aduanas', 'tributario']);
  assert.deepEqual(Object.keys(inf.por_dificultad), ['dificultad 1', 'dificultad 2', 'dificultad 3']);
  assert.equal(inf.por_dominio.tributario.exactitud.valor, 0.5);
  assert.ok(!JSON.stringify(inf).includes('sk-ant'));
  const md = resumenMarkdown([inf]);
  assert.match(md, /NO es asesoria legal/);
  assert.match(md, /### Por dominio/);
  assert.match(md, /### Por dificultad/);
  assert.match(md, /50\.0% \(1\/2\)/);
});
