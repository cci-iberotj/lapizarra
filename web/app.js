/* ═══════════════════════════════════════════════════════════
   CABINA · Departamento de Diseño y Medios · IBERO Tijuana
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Catálogos ─────────────────────────────────────────── */

const PILARES = [
  { id: 'vida',     nombre: 'Vida IBERO',    color: 'var(--pilar-vida)',    carril: 'casual',        meta: 30 },
  { id: 'academia', nombre: 'Academia IBERO',color: 'var(--pilar-academia)',carril: 'institucional', meta: 20 },
  { id: 'se_ibero', nombre: 'Sé IBERO',      color: 'var(--pilar-se)',      carril: 'institucional', meta: 18 },
  { id: 'orgullo',  nombre: 'Orgullo IBERO', color: 'var(--pilar-orgullo)', carril: 'institucional', meta: 12 },
  { id: 'cultura',  nombre: 'Cultura Viva',  color: 'var(--pilar-cultura)', carril: 'hibrido',       meta: 10 },
  { id: 'voz',      nombre: 'Voz IBERO',     color: 'var(--pilar-voz)',     carril: 'institucional', meta: 10 },
];

/* Vocabulario que delata a cada pilar. Se usa para sugerir la clasificación
   de una idea escrita en lenguaje natural — es una sugerencia editable, no
   una decisión: tú siempre confirmas antes de guardar. */
const SENALES_PILAR = {
  vida: ['pov', 'meme', 'cuando', 'nadie', 'todos los que', 'humor', 'chiste', 'cafeteria',
         'cafetería', 'pasillo', 'examen', 'parcial', 'finales', 'desvelo', 'crush', 'viernes',
         'lunes', 'compañer', 'amig', 'estudiante dice', 'reto', 'trend', 'audio', 'baile',
         'campus', 'estacionamiento', 'lonche', 'relatable', 'tipos de', 'day in the life'],
  orgullo: ['egresad', 'investigacion', 'investigación', 'publicac', 'premio', 'reconocimiento',
            'galardon', 'galardón', 'doctor', 'maestr', 'profesor', 'academic', 'académic',
            'ponencia', 'congreso', 'logro', 'primer lugar', 'ganó', 'gano', 'destacad',
            'experiencias ibero', 'testimonio', 'trayectoria', 'informe', 'ranking'],
  se_ibero: ['inscrip', 'admision', 'admisión', 'convocatoria', 'beca', 'colegiatura',
             'licenciatura', 'posgrado', 'maestria', 'maestría', 'doctorado', 'diplomado',
             'oferta', 'carrera', 'plan de estudios', 'nuevo ingreso', 'aspirante',
             'estudia', 'examen de admision', 'informes', 'costo', 'cuanto cuesta',
             'proceso', 'ficha', 'expo', 'papas', 'padres de familia', 'colegiatura',
             'medicina', 'enfermeria', 'enfermería', 'arquitectura', 'psicologia', 'psicología',
             'derecho', 'nutricion', 'nutrición', 'mecatronica', 'mecatrónica', 'comunicacion',
             'comunicación', 'industrial', 'negocios'],
  cultura: ['taller', 'concierto', 'exposicion', 'exposición', 'muestra', 'festival',
            'obra', 'teatro', 'danza', 'musica', 'música', 'cine', 'galeria', 'galería',
            'cultural', 'arte', 'cci', 'coro', 'deportiv', 'torneo', 'intersuj', 'evento',
            'conferencia', 'foro', 'feria', 'convivencia'],
  academia: ['nota', 'analisis', 'análisis', 'experto', 'especialista', 'academic', 'académic',
             'investigador', 'opina', 'opinion', 'opinión', 'explica', 'coyuntura', 'actualidad',
             'entrevista a', 'declara', 'postura', 'fenomeno', 'fenómeno', 'tendencia economica',
             'economia', 'economía', 'politica', 'política', 'salud publica', 'salud pública',
             'seguridad', 'migracion', 'migración', 'frontera', 'elecciones', 'inflacion',
             'inflación', 'tipo de cambio', 'reforma', 'crisis', 'debate', 'contexto',
             'por que esta pasando', 'qué significa', 'que significa', 'a que se debe',
             'implicaciones', 'perspectiva', 'diagnostico', 'diagnóstico', 'estudio revela'],
  voz: ['jesuita', 'ignacio', 'loyola', 'compañia de jesus', 'compañía de jesús', 'suj',
        'valores', 'comunidad', 'social', 'justicia', 'derechos humanos', 'solidaridad',
        'servicio', 'voluntariado', 'migrante', 'vulnerable', 'espiritual', 'reflexion',
        'reflexión', 'mision', 'misión', 'identidad', 'proyecta', 'compromiso', 'dignidad',
        'formacion integral', 'formación integral', 'integral', 'humanista', 'etica', 'ética',
        'para que', 'sentido', 'vocacion', 'vocación'],
};

/* ── Efemérides ────────────────────────────────────────────
   Fechas que sirven de percha para contenido. Incluye los días
   profesionales, que para una universidad son oro: cada uno
   aterriza en una carrera concreta.

   ⚠ Verifica las fechas contra el calendario oficial antes de
   programar: algunas varían por fuente o son movibles. Puedes
   editar, quitar o añadir renglones en esta lista.              */
const EFEMERIDES = [
  // Identidad jesuita — el diferenciador de la casa
  { md: '07-31', nombre: 'San Ignacio de Loyola',        pilar: 'voz',      nota: 'Fiesta del fundador de la Compañía de Jesús. La fecha más importante del pilar Voz.' },
  { md: '11-16', nombre: 'Mártires de la UCA',           pilar: 'voz',      nota: 'Jesuitas asesinados en El Salvador, 1989. Memoria y compromiso social.' },
  { md: '12-03', nombre: 'San Francisco Javier',         pilar: 'voz',      nota: 'Patrono de las misiones.' },

  // Vida universitaria
  { md: '05-23', nombre: 'Día del Estudiante',           pilar: 'vida',     nota: 'Contenido protagonizado por alumnos. Alta afinidad con el carril casual.' },
  { md: '05-15', nombre: 'Día del Maestro',              pilar: 'orgullo',  nota: 'Reconocimiento a la planta docente. Testimonios de profesores.' },
  { md: '09-08', nombre: 'Día del Bibliotecario',        pilar: 'orgullo',  nota: 'Biblioteca y servicios de apoyo académico.' },

  // Días profesionales — uno por carrera
  { md: '01-06', nombre: 'Día de la Enfermera',          pilar: 'se_ibero', nota: 'Ancla natural para Enfermería.' },
  { md: '01-27', nombre: 'Día del Nutriólogo',           pilar: 'se_ibero', nota: 'Ancla para Nutrición y Ciencia de los Alimentos.' },
  { md: '05-20', nombre: 'Día del Psicólogo',            pilar: 'se_ibero', nota: 'Ancla para Psicología.' },
  { md: '07-01', nombre: 'Día del Ingeniero',            pilar: 'se_ibero', nota: 'Cubre Industrial y Mecatrónica de un solo golpe.' },
  { md: '07-12', nombre: 'Día del Abogado',              pilar: 'se_ibero', nota: 'Ancla para Derecho.' },
  { md: '10-01', nombre: 'Día del Arquitecto',           pilar: 'se_ibero', nota: 'Ancla para Arquitectura.' },
  { md: '10-23', nombre: 'Día del Médico',               pilar: 'se_ibero', nota: 'Medicina es tu carrera con mejor desempeño histórico. No la dejes pasar.' },

  // Calendario nacional
  { md: '03-08', nombre: 'Día Internacional de la Mujer', pilar: 'voz',     nota: 'Tema sensible: revisa el enfoque antes de publicar.' },
  { md: '09-16', nombre: 'Independencia de México',      pilar: 'vida',     nota: '' },
  { md: '11-02', nombre: 'Día de Muertos',               pilar: 'cultura',  nota: 'Altar de la universidad, tradición viva en campus.' },
  { md: '11-20', nombre: 'Revolución Mexicana',          pilar: 'vida',     nota: '' },
  { md: '12-12', nombre: 'Día de la Virgen de Guadalupe', pilar: 'voz',     nota: '' },
  { md: '12-25', nombre: 'Navidad',                      pilar: 'voz',      nota: 'Mensaje institucional de fin de año.' },
  { md: '01-01', nombre: 'Año Nuevo',                    pilar: 'voz',      nota: '' },
];

/* Devuelve la efeméride que menciona el texto, con su fecha en el
   año que corresponda (si ya pasó, se va al siguiente). */
function detectarEfemeride(texto) {
  const t = normalizar(texto);
  const hoy = new Date();

  for (const e of EFEMERIDES) {
    if (!contieneSenal(t, e.nombre) && !t.includes(normalizar(e.nombre))) continue;
    const [mes, dia] = e.md.split('-').map(Number);
    let anio = hoy.getFullYear();
    if (new Date(anio, mes - 1, dia) < sumarDias(hoy, -1)) anio++;
    return { ...e, fecha: aTexto(new Date(anio, mes - 1, dia)) };
  }
  return null;
}

/* Las que caen dentro de los próximos N días, para poder planear. */
function efemeridesProximas(dias = 75) {
  const hoy = new Date();
  const limite = sumarDias(hoy, dias);
  return EFEMERIDES.map(e => {
    const [mes, d] = e.md.split('-').map(Number);
    let anio = hoy.getFullYear();
    let f = new Date(anio, mes - 1, d);
    if (f < hoy) f = new Date(++anio, mes - 1, d);
    return { ...e, fecha: aTexto(f), cuando: f };
  })
  .filter(e => e.cuando <= limite)
  .sort((a, b) => a.cuando - b.cuando);
}

const SENALES_FORMATO = {
  Nota: ['nota', 'articulo', 'artículo', 'reportaje', 'analisis', 'análisis', 'columna',
         'explica', 'opinion', 'opinión', 'entrevista a', 'declaracion', 'declaración'],
  Reel: ['reel', 'video corto', 'vertical', 'pov', 'trend', 'baile', 'audio'],
  Carrusel: ['carrusel', 'pasos', 'lista', 'tips', 'infografia', 'infografía', 'requisitos'],
  Video: ['video', 'entrevista', 'documental', 'testimonio', 'recorrido'],
  Foto: ['foto', 'fotografia', 'fotografía', 'retrato', 'galeria', 'galería'],
  Story: ['story', 'historia', 'encuesta', 'sticker', 'cuenta regresiva'],
  Texto: ['comunicado', 'aviso', 'texto'],
};

const CANALES = [
  { id: 'web', nombre: 'Sitio IBERO', corto: 'WEB', color: 'var(--canal-web)' },
  { id: 'ig',  nombre: 'Instagram',   corto: 'IG',  color: 'var(--canal-ig)' },
  { id: 'fb',  nombre: 'Facebook',    corto: 'FB',  color: 'var(--canal-fb)' },
  { id: 'li',  nombre: 'LinkedIn',    corto: 'LI',  color: 'var(--canal-li)' },
  { id: 'yt',  nombre: 'YouTube',     corto: 'YT',  color: 'var(--canal-yt)' },
];

const FORMATOS = ['Nota', 'Reel', 'Short', 'Carrusel', 'Foto', 'Video', 'Story', 'Texto'];

// El color acompaña la progresión del flujo: gris → ámbar → azul → verde.
const ESTADOS = [
  { id: 'idea',       nombre: 'Idea',               color: '#9A938C' },
  { id: 'brief',      nombre: 'Brief',              color: '#7A8B99' },
  { id: 'produccion', nombre: 'Producción',         color: '#A07B2E' },
  { id: 'revision',   nombre: 'Revisión Leo',       color: '#3D5A80' },
  { id: 'vobo',       nombre: 'VoBo institucional', color: '#6A4C93' },
  { id: 'programado', nombre: 'Programado',         color: '#17877A' },
  { id: 'publicado',  nombre: 'Publicado',          color: '#3F7A4E' },
];

const CATEGORIAS = [
  { id: 'camara',        nombre: 'Cámara' },
  { id: 'lente',         nombre: 'Lente' },
  { id: 'drone',         nombre: 'Drone' },
  { id: 'audio',         nombre: 'Audio' },
  { id: 'iluminacion',   nombre: 'Iluminación' },
  { id: 'soporte',       nombre: 'Soporte / tripié' },
  { id: 'almacenamiento',nombre: 'Almacenamiento' },
  { id: 'energia',       nombre: 'Energía / baterías' },
  { id: 'computo',       nombre: 'Cómputo' },
  { id: 'accesorio',     nombre: 'Accesorio' },
];

const ESTADOS_EQUIPO = [
  { id: 'disponible',    nombre: 'Disponible' },
  { id: 'prestado',      nombre: 'Prestado' },
  { id: 'mantenimiento', nombre: 'En mantenimiento' },
  { id: 'baja',          nombre: 'Dado de baja' },
];

/* Este inventario es de control interno: saber qué hay, dónde está y quién
   lo trae. El registro patrimonial formal lo lleva Planta Física, así que
   aquí no duplicamos valores, series obligatorias ni fechas de compra. */

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

/* ── Estado ────────────────────────────────────────────── */

let datos = {
  parrilla: { piezas: [], ideas: [] },
  inventario: { equipos: [], vuelos: [] },
  expertos: { personas: [] },
  redaccion: { temas: [], equipo: {} },
};
let anclaSemana = inicioSemana(new Date());
let anclaMes = new Date();
let vistaActual = 'parrilla';
let modoParrilla = 'lista';   // 'lista' | 'calendario'
let filtroIdeas = '';         // pilar por el que se filtra el banco de ideas
let modalCtx = null;

const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/* ── Utilidades ────────────────────────────────────────── */

const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

function id() {
  return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function ahora() { return new Date().toISOString(); }

/* Fechas manejadas como texto YYYY-MM-DD en horario local (sin UTC) */

function aTexto(f) {
  const p = n => String(n).padStart(2, '0');
  return f.getFullYear() + '-' + p(f.getMonth() + 1) + '-' + p(f.getDate());
}

function aFecha(txt) {
  if (!txt) return null;
  const [a, m, d] = txt.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function inicioSemana(f) {
  const d = new Date(f.getFullYear(), f.getMonth(), f.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // lunes = 0
  return d;
}

function sumarDias(f, n) {
  const d = new Date(f);
  d.setDate(d.getDate() + n);
  return d;
}

function fechaLegible(txt) {
  const f = aFecha(txt);
  if (!f) return '';
  return DIAS[f.getDay()] + ' ' + f.getDate() + ' de ' + MESES[f.getMonth()];
}

function pesos(n) {
  return '$' + (Number(n) || 0).toLocaleString('es-MX', { maximumFractionDigits: 0 });
}

function catalogo(lista, valor) {
  const it = lista.find(x => x.id === valor);
  return it ? it.nombre : (valor || '—');
}

/* Devuelve el motivo si la fecha viola la ventana de la pieza, o null si cabe. */
function fueraDeVentana(pieza, fecha) {
  if (!fecha) return null;
  if (pieza.no_antes && fecha < pieza.no_antes) {
    return `No puede ir antes del ${fechaLegible(pieza.no_antes)}.`;
  }
  if (pieza.no_despues && fecha > pieza.no_despues) {
    return `No puede ir después del ${fechaLegible(pieza.no_despues)}.`;
  }
  return null;
}

function avisar(texto) {
  const el = $('#aviso');
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(avisar._t);
  avisar._t = setTimeout(() => { el.hidden = true; }, 2400);
}

/* ── Persistencia ──────────────────────────────────────── */

async function cargar() {
  try {
    const r = await fetch('/api/todo');
    const d = await r.json();
    datos.parrilla   = Object.assign({ piezas: [], ideas: [] }, d.parrilla || {});
    datos.inventario = Object.assign({ equipos: [], vuelos: [] }, d.inventario || {});
    datos.expertos   = Object.assign({ personas: [] }, d.expertos || {});
    datos.redaccion  = Object.assign({ temas: [], equipo: {} }, d.redaccion || {});
  } catch (e) {
    avisar('No se pudieron cargar los datos. ¿Está corriendo el servidor?');
  }
}

const guardarPendiente = {};

function guardar(coleccion) {
  clearTimeout(guardarPendiente[coleccion]);
  marcarGuardado('Guardando…');
  guardarPendiente[coleccion] = setTimeout(async () => {
    try {
      const r = await fetch('/api/' + coleccion, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos[coleccion]),
      });
      if (!r.ok) throw new Error('respuesta ' + r.status);
      const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      marcarGuardado('Guardado ' + hora);
    } catch (e) {
      marcarGuardado('No se pudo guardar');
      avisar('Error al guardar. Revisa que el servidor siga abierto.');
    }
  }, 500);
}

function marcarGuardado(txt) {
  const el = $('#estadoGuardado');
  el.textContent = txt;
  el.classList.add('visible');
}

/* ══════════════════════════════════════════════════════════
   HISTORIAL — deshacer y rehacer
   La pila guarda estados completos. El índice apunta al que
   estás viendo; deshacer es retroceder, rehacer es avanzar.
   ══════════════════════════════════════════════════════════ */

const historial = { pila: [], indice: -1, max: 60 };

const clonar = o => JSON.parse(JSON.stringify(o));

function registrar(descripcion) {
  // Si venías de deshacer, lo que estaba adelante se descarta.
  historial.pila = historial.pila.slice(0, historial.indice + 1);

  historial.pila.push({
    descripcion,
    parrilla: clonar(datos.parrilla),
    inventario: clonar(datos.inventario),
    expertos: clonar(datos.expertos),
    redaccion: clonar(datos.redaccion),
    hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
  });

  if (historial.pila.length > historial.max) historial.pila.shift();
  historial.indice = historial.pila.length - 1;
  pintarHistorial();
}

function irAPaso(indice) {
  if (indice < 0 || indice >= historial.pila.length || indice === historial.indice) return;
  const paso = historial.pila[indice];
  datos.parrilla = clonar(paso.parrilla);
  datos.inventario = clonar(paso.inventario);
  datos.expertos = clonar(paso.expertos || { personas: [] });
  datos.redaccion = clonar(paso.redaccion || { temas: [], equipo: {} });
  historial.indice = indice;

  guardar('parrilla');
  guardar('inventario');
  guardar('expertos');
  guardar('redaccion');
  refrescarParrilla();
  refrescarInventario();
  refrescarExpertos();
  pintarRedaccion();
  refrescarAuditoria();
  pintarHistorial();
}

function refrescarExpertos() { pintarExpertos(); }

function deshacer() {
  if (historial.indice <= 0) { avisar('No hay nada más que deshacer.'); return; }
  const queSeDeshace = historial.pila[historial.indice].descripcion;
  irAPaso(historial.indice - 1);
  avisar('Deshecho: ' + queSeDeshace);
}

function rehacer() {
  if (historial.indice >= historial.pila.length - 1) { avisar('No hay nada que rehacer.'); return; }
  irAPaso(historial.indice + 1);
  avisar('Rehecho: ' + historial.pila[historial.indice].descripcion);
}

function pintarHistorial() {
  $('#btnDeshacer').disabled = historial.indice <= 0;
  $('#btnRehacer').disabled = historial.indice >= historial.pila.length - 1;

  const lista = $('#listaHistorial');
  if (!lista) return;
  lista.innerHTML = historial.pila.map((p, i) => `
    <button class="paso-historial${i === historial.indice ? ' actual' : ''}${i > historial.indice ? ' deshecho' : ''}" data-paso="${i}">
      <span class="punto"></span>
      <span>${esc(p.descripcion)}</span>
      <span class="hora">${esc(p.hora)}</span>
    </button>`).join('');

  $$('[data-paso]', lista).forEach(b =>
    b.addEventListener('click', () => irAPaso(Number(b.dataset.paso))));
}

/* ── Tema claro / oscuro ───────────────────────────────── */

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  try { localStorage.setItem('cabina-tema', tema); } catch (e) { /* modo privado */ }
  const b = $('#btnTema');
  if (b) {
    b.textContent = tema === 'oscuro' ? '☀' : '◐';
    b.title = tema === 'oscuro' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  }
}

