# eval-ve — Contexto para Claude Code

> Lee este archivo COMPLETO al inicio de cada sesion. Es la memoria del proyecto
> y la principal defensa contra alucinaciones normativas, que en este proyecto
> son el riesgo central.

## Que es

Benchmark abierto que mide que tan bien responden los modelos de IA preguntas
sobre **normativa venezolana**: tributos, aduanas y derecho mercantil. Incluye
dataset, script de evaluacion (harness) y una tabla de posiciones publica.

Proyecto personal, en solitario, tiempo parcial. Autor: Luis Carlos Vasquez.

**Por que existe.** Los roles de AI Training & Data Quality estan entre los
remotos mejor pagados en LATAM; escribir evals es una habilidad escasa. Este
proyecto convierte lo que Luis estudio (Legislacion Fiscal, Trafico y Aduana,
Legislacion Mercantil) en un activo tecnico demostrable. El README en ingles es
ademas su practica: muchos de esos roles piden ingles.

**Encuadre honesto:** es un benchmark de conocimiento normativo con metodologia
publica y trazable. NO es asesoria legal, fiscal ni aduanera — ver
`DISCLAIMER.md`. Un modelo con buen puntaje aqui no sustituye a un abogado, a un
contador ni a un agente aduanal.

## Roles

- **Luis** — lider de dominio y validador. Reune los textos legales oficiales,
  escribe y valida cada pregunta con su articulo de respaldo, revisa a mano una
  muestra de las correcciones automaticas del juez LLM, interpreta resultados,
  decide alcance y aprueba cada STOP gate.
- **Claude (chat)** — estrategia, specs y auditorias; documenta en Notion.
- **Claude Code (tu)** — motor de ejecucion. Construyes el harness y la web.
  Implementas por fases y **te detienes en cada gate**.

## Reglas especificas de este proyecto (no negociables)

1. **Nunca inventes articulos, leyes ni numeros de Gaceta Oficial.** Si no
   tienes la fuente exacta, no escribas el dato: usa un placeholder visible
   (`[articulo_pendiente]`, `[gaceta_pendiente]`) o preguntale a Luis en una
   frase. Un placeholder es correcto; un articulo inventado es el peor fallo
   posible en un proyecto cuyo valor ES medir alucinacion normativa ajena.
2. **Toda pregunta lleva `articulo_ref` y `gaceta`.** Sin los dos campos
   completos y con fuente verificable, la pregunta no entra a `data/`. Ver el
   esquema en `docs/adr/ADR-001-esquema-de-preguntas.md`.
3. **Solo Luis llena `validado_por`.** Claude Code puede proponer preguntas y
   borradores, pero nunca marca una pregunta como validada. `validado_por`
   vacio significa "sin validar humano" y esa pregunta no cuenta en resultados
   publicables.
4. **Las preguntas privadas nunca llegan al repo publico.** El 20% de control
   de contaminacion vive fuera de git (ver `.gitignore` y ADR-001). Antes de
   cualquier `git add`, confirma que ningun archivo de preguntas privadas quedo
   incluido.
5. **Cache obligatoria de respuestas de modelos + tope de gasto por corrida.**
   Ninguna corrida del harness vuelve a pagar por una pregunta ya respondida
   por ese modelo en esa version del dataset. El limite de gasto por corrida es
   configurable y el harness debe frenar antes de excederlo, no despues.
6. **Aviso de no-asesoria visible** en `README.md`, `DISCLAIMER.md` y en la
   tabla de posiciones web cuando exista. No es opcional ni un pie de pagina
   discreto.
7. **Neutralidad.** Tributos, aduanas y derecho mercantil venezolano tocan
   temas sensibles (SENIAT, regimen cambiario, control de importaciones). Se
   documentan hechos con fuente — norma y Gaceta — sin opinion politica.
8. **Este proyecto no toca nada de los negocios del autor.** Ni codigo, ni
   datos, ni menciones (regla heredada del estandar de portafolio). Nada del
   uso privado del autor entra al repo; la lista concreta vive fuera del
   repo.

## Estandar de desarrollo heredado del portafolio, adaptado

