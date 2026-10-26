# Revision F2 — hoja para el gate de Luis

**Fecha:** 2026-10-26 · **Alcance:** 30 preguntas piloto (10 tributario, 10 aduanas, 10 mercantil) en `data/preguntas.jsonl`. Todas con `validado_por: null`: el sello es tuyo (CLAUDE.md regla 3). Validador: `npm run validar` (30/30, reparto 10/10/10) y `npm test` (11 pruebas).

## 1. Antes de revisar fila por fila

- **Solo normas con `vigente: si`** (decision P-6). Quedan fuera las 8 dudosas y las 7 de alcance dudoso (Codigo Civil, Comercio Maritimo, Precios Justos, Antimonopolio, Actividad Aseguradora, Mensajes de Datos, Contrabando). El alcance mercantil final lo decides tu antes de F4.
- **Aduanas usa una sola norma (la LOA 2020).** Con Contrabando fuera, y el Arancel y el Reglamento en dudosa, no habia otra vigente. Es la norma mas grande, pero es una limitacion del piloto.
- **Mercantil usa solo Codigo de Comercio (6) y Ley de Registros y Notarias (4).** Mercado de Valores (vigente) quedo sin preguntas: el PDF de la AN es una imagen sin texto y no pude leer sus articulos.
- **ISLR: 1 sola pregunta, con lectura `indice-exa`** (la AN la sirve como imagen y la G.O. 6.210 del INE trae el decreto truncado). Va primera en la tabla.
- **Lectura `directa`** = lei el articulo en el PDF de la Gaceta servido por la Asamblea Nacional (G.O. 6.507, 6.668, 6.687). **Excepcion:** las 6 del Codigo de Comercio se leyeron en una *transcripcion de tercero* de la G.O. 475 (Directorio Legislativo), no en el PDF de la Gaceta; van marcadas y justo despues de la `indice-exa`. Cada extracto de abajo se comprobo por maquina contra el texto leido (29 de 30; el de mercantil-008 tiene un numero de nota pegado en el PDF y se comprobo a ojo).
- **Textos locales:** `C:deveval-ve-textos` (fuera del repo, ADR-003 Aceptado). Ningun texto de norma esta en git ni en el dataset; los extractos de esta hoja son frases breves de cita.
- Vigilancia de F1 que toca el piloto: reforma anunciada de COT/ISLR/IVA (oct 2026) y decretos de alicuota del IGTF no verificados. Las preguntas piden reglas del articulo, no tasas del IGTF (trib-009 pide los limites legales).
- Esquema: el ADR-001 no tiene campos para el extracto ni para el tipo de lectura, y no los anadi (additionalProperties: false). Viven solo en esta hoja.

## 2. Una fila por pregunta (las `indice-exa` y las de transcripcion de tercero primero)

