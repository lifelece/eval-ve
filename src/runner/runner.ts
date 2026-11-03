// Orquesta preguntas -> modelos -> respuestas -> juez, con cache y tope de gasto.
import type { Cache } from '../cache/cache.ts';
import { sha256 } from '../cache/cache.ts';
import { PUNTOS, parsearJuez, promptJuez } from '../juez/juez.ts';
import type { SalidaJuez } from '../juez/juez.ts';
import { precisionCita, puntuarOpcionMultiple } from '../juez/puntuar.ts';
import type { Cliente, ConfigModelo, PeticionModelo, Pregunta, RespuestaModelo } from '../tipos.ts';
import { ErrorFatal, ErrorLlamada } from '../tipos.ts';
import { costoUsd, estimarPeorCaso } from './presupuesto.ts';
import type { Presupuesto } from './presupuesto.ts';
import { promptPregunta } from './prompts.ts';

export interface EntradaModelo {
  alias: string;
  config: ConfigModelo;
  cliente: Cliente;
  /** Id real del modelo (lo devuelve cliente.preparar()); entra en la clave de cache. */
  modeloId: string;
}

export interface ItemResultado {
  id: string;
  dominio: string;
  dificultad: number;
  tipo: string;
  /** ok | rechazo | error | omitida_por_tope */
  estado: string;
  respuesta_modelo: string | null;
  detalle: string | null;
  desde_cache: boolean;
  tokens_entrada: number;
  tokens_salida: number;
  costo_usd: number;
  // Opcion multiple
  letra_elegida: string | null;
  correcta: boolean | null;
  // Abiertas
  veredicto: string | null;
  puntaje: number | null;
  justificacion_juez: string | null;
  cita_inventada: boolean | null;
  /** ok | invalido | sin_tope | null (no aplica) */
  estado_juez: string | null;
  costo_juez_usd: number;
  // Metrica de cita (abiertas)
  cita_correcta: boolean | null;
}

export interface ResultadoModelo {
  alias: string;
  proveedor: string;
  modelo_id: string;
  items: ItemResultado[];
}

export interface ResultadoCorrida {
  modelos: ResultadoModelo[];
  juez: { alias: string; modelo_id: string };
  gasto_usd: number;
  tope_usd: number;
  cortada_por_tope: boolean;
  abortada: string | null;
  cache: { aciertos: number; fallos: number };
}

export interface OpcionesEjecutar {
  preguntas: Pregunta[];
  modelos: EntradaModelo[];
  juez: EntradaModelo;
  cache: Cache;
  presupuesto: Presupuesto;
  onProgreso?: (mensaje: string) => void;
}

type Llamada = { tope: true } | { tope: false; r: RespuestaModelo; desdeCache: boolean; costo: number };

interface EntradaCache {
  r: RespuestaModelo;
}

async function llamar(
  o: OpcionesEjecutar,
  e: EntradaModelo,
  tipo: 'respuesta' | 'juez',
  pet: PeticionModelo,
  extra: Record<string, unknown>,
): Promise<Llamada> {
  const clave = o.cache.clave({
    tipo,
    proveedor: e.config.proveedor,
    modelo: e.modeloId,
    parametros: e.cliente.parametros(),
    system: pet.system,
    prompt: pet.prompt,
    ...extra,
  });
  const guardada = o.cache.leer<EntradaCache>(clave);
  if (guardada) return { tope: false, r: guardada.r, desdeCache: true, costo: 0 };

  const estimado = estimarPeorCaso(e.config.precio_usd_por_mtok, e.config.max_tokens, pet.system, pet.prompt);
  if (!o.presupuesto.puedeGastar(estimado)) return { tope: true };

  const r = await e.cliente.generar(pet); // puede lanzar ErrorLlamada / ErrorFatal
  const costo = costoUsd(r.tokens_entrada, r.tokens_salida, e.config.precio_usd_por_mtok);
  o.presupuesto.registrar(costo);
  o.cache.escribir(clave, { r, modelo: e.modeloId, tipo, costo_usd: costo });
  return { tope: false, r, desdeCache: false, costo };
}

function itemVacio(p: Pregunta, estado: string): ItemResultado {
  return {
    id: p.id,
    dominio: p.dominio,
    dificultad: p.dificultad,
    tipo: p.tipo,
    estado,
    respuesta_modelo: null,
    detalle: null,
    desde_cache: false,
    tokens_entrada: 0,
    tokens_salida: 0,
    costo_usd: 0,
    letra_elegida: null,
    correcta: null,
    veredicto: null,
    puntaje: null,
    justificacion_juez: null,
    cita_inventada: null,
    estado_juez: null,
    costo_juez_usd: 0,
    cita_correcta: null,
  };
}

