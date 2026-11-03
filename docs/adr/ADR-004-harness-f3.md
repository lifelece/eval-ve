# ADR-004 — Harness de la Fase 3: proveedores, TypeScript sin compilador, cache, tope y formato de resultados

**Fecha:** 2026-10-26 · **Estado:** Propuesto (pendiente de Luis)

## Contexto

La Fase 3 construye el runner. Luis fijo el 26/10 los modelos del piloto: Claude Haiku 5.5 por API
y un modelo local en LM Studio; ningun otro proveedor. Esto acota el stack de ADR-002 (que preveia
SDKs de OpenAI y Gemini): no se instalan.

## Decision

1. **Anthropic: SDK oficial `@anthropic-ai/sdk` 0.133.0**, version exacta (publicada el 2026-10-09,
   mas de dos semanas). Unica dependencia nueva. Haiku 5.5 sin `temperature`/`top_p`/`top_k`,
   `output_config.effort` explicito (`low`), `stop_reason: "refusal"` registrado como **rechazo**
   (no es respuesta y no entra en las metricas), errores tipados del SDK. `maxRetries` del SDK en 0:
   el reintento (429/5xx/red, backoff exponencial) lo hace `src/clientes/reintento.ts`.
2. **LM Studio con `fetch` nativo, sin SDK:** es un servidor local con dos endpoints
   (`GET /models`, `POST /chat/completions`) en `LMSTUDIO_BASE_URL`; no es proveedor de pago y el SDK
   de OpenAI seria una dependencia sin beneficio. Si el servidor no responde, el error es fatal con el
   mensaje "Arranca LM Studio...".
3. **TypeScript sin compilador:** Node 24 ejecuta `.ts` borrando tipos. Se usa solo sintaxis borrable
   (`import type`, sin enums ni parameter properties) y no se anade `typescript` como dependencia.
   Consecuencia: no hay chequeo de tipos en CI; lo cubren los tests. Si Luis lo quiere, un ADR aparte
   puede anadir `tsc --noEmit`.
4. **Cache obligatoria** en `.cache/respuestas/` (ignorada por git): clave = sha256 del JSON canonico de
   tipo (respuesta|juez), proveedor, id real del modelo, parametros (max_tokens, effort, temperature),
   system, prompt, id de pregunta y hash del registro de la pregunta. Se cachean respuestas y rechazos;
   los errores no. Los rechazos se cachean porque ya se pagaron.
5. **Tope de gasto** (`--tope`, 2 USD por defecto en `config/modelos.json`): antes de cada llamada se
   estima el peor caso (entrada estimada a ~3 caracteres por token + `max_tokens` completos de salida,
   al precio de `config/modelos.json`); si `gastado + peor caso > tope` la llamada **no se lanza** y la
   corrida se corta (lo pendiente queda `omitida_por_tope`). Tras cada llamada se suma el costo real.
   Los precios son de la skill `claude-api` (2026-10-06): Luis debe confirmarlos antes de la corrida.
6. **Juez:** Haiku 5.5 por defecto (`--juez`), rubrica correcta/parcial/incorrecta (1 / 0.5 / 0) con
   justificacion guardada y `cita_inventada`. El texto del modelo evaluado va en una etiqueta de datos
   (defensa ante inyeccion). Opcion multiple se puntua sin juez.
7. **Las 4 metricas de la ficha:** exactitud (MC, determinista); calidad (abiertas, juez); precision de
   cita (determinista: la respuesta nombra el/los numeros de articulo de `articulo_ref`; no valida
   numeral ni norma); tasa de alucinacion normativa = **senal del juez** (`cita_inventada`), **no**
   verificacion contra `corpus/`. La verificacion contra el corpus queda para F4 y se declara como
   limite del piloto.
8. **Formato de resultados:** `results/<alias>/<fecha>.json` (`esquema_version: 1`) con modelo, juez,
   hash del dataset, tope, gasto, resumen global y por dominio y por dificultad, y los items con
   respuesta cruda, veredicto y justificacion; mas `results/resumen-<fecha>.md`. Sin claves.
9. **Preguntas sin `validado_por`:** el piloto las corre y el informe declara cuantas estan validadas
   (`--solo-validadas` las filtra). Las no vigentes se omiten.
10. **Prompt unico** para todos los modelos (`src/runner/prompts.ts`); las opciones se presentan en el
    orden del dataset (sesgo de posicion sin medir; a revisar en F4).

## Alternativas consideradas

- SDK de OpenAI para LM Studio (ADR-002): descartado, ver 2.
- `tsc` / `tsx` como dependencia: descartado, ver 3.
- Contar tokens con `messages.count_tokens` antes de cada llamada: anade una llamada por pregunta;
  la estimacion por caracteres es conservadora y el costo real se mide con `usage`.

## Consecuencias

- Una dependencia nueva (`@anthropic-ai/sdk`) y `package-lock.json`.
- El peor caso de gasto es una cota, no el gasto esperado; el tope puede cortar antes de lo necesario.
- Cambiar prompt, parametros o redaccion de una pregunta invalida su cache (es lo deseado).

## Cuando reconsiderar

Al escalar a F4 (mas modelos, paralelismo), al anadir otro proveedor, o si la senal de alucinacion del
juez resulta poco fiable en la revision humana.