1. **Spec antes que codigo (SDD).** La ficha de Notion es la spec; este
   `CLAUDE.md` es su espejo vivo en el repo.
2. **El repo manda.** `CLAUDE.md` en la raiz, `docs/fases/` con el guion de
   cada fase, `docs/adr/` con un archivo por decision (`ADR-001...`). Si Notion
   y el repo se contradicen, manda el repo hasta que un ADR diga otra cosa.
3. **STOP gate al final de cada fase.** Claude Code se detiene y Luis aprueba
   antes de que empiece la fase siguiente. No se encadenan fases por iniciativa
   propia.
4. **Nada se commitea sin que Luis revise el diff.** Claude Code prepara los
   archivos y el mensaje de commit; Luis ejecuta `git add` / `git commit` /
   `git push`. Commits pequenos y frecuentes.
5. **Verificacion en dispositivo real** para cualquier interfaz web (la tabla
   de posiciones de la Fase 5): telefono real, datos moviles, DevTools cerrado.
6. **Static-first.** La web de resultados (F5) es una pagina estatica
   (Vercel o GitHub Pages) que lee `results/`; sin backend hasta que un
   criterio real lo exija.
7. **Contrato de datos propio.** Cada pregunta ya lleva `articulo_ref` +
   `norma` + `gaceta` como su fuente, mas `validado_por` y `fecha_validacion`
   como sello humano. Es una version mas estricta del contrato
   fuente/confianza/ultima_verificacion de los demas proyectos del portafolio.
8. **Ninguna dependencia nueva sin ADR.** Presupuesto: 150 KB comprimidos de JS
   propio en `web/`.
9. **i18n ES/EN** desde el primer commit: `README.md` y `DISCLAIMER.md`
   bilingues ya en la Fase 0; la web de la Fase 5 hereda el mismo patron.
10. **Python no esta instalado en la laptop.** Todo el harness es Node + TS.
    Si algun dia hace falta Python (por ejemplo para analisis exploratorio),
    corre en GitHub Actions o Colab, nunca local.
11. **Tokens y claves restringidos, nunca en el bundle ni en el repo.**
    `.env` con las claves de Anthropic/OpenAI/Gemini y la URL de LM Studio;
    `.env` en `.gitignore`, `.env.example` con claves vacias.
12. **Auditoria de secretos antes de cada push publico.** Claves, `.env`,
    cache de respuestas (puede contener texto de prompts con datos sensibles
    de prueba), preguntas privadas.
13. **Publicacion (Fase 5):** README bilingue, licencias claras, dataset en
    Hugging Face con dataset card, `CITATION.cff`.
14. **Bitacora en Notion** al cierre de cada sesion: que se hizo, que bloquea,
    pendientes del autor.
15. **Neutralidad.** Hechos con fuente, sin opinion politica. Copyright: nunca
    copiar el texto integro de una ley con licencia restrictiva sin verificar
    su regimen de derechos (pregunta abierta de la Fase 1).

## Stack (no cambiar sin ADR)

- **Harness:** Node + TypeScript. Python no esta disponible en la laptop.
- **Clientes de modelo:**
  - Anthropic API, OpenAI API, Gemini API — SDKs oficiales.
  - **LM Studio** — servidor local compatible con la API de OpenAI, para
    modelos pequenos que quepan en 8 GB de RAM. Se habla con el mismo cliente
    HTTP compatible-OpenAI que los modelos remotos "tipo OpenAI", apuntando a
    `LMSTUDIO_BASE_URL` en vez de `api.openai.com`.
- **Dataset:** `data/preguntas.jsonl`, JSON Lines, un objeto por pregunta.
- **Resultados:** `results/<modelo>/<fecha>.json`.
- **Web:** pagina estatica de tabla de posiciones (Vercel o GitHub Pages),
  sin framework pesado hasta que un ADR lo justifique.
- **Publicacion del dataset:** Hugging Face Datasets, con dataset card.

**Prohibido sin ADR previo:** framework de frontend (React/Vue/Svelte) para la
tabla de posiciones si una pagina estatica alcanza; cualquier dependencia
nueva en el harness que no sea SDK oficial de un proveedor o utilidad de
Node nativa.