| id | dominio | norma y articulo | tipo | dif. | lectura | que revisar |
|---|---|---|---|---|---|---|
| trib-010 | tributario | ISLR 2015 (G.O. 6.210 Ext.), Artículo 52 | opcion multiple | 2 | **indice-exa** | LECTURA INDIRECTA: la AN solo ofrece el ISLR como imagen sin texto y la G.O. 6.210 que pude abrir (INE) trae el decreto truncado. Abrir la Gaceta 6.210 Ext. y comprobar art. 52 (Tarifa N° 2); verificar también que la reforma de 2020 no lo alteró. |
| mercantil-001 | mercantil | Codigo de Comercio (G.O. 475 Ext.), Artículo 200 | abierta | 2 | directa (transcripcion de tercero) | Texto leído en transcripción de tercero (Directorio Legislativo) de la G.O. 475; contrastar con la Gaceta. |
| mercantil-002 | mercantil | Codigo de Comercio (G.O. 475 Ext.), Artículo 201, numeral 3 | opcion multiple | 1 | directa (transcripcion de tercero) | Texto leído en transcripción de tercero; contrastar con la G.O. 475. |
| mercantil-003 | mercantil | Codigo de Comercio (G.O. 475 Ext.), Artículo 202 | opcion multiple | 1 | directa (transcripcion de tercero) | Texto leído en transcripción de tercero; contrastar con la G.O. 475. |
| mercantil-004 | mercantil | Codigo de Comercio (G.O. 475 Ext.), Artículo 32 | opcion multiple | 2 | directa (transcripcion de tercero) | Texto leído en transcripción de tercero; contrastar con la G.O. 475. |
| mercantil-005 | mercantil | Codigo de Comercio (G.O. 475 Ext.), Artículo 243 | opcion multiple | 2 | directa (transcripcion de tercero) | Opción correcta larga; la opción 4 ("ninguna responsabilidad") es la trampa. Texto leído en transcripción de tercero. |
| mercantil-006 | mercantil | Codigo de Comercio (G.O. 475 Ext.), Artículo 273 | opcion multiple | 3 | directa (transcripcion de tercero) | El art. 280 fija 3/4 para ciertos objetos (otra regla). Revisar que el enunciado no se confunda con él. Texto leído en transcripción de tercero. |
| aduanas-001 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 47 | opcion multiple | 1 | directa | El mismo artículo permite a la Administración Aduanera modificar el plazo por acto general; la pregunta dice "salvo las excepciones". Confirmar el enunciado. |
| aduanas-002 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 73 | opcion multiple | 2 | directa | El artículo añade que el Ejecutivo Nacional puede modificar el lapso por Decreto (no verificado si lo hizo); el enunciado no lo menciona. Decidir si se agrega "según el texto de la ley". |
| aduanas-003 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 7 | abierta | 2 | directa | Respuesta larga (cuatro numerales + parágrafo): decidir si la rúbrica exige los cuatro o basta una idea general. |
| aduanas-004 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 48 | opcion multiple | 3 | directa | Confirmar que no importa cuáles sean las sanciones (la pregunta no las pide). |
| aduanas-005 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 50 | opcion multiple | 1 | directa | Ninguna duda de fondo. |
| aduanas-006 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 72 | abierta | 3 | directa | Dos ideas en una respuesta (momento y efectos); decidir si es demasiado para una sola pregunta. |
| aduanas-007 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 91 | opcion multiple | 2 | directa | Ninguna duda de fondo. |
| aduanas-008 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 92 | opcion multiple | 1 | directa | Ninguna duda de fondo. |
| aduanas-009 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 6 | abierta | 1 | directa | Definición literal: un modelo que parafrasee bien debería pasar; revisar la rúbrica. |
| aduanas-010 | aduanas | LOA 2014/2020 (G.O. 6.507 Ext.), Artículo 35 | opcion multiple | 3 | directa | El Reglamento de la LOA (1991) es dudoso en vigencia (REVISION-F1); la pregunta no usa el plazo, solo la consecuencia legal. |
| mercantil-007 | mercantil | Ley de Registros y Notarias 2021 (G.O. 6.668 Ext.), Artículo 52, numeral 3 | opcion multiple | 1 | directa | Que ninguna de las opciones erróneas sea también objeto del Registro Mercantil por otra vía. |
| mercantil-008 | mercantil | Ley de Registros y Notarias 2021 (G.O. 6.668 Ext.), Artículo 59 | opcion multiple | 2 | directa | El PDF trae un número de nota ("4a0") pegado dentro de la frase; el sentido es claro, pero lee el art. 59 en la Gaceta. Se puede confundir con el art. 53 (presunción de conocimiento universal). |
| mercantil-009 | mercantil | Ley de Registros y Notarias 2021 (G.O. 6.668 Ext.), Artículo 60 | abierta | 2 | directa | Ninguna duda de fondo. |
| mercantil-010 | mercantil | Ley de Registros y Notarias 2021 (G.O. 6.668 Ext.), Artículo 90, numeral 1 | abierta | 3 | directa | La ley de tasas incluye el monto (2 U.T.); la pregunta no lo pide. Verificar que el procedimiento no cambió por providencia posterior. |
| trib-001 | tributario | COT 2020 (G.O. 6.507 Ext.), Artículo 55, numeral 1 | opcion multiple | 1 | directa | Que el art. 56 (10 años en ciertos casos) no haga ambigua la palabra "regla general". Plazo de 6 años verificado en el texto de 2020. |
| trib-002 | tributario | COT 2020 (G.O. 6.507 Ext.), Artículo 66 | abierta | 2 | directa | Que la respuesta de referencia sirva de rúbrica sin ser demasiado larga; el detalle de la tasa promedio es del segundo párrafo del mismo artículo. |
| trib-003 | tributario | COT 2020 (G.O. 6.507 Ext.), Artículo 27 | opcion multiple | 2 | directa | Que las tres opciones erróneas no se puedan defender con otro artículo del COT. |
| trib-004 | tributario | COT 2020 (G.O. 6.507 Ext.), Artículo 10, numeral 2 | opcion multiple | 1 | directa | Pregunta básica; confirmar que el artículo 10 no fue alterado por la reforma de 2020 (el texto leído es el de 2020). |
| trib-005 | tributario | Ley IVA 2020 (G.O. 6.507 Ext.), Artículo 27 | opcion multiple | 1 | directa | La fecha de vigencia del IVA tiene discrepancia en la ficha (REVISION-F1); esta pregunta no depende de ella. |
| trib-006 | tributario | Ley IVA 2020 (G.O. 6.507 Ext.), Artículo 16, numeral 6 y parágrafo único | abierta | 2 | directa | Que "no sujeto" (art. 16) no se confunda con "exento" (arts. 17-19) en la rúbrica. |
| trib-007 | tributario | Ley IVA 2020 (G.O. 6.507 Ext.), Artículo 13, numeral 1, literal b | opcion multiple | 3 | directa | La opción correcta es larga a propósito (es la regla literal); revisar que no delate la respuesta por longitud. |
| trib-008 | tributario | Ley IGTF 2022 (G.O. 6.687 Ext.), Artículo 18 | opcion multiple | 1 | directa | Ninguna duda de fondo; es la pregunta más segura del dominio. |
| trib-009 | tributario | Ley IGTF 2022 (G.O. 6.687 Ext.), Artículo 13 | abierta | 3 | directa | Pregunta por los límites legales, no por la tasa vigente (los decretos de alícuota 2024-2026 no se verificaron; ver ficha). Confirmar que así queda bien. |

