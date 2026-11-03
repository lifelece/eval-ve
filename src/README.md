# src/

Harness de evaluacion en Node + TypeScript (Node >= 24 ejecuta los `.ts` directamente, sin
compilador; ver `docs/adr/ADR-004-harness-f3.md`). Estado: **Fase 3 en curso, en seco**.

```
src/
  runner/    Orquesta preguntas -> modelos -> respuestas -> juez -> reporte (cli.ts, runner.ts,
             presupuesto.ts, reporte.ts, prompts.ts, dataset.ts)
  clientes/  anthropic.ts (SDK oficial), lmstudio.ts (fetch local), simulado.ts (tests)
  juez/      juez.ts (rubrica) y puntuar.ts (opcion multiple y precision de cita)
  cache/     Cache de respuestas en disco
  validar/   Validador del dataset (F2)
config/modelos.json   Modelos, precios por millon de tokens y tope de gasto por defecto
```

## Tests (CERO llamadas reales)

    npm test

## Corrida piloto (la hace Luis)

1. Copia `.env.example` a `.env` y rellena `ANTHROPIC_API_KEY` (solo en tu entorno local).
2. En LM Studio: carga un modelo pequeno de tipo instruct/chat que quepa en 8 GB de RAM (p. ej. un
   7-8B cuantizado a 4 bits), activa el servidor local (pestana Developer > Start Server; puerto 1234
   por defecto) y, si hay varios modelos, fija `LMSTUDIO_MODEL`.
3. Ejecuta (PowerShell):

       npm run piloto -- --modelos haiku,lmstudio

   Opciones: `--tope <usd>` (por defecto 2), `--juez <alias>`, `--limite <n>`, `--solo-validadas`.
   Repetir el comando no vuelve a pagar: lo respondido sale de `.cache/respuestas/`.
4. Salida: `results/<alias>/<fecha>.json` y `results/resumen-<fecha>.md`.
