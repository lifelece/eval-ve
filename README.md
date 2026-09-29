# eval-ve

**Benchmark abierto de conocimiento normativo venezolano para modelos de
IA.** Tributos, aduanas y derecho mercantil.

[![Licencia codigo: MIT](https://img.shields.io/badge/codigo-MIT-blue.svg)](LICENSE)
[![Licencia datos: CC BY 4.0](https://img.shields.io/badge/datos-CC%20BY%204.0-green.svg)](LICENSE-DATA)

> ⚠️ **No es asesoria legal.** Ver [DISCLAIMER.md](DISCLAIMER.md).

---

## Español

### Que es

`eval-ve` mide que tan bien responden distintos modelos de IA preguntas
sobre normativa venezolana: tributos, aduanas y derecho mercantil. Cada
pregunta cita su articulo exacto y su numero de Gaceta Oficial. Incluye un
dataset publico, un harness de evaluacion en Node + TypeScript, y una tabla
de posiciones.

### Como se mide

Cuatro metricas: exactitud en opcion multiple, calidad en preguntas abiertas
(juez LLM con rubrica + revision humana del 20%), precision de cita del
articulo correcto, y tasa de alucinacion normativa (¿el modelo inventa
articulos o leyes que no existen?).

### Estado

**Fase 0 — Setup**, recien entregada y pendiente de aprobacion. Todavia no
hay dataset ni corpus ni harness: eso empieza en la Fase 1. Ver
[docs/fases/README.md](docs/fases/README.md) para el mapa completo de fases
y [CLAUDE.md](CLAUDE.md) para las reglas del proyecto.

### Estructura

```
corpus/    Textos legales oficiales vigentes, por dominio (Fase 1)
data/      Dataset de preguntas publico (Fase 2+)
results/   Resultados de cada corrida del harness (Fase 3+)
src/       Harness: runner, clientes de modelo, juez, cache
web/       Tabla de posiciones estatica (Fase 5)
docs/      Fases, decisiones de arquitectura (ADR)
schema/    JSON Schema del esquema de preguntas
```

### Licencia

Codigo bajo [MIT](LICENSE). Preguntas del dataset bajo
[CC BY 4.0](LICENSE-DATA). El regimen de derechos de los textos legales en
`corpus/` es una pregunta abierta hasta la Fase 1 — ver `LICENSE-DATA`.

### Autor

Luis Carlos Vasquez.

---

## English

### What this is

`eval-ve` measures how well different AI models answer questions about
Venezuelan regulation: tax, customs, and commercial law. Every question
cites its exact article and Official Gazette number. It includes a public
dataset, a Node + TypeScript evaluation harness, and a leaderboard.

### How it's measured

Four metrics: multiple-choice accuracy, open-answer quality (LLM judge with
a rubric + 20% human review), citation precision (does it name the correct
article?), and regulatory hallucination rate (does the model invent articles
or laws that don't exist?).

### Status

**Phase 0 — Setup**, just delivered and pending approval. No dataset,
corpus, or harness yet — that starts in Phase 1. See
[docs/fases/README.md](docs/fases/README.md) (in Spanish) for the full phase
map and [CLAUDE.md](CLAUDE.md) for project rules.

### License

Code under [MIT](LICENSE). Dataset questions under
[CC BY 4.0](LICENSE-DATA). The rights status of the legal texts in `corpus/`
is an open question until Phase 1 — see `LICENSE-DATA`.

### Author

Luis Carlos Vasquez.
