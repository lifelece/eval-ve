// Prompt que reciben TODOS los modelos evaluados (mismo texto para comparar en igualdad).
import type { Pregunta, PeticionModelo } from '../tipos.ts';
import { letraDe } from '../juez/puntuar.ts';

export const SYSTEM_EVALUADO =
  'Responde en espanol sobre normativa venezolana. Si no estas seguro, dilo: no inventes articulos, leyes ni numeros de Gaceta.';

export function promptPregunta(p: Pregunta): PeticionModelo {
  if (p.tipo === 'opcion_multiple') {
    const lista = (p.opciones ?? []).map((o, i) => `${letraDe(i)}) ${o}`).join('\n');
    return {
      system: SYSTEM_EVALUADO,
      prompt: `${p.pregunta}\n\n${lista}\n\nResponde unicamente con la letra de la opcion correcta.`,
    };
  }
  return {
    system: SYSTEM_EVALUADO,
    prompt: `${p.pregunta}\n\nResponde de forma concisa (maximo 150 palabras) e indica el articulo y la norma en que te basas.`,
  };
}
