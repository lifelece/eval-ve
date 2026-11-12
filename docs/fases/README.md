# Fases

Cada archivo es el guion operativo de una fase: objetivo, gate de entrada,
entregables, pasos para Claude Code, criterios de salida y STOP gate.

**Una sesion de trabajo empieza leyendo el archivo de la fase activa.**

## Calendario

La ficha de Notion dice que eval-ve arranca "tras F2 del Radar [de
universidades]". Luis pidio la Fase 0 de todos los proyectos del portafolio el
mismo dia (2026-09-29); la Fase 0 no tiene costo, por eso se ejecuto ya.

**F1 (Corpus) queda en espera de que el Radar cierre su propia F2, salvo que
Luis diga explicitamente lo contrario.** Antes de empezar F1, confirma ese
punto con Luis en una frase si no hay constancia de que ya se dio luz verde.

## Fases

| Fase | Archivo | Estado |
|---|---|---|
| 0 — Setup | [FASE-0-SETUP.md](FASE-0-SETUP.md) | **Cerrada** (PR #1, aprobada por Luis, 2026-10-20) |
| 1 — Corpus | [FASE-1-CORPUS.md](FASE-1-CORPUS.md) | **Cerrada** (PR #2 mergeado 2026-10-26; F1b: PR #4, 16 normas mas, 2026-10-26) |
| 2 — Piloto | [FASE-2-PILOTO.md](FASE-2-PILOTO.md) | **Cerrada** (PR #3: las 30 preguntas aprobadas por Luis, 26/10) |
| 3 — Harness | [FASE-3-HARNESS.md](FASE-3-HARNESS.md) | **Corrida piloto hecha (2026-11-12)**: 30 preguntas, Haiku 5.5 y Qwen 2.5 3B, 0,0131 USD. Hallazgo: en el piloto la respuesta correcta es la B en 12 de 21 opciones multiples; no discrimina bien. Falta la revision de Luis |
| 4 — Escala | [FASE-4-ESCALA.md](FASE-4-ESCALA.md) | **Cerrada por Luis el 2026-11-12**: 150 preguntas x 4 modelos (0,41 USD de un tope de 5); revision humana del juez hecha (35 de 35 veredictos, [REVISION-JUEZ-F4.md](REVISION-JUEZ-F4.md)); las 150 preguntas selladas por el autor con `scripts/sellar-validacion.mjs` |
| 5 — Publicacion | [FASE-5-PUBLICACION.md](FASE-5-PUBLICACION.md) | **En curso (2026-11-12)**: dataset publicado en Hugging Face (https://huggingface.co/datasets/lifelece/eval-ve; 150 preguntas, CC BY 4.0, comprobado sin el conjunto privado). Faltan: hacer publico el repositorio, desplegar la tabla y verla en telefono real ([CHECKLIST-F5.md](CHECKLIST-F5.md)) |
| 6 — LinkedIn | [FASE-6-LINKEDIN.md](FASE-6-LINKEDIN.md) | Pendiente — sin STOP gate |

## La regla del STOP gate

Al terminar una fase, **para**. No encadenes la siguiente por inercia ni por
iniciativa propia. El gate existe para que Luis revise el diff, valide los
datos de dominio (normas, articulos, preguntas) y decida con la cabeza fria si
se sigue, se ajusta o se detiene.
