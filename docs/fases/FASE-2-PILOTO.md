# Fase 2 — Piloto

> **Gate de entrada:** Fase 1 aprobada (lista de normas y versiones cerrada).
> **Gate de salida:** 30 preguntas (10 por dominio) escritas y validadas,
> revisadas por Luis pregunta por pregunta.

**Tiempo estimado:** no fijado por la ficha · **Estado:** pendiente

## Objetivo

Escribir y validar un piloto de 30 preguntas — 10 de tributario, 10 de
aduanas, 10 de mercantil — que cumplan el esquema de
`docs/adr/ADR-001-esquema-de-preguntas.md` y sirvan para probar el harness en
la Fase 3 antes de escalar en la Fase 4.

## Entregables

- `data/preguntas.jsonl` con 30 entradas validas contra
  `schema/pregunta.schema.json`.
- Cada entrada con `articulo_ref` y `gaceta` verificables contra `corpus/`.
- `validado_por` y `fecha_validacion` llenos **solo** en las preguntas que
  Luis reviso y aprobo una por una.

## Pasos para Claude Code

1. Releer `CLAUDE.md`, el ADR-001 y la lista de normas cerrada en F1.
2. Proponer borradores de preguntas **basados solo en el `corpus/` ya
   verificado en F1**, nunca en conocimiento propio de memoria. Cada borrador
   cita su `articulo_ref` y `gaceta` tomados literalmente del corpus.
3. Mezclar `tipo: opcion_multiple` y `tipo: abierta`, y variar `dificultad`
   1-3, repartido lo mas parejo posible dentro de cada dominio.
4. Entregar los 30 borradores a Luis con `validado_por` vacio. Claude Code
   **nunca** llena ese campo: es el unico dato que certifica revision humana.
5. Incorporar las correcciones de Luis pregunta por pregunta. Si Luis cambia
   una respuesta o un articulo, el cambio se refleja tal cual — sin
   reinterpretarlo.
6. Cuando Luis apruebe una pregunta, el registra `validado_por` y
   `fecha_validacion` (o se los dicta a Claude Code para que los transcriba
   exactamente).

## Criterios de salida

- 30/30 preguntas con `validado_por` lleno.
- 30/30 validan contra `schema/pregunta.schema.json` sin errores.
- Reparto real: 10 tributario, 10 aduanas, 10 mercantil.
- Ninguna pregunta con `articulo_ref` o `gaceta` inventados o sin verificar
  contra `corpus/`.

## STOP GATE

> **Pendiente.**

El gate es literal: Luis revisa **cada una de las 30 preguntas**, no una
muestra. Es el primer control de calidad real del dataset y fija el estandar
para la Fase 4, donde ya no sera practico revisar el 100%.
