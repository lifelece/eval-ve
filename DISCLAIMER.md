# Aviso importante / Important notice

*English version below.*

## Español

### Que es este proyecto

`eval-ve` es un benchmark **educativo y de investigacion abierta** que mide
que tan bien responden distintos modelos de IA preguntas sobre normativa
venezolana (tributos, aduanas y derecho mercantil). Es un proyecto personal
de Luis Carlos Vasquez, construido con fuentes publicas y una metodologia
documentada.

### Que NO es

- **No es asesoria legal, fiscal ni aduanera.** Nada en este repositorio, en
  el dataset, en el harness ni en la tabla de posiciones debe usarse para
  tomar decisiones legales, fiscales o de comercio exterior reales.
- **No sustituye a un abogado, un contador publico ni a un agente aduanal.**
  Un modelo con buen puntaje en este benchmark sigue sin estar cualificado
  para asesorar en un caso real.
- **No es una fuente oficial.** No esta afiliado al SENIAT, al Ministerio de
  Finanzas, a la Asamblea Nacional, a ningun colegio profesional ni a ninguna
  institucion del Estado venezolano.
- **No garantiza que las respuestas de los modelos evaluados sean correctas.**
  Medir errores y alucinaciones normativas es justamente el objetivo del
  proyecto — la existencia de una respuesta en este repositorio no la vuelve
  confiable.

### Sobre la exactitud del dataset

Cada pregunta del dataset lleva su `articulo_ref` (articulo exacto), `norma`
y `gaceta` (numero de Gaceta Oficial de la version usada). Las normas
venezolanas se reforman; una pregunta puede quedar desactualizada respecto a
la version vigente de una ley. Cuando eso ocurre, la pregunta original se
marca como no vigente y se congela a la version con la que fue escrita —
ver `docs/adr/ADR-001-esquema-de-preguntas.md`. **La fecha de la Gaceta
Oficial citada en cada pregunta es la unica garantia de vigencia que ofrece
este proyecto, y solo para esa version.**

### Neutralidad

Este proyecto describe la normativa venezolana con datos y fuentes. **No
toma posicion politica** sobre el gobierno de Venezuela, el regimen
cambiario, el SENIAT ni ninguna institucion mencionada.

### Contacto

Errores, correcciones y sugerencias: via issues en el repositorio de GitHub.

---

## English

### What this project is

`eval-ve` is an **educational, open-research benchmark** that measures how
well different AI models answer questions about Venezuelan law (tax, customs,
and commercial/corporate law). It is a personal project by Luis Carlos
Vasquez, built from public sources with a documented methodology.

### What this project is NOT

- **This is not legal, tax, or customs advice.** Nothing in this repository,
  the dataset, the harness, or the leaderboard should be used to make real
  legal, tax, or foreign-trade decisions.
- **It does not replace a lawyer, a certified public accountant, or a customs
  broker.** A model scoring well on this benchmark is still not qualified to
  advise on a real case.
- **It is not an official source.** It is not affiliated with SENIAT, the
  Ministry of Finance, the National Assembly, any professional association,
  or any Venezuelan state institution.
- **It does not guarantee that evaluated models' answers are correct.**
  Measuring errors and regulatory hallucination is precisely the point of
  this project — an answer appearing in this repository does not make it
  reliable.

### On dataset accuracy

Every question in the dataset carries its `articulo_ref` (exact article),
`norma` (law name), and `gaceta` (Official Gazette number of the version
used). Venezuelan law is amended over time; a question may become outdated
relative to the current version of a law. When that happens, the original
question is marked as no longer current and frozen to the version it was
written against — see `docs/adr/ADR-001-esquema-de-preguntas.md`. **The
Gazette date cited in each question is the only currency guarantee this
project offers, and only for that specific version.**

### Neutrality

This project describes Venezuelan regulation using data and sources. **It
takes no political position** on the Venezuelan government, exchange-control
policy, SENIAT, or any institution it mentions.

### Contact

Errors, corrections, and suggestions: via issues on the GitHub repository.
