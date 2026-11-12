// Lee results/<modelo>/<fecha>.json (esquema_version 1) y genera web/datos.json.
// Toma la corrida mas reciente de cada modelo; omite con aviso lo que no sea esquema 1.
// Uso: npm run web:datos
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { construirDatos } from '../web/logica.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function* archivosJson(dir) {
  if (!existsSync(dir)) return;
  for (const sub of readdirSync(dir)) {
    const p = join(dir, sub);
    if (!statSync(p).isDirectory()) continue;
    for (const f of readdirSync(p)) if (f.endsWith('.json')) yield join(p, f);
  }
}

export function construir(dirResultados, salida, aviso = (m) => console.warn(m)) {
  const porModelo = new Map();
  for (const ruta of archivosJson(dirResultados)) {
    let inf;
    try {
      inf = JSON.parse(readFileSync(ruta, 'utf8'));
    } catch {
      aviso(`Omitido (JSON invalido): ${ruta}`);
      continue;
    }
    if (inf?.esquema_version !== 1 || !inf.modelo?.alias || !inf.fecha || !inf.resumen) {
      aviso(`Omitido (no es esquema_version 1): ${ruta}`);
      continue;
    }
    const previo = porModelo.get(inf.modelo.alias);
    if (!previo || inf.fecha > previo.fecha) porModelo.set(inf.modelo.alias, inf);
  }
  const datos = construirDatos([...porModelo.values()]);
  writeFileSync(salida, JSON.stringify(datos, null, 2) + '\n', 'utf8');
  return datos;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const d = construir(join(RAIZ, 'results'), join(RAIZ, 'web', 'datos.json'));
  console.log(`web/datos.json: ${d.modelos.length} modelo(s).`);
}
