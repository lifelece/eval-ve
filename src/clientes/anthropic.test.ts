import { test } from 'node:test';
import assert from 'node:assert/strict';
import Anthropic from '@anthropic-ai/sdk';
import { crearClienteAnthropic } from './anthropic.ts';
import type { SdkMensajes } from './anthropic.ts';
import { ErrorFatal, ErrorLlamada } from '../tipos.ts';
import type { ConfigModelo } from '../tipos.ts';

const config: ConfigModelo = {
  proveedor: 'anthropic',
  id: 'claude-haiku-5-5',
  precio_usd_por_mtok: { entrada: 0.1, salida: 0.5 },
  max_tokens: 500,
  effort: 'low',
};
const pet = { system: 'S', prompt: 'P' };

function mensaje(extra: Record<string, unknown>): Anthropic.Message {
  return {
    id: 'msg_1',
    type: 'message',
    role: 'assistant',
    model: 'claude-haiku-5-5',
    content: [{ type: 'text', text: 'B' }],
    stop_reason: 'end_turn',
    stop_details: null,
    usage: { input_tokens: 10, output_tokens: 3 },
    ...extra,
  } as unknown as Anthropic.Message;
}

function sdkCon(respuestas: (Anthropic.Message | Error)[]): SdkMensajes & { params: unknown[] } {
  const params: unknown[] = [];
  return {
    params,
    messages: {
      async create(p) {
        params.push(p);
        const r = respuestas.shift();
        if (!r) throw new Error('sin mas respuestas simuladas');
        if (r instanceof Error) throw r;
        return r;
      },
    },
  };
}
const limite = () => new Anthropic.RateLimitError(429, undefined, 'rate limited', new Headers());

async function listo(sdk: SdkMensajes, esperas: number[] = []) {
  const c = crearClienteAnthropic(config, { sdk, esperar: async (ms) => void esperas.push(ms) });
  assert.equal(await c.preparar(), 'claude-haiku-5-5');
  return c;
}

test('anthropic: respuesta ok, sin temperature/top_p/top_k y con effort explicito', async () => {
  const sdk = sdkCon([mensaje({})]);
  const r = await (await listo(sdk)).generar(pet);
  assert.deepEqual([r.estado, r.texto, r.tokens_entrada, r.tokens_salida], ['ok', 'B', 10, 3]);
  const p = sdk.params[0] as Record<string, unknown>;
  assert.equal(p.model, 'claude-haiku-5-5');
  assert.deepEqual(p.output_config, { effort: 'low' });
  for (const k of ['temperature', 'top_p', 'top_k']) assert.ok(!(k in p), `${k} no debe enviarse`);
});

test('anthropic: stop_reason refusal se registra como rechazo, no como respuesta', async () => {
  const sdk = sdkCon([
    mensaje({ content: [], stop_reason: 'refusal', stop_details: { type: 'refusal', category: 'cyber', explanation: 'x' } }),
  ]);
  const r = await (await listo(sdk)).generar(pet);
  assert.equal(r.estado, 'rechazo');
  assert.equal(r.texto, '');
  assert.match(r.detalle ?? '', /cyber/);
});

test('anthropic: 429 reintenta con backoff y luego acierta', async () => {
  const esperas: number[] = [];
  const sdk = sdkCon([limite(), limite(), mensaje({})]);
  const r = await (await listo(sdk, esperas)).generar(pet);
  assert.equal(r.estado, 'ok');
  assert.equal(sdk.params.length, 3);
  assert.deepEqual(esperas, [2000, 4000]);
});

test('anthropic: 429 persistente agota reintentos y queda como ErrorLlamada', async () => {
  const sdk = sdkCon(Array.from({ length: 6 }, () => limite()));
  const c = crearClienteAnthropic(config, { sdk, esperar: async () => {}, reintentos: 2 });
  await c.preparar();
  await assert.rejects(c.generar(pet), ErrorLlamada);
  assert.equal(sdk.params.length, 3);
});

test('anthropic: 401 es fatal y no reintenta', async () => {
  const sdk = sdkCon([new Anthropic.AuthenticationError(401, undefined, 'bad key', new Headers())]);
  await assert.rejects((await listo(sdk)).generar(pet), ErrorFatal);
  assert.equal(sdk.params.length, 1);
});

test('anthropic: sin ANTHROPIC_API_KEY falla antes de gastar', async () => {
  const c = crearClienteAnthropic(config, { env: {} });
  await assert.rejects(c.preparar(), /ANTHROPIC_API_KEY/);
});
