// Reporte: JSON por modelo (results/<modelo>/<fecha>.json) + resumen Markdown por modelo,
// dominio y dificultad. Las 4 metricas de la ficha:
//  1 exactitud (opcion multiple)  2 calidad (abiertas, rubrica del juez)
//  3 precision de cita            4 tasa de alucinacion normativa (senal del juez, ver ADR-004)
import type { ItemResultado, ResultadoCorrida, ResultadoModelo } from './runner.ts';

export interface Resumen {
  n: number;
  respondidas: number;
  rechazos: number;
  errores: number;
  omitidas: number;
  exactitud: { n: number; aciertos: number; valor: number | null };
  calidad: { n: number; correctas: number; parciales: number; incorrectas: number; valor: number | null; sin_juzgar: number };
  precision_cita: { n: number; aciertos: number; valor: number | null };
  alucinacion: { n: number; inventadas: number; tasa: number | null };
  costo_usd: number;
}

const razon = (a: number, n: number): number | null => (n > 0 ? a / n : null);

export function resumir(items: ItemResultado[]): Resumen {
  const ok = items.filter((i) => i.estado === 'ok');
  const mc = ok.filter((i) => i.tipo === 'opcion_multiple');
  const ab = ok.filter((i) => i.tipo === 'abierta');
  const juzgadas = ab.filter((i) => i.estado_juez === 'ok');
  const citas = ab.filter((i) => i.cita_correcta !== null);
  const aciertos = mc.filter((i) => i.correcta === true).length;
  const suma = juzgadas.reduce((a, i) => a + (i.puntaje ?? 0), 0);
  const aciertosCita = citas.filter((i) => i.cita_correcta === true).length;
  const inventadas = juzgadas.filter((i) => i.cita_inventada === true).length;
  return {
    n: items.length,
    respondidas: ok.length,
    rechazos: items.filter((i) => i.estado === 'rechazo').length,
    errores: items.filter((i) => i.estado === 'error').length,
    omitidas: items.filter((i) => i.estado === 'omitida_por_tope').length,
    exactitud: { n: mc.length, aciertos, valor: razon(aciertos, mc.length) },
    calidad: {
      n: juzgadas.length,
      correctas: juzgadas.filter((i) => i.veredicto === 'correcta').length,
      parciales: juzgadas.filter((i) => i.veredicto === 'parcial').length,
      incorrectas: juzgadas.filter((i) => i.veredicto === 'incorrecta').length,
      valor: razon(suma, juzgadas.length),
      sin_juzgar: ab.length - juzgadas.length,
    },
    precision_cita: { n: citas.length, aciertos: aciertosCita, valor: razon(aciertosCita, citas.length) },
    alucinacion: { n: juzgadas.length, inventadas, tasa: razon(inventadas, juzgadas.length) },
    costo_usd: items.reduce((a, i) => a + i.costo_usd + i.costo_juez_usd, 0),
  };
}

function agrupar(items: ItemResultado[], clave: (i: ItemResultado) => string): Record<string, Resumen> {
  const grupos = new Map<string, ItemResultado[]>();
  for (const i of items) {
    const k = clave(i);
    grupos.set(k, [...(grupos.get(k) ?? []), i]);
  }
  return Object.fromEntries([...grupos.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, resumir(v)]));
}

export interface InformeModelo {
  esquema_version: 1;
  aviso: string;
  fecha: string;
  modelo: { alias: string; proveedor: string; id: string };
  juez: { alias: string; id: string };
  dataset: { archivo: string; sha256: string; preguntas: number; validadas_por_luis: number };
  tope_usd: number;
  gasto_corrida_usd: number;
  cortada_por_tope: boolean;
  abortada: string | null;
  resumen: Resumen;
  por_dominio: Record<string, Resumen>;
  por_dificultad: Record<string, Resumen>;
  items: ItemResultado[];
}

export const AVISO =
  'Benchmark de conocimiento normativo. NO es asesoria legal, fiscal ni aduanera. Ver DISCLAIMER.md.';

