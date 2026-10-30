import type { Cliente, ConfigModelo } from '../tipos.ts';
import { crearClienteAnthropic } from './anthropic.ts';
import { crearClienteLmStudio } from './lmstudio.ts';

export function crearCliente(config: ConfigModelo): Cliente {
  if (config.proveedor === 'anthropic') return crearClienteAnthropic(config);
  if (config.proveedor === 'lmstudio') return crearClienteLmStudio(config);
  throw new Error(`Proveedor no soportado: ${String((config as ConfigModelo).proveedor)}`);
}