function iniciarTema() {
  let guardado = null;
  try { guardado = localStorage.getItem('cabina-tema'); } catch (e) { /* modo privado */ }
  const prefiereOscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(guardado || (prefiereOscuro ? 'oscuro' : 'claro'));
}

function alternarPanelHistorial(forzar) {
  const panel = $('#panelHistorial');
  const abrir = forzar !== undefined ? forzar : panel.hidden;
  panel.hidden = !abrir;
  $('#btnHistorial').classList.toggle('abierto', abrir);
  if (abrir) pintarHistorial();
}

/* ══════════════════════════════════════════════════════════
   PARRILLA
   ══════════════════════════════════════════════════════════ */

function piezasFiltradas() {
  const fPilar  = $('#filtroPilar').value;
  const fCanal  = $('#filtroCanal').value;
  const fEstado = $('#filtroEstado').value;
  const todas   = $('#filtroTodasSemanas').checked;

  const desde = aTexto(anclaSemana);
  const hasta = aTexto(sumarDias(anclaSemana, 6));

  return datos.parrilla.piezas
    .filter(p => todas || (p.fecha >= desde && p.fecha <= hasta))
    .filter(p => !fPilar  || p.pilar === fPilar)
    .filter(p => !fCanal  || (p.canales || []).includes(fCanal))
    .filter(p => !fEstado || p.estado === fEstado)
    .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
}

function piezasDeLaSemana() {
  const desde = aTexto(anclaSemana);
  const hasta = aTexto(sumarDias(anclaSemana, 6));
  return datos.parrilla.piezas.filter(p => p.fecha >= desde && p.fecha <= hasta);
}

function pintarSemana() {
  const fin = sumarDias(anclaSemana, 6);
  const mismoMes = anclaSemana.getMonth() === fin.getMonth();
  const hoy = inicioSemana(new Date()).getTime();
  const dif = Math.round((anclaSemana.getTime() - hoy) / 604800000);

  let titulo = 'Semana del ' + anclaSemana.getDate();
  if (dif === 0) titulo = 'Esta semana';
  else if (dif === 1) titulo = 'Próxima semana';
  else if (dif === -1) titulo = 'Semana pasada';

  $('#semanaTitulo').textContent = titulo;
  $('#semanaRango').textContent = mismoMes
    ? anclaSemana.getDate() + ' al ' + fin.getDate() + ' de ' + MESES[fin.getMonth()] + ' ' + fin.getFullYear()
    : anclaSemana.getDate() + ' de ' + MESES[anclaSemana.getMonth()] + ' al ' + fin.getDate() + ' de ' + MESES[fin.getMonth()] + ' ' + fin.getFullYear();
}

function pintarBalance() {
  const piezas = piezasDeLaSemana();
  const total = piezas.length;
  const barra = $('#balanceBarra');
  const leyenda = $('#balanceLeyenda');
  const veredicto = $('#balanceVeredicto');

  if (!total) {
    barra.innerHTML = '';
    leyenda.innerHTML = '<span class="tenue">Sin piezas programadas esta semana.</span>';
    veredicto.textContent = '';
    veredicto.className = 'balance-veredicto';
    return;
  }

  const conteo = {};
  PILARES.forEach(p => { conteo[p.id] = piezas.filter(x => x.pilar === p.id).length; });

  barra.innerHTML = PILARES
    .filter(p => conteo[p.id] > 0)
    .map(p => `<span style="width:${(conteo[p.id] / total) * 100}%;background:${p.color}" title="${esc(p.nombre)}: ${conteo[p.id]}"></span>`)
    .join('');

  leyenda.innerHTML = PILARES
    .filter(p => conteo[p.id] > 0)
    .map(p => `<span><i style="background:${p.color}"></i>${esc(p.nombre)} · ${conteo[p.id]}</span>`)
    .join('');

  // La regla del plan maestro: el carril institucional no puede desaparecer.
  const institucionales = piezas.filter(x => {
    const pil = PILARES.find(p => p.id === x.pilar);
    return pil && pil.carril === 'institucional';
  }).length;

  const proporcion = institucionales / total;
  if (proporcion >= 0.4) {
    veredicto.textContent = 'Mezcla equilibrada';
    veredicto.className = 'balance-veredicto bien';
  } else if (proporcion >= 0.2) {
    veredicto.textContent = 'Falta peso institucional';
    veredicto.className = 'balance-veredicto ojo';
  } else {
    veredicto.textContent = institucionales === 0
      ? 'Semana sin nada institucional'
      : 'Muy cargada a lo casual';
    veredicto.className = 'balance-veredicto mal';
  }
}

function pintarPiezas() {
  const cont = $('#tableroPiezas');
  const piezas = piezasFiltradas();

  if (!piezas.length) {
    cont.innerHTML = '<div class="vacio">No hay piezas con estos filtros.<br>Usa <b>+ Nueva pieza</b> para programar la primera.</div>';
    return;
  }

  const grupos = {};
  piezas.forEach(p => { (grupos[p.fecha] = grupos[p.fecha] || []).push(p); });

  cont.innerHTML = Object.keys(grupos).sort().map(fecha => {
    const items = grupos[fecha].map(p => {
      const pil = PILARES.find(x => x.id === p.pilar);
      const est = ESTADOS.find(x => x.id === p.estado);
      const canales = (p.canales || []).map(id => {
        const c = CANALES.find(x => x.id === id);
        return c ? `<span class="chip chip-canal" style="background:${c.color}" title="${esc(c.nombre)}">${esc(c.corto)}</span>` : '';
      }).join('');
      return `
        <div class="pieza" data-id="${esc(p.id)}" style="border-left-color:${pil ? pil.color : 'var(--borde-fuerte)'}">
          <div class="pieza-cuerpo">
            <div class="pieza-titulo">${esc(p.titulo || 'Sin título')}</div>
            <div class="pieza-meta">
              ${p.formato ? `<span>${esc(p.formato)}</span>` : ''}
              ${p.responsable ? `<span>· ${esc(p.responsable)}</span>` : ''}
            </div>
          </div>
          <div class="pieza-meta">
            ${canales}
            ${pil ? `<span class="chip chip-pilar" style="background:${pil.color}">${esc(pil.nombre)}</span>` : ''}
            ${est ? `<span class="chip chip-estado" style="color:${est.color}">${esc(est.nombre)}</span>` : ''}
          </div>
        </div>`;
    }).join('');

    return `<div class="dia-grupo">
      <div class="dia-titulo"><b>${esc(fechaLegible(fecha))}</b><span>${grupos[fecha].length} pieza${grupos[fecha].length > 1 ? 's' : ''}</span></div>
      <div class="tablero">${items}</div>
    </div>`;
  }).join('');

  $$('.pieza', cont).forEach(el => {
    el.addEventListener('click', () => abrirPieza(el.dataset.id));
  });
}

function pintarIdeas() {
  const cont = $('#listaIdeas');
  const ideas = datos.parrilla.ideas || [];

  if (!ideas.length) {
    cont.innerHTML = `<div class="vacio">
      <div class="vacio-titulo">El banco está vacío</div>
      <div>Guarda aquí lo que se te ocurra sin fecha todavía. Con <b>Capturar y clasificar</b> llegan ya ordenadas por pilar.</div>
    </div>`;
    $('#resumenIdeas').innerHTML = '';
    return;
  }

  // Cada idea se clasifica al vuelo para que veas de qué pilar es sin abrirla.
  const clasificadas = ideas.map(i => ({ idea: i, s: clasificarTexto(i.texto) }));

  // Resumen: cuántas hay de cada pilar, y cuáles faltan
  const conteo = {};
  clasificadas.forEach(c => { conteo[c.s.pilar] = (conteo[c.s.pilar] || 0) + 1; });
  $('#resumenIdeas').innerHTML = PILARES.map(p => {
    const n = conteo[p.id] || 0;
    return `<button class="ficha-pilar${n ? '' : ' sin'}${filtroIdeas === p.id ? ' activo' : ''}"
              data-pilar="${p.id}" title="${n ? 'Ver sólo ' + esc(p.nombre) : 'Sin ideas de este pilar'}">
              <span class="ficha-punto" style="background:${p.color}"></span>
              <span class="ficha-nombre">${esc(p.nombre)}</span>
              <span class="ficha-cuenta">${n}</span>
            </button>`;
  }).join('');

  $$('#resumenIdeas .ficha-pilar').forEach(b => b.addEventListener('click', () => {
    filtroIdeas = (filtroIdeas === b.dataset.pilar) ? '' : b.dataset.pilar;
    pintarIdeas();
  }));

  const visibles = filtroIdeas ? clasificadas.filter(c => c.s.pilar === filtroIdeas) : clasificadas;

  cont.innerHTML = visibles.map(({ idea: i, s }) => {
    const pil = PILARES.find(x => x.id === s.pilar);
    const ventana = s.no_antes ? `⧖ desde el ${s.no_antes.slice(8)}/${s.no_antes.slice(5,7)}`
                  : (s.no_despues && !s.efemeride) ? `⧖ hasta el ${s.no_despues.slice(8)}/${s.no_despues.slice(5,7)}` : '';

    // Sección de fecha: sólo cuando la idea se cuelga de una efeméride
    const bloqueFecha = s.efemeride ? `
      <div class="idea-fecha">
        <span class="idea-fecha-icono">◆</span>
        <div>
          <b>${esc(s.efemeride.nombre)}</b>
          <span>${esc(fechaLegible(s.efemeride.fecha))}</span>
        </div>
      </div>` : '';

    const pasos = i.produccion && i.produccion.length ? i.produccion : s.produccion;
    const bloqueProduccion = pasos.length ? `
      <details class="idea-brief">
        <summary>Cómo se hace · ${esc(s.formato)}</summary>
        <ul>${pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      </details>` : '';

    return `
    <article class="idea" style="--tono:${pil.color}">
      <header class="idea-cabecera">
        <span class="idea-pilar" style="background:${pil.color}">${esc(pil.nombre)}</span>
        <span class="idea-formato">${esc(s.formato)}</span>
        ${s.confianza === 'baja' ? '<span class="idea-duda" title="No reconocí vocabulario claro: revisa el pilar">?</span>' : ''}
      </header>
      <p class="idea-texto">${esc(i.texto)}</p>
      ${bloqueFecha}
      ${bloqueProduccion}
      <footer class="idea-pie">
        <span class="idea-meta">${ventana || esc((s.canales || []).map(c => catalogo(CANALES, c)).join(' · '))}</span>
        <span class="idea-acciones">
          <button class="idea-btn" data-accion="promover" data-id="${esc(i.id)}" title="Convertir en pieza con fecha">Programar</button>
          <button class="idea-btn borrar" data-accion="borrar" data-id="${esc(i.id)}" title="Eliminar idea">✕</button>
        </span>
      </footer>
    </article>`;
  }).join('');

  $$('#listaIdeas button').forEach(b => b.addEventListener('click', () => {
    const idea = (datos.parrilla.ideas || []).find(i => i.id === b.dataset.id);
    if (!idea) return;
    const corto = idea.texto.slice(0, 34) + (idea.texto.length > 34 ? '…' : '');
    if (b.dataset.accion === 'borrar') {
      datos.parrilla.ideas = datos.parrilla.ideas.filter(i => i.id !== idea.id);
      guardar('parrilla');
      registrar(`Borró la idea «${corto}»`);
      pintarIdeas();
    } else {
      // La idea se retira del banco al promoverla; si cancelas el modal,
      // el paso queda en el historial para devolverla con Ctrl+Z.
      datos.parrilla.ideas = datos.parrilla.ideas.filter(i => i.id !== idea.id);
      const s = clasificarTexto(idea.texto);
      abrirPieza(null, {
        titulo: s.titulo, pilar: s.pilar, formato: s.formato, canales: s.canales,
        notas: idea.texto, no_antes: s.no_antes, no_despues: s.no_despues,
        produccion: (idea.produccion && idea.produccion.length ? idea.produccion : s.produccion)
                      .map(x => '· ' + x).join('\n'),
      });
    }
  }));
}

function refrescarParrilla() {
  pintarSemana();
  pintarBalance();
  pintarPiezas();
  pintarCalendario();
  pintarEfemerides();
  pintarIdeas();
}

/* ── Fechas que vienen ─────────────────────────────────── */

function pintarEfemerides() {
  const cont = $('#tiraEfemerides');
  const proximas = efemeridesProximas(75);
  const hoy = new Date();

  if (!proximas.length) { cont.innerHTML = '<div class="vacio">Sin efemérides en los próximos meses.</div>'; return; }

  // ¿Ya hay algo programado para esa fecha? Entonces está cubierta.
  const cubiertas = new Set(datos.parrilla.piezas.map(p => p.no_despues || p.fecha));

  cont.innerHTML = proximas.map(e => {
    const pil = PILARES.find(p => p.id === e.pilar);
    const dias = Math.ceil((e.cuando - hoy) / 86400000);
    const lista = cubiertas.has(e.fecha);
    return `
      <button class="efemeride${lista ? ' cubierta' : ''}" data-efem="${esc(e.nombre)}"
              style="--tono:${pil.color}" title="${esc(e.nota || 'Guardar como idea')}">
        <span class="efem-dia">${e.cuando.getDate()} ${MESES[e.cuando.getMonth()].slice(0,3)}</span>
        <span class="efem-nombre">${esc(e.nombre)}</span>
        <span class="efem-faltan">${lista ? '✓ cubierta' : (dias <= 0 ? 'hoy' : `en ${dias} d`)}</span>
      </button>`;
  }).join('');

  $$('.efemeride', cont).forEach(b => b.addEventListener('click', () => {
    const e = proximas.find(x => x.nombre === b.dataset.efem);
    const texto = prompt(
      `Idea para ${e.nombre} (${fechaLegible(e.fecha)})\n\n${e.nota || ''}\n\n¿Qué se te ocurre?`,
      `${e.nombre}: `);
    if (!texto || !texto.trim()) return;
    datos.parrilla.ideas = datos.parrilla.ideas || [];
    datos.parrilla.ideas.push({ id: id(), texto: texto.trim(), creado: ahora() });
    guardar('parrilla');
    registrar(`Guardó una idea para ${e.nombre}`);
    pintarIdeas();
    pintarEfemerides();
    avisar('Idea guardada en el banco.');
  }));
}

/* ══════════════════════════════════════════════════════════
   CALENDARIO MENSUAL
   ══════════════════════════════════════════════════════════ */

function aplicarModoParrilla() {
  const enCalendario = modoParrilla === 'calendario';
  $('#tableroPiezas').hidden = enCalendario;
  $('#calendarioEnvoltorio').hidden = !enCalendario;
  $('#envolturaTodas').style.display = enCalendario ? 'none' : '';
  $$('.conmutador-op').forEach(b => b.classList.toggle('activo', b.dataset.modo === modoParrilla));
  if (enCalendario) pintarCalendario();
}

