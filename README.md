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

**Fases 0 a 4 cerradas; Fase 5 (publicación) en curso.** El conjunto tiene 150 preguntas (50 por dominio), todas
con validación del autor. Corrida vigente: `2026-11-12_151044`, 4 modelos, juez Claude Haiku 5.5.

| Modelo | Opción múltiple | Abiertas (calidad) | Cita correcta | Cita inventada (señal del juez) |
|---|---|---|---|---|
| Claude Sonnet 5.5 | 87,7 % (93/106) | 48,9 % | 29,5 % (13/44) | 18,2 % (8/44) |
| Claude Haiku 5.5 | 82,1 % (87/106) | 38,6 % | 6,8 % (3/44) | 6,8 % (3/44) |
| Qwen 2.5 3B (local) | 69,8 % (74/106) | 9,1 % | 2,3 % (1/44) | 79,5 % (35/44) |
| Llama 3.2 3B (local) | 64,2 % (68/106) | 10,2 % | 2,3 % (1/44) | 84,1 % (37/44) |

Conjunto de preguntas: [lifelece/eval-ve en Hugging Face](https://huggingface.co/datasets/lifelece/eval-ve) (CC BY 4.0).

Cómo leerlo: es una sola corrida por modelo; el juez es otro modelo y deja pasar algunas citas inventadas
(revisión humana de 35 correcciones en `docs/fases/REVISION-JUEZ-F4.md`); una abstención cuenta como fallo.
Detalle por dominio y dificultad en `results/`. Mapa de fases en [docs/fases/README.md](docs/fases/README.md)
y reglas del proyecto en [CLAUDE.md](CLAUDE.md).

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

**Phases 0 to 4 closed; Phase 5 (release) in progress.** The set has 150 questions (50 per domain), all
validated by the author. Current run: `2026-11-12_151044`, 4 models, judge Claude Haiku 5.5.

| Model | Multiple choice | Open-ended (quality) | Correct citation | Invented citation (judge signal) |
|---|---|---|---|---|
| Claude Sonnet 5.5 | 87,7 % (93/106) | 48,9 % | 29,5 % (13/44) | 18,2 % (8/44) |
| Claude Haiku 5.5 | 82,1 % (87/106) | 38,6 % | 6,8 % (3/44) | 6,8 % (3/44) |
| Qwen 2.5 3B (local) | 69,8 % (74/106) | 9,1 % | 2,3 % (1/44) | 79,5 % (35/44) |
| Llama 3.2 3B (local) | 64,2 % (68/106) | 10,2 % | 2,3 % (1/44) | 84,1 % (37/44) |

Question set: [lifelece/eval-ve on Hugging Face](https://huggingface.co/datasets/lifelece/eval-ve) (CC BY 4.0).

How to read it: one run per model; the judge is another model and misses some invented citations
(human review of 35 judge decisions in `docs/fases/REVISION-JUEZ-F4.md`); an abstention counts as a miss.
Per-domain and per-difficulty detail in `results/`. Phase map in [docs/fases/README.md](docs/fases/README.md)
(in Spanish) and project rules in [CLAUDE.md](CLAUDE.md).

### License

Code under [MIT](LICENSE). Dataset questions under
[CC BY 4.0](LICENSE-DATA). The rights status of the legal texts in `corpus/`
is an open question until Phase 1 — see `LICENSE-DATA`.

### Author

Luis Carlos Vasquez.
