// Logica pura de la tabla de posiciones (sin DOM). Entrada: informes de results/<modelo>/<fecha>.json
// (esquema_version 1, ver ADR-004). Salida: el JSON que consume la pagina.

// Puntaje de posicion (decision de F5, ver web/README.md): aciertos de opcion multiple + suma de la
// rubrica de abiertas, entre las preguntas puntuadas de ambos tipos. Null si no hay nada puntuado.
export function puntajeGlobal(resumen) {
  if (!resumen) return null;
  const nMc = resumen.exactitud?.n ?? 0;
  const aciertos = resumen.exactitud?.aciertos ?? 0;
  const nJ = resumen.calidad?.n ?? 0;
  const suma = (resumen.calidad?.valor ?? 0) * nJ;
  const total = nMc + nJ;
  return total > 0 ? (aciertos + suma) / total : null;
}

// Ordena por valor descendente; empates comparten puesto (1,1,3); sin valor al final y sin puesto.
export function posiciones(filas) {
  const con = filas.filter((f) => f.valor !== null && f.valor !== undefined);
  const sin = filas.filter((f) => f.valor === null || f.valor === undefined);
  con.sort((a, b) => b.valor - a.valor || String(a.alias).localeCompare(String(b.alias)));
  let puestoPrev = 0;
  const ordenadas = con.map((f, i) => {
    const puesto = i > 0 && f.valor === con[i - 1].valor ? puestoPrev : i + 1;
    puestoPrev = puesto;
    return { ...f, puesto };
  });
  return [...ordenadas, ...sin.map((f) => ({ ...f, puesto: null }))];
}

const nulo = (v) => (v === undefined ? null : v);

export function construirDatos(informes) {
  const dominios = [...new Set(informes.flatMap((i) => Object.keys(i.por_dominio ?? {})))].sort();
  const base = informes.map((i) => ({
    alias: i.modelo.alias,
    proveedor: i.modelo.proveedor,
    modelo_id: i.modelo.id,
    fecha: i.fecha,
    juez: i.juez?.id ?? null,
    preguntas: i.dataset?.preguntas ?? null,
    validadas: i.dataset?.validadas_por_luis ?? null,
    n: i.resumen?.n ?? 0,
    respondidas: i.resumen?.respondidas ?? 0,
    cortada: Boolean(i.cortada_por_tope),
    abortada: i.abortada ?? null,
    valor: puntajeGlobal(i.resumen),
    exactitud: nulo(i.resumen?.exactitud?.valor),
    calidad: nulo(i.resumen?.calidad?.valor),
    cita: nulo(i.resumen?.precision_cita?.valor),
    alucinacion: nulo(i.resumen?.alucinacion?.tasa),
    _dom: i.por_dominio ?? {},
  }));
  const globales = posiciones(base);
  const porDominio = {};
  for (const d of dominios) {
    const filas = base.filter((b) => b._dom[d]).map((b) => ({ alias: b.alias, valor: puntajeGlobal(b._dom[d]), n: b._dom[d].n }));
    porDominio[d] = new Map(posiciones(filas).map((f) => [f.alias, f]));
  }
  const modelos = globales.map(({ valor, _dom, ...m }) => {
    const doms = {};
    for (const d of dominios) {
      const f = porDominio[d].get(m.alias);
      if (f) doms[d] = { valor: f.valor, puesto: f.puesto, n: f.n };
    }
    return { ...m, global: valor, dominios: doms };
  });
  const fechas = informes.map((i) => i.fecha).sort();
  return {
    esquema_version: 1,
    fecha: fechas.length ? fechas[fechas.length - 1] : null,
    juez: informes.length ? (informes[0].juez?.id ?? null) : null,
    dominios,
    modelos,
  };
}
