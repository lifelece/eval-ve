# data/

Dataset publico de preguntas: `preguntas.jsonl` (JSON Lines, un objeto por
pregunta, esquema en `schema/pregunta.schema.json`).

**Vacio hasta la Fase 2.** Ver `docs/fases/FASE-2-PILOTO.md`.

## data/privadas/

El 20% de preguntas de control de contaminacion vive en `data/privadas/`,
listado en `.gitignore`. **Nunca se comprometen a git ni se publican.** Sirven
para detectar si un modelo memorizo el dataset publico. Se crean a partir de
la Fase 4 — ver `docs/fases/FASE-4-ESCALA.md` y
`docs/adr/ADR-001-esquema-de-preguntas.md`.