export function construirInformes(
  r: ResultadoCorrida,
  meta: { fecha: string; archivo: string; datasetSha: string; preguntas: number; validadas: number },
): InformeModelo[] {
  return r.modelos.map((m: ResultadoModelo) => ({
    esquema_version: 1 as const,
    aviso: AVISO,
    fecha: meta.fecha,
    modelo: { alias: m.alias, proveedor: m.proveedor, id: m.modelo_id },
    juez: { alias: r.juez.alias, id: r.juez.modelo_id },
    dataset: { archivo: meta.archivo, sha256: meta.datasetSha, preguntas: meta.preguntas, validadas_por_luis: meta.validadas },
    tope_usd: r.tope_usd,
    gasto_corrida_usd: r.gasto_usd,
    cortada_por_tope: r.cortada_por_tope,
    abortada: r.abortada,
    resumen: resumir(m.items),
    por_dominio: agrupar(m.items, (i) => i.dominio),
    por_dificultad: agrupar(m.items, (i) => `dificultad ${i.dificultad}`),
    items: m.items,
  }));
}

const pct = (v: number | null): string => (v === null ? 'n/d' : `${(v * 100).toFixed(1)}%`);

function fila(nombre: string, s: Resumen): string {
  return (
    `| ${nombre} | ${s.n} | ${s.respondidas} | ${s.rechazos}/${s.errores}/${s.omitidas} ` +
    `| ${pct(s.exactitud.valor)} (${s.exactitud.aciertos}/${s.exactitud.n}) ` +
    `| ${pct(s.calidad.valor)} (${s.calidad.n}) ` +
    `| ${pct(s.precision_cita.valor)} (${s.precision_cita.aciertos}/${s.precision_cita.n}) ` +
    `| ${pct(s.alucinacion.tasa)} (${s.alucinacion.inventadas}/${s.alucinacion.n}) |`
  );
}

const CABECERA =
  '| Grupo | Preguntas | Respondidas | Rechazos/Errores/Omitidas | Exactitud (MC) | Calidad (abiertas) | Precision de cita | Alucinacion (juez) |\n' +
  '|---|---|---|---|---|---|---|---|';

export function resumenMarkdown(informes: InformeModelo[]): string {
  if (informes.length === 0) return '# Resumen\n\nSin modelos.\n';
  const a = informes[0];
  const out: string[] = [
    `# Resumen de la corrida ${a.fecha}`,
    '',
    `> **Aviso:** ${AVISO}`,
    '',
    `- Dataset: \`${a.dataset.archivo}\` (${a.dataset.preguntas} preguntas; ${a.dataset.validadas_por_luis} con \`validado_por\`; sha256 ${a.dataset.sha256.slice(0, 12)})`,
    `- Juez: \`${a.juez.id}\` (alias ${a.juez.alias})`,
    `- Gasto de la corrida: $${a.gasto_corrida_usd.toFixed(4)} de un tope de $${a.tope_usd.toFixed(2)}`,
  ];
  if (a.cortada_por_tope) out.push('- **ATENCION: la corrida se corto por el tope de gasto; hay preguntas omitidas.**');
  if (a.abortada) out.push(`- **ATENCION: corrida abortada:** ${a.abortada}`);
  out.push(
    '',
    '`Calidad` = media de la rubrica (correcta 1, parcial 0.5, incorrecta 0). `Alucinacion` es una senal del juez, no una verificacion contra `corpus/`. Rechazos (refusal), errores y omitidas no cuentan como respuestas.',
    '',
    '## Comparativa',
    '',
    CABECERA,
    ...informes.map((i) => fila(`${i.modelo.alias} (${i.modelo.id})`, i.resumen)),
  );
  for (const i of informes) {
    out.push('', `## ${i.modelo.alias}`, '', '### Por dominio', '', CABECERA);
    for (const [k, s] of Object.entries(i.por_dominio)) out.push(fila(k, s));
    out.push('', '### Por dificultad', '', CABECERA);
    for (const [k, s] of Object.entries(i.por_dificultad)) out.push(fila(k, s));
  }
  return out.join('\n') + '\n';
}
