# ADR-001 — Esquema de preguntas

**Fecha:** 2026-09-29 · **Estado:** Aceptado (Luis, 2026-10-20)

## Contexto

La ficha de Notion (29/09/2026) describe el esquema de cada pregunta en
prosa: `id` (ej. `trib-001`), `dominio` (tributario/aduanas/mercantil), `tipo`
(opcion_multiple/abierta), `pregunta`, `opciones`, `respuesta`,
`articulo_ref`, `norma` + `gaceta`, `dificultad` (1-3) y `validado_por`
(Luis). Este ADR formaliza esa prosa en un contrato de datos concreto, con
tipos, obligatoriedad y reglas de negocio, para que F2 (Piloto) tenga un
esquema estable contra el cual validar antes de escribir la primera pregunta
real.

El JSON Schema completo vive en `schema/pregunta.schema.json` y es la fuente
de verdad tecnica; este ADR explica el razonamiento detras de cada decision
que el esquema por si solo no deja ver.

**Importante:** este ADR no contiene preguntas reales ni cita articulos
reales de ninguna ley venezolana. Todos los ejemplos de `articulo_ref`,
`norma` y `gaceta` en `schema/pregunta.schema.json` estan marcados como
ficticios a proposito (regla dura de esta sesion: no inventar datos de
dominio en F0).

## Decision

### 1. Campos y obligatoriedad

Todos los campos son obligatorios en todo momento **excepto** `opciones`
(solo aplica a `opcion_multiple`) y `reemplazada_por` (solo aplica cuando
`vigente` es `false`). En particular, `articulo_ref`, `norma` y `gaceta` son
obligatorios siempre, incluso en preguntas de tipo `abierta` — es la regla
dura mas importante de este proyecto (ver `CLAUDE.md`, regla especifica 2) y
no se relaja ni para el piloto.

`validado_por` y `fecha_validacion` son obligatorios como **campos**, pero su
valor por defecto es `null`. Una pregunta con `validado_por: null` es una
pregunta valida contra el esquema pero **no publicable como resultado
validado** — el harness (F3) debe poder distinguir "no cumple el esquema" de
"cumple el esquema pero no esta validada humanamente", y son cosas distintas.

### 2. Formato de `id`

`<prefijo-dominio>-<correlativo de 3 a 4 digitos>`, con prefijos fijos
`trib`, `aduanas`, `mercantil` (el ejemplo de la ficha, `trib-001`, fija el
prefijo de tributario en `trib`, no en `tributario`). El correlativo es por
dominio, no global: `trib-001` y `aduanas-001` pueden coexistir. Un id nunca
se reutiliza ni se recicla, ni siquiera si la pregunta se retira — eso rompe
cualquier referencia externa (citas en resultados historicos, en la web de
posiciones, en el dataset publicado en Hugging Face).

### 3. Versionado ante reformas legales

La ficha advierte: "normas desactualizadas: cada pregunta guarda la version;
si hay reforma, se versiona el dataset". Este ADR decide el mecanismo
concreto:

1. Una pregunta **nunca se edita in situ** cuando la norma que la respalda se
   reforma. El `articulo_ref` + `gaceta` originales describen una foto fija
   de la norma en el momento en que la pregunta se escribio; cambiar eso
   despues rompe la trazabilidad de cualquier resultado ya publicado contra
   esa pregunta.
2. Cuando Luis detecta que una reforma afecta una pregunta existente:
   - La pregunta original pasa a `vigente: false`.
   - Se crea una pregunta **nueva**, con un `id` nuevo (siguiente correlativo
     del mismo dominio), que refleja la norma reformada con su propio
     `articulo_ref` y `gaceta` actualizados.
   - La pregunta original registra `reemplazada_por: "<id-nuevo>"`.
3. El dataset completo (`data/preguntas.jsonl`) se versiona ademas a nivel de
   archivo con un tag semver (`v0.1.0`, `v0.2.0`...) en cada release que se
   publica a Hugging Face, y un `CHANGELOG` documenta que cambio entre
   versiones. El detalle de ese changelog se define en F5 (Publicacion); este
   ADR solo fija que el mecanismo por-pregunta (`vigente` +
   `reemplazada_por`) es la fuente de verdad, y el tag de dataset es la capa
   de distribucion.

