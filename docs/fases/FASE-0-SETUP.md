# Fase 0 — Setup

> **Gate de entrada:** ninguno.
> **Gate de salida:** estructura del repo aprobada por Luis.

**Tiempo estimado:** una sesion · **Estado:** entregado 2026-09-29, pendiente
de aprobacion

## Objetivo

Dejar el repositorio `eval-ve` con su gobernanza, su mapa de fases y el ADR
del esquema de preguntas listos, sin escribir todavia ni una sola pregunta
real ni cargar ningun texto legal. Fase de andamiaje, no de contenido.

## Prerrequisitos

- [x] Node instalado (v24.14.1 en esta laptop) — el harness aun no se escribe,
      pero el `package.json` ya declara `engines`.
- [x] Git instalado y disponible.
- [ ] Cuenta de GitHub para el repo publico — la crea/usa Luis al hacer push.
- [ ] Claves de API (Anthropic, OpenAI, Gemini) — no hacen falta hasta F3.
- [ ] LM Studio instalado localmente — no hace falta hasta F3.

## Entregables de esta fase

1. `git init -b main` — hecho. **Sin commit**: Luis revisa el diff primero.
2. `CLAUDE.md` — reglas del proyecto, estandar heredado adaptado, stack,
   estructura prevista, mapa de fases.
3. `docs/fases/README.md` + un guion por fase, F0 a F6. F1-F6 listos para
   sesiones futuras, no ejecutados.
4. `docs/adr/README.md` (indice + plantilla) y
   `docs/adr/ADR-001-esquema-de-preguntas.md` (estado Propuesto), con el
   esquema formalizado y espejado en `schema/pregunta.schema.json`.
   `docs/adr/ADR-002-stack-harness.md` (Propuesto, opcional) documenta la
   eleccion de Node+TS y LM Studio via API compatible-OpenAI.
5. `LICENSE` (MIT, (c) 2026 Luis Carlos Vasquez) y `LICENSE-DATA` (CC BY 4.0
   para las preguntas de `data/`). El regimen de derechos de `corpus/` (textos
   legales oficiales) queda **sin resolver a proposito** — es pregunta abierta
   para Luis/F1, no una decision de F0.
6. `DISCLAIMER.md` bilingue ES/EN: no es asesoria legal.
7. `README.md` minimo bilingue ES/EN.
8. `.gitignore` y `.env.example` con las cuatro variables de entorno del
   harness, todas vacias.
9. `package.json` sin dependencias: name, private, type module,
   engines node>=20, license MIT, scripts vacios.

## Pasos que se siguieron

1. Leer el estandar comun de portafolio (15 reglas + reglas duras de esta
   sesion) y usar `orinoco-digital` como plantilla de forma, sin modificarlo.
2. Crear la estructura de carpetas prevista (`corpus/`, `data/`, `results/`,
   `src/`, `web/`, `docs/fases/`, `docs/adr/`, `schema/`), cada una con un
   `README.md` corto que explica que va ahi y en que fase se llena — para que
   git pueda versionar carpetas vacias y Luis vea el mapa completo desde ya.
3. Formalizar el esquema de la ficha de Notion como JSON Schema
   (`schema/pregunta.schema.json`) y como ADR-001, sin escribir preguntas
   reales.
4. Escribir los seis archivos de gobernanza y los guiones de F1 a F6 con el
   mismo nivel de detalle que Orinoco: objetivo, entregables, pasos, criterios
   de salida, STOP gate.
5. No se instalo nada, no se corrio `npm install`, no se hizo commit ni push.

## Criterios de salida

- [x] `git init -b main` ejecutado, sin commit.
- [x] `CLAUDE.md` cubre reglas especificas del proyecto + estandar adaptado.
- [x] `docs/fases/` tiene los 7 guiones (F0-F6).
- [x] `docs/adr/` tiene indice + ADR-001 (Propuesto) + ADR-002 (Propuesto).
- [x] `schema/pregunta.schema.json` valida como JSON.
- [x] `LICENSE`, `LICENSE-DATA`, `DISCLAIMER.md`, `README.md` presentes.
- [x] `.gitignore` cubre `.env`, cache de respuestas y preguntas privadas.
- [x] `.env.example` con las 4 variables vacias.
- [x] `package.json` sin dependencias.
- [ ] **Aprobacion de Luis** — pendiente, es el propio gate.

## STOP GATE

> **Abierto.** Falta la revision de Luis: estructura, decisiones tomadas por
> Claude Code que necesitan su visto bueno (ver la lista en el mensaje de
> cierre de esta sesion), y las preguntas abiertas de la Fase 1.

Cuando Luis apruebe la estructura — con o sin ajustes — la Fase 0 queda
cerrada y se puede planear el arranque de la Fase 1, sujeto a la nota de
calendario del Radar en `docs/fases/README.md`.
