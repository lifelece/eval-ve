# ADR-003 — Regimen de derechos de `corpus/` (textos legales)

**Fecha:** 2026-10-26 · **Estado:** Propuesto (pendiente de Luis; no es asesoria legal)

## Contexto

`LICENSE-DATA` deja abierta la pregunta: no se asume que los textos legales venezolanos sean de dominio publico ni que tengan licencia abierta, y por defecto se guardan "hechos + enlace, nunca el texto integro". La Fase 1 debe resolverla o posponerla con dueno y fecha (`docs/fases/FASE-1-CORPUS.md`, criterios de salida). El repo es privado hoy y sera publico en F5, junto con un dataset CC BY 4.0.

Hallazgo de esta investigacion (a verificar contra la fuente primaria):

- La Ley sobre el Derecho de Autor (G.O. N° 4.638 Ext., 01/10/1993) dice en su articulo 4, segun el texto reproducido por WIPO Lex: "No estan protegidos por esta Ley los textos de las leyes, decretos, reglamentos oficiales, tratados publicos, decisiones judiciales y demas actos oficiales." El mismo resultado indica una salvedad que remite al articulo 138, cuyo contenido **no se verifico**.
- El texto de la Gaceta Oficial es publicacion oficial (Gaceta Oficial de la Republica, TSJ, Asamblea Nacional, SENIAT). Lo que si puede estar protegido es el trabajo editorial de terceros: compilaciones, textos consolidados, anotaciones y PDFs de sitios privados (Justia, blogs, bufetes, etc.).
- Convenio de Berna, art. 2(4): el tratamiento de los textos oficiales lo deja a la legislacion de cada pais. No se verifico la lectura exacta del articulo en esta sesion.

Fuentes a abrir antes de aceptar: texto del art. 4 y del art. 138 en la Gaceta 4.638 Ext. (SAPI: `https://sapi.gob.ve/wp-content/uploads/2020/09/ley_derecho_de_autor.pdf`; WIPO Lex: `https://www.wipo.int/wipolex/en/text/500548`); Convenio de Berna (WIPO).

## Decision (propuesta)

Opcion recomendada, en dos pasos:

1. **Ahora (F1 y F2):** `corpus/` publica solo **fichas de metadatos** (nombre, Gaceta, fecha, URL oficial, vigencia, `ultima_verificacion`). No se guarda ni se publica el texto integro. Es lo que ya hace F1 y no depende de resolver la pregunta de derechos.
2. **Para escribir preguntas:** Luis (o el agente, bajo su gate) puede leer el texto desde la fuente oficial. Si hace falta tenerlo local para citar articulos, va a una carpeta **fuera de git** (`corpus/_textos/`, en `.gitignore`), con el PDF oficial de la Gaceta, nunca un texto consolidado de un tercero. Las preguntas citan `articulo_ref` y parafrasean; no copian articulos completos al dataset CC BY.

El texto integro de normas en el repo publico queda **pospuesto** hasta que Luis verifique el art. 4 (y el 138) en la Gaceta primaria y decida; dueno: Luis; revisar en el gate de F5 (Publicacion) a mas tardar.

## Alternativas consideradas

- **A. Publicar el texto integro de cada norma ahora.** Descartada por ahora: la salvedad del art. 138 y el estatus de las versiones consolidadas no estan verificados; ganaria comodidad, no necesidad (las fichas bastan para el gate).
- **B. (recomendada) Fichas publicas + textos locales sin publicar.**
- **C. Solo enlaces, sin textos ni locales.** Mas conservadora, pero obliga a releer la fuente en cada pregunta y la Gaceta Oficial en linea ha sido inestable (varias consultas fallaron en esta sesion).
- **D. Pedir asesoria legal formal.** Valida si Luis quiere publicar los textos; fuera del alcance de F1.

## Consecuencias

- Las fichas llevan `texto_en_repo: no` y una URL oficial; si una URL cae, la ficha conserva Gaceta y fecha para reubicarla.
- Una norma consolidada (p. ej. LOA 2020, art. 21 de la reforma) solo se usa desde la Gaceta oficial, no desde copias de terceros.
- Riesgo aceptado: el dataset depende de que las URL oficiales sigan vivas; mitigacion: guardar el PDF oficial local y su fecha de descarga.
- Trabajo futuro: `.gitignore` para `corpus/_textos/` (cambio pequeno, requiere OK de Luis por ser archivo fuera del plan).

## Cuando reconsiderar

- Si la lectura de los arts. 4 y 138 de la Ley sobre el Derecho de Autor, en la Gaceta primaria, confirma que los textos oficiales no estan protegidos: se puede publicar el texto oficial integro (ADR nuevo que supersede a este).
- Si se reforma la Ley sobre el Derecho de Autor, o si una norma del corpus resulta ser de un tercero (no oficial).
- Si F5 exige un dataset con textos de respaldo (p. ej. para contexto RAG en el harness).
