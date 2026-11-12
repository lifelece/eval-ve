// Capa de DOM. La logica de agregacion y orden vive en logica.mjs (probada con node --test).
// Todo el texto se inserta con textContent: ningun dato de results/ se interpreta como HTML.

const TXT = {
  es: {
    titulo: 'eval-ve',
    sub: 'Benchmark abierto de conocimiento normativo venezolano: tributos, aduanas y derecho mercantil.',
    avisoH: 'No es asesoria legal, fiscal ni aduanera. ',
    aviso: 'Esta tabla mide conocimiento normativo de modelos de IA. Un buen puntaje no sustituye a un abogado, a un contador ni a un agente aduanal.',
    global: 'Global',
    dominios: { aduanas: 'Aduanas', mercantil: 'Mercantil', tributario: 'Tributario' },
    vacioH: 'Aun no hay corridas publicadas.',
    vacio: 'Cuando se publique la primera corrida, los modelos apareceran aqui.',
    meta: (f, j) => `Ultima corrida: ${f}. Modelo juez: ${j}.`,
    preguntas: 'Preguntas',
    fecha: 'Fecha de corrida',
    juez: 'Juez',
    exactitud: 'Exactitud (opcion multiple)',
    calidad: 'Calidad (abiertas)',
    cita: 'Precision de cita',
    aluc: 'Alucinacion (senal del juez)',
    parcial: (r, n) => `Corrida parcial: ${r} de ${n} preguntas respondidas.`,
    cortada: 'La corrida se corto por el tope de gasto.',
    abortada: 'Corrida abortada: ',
    sinValidar: (v, n) => `Solo ${v} de ${n} preguntas tienen validacion humana.`,
    limH: 'Limitaciones',
    lim: [
      'El juez es un modelo de lenguaje: puede equivocarse al calificar respuestas abiertas. Una muestra se revisa a mano.',
      'La muestra es pequena: las diferencias de pocos puntos entre modelos no son concluyentes.',
      'La tasa de alucinacion es una senal del juez, no una verificacion contra el texto de las normas.',
      'Cobertura parcial de las tres ramas; cada pregunta congela la version de la norma citada en su Gaceta.',
      'El puntaje de posicion es la media de aciertos de opcion multiple y de la rubrica de abiertas (correcta 1, parcial 0.5, incorrecta 0), ponderada por numero de preguntas.',
      'Un conjunto privado de preguntas no se publica y sirve para detectar memorizacion.',
    ],
    pie: 'Codigo MIT, datos CC BY 4.0. Ver DISCLAIMER.md en el repositorio.',
    error: 'No se pudieron cargar los datos.',
    nd: 'n/d',
  },
  en: {
    titulo: 'eval-ve',
    sub: 'Open benchmark of Venezuelan regulatory knowledge: tax, customs and commercial law.',
    avisoH: 'Not legal, tax or customs advice. ',
    aviso: 'This table measures the regulatory knowledge of AI models. A high score does not replace a lawyer, an accountant or a customs agent.',
    global: 'Overall',
    dominios: { aduanas: 'Customs', mercantil: 'Commercial', tributario: 'Tax' },
    vacioH: 'No runs published yet.',
    vacio: 'Models will appear here once the first run is published.',
    meta: (f, j) => `Latest run: ${f}. Judge model: ${j}.`,
    preguntas: 'Questions',
    fecha: 'Run date',
    juez: 'Judge',
    exactitud: 'Accuracy (multiple choice)',
    calidad: 'Quality (open-ended)',
    cita: 'Citation precision',
    aluc: 'Hallucination (judge signal)',
    parcial: (r, n) => `Partial run: ${r} of ${n} questions answered.`,
    cortada: 'The run was cut by the spending cap.',
    abortada: 'Run aborted: ',
    sinValidar: (v, n) => `Only ${v} of ${n} questions are human-validated.`,
    limH: 'Limitations',
    lim: [
      'The judge is a language model: it can misgrade open-ended answers. A sample is reviewed by hand.',
      'The sample is small: differences of a few points between models are not conclusive.',
      'The hallucination rate is a judge signal, not a check against the text of the norms.',
      'Partial coverage of the three branches; each question freezes the version of the norm cited in its Gazette.',
      'The ranking score is the mean of multiple-choice hits and the open-ended rubric (correct 1, partial 0.5, incorrect 0), weighted by number of questions.',
      'A private question set is not published and is used to detect memorization.',
    ],
    pie: 'Code MIT, data CC BY 4.0. See DISCLAIMER.md in the repository.',
    error: 'Could not load the data.',
    nd: 'n/a',
  },
};

const $ = (id) => document.getElementById(id);
const estado = { lang: 'es', filtro: 'global', datos: null };

try {
  const g = localStorage.getItem('evalve-lang');
  if (g === 'es' || g === 'en') estado.lang = g;
  else if ((navigator.language || '').toLowerCase().startsWith('en')) estado.lang = 'en';
} catch {
  /* sin almacenamiento: se usa el idioma por defecto */
}