## 3. Extracto literal de respaldo y fuente leida

Frases breves tomadas del texto leido; sirven para que compruebes el articulo sin abrir toda la ley. Con `...` se unen dos fragmentos del mismo articulo.

- **trib-010** (Artículo 52) — _ley.com.ve y tugacetaoficial.com (reproducen el art. 52 tras la reforma G.O. 6.210 Ext.), via agent-reach_: "Por la fracción que exceda de 3.000,00 34%"
- **mercantil-001** (Artículo 200) — _transcripcion del texto de la G.O. 475 Ext. alojada por Directorio Legislativo (NO es el PDF de la Gaceta)_: "Sin perjuicio de lo dispuesto por leyes especiales, las sociedades anónimas y las de responsabilidad limitada tendrán siempre carácter mercantil, cualquiera que sea su objeto, salvo cuando se dediquen exclusivamente a la explotación agrícola o pecuaria."
- **mercantil-002** (Artículo 201, numeral 3) — _transcripcion del texto de la G.O. 475 Ext. alojada por Directorio Legislativo (NO es el PDF de la Gaceta)_: "La compañía anónima, en la cual las obligaciones sociales están garantizadas por un capital determinado y en la que los socios no están obligados sino por el monto de su acción."
- **mercantil-003** (Artículo 202) — _transcripcion del texto de la G.O. 475 Ext. alojada por Directorio Legislativo (NO es el PDF de la Gaceta)_: "deberá necesariamente agregarse la mención de "Compañía Anónima" o "Compañía de Responsabilidad Limitada", escritas con todas sus letras o en la forma que usualmente se abrevian, legibles sin dificultad."
- **mercantil-004** (Artículo 32) — _transcripcion del texto de la G.O. 475 Ext. alojada por Directorio Legislativo (NO es el PDF de la Gaceta)_: "Todo comerciante debe llevar en idioma castellano su contabilidad, la cual comprenderá, obligatoriamente, el libro Diario, el libro Mayor y el de Inventarios."
- **mercantil-005** (Artículo 243) — _transcripcion del texto de la G.O. 475 Ext. alojada por Directorio Legislativo (NO es el PDF de la Gaceta)_: "Los administradores no responden sino de la ejecución del mandato y de las obligaciones que la Ley les impone; y no contraen por razón de su administración ninguna obligación personal por los negocios de la compañía."
- **mercantil-006** (Artículo 273) — _transcripcion del texto de la G.O. 475 Ext. alojada por Directorio Legislativo (NO es el PDF de la Gaceta)_: "Si los estatutos no disponen otra cosa, las asambleas ordinarias o extraordinarias, no podrán considerarse constituidas para deliberar, si no se halla representado en ellas un número de accionistas que represente más de la mitad del capital social."
- **aduanas-001** (Artículo 47) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "Las mercancías deberán ser declaradas antes o a más tardar al quinto (5) día hábil siguiente de la fecha de ingreso al país para las importaciones"
- **aduanas-002** (Artículo 73) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "El abandono legal se producirá cuando el consignatario, exportador o remitente no haya aceptado la consignación o cuando no haya declarado o retirado las mercancías, según el caso, dentro de los treinta (30) días continuos siguientes al vencimiento del plazo para la declaración o a partir de la fecha de reconocimiento"
- **aduanas-003** (Artículo 7) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "1. Toda mercancía que vaya a ser introducida o extraída del territorio nacional; 2. Los bienes que formen parte del equipaje de pasajeros y tripulantes;"
- **aduanas-004** (Artículo 48) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "La presentación de dos (2) o más correcciones dará lugar a la aplicación de las sanciones previstas en este Decreto con Rango Valor y Fuerza de Ley."
- **aduanas-005** (Artículo 50) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "La declaración de aduanas no podrá ser cancelada o anulada después del despacho y retiro de la mercancía."
- **aduanas-006** (Artículo 72) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "El abandono voluntario se podrá producir mientras no haya habido declaración de las mercancías y liberará al consignatario o exportador del cumplimiento de las obligaciones causadas"
- **aduanas-007** (Artículo 91) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "Los Auxiliares de la Administración Aduanera son responsables solidarios ante la República, por las consecuencias tributarias derivadas de los actos, omisiones, infracciones y delitos en que incurran sus empleados en el ejercicio de sus funciones"
- **aduanas-008** (Artículo 92) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "Los Auxiliares de la Administración Aduanera están obligados a actualizarse anualmente, dentro del primer trimestre del respectivo año calendario."
- **aduanas-009** (Artículo 6) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "La potestad aduanera es la facultad de las autoridades competentes para intervenir sobre los bienes a que se refiere el artículo 7°, autorizar o impedir su desaduanamiento, ejercer los privilegios fiscales, determinar los tributos exigibles, aplicar las sanciones procedentes"
- **aduanas-010** (Artículo 35) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "Las mercancías de tránsito que no fuesen nacionalizadas o reexpedidas dentro del plazo que señale el Reglamento, se consideran legalmente abandonadas."
- **mercantil-007** (Artículo 52, numeral 3) — _PDF de la Gaceta 6.668 Ext. servido por la Asamblea Nacional_: "3. La legalización de los libros de los comerciantes."
- **mercantil-008** (Artículo 59) — _PDF de la Gaceta 6.668 Ext. servido por la Asamblea Nacional_: "Los actos sujetos a inscripción sólo serán oponibles a terceros de buena fe desde su publicación."
- **mercantil-009** (Artículo 60) — _PDF de la Gaceta 6.668 Ext. servido por la Asamblea Nacional_: "Las Registradoras o Registradores Mercantiles calificarán la legalidad de las formas extrínsecas de los documentos, cuya inscripción se solicite, así como la capacidad y legitimación de los que otorguen o suscriban el documento presentado."
- **mercantil-010** (Artículo 90, numeral 1) — _PDF de la Gaceta 6.668 Ext. servido por la Asamblea Nacional_: "Otorgamiento de nombres y denominaciones de empresas mercantiles y firmas comerciales ante el Registro Mercantil, dos Unidades Tributarias (2 U.T.). Este otorgamiento tendrá una vigencia de treinta días. Vencido dicho término, se perderá el derecho al nombre o denominación otorgado, así como los derechos fiscales cancelados."
- **trib-001** (Artículo 55, numeral 1) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "Prescriben a los seis (6) años los siguientes derechos y acciones: 1. La acción para verificar, fiscalizar y determinar la obligación tributaria con sus accesorios."
- **trib-002** (Artículo 66) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "hace surgir, de pleno derecho y sin necesidad de requerimiento previo de la Administración Tributaria, la obligación de pagar intereses moratorios desde el vencimiento del plazo establecido para la autoliquidación y pago del tributo hasta la extinción total de la deuda, equivalentes a 1.2 veces la tasa activa bancaria aplicable"
- **trib-003** (Artículo 27) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "De no realizar la retención o percepción, responderá solidariamente con el contribuyente."
- **trib-004** (Artículo 10, numeral 2) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "Los plazos establecidos por días se contarán por días hábiles, salvo que la ley disponga que sean continuos."
- **trib-005** (Artículo 27) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "La alícuota impositiva aplicable a las ventas de exportación de bienes muebles y a las exportaciones de servicios, será del cero por ciento (0%)."
- **trib-006** (Artículo 16, numeral 6 y parágrafo único) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "No estarán sujetos al impuesto previsto en esta Ley: ... 6. Los servicios prestados bajo relación de dependencia de conformidad con el Decreto con Rango, Valor y Fuerza de Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras."
- **trib-007** (Artículo 13, numeral 1, literal b) — _PDF de la Gaceta 6.507 Ext. servido por la Asamblea Nacional_: "b. En todos los demás casos distintos a los mencionados en el literal anterior, cuando se emita la factura o documento equivalente que deje constancia de la operación o se pague el precio o desde que se haga la entrega real de los bienes, según sea lo que ocurra primero."
- **trib-008** (Artículo 18) — _PDF de la Gaceta 6.687 Ext. servido por la Asamblea Nacional_: "El impuesto previsto en esta Ley no será deducible del Impuesto sobre la Renta."
- **trib-009** (Artículo 13) — _PDF de la Gaceta 6.687 Ext. servido por la Asamblea Nacional_: "La alícuota general aplicable a la base imponible correspondiente será establecida por el Ejecutivo Nacional y estará comprendida entre un límite mínimo de cero por ciento (0%) y un máximo de dos por ciento (2%)"

## 4. Reparto

| dominio | opcion multiple | abierta | dif. 1 / 2 / 3 |
|---|---|---|---|
| tributario | 7 | 3 | 4 / 4 / 2 |
| aduanas | 7 | 3 | 4 / 3 / 3 |
| mercantil | 7 | 3 | 3 / 5 / 2 |

## 5. Como cerrar el gate

Para cada pregunta aprobada, dicta `validado_por` (solo `Luis Carlos Vasquez`) y `fecha_validacion`; las correcciones se aplican tal cual las indiques. Criterio de salida: 30/30 con `validado_por` lleno.
