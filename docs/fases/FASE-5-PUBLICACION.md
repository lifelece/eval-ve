# Fase 5 — Publicacion

> **Gate de entrada:** Fase 4 aprobada (revision humana del 20% cerrada).
> **Gate de salida:** checklist de publicacion completo.

**Tiempo estimado:** no fijado por la ficha · **Estado:** pendiente

## Objetivo

Publicar el proyecto: tabla de posiciones web, README bilingue definitivo,
dataset en Hugging Face con su dataset card, y `CITATION.cff`.

## Entregables

- `web/` — pagina estatica de tabla de posiciones, desplegada en Vercel o
  GitHub Pages, leyendo de `results/`. Verificada en telefono real con
  DevTools cerrado (regla 5 del estandar).
- `README.md` actualizado con resultados reales, demo en vivo y GIF si aplica.
- Dataset publicado en Hugging Face Datasets con dataset card (licencia CC BY
  4.0, procedencia, limitaciones, aviso de no-asesoria).
- `CITATION.cff` en la raiz.
- Confirmacion explicita de que `data/privadas/` **no** se publico en ningun
  lado (ni git, ni Hugging Face).

## Pasos para Claude Code

1. Releer `CLAUDE.md` y el estado de resultados tras F4.
2. Construir `web/` como pagina estatica simple que lea `results/` — sin
   backend, sin framework nuevo salvo que un ADR lo justifique.
3. Redactar el dataset card de Hugging Face: que es, de donde salen las
   preguntas, licencia, limitaciones (juez LLM, tamano de muestra, cobertura
   parcial de las tres ramas del derecho), aviso de no-asesoria.
4. Completar `CITATION.cff` con los datos del autor y del repositorio.
5. Actualizar `README.md` bilingue con el estado real del proyecto.
6. Correr una auditoria de secretos final (regla 12 del estandar) antes de
   entregar el checklist a Luis.
7. Confirmar en una frase explicita que `data/privadas/` no aparece en
   ningun artefacto publicado.

## Criterios de salida

- Tabla de posiciones visible y funcional, verificada en telefono real.
- README bilingue al dia.
- Dataset en Hugging Face con dataset card completo.
- `CITATION.cff` presente y valido.
- Auditoria de secretos limpia.
- Preguntas privadas confirmadas fuera de todo lo publicado.

## STOP GATE

> **Pendiente.**

El gate es el checklist de publicacion completo — no hay commit ni deploy sin
que Luis revise cada punto, incluida la verificacion en dispositivo real.
