// Utilidades para localizar articulos y fragmentos literales en los textos locales
// (fuera del repo, ADR-003). Sin dependencias.
import { readFileSync } from 'node:fs';

export const normalizar = (s) => String(s)
  .normalize('NFC')
  .replace(/[\u00ad\u200b]/g, '')
  .replace(/[“”«»„]/g, '"')
  .replace(/[‘’´`]/g, "'")
  .replace(/[–—]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

// Cabecera de articulo al inicio de linea, con punto/dos puntos/guion tras el numero
const CABECERA = /^\s*Art[ií]culo\s+(\d{1,3}(?:\.\d{3})+|\d{1,4})\s*(?:[°º˚]|\.|:|-|–)/;

export function segmentarArticulos(texto) {
  const lineas = texto.replace(/\r/g, '').split('\n');
  const segs = []; // {n, lineas:[]}
  let actual = null;
  for (const l of lineas) {
    const m = l.match(CABECERA);
    if (m) { actual = { n: Number(m[1].replace(/\./g, '')), partes: [l] }; segs.push(actual); }
    else if (actual) actual.partes.push(l);
  }
  return segs.map((s) => ({ n: s.n, texto: normalizar(s.partes.join(' ')) }));
}

export function articulosCitados(articuloRef) {
  // "Articulo 55, numeral 1" -> [55]; "Articulos 14 y 15" -> [14, 15]; "Articulos 10 al 12" -> [10]
  const m = String(articuloRef).match(/Art[ií]culos?\s+([0-9][0-9\s,y.\-]*)/i);
  if (!m) return [];
  return [...m[1].matchAll(/\d+/g)].map((x) => Number(x[0]));
}

export const leerTexto = (ruta) => readFileSync(ruta, 'utf8');