## Estructura prevista

```
eval-ve/
  CLAUDE.md  DISCLAIMER.md  README.md
  LICENSE  LICENSE-DATA
  .env.example  .env  .gitignore
  package.json
  docs/
    fases/     Guion de cada fase (F0..F6), con su STOP gate
    adr/       Un archivo por decision (ADR-001, ADR-002...)
  schema/
    pregunta.schema.json   JSON Schema del esquema de cada pregunta
  corpus/      Textos legales oficiales vigentes, por dominio (Fase 1)
  data/
    preguntas.jsonl        Dataset publico (Fase 2+)
    privadas/               20% de control de contaminacion — NUNCA a git
  results/
    <modelo>/<fecha>.json  Salida de cada corrida del harness (Fase 3+)
  src/
    runner/    Orquesta preguntas -> modelos -> respuestas
    clientes/  Un cliente por proveedor (anthropic, openai, gemini, lmstudio)
    juez/      Juez LLM con rubrica + metricas
    cache/     Cache de respuestas por (pregunta, modelo, version del dataset)
  web/         Tabla de posiciones estatica (Fase 5)
```

Ninguna de estas carpetas tiene contenido de dominio todavia salvo los
`README.md` de marcador de posicion: eso es trabajo de F1 en adelante.

## Mapa de fases y STOP gates

| Fase | Nombre | Gate de salida |
|---|---|---|
| F0 | Setup | Estructura del repo aprobada por Luis |
| F1 | Corpus | Lista de normas y versiones (Gaceta) aprobada |
| F2 | Piloto | 30 preguntas (10 por dominio) revisadas una por una |
| F3 | Harness | Corrida piloto con 2 modelos revisada |
| F4 | Escala | 150 preguntas, 4-6 modelos; revision humana del 20% |
| F5 | Publicacion | Checklist de publicacion completo |
| F6 | LinkedIn | Sin gate — post de cierre |

Detalle operativo de cada fase en `docs/fases/`. **Nota de calendario:** la
ficha de Notion dice que eval-ve arranca "tras F2 del Radar [de universidades]".
Luis pidio la Fase 0 de todos los proyectos del portafolio el mismo dia, sin
costo. **F1 de eval-ve espera a que el Radar cierre su F2, salvo que Luis
diga explicitamente otra cosa** — ver `docs/fases/FASE-1-CORPUS.md`.

## Secretos

- Claves en `.env`, nunca en el repo ni en `results/` ni en la cache de
  respuestas. `.env.example` documenta las variables sin valores.
- `LMSTUDIO_BASE_URL` no es secreta (es local, `http://localhost:1234/v1`),
  pero vive en `.env` igual por consistencia y porque puede cambiar de host.
- Antes de cualquier push publico: auditoria de secretos + confirmar que
  `data/privadas/` no quedo en el diff.

## Riesgos activos (de la ficha)

- **No es asesoria legal** — aviso visible siempre.
- **Normas desactualizadas** — cada pregunta congela su version via `gaceta`;
  una reforma no edita la pregunta existente, ver ADR-001.
- **Costo de API** — cache obligatoria + tope de gasto por corrida.
- **Contaminacion** — 20% de preguntas privadas, nunca publicadas, para
  detectar si un modelo memorizo el set publico.

## Estado actual

**Fase 0 — en cierre, pendiente de aprobacion de Luis.** Repo creado, sin
commit todavia (regla 4). Sin dataset, sin corpus, sin harness: eso empieza en
F1. Ver `docs/fases/FASE-0-SETUP.md` para el detalle de lo entregado y lo que
falta decidir en el gate.

## Al empezar una sesion

1. Lee este archivo completo.
2. Lee el archivo de la fase activa en `docs/fases/README.md` -> fase
   correspondiente.
3. Confirma en una frase que fase vas a trabajar antes de escribir codigo o
   preguntas.
4. Si la fase activa es F1 o posterior, confirma primero que el gate de la
   fase anterior esta marcado como aprobado por Luis en su guion.