**Por que esta ruta y no simplemente editar la pregunta:** un benchmark cuyo
contenido cambia silenciosamente bajo el mismo `id` invalida comparaciones
entre corridas hechas en fechas distintas — exactamente el tipo de
inconsistencia que el proyecto le reprocha a fuentes no confiables.

### 4. Donde viven las preguntas privadas

El 20% de control de contaminacion (ficha, seccion de riesgos) usa el
**mismo esquema**, pero vive fisicamente fuera del dataset publico:
`data/privadas/*.jsonl`, listado en `.gitignore`, nunca comprometido a git ni
publicado en Hugging Face. No se distingue con un campo booleano dentro del
propio archivo publico (por ejemplo `publica: false`) porque eso obligaria a
mezclar preguntas publicas y privadas en el mismo archivo versionado y
confiar en un filtro para no publicarlas por error; separarlas por ubicacion
de archivo hace que "no esta en el repo publico" sea una propiedad
estructural, no una que dependa de que nadie olvide filtrar un campo.

### 5. Por que no hay campos genericos `fuente`/`confianza`/`ultima_verificacion`

La regla 7 del estandar comun de portafolio exige que todo registro lleve
`fuente`, `confianza` y `ultima_verificacion`. Este esquema los sustituye por
algo mas especifico y mas estricto para el dominio: `articulo_ref` + `norma`
+ `gaceta` **es** la fuente (mas precisa que un campo `fuente` generico), y
`validado_por` + `fecha_validacion` **es** la verificacion humana (mas
estricta que un campo `confianza` de tres niveles: aqui solo hay validado por
Luis o no validado, sin niveles intermedios). Se considera que este esquema
cumple el espiritu de la regla 7 con campos mas adecuados al dominio legal
que los genericos de un proyecto de datos geoespaciales.

## Alternativas consideradas

- **Un solo archivo `data/preguntas.jsonl` con campo `publica: boolean`** en
  vez de separar por ubicacion — descartada por el riesgo de publicar
  preguntas privadas por un filtro olvidado (seccion 4 arriba).
- **`confianza` de tres niveles en vez de `validado_por`/`fecha_validacion`
  binarios** — descartada: en este proyecto la validacion la hace una sola
  persona (Luis) y es binaria por diseno (regla especifica 3 de
  `CLAUDE.md`); una escala de confianza intermedia no aporta nada que
  `dificultad` (que ya mide algo distinto: la dificultad de la pregunta, no
  la certeza de la respuesta) no cubra.
- **Editar la pregunta original al reformarse la norma** — descartada,
  rompe trazabilidad de resultados historicos (seccion 3 arriba).
- **`id` correlativo global en vez de por dominio** — descartada sin mucha
  discusion: complica escribir preguntas de un dominio sin saber el ultimo
  correlativo global, y el ejemplo de la ficha (`trib-001`) ya sugiere
  numeracion por dominio.

## Consecuencias

- F2 (Piloto) puede validar sus 30 preguntas contra
  `schema/pregunta.schema.json` de forma mecanica antes de pedirle a Luis que
  las revise una por una, ahorrandole tiempo de revision en errores de forma.
- El harness (F3) puede filtrar de forma trivial "preguntas publicables"
  (`validado_por` no nulo) de "borradores" (`validado_por` nulo) sin logica
  adicional.
- El mecanismo de reformas (seccion 3) anade complejidad al dataset (una
  pregunta reformada deja dos entradas, no una), a cambio de que ninguna
  corrida historica quede invalidada silenciosamente.
- Falta decidir en F5 el formato exacto del `CHANGELOG` de versiones del
  dataset — queda anotado como pendiente, no bloquea F0 ni F1.

## Cuando reconsiderar

- Si Luis decide que quiere mas de un nivel de "confianza" en la validacion
  (por ejemplo, una revision preliminar propia mas una revision externa de un
  segundo abogado/contador), este ADR queda corto y necesita uno nuevo que lo
  supersede.
- Si aparece un cuarto dominio (por ejemplo, laboral) fuera de
  tributario/aduanas/mercantil, el `enum` de `dominio` y los prefijos de `id`
  necesitan ampliarse — ADR nuevo, no edicion silenciosa de este.
