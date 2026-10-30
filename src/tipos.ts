// Tipos compartidos del harness. Solo anotaciones: Node 24 las borra al ejecutar,
// por eso los demas modulos los importan con `import type`.

export type Dominio = 'tributario' | 'aduanas' | 'mercantil';

export interface Pregunta {
  id: string;
  dominio: Dominio;
  tipo: 'opcion_multiple' | 'abierta';
  pregunta: string;
  opciones?: string[];
  respuesta: string;
  articulo_ref: string;
  norma: string;
  gaceta: string;
  dificultad: 1 | 2 | 3;
  vigente: boolean;
  validado_por: string | null;
  fecha_validacion: string | null;
}

export interface Precio {
  entrada: number; // USD por millon de tokens
  salida: number;
}

export interface ConfigModelo {
  proveedor: 'anthropic' | 'lmstudio';
  id: string;
  precio_usd_por_mtok: Precio;
  max_tokens: number;
  effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  temperature?: number;
}

export interface ConfigGlobal {
  version: number;
  tope_gasto_usd_por_defecto: number;
  juez_por_defecto: string;
  modelos: Record<string, ConfigModelo>;
}

export interface PeticionModelo {
  system: string;
  prompt: string;
}

export interface RespuestaModelo {
  estado: 'ok' | 'rechazo';
  texto: string;
  tokens_entrada: number;
  tokens_salida: number;
  stop_reason: string | null;
  detalle?: string;
}

/** Cliente de un proveedor. Los reales y los simulados cumplen esta misma forma. */
export interface Cliente {
  /** Valida el entorno SIN gastar (clave presente, servidor vivo) y devuelve el id real del modelo. */
  preparar(): Promise<string>;
  /** Parametros que cambian la respuesta; entran en la clave de cache. */
  parametros(): Record<string, unknown>;
  generar(peticion: PeticionModelo): Promise<RespuestaModelo>;
}

/** Error que aborta la corrida entera (clave invalida, LM Studio caido). */
export class ErrorFatal extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorFatal';
  }
}

/** Error de una sola llamada, ya agotados los reintentos: el item queda como "error" y la corrida sigue. */
export class ErrorLlamada extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorLlamada';
  }
}
