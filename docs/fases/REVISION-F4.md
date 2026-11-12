# Revision F4 (datos) — hoja de verificacion de citas y guia de muestreo para Luis

**Fecha:** 2026-11-12 · **Alcance:** 120 preguntas nuevas (40 por dominio: `trib-011`..`trib-050`, `aduanas-011`..`aduanas-050`, `mercantil-011`..`mercantil-050`) que llevan `data/preguntas.jsonl` de 30 a 150. Las 30 del piloto no se tocaron (siguen en `REVISION-F2.md`). Todas con `validado_por: null` y `fecha_validacion: null`: el sello es tuyo (CLAUDE.md, regla 3).

## 1. Que se verifico por maquina (y que no)

- **Verificado:** cada fila de abajo cita un fragmento literal (de 40 caracteres o mas) y `npm run verificar-citas` comprueba que ese fragmento aparece **dentro del articulo que cita `articulo_ref`** en el texto local de la norma, que el articulo existe en ese texto y que la `norma` de la pregunta es el `nombre` de la ficha de `corpus/` indicada. `norma` y `gaceta` salen de la ficha, no de memoria. Prueba con mutaciones: un fragmento alterado, un articulo equivocado o inexistente hacen fallar el script.
- **No verificado por maquina:** que la opcion correcta sea la unica correcta, que los distractores sean falsos y que el enunciado no sea ambiguo. Eso lo cubre la autorrevision (seccion 4) y tu muestreo (seccion 3).
- **Los textos no estan en el repo** (ADR-003): viven en `C:\dev\eval-ve-textos\` (variable `EVAL_TEXTOS`). Por eso el control literal corre en local; en CI solo corre `npm run verificar-citas -- --solo-estructura` (fila por pregunta, fragmento >= 40, ficha y norma coherentes) y las pruebas unitarias. Los fragmentos de esta hoja son frases breves de cita, no articulos completos.
- **Lectura por norma:** COT, IVA, IGTF (G.O. 6.687) y Ley Organica de Aduanas: PDF de la Gaceta servido por la Asamblea Nacional, texto extraido (el PDF mezcla columnas en algunos articulos; se eligieron fragmentos contiguos y legibles). **Codigo de Comercio (`mercantil-011` a `mercantil-042`): transcripcion de tercero de la G.O. 475 (Directorio Legislativo), igual que en el piloto; hay que contrastarla con la Gaceta** (decision pendiente de F2). Ley de Registros y Notarias (`mercantil-043` a `mercantil-050`): PDF de la AN.

## 2. Reparto

| dominio | total | nuevas | opcion multiple | abierta | dif. 1 / 2 / 3 |
|---|---|---|---|---|---|
| tributario | 50 | 40 | 36 | 14 | 15 / 21 / 14 |
| aduanas | 50 | 40 | 35 | 15 | 15 / 23 / 12 |
| mercantil | 50 | 40 | 35 | 15 | 14 / 22 / 14 |
| **total** | 150 | 120 | 106 | 44 | 44 / 66 / 40 |

Reparto por tipo y dificultad aproximado al del piloto (7/3 y 11/12/7): las nuevas quedan ~71 % opcion multiple, ~29 % abierta y algo mas cargadas hacia dificultad 2-3. Posiciones de la respuesta correcta repartidas entre las 4 opciones (22 / 22 / 19 / 22 en las nuevas).

## 3. Como revisarlo por muestreo (propuesta)

Muestra estratificada de **24 preguntas (20 % de las 120 nuevas)**: las de correlativo terminado en 3 u 8 de cada dominio (`trib-013, 018, 023, 028, 033, 038, 043, 048`; igual en `aduanas-` y `mercantil-`). Para cada una: abrir la norma, leer el articulo, comprobar que el fragmento sostiene la respuesta y que ningun distractor es defendible. Prioridad alta aunque no caigan en la muestra: las 32 del Codigo de Comercio (transcripcion de tercero) y las que dependen de vigilancia de F1 (reforma anunciada de COT/IVA en oct 2026; ver fichas). Si en la muestra falla mas de una, ampliar a otro 20 %.

## 4. Autorrevision y limites conocidos

- Se releyo cada pregunta contra su fragmento. Se corrigio la base imponible del IVA en importacion (art. 21) para no omitir los impuestos nacionales del art. 20 y se evito toda pregunta sobre alicuotas vigentes (IVA, IGTF) porque cambian por decreto.
- **Sesgo de longitud (corregido en la vuelta 1):** la opcion correcta era la mas larga en ~59 % de las opciones multiples nuevas. Se alargaron distractores (falsos segun el articulo citado) en 30 preguntas publicas y 3 privadas, sin tocar la respuesta correcta ni su fragmento. Ahora, entre las 85 opciones multiples nuevas, la correcta es estrictamente la mas larga en 17 (20 %) y la mas corta en 15 (18 %); en las 21 privadas, 4 (19 %) y 6 (29 %). El validador (`--escala` y `--privadas`) falla si alguno de los dos porcentajes supera el 35 % (pruebas incluidas).
- **Norma sin texto local:** ISLR 2015 (la AN la sirve como imagen y la G.O. 6.210 trae el decreto truncado), Mercado de Valores (PDF imagen), providencias del SENIAT y normativa cambiaria (sin texto local, y `cambiario` no existe como dominio en el esquema) no aportan preguntas nuevas. La unica pregunta de ISLR sigue siendo `trib-010`. Aduanas usa una sola norma (la LOA 2020); se evitaron los articulos que la reforma constituyente modifico.
- El esquema no cambia (`additionalProperties: false`); el fragmento y la lectura viven solo en esta hoja.

## 5. Una fila por pregunta nueva — Tributario (40)

| id | ficha del corpus | fragmento literal que sostiene la respuesta |
|---|---|---|
| trib-011 | `tributario/cot-2020.md` | «La obligación tributaria constituye un vínculo de carácter personal, aunque su cumplimiento se asegure mediante garantía real» |
| trib-012 | `tributario/cot-2020.md` | «celebrados entre particulares no son oponibles al Fisco, salvo en los casos autorizados por la ley» |
| trib-013 | `tributario/cot-2020.md` | «Están solidariamente obligadas aquellas personas respecto de las cuales se verifique el mismo hecho imponible» |
| trib-014 | `tributario/cot-2020.md` | «Responsables son los sujetos pasivos que, sin tener el carácter de contribuyentes» |
| trib-015 | `tributario/cot-2020.md` | «El responsable tendrá derecho a reclamar del contribuyente el reintegro de las cantidades que hubiere pagado por él» |
| trib-016 | `tributario/cot-2020.md` | «El hecho imponible es el presupuesto establecido por la ley para tipificar el tributo» |
| trib-017 | `tributario/cot-2020.md` | «quien se subrogará en los derechos, garantías y privilegios del sujeto activo, pero no en las prerrogativas» |
| trib-018 | `tributario/cot-2020.md` | «se extingue por confusión cuando el sujeto activo quedare colocado en la situación del deudor» |
| trib-019 | `tributario/cot-2020.md` | «La obligación de pago de los tributos sólo puede ser condonada o remitida por ley especial» |
| trib-020 | `tributario/cot-2020.md` | «La acción para imponer penas restrictivas de libertad prescribe a los diez (10) años» |
| trib-021 | `tributario/cot-2020.md` | «no puede ser materia de repetición, salvo que el pago se hubiere efectuado bajo reserva expresa» |
| trib-022 | `tributario/cot-2020.md` | «entendiéndose efectuada la renuncia cuando efectúa el pago total o parcial» |
| trib-023 | `tributario/cot-2020.md` | «con excepción de las derivadas de pensiones alimenticias, salarios y demás derechos derivados del trabajo y de seguridad social» |
| trib-024 | `tributario/cot-2020.md` | «El término máximo de duración del beneficio de exoneración será de un (1) año» |
| trib-025 | `tributario/cot-2020.md` | «estarán contenidas en un solo acto administrativo que se denominará Decreto General de Exoneraciones de Tributos Nacionales» |
| trib-026 | `tributario/cot-2020.md` | «La discapacidad intelectual debidamente comprobada. 3. El caso fortuito y la fuerza mayor.» |
| trib-027 | `tributario/cot-2020.md` | «serán responsables sus directores, gerentes, administradores, representantes o síndicos que hayan personalmente participado en la ejecución del ilícito» |
| trib-028 | `tributario/cot-2020.md` | «Las sanciones pecuniarias no son convertibles en penas restrictivas de la libertad» |
| trib-029 | `tributario/iva-2020.md` | «La creación, organización, recaudación, fiscalización y control del impuesto previsto en esta Ley queda reservado al Poder Nacional» |
| trib-030 | `tributario/iva-2020.md` | «Son contribuyentes ordinarios de este impuesto, los importadores habituales de bienes, los industriales, los comerciantes, los prestadores habituales de servicios» |
| trib-031 | `tributario/iva-2020.md` | «Son contribuyentes ocasionales del impuesto previsto en esta Ley, los importadores no habituales de bienes muebles corporales» |
| trib-032 | `tributario/iva-2020.md` | «Son contribuyentes formales los sujetos que realicen exclusivamente actividades u operaciones exentas o exoneradas del impuesto» |
| trib-033 | `tributario/iva-2020.md` | «cuando ellos se ejecuten o aprovechen en el país, aun cuando se hayan generado, contratado, perfeccionado o pagado en el exterior» |
| trib-034 | `tributario/iva-2020.md` | «es el precio facturado del bien, siempre que no sea menor del precio corriente en el mercado» |
| trib-035 | `tributario/iva-2020.md` | «la base imponible será el valor en aduana de los bienes, más los tributos, recargos, derechos compensatorios, derechos antidumping» |
| trib-036 | `tributario/iva-2020.md` | «Se deducirá de la base imponible las rebajas de precios, bonificaciones y descuentos normales del comercio» |
| trib-037 | `tributario/iva-2020.md` | «se determinará aplicando en cada caso la alícuota del impuesto, sobre la correspondiente base imponible» |
| trib-038 | `tributario/iva-2020.md` | «deberán computarlo a los efectos de la determinación del monto de los débitos fiscales del respectivo período de imposición» |
| trib-039 | `tributario/iva-2020.md` | «será determinado por períodos de imposición de un mes calendario» |
| trib-040 | `tributario/iva-2020.md` | «será un crédito fiscal a favor del contribuyente ordinario que se traspasará al período de imposición siguiente o a los sucesivos» |
| trib-041 | `tributario/iva-2020.md` | «es personal de cada contribuyente ordinario y no podrá ser transferido a terceros» |
| trib-042 | `tributario/iva-2020.md` | «no constituye un elemento de costo de los bienes y servicios adquiridos o utilizados» |
| trib-043 | `tributario/iva-2020.md` | «deberán expedir nuevas facturas o emitir notas de crédito o débito modificadoras de las facturas originalmente emitidas» |
| trib-044 | `tributario/iva-2020.md` | «podrá desconocer la constitución de sociedades, la celebración de contratos y, en general, la adopción de formas y procedimientos jurídicos» |
| trib-045 | `tributario/igtf-2022.md` | «Están exentos del pago de este impuesto: 1. La República y demás entes político territoriales. 2. El Banco Central de Venezuela.» |
| trib-046 | `tributario/igtf-2022.md` | «Son contribuyentes de este impuesto: 1. Las personas jurídicas y las entidades económicas sin personalidad jurídica, calificadas como sujetos pasivos especiales» |
| trib-047 | `tributario/igtf-2022.md` | «deberán ser elaboradas en los formularios y bajo las especificaciones técnicas publicadas por ésta en su Portal Fiscal» |
| trib-048 | `tributario/igtf-2022.md` | «será sancionado de conformidad con lo dispuesto en el Decreto Constituyente mediante el cual dicta el Código Orgánico Tributario» |
| trib-049 | `tributario/igtf-2022.md` | «Esta Ley entrará en vigencia a los treinta (30) días continuos siguientes a su publicación» |
| trib-050 | `tributario/igtf-2022.md` | «podrá realizar determinaciones de oficio del impuesto establecido en esta Ley, sobre base cierta o sobre base presuntiva» |

## 6. Una fila por pregunta nueva — Aduanas (40)

| id | ficha del corpus | fragmento literal que sostiene la respuesta |
|---|---|---|
| aduanas-011 | `aduanas/loa-2014-reforma-2020.md` | «competen al Presidente de la República, en Consejo de Ministros, al ministro del poder popular con competencia en materia de finanzas y al Jefe de la Administración Aduanera» |
| aduanas-012 | `aduanas/loa-2014-reforma-2020.md` | «podrá ingresar a los almacenes, patios, oficinas, vehículos y demás lugares privados o públicos, sujetos a la potestad aduanera, sin necesidad de autorización especial» |
| aduanas-013 | `aduanas/loa-2014-reforma-2020.md` | «no podrán ser retiradas de ella sino mediante el pago de los impuestos, tasas, penas pecuniarias y demás cantidades legalmente exigibles» |
| aduanas-014 | `aduanas/loa-2014-reforma-2020.md` | «El Tesoro Nacional tendrá privilegio preferente a cualquier otro, sobre los bienes» |
| aduanas-015 | `aduanas/loa-2014-reforma-2020.md` | «el Tesoro Nacional podrá perseguirlas y aprehenderlas» |
| aduanas-016 | `aduanas/loa-2014-reforma-2020.md` | «éstas podrán retener las demás que hayan llegado a nombre del mismo destinatario o consignatario, hasta que el pago se efectúe» |
| aduanas-017 | `aduanas/loa-2014-reforma-2020.md` | «quien constituirá garantía permanente y suficiente a favor del Tesoro Nacional» |
| aduanas-018 | `aduanas/loa-2014-reforma-2020.md` | «deberán arribar a una aduana habilitada para los regímenes aduaneros que vayan a realizar» |
| aduanas-019 | `aduanas/loa-2014-reforma-2020.md` | «a más tardar con cuarenta y ocho (48) horas de anticipación al momento de la llegada o salida del vehículo cuando se trata de carga marítima» |
| aduanas-020 | `aduanas/loa-2014-reforma-2020.md` | «a más tardar al siguiente día hábil de su descarga, con especificación precisa de los bultos faltantes y sobrantes» |
| aduanas-021 | `aduanas/loa-2014-reforma-2020.md` | «deberán permanecer en depósitos temporales, previamente autorizados para tal fin por la Administración Aduanera» |
| aduanas-022 | `aduanas/loa-2014-reforma-2020.md` | «en el momento en que se inicia la descarga del vehículo porteador» |
| aduanas-023 | `aduanas/loa-2014-reforma-2020.md` | «transcurridos tres (3) días hábiles desde la fecha en que la autoridad aduanera ha solicitado o autorizado su examen» |
| aduanas-024 | `aduanas/loa-2014-reforma-2020.md` | «no serán exigibles los impuestos de importación ni penas pecuniarias, pero sí las tasas y demás derechos que se hubieren causado» |
| aduanas-025 | `aduanas/loa-2014-reforma-2020.md` | «el interesado deberá reintegrar al Tesoro Nacional las cantidades que haya recibido por concepto de estímulo» |
| aduanas-026 | `aduanas/loa-2014-reforma-2020.md` | «con suspensión del pago del tributo aduanero» |
| aduanas-027 | `aduanas/loa-2014-reforma-2020.md` | «No podrán ser objeto de tránsito las mercancías inflamables, explosivos, de importación prohibida» |
| aduanas-028 | `aduanas/loa-2014-reforma-2020.md` | «los consignatarios deberán presentar garantía a fin de asegurar la salida de los efectos hacia su lugar de destino» |
| aduanas-029 | `aduanas/loa-2014-reforma-2020.md` | «podrá efectuarse en el lugar de transbordo, si estuviese habilitado para la importación» |
| aduanas-030 | `aduanas/loa-2014-reforma-2020.md` | «deberá ser realizada por quien acredite la cualidad jurídica de consignatario, exportador o remitente» |
| aduanas-031 | `aduanas/loa-2014-reforma-2020.md` | «servirá a la Administración Aduanera para la aplicación de la Gestión de Riesgo» |
| aduanas-032 | `aduanas/loa-2014-reforma-2020.md` | «con por lo menos veinticinco (25) días hábiles anteriores a la fecha de llegada de las mercancías» |
| aduanas-033 | `aduanas/loa-2014-reforma-2020.md` | «el declarante se entenderá notificado de todas las actuaciones de control inmediato» |
| aduanas-034 | `aduanas/loa-2014-reforma-2020.md` | «el consignatario aceptante pagará el almacenaje a que hubiere lugar» |
| aduanas-035 | `aduanas/loa-2014-reforma-2020.md` | «el consignatario podrá designar a otra persona para que las declare a la aduana» |
| aduanas-036 | `aduanas/loa-2014-reforma-2020.md` | «solamente podrá efectuarse por quien acredite ser el propietario de las mercancías, mediante el correspondiente conocimiento de embarque» |
| aduanas-037 | `aduanas/loa-2014-reforma-2020.md` | «deben efectuarse a través de un agente o agencia de aduanas debidamente autorizado» |
| aduanas-038 | `aduanas/loa-2014-reforma-2020.md` | «El reconocimiento se efectuará a los fines de su validez, con la asistencia del funcionario competente de la aduana» |
| aduanas-039 | `aduanas/loa-2014-reforma-2020.md` | «No será necesario levantamiento de acta de reconocimiento cuando no hubieren surgido objeciones» |
| aduanas-040 | `aduanas/loa-2014-reforma-2020.md` | «cuando la irregularidad sea consecuencia de su acción u omisión dolosa o culposa» |
| aduanas-041 | `aduanas/loa-2014-reforma-2020.md` | «cuando existan fundados indicios de alguna incorrección o actuación ilícita» |
| aduanas-042 | `aduanas/loa-2014-reforma-2020.md` | «se efectúen con posterioridad al retiro de las mercancías de la zona primaria aduanera» |
| aduanas-043 | `aduanas/loa-2014-reforma-2020.md` | «el cual no podrá exceder de treinta (30) días continuos contados a partir de la fecha del reconocimiento» |
| aduanas-044 | `aduanas/loa-2014-reforma-2020.md` | «de conformidad con lo dispuesto en el procedimiento de repetición de pago establecido en el Código Orgánico Tributario» |
| aduanas-045 | `aduanas/loa-2014-reforma-2020.md` | «El abandono aduanero de las mercancías podrá ser voluntario o legal.» |
| aduanas-046 | `aduanas/loa-2014-reforma-2020.md` | «manifestación expresa e irrevocable formulada a la aduana por el consignatario, exportador o remitente» |
| aduanas-047 | `aduanas/loa-2014-reforma-2020.md` | «una comisión constituida por el Vicepresidente Ejecutivo o Vicepresidenta Ejecutiva de la República» |
| aduanas-048 | `aduanas/loa-2014-reforma-2020.md` | «Las mercancías no podrán ser rematadas sin que se haya efectuado su reconocimiento.» |
| aduanas-049 | `aduanas/loa-2014-reforma-2020.md` | «Los remates serán realizados por las aduanas mediante ofertas bajo sobre cerrado» |
| aduanas-050 | `aduanas/loa-2014-reforma-2020.md` | «el deudor, si lo hubiere, quedará obligado a cancelar la diferencia» |

## 7. Una fila por pregunta nueva — Mercantil (40)

| id | ficha del corpus | fragmento literal que sostiene la respuesta |
|---|---|---|
| mercantil-011 | `mercantil/codigo-de-comercio.md` | «Los simples trabajos manuales de los artesanos y obreros, ejecutados individualmente, ya sea por cuenta propia o en servicio de algunas empresas» |
| mercantil-012 | `mercantil/codigo-de-comercio.md` | «se aplicarán las disposiciones del Código Civil» |
| mercantil-013 | `mercantil/codigo-de-comercio.md` | «suplen el silencio de la Ley cuando los hechos que las constituyen son uniformes, públicos» |
| mercantil-014 | `mercantil/codigo-de-comercio.md` | «Son comerciantes los que teniendo capacidad para contratar hacen del comercio su profesión habitual» |
| mercantil-015 | `mercantil/codigo-de-comercio.md` | «no puede usar otra firma o razón de comercio, que su apellido con o sin el nombre» |
| mercantil-016 | `mercantil/codigo-de-comercio.md` | «debe contener, por lo menos, el de algunos de ellos, con una mención que haga conocer la existencia de una sociedad» |
| mercantil-017 | `mercantil/codigo-de-comercio.md` | «debe agregarle alguna enunciación que lo distinga claramente de la razón de comercio precedentemente inscrita» |
| mercantil-018 | `mercantil/codigo-de-comercio.md` | «Se prohíbe la cesión de una firma mercantil como tal e independientemente del establecimiento mercantil» |
| mercantil-019 | `mercantil/codigo-de-comercio.md` | «no pueden ponerse en uso sin que hayan sido previamente presentados al Tribunal o Registrador Mercantil» |
| mercantil-020 | `mercantil/codigo-de-comercio.md` | «En el libro Diario se asentarán, día por día, las operaciones que haga el comerciante» |
| mercantil-021 | `mercantil/codigo-de-comercio.md` | «hará en el libro de Inventarios una descripción estimatoria de todos sus bienes» |
| mercantil-022 | `mercantil/codigo-de-comercio.md` | «Dejar blancos en el cuerpo de los asientos o a continuación de ellos.» |
| mercantil-023 | `mercantil/codigo-de-comercio.md` | «los asientos de los libros sólo harán fe contra su dueño» |
| mercantil-024 | `mercantil/codigo-de-comercio.md` | «No se podrá hacer pesquisa de oficio por Tribunal ni autoridad alguna» |
| mercantil-025 | `mercantil/codigo-de-comercio.md` | «sino en los casos de sucesión universal, comunidad de bienes, liquidación de sociedades legales o convencionales y quiebra o atraso» |
| mercantil-026 | `mercantil/codigo-de-comercio.md` | «Los libros y sus comprobantes deben ser conservados durante diez años, a partir del último asiento de cada libro» |
| mercantil-027 | `mercantil/codigo-de-comercio.md` | «responde al par de los otros y de la manera establecida para cada compañía, de todas las obligaciones contraídas por la sociedad antes de su admisión» |
| mercantil-028 | `mercantil/codigo-de-comercio.md` | «Los bienes aportados por los socios se hacen propiedad de la compañía, salvo pacto en contrario.» |
| mercantil-029 | `mercantil/codigo-de-comercio.md` | «La reducción del capital social no podrá verificarse mientras no hayan transcurrido tres meses» |
| mercantil-030 | `mercantil/codigo-de-comercio.md` | «Los socios no pueden hacer operaciones por su propia cuenta, ni por la de un tercero» |
| mercantil-031 | `mercantil/codigo-de-comercio.md` | «Los socios comanditarios sólo responden por los actos de la sociedad con el capital que pusieron o debieron poner en ella.» |
| mercantil-032 | `mercantil/codigo-de-comercio.md` | «Los comanditarios no pueden ejecutar acto alguno de administración, ni pueden ser apoderados generales de la sociedad» |
| mercantil-033 | `mercantil/codigo-de-comercio.md` | «La compañía anónima es administrada por uno o más administradores temporales, revocables» |
| mercantil-034 | `mercantil/codigo-de-comercio.md` | «Los promotores son responsables solidariamente y sin limitación, de las obligaciones que contraigan para constituir la sociedad» |
| mercantil-035 | `mercantil/codigo-de-comercio.md` | «entregada en caja por cada accionista la quinta parte, por lo menos, del monto de las acciones por él suscritas» |
| mercantil-036 | `mercantil/codigo-de-comercio.md` | «Anualmente se separará de los beneficios líquidos una cuota de 5 por 100, por lo menos» |
| mercantil-037 | `mercantil/codigo-de-comercio.md` | «los administradores duran dos años, y son siempre reelegibles» |
| mercantil-038 | `mercantil/codigo-de-comercio.md` | «con cinco días de anticipación por lo menos al fijado para su reunión» |
| mercantil-039 | `mercantil/codigo-de-comercio.md` | «es necesaria la presencia en la asamblea de un número de socios que represente las tres cuartas partes del capital social» |
| mercantil-040 | `mercantil/codigo-de-comercio.md` | «La asamblea ordinaria nombrará uno o más comisarios, socios o no» |
| mercantil-041 | `mercantil/codigo-de-comercio.md` | «Las acciones que no estén íntegramente pagadas son siempre nominativas.» |
| mercantil-042 | `mercantil/codigo-de-comercio.md` | «Las acciones deben ser de igual valor y dan a sus tenedores iguales derechos» |
| mercantil-043 | `mercantil/registros-y-notarias-2021.md` | «que podrá estar integrada por registros mercantiles territoriales y por un Registro Central» |
| mercantil-044 | `mercantil/registros-y-notarias-2021.md` | «crea una presunción, que no puede ser desvirtuada» |
| mercantil-045 | `mercantil/registros-y-notarias-2021.md` | «Esta presunción únicamente podrá ser desvirtuada por los terceros que tengan interés, con efectos para el caso concreto.» |
| mercantil-046 | `mercantil/registros-y-notarias-2021.md` | «se extinguirá al vencimiento del lapso de un año, contado a partir de la publicación del acto inscrito» |
| mercantil-047 | `mercantil/registros-y-notarias-2021.md` | «Corresponde a la Registradora o Registrador Mercantil vigilar el cumplimiento de los requisitos legales establecidos para la constitución y funcionamiento de las compañías anónimas» |
| mercantil-048 | `mercantil/registros-y-notarias-2021.md` | «siempre que las copias se soliciten con indicación de la clase de actos o de sus otorgantes» |
| mercantil-049 | `mercantil/registros-y-notarias-2021.md` | «lo hará a ruego y estampará su huella digital al pie del documento» |
| mercantil-050 | `mercantil/registros-y-notarias-2021.md` | «sin la previa presentación de la planilla de pago del anticipo del Impuesto sobre la Renta» |

## 8. Preguntas privadas (control de contaminacion)

30 preguntas privadas (10 por dominio, ids `trib-9001`.. `mercantil-9010`) en `data/privadas/preguntas-privadas.jsonl`, con su hoja `data/privadas/REVISION-privadas.md`. **Ambas estan fuera de git** (`data/privadas/` en `.gitignore`). Salen de articulos distintos a los publicos y comprueban con el mismo script: `npm run verificar-citas -- --privadas` y `node src/validar/validar-preguntas.mjs --privadas`.