function pintarCalendario() {
  if (modoParrilla !== 'calendario') return;

  const enc = $('#calendarioEncabezado');
  if (!enc.childElementCount) {
    enc.innerHTML = DIAS_CORTOS.map(d => `<span>${d}</span>`).join('');
  }

  const anio = anclaMes.getFullYear();
  const mes = anclaMes.getMonth();
  $('#mesTitulo').textContent = MESES[mes] + ' ' + anio;

  // El mes se dibuja completo, arrancando el lunes de la semana del día 1.
  const primero = new Date(anio, mes, 1);
  const arranque = inicioSemana(primero);
  const hoy = aTexto(new Date());

  // Índice de piezas por fecha, respetando los filtros activos
  const fPilar = $('#filtroPilar').value;
  const fCanal = $('#filtroCanal').value;
  const fEstado = $('#filtroEstado').value;
  const porFecha = {};
  datos.parrilla.piezas
    .filter(p => !fPilar || p.pilar === fPilar)
    .filter(p => !fCanal || (p.canales || []).includes(fCanal))
    .filter(p => !fEstado || p.estado === fEstado)
    .forEach(p => { (porFecha[p.fecha] = porFecha[p.fecha] || []).push(p); });

  const celdas = [];
  for (let i = 0; i < 42; i++) {
    const dia = sumarDias(arranque, i);
    const txt = aTexto(dia);
    const fuera = dia.getMonth() !== mes;
    if (fuera && i >= 35) continue; // no pintes una sexta fila vacía

    const piezas = (porFecha[txt] || []).map(p => {
      const pil = PILARES.find(x => x.id === p.pilar);
      const color = pil ? pil.color : 'var(--borde-fuerte)';
      const img = p.imagen
        ? `<img class="cal-miniatura" src="${esc(p.imagen)}" alt="" loading="lazy">`
        : '';
      const acotada = p.no_antes || p.no_despues;
      const rotulo = p.no_antes ? `Sólo a partir del ${fechaLegible(p.no_antes)}`
                   : p.no_despues ? `Sólo hasta el ${fechaLegible(p.no_despues)}` : '';
      return `
        <div class="cal-pieza${p.imagen ? '' : ' sin-imagen'}" data-id="${esc(p.id)}"
             draggable="true" title="${esc(p.titulo)}${rotulo ? ' — ' + esc(rotulo) : ''}">
          ${img}
          <div class="cal-cuerpo" style="border-left-color:${color}">
            <div class="cal-titulo">${acotada ? '<span class="marca-ventana" title="' + esc(rotulo) + '">⧖</span> ' : ''}${esc(p.titulo || 'Sin título')}</div>
            <div class="cal-meta">${esc(p.formato || '')}${p.estado ? ' · ' + esc(catalogo(ESTADOS, p.estado)) : ''}</div>
          </div>
        </div>`;
    }).join('');

    const finde = dia.getDay() === 0 || dia.getDay() === 6;
    celdas.push(`
      <div class="celda${fuera ? ' fuera' : ''}${txt === hoy ? ' hoy' : ''}${finde && !fuera ? ' finde' : ''}" data-fecha="${txt}">
        <div class="celda-numero">
          <span>${dia.getDate()}</span>
          <button class="celda-agregar" data-fecha="${txt}" title="Agregar pieza este día">+</button>
        </div>
        ${piezas}
      </div>`);
  }

  const cont = $('#calendarioMes');
  cont.innerHTML = celdas.join('');

  $$('.cal-pieza', cont).forEach(el =>
    el.addEventListener('click', () => abrirPieza(el.dataset.id)));
  $$('.celda-agregar', cont).forEach(b =>
    b.addEventListener('click', ev => { ev.stopPropagation(); abrirPieza(null, { fecha: b.dataset.fecha }); }));

  conectarArrastre(cont);
}

/* ── Arrastrar y soltar en el calendario ───────────────── */

let piezaArrastrada = null;

function conectarArrastre(cont) {
  $$('.cal-pieza', cont).forEach(el => {
    el.addEventListener('dragstart', ev => {
      piezaArrastrada = datos.parrilla.piezas.find(p => p.id === el.dataset.id) || null;
      el.classList.add('arrastrando');
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', el.dataset.id);

      // Pinta de una vez qué días aceptan esta pieza y cuáles no
      if (piezaArrastrada) {
        $$('.celda', cont).forEach(c => {
          if (c.classList.contains('fuera')) return;
          const f = c.dataset.fecha;
          const ocupada = datos.parrilla.piezas.some(p => p.fecha === f && p.id !== piezaArrastrada.id);
          c.classList.add(fueraDeVentana(piezaArrastrada, f) || ocupada ? 'veta' : 'acepta');
        });
      }
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('arrastrando');
      $$('.celda', cont).forEach(c => c.classList.remove('acepta', 'veta', 'encima'));
      piezaArrastrada = null;
    });
  });

  $$('.celda', cont).forEach(celda => {
    if (celda.classList.contains('fuera')) return;

    celda.addEventListener('dragover', ev => {
      if (!piezaArrastrada) return;
      if (celda.classList.contains('veta')) { ev.dataTransfer.dropEffect = 'none'; return; }
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
      celda.classList.add('encima');
    });

    celda.addEventListener('dragleave', () => celda.classList.remove('encima'));

    celda.addEventListener('drop', ev => {
      ev.preventDefault();
      celda.classList.remove('encima');
      if (!piezaArrastrada) return;

      const destino = celda.dataset.fecha;
      if (destino === piezaArrastrada.fecha) return;

      const problema = fueraDeVentana(piezaArrastrada, destino);
      if (problema) { avisar(`«${piezaArrastrada.titulo}»: ${problema}`); return; }

      if (datos.parrilla.piezas.some(p => p.fecha === destino && p.id !== piezaArrastrada.id)) {
        avisar('Ese día ya tiene una pieza. Deja una por día.');
        return;
      }

      const nombre = piezaArrastrada.titulo;
      piezaArrastrada.fecha = destino;
      piezaArrastrada.actualizado = ahora();
      guardar('parrilla');
      registrar(`Movió «${nombre.slice(0, 30)}${nombre.length > 30 ? '…' : ''}» al ${destino.slice(8)}`);
      refrescarParrilla();
      refrescarAuditoria();
      avisar(`Movida al ${fechaLegible(destino)}.`);
    });
  });
}

/* ── Modal de pieza ────────────────────────────────────── */

