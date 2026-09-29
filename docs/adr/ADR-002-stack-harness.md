# ADR-002 — Stack del harness: Node + TypeScript, LM Studio via API compatible-OpenAI

**Fecha:** 2026-09-29 · **Estado:** Propuesto — falta revision de Luis

## Contexto

La ficha de Notion pide un harness en "Node + TypeScript (Python no esta en
la laptop)", con clientes para las APIs de Anthropic, OpenAI y Gemini, mas un
cliente para LM Studio (servidor local compatible con la API de OpenAI) para
correr modelos pequenos que quepan en los 8 GB de RAM de la laptop. El
estandar comun de portafolio (regla 10) ya establece que Python solo corre en
GitHub Actions o Colab, nunca local.

## Decision

1. **Node + TypeScript** para todo el harness (`src/`): runner, clientes,
   cache y juez. Un solo lenguaje, coherente con el resto del portafolio
   (Orinoco Digital tambien es Node), sin friccion de instalar un entorno
   Python que la laptop no tiene.
2. **Un cliente por proveedor**, no una libreria de abstraccion multi-proveedor
   de terceros. Cada proveedor tiene su SDK oficial (Anthropic, OpenAI,
   Gemini) y las diferencias entre ellos (formato de function calling,
   limites de contexto, manejo de errores) son justo lo que un cliente propio
   necesita controlar con precision para la cache y el tope de gasto.
3. **LM Studio se habla con el mismo contrato compatible-OpenAI** que ya
   necesita el cliente de OpenAI, apuntando a `LMSTUDIO_BASE_URL` en vez de
   `api.openai.com`. No hace falta un cuarto SDK: es el mismo cliente HTTP
   con una URL base distinta y sin necesidad de API key real.
4. **Sin dependencias de orquestacion** (frameworks de agentes, colas, etc.)
   para el runner del piloto (F3): el volumen inicial (30 preguntas x 2
   modelos) no lo justifica. Se reevalua si F4 (150 preguntas x 4-6 modelos)
   muestra que hace falta paralelismo o reintentos mas sofisticados que un
   bucle simple con backoff.

## Alternativas consideradas

- **Python con un framework de evals existente** (ej. algo tipo
  promptfoo/lm-eval-harness) — descartado de raiz: Python no esta instalado
  localmente y montarlo solo para este proyecto contradice la regla 10 del
  estandar de portafolio.
- **Una libreria multi-proveedor tipo Vercel AI SDK o LangChain** — descartada
  por ahora: anade una capa de abstraccion y una dependencia mas grande de lo
  que el proyecto necesita para 3-4 proveedores con SDKs oficiales estables;
  se reconsideraria si el numero de proveedores creciera mucho o si la
  abstraccion ahorrara mas codigo del que cuesta entender.
- **Servidor propio para exponer LM Studio bajo un contrato distinto** —
  innecesario: LM Studio ya expone un servidor compatible-OpenAI de forma
  nativa.

## Consecuencias

- El cliente de OpenAI y el de LM Studio comparten casi todo el codigo:
  conviene factorizar un cliente "compatible-OpenAI" parametrizado por
  `baseURL` y si hace falta o no una API key real, en vez de duplicar codigo.
  Ese detalle de implementacion se resuelve en F3, no aqui.
- El harness depende de que LM Studio este corriendo localmente y accesible
  en `LMSTUDIO_BASE_URL` para poder correr los modelos locales — es una
  dependencia de entorno de quien ejecute el harness, documentada en
  `.env.example` y en `README.md`.
- Ninguna dependencia nueva mas alla de los SDKs oficiales de Anthropic,
  OpenAI y Gemini entra sin pasar primero por un ADR, segun la regla 8 del
  estandar comun.

## Cuando reconsiderar

- Si en F4 el runner secuencial resulta demasiado lento para 150 preguntas x
  4-6 modelos y hace falta paralelismo real con control de tasa por
  proveedor, un ADR nuevo puede introducir una cola simple (sin llegar
  necesariamente a un framework externo).
- Si aparece un quinto proveedor con un contrato de API muy distinto a los ya
  cubiertos, se evalua entonces si sigue teniendo sentido "un cliente por
  proveedor" o si conviene una abstraccion comun.
