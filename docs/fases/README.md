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
| 3 — Harness | [FASE-3-HARNESS.md](FASE-3-HARNESS.md) | **En curso, en seco**: runner construido y probado con clientes simulados; falta la corrida piloto real (necesita la clave de Anthropic del autor; tope 2 USD) |
| 4 — Escala | [FASE-4-ESCALA.md](FASE-4-ESCALA.md) | **En curso (2026-11-12)**: dataset a 150 preguntas con verificacion de citas y control de sesgo de longitud (PR #7); modelos aprobados por Luis: Haiku 5.5, Sonnet 5.5 y dos locales, tope 5 USD (`config/modelos.json`). Faltan las corridas y la revision humana del 20 % |
| 5 — Publicacion | [FASE-5-PUBLICACION.md](FASE-5-PUBLICACION.md) | **En seco (2026-11-12)**: tabla de posiciones, `CITATION.cff`, dataset card y checklist (PR #6). Faltan resultados reales, telefono real, despliegue y Hugging Face |
| 6 — LinkedIn | [FASE-6-LINKEDIN.md](FASE-6-LINKEDIN.md) | Pendiente — sin STOP gate |

## La regla del STOP gate

Al terminar una fase, **para**. No encadenes la siguiente por inercia ni por
iniciativa propia. El gate existe para que Luis revise el diff, valide los
datos de dominio (normas, articulos, preguntas) y decida con la cabeza fria si
se sigue, se ajusta o se detiene.