export async function ejecutar(o: OpcionesEjecutar): Promise<ResultadoCorrida> {
  const salida: ResultadoCorrida = {
    modelos: [],
    juez: { alias: o.juez.alias, modelo_id: o.juez.modeloId },
    gasto_usd: 0,
    tope_usd: o.presupuesto.tope,
    cortada_por_tope: false,
    abortada: null,
    cache: { aciertos: 0, fallos: 0 },
  };
  const progreso = o.onProgreso ?? (() => {});

  try {
    for (const m of o.modelos) {
      const rm: ResultadoModelo = { alias: m.alias, proveedor: m.config.proveedor, modelo_id: m.modeloId, items: [] };
      salida.modelos.push(rm);
      for (const p of o.preguntas) {
        if (salida.cortada_por_tope) {
          rm.items.push(itemVacio(p, 'omitida_por_tope'));
          continue;
        }
        const item = await procesar(o, m, p);
        rm.items.push(item);
        if (item.estado === 'omitida_por_tope' || item.estado_juez === 'sin_tope') salida.cortada_por_tope = true;
        progreso(`${m.alias} ${p.id}: ${item.estado}${item.desde_cache ? ' (cache)' : ''} gasto=$${o.presupuesto.gastado.toFixed(4)}`);
      }
    }
  } catch (e) {
    if (e instanceof ErrorFatal) salida.abortada = e.message;
    else throw e;
  }

  salida.gasto_usd = o.presupuesto.gastado;
  salida.cache = { aciertos: o.cache.aciertos, fallos: o.cache.fallos };
  return salida;
}

async function procesar(o: OpcionesEjecutar, m: EntradaModelo, p: Pregunta): Promise<ItemResultado> {
  const datasetSha = sha256(JSON.stringify(p));
  const item = itemVacio(p, 'ok');
  const pet = promptPregunta(p);

  let ll: Llamada;
  try {
    ll = await llamar(o, m, 'respuesta', pet, { pregunta_id: p.id, pregunta_sha: datasetSha });
  } catch (e) {
    if (e instanceof ErrorLlamada) {
      item.estado = 'error';
      item.detalle = e.message;
      return item;
    }
    throw e;
  }
  if (ll.tope) {
    item.estado = 'omitida_por_tope';
    return item;
  }

  item.desde_cache = ll.desdeCache;
  item.tokens_entrada = ll.r.tokens_entrada;
  item.tokens_salida = ll.r.tokens_salida;
  item.costo_usd = ll.costo;
  item.detalle = ll.r.detalle ?? null;

  if (ll.r.estado === 'rechazo') {
    item.estado = 'rechazo'; // no es una respuesta: no entra en exactitud ni en calidad
    return item;
  }
  item.respuesta_modelo = ll.r.texto;

  if (p.tipo === 'opcion_multiple') {
    const s = puntuarOpcionMultiple(p, ll.r.texto);
    item.correcta = s.correcta;
    item.letra_elegida = s.letra_elegida;
    return item;
  }

  item.cita_correcta = precisionCita(p.articulo_ref, ll.r.texto);
  await juzgar(o, p, item, ll.r.texto, datasetSha);
  return item;
}

async function juzgar(o: OpcionesEjecutar, p: Pregunta, item: ItemResultado, texto: string, datasetSha: string): Promise<void> {
  let jl: Llamada;
  try {
    jl = await llamar(o, o.juez, 'juez', promptJuez(p, texto), { pregunta_id: p.id, pregunta_sha: datasetSha });
  } catch (e) {
    if (e instanceof ErrorLlamada) {
      item.estado_juez = 'invalido';
      item.justificacion_juez = `El juez fallo: ${e.message}`;
      return;
    }
    throw e;
  }
  if (jl.tope) {
    item.estado_juez = 'sin_tope';
    return;
  }
  item.costo_juez_usd = jl.costo;
  if (jl.r.estado === 'rechazo') {
    item.estado_juez = 'invalido';
    item.justificacion_juez = 'El juez rechazo la solicitud (refusal).';
    return;
  }
  const j: SalidaJuez | null = parsearJuez(jl.r.texto);
  if (!j) {
    item.estado_juez = 'invalido';
    item.justificacion_juez = `Salida del juez no interpretable: ${jl.r.texto.slice(0, 200)}`;
    return;
  }
  item.estado_juez = 'ok';
  item.veredicto = j.veredicto;
  item.puntaje = PUNTOS[j.veredicto];
  item.justificacion_juez = j.justificacion;
  item.cita_inventada = j.cita_inventada;
}