function abrirPieza(idPieza, prellenado) {
  const existente = idPieza ? datos.parrilla.piezas.find(p => p.id === idPieza) : null;
  const p = existente || Object.assign({
    id: id(),
    titulo: '',
    pilar: 'vida',
    canales: ['ig'],
    formato: 'Reel',
    fecha: aTexto(new Date() > sumarDias(anclaSemana, 6) || new Date() < anclaSemana ? anclaSemana : new Date()),
    responsable: '',
    estado: 'idea',
    copy: '',
    notas: '',
    produccion: '',
    imagen: '',
    no_antes: '',
    no_despues: '',
    experto: '',
    estado_nota: '',
  }, prellenado || {});

  modalCtx = { tipo: 'pieza', datos: p, esNuevo: !existente };

  $('#modalTitulo').textContent = existente ? 'Editar pieza' : 'Nueva pieza';
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="grupo-campo">
      <label for="f_titulo">Título de la pieza</label>
      <input class="campo" id="f_titulo" value="${esc(p.titulo)}" placeholder="Ej. Carrusel talleres culturales otoño">
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="f_pilar">Pilar</label>
        <select class="campo" id="f_pilar">
          ${PILARES.map(x => `<option value="${x.id}"${x.id === p.pilar ? ' selected' : ''}>${esc(x.nombre)}</option>`).join('')}
        </select>
        <span class="ayuda" id="ayudaPilar"></span>
      </div>
      <div class="grupo-campo">
        <label for="f_formato">Formato</label>
        <select class="campo" id="f_formato">
          ${FORMATOS.map(x => `<option${x === p.formato ? ' selected' : ''}>${esc(x)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="grupo-campo">
      <label>Canales</label>
      <div class="opciones-canal" id="f_canales">
        ${CANALES.map(c => `
          <label class="opcion-canal${(p.canales || []).includes(c.id) ? ' marcado' : ''}">
            <input type="checkbox" value="${c.id}"${(p.canales || []).includes(c.id) ? ' checked' : ''}>${esc(c.nombre)}
          </label>`).join('')}
      </div>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="f_fecha">Fecha de publicación</label>
        <input class="campo" type="date" id="f_fecha" value="${esc(p.fecha)}">
      </div>
      <div class="grupo-campo">
        <label for="f_estado">Estado</label>
        <select class="campo" id="f_estado">
          ${ESTADOS.map(x => `<option value="${x.id}"${x.id === p.estado ? ' selected' : ''}>${esc(x.nombre)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="grupo-campo">
      <label>Ventana válida de publicación</label>
      <div class="fila-campos">
        <div class="grupo-campo">
          <input class="campo" type="date" id="f_no_antes" value="${esc(p.no_antes || '')}">
          <span class="ayuda">No antes de — para cobertura de un evento</span>
        </div>
        <div class="grupo-campo">
          <input class="campo" type="date" id="f_no_despues" value="${esc(p.no_despues || '')}">
          <span class="ayuda">No después de — para anuncios y convocatorias</span>
        </div>
      </div>
      <span class="ayuda">Déjalos vacíos si la pieza puede salir cualquier día. Acomodar pendientes y el arrastre en el calendario los respetan.</span>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="f_responsable">Responsable</label>
        <input class="campo" id="f_responsable" value="${esc(p.responsable)}" placeholder="Quién produce esta pieza">
      </div>
      <div class="grupo-campo">
        <label for="f_experto">Experto que participa</label>
        <select class="campo" id="f_experto">
          <option value="">Ninguno</option>
          ${(datos.expertos.personas || []).map(x =>
            `<option value="${esc(x.id)}"${x.id === p.experto ? ' selected' : ''}>${esc(x.nombre)}${x.departamento ? ' · ' + esc(x.departamento) : ''}</option>`).join('')}
        </select>
        <span class="ayuda">Para notas y reels académicos. Lleva la cuenta de a quién ya recurriste.</span>
      </div>
    </div>

    <div class="grupo-campo">
      <label>Imagen de referencia</label>
      <div class="zona-imagen${p.imagen ? ' con-imagen' : ''}" id="zonaImagen">
        ${p.imagen
          ? `<img src="${esc(p.imagen)}" alt="Vista previa">`
          : '<div class="pista">Haz clic para subir la miniatura que se verá en el calendario</div>'}
      </div>
      <input type="file" id="f_imagen" accept="image/*" hidden>
      <div class="imagen-acciones">
        <button type="button" class="btn-plano" id="btnCambiarImagen">${p.imagen ? 'Cambiar' : 'Subir imagen'}</button>
        ${p.imagen ? '<button type="button" class="btn-peligro" id="btnQuitarImagen">Quitar</button>' : ''}
      </div>
    </div>

    <div class="grupo-campo">
      <label for="f_produccion">Cómo se hace
        <button type="button" class="btn-mini" id="btnGuia" title="Traer la guía del formato seleccionado">Sugerir</button>
      </label>
      <textarea class="campo alto" id="f_produccion" placeholder="Qué lleva la pieza, cómo se graba, qué tomas hacen falta">${esc(p.produccion || '')}</textarea>
      <span class="ayuda">Sugerir trae la guía del formato y del pilar que tengas elegidos. Edítala a tu criterio.</span>
    </div>

    <div class="grupo-campo">
      <label for="f_notas">Notas sueltas</label>
      <textarea class="campo" id="f_notas" placeholder="Locación, material necesario, pendientes">${esc(p.notas)}</textarea>
    </div>

    <div class="grupo-campo">
      <label for="f_copy">Copy</label>
      <textarea class="campo" id="f_copy" placeholder="El texto que acompaña la publicación">${esc(p.copy)}</textarea>
      <span class="ayuda">El copy se trabaja en sesión con Claude, donde puedes iterarlo. Aquí se guarda el resultado.</span>
    </div>

    <div id="resultadoIA"></div>
  `;

  const pintarAyuda = () => {
    const sel = PILARES.find(x => x.id === $('#f_pilar').value);
    const etiquetas = { casual: 'Carril casual', institucional: 'Carril institucional', hibrido: 'Carril híbrido' };
    $('#ayudaPilar').textContent = sel ? etiquetas[sel.carril] + ' · meta ' + sel.meta + '% del mes' : '';
  };
  $('#f_pilar').addEventListener('change', pintarAyuda);
  pintarAyuda();

  /* Una nota vive en el sitio: si eliges ese formato, marcamos el canal
     Web solo. Es el error más fácil de cometer y el que rompe la cadena
     (el post de Facebook se queda sin a dónde llevar). */
  $('#f_formato').addEventListener('change', ev => {
    if (ev.target.value !== 'Nota') return;
    const casillaWeb = $$('#f_canales input').find(i => i.value === 'web');
    if (casillaWeb && !casillaWeb.checked) {
      casillaWeb.checked = true;
      casillaWeb.dispatchEvent(new Event('change'));
      avisar('Marqué el canal Sitio IBERO: la nota se publica ahí primero.');
    }
  });

  $$('#f_canales .opcion-canal').forEach(l => {
    l.querySelector('input').addEventListener('change', e => {
      l.classList.toggle('marcado', e.target.checked);
    });
  });

  // Imagen de referencia
  const abrirSelector = () => $('#f_imagen').click();
  $('#zonaImagen').addEventListener('click', abrirSelector);
  $('#btnCambiarImagen').addEventListener('click', abrirSelector);
  const btnQuitar = $('#btnQuitarImagen');
  if (btnQuitar) btnQuitar.addEventListener('click', () => {
    modalCtx.datos.imagen = '';
    const z = $('#zonaImagen');
    z.classList.remove('con-imagen');
    z.innerHTML = '<div class="pista">Haz clic para subir la miniatura que se verá en el calendario</div>';
    btnQuitar.remove();
    $('#btnCambiarImagen').textContent = 'Subir imagen';
  });
  $('#f_imagen').addEventListener('change', e => subirImagen(e.target.files[0]));

  $('#btnGuia').addEventListener('click', () => {
    const pasos = guiaDeProduccion($('#f_formato').value, $('#f_pilar').value);
    if (!pasos.length) { avisar('No tengo guía para ese formato.'); return; }
    const caja = $('#f_produccion');
    const nuevo = pasos.map(p => '· ' + p).join('\n');
    caja.value = caja.value.trim() ? caja.value.trim() + '\n\n' + nuevo : nuevo;
    caja.focus();
  });

  mostrarModal();
}

/* ── Imagen de referencia ──────────────────────────────── */

async function subirImagen(archivo) {
  if (!archivo) return;
  if (archivo.size > 12 * 1024 * 1024) { avisar('La imagen pesa más de 12 MB.'); return; }

  const dataUri = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => rej(new Error('lectura'));
    fr.readAsDataURL(archivo);
  }).catch(() => null);

  if (!dataUri) { avisar('No se pudo leer la imagen.'); return; }

  avisar('Subiendo imagen…');
  try {
    const r = await fetch('/api/miniatura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datos: dataUri }),
    });
    const d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error || 'error');

    modalCtx.datos.imagen = d.url;
    const z = $('#zonaImagen');
    z.classList.add('con-imagen');
    z.innerHTML = `<img src="${esc(d.url)}" alt="Vista previa">`;
    $('#btnCambiarImagen').textContent = 'Cambiar';
    if (!$('#btnQuitarImagen')) {
      $('.imagen-acciones').insertAdjacentHTML('beforeend',
        '<button type="button" class="btn-peligro" id="btnQuitarImagen">Quitar</button>');
      $('#btnQuitarImagen').addEventListener('click', () => {
        modalCtx.datos.imagen = '';
        z.classList.remove('con-imagen');
        z.innerHTML = '<div class="pista">Haz clic para subir la miniatura que se verá en el calendario</div>';
        $('#btnQuitarImagen').remove();
        $('#btnCambiarImagen').textContent = 'Subir imagen';
      });
    }
    avisar('Imagen lista.');
  } catch (e) {
    avisar('No se pudo subir la imagen.');
  }
}

function leerPieza() {
  const p = modalCtx.datos;
  p.titulo      = $('#f_titulo').value.trim();
  p.pilar       = $('#f_pilar').value;
  p.formato     = $('#f_formato').value;
  p.canales     = $$('#f_canales input:checked').map(i => i.value);
  p.fecha       = $('#f_fecha').value;
  p.estado      = $('#f_estado').value;
  p.responsable = $('#f_responsable').value.trim();
  p.experto     = $('#f_experto').value;
  p.copy        = $('#f_copy').value;
  p.notas       = $('#f_notas').value;
  p.produccion  = $('#f_produccion').value;
  p.no_antes    = $('#f_no_antes').value;
  p.no_despues  = $('#f_no_despues').value;

  if (!p.titulo) { avisar('Ponle un título a la pieza.'); return false; }
  if (!p.fecha)  { avisar('Falta la fecha de publicación.'); return false; }

  const problema = fueraDeVentana(p, p.fecha);
  if (problema) { avisar(problema); return false; }

  p.actualizado = ahora();
  if (modalCtx.esNuevo) {
    p.creado = ahora();
    datos.parrilla.piezas.push(p);
  }
  guardar('parrilla');
  return true;
}

/* ══════════════════════════════════════════════════════════
   AUTOMATISMOS LOCALES
   Todo lo de aquí corre en tu máquina: sin internet, sin costo
   y con el mismo resultado cada vez.
   ══════════════════════════════════════════════════════════ */

function normalizar(t) {
  return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* \u2500\u2500 Detecci\u00f3n de fechas escritas en el texto \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Si escribes "IGNITE, 10 de agosto", CABINA saca esa fecha y
   la usa para acotar cu\u00e1ndo puede publicarse la pieza.        */

const MESES_CORTOS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

// Piezas que s\u00f3lo tienen sentido DESPU\u00c9S del evento
const SENALES_COBERTURA = ['foto', 'reel del', 'resumen', 'recap', 'cobertura', 'asi se vivio',
  'asi estuvo', 'galeria', 'lo mejor de', 'asi fue', 'cronica', 'despues de', 'cierre de',
  'clausura', 'estuvimos', 'vivimos', 'reel', 'video del'];

// Piezas que s\u00f3lo tienen sentido ANTES del evento
const SENALES_ANUNCIO = ['invitacion', 'invitamos', 'no te pierdas', 'te esperamos', 'convocatoria',
  'inscribete', 'registrate', 'proximamente', 'save the date', 'aparta', 'ya viene',
  'se acerca', 'agenda', 'anuncio', 'prepara', 'cupo', 'boletos'];

function detectarFecha(texto) {
  const t = normalizar(texto);
  const hoy = new Date();
  let dia = null, mes = null, anio = null;

  // "10 de agosto" \u00b7 "10 agosto" \u00b7 "10 de ago"
  const largo = t.match(/(\d{1,2})\s*(?:de\s+)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre|ene|feb|mar|abr|may|jun|jul|ago|sept?|oct|nov|dic)\b/);
  if (largo) {
    dia = Number(largo[1]);
    const nombre = largo[2].slice(0, 3);
    mes = MESES_CORTOS.indexOf(nombre === 'set' ? 'sep' : nombre);
  } else {
    // "10/08" \u00b7 "10-08" \u00b7 "10/08/2026"
    const corto = t.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
    if (corto) {
      dia = Number(corto[1]);
      mes = Number(corto[2]) - 1;
      if (corto[3]) anio = Number(corto[3].length === 2 ? '20' + corto[3] : corto[3]);
    }
  }

  if (dia == null || mes == null || mes < 0 || mes > 11 || dia < 1 || dia > 31) return null;

  if (anio == null) {
    anio = hoy.getFullYear();
    // Si la fecha ya pas\u00f3 hace m\u00e1s de un mes, seguramente se refiere al a\u00f1o pr\u00f3ximo
    if (new Date(anio, mes, dia) < sumarDias(hoy, -31)) anio++;
  }

  const f = new Date(anio, mes, dia);
  if (f.getDate() !== dia || f.getMonth() !== mes) return null;   // 31 de febrero, etc.

  // \u00bfLa pieza va antes o despu\u00e9s del evento?
  const esCobertura = SENALES_COBERTURA.some(s => t.includes(normalizar(s)));
  const esAnuncio   = SENALES_ANUNCIO.some(s => t.includes(normalizar(s)));
  let relacion = 'cobertura';
  if (esAnuncio && !esCobertura) relacion = 'anuncio';

  return { fecha: aTexto(f), relacion };
}

/* ── Cómo se produce cada formato ──────────────────────────
   Estructura base por formato, ajustada al pilar cuando cambia
   el enfoque. Es un punto de partida editable, no una receta.  */
const PRODUCCION = {
  Nota: {
    base: [
      'PERCHA: arranca con el hecho de actualidad, no con la universidad. La primera línea dice qué está pasando allá afuera.',
      'EXPERTO: una sola fuente académica, con nombre, grado y departamento. Si necesitas dos, es otra nota.',
      'ENTREVISTA: tres preguntas bastan — qué está pasando, por qué importa aquí, qué sigue. Grábala aunque sea por teléfono.',
      'EXTENSIÓN: 400 a 600 palabras. Más largo no se lee; más corto no aporta.',
      'FRASE CITABLE: identifica la línea que va a ir en el post de Facebook y en el rótulo del reel. Si no hay frase, falta trabajo.',
      'CIERRE: liga a la carrera o posgrado donde se estudia ese tema. Es la conversión sin vender.',
      'Publica primero en el sitio; redes apuntan ahí.',
    ],
    porPilar: {
      academia: 'La nota no habla de la IBERO: habla del tema. La universidad aparece en la credencial del experto y en el cierre, nada más.',
    },
  },
  Carrusel: {
    base: [
      'Lámina 1 — portada: el gancho en 6 palabras máximo, tipografía grande, poco fondo.',
      'Láminas 2 a 6 — una idea por lámina. Si tienes que meter dos, son dos láminas.',
      'Última lámina — cierre y llamada a la acción. Liga en bio o dato de contacto.',
    ],
    porPilar: {
      se_ibero: 'Aterriza cifras concretas: fechas, costos, requisitos. Nada de "consulta más información" sin decir dónde.',
      orgullo:  'Abre con el logro, no con la institución. El nombre de la persona antes que el de la universidad.',
      voz:      'Texto sobrio, mucho aire, una sola idea por lámina. Sin emojis. Deja que respire.',
      cultura:  'La primera lámina vende el ambiente; las de en medio dan los datos duros (fecha, lugar, cupo).',
      vida:     'Ritmo rápido, lenguaje de estudiante. Puedes cerrar con una pregunta para comentarios.',
    },
  },
  Reel: {
    base: [
      'Primeros 2 segundos: el gancho visual o hablado. Si no engancha ahí, se pierde.',
      'Duración objetivo 15 a 30 segundos. Vertical 9:16, sin bordes.',
      'Subtítulos quemados siempre: la mayoría lo ve sin audio.',
      'Cierre con una acción clara o un remate que invite a compartir.',
    ],
    porPilar: {
      vida:     'Cámara en mano, luz natural, imperfecto a propósito. Si se ve producido pierde.',
      orgullo:  'Una sola persona hablando a cámara. Corta todo lo que no sea la idea central.',
      se_ibero: 'Muestra el lugar o la práctica real, no gráficos. Que se vea el laboratorio, el taller, el aula.',
      cultura:  'Corte al ritmo de la música. Planos cortos del evento, caras, manos, detalle.',
      voz:      'Ritmo lento, sin música estridente. Silencio y una idea. Aquí menos es más.',
      academia: 'Reel derivado de la nota: el experto dice UNA idea en 30 segundos. Plano medio fijo, fondo del campus. Rótulo con nombre, grado y departamento los primeros 3 segundos. Termina con "lee la nota completa". Graba en la misma sesión de la entrevista — no lo agendes aparte.',
    },
  },
  Short: {
    base: [
      'Es el mismo reel: súbelo también a YouTube Shorts, cuesta cero.',
      'Título con palabras que alguien buscaría, no un título creativo.',
      'Vertical, menos de 60 segundos.',
    ],
    porPilar: {},
  },
  Foto: {
    base: [
      'Define antes qué tres tomas necesitas y no salgas sin ellas.',
      'Un plano general que ubique, uno medio con la persona, uno de detalle.',
      'Horizontal para Facebook, vertical o cuadrado para Instagram.',
    ],
    porPilar: {
      vida:     'Gente en acción, nadie posando. Espontáneo, gesto real.',
      orgullo:  'Retrato con el entorno que explica el logro: laboratorio, taller, escenario.',
      se_ibero: 'La instalación como protagonista, con alguien usándola. Espacio vacío no vende.',
      cultura:  'Ambiente y público, no sólo el escenario. Que se vea que hubo gente.',
      voz:      'Composición limpia, un solo sujeto. Sin saturar color.',
    },
  },
  Video: {
    base: [
      'Guion de una cuartilla antes de grabar. Si no cabe, es muy largo.',
      'Audio con micrófono de solapa: se perdona la imagen regular, nunca el audio malo.',
      'Duración 1 a 3 minutos. Versión corta en vertical para reel.',
      'Consigue la cesión de derechos de imagen firmada de quien aparezca.',
    ],
    porPilar: {
      orgullo:  'Formato entrevista: pregunta fuera de cuadro, sólo se escucha la respuesta.',
      se_ibero: 'Recorrido narrado por un estudiante, no por un directivo. Vende más.',
    },
  },
  Story: {
    base: [
      'Serie de 3 a 5 tarjetas, no una sola.',
      'Usa encuesta, pregunta o cuenta regresiva para que interactúen.',
      'Si vale la pena, guárdala en destacados.',
    ],
    porPilar: {},
  },
  Texto: {
    base: [
      'Primera línea autónoma: debe entenderse sin abrir el "ver más".',
      'Párrafos de dos renglones máximo.',
      'Sin hashtags de relleno; tres bien elegidos bastan.',
    ],
    porPilar: {},
  },
};

function guiaDeProduccion(formato, pilar) {
  const p = PRODUCCION[formato];
  if (!p) return [];
  const extra = p.porPilar[pilar];
  return extra ? [...p.base, extra] : [...p.base];
}

/* Busca una señal respetando el límite de palabra.
   Sin esto, "arte" hace match dentro de "preguntarte" y "compartir".
   Se toleran hasta 3 letras de más al final para cubrir plurales y
   derivados: "taller" alcanza "talleres", "egresad" alcanza "egresadas". */
function contieneSenal(texto, senal) {
  const s = normalizar(senal);
  if (s.includes(' ')) return texto.includes(s);   // las frases ya son específicas
  const escapada = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-záéíóúñ0-9])${escapada}[a-záéíóúñ]{0,3}([^a-záéíóúñ0-9]|$)`).test(texto);
}

/* Puntúa el texto contra el vocabulario de cada pilar y devuelve el ganador. */
function clasificarTexto(texto) {
  const t = normalizar(texto);
  const marcador = {};

  PILARES.forEach(p => {
    const senales = SENALES_PILAR[p.id] || [];
    marcador[p.id] = senales.reduce((suma, s) => {
      if (!contieneSenal(t, s)) return suma;
      const clave = normalizar(s);
      // Una señal larga es más específica, así que pesa más que una corta.
      return suma + (clave.length > 8 ? 3 : clave.includes(' ') ? 2 : 1);
    }, 0);
  });

  const ordenados = PILARES.slice().sort((a, b) => marcador[b.id] - marcador[a.id]);
  const mejor = ordenados[0];
  const puntos = marcador[mejor.id];
  const segundo = marcador[ordenados[1].id];

  // Formato: la primera coincidencia gana; si no hay, depende del pilar.
  let formato = null;
  for (const [nombre, senales] of Object.entries(SENALES_FORMATO)) {
    if (senales.some(s => contieneSenal(t, s))) { formato = nombre; break; }
  }
  const pilar = puntos > 0 ? mejor.id : 'vida';
  if (!formato) formato = pilar === 'vida' ? 'Reel' : pilar === 'academia' ? 'Nota' : 'Carrusel';

  // Canales según a quién le habla cada pilar.
  const canales = {
    vida:     ['ig'],
    academia: ['web', 'fb', 'li'],   // la nota vive en el sitio; redes apuntan ahí
    orgullo:  ['ig', 'fb', 'li'],
    se_ibero: ['ig', 'fb'],
    cultura:  ['ig', 'fb'],
    voz:      ['ig', 'fb'],
  }[pilar] || ['ig'];
  if (formato === 'Reel' || formato === 'Short') canales.push('yt');
  if (formato === 'Nota' && !canales.includes('web')) canales.unshift('web');

  const nombrePilar = catalogo(PILARES, pilar);
  let confianza, razon;
  if (puntos === 0) {
    confianza = 'baja';
    razon = 'No reconocí vocabulario de ningún pilar, así que lo dejé en Vida IBERO. Revísalo.';
  } else if (puntos - segundo <= 1) {
    confianza = 'media';
    razon = `Quedó entre ${nombrePilar} y ${catalogo(PILARES, ordenados[1].id)}. Elegí el primero por poco margen.`;
  } else {
    confianza = 'alta';
    razon = `El texto usa vocabulario claro de ${nombrePilar}.`;
  }

  // Título: la primera frase, acortada.
  let titulo = (texto || '').split(/[.\n·|]/)[0].trim();
  if (titulo.length > 58) titulo = titulo.slice(0, 55).trim() + '…';

  // ¿El texto menciona la fecha de un evento? Entonces acota la ventana.
  let no_antes = '', no_despues = '', notaFecha = '';
  const ev = detectarFecha(texto);
  if (ev) {
    if (ev.relacion === 'cobertura') {
      no_antes = ev.fecha;
      notaFecha = ` Detecté el evento del ${fechaLegible(ev.fecha)}: como es cobertura, no se programará antes de esa fecha.`;
    } else {
      no_despues = ev.fecha;
      notaFecha = ` Detecté el evento del ${fechaLegible(ev.fecha)}: como es anuncio, no se programará después de esa fecha.`;
    }
  }

  // ¿Se cuelga de una efeméride? Esa manda sobre la fecha suelta.
  const efem = detectarEfemeride(texto);
  if (efem) {
    no_despues = efem.fecha;   // una pieza de efeméride pierde sentido después
    if (no_antes && no_antes > no_despues) no_antes = '';
    notaFecha += ` Va anclada a ${efem.nombre} (${fechaLegible(efem.fecha)}).`;
  }

  return {
    titulo, pilar, formato, canales: [...new Set(canales)],
    confianza, razon: razon + notaFecha, no_antes, no_despues,
    efemeride: efem ? { nombre: efem.nombre, fecha: efem.fecha, nota: efem.nota } : null,
    produccion: guiaDeProduccion(formato, pilar),
  };
}

function capturarIdeaClasificada() {
  const texto = prompt('Describe la idea en tus palabras. CABINA la clasifica y la deja lista para que la revises.');
  if (!texto || !texto.trim()) return;

  const s = clasificarTexto(texto.trim());
  abrirPieza(null, {
    titulo: s.titulo,
    pilar: s.pilar,
    formato: s.formato,
    canales: s.canales,
    notas: texto.trim(),
    no_antes: s.no_antes,
    no_despues: s.no_despues,
    produccion: s.produccion.map(x => '· ' + x).join('\n'),
  });

  const caja = $('#resultadoIA');
  if (caja) {
    caja.innerHTML = `<div class="aviso-panel"><b>Sugerencia (confianza ${esc(s.confianza)}):</b> ${esc(s.razon)} Ajusta lo que no cuadre antes de guardar.</div>`;
  }
}

/* ── Acomodar pendientes en el calendario ──────────────── */

function acomodarPendientes() {
  const anio = anclaMes.getFullYear();
  const mes = anclaMes.getMonth();
  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);

  const sinFecha = datos.parrilla.piezas.filter(p => !p.fecha);
  const ideas = (datos.parrilla.ideas || []).slice();
  if (!sinFecha.length && !ideas.length) {
    avisar('No hay piezas ni ideas pendientes de fecha.');
    return;
  }

  // Cada idea se convierte en pieza provisional, ya clasificada.
  const pendientes = [
    ...sinFecha.map(p => ({
      ref: p, esIdea: false, pilar: p.pilar, titulo: p.titulo,
      no_antes: p.no_antes || '', no_despues: p.no_despues || '',
    })),
    ...ideas.map(i => {
      const s = clasificarTexto(i.texto);
      return {
        ref: i, esIdea: true, pilar: s.pilar, titulo: s.titulo, sugerencia: s,
        no_antes: s.no_antes || '', no_despues: s.no_despues || '',
      };
    }),
  ];

  const esInstitucional = pid => {
    const p = PILARES.find(x => x.id === pid);
    return p && p.carril === 'institucional';
  };

  // Días candidatos: todo el mes salvo domingos y días ya ocupados (1 por día).
  const ocupados = new Set(datos.parrilla.piezas.filter(p => p.fecha).map(p => p.fecha));
  const hoyTxt = aTexto(new Date());
  const dias = [];
  for (let d = new Date(primerDia); d <= ultimoDia; d = sumarDias(d, 1)) {
    const txt = aTexto(d);
    if (txt < hoyTxt) continue;              // no programes hacia atrás
    if (d.getDay() === 0) continue;          // domingo libre
    if (ocupados.has(txt)) continue;
    dias.push({ txt, dow: d.getDay() });
  }

  if (!dias.length) {
    avisar('No quedan días libres en este mes. Prueba con el siguiente.');
    return;
  }

  const asignaciones = [];
  const sinHueco = [];
  const usados = new Set();
  const pilarPorFecha = {};
  datos.parrilla.piezas.filter(p => p.fecha).forEach(p => { pilarPorFecha[p.fecha] = p.pilar; });

  // Orden de acomodo: primero las de ventana acotada (tienen menos opciones),
  // después las institucionales (para que tomen los días martes a jueves).
  const acotada = x => (x.no_antes || x.no_despues) ? 0 : 1;
  pendientes.sort((a, b) =>
    acotada(a) - acotada(b) ||
    (esInstitucional(b.pilar) ? 1 : 0) - (esInstitucional(a.pilar) ? 1 : 0));

  pendientes.forEach(item => {
    const inst = esInstitucional(item.pilar);
    // Sólo días que respetan la ventana válida de la pieza
    const libres = dias.filter(d => !usados.has(d.txt) && !fueraDeVentana(item, d.txt));
    if (!libres.length) { sinHueco.push(item); return; }

    // Puntúa cada día libre: mejor día = puntaje más alto.
    const puntuado = libres.map(d => {
      let s = 0;
      if (inst && d.dow >= 2 && d.dow <= 4) s += 5;      // institucional entre martes y jueves
      if (!inst && (d.dow === 5 || d.dow === 6)) s += 3;  // casual hacia el fin de semana
      const previo = pilarPorFecha[aTexto(sumarDias(aFecha(d.txt), -1))];
      const siguiente = pilarPorFecha[aTexto(sumarDias(aFecha(d.txt), 1))];
      if (previo === item.pilar) s -= 4;                  // no repetir pilar en días seguidos
      if (siguiente === item.pilar) s -= 4;
      return { d, s };
    }).sort((a, b) => b.s - a.s || a.d.txt.localeCompare(b.d.txt));

    const elegido = puntuado[0].d;
    usados.add(elegido.txt);
    pilarPorFecha[elegido.txt] = item.pilar;
    asignaciones.push({ item, fecha: elegido.txt });
  });

  if (!asignaciones.length) { avisar('No se pudo acomodar nada.'); return; }

  // Diagnóstico de la mezcla resultante, semana por semana.
  const porSemana = {};
  datos.parrilla.piezas.filter(p => p.fecha >= aTexto(primerDia) && p.fecha <= aTexto(ultimoDia))
    .forEach(p => {
      const k = aTexto(inicioSemana(aFecha(p.fecha)));
      (porSemana[k] = porSemana[k] || []).push(p.pilar);
    });
  asignaciones.forEach(a => {
    const k = aTexto(inicioSemana(aFecha(a.fecha)));
    (porSemana[k] = porSemana[k] || []).push(a.item.pilar);
  });

  const flojas = Object.entries(porSemana).filter(([, pilares]) => {
    const inst = pilares.filter(esInstitucional).length;
    return pilares.length && inst / pilares.length < 0.4;
  }).length;

  const resumen = asignaciones
    .map(a => {
      const lim = a.item.no_antes ? ` [no antes del ${a.item.no_antes.slice(8)}]`
                : a.item.no_despues ? ` [no después del ${a.item.no_despues.slice(8)}]` : '';
      return `· ${a.fecha} — ${a.item.titulo} (${catalogo(PILARES, a.item.pilar)})${lim}`;
    })
    .join('\n');

  const diagnostico = flojas
    ? `\nOjo: ${flojas} semana${flojas > 1 ? 's quedan' : ' queda'} por debajo del 40% institucional. Te faltan piezas de Orgullo, Sé IBERO o Voz.`
    : '\nTodas las semanas del mes quedan con al menos 40% de contenido institucional.';

  const noCupieron = sinHueco.length
    ? '\n\nNo encontré día para:\n' + sinHueco.map(i => {
        const lim = i.no_antes ? `no antes del ${fechaLegible(i.no_antes)}`
                  : i.no_despues ? `no después del ${fechaLegible(i.no_despues)}` : 'sin días libres';
        return `· ${i.titulo} (${lim})`;
      }).join('\n') + '\nQuedan pendientes: prueba en otro mes o libera un día.'
    : '';

  if (!confirm(`Propuesta de calendarización:\n\n${resumen}\n${diagnostico}${noCupieron}\n\n¿La aplico?`)) return;

  asignaciones.forEach(a => {
    if (a.item.esIdea) {
      const s = a.item.sugerencia;
      datos.parrilla.ideas = datos.parrilla.ideas.filter(i => i.id !== a.item.ref.id);
      datos.parrilla.piezas.push({
        id: id(), titulo: s.titulo, pilar: s.pilar, canales: s.canales, formato: s.formato,
        fecha: a.fecha, responsable: '', estado: 'idea', copy: '',
        notas: a.item.ref.texto, imagen: '',
        no_antes: s.no_antes || '', no_despues: s.no_despues || '',
        creado: ahora(), actualizado: ahora(),
      });
    } else {
      a.item.ref.fecha = a.fecha;
      a.item.ref.actualizado = ahora();
    }
  });

  guardar('parrilla');
  registrar(`Acomodó ${asignaciones.length} pieza${asignaciones.length === 1 ? '' : 's'} en el calendario`);
  refrescarParrilla();
  refrescarAuditoria();
  avisar(`${asignaciones.length} pieza${asignaciones.length === 1 ? '' : 's'} acomodada${asignaciones.length === 1 ? '' : 's'}. Ctrl+Z lo revierte.`);
}

/* ══════════════════════════════════════════════════════════
   MESA DE REDACCIÓN
   Una nota pasa por tres manos. El estado dice en cuál está
   y, sobre todo, de quién se está esperando algo.
   ══════════════════════════════════════════════════════════ */

const ESTADOS_NOTA = [
  { id: 'encargada',  nombre: 'Encargada',      quien: 'redaccion',    color: '#7A8B99', nota: 'Ya se mandó el encargo; falta que empiece' },
  { id: 'escribiendo',nombre: 'Escribiendo',    quien: 'redaccion',    color: '#8A5A1F', nota: 'En manos de quien redacta' },
  { id: 'borrador',   nombre: 'Borrador listo', quien: 'coordinacion', color: '#3D5A80', nota: 'Texto terminado, falta tu visto bueno' },
  { id: 'con_sitio',  nombre: 'Con publicación',quien: 'publicacion',  color: '#6A4C93', nota: 'Enviada para subir al sitio' },
  { id: 'publicada',  nombre: 'En el sitio',    quien: 'coordinacion', color: '#147468', nota: 'Ya vive en el sitio; toca difundirla' },
  { id: 'difundida',  nombre: 'Difundida',      quien: '—',            color: '#357044', nota: 'Post y reel publicados. Cerrada.' },
];

function rolDe(clave) {
  const eq = (datos.redaccion && datos.redaccion.equipo) || {};
  return eq[clave] || { redaccion: 'quien escribe', publicacion: 'quien publica', coordinacion: 'tú' }[clave] || '—';
}

function notasEnCurso() {
  return datos.parrilla.piezas
    .filter(p => p.formato === 'Nota')
    .sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
}

/* ── Temas en observación ──────────────────────────────── */

function pintarTemas() {
  const cont = $('#listaTemas');
  const temas = (datos.redaccion.temas || []);

  if (!temas.length) {
    cont.innerHTML = `<div class="vacio">
      <div class="vacio-titulo">Ningún tema en observación</div>
      <div>Anota asuntos donde ya sabes quién puede opinar. Cuando la noticia salga, tendrás medio camino andado en vez de arrancar de cero.</div>
    </div>`;
    return;
  }

  cont.innerHTML = temas.map(t => {
    const exp = (datos.expertos.personas || []).find(p => p.id === t.experto);
    return `
      <article class="tema-ficha${t.caliente ? ' caliente' : ''}" data-tema="${esc(t.id)}">
        <header>
          <span class="tema-titulo">${esc(t.titulo)}</span>
          ${t.caliente ? '<span class="tema-flama" title="La coyuntura ya lo activó">● activo</span>' : ''}
        </header>
        ${t.angulo ? `<p class="tema-angulo">${esc(t.angulo)}</p>` : ''}
        <footer>
          <span class="tenue">${exp ? esc(exp.nombre) : '<i>sin experto asignado</i>'}</span>
          <span class="tema-acciones">
            <button class="idea-btn" data-activar="${esc(t.id)}" title="Convertir en encargo de nota">Encargar</button>
            <button class="idea-btn borrar" data-borrar-tema="${esc(t.id)}" title="Quitar tema">✕</button>
          </span>
        </footer>
      </article>`;
  }).join('');

  $$('[data-tema]', cont).forEach(el => el.addEventListener('click', ev => {
    if (ev.target.closest('button')) return;
    abrirTema(el.dataset.tema);
  }));
  $$('[data-activar]', cont).forEach(b => b.addEventListener('click', () => encargarDesdeTema(b.dataset.activar)));
  $$('[data-borrar-tema]', cont).forEach(b => b.addEventListener('click', () => {
    const t = datos.redaccion.temas.find(x => x.id === b.dataset.borrarTema);
    if (!t || !confirm(`¿Quitar «${t.titulo}» de los temas en observación?`)) return;
    datos.redaccion.temas = datos.redaccion.temas.filter(x => x.id !== t.id);
    guardar('redaccion');
    registrar(`Quitó el tema «${t.titulo.slice(0, 30)}»`);
    pintarRedaccion();
  }));
}

function abrirTema(idTema) {
  const existente = idTema ? datos.redaccion.temas.find(t => t.id === idTema) : null;
  const t = existente || { id: id(), titulo: '', angulo: '', experto: '', caliente: false };

  modalCtx = { tipo: 'tema', datos: t, esNuevo: !existente };
  $('#modalTitulo').textContent = existente ? 'Editar tema' : 'Anotar tema en observación';
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="grupo-campo">
      <label for="t_titulo">Tema</label>
      <input class="campo" id="t_titulo" value="${esc(t.titulo)}" placeholder="Migración en la frontera, inflación, salud mental universitaria…">
    </div>

    <div class="grupo-campo">
      <label for="t_angulo">Ángulo que buscaríamos</label>
      <textarea class="campo" id="t_angulo" placeholder="Qué pregunta responderíamos y por qué le importa a alguien en Tijuana">${esc(t.angulo)}</textarea>
      <span class="ayuda">Escribe el ángulo ahora, con calma. El día que estalle la noticia no vas a tener tiempo de pensarlo.</span>
    </div>

    <div class="grupo-campo">
      <label for="t_experto">Experto que lo hablaría</label>
      <select class="campo" id="t_experto">
        <option value="">Todavía no sé quién</option>
        ${(datos.expertos.personas || []).map(x =>
          `<option value="${esc(x.id)}"${x.id === t.experto ? ' selected' : ''}>${esc(x.nombre)}${x.departamento ? ' · ' + esc(x.departamento) : ''}</option>`).join('')}
      </select>
      ${!(datos.expertos.personas || []).length ? '<span class="ayuda">El directorio está vacío. Regístralos en la pestaña Expertos.</span>' : ''}
    </div>

    <div class="grupo-campo">
      <label class="check-inline">
        <input type="checkbox" id="t_caliente"${t.caliente ? ' checked' : ''}>
        La coyuntura ya lo activó — esto es de ahora
      </label>
    </div>
  `;
  mostrarModal();
}

function leerTema() {
  const t = modalCtx.datos;
  t.titulo   = $('#t_titulo').value.trim();
  t.angulo   = $('#t_angulo').value;
  t.experto  = $('#t_experto').value;
  t.caliente = $('#t_caliente').checked;

  if (!t.titulo) { avisar('El tema necesita un título.'); return false; }

  t.actualizado = ahora();
  if (modalCtx.esNuevo) {
    t.creado = ahora();
    datos.redaccion.temas = datos.redaccion.temas || [];
    datos.redaccion.temas.push(t);
  }
  guardar('redaccion');
  return true;
}

/* ── De tema a encargo ─────────────────────────────────── */

function encargarDesdeTema(idTema) {
  const t = datos.redaccion.temas.find(x => x.id === idTema);
  if (!t) return;
  abrirPieza(null, {
    titulo: t.titulo,
    pilar: 'academia',
    formato: 'Nota',
    canales: ['web', 'fb', 'li'],
    estado: 'brief',
    estado_nota: 'encargada',
    experto: t.experto || '',
    notas: t.angulo,
    produccion: guiaDeProduccion('Nota', 'academia').map(x => '· ' + x).join('\n'),
  });
  avisar('Llena la fecha límite y guarda. Después usa Encargo para mandárselo a quien escribe.');
}

/* ── Tablero de notas ──────────────────────────────────── */

function pintarTableroNotas() {
  const cont = $('#tableroNotas');
  const notas = notasEnCurso();

  if (!notas.length) {
    cont.innerHTML = `<div class="vacio">
      <div class="vacio-titulo">Ninguna nota en curso</div>
      <div>Usa <b>Encargar nota</b>, o activa un tema de los que tengas en observación.</div>
    </div>`;
    return;
  }

  cont.innerHTML = ESTADOS_NOTA.map(e => {
    const enEstado = notas.filter(n => (n.estado_nota || 'encargada') === e.id);
    return `
      <div class="columna-nota">
        <header style="border-top-color:${e.color}">
          <span class="col-nombre">${esc(e.nombre)}</span>
          <span class="col-cuenta">${enEstado.length}</span>
          <span class="col-quien">${e.quien === '—' ? 'cerrada' : 'espera ' + esc(rolDe(e.quien))}</span>
        </header>
        <div class="col-cuerpo">
          ${enEstado.map(n => {
            const exp = (datos.expertos.personas || []).find(p => p.id === n.experto);
            const tarde = n.fecha && n.fecha < aTexto(new Date()) && e.id !== 'difundida';
            return `
              <article class="nota-ficha${tarde ? ' tarde' : ''}" data-nota="${esc(n.id)}">
                <div class="nota-titulo">${esc(n.titulo)}</div>
                <div class="nota-meta">${n.fecha ? esc(n.fecha.slice(5)) : 'sin fecha'}${exp ? ' · ' + esc(exp.nombre.split(' ')[0]) : ' · sin experto'}</div>
                <div class="nota-acciones">
                  <button class="idea-btn" data-encargo="${esc(n.id)}" title="Armar el texto del encargo">Encargo</button>
                  <button class="idea-btn" data-avanzar="${esc(n.id)}" title="Pasar a la siguiente etapa">→</button>
                </div>
              </article>`;
          }).join('') || '<div class="col-vacia">—</div>'}
        </div>
      </div>`;
  }).join('');

  $$('.nota-ficha', cont).forEach(el => el.addEventListener('click', ev => {
    if (ev.target.closest('button')) return;
    abrirPieza(el.dataset.nota);
  }));
  $$('[data-encargo]', cont).forEach(b => b.addEventListener('click', () => generarEncargo(b.dataset.encargo)));
  $$('[data-avanzar]', cont).forEach(b => b.addEventListener('click', () => avanzarNota(b.dataset.avanzar)));
}

function avanzarNota(idNota) {
  const n = datos.parrilla.piezas.find(p => p.id === idNota);
  if (!n) return;
  const i = ESTADOS_NOTA.findIndex(e => e.id === (n.estado_nota || 'encargada'));
  if (i < 0 || i >= ESTADOS_NOTA.length - 1) { avisar('Esta nota ya está cerrada.'); return; }

  const siguiente = ESTADOS_NOTA[i + 1];
  n.estado_nota = siguiente.id;
  if (siguiente.id === 'publicada') n.estado = 'publicado';
  n.actualizado = ahora();

  guardar('parrilla');
  registrar(`Nota «${n.titulo.slice(0, 26)}» → ${siguiente.nombre}`);
  pintarRedaccion();
  refrescarAuditoria();
  avisar(`${siguiente.nombre}${siguiente.quien !== '—' ? ' · ahora espera ' + rolDe(siguiente.quien) : ''}`);
}

/* ── Encargo listo para mandar ─────────────────────────── */

async function generarEncargo(idNota) {
  const n = datos.parrilla.piezas.find(p => p.id === idNota);
  if (!n) return;
  const exp = (datos.expertos.personas || []).find(p => p.id === n.experto);

  const l = [];
  l.push(`ENCARGO DE NOTA — ${n.titulo}`);
  l.push('═'.repeat(Math.min(60, n.titulo.length + 18)));
  l.push('');
  l.push(`Para:        ${rolDe('redaccion')}`);
  l.push(`Publica:     ${rolDe('publicacion')} (sitio IBERO Tijuana)`);
  if (n.fecha) l.push(`Fecha meta:  ${fechaLegible(n.fecha)}`);
  l.push('');

  if (n.notas && n.notas.trim()) {
    l.push('ÁNGULO');
    n.notas.trim().split('\n').forEach(x => l.push('  ' + x));
    l.push('');
  }

  l.push('FUENTE');
  if (exp) {
    l.push(`  ${[exp.grado, exp.nombre].filter(Boolean).join(' ')}`);
    if (exp.departamento) l.push(`  ${exp.departamento}`);
    if (exp.contacto) l.push(`  Contacto: ${exp.contacto}`);
    const d = DISPONIBILIDAD.find(x => x.id === exp.disponibilidad);
    if (d) l.push(`  Disponibilidad: ${d.nombre} — ${d.nota}`);
    if (exp.notas) l.push(`  Ojo: ${exp.notas}`);
  } else {
    l.push('  ⚠ Sin experto asignado. Definirlo antes de arrancar.');
  }
  l.push('');

  l.push('QUÉ NECESITA LLEVAR');
  guiaDeProduccion('Nota', 'academia').forEach(p => l.push('  · ' + p));
  l.push('');

  l.push('QUÉ HAGO YO CON ESO');
  l.push('  · Post de Facebook con la frase citable, ligando a la nota.');
  l.push('  · Reel de 30 seg con el experto diciendo la idea clave.');
  l.push('  · El reel se graba EN LA MISMA SESIÓN de la entrevista. Avísame para agendarla.');
  l.push('');
  l.push(`Cualquier duda: ${rolDe('coordinacion')}`);

  const texto = l.join('\n');
  try {
    await navigator.clipboard.writeText(texto);
    avisar('Encargo copiado. Mándaselo a ' + rolDe('redaccion') + '.');
  } catch (e) {
    prompt('Copia el encargo con Ctrl+C:', texto);
  }
}

function pintarRedaccion() {
  if (vistaActual !== 'redaccion') return;
  $('#rolRedaccion').textContent = rolDe('redaccion');
  $('#rolPublicacion').textContent = rolDe('publicacion');
  pintarTemas();
  pintarTableroNotas();
}

/* ══════════════════════════════════════════════════════════
   DIRECTORIO DE EXPERTOS
   El modelo de nota reactiva sólo funciona si sabes a quién
   llamar antes de que pase la noticia.
   ══════════════════════════════════════════════════════════ */

const DISPONIBILIDAD = [
  { id: 'alta',  nombre: 'Responde rápido',    nota: 'Se le puede llamar el mismo día', color: 'var(--ok)' },
  { id: 'media', nombre: 'Con agenda',          nota: 'Pedir cita con un día de aviso',  color: 'var(--alerta)' },
  { id: 'baja',  nombre: 'Difícil de agendar',  nota: 'Sólo para temas grandes',         color: 'var(--peligro)' },
];

/* Temas de coyuntura que una universidad en Tijuana debería poder
   comentar. Sirve para ver qué territorio tienes descubierto. */
const TEMAS_CLAVE = [
  'Frontera y migración', 'Economía y comercio', 'Salud pública', 'Seguridad',
  'Política y elecciones', 'Educación', 'Medio ambiente', 'Tecnología e IA',
  'Derechos humanos', 'Cultura y sociedad', 'Empresa y trabajo', 'Urbanismo',
];

function expertosFiltrados() {
  const q = ($('#buscarExperto').value || '').trim().toLowerCase();
  const disp = $('#filtroDisponibilidad').value;
  return (datos.expertos.personas || [])
    .filter(p => !disp || p.disponibilidad === disp)
    .filter(p => !q || [p.nombre, p.departamento, p.grado, (p.temas || []).join(' ')]
      .some(v => (v || '').toLowerCase().includes(q)))
    .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
}

function pintarExpertos() {
  if (vistaActual !== 'expertos') return;
  const personas = datos.expertos.personas || [];

  // Mapa de cobertura: qué temas tienen quién los hable
  const cobertura = TEMAS_CLAVE.map(t => {
    const quienes = personas.filter(p => (p.temas || []).some(x => normalizar(x) === normalizar(t)));
    return { tema: t, quienes };
  });
  const descubiertos = cobertura.filter(c => !c.quienes.length).length;

  $('#temasCobertura').innerHTML = `
    <div class="bloque-encabezado"><h3>Cobertura temática</h3></div>
    <p class="tenue nota">${descubiertos
      ? `Tienes ${TEMAS_CLAVE.length - descubiertos} de ${TEMAS_CLAVE.length} temas cubiertos. Los grises son territorio donde hoy no podrías responder a una nota de coyuntura.`
      : 'Todos los temas clave tienen al menos un académico que puede hablarlos.'}</p>
    <div class="tira-temas">
      ${cobertura.map(c => `
        <span class="tema${c.quienes.length ? ' cubierto' : ''}" title="${c.quienes.length
          ? esc(c.quienes.map(p => p.nombre).join(', '))
          : 'Sin experto registrado'}">
          ${esc(c.tema)}${c.quienes.length ? ` <b>${c.quienes.length}</b>` : ''}
        </span>`).join('')}
    </div>`;

  const lista = expertosFiltrados();
  const cont = $('#listaExpertos');

  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">
      <div class="vacio-titulo">${personas.length ? 'Nadie con esos filtros' : 'Todavía no hay expertos registrados'}</div>
      <div>${personas.length ? 'Prueba otra búsqueda.'
        : 'Empieza por los que ya sabes que aceptan hablar con prensa. Cinco bien elegidos valen más que treinta que nunca contestan.'}</div>
    </div>`;
    return;
  }

  cont.innerHTML = lista.map(p => {
    const d = DISPONIBILIDAD.find(x => x.id === p.disponibilidad) || DISPONIBILIDAD[1];
    const veces = datos.parrilla.piezas.filter(x => x.experto === p.id).length;
    return `
      <article class="ficha-experto" data-exp="${esc(p.id)}">
        <header>
          <div>
            <div class="exp-nombre">${esc(p.nombre)}</div>
            <div class="exp-cargo">${esc([p.grado, p.departamento].filter(Boolean).join(' · ') || 'Sin departamento')}</div>
          </div>
          <span class="exp-disp" style="color:${d.color};border-color:${d.color}" title="${esc(d.nota)}">${esc(d.nombre)}</span>
        </header>
        ${(p.temas || []).length ? `<div class="exp-temas">${p.temas.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        ${p.contacto ? `<div class="exp-contacto">${esc(p.contacto)}</div>` : ''}
        ${p.notas ? `<div class="exp-notas">${esc(p.notas)}</div>` : ''}
        <footer>
          <span class="tenue">${veces ? `${veces} pieza${veces === 1 ? '' : 's'} publicada${veces === 1 ? '' : 's'}` : 'Sin piezas aún'}</span>
          <button class="idea-btn" data-editar-exp="${esc(p.id)}">Abrir</button>
        </footer>
      </article>`;
  }).join('');

  $$('[data-editar-exp]', cont).forEach(b =>
    b.addEventListener('click', () => abrirExperto(b.dataset.editarExp)));
}

function abrirExperto(idExp) {
  const existente = idExp ? (datos.expertos.personas || []).find(p => p.id === idExp) : null;
  const p = existente || {
    id: id(), nombre: '', grado: '', departamento: '', temas: [],
    contacto: '', disponibilidad: 'media', notas: '',
  };

  modalCtx = { tipo: 'experto', datos: p, esNuevo: !existente };
  $('#modalTitulo').textContent = existente ? 'Editar experto' : 'Registrar experto';
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="grupo-campo">
      <label for="x_nombre">Nombre completo</label>
      <input class="campo" id="x_nombre" value="${esc(p.nombre)}" placeholder="Como debe aparecer citado en la nota">
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="x_grado">Grado</label>
        <input class="campo" id="x_grado" value="${esc(p.grado)}" placeholder="Dr., Mtra., Lic.">
      </div>
      <div class="grupo-campo">
        <label for="x_depto">Departamento o carrera</label>
        <input class="campo" id="x_depto" value="${esc(p.departamento)}" placeholder="Derecho, Medicina, Negocios…">
      </div>
    </div>

    <div class="grupo-campo">
      <label>Temas que puede comentar</label>
      <div class="opciones-canal" id="x_temas">
        ${TEMAS_CLAVE.map(t => `
          <label class="opcion-canal${(p.temas || []).includes(t) ? ' marcado' : ''}">
            <input type="checkbox" value="${esc(t)}"${(p.temas || []).includes(t) ? ' checked' : ''}>${esc(t)}
          </label>`).join('')}
      </div>
      <span class="ayuda">Marca sólo donde de verdad tenga autoridad. Un experto de todo no sirve para nada.</span>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="x_disp">Qué tan rápido responde</label>
        <select class="campo" id="x_disp">
          ${DISPONIBILIDAD.map(d => `<option value="${d.id}"${d.id === p.disponibilidad ? ' selected' : ''}>${esc(d.nombre)} — ${esc(d.nota)}</option>`).join('')}
        </select>
      </div>
      <div class="grupo-campo">
        <label for="x_contacto">Contacto</label>
        <input class="campo" id="x_contacto" value="${esc(p.contacto)}" placeholder="Extensión, correo o celular">
      </div>
    </div>

    <div class="grupo-campo">
      <label for="x_notas">Notas de trato</label>
      <textarea class="campo" id="x_notas" placeholder="Prefiere revisar la cita antes de publicar, no da entrevistas en video, mejor por las tardes…">${esc(p.notas)}</textarea>
      <span class="ayuda">Lo que te ahorraría una llamada incómoda la próxima vez.</span>
    </div>
  `;

  $$('#x_temas .opcion-canal').forEach(l => {
    l.querySelector('input').addEventListener('change', ev =>
      l.classList.toggle('marcado', ev.target.checked));
  });

  mostrarModal();
}

function leerExperto() {
  const p = modalCtx.datos;
  p.nombre         = $('#x_nombre').value.trim();
  p.grado          = $('#x_grado').value.trim();
  p.departamento   = $('#x_depto').value.trim();
  p.temas          = $$('#x_temas input:checked').map(i => i.value);
  p.disponibilidad = $('#x_disp').value;
  p.contacto       = $('#x_contacto').value.trim();
  p.notas          = $('#x_notas').value;

  if (!p.nombre) { avisar('El experto necesita un nombre.'); return false; }

  p.actualizado = ahora();
  if (modalCtx.esNuevo) {
    p.creado = ahora();
    datos.expertos.personas = datos.expertos.personas || [];
    datos.expertos.personas.push(p);
  }
  guardar('expertos');
  return true;
}

/* ══════════════════════════════════════════════════════════
   AUDITORÍA DEL SISTEMA
   Revisa parrilla e inventario contra las reglas del plan
   maestro y devuelve hallazgos accionables.
   ══════════════════════════════════════════════════════════ */

function ventanaAuditoria() {
  const hoy = new Date();
  const periodo = $('#periodoAuditoria').value;
  if (periodo === 'todo') return { desde: '0000-01-01', hasta: '9999-12-31', nombre: 'todo lo registrado' };
  if (periodo === 'proximo') {
    const a = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
    return { desde: aTexto(a), hasta: aTexto(new Date(a.getFullYear(), a.getMonth() + 1, 0)), nombre: 'el próximo mes' };
  }
  if (periodo === 'trimestre') {
    return {
      desde: aTexto(new Date(hoy.getFullYear(), hoy.getMonth(), 1)),
      hasta: aTexto(new Date(hoy.getFullYear(), hoy.getMonth() + 3, 0)),
      nombre: 'los próximos 3 meses',
    };
  }
  return {
    desde: aTexto(new Date(hoy.getFullYear(), hoy.getMonth(), 1)),
    hasta: aTexto(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)),
    nombre: 'este mes',
  };
}

function auditar() {
  const v = ventanaAuditoria();
  const piezas = datos.parrilla.piezas.filter(p => p.fecha >= v.desde && p.fecha <= v.hasta);
  const equipos = datos.inventario.equipos || [];
  const hallazgos = [];
  const hoyTxt = aTexto(new Date());

  const inst = p => {
    const x = PILARES.find(y => y.id === p.pilar);
    return x && x.carril === 'institucional';
  };

  /* — Parrilla — */

  if (!piezas.length) {
    hallazgos.push({ nivel: 'grave', icono: '!', titulo: 'No hay nada programado',
      detalle: `No existe ninguna pieza con fecha dentro de ${v.nombre}.`,
      accion: 'Programa al menos tres piezas por semana para sostener presencia.' });
  } else {
    // Mezcla institucional por semana
    const semanas = {};
    piezas.forEach(p => {
      const k = aTexto(inicioSemana(aFecha(p.fecha)));
      (semanas[k] = semanas[k] || []).push(p);
    });
    const flojas = Object.entries(semanas).filter(([, ps]) => ps.filter(inst).length / ps.length < 0.4);
    const secas = Object.entries(semanas).filter(([, ps]) => !ps.some(inst));

    if (secas.length) {
      hallazgos.push({ nivel: 'grave', icono: '!', titulo: `${secas.length} semana${secas.length > 1 ? 's' : ''} sin nada institucional`,
        detalle: `Semana${secas.length > 1 ? 's' : ''} del ${secas.map(([k]) => aFecha(k).getDate()).join(', ')}: puro contenido casual o híbrido.`,
        accion: 'Este es exactamente el patrón que detectamos en julio de 2026. Mete una pieza de Orgullo, Sé IBERO o Voz en cada una.' });
    } else if (flojas.length) {
      hallazgos.push({ nivel: 'medio', icono: '~', titulo: `${flojas.length} semana${flojas.length > 1 ? 's' : ''} por debajo del 40% institucional`,
        detalle: 'Hay contenido institucional, pero no alcanza el piso que fija el plan maestro.',
        accion: 'Sube una pieza institucional en cada semana floja, o mueve una casual a otra semana.' });
    } else {
      hallazgos.push({ nivel: 'bien', icono: '✓', titulo: 'La mezcla semanal está equilibrada',
        detalle: 'Todas las semanas con contenido llegan al 40% institucional.',
        accion: 'Mantén el ritmo: es lo que corrige el problema histórico de la cuenta.' });
    }

    // Ritmo
    const dias = Math.max(1, (aFecha(v.hasta) - aFecha(v.desde)) / 86400000 + 1);
    const porSemana = piezas.length / (dias / 7);
    if (porSemana < 2.5) {
      hallazgos.push({ nivel: 'medio', icono: '~', titulo: 'Ritmo por debajo de la meta',
        detalle: `Vas en ${porSemana.toFixed(1)} piezas por semana. La meta del plan son 3 a 4.`,
        accion: 'Alimenta el banco de ideas y usa Acomodar pendientes para repartirlas.' });
    }

    // Piezas atoradas: fecha pasada sin publicar
    const atrasadas = piezas.filter(p => p.fecha < hoyTxt && p.estado !== 'publicado');
    if (atrasadas.length) {
      hallazgos.push({ nivel: 'medio', icono: '~', titulo: `${atrasadas.length} pieza${atrasadas.length > 1 ? 's' : ''} con fecha vencida sin publicar`,
        detalle: atrasadas.slice(0, 3).map(p => `«${p.titulo}» (${p.fecha})`).join(', ') + (atrasadas.length > 3 ? '…' : ''),
        accion: 'Márcalas como publicadas o muévelas de fecha. Si se quedan ahí, el diagnóstico deja de ser confiable.' });
    }

    // Cuellos de botella en el flujo
    const enRevision = piezas.filter(p => p.estado === 'revision').length;
    if (enRevision >= 4) {
      hallazgos.push({ nivel: 'medio', icono: '~', titulo: `${enRevision} piezas esperando tu revisión`,
        detalle: 'Cuando se acumulan en Revisión Leo, tú eres el cuello de botella del flujo.',
        accion: 'Apártalas para la ventana del miércoles y despáchalas de una sentada.' });
    }

    // Preparación de piezas próximas
    const proximas = piezas.filter(p => p.fecha >= hoyTxt && aFecha(p.fecha) <= sumarDias(new Date(), 7));
    const sinCopy = proximas.filter(p => !(p.copy || '').trim());
    if (sinCopy.length) {
      hallazgos.push({ nivel: 'leve', icono: 'i', titulo: `${sinCopy.length} pieza${sinCopy.length > 1 ? 's' : ''} de esta semana sin copy`,
        detalle: sinCopy.slice(0, 3).map(p => `«${p.titulo}»`).join(', ') + (sinCopy.length > 3 ? '…' : ''),
        accion: 'El copy es lo que más tarda en aprobarse. Redáctalo antes de la ventana del miércoles.' });
    }

    const sinImagen = piezas.filter(p => !p.imagen).length;
    if (sinImagen && sinImagen === piezas.length) {
      hallazgos.push({ nivel: 'leve', icono: 'i', titulo: 'Ninguna pieza tiene miniatura',
        detalle: 'El calendario se ve mucho más útil cuando las piezas traen imagen.',
        accion: 'Sube una referencia visual aunque sea provisional al crear la pieza.' });
    }

    // El pilar académico es directriz de dirección: se revisa aparte
    const notas = piezas.filter(p => p.pilar === 'academia');
    const expertos = (datos.expertos.personas || []).length;

    if (!notas.length) {
      hallazgos.push({ nivel: 'grave', icono: '!', titulo: 'Sin contenido académico en el periodo',
        detalle: 'Academia IBERO es el pilar que pidió dirección y tiene meta de 20%. Ahora mismo va en cero.',
        accion: 'Una nota de coyuntura con un experto de casa, publicada en el sitio y replicada en Facebook.' });
    } else {
      const conExperto = notas.filter(p => p.experto).length;
      if (conExperto < notas.length) {
        hallazgos.push({ nivel: 'medio', icono: '~', titulo: `${notas.length - conExperto} pieza(s) académicas sin experto asignado`,
          detalle: 'Una nota académica sin fuente citada no se distingue de una publicación institucional cualquiera.',
          accion: 'Asigna el experto en la ficha: es lo que le da autoridad a la nota y alimenta el directorio.' });
      }
      const enWeb = notas.filter(p => (p.canales || []).includes('web')).length;
      if (!enWeb) {
        hallazgos.push({ nivel: 'medio', icono: '~', titulo: 'El contenido académico no está yendo al sitio',
          detalle: 'Las notas viven en el sitio de IBERO Tijuana; redes sólo apuntan ahí. Sin la nota publicada, el post de Facebook no tiene a dónde llevar.',
          accion: 'Marca el canal Sitio IBERO en las piezas de formato Nota.' });
      }
    }

    if (expertos < 5) {
      hallazgos.push({ nivel: expertos ? 'medio' : 'grave', icono: expertos ? '~' : '!',
        titulo: expertos ? `Sólo ${expertos} experto(s) en el directorio` : 'El directorio de expertos está vacío',
        detalle: 'El modelo de nota reactiva depende de saber a quién llamar el mismo día. Sin directorio, cada nota arranca preguntando quién sabe del tema.',
        accion: 'Registra cinco académicos que ya sepas que aceptan hablar con prensa. Es el cimiento del pilar académico.' });
    }

    // Cobertura de canales
    const usoCanal = {};
    CANALES.forEach(c => { usoCanal[c.id] = piezas.filter(p => (p.canales || []).includes(c.id)).length; });
    const muertos = CANALES.filter(c => usoCanal[c.id] === 0);
    if (muertos.length) {
      hallazgos.push({ nivel: 'leve', icono: 'i', titulo: `Sin contenido para ${muertos.map(c => c.nombre).join(' y ')}`,
        detalle: muertos.some(c => c.id === 'yt')
          ? 'YouTube sigue sin recibir nada. Es el canal con más margen: los reels que ya produces sirven como Shorts sin costo extra.'
          : 'Ese canal no recibe nada en el periodo.',
        accion: 'Marca el canal en las piezas que ya sirven ahí. No necesitas producir de más.' });
    }

    // Sin responsable
    const huerfanas = piezas.filter(p => !(p.responsable || '').trim()).length;
    if (huerfanas >= 3) {
      hallazgos.push({ nivel: 'leve', icono: 'i', titulo: `${huerfanas} piezas sin responsable`,
        detalle: 'Sin nombre asignado no se puede reclamar el avance en la junta del lunes.',
        accion: 'Asigna responsable al crear la pieza, aunque seas tú.' });
    }
  }

  // Banco de ideas
  const ideas = (datos.parrilla.ideas || []).length;
  if (ideas >= 8) {
    hallazgos.push({ nivel: 'leve', icono: 'i', titulo: `${ideas} ideas sin aterrizar`,
      detalle: 'El banco creció más rápido de lo que lo estás vaciando.',
      accion: 'Usa Acomodar pendientes para repartirlas en el mes.' });
  }

  /* — Inventario — */

  if (!equipos.length) {
    hallazgos.push({ nivel: 'medio', icono: '~', titulo: 'El inventario está vacío',
      detalle: 'No hay ningún equipo registrado.',
      accion: 'Levántalo categoría por categoría: cámaras, lentes, drone, audio. Con eso ya puedes armar listas de salida.' });
  } else {
    const vencidos = equipos.filter(e => e.estado === 'prestado' && e.prestamo &&
      e.prestamo.regreso_esperado && e.prestamo.regreso_esperado < hoyTxt);
    if (vencidos.length) {
      hallazgos.push({ nivel: 'grave', icono: '!', titulo: `${vencidos.length} préstamo${vencidos.length > 1 ? 's' : ''} vencido${vencidos.length > 1 ? 's' : ''}`,
        detalle: vencidos.map(e => `${e.nombre} (con ${e.prestamo.responsable || 'sin responsable'})`).join(', '),
        accion: 'Recupéralos o extiende la fecha. Equipo prestado sin control es equipo que se pierde.' });
    }

    // Lo único que se revisa aquí es lo que te sirve para operar: saber
    // dónde está cada cosa. El registro patrimonial es de Planta Física.
    const activos = equipos.filter(e => e.estado !== 'baja');
    const sinUbicacion = activos.filter(e => !(e.ubicacion || '').trim()).length;
    if (activos.length >= 4 && sinUbicacion > activos.length / 2) {
      hallazgos.push({ nivel: 'leve', icono: 'i', titulo: `${sinUbicacion} de ${activos.length} equipos sin ubicación`,
        detalle: 'Si no dice dónde está cada cosa, el inventario no te ahorra la vuelta a bodega.',
        accion: 'Anota dónde vive cada equipo, aunque sea "gaveta 2" o "mochila chica".' });
    }

    const drones = equipos.filter(e => e.categoria === 'drone' && e.estado !== 'baja');
    if (drones.length && !(datos.inventario.vuelos || []).length) {
      hallazgos.push({ nivel: 'medio', icono: '~', titulo: 'Drone registrado sin bitácora de vuelos',
        detalle: 'Hay drone en el inventario pero ningún vuelo capturado.',
        accion: 'Registra cada vuelo con piloto, ubicación y permiso. Es lo que te respalda si alguien pregunta.' });
    }
  }

  // Calificación: parte de 100 y descuenta por severidad.
  const penalizacion = hallazgos.reduce((s, h) =>
    s + ({ grave: 22, medio: 11, leve: 4, bien: 0 })[h.nivel], 0);
  const puntaje = Math.max(0, Math.min(100, 100 - penalizacion));

  const orden = { grave: 0, medio: 1, leve: 2, bien: 3 };
  hallazgos.sort((a, b) => orden[a.nivel] - orden[b.nivel]);

  return { hallazgos, puntaje, piezas, equipos, ventana: v };
}

function refrescarAuditoria() {
  if (vistaActual !== 'auditoria') return;
  const r = auditar();

  // Marcador circular
  const color = r.puntaje >= 80 ? 'var(--ok)' : r.puntaje >= 55 ? 'var(--alerta)' : 'var(--peligro)';
  const etiqueta = r.puntaje >= 80 ? 'Sano' : r.puntaje >= 55 ? 'Atención' : 'Requiere trabajo';
  $('#marcador').style.background =
    `conic-gradient(${color} ${r.puntaje * 3.6}deg, var(--fondo-alt) 0)`;
  $('#marcador').innerHTML =
    `<div class="marcador-centro">
       <div class="marcador-cifra" style="color:${color}">${r.puntaje}</div>
       <div class="marcador-etiqueta">${esc(etiqueta)}</div>
     </div>`;

  // Hallazgos
  $('#hallazgos').innerHTML = r.hallazgos.length
    ? r.hallazgos.map(h => `
        <div class="hallazgo ${h.nivel}">
          <div class="hallazgo-icono">${esc(h.icono)}</div>
          <div>
            <div class="hallazgo-titulo">${esc(h.titulo)}</div>
            <div class="hallazgo-detalle">${esc(h.detalle)}</div>
            <div class="hallazgo-accion"><b>Qué hacer:</b> ${esc(h.accion)}</div>
          </div>
        </div>`).join('')
    : '<div class="vacio">Sin observaciones en este periodo.</div>';

  // Mezcla contra la meta
  const total = r.piezas.length;
  $('#barrasMeta').innerHTML = PILARES.map(p => {
    const n = r.piezas.filter(x => x.pilar === p.id).length;
    const pct = total ? (n / total) * 100 : 0;
    return `
      <div class="fila-meta">
        <div class="nombre"><i style="background:${p.color}"></i>${esc(p.nombre)}</div>
        <div class="pista-meta">
          <div class="real" style="width:${Math.min(100, pct)}%;background:${p.color}"></div>
          <div class="objetivo" style="left:${p.meta}%" title="Meta ${p.meta}%"></div>
        </div>
        <div class="lectura"><b>${Math.round(pct)}%</b> <span class="tenue">/ ${p.meta}%</span></div>
      </div>`;
  }).join('');

  // Cobertura por canal
  const maxCanal = Math.max(1, ...CANALES.map(c => r.piezas.filter(p => (p.canales || []).includes(c.id)).length));
  $('#barrasCanal').innerHTML = CANALES.map(c => {
    const n = r.piezas.filter(p => (p.canales || []).includes(c.id)).length;
    return `
      <div class="fila-canal">
        <div class="nombre">${esc(c.nombre)}</div>
        <div class="pista-canal"><span style="width:${(n / maxCanal) * 100}%;background:${c.color}"></span></div>
        <div class="cuenta">${n}</div>
      </div>`;
  }).join('');

  // Embudo de producción
  $('#embudo').innerHTML = ESTADOS.map(e => {
    const n = r.piezas.filter(p => p.estado === e.id).length;
    const atorado = (e.id === 'revision' || e.id === 'vobo') && n >= 4;
    return `
      <div class="paso-embudo${atorado ? ' atorado' : ''}">
        <div class="etapa"><span class="punto" style="background:${e.color}"></span>${esc(e.nombre)}</div>
        <div class="cuenta">${n}</div>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   INVENTARIO
   ══════════════════════════════════════════════════════════ */

function equiposFiltrados() {
  const fCat = $('#filtroCategoria').value;
  const fEst = $('#filtroEstadoEquipo').value;
  const q = $('#buscarEquipo').value.trim().toLowerCase();

  return (datos.inventario.equipos || [])
    .filter(e => !fCat || e.categoria === fCat)
    .filter(e => !fEst || e.estado === fEst)
    .filter(e => !q || [e.nombre, e.marca, e.modelo, e.serie, e.ubicacion].some(v => (v || '').toLowerCase().includes(q)))
    .sort((a, b) => (a.categoria || '').localeCompare(b.categoria || '') || (a.nombre || '').localeCompare(b.nombre || ''));
}

function pintarResumen() {
  const eq = datos.inventario.equipos || [];
  const activos = eq.filter(e => e.estado !== 'baja');
  const piezas = activos.reduce((s, e) => s + (Number(e.cantidad) || 1), 0);
  const disponibles = activos.filter(e => e.estado === 'disponible')
                             .reduce((s, e) => s + (Number(e.cantidad) || 1), 0);
  const prestados = eq.filter(e => e.estado === 'prestado').length;
  const fuera = eq.filter(e => e.estado === 'mantenimiento').length;

  $('#resumenInventario').innerHTML = `
    <div class="tarjeta-dato acento"><div class="cifra">${piezas}</div><div class="etiqueta">Piezas en total</div></div>
    <div class="tarjeta-dato"><div class="cifra">${disponibles}</div><div class="etiqueta">Listas para salir</div></div>
    <div class="tarjeta-dato${prestados ? ' aviso' : ''}"><div class="cifra">${prestados}</div><div class="etiqueta">Fuera, prestadas</div></div>
    <div class="tarjeta-dato"><div class="cifra">${fuera}</div><div class="etiqueta">En mantenimiento</div></div>
  `;
}

function pintarPrestamos() {
  const cont = $('#bloquePrestamos');
  const prestados = (datos.inventario.equipos || []).filter(e => e.estado === 'prestado' && e.prestamo);
  if (!prestados.length) { cont.innerHTML = ''; return; }

  const hoy = aTexto(new Date());
  cont.innerHTML = `
    <div class="bloque-encabezado"><h3>Préstamos activos</h3></div>
    <p class="tenue nota">Quién tiene qué, y desde cuándo.</p>
    <div class="prestamo-lista">
      ${prestados.map(e => {
        const vencido = e.prestamo.regreso_esperado && e.prestamo.regreso_esperado < hoy;
        return `<div class="prestamo-tarjeta${vencido ? ' vencido' : ''}">
          <div class="info">
            <b>${esc(e.nombre)}</b>
            <div>Con ${esc(e.prestamo.responsable || 'sin responsable')} desde ${esc(e.prestamo.salida || '—')}${
              e.prestamo.regreso_esperado ? ' · regresa ' + esc(e.prestamo.regreso_esperado) : ''
            }${vencido ? ' · <b style="color:var(--peligro)">vencido</b>' : ''}</div>
          </div>
          <button class="btn-plano" data-devolver="${esc(e.id)}">Marcar devuelto</button>
        </div>`;
      }).join('')}
    </div>`;

  $$('[data-devolver]', cont).forEach(b => b.addEventListener('click', () => {
    const e = datos.inventario.equipos.find(x => x.id === b.dataset.devolver);
    if (!e) return;
    datos.inventario.prestamos_historial = datos.inventario.prestamos_historial || [];
    datos.inventario.prestamos_historial.push(Object.assign({ equipo_id: e.id, equipo: e.nombre, devuelto: aTexto(new Date()) }, e.prestamo));
    e.estado = 'disponible';
    e.prestamo = null;
    e.actualizado = ahora();
    guardar('inventario');
    registrar(`Devolución de «${e.nombre}»`);
    refrescarInventario();
    refrescarAuditoria();
    avisar('Equipo marcado como devuelto.');
  }));
}

function pintarEquipos() {
  const tb = $('#tablaEquipos tbody');
  const lista = equiposFiltrados();

  if (!lista.length) {
    tb.innerHTML = '<tr><td colspan="6"><div class="vacio" style="border:0;background:none">Todavía no hay equipo registrado.<br>Empieza con <b>+ Registrar equipo</b>.</div></td></tr>';
    return;
  }

  tb.innerHTML = lista.map(e => {
    const cant = Number(e.cantidad) || 1;
    return `
    <tr>
      <td class="col-marca">
        <label class="marca-fila" title="Seleccionar para una lista">
          <input type="checkbox" data-sel="${esc(e.id)}"${seleccionEquipos.has(e.id) ? ' checked' : ''}>
        </label>
      </td>
      <td>
        <div class="nombre-equipo">${esc(e.nombre)}${cant > 1 ? ` <span class="multiplo">×${cant}</span>` : ''}</div>
        <div class="sub-equipo">${esc([e.marca, e.modelo].filter(Boolean).join(' '))}${e.serie ? ' · ' + esc(e.serie) : ''}</div>
      </td>
      <td>${esc(catalogo(CATEGORIAS, e.categoria))}</td>
      <td>${esc(e.ubicacion || '—')}</td>
      <td><span class="pastilla ${esc(e.estado)}">${esc(catalogo(ESTADOS_EQUIPO, e.estado))}</span></td>
      <td class="acciones"><button class="btn-plano" data-editar="${esc(e.id)}">Abrir</button></td>
    </tr>`;
  }).join('');

  $$('[data-editar]', tb).forEach(b => b.addEventListener('click', () => abrirEquipo(b.dataset.editar)));
  $$('[data-sel]', tb).forEach(c => c.addEventListener('change', () => {
    if (c.checked) seleccionEquipos.add(c.dataset.sel); else seleccionEquipos.delete(c.dataset.sel);
    pintarBarraSeleccion();
  }));
  pintarBarraSeleccion();
}

function pintarVuelos() {
  const tb = $('#tablaVuelos tbody');
  const vuelos = (datos.inventario.vuelos || []).slice().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  const hayDrone = (datos.inventario.equipos || []).some(e => e.categoria === 'drone');

  $('#bloqueVuelos').style.display = (hayDrone || vuelos.length) ? '' : 'none';

  if (!vuelos.length) {
    tb.innerHTML = '<tr><td colspan="6"><div class="vacio" style="border:0;background:none">Sin vuelos registrados.</div></td></tr>';
    return;
  }

  tb.innerHTML = vuelos.map(v => `
    <tr>
      <td>${esc(v.fecha)}</td>
      <td>${esc(v.piloto || '—')}</td>
      <td>${esc(v.ubicacion || '—')}</td>
      <td>${esc(v.proposito || '—')}</td>
      <td>${v.duracion_min ? esc(v.duracion_min) + ' min' : '—'}</td>
      <td class="acciones"><button class="btn-plano" data-vuelo="${esc(v.id)}">Abrir</button></td>
    </tr>`).join('');

  $$('[data-vuelo]', tb).forEach(b => b.addEventListener('click', () => abrirVuelo(b.dataset.vuelo)));
}

function refrescarInventario() {
  pintarResumen();
  pintarPrestamos();
  pintarEquipos();
  pintarVuelos();
}

/* ══════════════════════════════════════════════════════════
   LISTAS RÁPIDAS
   Marcas lo que te llevas y CABINA arma la lista: para
   copiarla, imprimirla o sacar todo el lote de una vez.
   ══════════════════════════════════════════════════════════ */

const seleccionEquipos = new Set();

function equiposSeleccionados() {
  return (datos.inventario.equipos || []).filter(e => seleccionEquipos.has(e.id));
}

function pintarBarraSeleccion() {
  const barra = $('#barraSeleccion');
  const sel = equiposSeleccionados();
  barra.hidden = !sel.length;
  if (!sel.length) return;
  const piezas = sel.reduce((s, e) => s + (Number(e.cantidad) || 1), 0);
  $('#cuentaSeleccion').textContent =
    `${sel.length} ${sel.length === 1 ? 'renglón' : 'renglones'} · ${piezas} ${piezas === 1 ? 'pieza' : 'piezas'}`;
}

function textoDeLista(titulo, sel) {
  const porCategoria = {};
  sel.forEach(e => { (porCategoria[e.categoria] = porCategoria[e.categoria] || []).push(e); });

  const lineas = [titulo, '─'.repeat(Math.max(titulo.length, 24)), ''];
  CATEGORIAS.filter(c => porCategoria[c.id]).forEach(c => {
    lineas.push(c.nombre.toUpperCase());
    porCategoria[c.id].forEach(e => {
      const cant = Number(e.cantidad) || 1;
      const detalle = [e.marca, e.modelo].filter(Boolean).join(' ');
      const donde = e.ubicacion ? `  (${e.ubicacion})` : '';
      lineas.push(`  [ ] ${cant > 1 ? cant + '× ' : ''}${e.nombre}${detalle ? ' — ' + detalle : ''}${donde}`);
    });
    lineas.push('');
  });

  const piezas = sel.reduce((s, e) => s + (Number(e.cantidad) || 1), 0);
  lineas.push(`Total: ${piezas} ${piezas === 1 ? 'pieza' : 'piezas'} en ${sel.length} ${sel.length === 1 ? 'renglón' : 'renglones'}`);
  return lineas.join('\n');
}

async function copiarLista() {
  const sel = equiposSeleccionados();
  if (!sel.length) return;
  const titulo = prompt('¿Cómo se llama esta lista?', 'Salida de equipo — ' + fechaLegible(aTexto(new Date())));
  if (titulo === null) return;

  const texto = textoDeLista(titulo || 'Lista de equipo', sel);
  try {
    await navigator.clipboard.writeText(texto);
    avisar('Lista copiada. Pégala donde la necesites.');
  } catch (e) {
    // Si el navegador bloquea el portapapeles, la mostramos para copiar a mano
    prompt('Copia la lista con Ctrl+C:', texto);
  }
}

function prestarSeleccion() {
  const sel = equiposSeleccionados().filter(e => e.estado === 'disponible');
  if (!sel.length) { avisar('Ninguno de los seleccionados está disponible.'); return; }

  const quien = prompt(`Vas a marcar ${sel.length} equipo(s) como prestados.\n\n¿A nombre de quién?`);
  if (!quien || !quien.trim()) return;
  const regreso = prompt('¿Qué día regresan? (AAAA-MM-DD, o déjalo vacío)', aTexto(sumarDias(new Date(), 2)));

  sel.forEach(e => {
    e.estado = 'prestado';
    e.prestamo = { responsable: quien.trim(), salida: aTexto(new Date()), regreso_esperado: regreso || '' };
    e.actualizado = ahora();
  });

  guardar('inventario');
  registrar(`Sacó ${sel.length} equipo${sel.length === 1 ? '' : 's'} a nombre de ${quien.trim()}`);
  seleccionEquipos.clear();
  refrescarInventario();
  refrescarAuditoria();
  avisar(`${sel.length} equipo${sel.length === 1 ? '' : 's'} marcado${sel.length === 1 ? '' : 's'} como prestado${sel.length === 1 ? '' : 's'}.`);
}

/* ── Modal de equipo ───────────────────────────────────── */

function abrirEquipo(idEquipo) {
  const existente = idEquipo ? datos.inventario.equipos.find(e => e.id === idEquipo) : null;
  const e = existente || {
    id: id(), nombre: '', marca: '', modelo: '', serie: '',
    categoria: 'camara', estado: 'disponible', cantidad: 1,
    ubicacion: '', notas: '', prestamo: null,
  };

  modalCtx = { tipo: 'equipo', datos: e, esNuevo: !existente };
  $('#modalTitulo').textContent = existente ? 'Editar equipo' : 'Registrar equipo';
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="grupo-campo">
      <label for="e_nombre">Nombre del equipo</label>
      <input class="campo" id="e_nombre" value="${esc(e.nombre)}" placeholder="Ej. Cámara principal de video">
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="e_marca">Marca</label>
        <input class="campo" id="e_marca" value="${esc(e.marca)}" placeholder="Sony, Canon, DJI…">
      </div>
      <div class="grupo-campo">
        <label for="e_modelo">Modelo</label>
        <input class="campo" id="e_modelo" value="${esc(e.modelo)}" placeholder="A7 III, Mini 4 Pro…">
      </div>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="e_categoria">Categoría</label>
        <select class="campo" id="e_categoria">
          ${CATEGORIAS.map(c => `<option value="${c.id}"${c.id === e.categoria ? ' selected' : ''}>${esc(c.nombre)}</option>`).join('')}
        </select>
      </div>
      <div class="grupo-campo">
        <label for="e_cantidad">Cantidad</label>
        <input class="campo" type="number" min="1" step="1" id="e_cantidad" value="${esc(e.cantidad || 1)}">
        <span class="ayuda">Para lo que tienes repetido: baterías, tarjetas, cables.</span>
      </div>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="e_estado">Estado</label>
        <select class="campo" id="e_estado">
          ${ESTADOS_EQUIPO.map(s => `<option value="${s.id}"${s.id === e.estado ? ' selected' : ''}>${esc(s.nombre)}</option>`).join('')}
        </select>
      </div>
      <div class="grupo-campo">
        <label for="e_ubicacion">Dónde está</label>
        <input class="campo" id="e_ubicacion" value="${esc(e.ubicacion)}" placeholder="Bodega, gaveta 2, mochila chica…">
      </div>
    </div>

    <div class="grupo-campo">
      <label for="e_serie">Seña para identificarlo <span class="opcional">opcional</span></label>
      <input class="campo" id="e_serie" value="${esc(e.serie)}" placeholder="Últimos dígitos de serie, cinta de color, apodo…">
      <span class="ayuda">Sólo si tienes dos iguales y necesitas distinguirlos. El registro patrimonial formal lo lleva Planta Física.</span>
    </div>

    <div id="bloquePrestamoForm" ${e.estado === 'prestado' ? '' : 'hidden'}>
      <div class="fila-campos">
        <div class="grupo-campo">
          <label for="e_presta_quien">Prestado a</label>
          <input class="campo" id="e_presta_quien" value="${esc(e.prestamo ? e.prestamo.responsable : '')}" placeholder="Nombre del responsable">
        </div>
        <div class="grupo-campo">
          <label for="e_presta_regreso">Regresa el</label>
          <input class="campo" type="date" id="e_presta_regreso" value="${esc(e.prestamo ? e.prestamo.regreso_esperado : '')}">
        </div>
      </div>
    </div>

    <div class="grupo-campo">
      <label for="e_notas">Notas</label>
      <textarea class="campo" id="e_notas" placeholder="Accesorios incluidos, detalles, historial de reparación">${esc(e.notas)}</textarea>
    </div>
  `;

  $('#e_estado').addEventListener('change', ev => {
    $('#bloquePrestamoForm').hidden = ev.target.value !== 'prestado';
  });

  mostrarModal();
}

function leerEquipo() {
  const e = modalCtx.datos;
  e.nombre       = $('#e_nombre').value.trim();
  e.marca        = $('#e_marca').value.trim();
  e.modelo       = $('#e_modelo').value.trim();
  e.categoria    = $('#e_categoria').value;
  e.cantidad     = Math.max(1, Number($('#e_cantidad').value) || 1);
  e.serie        = $('#e_serie').value.trim();
  e.ubicacion    = $('#e_ubicacion').value.trim();
  e.notas        = $('#e_notas').value;

  const estadoPrevio = e.estado;
  e.estado = $('#e_estado').value;

  if (!e.nombre) { avisar('El equipo necesita un nombre.'); return false; }

  if (e.estado === 'prestado') {
    e.prestamo = {
      responsable: $('#e_presta_quien').value.trim(),
      salida: (e.prestamo && e.prestamo.salida) || aTexto(new Date()),
      regreso_esperado: $('#e_presta_regreso').value,
    };
  } else if (estadoPrevio === 'prestado' && e.prestamo) {
    datos.inventario.prestamos_historial = datos.inventario.prestamos_historial || [];
    datos.inventario.prestamos_historial.push(Object.assign({ equipo_id: e.id, equipo: e.nombre, devuelto: aTexto(new Date()) }, e.prestamo));
    e.prestamo = null;
  }

  e.actualizado = ahora();
  if (modalCtx.esNuevo) {
    e.creado = ahora();
    datos.inventario.equipos.push(e);
  }
  guardar('inventario');
  return true;
}

/* ── Modal de vuelo ────────────────────────────────────── */

function abrirVuelo(idVuelo) {
  const existente = idVuelo ? (datos.inventario.vuelos || []).find(v => v.id === idVuelo) : null;
  const v = existente || {
    id: id(), fecha: aTexto(new Date()), piloto: '', ubicacion: '',
    proposito: '', duracion_min: '', permiso: '', incidencias: '',
  };

  modalCtx = { tipo: 'vuelo', datos: v, esNuevo: !existente };
  $('#modalTitulo').textContent = existente ? 'Editar vuelo' : 'Registrar vuelo';
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="v_fecha">Fecha</label>
        <input class="campo" type="date" id="v_fecha" value="${esc(v.fecha)}">
      </div>
      <div class="grupo-campo">
        <label for="v_piloto">Piloto</label>
        <input class="campo" id="v_piloto" value="${esc(v.piloto)}" placeholder="Quién operó">
      </div>
    </div>
    <div class="grupo-campo">
      <label for="v_ubicacion">Ubicación del vuelo</label>
      <input class="campo" id="v_ubicacion" value="${esc(v.ubicacion)}" placeholder="Campus, explanada, coordenadas…">
    </div>
    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="v_proposito">Propósito</label>
        <input class="campo" id="v_proposito" value="${esc(v.proposito)}" placeholder="Tomas para spot institucional">
      </div>
      <div class="grupo-campo">
        <label for="v_duracion">Duración (minutos)</label>
        <input class="campo" type="number" min="0" id="v_duracion" value="${esc(v.duracion_min)}">
      </div>
    </div>
    <div class="grupo-campo">
      <label for="v_permiso">Permiso o autorización</label>
      <input class="campo" id="v_permiso" value="${esc(v.permiso)}" placeholder="Folio AFAC, autorización interna, zona autorizada">
      <span class="ayuda">Deja constancia de bajo qué permiso se voló. Es lo que te respalda si alguien pregunta.</span>
    </div>
    <div class="grupo-campo">
      <label for="v_incidencias">Incidencias</label>
      <textarea class="campo" id="v_incidencias" placeholder="Sin novedad, o describe lo ocurrido">${esc(v.incidencias)}</textarea>
    </div>
  `;
  mostrarModal();
}

function leerVuelo() {
  const v = modalCtx.datos;
  v.fecha        = $('#v_fecha').value;
  v.piloto       = $('#v_piloto').value.trim();
  v.ubicacion    = $('#v_ubicacion').value.trim();
  v.proposito    = $('#v_proposito').value.trim();
  v.duracion_min = $('#v_duracion').value;
  v.permiso      = $('#v_permiso').value.trim();
  v.incidencias  = $('#v_incidencias').value;

  if (!v.fecha) { avisar('El vuelo necesita fecha.'); return false; }

  datos.inventario.vuelos = datos.inventario.vuelos || [];
  if (modalCtx.esNuevo) datos.inventario.vuelos.push(v);
  guardar('inventario');
  return true;
}

/* ── Modal: control común ──────────────────────────────── */

function mostrarModal() {
  $('#modalFondo').hidden = false;
  // Huella de los campos al abrir: sirve para saber si hay trabajo sin guardar.
  if (modalCtx) modalCtx.huella = huellaFormulario();
}

/* Concatena el valor de todos los campos del modal. Comparando esta cadena
   contra la del momento de abrir sabemos si el usuario escribió algo. */
function huellaFormulario() {
  return $$('#modalCuerpo input, #modalCuerpo textarea, #modalCuerpo select')
    .map(el => el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value)
    .join('');
}

function hayCambiosSinGuardar() {
  if (!modalCtx || modalCtx.huella === undefined) return false;
  return huellaFormulario() !== modalCtx.huella;
}

/* Cierre "suave": el que dispara un clic fuera o Escape. Si hay captura sin
   guardar, pide confirmación en vez de tirar el trabajo. */
function intentarCerrarModal() {
  if (hayCambiosSinGuardar()) {
    if (!confirm('Tienes cambios sin guardar en esta ficha.\n\n¿Descartarlos?')) return;
  }
  cerrarModal();
}

function cerrarModal() {
  $('#modalFondo').hidden = true;
  modalCtx = null;
}

function guardarModal() {
  if (!modalCtx) return;
  const { tipo, esNuevo, datos: d } = modalCtx;
  let ok = false;
  if (tipo === 'pieza')   ok = leerPieza();
  if (tipo === 'equipo')  ok = leerEquipo();
  if (tipo === 'vuelo')   ok = leerVuelo();
  if (tipo === 'experto') ok = leerExperto();
  if (tipo === 'tema')    ok = leerTema();
  if (!ok) return;

  const nombre = d.titulo || d.nombre || 'registro de vuelo';
  registrar(`${esNuevo ? 'Creó' : 'Editó'} «${nombre}»`);

  const eraNota = tipo === 'pieza' && esNuevo && d.formato === 'Nota';
  cerrarModal();
  refrescarParrilla();
  refrescarInventario();
  refrescarExpertos();
  pintarRedaccion();
  refrescarAuditoria();

  if (eraNota) ofrecerDerivados(d);
}

/* ── Cadena de contenido ───────────────────────────────────
   Una nota no es una publicación: es la pieza madre de varias.
   Al guardar una, CABINA ofrece crear sus derivados de un jalón. */
function ofrecerDerivados(nota) {
  const derivados = [
    { formato: 'Reel',  canales: ['ig', 'yt'], dias: 1, que: 'el experto dice la idea clave en 30 segundos' },
    { formato: 'Texto', canales: ['fb'],       dias: 0, que: 'post con la frase citable y liga a la nota' },
  ];

  const resumen = derivados.map(d =>
    `· ${d.formato} — ${d.que} (${d.dias === 0 ? 'mismo día' : '+' + d.dias + ' día'})`).join('\n');

  if (!confirm(`Guardaste una nota. De aquí salen normalmente estas piezas:\n\n${resumen}\n\n¿Las creo ya, ligadas a la nota?`)) return;

  derivados.forEach(d => {
    const f = aTexto(sumarDias(aFecha(nota.fecha), d.dias));
    datos.parrilla.piezas.push({
      id: id(),
      titulo: `${d.formato === 'Reel' ? 'Reel' : 'Post FB'} — ${nota.titulo}`,
      pilar: nota.pilar, canales: d.canales, formato: d.formato,
      fecha: f, responsable: nota.responsable, estado: 'idea', copy: '',
      notas: `Deriva de la nota «${nota.titulo}».`,
      produccion: guiaDeProduccion(d.formato, nota.pilar).map(x => '· ' + x).join('\n'),
      imagen: '', no_antes: nota.fecha, no_despues: '',
      experto: nota.experto || '', origen: nota.id,
      creado: ahora(), actualizado: ahora(),
    });
  });

  guardar('parrilla');
  registrar(`Creó ${derivados.length} derivados de la nota`);
  refrescarParrilla();
  refrescarAuditoria();
  avisar(`${derivados.length} piezas creadas a partir de la nota.`);
}

function eliminarModal() {
  if (!modalCtx || modalCtx.esNuevo) return;
  const t = modalCtx.tipo;
  const nombre = t === 'pieza' ? 'esta pieza' : t === 'equipo' ? 'este equipo'
               : t === 'experto' ? 'a este experto del directorio' : 'este registro de vuelo';
  if (!confirm('¿Eliminar ' + nombre + '? No se puede deshacer.')) return;

  const idBorrar = modalCtx.datos.id;
  const nombreBorrado = modalCtx.datos.titulo || modalCtx.datos.nombre || 'registro de vuelo';
  if (t === 'pieza') {
    datos.parrilla.piezas = datos.parrilla.piezas.filter(x => x.id !== idBorrar);
    guardar('parrilla');
  } else if (t === 'equipo') {
    datos.inventario.equipos = datos.inventario.equipos.filter(x => x.id !== idBorrar);
    guardar('inventario');
  } else if (t === 'experto') {
    datos.expertos.personas = datos.expertos.personas.filter(x => x.id !== idBorrar);
    guardar('expertos');
  } else if (t === 'tema') {
    datos.redaccion.temas = datos.redaccion.temas.filter(x => x.id !== idBorrar);
    guardar('redaccion');
  } else {
    datos.inventario.vuelos = (datos.inventario.vuelos || []).filter(x => x.id !== idBorrar);
    guardar('inventario');
  }

  registrar(`Eliminó «${nombreBorrado}»`);
  cerrarModal();
  refrescarParrilla();
  refrescarInventario();
  refrescarExpertos();
  pintarRedaccion();
  refrescarAuditoria();
  avisar('Eliminado. Puedes deshacerlo con Ctrl+Z.');
}

/* ── Arranque ──────────────────────────────────────────── */

function llenarSelectores() {
  $('#filtroPilar').insertAdjacentHTML('beforeend',
    PILARES.map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join(''));
  $('#filtroCanal').insertAdjacentHTML('beforeend',
    CANALES.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join(''));
  $('#filtroEstado').insertAdjacentHTML('beforeend',
    ESTADOS.map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join(''));
  $('#filtroCategoria').insertAdjacentHTML('beforeend',
    CATEGORIAS.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join(''));
  $('#filtroEstadoEquipo').insertAdjacentHTML('beforeend',
    ESTADOS_EQUIPO.map(s => `<option value="${s.id}">${esc(s.nombre)}</option>`).join(''));
}

function conectarEventos() {
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('activo'));
    t.classList.add('activo');
    vistaActual = t.dataset.vista;
    $$('.vista').forEach(v => v.classList.remove('activo'));
    $('#vista-' + vistaActual).classList.add('activo');
    if (vistaActual === 'auditoria') refrescarAuditoria();
    if (vistaActual === 'expertos') pintarExpertos();
    if (vistaActual === 'redaccion') pintarRedaccion();
  }));

  $('#nuevoTema').addEventListener('click', () => abrirTema(null));
  $('#nuevaNota').addEventListener('click', () => {
    abrirPieza(null, {
      pilar: 'academia', formato: 'Nota', canales: ['web', 'fb', 'li'],
      estado: 'brief', estado_nota: 'encargada',
      produccion: guiaDeProduccion('Nota', 'academia').map(x => '· ' + x).join('\n'),
    });
  });

  $('#nuevoExperto').addEventListener('click', () => abrirExperto(null));
  $('#buscarExperto').addEventListener('input', pintarExpertos);
  $('#filtroDisponibilidad').addEventListener('change', pintarExpertos);

  $('#semanaAnterior').addEventListener('click', () => { anclaSemana = sumarDias(anclaSemana, -7); refrescarParrilla(); });
  $('#semanaSiguiente').addEventListener('click', () => { anclaSemana = sumarDias(anclaSemana, 7); refrescarParrilla(); });
  $('#semanaHoy').addEventListener('click', () => { anclaSemana = inicioSemana(new Date()); refrescarParrilla(); });

  ['#filtroPilar', '#filtroCanal', '#filtroEstado', '#filtroTodasSemanas'].forEach(s =>
    $(s).addEventListener('change', () => { pintarPiezas(); pintarCalendario(); }));

  $$('.conmutador-op').forEach(b => b.addEventListener('click', () => {
    modoParrilla = b.dataset.modo;
    aplicarModoParrilla();
  }));

  $('#mesAnterior').addEventListener('click', () => {
    anclaMes = new Date(anclaMes.getFullYear(), anclaMes.getMonth() - 1, 1); pintarCalendario();
  });
  $('#mesSiguiente').addEventListener('click', () => {
    anclaMes = new Date(anclaMes.getFullYear(), anclaMes.getMonth() + 1, 1); pintarCalendario();
  });
  $('#mesHoy').addEventListener('click', () => { anclaMes = new Date(); pintarCalendario(); });

  $('#ideaClasificada').addEventListener('click', capturarIdeaClasificada);
  $('#acomodarPendientes').addEventListener('click', acomodarPendientes);
  $('#periodoAuditoria').addEventListener('change', refrescarAuditoria);
  $('#recalcular').addEventListener('click', () => { refrescarAuditoria(); avisar('Diagnóstico actualizado.'); });

  ['#filtroCategoria', '#filtroEstadoEquipo'].forEach(s => $(s).addEventListener('change', pintarEquipos));
  $('#buscarEquipo').addEventListener('input', pintarEquipos);

  $('#marcarTodos').addEventListener('change', ev => {
    equiposFiltrados().forEach(e => {
      if (ev.target.checked) seleccionEquipos.add(e.id); else seleccionEquipos.delete(e.id);
    });
    pintarEquipos();
  });
  $('#copiarLista').addEventListener('click', copiarLista);
  $('#prestarSeleccion').addEventListener('click', prestarSeleccion);
  $('#limpiarSeleccion').addEventListener('click', () => {
    seleccionEquipos.clear();
    $('#marcarTodos').checked = false;
    pintarEquipos();
  });

  $('#nuevaPieza').addEventListener('click', () => abrirPieza(null));
  $('#nuevoEquipo').addEventListener('click', () => abrirEquipo(null));
  $('#nuevoVuelo').addEventListener('click', () => abrirVuelo(null));

  $('#nuevaIdea').addEventListener('click', () => {
    const texto = prompt('¿Qué idea quieres guardar?');
    if (!texto || !texto.trim()) return;
    datos.parrilla.ideas = datos.parrilla.ideas || [];
    datos.parrilla.ideas.push({ id: id(), texto: texto.trim(), creado: ahora() });
    guardar('parrilla');
    registrar('Agregó una idea al banco');
    pintarIdeas();
  });

  $('#modalGuardar').addEventListener('click', guardarModal);
  $('#modalCancelar').addEventListener('click', intentarCerrarModal);
  $('#modalCerrar').addEventListener('click', intentarCerrarModal);
  $('#modalEliminar').addEventListener('click', eliminarModal);

  /* Cerrar al hacer clic fuera, sin perder trabajo:
     si arrastras desde dentro de un campo y sueltas sobre el fondo, el
     navegador reporta un clic en el fondo. Exigimos que el gesto haya
     EMPEZADO y TERMINADO en el fondo para tomarlo como "cerrar". */
  let origenGesto = null;
  $('#modalFondo').addEventListener('mousedown', ev => { origenGesto = ev.target; });
  $('#modalFondo').addEventListener('click', ev => {
    const empezoFuera = origenGesto && origenGesto.id === 'modalFondo';
    origenGesto = null;
    if (ev.target.id === 'modalFondo' && empezoFuera) intentarCerrarModal();
  });

  $('#btnDeshacer').addEventListener('click', deshacer);
  $('#btnRehacer').addEventListener('click', rehacer);
  $('#btnHistorial').addEventListener('click', () => alternarPanelHistorial());
  $('#cerrarHistorial').addEventListener('click', () => alternarPanelHistorial(false));
  $('#btnTema').addEventListener('click', () =>
    aplicarTema(document.documentElement.dataset.tema === 'oscuro' ? 'claro' : 'oscuro'));

  // Clic fuera del panel de historial lo cierra
  document.addEventListener('click', ev => {
    const panel = $('#panelHistorial');
    if (panel.hidden) return;
    if (panel.contains(ev.target) || $('#btnHistorial').contains(ev.target)) return;
    alternarPanelHistorial(false);
  });

  document.addEventListener('keydown', ev => {
    const modalAbierto = !$('#modalFondo').hidden;

    if (ev.key === 'Escape') {
      if (modalAbierto) { intentarCerrarModal(); return; }
      if (!$('#panelHistorial').hidden) { alternarPanelHistorial(false); return; }
    }
    if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && modalAbierto) { guardarModal(); return; }

    // Deshacer / rehacer. No secuestramos el atajo dentro de un campo de texto
    // ni con el modal abierto: ahí Ctrl+Z debe deshacer lo que estás escribiendo.
    if (!(ev.ctrlKey || ev.metaKey) || modalAbierto) return;
    const escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (escribiendo) return;

    const k = ev.key.toLowerCase();
    if (k === 'z' && !ev.shiftKey) { ev.preventDefault(); deshacer(); }
    else if (k === 'y' || (k === 'z' && ev.shiftKey)) { ev.preventDefault(); rehacer(); }
  });
}

(async function iniciar() {
  iniciarTema();
  llenarSelectores();
  conectarEventos();
  await cargar();
  registrar('Estado al abrir CABINA');
  aplicarModoParrilla();
  refrescarParrilla();
  refrescarInventario();
  refrescarExpertos();
  pintarRedaccion();
})();
