# Fase 1 — Corpus

> **Gate de entrada:** Fase 0 aprobada por Luis. Ademas, ver la nota de
> calendario: esta fase espera a que el Radar de universidades cierre su
> propia F2, salvo que Luis diga explicitamente lo contrario.
> **Gate de salida:** lista de normas y versiones (con Gaceta Oficial)
> aprobada por Luis.

**Tiempo estimado:** no fijado por la ficha · **Estado:** pendiente

## Objetivo

Reunir los textos oficiales **vigentes** de las normas tributarias, aduaneras
y mercantiles que se van a usar como fuente de las preguntas, organizados en
`corpus/` con el numero de Gaceta Oficial de la version usada de cada una.
Luis verifica la vigencia de cada norma — esa verificacion es el contenido
real del gate, no un formalismo.

## Entregables

- `corpus/tributario/`, `corpus/aduanas/`, `corpus/mercantil/` — un archivo o
  carpeta por norma, con su metadata (nombre, numero de Gaceta, fecha, fuente
  o URL, vigente si/no) en un formato consistente (a definir con Luis: puede
  ser un `.md` por norma con front-matter, o un `docs/CORPUS.md` tabular).
- Lista de normas y versiones aprobada por Luis — esta lista es literalmente
  el gate de salida.
- Resolucion de la pregunta abierta de F0: regimen de derechos de `corpus/`
  (ver `LICENSE-DATA` y ADR-001). Si hace falta, un ADR nuevo lo formaliza.

## Pasos para Claude Code

1. Releer este guion y `CLAUDE.md` completo antes de tocar nada.
2. Confirmar con Luis, en una frase, que el gate de calendario del Radar ya se
   cumplio o que el da luz verde explicita a empezar antes.
3. Proponer la estructura de `corpus/` (carpetas por dominio, formato de
   metadata por norma) para que Luis la apruebe antes de llenarla.
4. **No generar ni completar el contenido de ninguna ley.** Los textos legales
   los aporta Luis (o una fuente oficial que el senale, como la Gaceta Oficial
   Electronica o el sitio de la Asamblea Nacional/SENIAT). Claude Code no
   redacta ni resume articulos de memoria: el riesgo de alucinar un articulo
   inexistente es exactamente lo que este proyecto existe para medir en otros
   modelos, y seria inaceptable cometerlo aqui.
5. Para cada norma que Luis aporte: registrar nombre completo, numero de
   Gaceta Oficial, fecha de publicacion, fuente/URL y si esta vigente a la
   fecha de la sesion. Si algun dato falta, dejar un placeholder visible
   (`[gaceta_pendiente]`) y preguntar — nunca inventarlo.
6. Dejar la lista de normas lista para que Luis la revise dato por dato.

## Criterios de salida

- Lista de normas con su Gaceta Oficial, completa y revisada por Luis.
- Cada norma en `corpus/` indica su fuente y si esta vigente.
- La pregunta abierta de derechos sobre `corpus/` esta resuelta o
  explicitamente pospuesta con dueno y fecha.
- Ningun texto legal fue generado o completado por Claude Code sin fuente.

## STOP GATE

> **Pendiente.** No se ejecuta esta fase hasta que Luis apruebe F0 y confirme
> el punto de calendario del Radar.

El gate es la revision de Luis de la lista de normas y versiones — no del
codigo ni de la estructura de carpetas, que son secundarias aqui. Sin esa
lista verificada, no hay base confiable para escribir preguntas en F2.
