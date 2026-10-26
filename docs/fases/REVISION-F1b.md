# Revision F1b — hoja para el gate de Luis

**Fecha:** 2026-10-26 · **Alcance:** 16 fichas nuevas (13 en `corpus/tributario/`, 3 en la carpeta nueva `corpus/cambiario/`) · **Vigentes: 12 · No vigentes: 3 · Dudosa: 1**
No se tocaron las 23 fichas de F1. Ninguna ficha esta validada (`validado_por: null`). Cero textos de normas copiados al repo (ADR-003).

**Como se leyo.** gacetaoficial.gob.ve respondio hoy para el *registro* de 5 Gacetas (numero, tipo y fecha: lectura **directa**); el contenido de cada providencia salio del buscador Exa (`agent-reach web search`) y de firmas/medios que reproducen la Gaceta: lectura **indice-exa**. El BCV se leyo directo (lista de convenios, estado "Vigente"). **Ninguna providencia se ha abierto en el PDF primario del SAINGO o del SENIAT**: la columna "Confianza" es `media` salvo el Convenio Cambiario N° 1 (`alta`). Cada ficha trae el campo extra `lectura` (directa / indice-exa); es el unico campo anadido al formato de F1.

## 1. Arriba: lo que cambia con fecha (el riesgo mayor para un benchmark)

Tres pares de normas con vigencia **futura** o **derogatoria publicada**. Un modelo con corte anterior a oct 2026 no las conoce, asi que son buenas preguntas y malas si la fecha de referencia no queda fija.

| Norma | Estado al 2026-10-26 | Cambio | Ficha |
|---|---|---|---|
| Sujetos pasivos especiales, SNAT/2026/00099 (G.O. 43.485, 22/10/2026) | `vigente: no` = **todavia no** | Entra en vigencia el **2026-11-01**; deroga SNAT/2023/00005 | `sujetos-pasivos-especiales-snat-2026-00099.md` |
| Sujetos pasivos especiales, SNAT/2023/00005 (G.O. 42.588, 14/03/2023) | vigente | Deja de regir el 2026-10-31 | `sujetos-pasivos-especiales-snat-2023-00005.md` |
| Facturacion, SNAT/2026/00093 (G.O. 43.484, 21/10/2026) | `vigente: no` = **todavia no** | Entra en vigencia **2027-04-19** (180 dias continuos, fecha calculada); deroga 2011/00071, 2018/0141 y 2024/000102 | `facturacion-snat-2026-00093.md` |
| Facturacion 2011/00071, imprentas y maquinas 2018/0141, medios digitales 2024/000102 | vigentes | Rigen hasta 2027-04-18 | 3 fichas en `corpus/tributario/` |

**Decision tuya (D-1):** `vigente` solo admite si/no/dudosa. Para "publicada, aun no en vigor" use `no` y lo explico en `vigilancia`. Recomendacion: aceptar asi y que cada pregunta de F2 fije su fecha de referencia (ADR-001 ya congela la version por `gaceta`). Alternativa: anadir un cuarto valor `futura` al esquema; cuesta tocar `schema/`.

## 2. Dudosas y puntos a abrir en la Gaceta

| # | Norma | Duda | Fuente |
|---|---|---|---|
| 1 | Decreto 1.808, retenciones de ISLR (G.O. 36.203, 12/05/1997) | `dudosa`. Anterior a la reforma ISLR 2015; sin ficha oficial de vigencia. Hoy lo aplican todas las tablas de 2025-2026 y el calendario del SENIAT (fuentes secundarias). Probablemente vigente. Es la norma de retenciones de ISLR mas usada. | IVECOFI; Grant Thornton |
| 2 | SNAT/2026/00093 y SNAT/2026/00099 | Gacetas de hace 4-5 dias: el registro oficial devolvio 404 y un despacho dijo que la 43.484 "aun no ha circulado oficialmente". Texto de la 43.484 leido en un facsimil de un medio; la 43.485 solo en resumenes concordantes. Abrir ambas G.O. y comprobar: fecha de entrada en vigor, derogatorias, y si hay reimpresion. La fecha del acto de la 00099 es `[pendiente]`. | Banca y Negocios (PDF); IVECOFI, AdaContable, Cachicamo |
| 3 | Convenio Cambiario N° 20 (G.O. 39.968, 19/07/2012; modif. G.O. 40.002) | Antecedente derogado por el art. 88 del Convenio N° 1. Numeros y fechas de Gaceta salen solo de blogs: `confianza: baja`. Se incluye porque es la trampa tipica ("cuentas en divisas"). Si prefieres no cargar un dato de baja confianza, se elimina la ficha. | venelogia, blogs |
| 4 | SNAT/2025/000054, retencion de IVA (G.O. 43.171, 16/07/2025) | Numero/fecha confirmados en el registro oficial; fecha de entrada en vigor del texto `[pendiente]`. Un sitio (IVECOFI) imprime "2015" por error tipografico. La providencia anterior (SNAT/2015/0049) tiene dos fechas (acto 14/07/2015 vs G.O. 40.720 del 10/08/2015). | gacetaoficial.gob.ve; PwC; Grant Thornton; HLB |
| 5 | SNAT/2018/0141 | Se escribe "0141" y "00141" segun la fuente; el texto de 00093 lo cita como 00141. | IVECOFI; texto de 00093 |
| 6 | SNAT/2026/00093, derogatoria | La propia Gaceta cita SNAT/2009/0102 como "G.O. 39.290 del 22 de octubre del 2008" (el año no cuadra con la providencia de 2009). Copiado tal cual; abrir la Gaceta. | facsimil de la G.O. 43.484 |
| 7 | Decreto Constituyente derogatorio del regimen cambiario (G.O. 41.452, 02/08/2018) | Art. 3 (salvedades) no leido; Gaceta de la ley derogada `[pendiente]`. | despacho Prestigio Abogados; MPPEF |
| 8 | Decreto 4.972 (IGTF 0%) | Alicuota "temporal"; no se busco decreto posterior a jul 2024. La alicuota general del 3% la dan las fuentes secundarias, no se verifico en la ley. | IVECOFI; Acceso a la Justicia |

