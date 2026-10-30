// Puntuacion SIN juez: opcion multiple (exactitud) y precision de cita (deterministica).
import type { Pregunta } from '../tipos.ts';

const LETRAS = 'ABCDEF';

export function letraDe(indice: number): string {
  return LETRAS[indice] ?? '?';
}

/** Extrae la letra elegida; null si el texto no se deja interpretar. */
export function parsearLetra(texto: string, nOpciones: number): number | null {
  const limpio = texto.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const inicio = /^[\s*_`(\[]*(?:opci[oó]n\s+|respuesta[:\s]+)?([A-F])(?=[\s*_`)\].:,;-]*$|[)\].:])/i.exec(limpio);
  const alterna = /respuesta(?:\s+correcta)?\s*(?:es|:)\s*[*_`(]*([A-F])\b/i.exec(limpio);
  const m = inicio ?? alterna;
  if (!m) return null;
  const i = LETRAS.indexOf(m[1].toUpperCase());
  return i >= 0 && i < nOpciones ? i : null;
}

export interface PuntajeOpcionMultiple {
  correcta: boolean;
  letra_elegida: string | null;
}

export function puntuarOpcionMultiple(p: Pregunta, textoModelo: string): PuntajeOpcionMultiple {
  const opciones = p.opciones ?? [];
  const i = parsearLetra(textoModelo, opciones.length);
  if (i === null) return { correcta: false, letra_elegida: null }; // sin letra interpretable = fallo
  return { correcta: opciones[i] === p.respuesta, letra_elegida: letraDe(i) };
}

function numerosDeArticulos(texto: string): Set<string> {
  const nums = new Set<string>();
  // "Articulo 55", "Articulos 12 y 13", "Art. 7, 8"; el segmento corta en la primera letra,
  // asi "Gaceta 6.507" no se confunde con un articulo.
  for (const seg of texto.matchAll(/art(?:[ií]culos?|s?\.)\s*([\d\s,y-]{1,40})/gi)) {
    for (const n of seg[1].matchAll(/\d+/g)) nums.add(String(Number(n[0])));
  }
  return nums;
}

/**
 * Precision de cita: true si la respuesta menciona el/los articulo(s) de `articulo_ref`.
 * null si la referencia no trae numero de articulo (no evaluable). Solo cuenta el articulo,
 * no numeral/literal: es una senal de cita, no una validacion juridica.
 */
export function precisionCita(articuloRef: string, textoModelo: string): boolean | null {
  const esperados = numerosDeArticulos(articuloRef);
  if (esperados.size === 0) return null;
  const citados = numerosDeArticulos(textoModelo);
  return [...esperados].some((n) => citados.has(n));
}
