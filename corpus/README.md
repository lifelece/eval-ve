# corpus/

Textos legales oficiales **vigentes** (tributarios, aduaneros y mercantiles)
que respaldan las preguntas del dataset, organizados por dominio.

**Vacio hasta la Fase 1.** Ver `docs/fases/FASE-1-CORPUS.md`. Ningun texto
legal se genera ni se completa de memoria por Claude Code: los aporta Luis o
una fuente oficial que el senale.

Estructura prevista una vez empiece la Fase 1:

```
corpus/
  tributario/
  aduanas/
  mercantil/
```

Cada norma registra, como minimo: nombre completo, numero de Gaceta Oficial,
fecha de publicacion, fuente/URL y si esta vigente. El regimen de derechos de
estos textos es una pregunta abierta — ver `LICENSE-DATA` en la raiz del
repo.
