# Fase 3 — Harness

> **Gate de entrada:** Fase 2 aprobada (30 preguntas piloto validadas).
> **Gate de salida:** corrida piloto con 2 modelos revisada por Luis.

**Tiempo estimado:** no fijado por la ficha · **Estado:** pendiente

## Objetivo

Construir el runner en Node + TypeScript: cache de respuestas obligatoria,
clientes de API para Anthropic/OpenAI/Gemini y para LM Studio (servidor local
compatible con la API de OpenAI), juez LLM con rubrica, y reporte en JSON.
Probarlo contra las 30 preguntas del piloto con al menos 2 modelos.

## Entregables

- `src/clientes/` — un cliente por proveedor. El de LM Studio reutiliza el
  contrato compatible-OpenAI apuntando a `LMSTUDIO_BASE_URL`.
- `src/cache/` — cache de respuestas indexada por (id de pregunta, modelo,
  version del dataset). Ninguna corrida repite una llamada ya cacheada.
- `src/juez/` — juez LLM con rubrica correcta/parcial/incorrecta para
  preguntas abiertas, mas el calculo de las 4 metricas de la ficha:
  1. Exactitud en opcion multiple.
  2. Calidad en abiertas (rubrica del juez).
  3. Precision de cita (¿menciona el `articulo_ref` correcto?).
  4. Tasa de alucinacion normativa (¿inventa articulos o leyes que no
     existen en `corpus/`?).
- `src/runner/` — orquesta preguntas -> modelos -> respuestas -> juez ->
  reporte, respetando el tope de gasto configurado.
- `results/<modelo>/<fecha>.json` de la corrida piloto con al menos 2 modelos
  (idealmente uno via API y uno local via LM Studio, para probar ambos
  caminos).

## Pasos para Claude Code

1. Releer `CLAUDE.md`, en particular las reglas de cache y tope de gasto.
2. Definir el formato de `results/<modelo>/<fecha>.json` (esquema propio,
   documentado en un ADR si introduce decisiones no triviales).
3. Implementar cache antes que nada — es mas facil de verificar con pocas
   preguntas (30) que despues con 150 (F4).
4. Implementar el tope de gasto como corte duro: el runner debe negarse a
   lanzar una llamada que superaria el limite configurado, no solo avisar
   despues.
5. Implementar el juez LLM con rubrica explicita y guardar su justificacion,
   no solo la etiqueta — hace falta para la revision humana del 20% en F4.
6. Correr el piloto completo (30 preguntas x 2 modelos como minimo) y guardar
   los resultados.
7. Ninguna dependencia nueva sin listarla y justificarla — SDKs oficiales de
   los proveedores son la excepcion esperada, no cualquier libreria.

## Criterios de salida

- Corrida piloto completa, con cache verificada (repetir la corrida no vuelve
  a facturar).
- Tope de gasto respetado y probado (forzarlo con un limite bajo y confirmar
  que el runner se detiene).
- Reporte JSON legible por Luis, con las 4 metricas calculadas.
- Al menos 1 modelo local (LM Studio) y 1 remoto (API) en la corrida.

## STOP GATE

> **Pendiente.**

Luis revisa la corrida piloto con los 2 modelos: si el juez califica bien, si
el costo real coincidio con lo esperado, y si el reporte es entendible antes
de escalar a 150 preguntas y 4-6 modelos en la Fase 4.
