// Cliente simulado para tests y ensayos: CERO llamadas reales.
import type { Cliente, PeticionModelo, RespuestaModelo } from '../tipos.ts';

export type Guion = (p: PeticionModelo, n: number) => RespuestaModelo | Error;

export interface ClienteSimulado extends Cliente {
  llamadas: PeticionModelo[];
}

export function ok(texto: string, entrada = 100, salida = 50): RespuestaModelo {
  return { estado: 'ok', texto, tokens_entrada: entrada, tokens_salida: salida, stop_reason: 'end_turn' };
}

export function clienteSimulado(guion: Guion, id = 'sim-1', parametros: Record<string, unknown> = {}): ClienteSimulado {
  const llamadas: PeticionModelo[] = [];
  return {
    llamadas,
    async preparar() {
      return id;
    },
    parametros() {
      return parametros;
    },
    async generar(p) {
      llamadas.push(p);
      const r = guion(p, llamadas.length);
      if (r instanceof Error) throw r;
      return r;
    },
  };
}
