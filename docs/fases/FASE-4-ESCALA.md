# Fase 4 — Escala

> **Gate de entrada:** Fase 3 aprobada (corrida piloto con 2 modelos cerrada).
> **Gate de salida:** revision humana del 20% de las correcciones del juez.

**Tiempo estimado:** no fijado por la ficha · **Estado:** pendiente

## Objetivo

Escalar el dataset a 150 preguntas y correr el harness contra 4-6 modelos, de
los cuales al menos 2 corren localmente via LM Studio. Medir si el juez LLM es
confiable revisando a mano el 20% de sus correcciones.

## Entregables

- `data/preguntas.jsonl` ampliado a 150 preguntas, manteniendo el reparto por
  dominio y una distribucion razonable de `dificultad`.
- `data/privadas/` con el conjunto de control de contaminacion (20% del total
  publicado, o la proporcion que Luis defina) — nunca en git.
- Resultados en `results/<modelo>/<fecha>.json` para 4-6 modelos.
- Muestra del 20% de las correcciones del juez, con la calificacion humana de
  Luis al lado de la del juez, para medir concordancia.

## Pasos para Claude Code

1. Releer `CLAUDE.md` y el estado del dataset tras F2.
2. Proponer las 120 preguntas adicionales siguiendo el mismo proceso de F2:
   basadas solo en `corpus/`, con `articulo_ref` y `gaceta` verificables,
   `validado_por` vacio hasta que Luis las revise. A esta escala Luis ya no
   revisa el 100% pregunta por pregunta como en F2 — define con el una
   estrategia de muestreo para la validacion previa a publicar.
3. Separar el 20% de control de contaminacion hacia `data/privadas/` antes de
   que nada se acerque a un commit publico.
4. Correr el harness contra 4-6 modelos (los que Luis defina; al menos 2
   locales via LM Studio, dentro del limite de 8 GB de RAM).
5. Tomar una muestra del 20% de las correcciones del juez en preguntas
   abiertas y presentarla a Luis con la justificacion del juez visible, para
   que el la califique de forma independiente.
6. Calcular la concordancia juez-humano y dejarla documentada.

## Criterios de salida

- 150 preguntas en el dataset publico, con el reparto por dominio documentado.
- Conjunto privado separado y confirmado fuera de git.
- Resultados completos para 4-6 modelos.
- Concordancia juez-humano medida sobre el 20% de la muestra.

## STOP GATE

> **Pendiente.**

El gate es la revision humana del 20%: si el juez se desvia demasiado del
criterio de Luis, no se pasa a publicar (F5) sin ajustar la rubrica o el
proceso de calificacion primero.

## Estado de la parte de datos (2026-11-12)

- `data/preguntas.jsonl`: 150 preguntas (50 por dominio), las 30 del piloto intactas y 120 nuevas con `validado_por: null`. Hoja de citas y propuesta de muestreo: [REVISION-F4.md](REVISION-F4.md).
- Conjunto privado de control de contaminacion: 30 preguntas (10 por dominio) en `data/privadas/` (fuera de git), con la misma verificacion de citas.
- Verificacion: `npm run validar` (modo `--escala`; `--piloto` y `--privadas` siguen disponibles), `npm run verificar-citas` (local, necesita los textos de `C:\dev\eval-ve-textos\`) y `npm test`.
- Pendiente de F4: correr el harness con 4-6 modelos, revision humana del 20 % y concordancia juez-humano (no forman parte de esta entrega).
