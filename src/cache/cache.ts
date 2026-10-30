// Cache de respuestas en disco (CLAUDE.md, regla 5): una llamada ya pagada no se repite.
// Clave = sha256 del JSON canonico (claves ordenadas) de: tipo, proveedor, modelo real,
// parametros, system, prompt, id de pregunta y hash del registro de la pregunta
// (version del dataset: si la pregunta cambia, la clave cambia).
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function canonico(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonico).join(',')}]`;
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o)
      .filter((k) => o[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonico(o[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v);
}

export function sha256(texto: string): string {
  return createHash('sha256').update(texto).digest('hex');
}

export class Cache {
  dir: string;
  aciertos = 0;
  fallos = 0;

  constructor(dir: string) {
    this.dir = dir;
    mkdirSync(dir, { recursive: true });
  }

  clave(partes: Record<string, unknown>): string {
    return sha256(canonico(partes));
  }

  leer<T>(clave: string): T | null {
    try {
      const v = JSON.parse(readFileSync(join(this.dir, `${clave}.json`), 'utf8')) as T;
      this.aciertos++;
      return v;
    } catch {
      this.fallos++;
      return null;
    }
  }

  escribir(clave: string, valor: unknown): void {
    const destino = join(this.dir, `${clave}.json`);
    const tmp = `${destino}.tmp`;
    writeFileSync(tmp, JSON.stringify(valor), 'utf8');
    renameSync(tmp, destino); // escritura atomica: una corrida cortada no deja JSON a medias
  }
}
