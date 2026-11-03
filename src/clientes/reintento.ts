// Reintento con backoff exponencial para 429 / 5xx / red. `esperar` se inyecta para que
// los tests no duerman de verdad.
export type Esperar = (ms: number) => Promise<void>;
export const esperarReal: Esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export interface OpcionesReintento {
  maximo: number; // reintentos adicionales al primer intento
  baseMs: number;
  esperar: Esperar;
  esReintentable: (e: unknown) => boolean;
}

export async function conReintento<T>(fn: () => Promise<T>, o: OpcionesReintento): Promise<T> {
  for (let intento = 0; ; intento++) {
    try {
      return await fn();
    } catch (e) {
      if (intento >= o.maximo || !o.esReintentable(e)) throw e;
      await o.esperar(o.baseMs * 2 ** intento);
    }
  }
}