const pct = (v, t) => (v === null || v === undefined ? t.nd : `${(v * 100).toFixed(1)}%`);
const fechaLegible = (f) => (f ? f.replace('_', ' ').replace(/(\d{2})(\d{2})(\d{2})$/, '$1:$2:$3') : '');

function el(tag, clase, texto) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

function dato(dl, etiqueta, valor) {
  const d = el('div');
  d.append(el('dt', '', etiqueta), el('dd', '', String(valor)));
  dl.append(d);
}

function tarjeta(m, t) {
  const dom = estado.filtro === 'global' ? null : m.dominios[estado.filtro];
  const valor = dom ? dom.valor : m.global;
  const puesto = dom ? dom.puesto : m.puesto;
  const li = el('li', 'tarjeta');
  const tope = el('div', 'tope');
  const nombre = el('div', 'nombre');
  nombre.append(el('b', '', m.alias), el('small', '', m.modelo_id));
  tope.append(el('span', 'puesto', puesto ? String(puesto) : '-'), nombre, el('span', 'valor', pct(valor, t)));
  li.append(tope);
  const barra = el('div', 'barra');
  barra.setAttribute('role', 'img');
  barra.setAttribute('aria-label', pct(valor, t));
  const relleno = el('i');
  relleno.style.width = `${Math.max(0, Math.min(1, valor ?? 0)) * 100}%`;
  barra.append(relleno);
  li.append(barra);
  const dl = el('dl', 'datos');
  dato(dl, t.preguntas, dom ? dom.n : m.n);
  dato(dl, t.fecha, fechaLegible(m.fecha));
  dato(dl, t.juez, m.juez ?? t.nd);
  dato(dl, t.exactitud, pct(m.exactitud, t));
  dato(dl, t.calidad, pct(m.calidad, t));
  dato(dl, t.cita, pct(m.cita, t));
  dato(dl, t.aluc, pct(m.alucinacion, t));
  li.append(dl);
  const alertas = [];
  if (m.respondidas < m.n) alertas.push(t.parcial(m.respondidas, m.n));
  if (m.cortada) alertas.push(t.cortada);
  if (m.abortada) alertas.push(t.abortada + m.abortada);
  if (m.validadas !== null && m.preguntas !== null && m.validadas < m.preguntas) alertas.push(t.sinValidar(m.validadas, m.preguntas));
  for (const a of alertas) li.append(el('p', 'alerta', a));
  return li;
}

function pintar() {
  const t = TXT[estado.lang];
  const d = estado.datos;
  document.documentElement.lang = estado.lang;
  $('t-titulo').textContent = t.titulo;
  $('t-sub').textContent = t.sub;
  $('t-aviso-h').textContent = t.avisoH;
  $('t-aviso').textContent = t.aviso;
  $('t-lim-h').textContent = t.limH;
  $('t-pie').textContent = t.pie;
  const lim = $('t-lim');
  lim.replaceChildren(...t.lim.map((x) => el('li', '', x)));
  for (const b of document.querySelectorAll('[data-lang]')) b.setAttribute('aria-pressed', String(b.dataset.lang === estado.lang));

  const lista = $('lista');
  const vacio = $('vacio');
  const filtros = $('filtros');
  if (!d) {
    vacio.hidden = false;
    vacio.replaceChildren(el('strong', '', t.error));
    lista.replaceChildren();
    filtros.replaceChildren();
    $('meta').textContent = '';
    return;
  }
  if (d.modelos.length === 0) {
    vacio.hidden = false;
    vacio.replaceChildren(el('strong', '', t.vacioH), el('span', '', t.vacio));
    lista.replaceChildren();
    filtros.replaceChildren();
    $('meta').textContent = '';
    return;
  }
  vacio.hidden = true;
  const opciones = ['global', ...d.dominios];
  if (!opciones.includes(estado.filtro)) estado.filtro = 'global';
  filtros.replaceChildren(
    ...opciones.map((o) => {
      const b = el('button', '', o === 'global' ? t.global : (t.dominios[o] ?? o));
      b.type = 'button';
      b.setAttribute('aria-pressed', String(o === estado.filtro));
      b.addEventListener('click', () => {
        estado.filtro = o;
        pintar();
      });
      return b;
    }),
  );
  $('meta').textContent = t.meta(fechaLegible(d.fecha), d.juez ?? t.nd);
  let modelos = d.modelos;
  if (estado.filtro !== 'global') {
    modelos = modelos
      .filter((m) => m.dominios[estado.filtro])
      .sort((a, b) => (a.dominios[estado.filtro].puesto ?? 1e9) - (b.dominios[estado.filtro].puesto ?? 1e9));
  }
  lista.replaceChildren(...modelos.map((m) => tarjeta(m, t)));
}

for (const b of document.querySelectorAll('[data-lang]')) {
  b.addEventListener('click', () => {
    estado.lang = b.dataset.lang;
    try {
      localStorage.setItem('evalve-lang', estado.lang);
    } catch {
      /* sin almacenamiento */
    }
    pintar();
  });
}

try {
  const r = await fetch('datos.json', { cache: 'no-cache' });
  if (!r.ok) throw new Error(String(r.status));
  estado.datos = await r.json();
} catch {
  estado.datos = null;
}
pintar();
