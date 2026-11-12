import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearClienteLmStudio } from './lmstudio.ts';
import { ErrorFatal, ErrorLlamada } from '../tipos.ts';
import type { ConfigModelo } from '../tipos.ts';

const config: ConfigModelo = {
  proveedor: 'lmstudio',
  id: 'x',
  precio_usd_por_mtok: { entrada: 0, salida: 0 },
  max_tokens: 100,
  temperature: 0,
};
const pet = { system: 'S', prompt: 'P' };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status });
const modelos = (...ids: string[]) => json({ data: ids.map((id) => ({ id })) });
const chat = (content: string, finish = 'stop') =>
  json({ choices: [{ message: { content }, finish_reason: finish }], usage: { prompt_tokens: 7, completion_tokens: 2 } });

function fetchCon(...rs: (Response | Error)[]) {
  const urls: string[] = [];
  const f = (async (url: string) => {
    urls.push(url);
    const r = rs.shift();
    if (!r) throw new Error('sin mas respuestas simuladas');
    if (r instanceof Error) throw r;
    return r;
  }) as unknown as typeof fetch;
  return { f, urls };
}

test('lmstudio caido: mensaje claro de arrancar LM Studio y error fatal', async () => {
  const { f } = fetchCon(Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } }));
  const c = crearClienteLmStudio(config, { fetch: f, env: {} });
  await assert.rejects(c.preparar(), (e: unknown) => {
    assert.ok(e instanceof ErrorFatal);
    assert.match(e.message, /Arranca LM Studio/);
    assert.match(e.message, /localhost:1234\/v1/);
    return true;
  });
});

test('lmstudio: descubre el modelo, usa LMSTUDIO_BASE_URL y devuelve texto y tokens', async () => {
  const { f, urls } = fetchCon(modelos('qwen-7b'), chat('A'));
  const c = crearClienteLmStudio(config, { fetch: f, env: { LMSTUDIO_BASE_URL: 'http://otro:9/v1/' } });
  assert.equal(await c.preparar(), 'qwen-7b');
  const r = await c.generar(pet);
  assert.deepEqual([r.estado, r.texto, r.tokens_entrada, r.tokens_salida], ['ok', 'A', 7, 2]);
  assert.deepEqual(urls, ['http://otro:9/v1/models', 'http://otro:9/v1/chat/completions']);
});

test('lmstudio: varios modelos exigen LMSTUDIO_MODEL; ninguno pide cargar uno', async () => {
  await assert.rejects(crearClienteLmStudio(config, { fetch: fetchCon(modelos('a', 'b')).f, env: {} }).preparar(), /LMSTUDIO_MODEL/);
  assert.equal(await crearClienteLmStudio(config, { fetch: fetchCon(modelos('a', 'b')).f, env: { LMSTUDIO_MODEL: 'b' } }).preparar(), 'b');
  await assert.rejects(crearClienteLmStudio(config, { fetch: fetchCon(modelos()).f, env: {} }).preparar(), /Carga uno/);
});

test('lmstudio: 429 reintenta; quita bloques think; texto vacio es ErrorLlamada', async () => {
  const esperas: number[] = [];
  const { f } = fetchCon(modelos('m'), json({}, 429), chat('<think>mmm</think>B'), chat('', 'length'));
  const c = crearClienteLmStudio(config, { fetch: f, env: {}, esperar: async (ms) => void esperas.push(ms) });
  await c.preparar();
  assert.equal((await c.generar(pet)).texto, 'B');
  assert.deepEqual(esperas, [1000]);
  await assert.rejects(c.generar(pet), ErrorLlamada);
});

test('lmstudio: caida a mitad de corrida tambien es fatal con el mismo mensaje', async () => {
  const { f } = fetchCon(modelos('m'), new TypeError('fetch failed'));
  const c = crearClienteLmStudio(config, { fetch: f, env: {} });
  await c.preparar();
  await assert.rejects(c.generar(pet), /Arranca LM Studio/);
});

test('lmstudio: un id concreto en la config elige el modelo (varios locales en una corrida); un id que el servidor no lista no cuenta', async () => {
  const fijo = { ...config, id: 'b' };
  assert.equal(await crearClienteLmStudio(fijo, { fetch: fetchCon(modelos('a', 'b')).f, env: { LMSTUDIO_MODEL: 'a' } }).preparar(), 'b');
  await assert.rejects(crearClienteLmStudio({ ...config, id: 'z' }, { fetch: fetchCon(modelos('a', 'b')).f, env: {} }).preparar(), /LMSTUDIO_MODEL/);
  const marcador = { ...config, id: '[modelo_cargado_en_lm_studio]' };
  assert.equal(await crearClienteLmStudio(marcador, { fetch: fetchCon(modelos('a', 'b')).f, env: { LMSTUDIO_MODEL: 'a' } }).preparar(), 'a');
});