## 3. Decisiones que son tuyas

1. **Carpeta `cambiario` (D-2).** Recomendacion: **carpeta nueva `corpus/cambiario/`**. Porque (a) emisor y base legal distintos: BCV + Ejecutivo bajo la Ley del BCV, no SENIAT bajo el COT; (b) no es mercantil: no regula contratos ni sociedades sino operaciones en divisas; (c) lo que cruza con tributos (tipo de cambio para base imponible, IGTF por pagos en divisas) se resuelve con enlaces desde las fichas, no mezclando dominios. Costo: F2 planea 10 preguntas por dominio, y un cuarto dominio con solo 3 normas no sostiene 10 preguntas sin repetirse. Opciones: (i) `cambiario` con ~5 preguntas, (ii) subcarpeta de `tributario` y mantener los 3 dominios de F2. Ambas son validas; la primera da mejor trazabilidad.
2. **Alcance cambiario.** Quedaron fuera por tiempo y se pueden anadir: Resolucion BCV 19-09-03 (intervencion cambiaria, G.O. 41.742, 21/10/2019), Resolucion 19-05-01 (mesas de cambio, G.O. 41.624, 02/05/2019), Aviso Oficial sobre operaciones al menudeo (G.O. 41.580, 06/02/2019), Aviso de tipo de cambio para tributos (G.O. 41.360, 14/03/2018) y el Aviso de comisiones del 06/08/2026 (G.O. 7.073 Ext., 11/09/2026). Todos salen de las listas del BCV (lectura directa). Falta decidir cuales importan; no los cargue para no pasar de ~15.
3. **Candidatas SENIAT no cargadas:** calendario de sujetos pasivos especiales 2026 (SNAT/2025/000091, G.O. 43.273 del 02/12/2025, reimpreso G.O. 43.283 del 23/12/2025; cambia cada año), SNAT/2024/000121 (proveedores de sistemas de facturacion, derogada) y la providencia de la G.O. 43.435 que la deroga (numero no verificado), SNAT/2015/0049 (retencion IVA anterior, derogada).
4. **Vigilancia heredada de F1 que esto cierra en parte:** decretos del IGTF 2024-2026 (ahora 4.647 y 4.972 con ficha). Sigue abierto: la reforma tributaria anunciada en oct 2026.

## 4. Lo que sale bien (no requiere tu atencion)

- Convenio Cambiario N° 1 (G.O. 6.405 Ext., 07/09/2018): listado por el BCV como unico convenio, "Vigente"; los avisos BCV de 2026 lo citan como vigente. Unica ficha `alta`.
- Unidad tributaria (SNAT/2025/000048, G.O. 43.140, 02/06/2025): valor sujeto a reajuste, usarlo siempre con fecha.
- RIF (SNAT/2026/00080, G.O. 43.435, 12/08/2026): reforma parcial; el titulo exacto de la providencia reformada es `[pendiente]`.
- IGTF: percepcion (SNAT/2022/000013, G.O. 42.339) y exoneracion/no sujecion (Decreto 4.647, G.O. 6.689 Ext.), ambas aun citadas en un boletin de dic 2025.

Cero textos de normas fueron descargados ni copiados al repo. Los datos de cada ficha traen su fuente y su modo de lectura.
