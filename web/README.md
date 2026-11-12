# web/

Tabla de posiciones publica: pagina estatica (HTML + CSS + JS vanilla, sin framework, sin dependencias, sin fuentes ni scripts externos). ES/EN.

- `index.html`, `estilo.css`, `app.js` (solo DOM) y `logica.mjs` (agregacion y orden, pura, probada en `src/web/`).
- `datos.json` lo genera `npm run web:datos` (`scripts/construir-web.mjs`) leyendo `results/<modelo>/<fecha>.json` (`esquema_version` 1, ver ADR-004). Toma la corrida mas reciente de cada modelo. Con `results/` vacio queda `"modelos": []` y la pagina muestra "Aun no hay corridas publicadas".
- Puesto global y por dominio: puntaje = (aciertos de opcion multiple + suma de la rubrica de abiertas) / (preguntas MC + abiertas juzgadas). Empates comparten puesto. Decision de F5: el formato de resultados no define un puntaje compuesto; las 4 metricas se muestran por separado.
- `fetch('datos.json')` y los modulos ES exigen servir por HTTP (no abrir `index.html` con `file://`). Ver `docs/fases/CHECKLIST-F5.md`.

Verificacion obligatoria en telefono real con DevTools cerrado antes de publicar (regla 5, `CLAUDE.md`). Plan: `docs/fases/FASE-5-PUBLICACION.md`.
