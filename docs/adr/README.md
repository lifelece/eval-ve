# Registro de decisiones (ADR)

Cada decision de arquitectura o de esquema de datos queda en su propio
archivo: `ADR-NNN-slug-corto.md`, numerado en orden de creacion. Si una
decision cambia, se anade un ADR nuevo que **supersede** al anterior; el
archivo viejo no se borra ni se reescribe — el historial es el valor.

Diferencia con Orinoco Digital (la plantilla de forma de este proyecto):
Orinoco guarda todos sus ADR en un unico `docs/DECISIONS.md`. Aqui, siguiendo
la regla 2 del estandar comun de portafolio, cada decision vive en su propio
archivo dentro de `docs/adr/`.

## Indice

| ADR | Titulo | Estado |
|---|---|---|
| [ADR-001](ADR-001-esquema-de-preguntas.md) | Esquema de preguntas | Aceptado (2026-10-20) |
| [ADR-002](ADR-002-stack-harness.md) | Stack del harness: Node+TS y LM Studio | Aceptado (2026-10-20) |
| [ADR-003](ADR-003-regimen-de-derechos-del-corpus.md) | Regimen de derechos de `corpus/` | Propuesto (2026-10-26) |

## Plantilla

Copia esto para un ADR nuevo:

```markdown
# ADR-NNN — Titulo corto de la decision

**Fecha:** AAAA-MM-DD · **Estado:** Propuesto | Aceptado | Rechazado | Supersedido por ADR-MMM

## Contexto

Que problema o pregunta motiva esta decision. Que dice la ficha de Notion o
la sesion anterior al respecto.

## Decision

Que se decide, en una o dos frases claras.

## Alternativas consideradas

Que otras opciones se evaluaron y por que se descartaron.

## Consecuencias

Que implica esta decision — costos, riesgos aceptados, trabajo futuro que
habilita o bloquea.

## Cuando reconsiderar

Que evento o hallazgo justificaria un ADR nuevo que supersede a este.
```

## Estados

- **Propuesto** — Claude Code (o Claude chat) lo redacto; Luis no lo ha
  revisado todavia. Es el estado por defecto de todo ADR salido de una Fase 0.
- **Aceptado** — Luis lo reviso y esta de acuerdo, con o sin ajustes.
- **Rechazado** — Luis lo reviso y no se adopta. Se deja el archivo como
  registro de que la opcion se considero y por que no se tomo.
- **Supersedido por ADR-MMM** — una decision posterior lo reemplaza.
