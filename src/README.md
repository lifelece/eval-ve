# src/

Harness de evaluacion en Node + TypeScript. Ver
`docs/adr/ADR-002-stack-harness.md`.

**Vacio hasta la Fase 3.** Ver `docs/fases/FASE-3-HARNESS.md`. Estructura
prevista:

```
src/
  runner/    Orquesta preguntas -> modelos -> respuestas -> juez -> reporte
  clientes/  Un cliente por proveedor (anthropic, openai, gemini, lmstudio)
  juez/      Juez LLM con rubrica + calculo de las 4 metricas
  cache/     Cache de respuestas por (pregunta, modelo, version del dataset)
```
