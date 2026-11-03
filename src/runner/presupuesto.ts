// Tope de gasto (CLAUDE.md, regla 5): corte DURO antes de lanzar la llamada.
// Antes de cada llamada se estima el PEOR caso (entrada estimada + max_tokens completos de
// salida); si gastado + peor caso > tope, la llamada no se lanza. Tras la llamada se suma el
// costo real (tokens reportados x precio de config/modelos.json).
import type { Precio } from '../tipos.ts';

export function costoUsd(tokensEntrada: number, tokensSalida: number, precio: Precio): number {
  return (tokensEntrada * precio.entrada + tokensSalida * precio.salida) / 1_000_000;
}

/** Estimacion conservadora de tokens de entrada para texto en espanol (~3 caracteres/token + margen). */
export function estimarTokensEntrada(...textos: string[]): number {
  return Math.ceil(textos.reduce((a, t) => a + t.length, 0) / 3) + 50;
}

export function estimarPeorCaso(precio: Precio, maxTokens: number, ...textos: string[]): number {
  return costoUsd(estimarTokensEntrada(...textos), maxTokens, precio);
}

export class Presupuesto {
  tope: number;
  gastado = 0;

  constructor(tope: number) {
    if (!(tope >= 0)) throw new Error('El tope de gasto debe ser un numero >= 0');
    this.tope = tope;
  }

  puedeGastar(estimado: number): boolean {
    return this.gastado + estimado <= this.tope;
  }

  registrar(costo: number): void {
    this.gastado += costo;
  }
}
