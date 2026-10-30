import { readFileSync } from 'node:fs';
import { sha256 } from '../cache/cache.ts';
import type { Pregunta } from '../tipos.ts';

export interface Dataset {
  preguntas: Pregunta[];
  sha256: string;
  validadas: number;
}

/** Lee un JSONL de preguntas. La validacion de esquema es `npm run validar`; aqui solo se descartan las no vigentes. */
export function cargarDataset(ruta: string, opciones: { limite?: number; soloValidadas?: boolean } = {}): Dataset {
  const texto = readFileSync(ruta, 'utf8');
  let preguntas = texto
    .split(/\r?\n/)
    .filter((l) => l.trim() !== '')
    .map((l) => JSON.parse(l) as Pregunta)
    .filter((p) => p.vigente);
  if (opciones.soloValidadas) preguntas = preguntas.filter((p) => p.validado_por !== null);
  if (opciones.limite !== undefined) preguntas = preguntas.slice(0, opciones.limite);
  return {
    preguntas,
    sha256: sha256(texto),
    validadas: preguntas.filter((p) => p.validado_por !== null).length,
  };
}
