---
license: cc-by-4.0
language:
  - es
pretty_name: eval-ve
task_categories:
  - question-answering
tags:
  - legal
  - benchmark
  - venezuela
  - tax
  - customs
  - commercial-law
size_categories:
  - n<1K
---

# eval-ve

> **Aviso: esto NO es asesoria legal, fiscal ni aduanera.** Es un conjunto de preguntas para medir conocimiento normativo de modelos de IA. Un buen resultado no sustituye a un abogado, a un contador ni a un agente aduanal. Ver `DISCLAIMER.md` en el repositorio.

## Que es

Preguntas sobre normativa venezolana en tres dominios: `tributario`, `aduanas` y `mercantil`. Hay dos tipos: `opcion_multiple` y `abierta`. Es la parte de datos de [eval-ve](https://github.com/lifelece/eval-ve), que incluye el harness de evaluacion (Node + TypeScript) y una tabla de posiciones.

Cada registro tiene: `id`, `dominio`, `tipo`, `pregunta`, `opciones` (solo opcion multiple), `respuesta`, `articulo_ref`, `norma`, `gaceta`, `dificultad`, `vigente`, `reemplazada_por`, `validado_por`, `fecha_validacion`. El esquema esta en `schema/pregunta.schema.json` del repositorio (ADR-001).

Archivo: `preguntas.jsonl` (JSON Lines, un objeto por pregunta). Version del conjunto: `0.1.0` (2026-11-12). Numero de preguntas publicadas: 150 (50 por dominio; 106 de opcion multiple y 44 abiertas).

## Procedencia

Las preguntas se redactaron con asistencia de un modelo de IA a partir de textos normativos oficiales vigentes, y el autor las valido. Cada una cita articulo, norma y Gaceta Oficial, y un script comprueba que el fragmento que la sostiene aparece literalmente en el texto citado. El campo `validado_por` solo lo llena el autor tras verificar la pregunta contra la fuente; vacio significa sin validacion humana y esa pregunta no cuenta en resultados publicables. Estado de validacion al 2026-11-12: 150 de 150 (las 30 del piloto, revisadas una por una el 2026-10-26; las 120 restantes, selladas por el autor el 2026-11-12). Limite conocido: las preguntas del Codigo de Comercio parten de una transcripcion de un tercero, no de la Gaceta.

El dataset no copia el texto integro de las leyes. El regimen de derechos de los textos de `corpus/` se documenta en ADR-003 del repositorio.

## Licencia

Las preguntas se publican bajo **CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/). Atribucion: Luis Carlos Vasquez, eval-ve. El codigo del repositorio es MIT.

## Uso previsto

Comparar modelos de IA en conocimiento normativo venezolano con metodologia publica y trazable. No esta pensado para entrenar sistemas de asesoria ni para decisiones legales o fiscales.

## Limitaciones

- **Juez LLM:** las preguntas abiertas se califican con un modelo de lenguaje con rubrica (correcta, parcial, incorrecta). Puede equivocarse; se revisa a mano una muestra.
- **Tamano de muestra:** el conjunto es pequeno, las diferencias de pocos puntos no son concluyentes.
- **Alucinacion normativa:** la tasa que reporta el harness es una senal del juez, no una verificacion contra el texto de las normas.
- **Cobertura parcial** de las tres ramas del derecho.
- **Vigencia:** cada pregunta congela la version de la norma citada en su Gaceta; una reforma posterior no edita la pregunta, la marca (`vigente`, `reemplazada_por`).
- **Contaminacion:** el conjunto publico puede acabar en datos de entrenamiento de modelos futuros.
- **Opciones:** el orden de las opciones es el del dataset (sesgo de posicion sin medir).

## Conjunto privado

Una parte de las preguntas (control de contaminacion) **no se publica** ni en GitHub ni en Hugging Face. Sirve para detectar si un modelo memorizo el conjunto publico.

## Como citar

Ver `CITATION.cff` en el repositorio: Vasquez, L. C. eval-ve. https://github.com/lifelece/eval-ve. DOI: `[doi_pendiente]`.

## Contacto

Issues del repositorio: https://github.com/lifelece/eval-ve/issues
