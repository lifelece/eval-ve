# results/

Salida de cada corrida del harness contra un modelo, en formato
`results/<modelo>/<fecha>.json`.

**Corrida vigente: `2026-11-12_151044`** (Fase 4): 150 preguntas contra Claude Haiku 5.5, Claude Sonnet 5.5, Qwen 2.5 3B y Llama 3.2 3B (los dos ultimos en local con Ollama); juez Claude Haiku 5.5.

Es la misma medicion del `2026-11-12_060708` (0,41 USD), re-puntuada desde la cache sin llamadas nuevas despues de que el autor sello las 150 preguntas con `validado_por` (30 del piloto con fecha 2026-10-26 y 120 con fecha 2026-11-12). Las cifras no cambiaron.

Limites: una sola corrida por modelo; el juez es un modelo y deja pasar algunas citas inventadas (`docs/fases/REVISION-JUEZ-F4.md`); las preguntas del Codigo de Comercio salen de una transcripcion de tercero.
