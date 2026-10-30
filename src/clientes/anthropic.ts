// Cliente de Anthropic con el SDK oficial (@anthropic-ai/sdk 0.133.0, P-22).
// Llamada: client.messages.create({ model, max_tokens, system, messages, output_config: { effort } })
//   fuente: skill claude-api, typescript/claude-api/README.md ("Basic Message Request",
//   "Extended Thinking" para output_config.effort, "Stop Reasons"/"Structured Stop Details"
//   para refusal + stop_details, "Error Handling" para las clases tipadas).
// Haiku 5.5: NO se envia temperature/top_p/top_k (400); effort va explicito (default medium);
// maxRetries del SDK = 0 porque el reintento lo hace conReintento (visible y testeable).
// Sin prompt caching de Anthropic: el prefijo (system) es mucho menor que el minimo cacheable.
import Anthropic from '@anthropic-ai/sdk';
import type { Cliente, ConfigModelo, PeticionModelo, RespuestaModelo } from '../tipos.ts';
import { ErrorFatal, ErrorLlamada } from '../tipos.ts';
import { conReintento, esperarReal } from './reintento.ts';
import type { Esperar } from './reintento.ts';

/** Lo unico del SDK que usamos; permite inyectar un simulado en los tests. */
export interface SdkMensajes {
  messages: { create(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> };
}

export interface OpcionesAnthropic {
  sdk?: SdkMensajes;
  esperar?: Esperar;
  env?: Record<string, string | undefined>;
  reintentos?: number;
}

export function crearClienteAnthropic(config: ConfigModelo, op: OpcionesAnthropic = {}): Cliente {
  const env = op.env ?? process.env;
  const esperar = op.esperar ?? esperarReal;
  let sdk = op.sdk;

  const reintentable = (e: unknown): boolean =>
    e instanceof Anthropic.RateLimitError ||
    e instanceof Anthropic.InternalServerError ||
    e instanceof Anthropic.APIConnectionError;

  return {
    async preparar() {
      if (!sdk) {
        if (!env.ANTHROPIC_API_KEY) {
          throw new ErrorFatal('Falta ANTHROPIC_API_KEY en tu entorno local (.env, nunca en el repo).');
        }
        sdk = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 0 });
      }
      return config.id;
    },

    parametros() {
      return { max_tokens: config.max_tokens, effort: config.effort ?? null };
    },

    async generar(p: PeticionModelo): Promise<RespuestaModelo> {
      if (!sdk) throw new ErrorFatal('Cliente de Anthropic sin preparar().');
      const cliente = sdk;
      let r: Anthropic.Message;
      try {
        r = await conReintento(
          () =>
            cliente.messages.create({
              model: config.id,
              max_tokens: config.max_tokens,
              system: p.system,
              messages: [{ role: 'user', content: p.prompt }],
              ...(config.effort ? { output_config: { effort: config.effort } } : {}),
            }),
          { maximo: op.reintentos ?? 4, baseMs: 2000, esperar, esReintentable: reintentable },
        );
      } catch (e) {
        if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
          throw new ErrorFatal(`Anthropic rechazo la clave (${e.status}). Revisa ANTHROPIC_API_KEY.`);
        }
        if (e instanceof Anthropic.NotFoundError) {
          throw new ErrorFatal(`Anthropic no conoce el modelo "${config.id}" (404). Revisa config/modelos.json.`);
        }
        if (e instanceof Anthropic.APIError) throw new ErrorLlamada(`Anthropic ${e.status ?? 'red'}: ${e.message}`);
        throw e;
      }

      const usage = {
        tokens_entrada: r.usage.input_tokens,
        tokens_salida: r.usage.output_tokens,
      };
      // Haiku 5.5 no tiene fallback de servidor: un refusal es una respuesta NO valida.
      if (r.stop_reason === 'refusal') {
        const sd = r.stop_details;
        return {
          estado: 'rechazo',
          texto: '',
          ...usage,
          stop_reason: 'refusal',
          detalle: sd ? `categoria=${sd.category ?? 'null'}; ${sd.explanation ?? ''}`.trim() : 'sin detalle',
        };
      }
      const texto = r.content
        .flatMap((b) => (b.type === 'text' ? [b.text] : []))
        .join('')
        .trim();
      if (texto === '') {
        throw new ErrorLlamada(`Respuesta sin texto (stop_reason=${r.stop_reason}); sube max_tokens si fue "max_tokens".`);
      }
      return { estado: 'ok', texto, ...usage, stop_reason: r.stop_reason };
    },
  };
}
