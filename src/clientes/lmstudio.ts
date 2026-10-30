// Cliente de LM Studio: servidor LOCAL con API compatible con OpenAI (POST /chat/completions,
// GET /models) en LMSTUDIO_BASE_URL (por defecto http://localhost:1234/v1).
// Por que `fetch` y no un SDK: no es un proveedor de pago ni remoto, solo dos endpoints HTTP;
// el SDK de OpenAI seria una dependencia nueva sin beneficio y Luis descarto otros proveedores
// (ADR-004). Solo fetch nativo de Node.
import type { Cliente, ConfigModelo, PeticionModelo, RespuestaModelo } from '../tipos.ts';
import { ErrorFatal, ErrorLlamada } from '../tipos.ts';
import { conReintento, esperarReal } from './reintento.ts';
import type { Esperar } from './reintento.ts';

export interface OpcionesLmStudio {
  fetch?: typeof fetch;
  esperar?: Esperar;
  env?: Record<string, string | undefined>;
  reintentos?: number;
}

class ErrorHttpReintentable extends Error {}

export function crearClienteLmStudio(config: ConfigModelo, op: OpcionesLmStudio = {}): Cliente {
  const env = op.env ?? process.env;
  const f = op.fetch ?? fetch;
  const esperar = op.esperar ?? esperarReal;
  const base = (env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1').replace(/\/+$/, '');
  const timeoutMs = Number(env.LMSTUDIO_TIMEOUT_MS) || 300_000; // modelos chicos en 8 GB: lentos
  let modeloId: string | null = null;

  const caido = (): ErrorFatal =>
    new ErrorFatal(
      `LM Studio no responde en ${base}. Arranca LM Studio, carga un modelo y activa el servidor local (pestana Developer > Start Server).`,
    );

  async function pedir(ruta: string, init?: RequestInit): Promise<Response> {
    try {
      return await f(`${base}${ruta}`, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    } catch {
      throw caido();
    }
  }

  return {
    async preparar() {
      const r = await pedir('/models');
      if (!r.ok) throw new ErrorFatal(`LM Studio respondio ${r.status} a GET ${base}/models.`);
      const cuerpo = (await r.json()) as { data?: { id: string }[] };
      const ids = (cuerpo.data ?? []).map((m) => m.id);
      const elegido = env.LMSTUDIO_MODEL || (ids.length === 1 ? ids[0] : undefined);
      if (!elegido) {
        throw new ErrorFatal(
          ids.length === 0
            ? 'LM Studio esta activo pero no hay ningun modelo cargado. Carga uno.'
            : `LM Studio lista varios modelos; define LMSTUDIO_MODEL con uno de: ${ids.join(', ')}`,
        );
      }
      modeloId = elegido;
      return elegido;
    },

    parametros() {
      return { max_tokens: config.max_tokens, temperature: config.temperature ?? 0 };
    },

    async generar(p: PeticionModelo): Promise<RespuestaModelo> {
      if (!modeloId) throw new ErrorFatal('Cliente de LM Studio sin preparar().');
      const cuerpo = JSON.stringify({
        model: modeloId,
        max_tokens: config.max_tokens,
        temperature: config.temperature ?? 0,
        stream: false,
        messages: [
          { role: 'system', content: p.system },
          { role: 'user', content: p.prompt },
        ],
      });
      let r: Response;
      try {
        r = await conReintento(
          async () => {
            const resp = await pedir('/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: cuerpo,
            });
            if (resp.status === 429 || resp.status >= 500) throw new ErrorHttpReintentable(`HTTP ${resp.status}`);
            return resp;
          },
          {
            maximo: op.reintentos ?? 3,
            baseMs: 1000,
            esperar,
            esReintentable: (e) => e instanceof ErrorHttpReintentable,
          },
        );
      } catch (e) {
        if (e instanceof ErrorHttpReintentable) throw new ErrorLlamada(`LM Studio devolvio ${e.message} tras reintentos.`);
        throw e;
      }
      if (!r.ok) {
        const detalle = (await r.text()).slice(0, 300);
        throw new ErrorLlamada(`LM Studio HTTP ${r.status}: ${detalle}`);
      }
      const j = (await r.json()) as {
        choices?: { message?: { content?: string | null }; finish_reason?: string | null }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const ch = j.choices?.[0];
      // Modelos con razonamiento visible: se quita el bloque <think> antes de puntuar.
      const texto = (ch?.message?.content ?? '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      const usage = {
        tokens_entrada: j.usage?.prompt_tokens ?? 0,
        tokens_salida: j.usage?.completion_tokens ?? 0,
      };
      if (ch?.finish_reason === 'content_filter') {
        return { estado: 'rechazo', texto: '', ...usage, stop_reason: 'content_filter' };
      }
      if (texto === '') {
        throw new ErrorLlamada(`LM Studio devolvio texto vacio (finish_reason=${ch?.finish_reason ?? 'null'}).`);
      }
      return { estado: 'ok', texto, ...usage, stop_reason: ch?.finish_reason ?? null };
    },
  };
}
