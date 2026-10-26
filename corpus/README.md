# corpus/

Fichas de metadatos de las normas **tributarias, aduaneras y mercantiles** que respaldaran las preguntas del dataset, una ficha `.md` por norma con front-matter, por dominio.

**Estado: Fase 1, lista para el gate de Luis.** Ninguna ficha esta validada (`validado_por: null`). Las normas dudosas y las dudas abiertas estan en [docs/fases/REVISION-F1.md](../docs/fases/REVISION-F1.md).

**Las fichas NO contienen el texto de las normas.** El regimen de derechos del texto integro tiene decision aceptada (texto integro fuera del repo, publicacion pospuesta): ver [ADR-003](../docs/adr/ADR-003-regimen-de-derechos-del-corpus.md) (Aceptado, 2026-10-26).

## Formato de cada ficha

Front-matter YAML: `nombre`, `dominio`, `tipo`, `gaceta_numero`, `gaceta_tipo` (ordinaria/extraordinaria), `gaceta_fecha`, `fecha_inicio_vigencia`, `vigente` (si/no/dudosa), `derogada_o_reformada_por`, `vigilancia` (reformas anunciadas, opcional), `fuente` (URL primaria), `fuentes_adicionales`, `confianza` (alta/media/baja), `ultima_verificacion`, `texto_en_repo`, `validado_por`. Los tres campos `fuente`, `confianza` y `ultima_verificacion` siguen el contrato de procedencia de Arsenal (`schemas/procedencia.schema.json`, vocabulario `confianza-escala`). Un dato no verificado va como `[gaceta_pendiente]` o `[pendiente]`, nunca inventado.

## Indice (23 normas: 9 tributario, 4 aduanas, 10 mercantil)

| Norma | Gaceta | Tipo G.O. | Fecha G.O. | Vigente | Ficha |
|---|---|---|---|---|---|
| Codigo Organico Tributario | 6.507 | extraordinaria | 2020-01-29 | si | [tributario/cot-2020.md](tributario/cot-2020.md) |
| Decreto con Rango, Valor y Fuerza de Ley de Reforma Parcial del Decreto con Rango Valor y... | 6.210 | extraordinaria | 2015-12-30 | si | [tributario/islr-2015.md](tributario/islr-2015.md) |
| Reglamento de la Ley de Impuesto sobre la Renta | 5.662 | extraordinaria | 2003-09-24 | dudosa | [tributario/reglamento-islr-2003.md](tributario/reglamento-islr-2003.md) |
| Decreto Constituyente de Reforma Parcial del Decreto con Rango, Valor y Fuerza de Ley que... | 6.507 | extraordinaria | 2020-01-29 | si | [tributario/iva-2020.md](tributario/iva-2020.md) |
| Reglamento General de la Ley que establece el Impuesto al Valor Agregado | 5.363 | extraordinaria | 1999-07-12 | dudosa | [tributario/reglamento-iva-1999.md](tributario/reglamento-iva-1999.md) |
| Ley de Reforma del Decreto con Rango, Valor y Fuerza de Ley de Impuesto a las Grandes Tran... | 6.687 | extraordinaria | 2022-02-25 | si | [tributario/igtf-2022.md](tributario/igtf-2022.md) |
| Ley de Impuesto sobre Sucesiones, Donaciones y demas Ramos Conexos | 5.391 | extraordinaria | 1999-10-22 | dudosa | [tributario/sucesiones-donaciones.md](tributario/sucesiones-donaciones.md) |
| Ley Constitucional que crea el Impuesto a los Grandes Patrimonios | 41.667 | ordinaria | 2019-07-03 | dudosa | [tributario/grandes-patrimonios-2019.md](tributario/grandes-patrimonios-2019.md) |
| Decreto con Rango, Valor y Fuerza de Ley de Reforma de la Ley de Impuesto sobre Alcohol y... | 6.151 | extraordinaria | 2014-11-18 | dudosa | [tributario/alcohol-2014.md](tributario/alcohol-2014.md) |
| Decreto con Rango, Valor y Fuerza de Ley Organica de Aduanas | 6.507 | extraordinaria | 2020-01-29 | si | [aduanas/loa-2014-reforma-2020.md](aduanas/loa-2014-reforma-2020.md) |
| Reglamento de la Ley Organica de Aduanas | 4.273 | extraordinaria | 1991-07-20 | dudosa | [aduanas/reglamento-loa.md](aduanas/reglamento-loa.md) |
| Arancel de Aduanas | [gaceta_pendiente] | extraordinaria | 2016-12-30 | dudosa | [aduanas/arancel-2016.md](aduanas/arancel-2016.md) |
| Ley sobre el Delito de Contrabando | 6.017 | extraordinaria | 2010-12-30 | si | [aduanas/contrabando-2010.md](aduanas/contrabando-2010.md) |
| Codigo de Comercio | 475 | extraordinaria | 1955-12-21 | si | [mercantil/codigo-de-comercio.md](mercantil/codigo-de-comercio.md) |
| Codigo Civil | 2.990 | extraordinaria | 1982-07-26 | si | [mercantil/codigo-civil-1982.md](mercantil/codigo-civil-1982.md) |
| Ley de Reforma Parcial del Decreto con Rango, Valor y Fuerza de Ley de Registros y del Not... | 6.668 | extraordinaria | 2021-12-16 | si | [mercantil/registros-y-notarias-2021.md](mercantil/registros-y-notarias-2021.md) |
| Decreto con Rango, Valor y Fuerza de Ley de la Actividad Aseguradora | 6.211 | extraordinaria | 2015-12-30 | si | [mercantil/actividad-aseguradora-2015.md](mercantil/actividad-aseguradora-2015.md) |
| Decreto con Rango, Valor y Fuerza de Ley de Mercado de Valores | 6.211 | extraordinaria | 2015-12-30 | si | [mercantil/mercado-de-valores-2015.md](mercantil/mercado-de-valores-2015.md) |
| Decreto con Rango y Fuerza de Ley de Mensajes de Datos y Firmas Electronicas | 37.148 | ordinaria | 2001-02-28 | si | [mercantil/mensajes-de-datos-2001.md](mercantil/mensajes-de-datos-2001.md) |
| Ley de Propiedad Industrial | 25.227 | ordinaria | 1956-12-10 | dudosa | [mercantil/propiedad-industrial-1956.md](mercantil/propiedad-industrial-1956.md) |
| Ley de Reforma Parcial del Decreto 1.506 con Fuerza de Ley de Comercio Maritimo | 38.351 | ordinaria | 2006-01-05 | si | [mercantil/comercio-maritimo-2006.md](mercantil/comercio-maritimo-2006.md) |
| Decreto con Rango, Valor y Fuerza de Ley Organica de Precios Justos | 6.202 | extraordinaria | 2015-11-08 | si | [mercantil/precios-justos-2015.md](mercantil/precios-justos-2015.md) |
| Decreto con Rango, Valor y Fuerza de Ley Antimonopolio | 6.151 | extraordinaria | 2014-11-18 | si | [mercantil/antimonopolio-2014.md](mercantil/antimonopolio-2014.md) |
