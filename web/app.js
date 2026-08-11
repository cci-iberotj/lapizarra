/* ═══════════════════════════════════════════════════════════
   LA PIZARRA · Departamento de Diseño y Medios · IBERO Tijuana
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Catálogos ─────────────────────────────────────────── */

/* Cada pilar trae DOS colores porque hacen dos trabajos distintos:
   `solido` va de relleno con texto encima, `color` va de tinta sobre
   una superficie. Usar el mismo tono para ambos era justo lo que
   dejaba los chips en 4.14:1 — un tono no puede tener a la vez
   suficiente contraste contra el blanco y contra el negro. */
const PILARES = [
  { id: 'vida',     nombre: 'Vida IBERO',    color: 'var(--pilar-vida-tinta)',     solido: 'var(--pilar-vida-solido)',     carril: 'casual',        meta: 30 },
  { id: 'academia', nombre: 'Academia IBERO',color: 'var(--pilar-academia-tinta)', solido: 'var(--pilar-academia-solido)', carril: 'institucional', meta: 20 },
  { id: 'se_ibero', nombre: 'Sé IBERO',      color: 'var(--pilar-se-tinta)',       solido: 'var(--pilar-se-solido)',       carril: 'institucional', meta: 18 },
  { id: 'orgullo',  nombre: 'Orgullo IBERO', color: 'var(--pilar-orgullo-tinta)',  solido: 'var(--pilar-orgullo-solido)',  carril: 'institucional', meta: 12 },
  { id: 'cultura',  nombre: 'Cultura Viva',  color: 'var(--pilar-cultura-tinta)',  solido: 'var(--pilar-cultura-solido)',  carril: 'hibrido',       meta: 10 },
  { id: 'voz',      nombre: 'Voz IBERO',     color: 'var(--pilar-voz-tinta)',      solido: 'var(--pilar-voz-solido)',      carril: 'institucional', meta: 10 },
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

/* ── Qué pide cada formato ─────────────────────────────────
   FORMATOS era una lista de palabras: el formulario nunca supo qué
   significaba ninguna. Daba igual elegir Carrusel o Nota — pedía lo
   mismo, incluida UNA imagen provisional para un carrusel, que no
   tiene ningún sentido.

   Esta tabla manda sobre el bloque de arte, sobre qué campos salen
   y sobre qué se le dice a quien produce. Un formato nuevo es un
   renglón, no una cacería por el archivo.

   'quiere' dice qué material espera:
     laminas → varias imágenes en orden
     imagen  → una sola
     video   → un archivo de video
     ninguno → no lleva arte

   La clave sigue siendo el nombre en texto, como estaba guardado
   desde antes: nada de lo ya capturado se rompe. */
const FORMATOS_INFO = {
  Carrusel: {
    icono: '▤', quiere: 'laminas', minimo: 2, copyFb: true,
    arte: 'Las láminas del carrusel',
    espec: '1080×1350 (4:5) o 1080×1080. De 2 a 20 láminas.',
    ayuda: 'El orden importa: la primera es la que detiene el pulgar.',
    canales: ['ig', 'fb'],
  },
  Foto: {
    icono: '▣', quiere: 'imagen', copyFb: true,
    arte: 'La foto',
    espec: '1080×1350 (4:5) para que ocupe lo más posible del feed.',
    canales: ['ig', 'fb'],
  },
  Reel: {
    icono: '▶', quiere: 'video', copyFb: true, experto: true,
    arte: 'El reel',
    espec: '1080×1920 vertical, MP4 con H.264, hasta 90 s y 50 MB.',
    canales: ['ig', 'fb', 'yt'],
  },
  Short: {
    icono: '▶', quiere: 'video', experto: true,
    arte: 'El short',
    espec: '1080×1920 vertical, hasta 60 s.',
    canales: ['yt'],
  },
  Story: {
    icono: '▢', quiere: 'imagen',
    arte: 'La historia',
    espec: '1080×1920 vertical. Dura 24 horas.',
    canales: ['ig'],
  },
  Video: {
    icono: '▬', quiere: 'video', copyFb: true, experto: true,
    arte: 'El video',
    espec: '1920×1080 horizontal, MP4 con H.264.',
    canales: ['fb', 'yt'],
  },
  Nota: {
    icono: '▤', quiere: 'imagen', experto: true, cuerpo: true,
    arte: 'La imagen de cabecera',
    espec: '1600 px de ancho o más, horizontal.',
    ayuda: 'La nota se escribe en Redacción; aquí va la imagen que la encabeza.',
    canales: ['web'],
  },
  Texto: {
    icono: '▭', quiere: 'ninguno', copyFb: true,
    arte: '', espec: '',
    canales: ['fb', 'li'],
  },
};

function infoFormato(f) {
  return FORMATOS_INFO[f] || FORMATOS_INFO.Foto;
}

// El color acompaña la progresión del flujo: gris → ámbar → azul → verde.
const ESTADOS = [
  { id: 'idea',       nombre: 'Idea',               color: 'var(--estado-idea)' },
  { id: 'brief',      nombre: 'Brief',              color: 'var(--estado-brief)' },
  { id: 'produccion', nombre: 'Producción',         color: 'var(--estado-produccion)' },
  { id: 'revision',   nombre: 'Revisión Leo',       color: 'var(--estado-revision)' },
  { id: 'vobo',       nombre: 'VoBo institucional', color: 'var(--estado-vobo)' },
  { id: 'programado', nombre: 'Programado',         color: 'var(--estado-programado)' },
  { id: 'publicado',  nombre: 'Publicado',          color: 'var(--estado-publicado)' },
];

/* Lo que ya esta resuelto se pinta LLENO; lo que sigue en camino
   se queda en blanco. Asi el calendario se lee de un vistazo: el
   color es trabajo cerrado, el blanco es trabajo pendiente. */
const LISTO_PARA_SALIR = ['programado', 'publicado'];

/* La aprobacion tiene que verse SIN abrir la pieza. Si hay que
   entrar a cada una para saber cuales van, la revision no ocurre:
   nadie abre veinte fichas para buscar las que faltan. */
/* Una pieza armada para salir sola se ve distinta en la parrilla:
   si no, la unica forma de saber cuales van a dispararse es abrirlas
   una por una. */
function marcaProgramada(p) {
  return p.autopublicar && !porQueNoSaldraSola(p) ? ' programada' : '';
}

function marcaAprobacion(p) {
  const e = estadoRevision(p).estado;
  return e === 'aprobado' ? ' aprobada'
       : e === 'cambios'  ? ' con-cambios'
       : e === 'revisar'  ? ' por-revisar' : '';
}

/* ── Etiquetas ─────────────────────────────────────────────
   Una tarjeta tiene que contestar dos cosas sin que la abras: QUÉ
   es —un evento del mundo o una pieza nuestra— y SI todavía
   depende de que alguien la mueva.

   La forma lleva el segundo dato: SÓLIDA es trabajo cerrado o algo
   que va a ocurrir sin que nadie intervenga; CONTORNO es que falta
   una mano. Es la misma regla con la que el calendario ya rellenaba
   las tarjetas (ver LISTO_PARA_SALIR), ahora dicha con palabras.

   No hace falta ningún color nuevo: los --estado-* ya existen y ya
   están medidos contra los dos temas. */
const ETIQUETAS = {
  idea:       { texto: 'Idea',        tono: 'var(--estado-idea)',       ayuda: 'Anotada, sin trabajar todavía' },
  brief:      { texto: 'Brief',       tono: 'var(--estado-brief)',      ayuda: 'Ya se sabe qué lleva' },
  produccion: { texto: 'Produciendo', tono: 'var(--estado-produccion)', ayuda: 'En manos de diseño' },
  revision:   { texto: 'Por revisar', tono: 'var(--estado-revision)',   ayuda: 'Esperando revisión de Leo' },
  vobo:       { texto: 'Por aprobar', tono: 'var(--estado-vobo)',       ayuda: 'Esperando el visto bueno institucional' },
  publicado:  { texto: 'Publicado',   tono: 'var(--estado-publicado)',  ayuda: 'Ya salió', solida: true },
};

function etiquetaPieza(p) {
  if (p.estado === 'programado') {
    /* Ésta es la distinción que importa y la que no se veía: una
       cosa es estar listo y otra que se vaya a disparar solo. Sin
       esto hay que abrir la pieza para saber si alguien tiene que
       apretar el botón. */
    const impedimento = porQueNoSaldraSola(p);
    return p.autopublicar && !impedimento
      ? { texto: 'Programado', tono: 'var(--estado-programado)', solida: true,
          icono: '⏱', ayuda: 'Sale sola a su hora, sin que nadie la toque' }
      : { texto: 'Listo', tono: 'var(--estado-programado)',
          ayuda: impedimento || 'Listo, pero alguien tiene que publicarlo a mano' };
  }
  return ETIQUETAS[p.estado] || ETIQUETAS.idea;
}

/* El icono dice QUE es --evento, reunión, entrega, bloqueo-- y la
   palabra dice en que estado va. Dos datos en una sola pastilla. */
function etiquetaEvento(e) {
  const t = tipoDe(e), s = estadoDe(e);
  return {
    texto: s.nombre, tono: s.tono, icono: t.icono, solida: !!s.solida,
    ayuda: t.nombre + ' · ' + s.nota.charAt(0).toLowerCase() + s.nota.slice(1),
  };
}

function selloEstado(et) {
  if (!et) return '';
  return `<span class="sello${et.solida ? ' solido' : ''}" style="--sello-tono:${et.tono}"` +
         `${et.ayuda ? ` title="${esc(et.ayuda)}"` : ''}>` +
         `${et.icono ? `<span class="sello-icono" aria-hidden="true">${et.icono}</span>` : ''}` +
         `${esc(et.texto)}</span>`;
}

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
  parrilla: { piezas: [], ideas: [], eventos: [] },
  inventario: { equipos: [], vuelos: [] },
  expertos: { personas: [] },
  redaccion: { temas: [], equipo: {} },
  entregas: { lista: [] },
};
let anclaSemana = inicioSemana(new Date());
let anclaMes = new Date();
let vistaActual = 'parrilla';
// El calendario es la vista principal: dice de un vistazo como va
// la semana. La lista sirve para trabajar una pieza, no para ver.
let modoParrilla = 'calendario';   // 'calendario' | 'lista'
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

/* Los 24 lugares que llaman guardar('parrilla') no saben si atrás
   hay un archivo, tu servidor o la nube. Sólo estas dos funciones
   lo saben, y le preguntan al Almacén. */

async function cargar() {
  try {
    await Almacen.cargar(datos);
    // Cada colección necesita su forma completa aunque venga vacía:
    // el resto del código da por hecho que las listas existen.
    datos.parrilla   = Object.assign({ piezas: [], ideas: [], eventos: [] }, datos.parrilla);
    datos.inventario = Object.assign({ equipos: [], vuelos: [], prestamos_historial: [] }, datos.inventario);
    datos.expertos   = Object.assign({ personas: [] }, datos.expertos);
    datos.redaccion  = Object.assign({ temas: [], equipo: {} }, datos.redaccion);
  } catch (e) {
    if (e instanceof SinSesion) { await salirDeVerdad(); return; }
    avisar(Almacen.enLaNube
      ? 'No se pudieron cargar los datos. Revisa tu conexión.'
      : 'No se pudieron cargar los datos. ¿Está corriendo el servidor?');
  }
}

/* OJO: hay que BORRAR la llave al terminar, no sólo llamar a
   clearTimeout. El identificador del temporizador es un número y
   se queda ahí aunque ya haya corrido, así que cualquiera que
   pregunte "¿hay algo guardándose?" leería que sí para siempre.
   Eso apagaba la sincronización: al primer guardado dejabas de
   ver el trabajo de los demás y nada lo avisaba. */
const guardarPendiente = {};
let contadorGuardado = 0;

/* Colecciones cuyo último guardado falló. Mientras haya algo aquí,
   hay trabajo que sólo existe en esta pantalla. */
const sinGuardar = new Set();

function hayGuardadoEnVuelo() {
  return Object.keys(guardarPendiente).length > 0;
}

/* Reintento con espera creciente: 5s, 10s, 20s, 40s, tope 60s. Si
   se cayó el internet no sirve golpear cada segundo, y si volvió no
   hay que esperar a que toques algo para recuperar el trabajo. */
let esperaReintento = 5000;
let relojReintento = null;

function programarReintento() {
  if (relojReintento || !sinGuardar.size) return;
  relojReintento = setTimeout(() => {
    relojReintento = null;
    const pendientes = [...sinGuardar];
    if (!pendientes.length) { esperaReintento = 5000; return; }
    esperaReintento = Math.min(esperaReintento * 2, 60_000);
    pendientes.forEach(guardar);
  }, esperaReintento);
}

/* Última red antes de perder el trabajo. El navegador sólo permite
   un aviso genérico; el texto exacto lo decide él. */
window.addEventListener('beforeunload', ev => {
  // Antes solo miraba los guardados que YA fallaron. El caso
  // frecuente -- copy escrito a mano, sin pulsar Guardar -- no
  // estaba cubierto, y la funcion que lo detecta ya existia.
  const fichaLlena = typeof hayCambiosSinGuardar === 'function'
    && !$('#modalFondo').hidden && hayCambiosSinGuardar();
  if (!sinGuardar.size && !fichaLlena && !hayGuardadoEnVuelo()) return;
  ev.preventDefault();
  ev.returnValue = '';
});

function guardar(coleccion) {
  const enCurso = guardarPendiente[coleccion];
  if (enCurso) clearTimeout(enCurso.reloj);

  marcarGuardado('Guardando…');
  const turno = ++contadorGuardado;

  const reloj = setTimeout(async () => {
    try {
      const { tocados } = await Almacen.guardar(coleccion, datos);
      sinGuardar.delete(coleccion);
      if (!sinGuardar.size) esperaReintento = 5000;   // se recupera la red
      const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      marcarGuardado(tocados ? 'Guardado ' + hora : 'Sin cambios');
    } catch (e) {
      // Se anota para que cerrar la pestaña avise, y para reintentar
      // solo: sin esto el trabajo se queda esperando a que hagas otro
      // cambio cualquiera, y si cierras antes se pierde.
      if (!(e instanceof SinPermiso)) { sinGuardar.add(coleccion); programarReintento(); }
      marcarGuardado('No se pudo guardar');
      if (e instanceof SinSesion) {
        avisar('Tu sesión expiró. Vuelve a entrar.');
        await salirDeVerdad();
      } else if (e instanceof SinPermiso) {
        // La base rechazó el cambio. Recargamos para que la pantalla
        // no siga mostrando algo que en realidad no se guardó.
        avisar('Tu rol no puede modificar esto. Se deshizo el cambio.');
        await cargar();
        refrescarTodo();
      } else {
        avisar(Almacen.enLaNube
          ? 'Error al guardar. Revisa tu conexión; el cambio sigue en pantalla.'
          : 'Error al guardar. Revisa que el servidor siga abierto.');
      }
    } finally {
      // Se suelta al final, no al empezar: hasta aquí sigue habiendo
      // escritura en vuelo y la sincronización no debe entrar a
      // mezclar en medio.
      // El turno evita que un guardado lento borre la marca de otro
      // más nuevo que ya arrancó: sólo se limpia si sigue siendo el
      // que le toca.
      if (guardarPendiente[coleccion] &&
          guardarPendiente[coleccion].turno === turno) {
        delete guardarPendiente[coleccion];
      }
    }
  }, 500);

  guardarPendiente[coleccion] = { reloj, turno };
}

/* Repintar todo. Se usa cuando el estado cambió por debajo:
   al deshacer un rechazo o al traer trabajo de los demás. */
/* Creacion no es del area: le sobra casi toda la aplicacion. Se
   deja el calendario --para saber cuando sale lo suyo-- y su
   bandeja. Esto es cosmetico y lo se: quien de verdad cierra la
   puerta es puede_leer() en Postgres, que ni siquiera manda los
   datos de las demas secciones. Esconder la pestaña sin eso no
   habria cerrado nada. */
const VISTAS_DE_CREACION = ['parrilla', 'entregas'];

function recortarParaCreacion() {
  const recortar = soyCreacion();
  $$('.tab').forEach(t => {
    const v = t.dataset.vista;
    if (!v) return;
    // Ajustes es de quien administra. Se decide con rolUI y no con
    // el usuario real: si no, al ponerse en la piel de otro seguia
    // viendose y la simulacion mentia.
    const fuera = (recortar && !VISTAS_DE_CREACION.includes(v))
               || (v === 'ajustes' && rolUI() !== 'admin');
    t.hidden = fuera;
    if (fuera && t.classList.contains('activo')) {
      $(`.tab[data-vista="${recortar ? 'entregas' : 'parrilla'}"]`).click();
    }
  });

  /* Para quien crea, la aplicación ES su bandeja: el calendario lo
     mira de vez en cuando, pero llega aquí a mandar algo. Sólo la
     primera vez -- después manda lo que el usuario haya picado. */
  if (recortar && !recortarParaCreacion.yaAterrizo) {
    recortarParaCreacion.yaAterrizo = true;
    const t = $('.tab[data-vista="entregas"]');
    if (t && !t.classList.contains('activo')) t.click();
  }
  if (!recortar) recortarParaCreacion.yaAterrizo = false;
  // Los carriles laterales de la parrilla son de trabajo interno:
  // el banco de ideas y las efemerides no le sirven a quien entrega.
  const carriles = $('#carriles');
  if (carriles) carriles.classList.toggle('sin-rieles', recortar);
  document.body.classList.toggle('solo-creacion', recortar);
}

function refrescarTodo() {
  aplicarModoParrilla();
  refrescarParrilla();
  refrescarInventario();
  refrescarExpertos();
  pintarRedaccion();
  pintarEscritorio();
  pintarEntregas();
  aplicarPermisos();
  recortarParaCreacion();
  const cajaPiel = $('#verComoCaja');
  if (cajaPiel) cajaPiel.hidden = !(Almacen.usuario && Almacen.usuario.rol === 'admin');
  pintarContadorAvisos();
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
  try { localStorage.setItem('la-pizarra-tema', tema); } catch (e) { /* modo privado */ }
  const b = $('#btnTema');
  if (b) {
    b.textContent = tema === 'oscuro' ? '☀' : '◐';
    b.title = tema === 'oscuro' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  }
}

function iniciarTema() {
  let guardado = null;
  try { guardado = localStorage.getItem('la-pizarra-tema'); } catch (e) { /* modo privado */ }
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
        <div class="pieza${LISTO_PARA_SALIR.includes(p.estado) ? ' lista' : ''}${p.estado === 'publicado' ? ' publicada' : ''}${marcaAprobacion(p)}" data-id="${esc(p.id)}" style="--pieza-tono:${pil ? pil.solido : 'var(--linea-control)'}">
          ${collageDe(p, 3)}
          <div class="pieza-cuerpo">
            <div class="pieza-titulo">${esc(p.titulo || 'Sin título')}</div>
            <div class="pieza-meta">
              ${p.formato ? `<span>${esc(p.formato)}</span>` : ''}
              ${p.responsable ? `<span>· ${esc(p.responsable)}</span>` : ''}
            </div>
          </div>
          <div class="pieza-meta">
            ${selloEstado(etiquetaPieza(p))}
            ${canales}
            ${pil ? `<span class="chip chip-pilar" style="background:${pil.solido || pil.color}">${esc(pil.nombre)}</span>` : ''}
          </div>
        </div>`;
    }).join('');

    return `<div class="dia-grupo">
      <div class="dia-titulo"><b>${esc(fechaLegible(fecha))}</b><span>${grupos[fecha].length} pieza${grupos[fecha].length > 1 ? 's' : ''}</span></div>
      <div class="tablero">${items}</div>
    </div>`;
  }).join('');

  $$('.pieza', cont).forEach(el => {
    el.addEventListener('click', () => abrirPrevia(el.dataset.id));
  });
  pintarMiniaturas(cont);
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
    // Al reescribir el HTML se pierden los oyentes de arrastre, y
    // filtrar es justo lo que se hace ANTES de arrastrar.
    conectarArrastreDeIdeas();
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
    <article class="idea" data-idea="${esc(i.id)}"${puedeProgramar() ? ' draggable="true"' : ''} style="--tono:${pil.color};--idea-tono:${pil.solido}">
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
      conectarArrastreDeIdeas();
      // Era el unico borrado del producto que no decia nada, y esta
      // a 30px del boton de programar.
      avisar('Idea borrada. Ctrl+Z la devuelve.');
    } else {
      // La idea NO se retira aquí. Antes se borraba al abrir el modal y el
      // comentario prometía un paso de historial que nunca se creaba: si
      // cancelabas, la idea quedaba borrada en memoria, la tarjeta se
      // quedaba de fantasma en pantalla, y el siguiente guardado cualquiera
      // persistía el borrado sin que nada lo relacionara con lo que hiciste.
      // Se retira hasta que la pieza se guarda de verdad — ver guardarModal.
      const s = clasificarTexto(idea.texto);
      abrirPieza(null, {
        vieneDeIdea: idea.id,
        // 'brief' y no 'idea': Mi escritorio excluye las que siguen
        // siendo idea, asi que programarlas y no verlas ahi era
        // exactamente lo contrario de lo que se espera.
        estado: 'brief',
        titulo: s.titulo, pilar: s.pilar, formato: s.formato, canales: s.canales,
        notas: idea.texto, no_antes: s.no_antes, no_despues: s.no_despues,
        produccion: (idea.produccion && idea.produccion.length ? idea.produccion : s.produccion)
                      .map(x => '· ' + x).join('\n'),
      });
    }
  }));
}


/* ══════════════════════════════════════════════════════════
   PROGRESO
   Hacer visible el avance invisible.

   Regla que ordena todo esto: cada número sale de un dato que la
   operación YA genera. Si la racha sube, es porque de verdad se
   programó esa semana. Nada de puntos inventados.

   Y lo que a propósito NO existe: comparaciones entre las tres
   personas. Son un equipo de tres y una es la jefa — una tabla de
   posiciones ahí no motiva, envenena.
   ══════════════════════════════════════════════════════════ */

const META_SEMANAL = { piso: 3, objetivo: 4 };
const PISO_INSTITUCIONAL = 40;

function esInstitucional(pieza) {
  const p = PILARES.find(x => x.id === pieza.pilar);
  return !!p && p.carril === 'institucional';
}

function piezasDeSemana(inicio) {
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 6);
  const a = aTexto(inicio), b = aTexto(fin);
  return datos.parrilla.piezas.filter(p => p.fecha >= a && p.fecha <= b);
}

/* Semanas seguidas hacia atrás que alcanzaron el piso. Se cuenta
   desde la semana PASADA: la actual apenas se está construyendo y
   sería injusto que la rompiera un lunes por la mañana. Si la
   semana en curso ya cumplió, se suma — pero nunca se resta. */
function rachaSemanas() {
  const estaSemana = inicioSemana(new Date());
  const cursor = new Date(estaSemana);
  cursor.setDate(cursor.getDate() - 7);

  let cerradas = 0;
  for (let i = 0; i < 52; i++) {          // tope, para no recorrer el calendario entero
    if (piezasDeSemana(cursor).length < META_SEMANAL.piso) break;
    cerradas++;
    cursor.setDate(cursor.getDate() - 7);
  }
  const enCurso = piezasDeSemana(estaSemana).length >= META_SEMANAL.piso;
  return { total: cerradas + (enCurso ? 1 : 0), cerradas, enCurso };
}

function pintarProgreso() {
  const caja = $('#progreso');
  if (!caja) return;

  const piezas = piezasDeSemana(anclaSemana);
  const inst = piezas.filter(esInstitucional).length;
  const mezcla = piezas.length ? Math.round((inst / piezas.length) * 100) : 0;
  // Se avanza con lo PROGRAMADO, no sólo con lo publicado: planear
  // también es trabajo, y verlo contar es lo que sostiene el hábito.
  const avance = Math.min(100, Math.round((piezas.length / META_SEMANAL.objetivo) * 100));
  const r = rachaSemanas();

  const cumplida = piezas.length >= META_SEMANAL.objetivo;
  // Con la parrilla casi vacía todo saldría en rojo. Eso no es un
  // diagnóstico, es un regaño a alguien que apenas llega.
  const arrancando = datos.parrilla.piezas.length < META_SEMANAL.piso;

  caja.className = 'progreso' + (arrancando ? ' arranque' : cumplida ? ' cumplida' : '');
  caja.hidden = false;

  const titulo = arrancando
    ? 'Empieza por aquí'
    : cumplida ? 'Semana completa'
    : piezas.length >= META_SEMANAL.piso ? 'Semana en pie'
    : 'Falta llenar la semana';

  const detalle = arrancando
    ? `Con ${META_SEMANAL.piso} piezas por semana la cuenta se sostiene sola. Llevas ${piezas.length}.`
    : `${piezas.length} de ${META_SEMANAL.objetivo} piezas · ${mezcla}% institucional`;

  const tonoMedidor = mezcla >= PISO_INSTITUCIONAL ? 'var(--ok)' : 'var(--alerta)';

  caja.innerHTML = `
    <div class="anillo" style="--avance:${avance}">
      <div class="anillo-centro">
        <div class="anillo-cifra">${piezas.length}</div>
        <div class="anillo-meta">de ${META_SEMANAL.objetivo}</div>
      </div>
    </div>

    <div class="progreso-texto">
      <div class="progreso-titulo">${titulo}</div>
      <div class="progreso-detalle">${esc(detalle)}</div>
      <div class="medidor" title="Mezcla institucional: ${mezcla}%. El piso es ${PISO_INSTITUCIONAL}%.">
        <div class="medidor-relleno" style="width:${mezcla}%;--medidor-tono:${tonoMedidor}"></div>
        <div class="medidor-marca" style="left:${PISO_INSTITUCIONAL}%"></div>
      </div>
    </div>

    <div class="racha">
      <div class="racha-cifra${r.total ? ' viva' : ''}">${r.total}</div>
      <div class="racha-rotulo">${r.total === 1 ? 'semana<br>seguida' : 'semanas<br>seguidas'}</div>
    </div>`;

  // El anillo se asienta cuando la semana se completa. Es el único
  // momento del producto donde algo celebra, y celebra una vez.
  if (cumplida && pintarProgreso._previo === false) {
    const a = $('.anillo', caja);
    if (a) a.classList.add('celebra');
  }
  pintarProgreso._previo = cumplida;
}


/* ══════════════════════════════════════════════════════════
   QUIÉN ES QUIÉN

   La lista de responsables no puede ser sólo la de usuarios: la
   agencia produce contenido y no tiene cuenta, y el fotógrafo que
   contraten mañana tampoco la tendrá el primer día. Así que la
   lista suma tres fuentes y deja escribir libremente encima.
   ══════════════════════════════════════════════════════════ */

/* Personas con cuenta en el sistema. Se llenan al entrar y se
   guardan en memoria: la lista de perfiles la puede leer cualquiera
   que haya entrado, pero no vale la pena pedirla en cada ficha. */
let personasDelSistema = [];

async function cargarPersonas() {
  if (!Almacen.enLaNube || !Almacen.motor._rest) return;
  try {
    const filas = await Almacen.motor._rest('/perfiles?select=nombre,rol&order=nombre');
    personasDelSistema = (filas || []).filter(p => p.nombre);
  } catch (e) {
    // Sin lista no se rompe nada: el campo sigue siendo de texto.
    personasDelSistema = [];
  }
}

function equipoConocido() {
  const nombres = new Set();

  // 1. Quien tiene cuenta
  personasDelSistema.forEach(p => nombres.add(p.nombre));

  // 2. Quien aparece en el reparto de la mesa de redacción
  Object.values((datos.redaccion && datos.redaccion.equipo) || {})
    .forEach(n => { if (n) nombres.add(n); });

  // 3. Quien ya se anotó antes en alguna pieza — así la agencia y
  //    los externos se quedan en la lista sin que nadie los dé de alta
  (datos.parrilla.piezas || []).forEach(p => { if (p.responsable) nombres.add(p.responsable); });

  return [...nombres].sort((a, b) => a.localeCompare(b, 'es'));
}

/* ══════════════════════════════════════════════════════════
   TU ESCRITORIO

   Lo primero que se ve al entrar, y lo único de la aplicación que
   es distinto para cada quien. El resto del producto muestra el
   trabajo del equipo; esto muestra el tuyo.

   Criterio para decidir qué entra: sólo lo que exige una decisión
   o una acción TUYA hoy. Un número que no cambia nada de lo que
   vas a hacer no es información, es ruido — y el ruido en la
   primera pantalla es lo que hace que la gente deje de abrirla.
   ══════════════════════════════════════════════════════════ */

function mias(lista) {
  const yo = (Almacen.usuario && Almacen.usuario.nombre || '').toLowerCase();
  if (!yo) return [];
  return lista.filter(x => (x.responsable || '').toLowerCase() === yo);
}

/* Lo que está en tus manos AHORA. Una pieza publicada ya no es tuya
   y una que todavía es idea tampoco: en medio está tu trabajo. */
function loMio() {
  const hoy = aTexto(new Date());
  const piezas = datos.parrilla.piezas || [];

  const enMisManos = mias(piezas).filter(p =>
    p.estado !== 'publicado' && p.estado !== 'idea');

  return {
    vencidas: enMisManos.filter(p => p.fecha && p.fecha < hoy),
    hoy:      enMisManos.filter(p => p.fecha === hoy),
    semana:   enMisManos.filter(p => p.fecha > hoy && p.fecha <= aTexto(sumarDias(new Date(), 7))),
    todas:    enMisManos,
  };
}

/* Lo que le toca al equipo y nadie ha tomado. Esto es lo que
   convierte el escritorio en algo útil para la jefa: no le dice
   cuánto trabajó ella, le dice qué está sin dueño. */
function sinDueno() {
  const hoy = aTexto(new Date());
  return (datos.parrilla.piezas || []).filter(p =>
    !p.responsable && p.estado !== 'publicado' && p.fecha >= hoy);
}

function pintarEscritorio() {
  const cont = $('#escritorio');
  if (!cont || !Almacen.usuario) return;

  const yo = Almacen.usuario;
  const m = loMio();
  const huerfanas = sinDueno();
  const eventos = (datos.parrilla.eventos || [])
    .filter(e => e.fecha >= aTexto(new Date()) && e.estado !== 'cancelado')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const proximo = eventos[0];

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  // El titular dice lo ÚNICO que importa saber al abrir.
  let titular, tono;
  if (m.vencidas.length) {
    titular = `${m.vencidas.length} ${m.vencidas.length === 1 ? 'pieza tuya pasó' : 'piezas tuyas pasaron'} de fecha`;
    tono = 'urgente';
  } else if (m.hoy.length) {
    titular = `${m.hoy.length} ${m.hoy.length === 1 ? 'pieza tuya sale' : 'piezas tuyas salen'} hoy`;
    tono = 'hoy';
  } else if (m.todas.length) {
    titular = `${m.todas.length} ${m.todas.length === 1 ? 'pieza tuya' : 'piezas tuyas'} en camino`;
    tono = 'calma';
  } else {
    titular = 'Nada pendiente de tu lado';
    tono = 'calma';
  }

  const tarjeta = (p) => {
    const est = ESTADOS.find(e => e.id === p.estado);
    const pil = PILARES.find(x => x.id === p.pilar);
    return `
      <div class="mia" data-id="${esc(p.id)}" style="--pieza-tono:${pil ? pil.solido : 'var(--linea-control)'}">
        <div class="mia-titulo">${esc(p.titulo || 'Sin título')}</div>
        <div class="mia-meta">
          ${esc(fechaLegible(p.fecha))}${p.formato ? ' · ' + esc(p.formato) : ''}
          ${est ? ` · <span style="color:${est.color}">${esc(est.nombre)}</span>` : ''}
        </div>
      </div>`;
  };

  const avisos = avisosPara(yo);

  /* Arriba del todo y antes de la rejilla: si hay que bajar para
     verlo, no sirve. */
  const bloqueAvisos = (lista) => !lista.length ? '' : `
    <div class="avisos">
      <div class="avisos-cabeza">
        <h4>Para ti <span class="cuenta">${lista.filter(a => !a.visto).length || ''}</span></h4>
        ${lista.some(a => !a.visto)
          ? '<button class="btn-mini" id="avisosTodos">Marcar todo como visto</button>' : ''}
      </div>
      ${lista.map(filaDeAviso).join('')}
    </div>`;

  const bloque = (titulo, lista, vacio) => `
    <div class="escritorio-bloque">
      <h4>${titulo}${lista.length ? ` <span class="cuenta">${lista.length}</span>` : ''}</h4>
      ${lista.length ? lista.map(tarjeta).join('') : `<p class="tenue nota">${vacio}</p>`}
    </div>`;

  cont.innerHTML = `
    <div class="escritorio-cabecera ${tono}">
      <div>
        <div class="escritorio-saludo">${saludo}, ${esc(yo.nombre)}</div>
        <div class="escritorio-titular">${esc(titular)}</div>
      </div>
      ${proximo ? `
      <div class="escritorio-proximo" data-evento="${esc(proximo.id)}">
        <span class="rotulo">Lo próximo por cubrir</span>
        <b>${esc(proximo.titulo)}</b>
        <span>${esc(fechaLegible(proximo.fecha))}${proximo.hora ? ' · ' + esc(horaLegible(proximo.hora)) : ''}</span>
      </div>` : ''}
    </div>

    ${bloqueAvisos(avisos)}

    <div class="escritorio-rejilla">
      ${bloque('Pasadas de fecha', m.vencidas, 'Nada atrasado.')}
      ${bloque('Hoy', m.hoy, 'Hoy no te toca nada.')}
      ${bloque('Esta semana', m.semana, 'La semana viene despejada.')}
      ${bloque('Sin responsable', huerfanas.slice(0, 6),
               'Todo lo programado tiene quién lo haga.')}
    </div>`;

  conectarFilasDeAviso(cont, yo);
  const todos = $('#avisosTodos', cont);
  if (todos) todos.addEventListener('click', () => {
    marcarVisto(yo, ...avisos.map(a => a.id));
    pintarEscritorio();
    pintarContadorAvisos();
  });

  pintarContadorAvisos();

  $$('.mia', cont).forEach(el =>
    el.addEventListener('click', () => abrirPrevia(el.dataset.id)));
  const px = $('.escritorio-proximo', cont);
  if (px) px.addEventListener('click', () => abrirFichaEvento(px.dataset.evento));
}


/* ══════════════════════════════════════════════════════════
   AJUSTES
   Pestaña completa, no una ventanita. Aquí se administra de
   verdad: altas, bajas, roles, contraseñas.

   Todo lo que toca cuentas pasa por la función 'administrar' que
   corre en el servidor de Supabase. Ahí vive la llave que puede
   crear usuarios, y ahí se comprueba de nuevo quién llama. Nunca
   se confía en que el navegador diga "soy admin": lo dice la base.
   ══════════════════════════════════════════════════════════ */

const ROLES_SISTEMA = [
  { id: 'admin',       nombre: 'Administra',  que: 'Todo, incluidas las cuentas' },
  { id: 'direccion',   nombre: 'Dirección',   que: 'Todo lo editorial, sin inventario' },
  { id: 'redaccion',   nombre: 'Redacción',   que: 'Notas, temas y expertos' },
  { id: 'publicacion', nombre: 'Publicación', que: 'Piezas y eventos' },
  { id: 'produccion',  nombre: 'Producción',  que: 'Piezas, ideas y eventos' },
  /* Gente que produce contenido para nosotros sin ser del area.
     Entrega material y ve el calendario; no mueve la parrilla ni
     decide cuando sale algo. Se llama por su funcion, como los
     demas: "agencia" las etiquetaria como de fuera cada vez que
     entran. El limite de verdad lo pone puede_leer() en Postgres,
     no esta lista. */
  { id: 'creacion',    nombre: 'Creación',    que: 'Entrega material y ve el calendario' },
];

let usuariosDelSistema = [];

/* Cualquier funcion de servidor, con la sesion de quien llama. Es
   la misma forma que llamarAdmin, sacada aparte porque ya son dos. */
async function llamarFuncion(nombre, cuerpo) {
  const token = await Almacen.motor._token();
  const r = await fetch(`${CONFIG.supabase.url}/functions/v1/${nombre}`, {
    method: 'POST',
    headers: {
      apikey: CONFIG.supabase.llave,
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cuerpo),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.error) throw new Error(d.error || 'No se pudo completar.');
  return d;
}

async function llamarAdmin(accion, datos = {}) {
  const token = await Almacen.motor._token();
  const r = await fetch(CONFIG.supabase.url + '/functions/v1/administrar', {
    method: 'POST',
    headers: {
      apikey: CONFIG.supabase.llave,
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accion, ...datos }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.error) throw new Error(d.error || 'No se pudo completar.');
  return d;
}

/* Contraseña provisional legible: se dicta por teléfono sin que
   nadie tenga que deletrear. Se cambia al primer ingreso de todas
   formas, así que lo que importa es poder pasarla sin errores. */
function claveProvisional() {
  const palabras = ['aurora','bosque','cabo','duna','faro','grana','islote','jade',
                    'lumbre','marea','norte','otoño','puerto','ronda','sierra','tinta'];
  const al = n => Math.floor(Math.random() * n);
  return palabras[al(palabras.length)] + '-' + palabras[al(palabras.length)] +
         '-' + String(100 + al(900));
}

async function pintarAjustes() {
  const cont = $('#ajustes');
  if (!cont || !Almacen.usuario) return;
  const yo = Almacen.usuario;
  const esAdmin = yo.rol === 'admin';
  /* Quién reparte el trabajo de la mesa de redacción: quien
     administra y la jefatura. Sergio publica lo que le llega, no
     decide quién escribe. */
  const repartelTrabajo = esAdmin || yo.rol === 'direccion';

  cont.innerHTML = '<p class="tenue nota">Cargando…</p>';

  // La lista de cuentas sólo se pide si hay a quién enseñársela.
  if (esAdmin) {
    try {
      const d = await llamarAdmin('listar');
      usuariosDelSistema = d.usuarios || [];
      personasDelSistema = usuariosDelSistema.map(u => ({ nombre: u.nombre, rol: u.rol }));
    } catch (e) {
      usuariosDelSistema = [];
    }
  }

  const eq = (datos.redaccion && datos.redaccion.equipo) || {};
  const nunca = u => !u.ultima_entrada;
  const miRol = ROLES_SISTEMA.find(r => r.id === yo.rol);

  /* Saber si la llave de Meta sigue viva ANTES de necesitarla. Los
     tokens caducan a los 60 dias, y el dia que deje de servir no
     queremos enterarnos con un post a medio publicar. */
  const bloqueRedes = !repartelTrabajo ? '' : `
    <section class="bloque-auditoria">
      <div class="bloque-encabezado">
        <h3>Conexión con las redes</h3>
        <button class="btn-plano" id="aj_redes">Comprobar</button>
      </div>
      <p class="tenue nota">
        Comprueba que la llave de Meta siga sirviendo y a qué cuentas
        apunta. No publica nada.
      </p>
      <div id="aj_redes_salida"></div>
    </section>`;

  const bloqueCuentas = !esAdmin ? '' : `
    <section class="bloque-auditoria">
      <div class="bloque-encabezado">
        <h3>Personas con cuenta</h3>
        <button class="btn-primario" id="aj_nueva">+ Dar de alta</button>
      </div>
      <div class="tabla-envoltorio">
        <table class="tabla" id="aj_tabla">
          <thead>
            <tr>
              <th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Rol</th>
              <th scope="col">Última entrada</th><th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            ${usuariosDelSistema.length ? usuariosDelSistema.map(u => `
              <tr data-id="${esc(u.id)}">
                <td>
                  <div class="nombre-equipo">${esc(u.nombre)}</div>
                  ${u.debe_cambiar_clave ? '<div class="sub-equipo">Clave provisional sin cambiar</div>' : ''}
                </td>
                <td class="tenue">${esc(u.correo)}</td>
                <td>
                  ${u.id !== yo.id ? `
                    <select class="campo-mini" data-rol="${esc(u.id)}" aria-label="Rol de ${esc(u.nombre)}">
                      ${ROLES_SISTEMA.map(r =>
                        `<option value="${r.id}"${r.id === u.rol ? ' selected' : ''}>${esc(r.nombre)}</option>`).join('')}
                    </select>`
                  : `<span class="sello-tipo es-post">${esc(u.rol)}</span>`}
                </td>
                <td class="tenue">${nunca(u) ? 'Todavía no entra' : esc(fechaLegible(u.ultima_entrada.slice(0,10)))}</td>
                <td>
                  ${u.id !== yo.id ? `
                    <button class="btn-mini" data-clave="${esc(u.id)}" title="Poner una contraseña provisional nueva">Reponer clave</button>
                    <button class="btn-mini" data-baja="${esc(u.id)}" title="Eliminar la cuenta">Baja</button>` : ''}
                </td>
              </tr>`).join('')
            : '<tr><td colspan="5"><div class="vacio" style="border:0;background:none">No se pudo leer la lista de cuentas.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    </section>

    <section class="bloque-auditoria">
      <div class="bloque-encabezado"><h3>Qué puede hacer cada rol</h3></div>
      <div class="tabla-envoltorio">
        <table class="tabla">
          <thead><tr><th scope="col">Rol</th><th scope="col">Alcance</th><th scope="col">Qué ve</th></tr></thead>
          <tbody>
            ${ROLES_SISTEMA.map(r => {
              const v = VISTAS_POR_ROL[r.id];
              return `<tr>
                <td><b>${esc(r.nombre)}</b></td>
                <td class="tenue">${esc(r.que)}</td>
                <td class="tenue">${v ? esc(v.ve.length) + ' de 7 pestañas' : '—'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <p class="tenue nota" style="margin-top:12px">
        El rol dice qué se puede tocar en el programa, no quién manda en el
        departamento. Los permisos los aplica la base de datos: aunque alguien
        manipule su navegador, el cambio se rechaza igual.
      </p>
    </section>`;

  const bloqueEquipo = !repartelTrabajo ? '' : `
    <section class="bloque-auditoria">
      <div class="bloque-encabezado">
        <h3>Quién hace qué en la mesa de redacción</h3>
      </div>
      <p class="tenue nota">Estos nombres salen en el encargo que se le manda a quien redacta. Si están vacíos, el encargo dice «quien escribe» y llega mal.</p>
      <div class="fila-campos">
        <div class="grupo-campo">
          <label for="aj_redaccion">Escribe las notas</label>
          <input class="campo" id="aj_redaccion" value="${esc(eq.redaccion || '')}" list="aj_nombres">
        </div>
        <div class="grupo-campo">
          <label for="aj_publicacion">Publica en el sitio</label>
          <input class="campo" id="aj_publicacion" value="${esc(eq.publicacion || '')}" list="aj_nombres">
        </div>
      </div>
      <div class="grupo-campo" style="margin-top:12px">
        <label for="aj_difusion">Arma el post y el reel</label>
        <input class="campo" id="aj_difusion" value="${esc(eq.difusion || '')}" list="aj_nombres">
      </div>
      <datalist id="aj_nombres">
        ${equipoConocido().map(n => `<option value="${esc(n)}"></option>`).join('')}
      </datalist>
      <div style="margin-top:14px">
        <button class="btn-primario" id="aj_guardarEquipo">Guardar</button>
      </div>
    </section>`;

  cont.innerHTML = `
    <section class="ajustes-cabecera">
      <div>
        <h2>Ajustes</h2>
        <p class="tenue">${esAdmin
          ? 'Cuentas, roles y cómo se reparte el trabajo.'
          : 'Tu cuenta y tu contraseña.'}</p>
      </div>
      <div class="ficha-plana">
        <b>${esc(yo.nombre)}</b>
        <span class="tenue">${esc(yo.correo || '')}</span>
        <span class="sello-tipo es-post">${esc(miRol ? miRol.nombre : yo.rol)}</span>
      </div>
    </section>

    ${bloqueCuentas}
    ${bloqueRedes}
    ${bloqueEquipo}

    <section class="bloque-auditoria">
      <div class="bloque-encabezado"><h3>Tu contraseña</h3></div>
      <p class="tenue nota">
        Cámbiala cuando quieras. Sólo tú la conoces: no queda guardada en
        ningún lado ni la puede ver quien administra.
      </p>
      <div class="fila-campos">
        <div class="grupo-campo">
          <label for="aj_clave1">Contraseña nueva</label>
          <input type="password" class="campo" id="aj_clave1" autocomplete="new-password" minlength="8">
          <span class="ayuda">Mínimo 8 caracteres.</span>
        </div>
        <div class="grupo-campo">
          <label for="aj_clave2">Repítela</label>
          <input type="password" class="campo" id="aj_clave2" autocomplete="new-password" minlength="8">
        </div>
      </div>
      <div style="margin-top:14px">
        <button class="btn-plano" id="aj_cambiarClave">Cambiar mi contraseña</button>
      </div>
    </section>

    <section class="bloque-auditoria">
      <div class="bloque-encabezado"><h3>Qué ves tú</h3></div>
      <p class="tenue nota">
        ${miRol ? esc(miRol.que) + '. ' : ''}Las pestañas que no aparecen no son
        parte de tu trabajo — no están escondidas por desconfianza, están fuera
        para no estorbar.
      </p>
      <div class="lista-personas">
        ${vistasQueVeo().map(v => {
          const t = $(`.tab[data-vista="${v}"]`);
          return `<div class="ficha-plana"><b>${esc(t ? t.textContent : v)}</b></div>`;
        }).join('')}
      </div>
    </section>
  `;

  const btnRedes = $('#aj_redes');
  if (btnRedes) btnRedes.addEventListener('click', async () => {
    const salida = $('#aj_redes_salida');
    btnRedes.disabled = true;
    salida.innerHTML = '<p class="tenue nota">Preguntándole a Meta…</p>';
    try {
      const d = await llamarFuncion('publicar', { accion: 'comprobar' });
      const fila = (red, r) => `
        <div class="red-estado ${r.ok ? 'viva' : 'muerta'}">
          <b>${esc(red)}</b>
          ${r.ok
            ? `<span>Conectada a <b>${red === 'Instagram' ? '@' : ''}${esc(r.usuario || '?')}</b>${
                 r.publicadasHoy != null ? ' · ' + r.publicadasHoy + ' publicaciones hoy' : ''}${
                 r.dias != null
                   ? ` · <b class="${r.dias <= 10 ? 'caduca-pronto' : ''}">caduca en ${r.dias} día${
                       r.dias === 1 ? '' : 's'}</b>`
                   : ''}</span>`
            : `<span>${esc(r.porque || 'Sin conexión')}</span>`}
        </div>`;
      salida.innerHTML = fila('Instagram', d.instagram || {}) + fila('Facebook', d.facebook || {});
    } catch (e) {
      salida.innerHTML = `<p class="lamina-error">⚠ ${esc(e.message)}</p>`;
    } finally { btnRedes.disabled = false; }
  });

  if (esAdmin) {
    $('#aj_nueva').addEventListener('click', abrirAltaDeUsuario);

    $$('[data-rol]', cont).forEach(sel => sel.addEventListener('change', async () => {
      const antes = usuariosDelSistema.find(u => u.id === sel.dataset.rol);
      sel.disabled = true;
      try {
        await llamarAdmin('rol', { id: sel.dataset.rol, rol: sel.value });
        avisar('Rol actualizado.');
        if (antes) antes.rol = sel.value;
      } catch (e) {
        avisar(e.message);
        if (antes) sel.value = antes.rol;
      } finally { sel.disabled = false; }
    }));

    $$('[data-clave]', cont).forEach(b => b.addEventListener('click', async () => {
      const u = usuariosDelSistema.find(x => x.id === b.dataset.clave);
      const clave = claveProvisional();
      if (!confirm(`Poner una contraseña provisional nueva a ${u.nombre}.\n\n` +
                   `La va a tener que cambiar al entrar.\n\n¿Seguir?`)) return;
      try {
        await llamarAdmin('reponer_clave', { id: u.id, clave });
        mostrarClave(u.nombre, u.correo, clave);
        pintarAjustes();
      } catch (e) { avisar(e.message); }
    }));

    $$('[data-baja]', cont).forEach(b => b.addEventListener('click', async () => {
      const u = usuariosDelSistema.find(x => x.id === b.dataset.baja);
      if (!confirm(`¿Eliminar la cuenta de ${u.nombre} (${u.correo})?\n\n` +
                   `Lo que haya capturado se queda; lo que pierde es el acceso.\n` +
                   `Esto no se puede deshacer.`)) return;
      try {
        await llamarAdmin('baja', { id: u.id });
        avisar('Cuenta eliminada.');
        pintarAjustes();
      } catch (e) { avisar(e.message); }
    }));
  }

  if (repartelTrabajo) {
    $('#aj_guardarEquipo').addEventListener('click', () => {
      datos.redaccion = datos.redaccion || {};
      datos.redaccion.equipo = {
        redaccion:   $('#aj_redaccion').value.trim(),
        publicacion: $('#aj_publicacion').value.trim(),
        difusion:    $('#aj_difusion').value.trim(),
      };
      guardar('redaccion');
      registrar('Cambió quién hace qué en la mesa de redacción');
      pintarRedaccion();
      avisar('Guardado.');
    });
  }

  /* Cambiar la propia contraseña. Antes sólo existía en el paso
     forzado del primer ingreso: quien ya había entrado no tenía
     ninguna forma de cambiarla, y pedírsela a quien administra
     significaba que otra persona la eligiera por ti. */
  $('#aj_cambiarClave').addEventListener('click', async () => {
    const a = $('#aj_clave1').value, b = $('#aj_clave2').value;
    if (a.length < 8) { avisar('La contraseña necesita al menos 8 caracteres.'); return; }
    if (a !== b) { avisar('Las dos contraseñas no coinciden.'); return; }
    const boton = $('#aj_cambiarClave');
    boton.disabled = true;
    try {
      await Almacen.cambiarClave(a);
      $('#aj_clave1').value = ''; $('#aj_clave2').value = '';
      avisar('Contraseña cambiada. Sólo tú la conoces.');
    } catch (e) {
      avisar(e.message || 'No se pudo cambiar.');
    } finally { boton.disabled = false; }
  });
}


/* ── Alta ──────────────────────────────────────────────── */

function abrirAltaDeUsuario() {
  modalCtx = { tipo: 'alta', datos: {}, esNuevo: true };
  $('#modalTitulo').textContent = 'Dar de alta una cuenta';
  $('#modalEliminar').hidden = true;
  $('#modalGuardar').textContent = 'Crear cuenta';

  const clave = claveProvisional();

  $('#modalCuerpo').innerHTML = `
    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="u_nombre">Nombre</label>
        <input class="campo" id="u_nombre" placeholder="Como quieres que aparezca">
      </div>
      <div class="grupo-campo">
        <label for="u_correo">Correo</label>
        <input type="email" class="campo" id="u_correo" placeholder="nombre@tijuana.ibero.mx">
        <span class="ayuda" id="u_correoAyuda">Del dominio de la universidad.</span>
      </div>
    </div>

    <div class="grupo-campo">
      <label for="u_rol">Rol</label>
      <select class="campo" id="u_rol">
        ${ROLES_SISTEMA.map(r =>
          `<option value="${r.id}"${r.id === 'produccion' ? ' selected' : ''}>${esc(r.nombre)} — ${esc(r.que)}</option>`).join('')}
      </select>
    </div>

    <div class="grupo-campo">
      <label for="u_clave">Contraseña provisional</label>
      <input class="campo" id="u_clave" value="${esc(clave)}">
      <span class="ayuda">
        Se la pasas de viva voz o por donde acostumbres — <b>no por correo junto con el usuario</b>.
        Al entrar la primera vez, el sistema la obliga a cambiarla, así que a partir
        de ese momento ni tú la conoces.
      </span>
    </div>
  `;

  /* Creación es gente de fuera: no tiene correo de la universidad,
     y prometerle uno institucional al capturarla confunde a quien
     da de alta la cuenta. */
  const selRol = $('#u_rol'), ayudaCorreo = $('#u_correoAyuda'), campoCorreo = $('#u_correo');
  const acomodarCorreo = () => {
    const fuera = selRol.value === 'creacion';
    ayudaCorreo.textContent = fuera
      ? 'El suyo, el que ya usa. No necesita ser de la universidad.'
      : 'Del dominio de la universidad.';
    campoCorreo.placeholder = fuera ? 'nombre@correo.com' : 'nombre@tijuana.ibero.mx';
  };
  selRol.addEventListener('change', acomodarCorreo);
  acomodarCorreo();

  mostrarModal();
}

async function crearUsuario() {
  const nombre = $('#u_nombre').value.trim();
  const correo = $('#u_correo').value.trim();
  const rol    = $('#u_rol').value;
  const clave  = $('#u_clave').value;

  if (!nombre) { avisar('Falta el nombre.'); return false; }
  if (!correo.includes('@')) { avisar('Ese correo no se ve bien.'); return false; }
  if (clave.length < 8) { avisar('La contraseña provisional necesita 8 caracteres.'); return false; }

  $('#modalGuardar').disabled = true;
  try {
    await llamarAdmin('crear', { nombre, correo, rol, clave });
    cerrarModal();
    mostrarClave(nombre, correo, clave);
    pintarAjustes();
    return false;   // el cierre y el repintado ya se hicieron aquí
  } catch (e) {
    avisar(e.message);
    return false;
  } finally {
    $('#modalGuardar').disabled = false;
  }
}

/* La clave provisional se enseña UNA vez, grande y copiable. Si se
   pierde, se repone: no se guarda en ningún lado. */
function mostrarClave(nombre, correo, clave) {
  modalCtx = { tipo: 'clave', datos: {}, esNuevo: false };
  $('#modalTitulo').textContent = 'Cuenta lista';
  $('#modalEliminar').hidden = true;
  $('#modalGuardar').hidden = true;
  $('#modalCancelar').textContent = 'Listo';

  $('#modalCuerpo').innerHTML = `
    <p class="nota">Pásale esto a <b>${esc(nombre)}</b>:</p>
    <div class="credencial">
      <div><span>Página</span><b>cci-iberotj.github.io/lapizarra</b></div>
      <div><span>Correo</span><b>${esc(correo)}</b></div>
      <div><span>Contraseña provisional</span><b class="clave">${esc(clave)}</b></div>
    </div>
    <p class="tenue nota">
      Esta contraseña <b>no se vuelve a mostrar</b> y no queda guardada en ningún
      lado. Si se pierde, se repone desde la lista. Al entrar la primera vez el
      sistema la obliga a cambiarla.
    </p>
    <button class="btn-plano" id="u_copiar">Copiar los tres datos</button>
  `;

  $('#u_copiar').addEventListener('click', async () => {
    const texto = `LA PIZARRA\ncci-iberotj.github.io/lapizarra\n\nCorreo: ${correo}\nContraseña provisional: ${clave}\n\nAl entrar te va a pedir que la cambies.`;
    try { await navigator.clipboard.writeText(texto); avisar('Copiado.'); }
    catch (e) { avisar('No se pudo copiar. Selecciónalo a mano.'); }
  });

  mostrarModal();
}

/* ══════════════════════════════════════════════════════════
   EVENTOS

   Un evento NO es una publicación. Es algo que va a ocurrir en el
   mundo y que hay que cubrir: una ceremonia, una conferencia, una
   feria. De un evento pueden salir tres piezas o ninguna.

   Se guardan aparte de las piezas a propósito. Comparten el
   calendario y nada más: un evento tiene hora y lugar y no tiene
   pilar ni canales; una pieza tiene canales y no tiene lugar.
   Meterlos en la misma lista obligaría a que la mitad de los
   campos estuvieran siempre vacíos.

   Cualquiera puede anotar un evento — incluidos Marysol y Sergio.
   La idea es que cuando exista la plataforma de solicitudes, las
   áreas avisen por ahí y el evento caiga aquí solo.
   ══════════════════════════════════════════════════════════ */

/* Se marcan varias. Antes era una sola opcion y existia "Foto y
   video" como parche — que ya no hace falta y no cubria los casos
   de tres cosas a la vez. */
const QUE_SE_NECESITA = [
  { id: 'foto',        nombre: 'Fotografía' },
  { id: 'video',       nombre: 'Video' },
  { id: 'transmision', nombre: 'Transmisión en vivo' },
  { id: 'nota',        nombre: 'Nota escrita' },
  { id: 'testimonios', nombre: 'Testimonios en cámara' },
  { id: 'dron',        nombre: 'Tomas con dron' },
];

/* Lo guardado puede venir del modelo viejo, donde 'necesita' era
   una cadena. Se traduce al vuelo para no perder los eventos que
   ya estan capturados. */
function necesidadesDe(e) {
  if (Array.isArray(e.necesita)) return e.necesita;
  if (!e.necesita || e.necesita === 'sin_definir') return [];
  if (e.necesita === 'ambos') return ['foto', 'video'];
  return [e.necesita];
}

/* ── Horas escritas a mano ─────────────────────────────────
   Devuelve 'HH:MM', '' si venia vacio, o null si no se entendio
   —que no es lo mismo: vacio es valido, ilegible no.

   Sin sufijo se supone que 1 a 7 son de la tarde y 8 a 12 de la
   mañana, que es como cae la jornada aqui. Se supone, no se
   adivina: el campo se reescribe a la vista con lo que entendio,
   asi que si te equivocas lo ves antes de guardar. */
function leerHora(txt) {
  const t = String(txt == null ? '' : txt).trim().toLowerCase()
    .replace(/[.\s]/g, '').replace(/hrs?$/, '');
  if (!t) return '';
  const m = t.match(/^(\d{1,2})(?::?(\d{2}))?(am|pm|a|p)?$/);
  if (!m) return null;

  let h = +m[1];
  const min = m[2] ? +m[2] : 0;
  const suf = m[3] ? m[3][0] : '';
  if (min > 59) return null;

  if (suf === 'p') { if (h > 12) return null; if (h < 12) h += 12; }
  else if (suf === 'a') { if (h > 12) return null; if (h === 12) h = 0; }
  else if (h >= 1 && h <= 7) h += 12;
  if (h > 23) return null;

  return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
}

/* Cuanto dura, dicho como se dice. Sirve para saber de un vistazo
   si alcanza con una salida de equipo o hay que dividirse. */
function duracionEntre(inicio, fin) {
  if (!inicio || !fin) return '';
  const a = inicio.split(':'), b = fin.split(':');
  const min = (+b[0] * 60 + +b[1]) - (+a[0] * 60 + +a[1]);
  if (min <= 0) return '';
  const h = Math.floor(min / 60), r = min % 60;
  return (h ? h + ' h' : '') + (h && r ? ' ' : '') + (r ? r + ' min' : '');
}

/* "12 pm" o "12 pm – 2:30 pm". El am/pm se dice una sola vez
   cuando los dos caen en la misma mitad del dia. */
function rangoHoras(inicio, fin) {
  if (!inicio) return '';
  if (!fin) return horaLegible(inicio);
  const a = horaLegible(inicio), b = horaLegible(fin);
  const mitad = s => s.slice(-2);
  return (mitad(a) === mitad(b) ? a.slice(0, -3) : a) + ' – ' + b;
}

/* Medias horas de una jornada universitaria. Es sugerencia: el
   campo acepta cualquier cosa que se entienda. */
const HORAS_SUGERIDAS = (() => {
  const l = [];
  for (let h = 7; h <= 21; h++) for (const m of ['00', '30']) {
    l.push(horaLegible(String(h).padStart(2, '0') + ':' + m));
  }
  return l;
})();

/* ── Qué se anota en el calendario ─────────────────────────
   Hasta aquí "evento" significaba una sola cosa: algo que el área
   va a cubrir. Por eso la barra decía "lo que hay que cubrir", el
   estado final era "Cubierto" y el formulario preguntaba qué
   material se necesita. Una reunión no cabía en nada de eso.

   Cada tipo declara qué campos tienen sentido, cómo se llaman y
   cómo se llaman sus estados. El formulario, la ficha, la tarjeta
   del calendario y la barra lateral leen de aquí: un tipo nuevo es
   un renglón más, no cuatro parches.

   Lo guardado antes de esto no trae 'tipo'. Se lee como cobertura,
   que es lo que era. */
const TIPOS_EVENTO = [
  {
    id: 'cobertura', nombre: 'Evento por cubrir', corto: 'Evento', icono: '◆',
    titulo: 'Anotar evento por cubrir',
    pista: 'Algo que ocurre y el área va a fotografiar, grabar o cubrir.',
    etiquetas: {
      titulo: 'Qué es', lugar: 'Dónde', quien: 'Quién avisa',
      quienPista: 'Área o persona que lo pidió',
      ejemplo: 'IGNITE, Ceremonia de graduación, Feria de posgrados…',
      detalles: 'Contacto, accesos, si hay que llegar antes, qué se espera de la cobertura…',
    },
    necesita: true, cobertura: true,
    estados: [
      { id: 'avisado',    nombre: 'Avisado',    tono: 'var(--tinta-tenue)',      nota: 'Alguien lo reportó; falta confirmar' },
      { id: 'confirmado', nombre: 'Confirmado', tono: 'var(--info)',             nota: 'Va, y sabemos qué se necesita' },
      { id: 'cubierto',   nombre: 'Cubierto',   tono: 'var(--estado-publicado)', nota: 'Ya se grabó o fotografió', solida: true },
    ],
  },
  {
    id: 'reunion', nombre: 'Reunión', corto: 'Reunión', icono: '●',
    cancelado: 'Cancelada',
    titulo: 'Anotar una reunión',
    pista: 'Ocupa tu tiempo pero no produce material.',
    etiquetas: {
      titulo: 'De qué es', lugar: 'Dónde', quien: 'Con quién',
      quienPista: 'Personas o áreas que asisten',
      ejemplo: 'Junta de área, revisión con Rectoría, arranque de campaña…',
      detalles: 'Puntos a tratar, qué hay que llevar, acuerdos…',
    },
    estados: [
      { id: 'agendada', nombre: 'Agendada', tono: 'var(--info)',             nota: 'Está en el calendario' },
      { id: 'hecha',    nombre: 'Hecha',    tono: 'var(--estado-publicado)', nota: 'Ya ocurrió', solida: true },
    ],
  },
  {
    id: 'entrega', nombre: 'Entrega o fecha límite', corto: 'Entrega', icono: '▲',
    cancelado: 'Cancelada',
    titulo: 'Anotar una entrega',
    pista: 'No es algo que ocurre: es una fecha en la que algo tiene que estar listo.',
    etiquetas: {
      titulo: 'Qué se entrega', lugar: 'Dónde se entrega', quien: 'Para quién',
      quienPista: 'Área o persona que lo espera',
      ejemplo: 'Deck de inducción, comunicado de rectoría, artes para imprenta…',
      detalles: 'Formato, medidas, a dónde se sube, de qué depende…',
    },
    estados: [
      { id: 'pendiente', nombre: 'Pendiente', tono: 'var(--alerta)',           nota: 'Todavía no se entrega' },
      { id: 'entregada', nombre: 'Entregada', tono: 'var(--estado-publicado)', nota: 'Ya se entregó', solida: true },
    ],
  },
  {
    id: 'bloqueo', nombre: 'Tiempo bloqueado', corto: 'Bloqueo', icono: '▬',
    titulo: 'Bloquear tiempo',
    pista: 'Vacaciones, permiso, día fuera de campus. Para que no te agenden encima.',
    etiquetas: {
      titulo: 'Por qué', lugar: 'Dónde estarás', quien: 'Quién no está',
      quienPista: 'Deja vacío si eres tú',
      ejemplo: 'Vacaciones, permiso, curso fuera del campus…',
      detalles: 'Quién cubre lo urgente, cómo localizarte…',
    },
    estados: [
      { id: 'firme', nombre: 'No disponible', tono: 'var(--tinta-tenue)', nota: 'Nadie debería agendarte encima' },
    ],
  },
];

/* Cancelado vale para los cuatro: cualquier cosa se puede caer. */
const ESTADO_CANCELADO = {
  id: 'cancelado', nombre: 'Cancelado', tono: 'var(--tinta-tenue)', nota: 'Ya no va',
};

function tipoDe(e) {
  return TIPOS_EVENTO.find(t => t.id === (e && e.tipo)) || TIPOS_EVENTO[0];
}

function estadosDe(e) {
  const t = tipoDe(e);
  return t.estados.concat([
    t.cancelado ? Object.assign({}, ESTADO_CANCELADO, { nombre: t.cancelado })
                : ESTADO_CANCELADO,
  ]);
}

function estadoDe(e) {
  const lista = estadosDe(e);
  return lista.find(s => s.id === e.estado) || lista[0];
}

/* Se conserva para lo que todavía la nombra; ahora sale de la
   tabla en vez de ser una lista suelta. */
const ESTADOS_EVENTO = TIPOS_EVENTO[0].estados.concat([ESTADO_CANCELADO])
  .map(s => Object.assign({ color: s.tono }, s));

/* Compara fecha Y hora. Se usa la de termino cuando la hay: una
   jornada de 9 a 12 sigue siendo "lo que viene" a las diez.
   Sin hora dura todo el dia, que es lo que uno espera de algo
   anotado solo con fecha. */
function yaPaso(e, ahora) {
  const p = n => String(n).padStart(2, '0');
  const hoy = aTexto(ahora);
  if (!e.fecha || e.fecha > hoy) return false;
  if (e.fecha < hoy) return true;
  const fin = e.hora_fin || e.hora;
  if (!fin) return false;
  return fin < p(ahora.getHours()) + ':' + p(ahora.getMinutes());
}

function eventosDe(fecha) {
  return (datos.parrilla.eventos || [])
    .filter(e => e.fecha === fecha && e.estado !== 'cancelado')
    .sort((a, b) => (a.hora || '99:99').localeCompare(b.hora || '99:99'));
}

function colorEvento(e) {
  return estadoDe(e).tono;
}

/* La hora en formato de doce horas, que es como la dice la gente
   aquí. 09:00 se lee "9:00 am", no "las nueve cero cero". */
function horaLegible(h) {
  if (!h) return '';
  const [hh, mm] = h.split(':').map(Number);
  const ampm = hh >= 12 ? 'pm' : 'am';
  const doce = hh % 12 === 0 ? 12 : hh % 12;
  return doce + (mm ? ':' + String(mm).padStart(2, '0') : '') + ' ' + ampm;
}



/* ═══════════════════════════════════════════════════════════
   LO QUE LLEGA

   Dos caras del mismo lugar. Quien crea entrega y ve en qué quedó
   lo suyo; el área ve lo que entró y decide qué hacer con eso.

   Entregar y programar están separados a proposito: quien entrega
   no elige cuándo sale. Ése era el requisito.
   ═══════════════════════════════════════════════════════════ */

const ESTADOS_ENTREGA = [
  { id: 'entregada', nombre: 'Sin revisar', tono: 'var(--info)',
    nota: 'Esperando que el área la vea' },
  { id: 'aceptada',  nombre: 'En el calendario', tono: 'var(--estado-publicado)',
    nota: 'Ya tiene fecha', solida: true },
  { id: 'devuelta',  nombre: 'Con cambios', tono: 'var(--alerta)',
    nota: 'Hay que corregir algo' },
];

function estadoEntrega(e) {
  return ESTADOS_ENTREGA.find(x => x.id === e.estado) || ESTADOS_ENTREGA[0];
}

function soyCreacion() {
  return rolUI() === 'creacion';
}

let revisionPendiente = [];   // lo revisado y todavía sin subir

/* ── Revisar antes de subir ──────────────────────────────── */

async function revisarYEnseñar(archivos) {
  const zona = $('#revisionEntrega');
  zona.innerHTML = '<div class="revision-cargando">Revisando el material…</div>';
  // Se acumula: elegir un segundo lote no borra el primero.
  for (const a of archivos) revisionPendiente.push(await revisarEntrega(a));
  pintarRevision();
}

/* Pinta lo que ya se midio. Medir y pintar separados, porque al
   quitar un archivo de la lista no hay que volver a medir nada. */
function pintarRevision() {
  const zona = $('#revisionEntrega');
  if (!revisionPendiente.length) { zona.innerHTML = ''; return; }

  const hayProblema = revisionPendiente.some(r => r.problemas.length);
  const listos = revisionPendiente.filter(r => !r.problemas.length);

  zona.innerHTML = `
    <div class="revision">
      ${revisionPendiente.map((r, i) => `
        <div class="revision-archivo${r.problemas.length ? ' mal' : ''}">
          <div class="revision-cabeza">
            <span class="revision-marca" aria-hidden="true">${r.problemas.length ? '✕' : '✓'}</span>
            <b>${esc(r.nombre)}</b>
            <button type="button" class="btn-icono revision-quitar" data-i="${i}"
                    title="Quitar de la lista">×</button>
          </div>
          <div class="revision-datos">
            ${r.ancho ? `${r.ancho}×${r.alto}` : ''}
            ${r.segundos ? ' · ' + esc(segundosLegibles(r.segundos)) : ''}
            · ${esc(pesoLegible(r.peso))}
          </div>
          ${r.problemas.map(t => `<p class="revision-problema">${esc(t)}</p>`).join('')}
          ${r.avisos.map(t => `<p class="revision-aviso">${esc(t)}</p>`).join('')}
        </div>`).join('')}
    </div>

    ${listos.length ? `
      <div class="grupo-campo">
        <label for="entregaTitulo">Qué es esto</label>
        <input class="campo" id="entregaTitulo"
               placeholder="Reel de las Jornadas de Jardinería, versión 2">
        <span class="ayuda">Con esto lo van a reconocer sin abrirlo.</span>
      </div>
      <div class="grupo-campo">
        <label for="entregaNotas">Algo que haya que saber</label>
        <textarea class="campo" id="entregaNotas" rows="2"
                  placeholder="El audio va con la música original. Hay una versión sin texto si la necesitan."></textarea>
      </div>
      <button type="button" class="btn-primario ancho" id="mandarEntrega">
        Enviar ${listos.length === 1 ? 'el archivo' : 'los ' + listos.length + ' archivos'}
      </button>` : ''}

    ${hayProblema ? `<p class="revision-pie">
      Lo marcado con ✕ no se puede subir. Corrígelo y vuelve a elegirlo,
      o quítalo de la lista.</p>` : ''}
  `;

  $$('.revision-quitar', zona).forEach(b => b.addEventListener('click', () => {
    revisionPendiente.splice(+b.dataset.i, 1);
    pintarRevision();
  }));

  const mandar = $('#mandarEntrega');
  if (mandar) mandar.addEventListener('click', mandarEntrega);
}

async function mandarEntrega() {
  const listos = revisionPendiente.filter(r => !r.problemas.length);
  if (!listos.length) return;

  const titulo = ($('#entregaTitulo').value || '').trim();
  if (!titulo) { avisar('Ponle un nombre para que lo reconozcan.'); $('#entregaTitulo').focus(); return; }

  const boton = $('#mandarEntrega');
  boton.disabled = true;
  const original = boton.textContent;

  const e = {
    id: id(), titulo,
    notas: ($('#entregaNotas').value || '').trim(),
    archivos: [], estado: 'entregada',
    creadoPor: Almacen.usuario ? Almacen.usuario.nombre : '',
    creado: ahora(), actualizado: ahora(),
  };

  try {
    for (let i = 0; i < listos.length; i++) {
      const r = listos[i];
      boton.textContent = `Subiendo ${i + 1} de ${listos.length}…`;
      // El prefijo entregas/ no es decorativo: la politica de Storage
      // deja escribir a Creacion solo dentro de el.
      const ruta = await subirArchivo('entregas/' + e.id, r.archivo, r.nombre);
      e.archivos.push({
        ruta, nombre: r.nombre, peso: r.peso, tipo: r.tipo,
        ancho: r.ancho || 0, alto: r.alto || 0, segundos: r.segundos || 0,
      });
    }
    datos.entregas.lista = datos.entregas.lista || [];
    datos.entregas.lista.push(e);
    await guardar('entregas');

    revisionPendiente = [];
    $('#revisionEntrega').innerHTML = '';
    avisar('Enviado. El área ya lo puede ver.');
    pintarEntregas();
  } catch (err) {
    avisar('No se pudo subir: ' + err.message);
    boton.disabled = false;
    boton.textContent = original;
  }
}

/* ── La lista ────────────────────────────────────────────── */

function pintarEntregas() {
  const cont = $('#entregasLista');
  if (!cont) return;
  const mio = soyCreacion();

  $('#entregasTitulo').textContent = mio ? 'Mis envíos' : 'Lo que llega';
  $('#entregasNota').textContent = mio
    ? 'Manda aquí el material terminado. El área decide cuándo sale; aquí ves en qué quedó lo tuyo.'
    : 'Material que mandó quien produce contenido para nosotros. Desde aquí se lleva al calendario.';

  const tab = $('#tabEntregas');
  if (tab) tab.textContent = mio ? 'Mis envíos' : 'Lo que llega';

  const subir = $('#entregasSubir');
  if (subir) subir.hidden = soloLectura('entregas');

  const lista = (datos.entregas && datos.entregas.lista || [])
    .slice().sort((a, b) => String(b.creado).localeCompare(String(a.creado)));

  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">
      <div class="vacio-titulo">${mio ? 'Todavía no has enviado nada' : 'Nada ha llegado todavía'}</div>
      <div>${mio
        ? 'Lo que mandes aparece aquí con su estado, para que sepas si ya tiene fecha o si hay que corregir algo.'
        : 'Cuando manden material va a aparecer aquí, con sus medidas y su peso a la vista.'}</div>
    </div>`;
    return;
  }

  cont.innerHTML = lista.map(e => {
    const est = estadoEntrega(e);
    const arch = e.archivos || [];
    const pieza = e.pieza && datos.parrilla.piezas.find(p => p.id === e.pieza);
    return `
      <article class="entrega" data-id="${esc(e.id)}" style="--entrega-tono:${est.tono}">
        <div class="entrega-lienzo" data-ruta="${esc((arch[0] || {}).ruta || '')}"
             data-tipo="${esc((arch[0] || {}).tipo || '')}"></div>
        <div class="entrega-cuerpo">
          <div class="entrega-cabeza">
            ${selloEstado({ texto: est.nombre, tono: est.tono, solida: est.solida, ayuda: est.nota })}
            <h4>${esc(e.titulo || 'Sin nombre')}</h4>
          </div>
          <div class="entrega-meta">
            ${arch.length} ${arch.length === 1 ? 'archivo' : 'archivos'}
            ${arch[0] && arch[0].ancho ? ` · ${arch[0].ancho}×${arch[0].alto}` : ''}
            ${arch[0] && arch[0].segundos ? ' · ' + esc(segundosLegibles(arch[0].segundos)) : ''}
            · ${esc(pesoLegible(arch.reduce((t, a) => t + (a.peso || 0), 0)))}
            ${e.creadoPor ? ' · ' + esc(e.creadoPor) : ''}
            ${e.creado ? ' · ' + esc(fechaLegible(String(e.creado).slice(0, 10))) : ''}
          </div>
          ${e.notas ? `<p class="entrega-notas">${esc(e.notas).replace(/\n/g, '<br>')}</p>` : ''}
          ${e.comentario ? `<p class="entrega-devuelta"><b>Hay que corregir:</b> ${
            esc(e.comentario).replace(/\n/g, '<br>')}</p>` : ''}
          ${pieza ? `<p class="entrega-pieza">Está en el calendario como
            <button type="button" class="enlace-pieza" data-pieza="${esc(pieza.id)}">${
              esc(pieza.titulo || 'la pieza')}</button>, para el ${
              esc(fechaLegible(pieza.fecha) || 'sin fecha')}.</p>` : ''}
        </div>
        ${mio ? `
        <div class="entrega-acciones">
          ${e.estado === 'aceptada' ? `
            <span class="entrega-cerrada">Ya está programado.<br>Si hay que cambiarlo, avísale al área.</span>`
          : `
            <button type="button" class="btn-plano" data-renombrar="${esc(e.id)}">Cambiar el nombre</button>
            <button type="button" class="btn-peligro" data-retirar="${esc(e.id)}">Retirar</button>`}
        </div>` : soloLectura('parrilla_piezas') ? '' : `
        <div class="entrega-acciones">
          ${e.estado === 'aceptada' ? '' : `
            <button type="button" class="btn-primario" data-llevar="${esc(e.id)}">
              Llevar al calendario
            </button>
            <button type="button" class="btn-plano" data-devolver="${esc(e.id)}">
              Pedir cambios
            </button>`}
          <button type="button" class="btn-plano" data-bajar="${esc(e.id)}">Descargar</button>
        </div>`}
      </article>`;
  }).join('');

  $$('[data-llevar]', cont).forEach(b =>
    b.addEventListener('click', () => llevarAlCalendario(b.dataset.llevar)));
  $$('[data-devolver]', cont).forEach(b =>
    b.addEventListener('click', () => devolverEntrega(b.dataset.devolver)));
  $$('[data-bajar]', cont).forEach(b =>
    b.addEventListener('click', () => bajarEntrega(b.dataset.bajar)));
  $$('[data-retirar]', cont).forEach(b =>
    b.addEventListener('click', () => retirarEnvio(b.dataset.retirar)));
  $$('[data-renombrar]', cont).forEach(b =>
    b.addEventListener('click', () => renombrarEnvio(b.dataset.renombrar)));
  $$('.enlace-pieza', cont).forEach(b =>
    b.addEventListener('click', () => abrirPrevia(b.dataset.pieza)));

  pintarLienzosEntrega(cont);
}

/* La primera lámina de cada entrega, para reconocerla de un vistazo.
   El video se enseña como video: un reel sin movimiento no dice si
   está bien montado. */
async function pintarLienzosEntrega(cont) {
  for (const el of $$('.entrega-lienzo', cont)) {
    const ruta = el.dataset.ruta;
    if (!ruta) { el.innerHTML = '<span class="tenue">sin archivo</span>'; continue; }
    try {
      const url = await urlDeArchivo(ruta);
      el.innerHTML = /^video\//.test(el.dataset.tipo)
        ? `<video src="${esc(url)}" muted loop playsinline preload="metadata"></video>`
        : `<img src="${esc(url)}" alt="">`;
      const v = el.querySelector('video');
      if (v) {
        el.addEventListener('mouseenter', () => v.play().catch(() => {}));
        el.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
      }
    } catch (err) {
      el.innerHTML = '<span class="tenue">no se pudo abrir</span>';
    }
  }
}

/* ── Del buzón al calendario ─────────────────────────────── */

function llevarAlCalendario(idEntrega) {
  const e = (datos.entregas.lista || []).find(x => x.id === idEntrega);
  if (!e) return;
  const arch = e.archivos || [];
  const esVideo = arch.length && /^video\//.test(arch[0].tipo || '');

  /* Los archivos NO se copian: la pieza apunta a los mismos objetos
     que ya estan en Storage. Copiarlos duplicaria el peso en una
     cuenta donde el espacio es justo lo que escasea. */
  abrirPieza(null, {
    titulo: e.titulo,
    formato: esVideo ? 'Reel' : arch.length > 1 ? 'Carrusel' : 'Foto',
    archivos: arch.map(a => ({ ruta: a.ruta, nombre: a.nombre, peso: a.peso })),
    notas: [e.notas, 'Entregado por ' + (e.creadoPor || 'creación') + '.']
      .filter(Boolean).join('\n'),
    de_entrega: e.id,
  });
}

async function devolverEntrega(idEntrega) {
  const e = (datos.entregas.lista || []).find(x => x.id === idEntrega);
  if (!e) return;
  const que = prompt('¿Qué hay que corregir?\n\nSe lo va a leer quien lo entregó.');
  if (que === null) return;
  if (!que.trim()) { avisar('Sin decir qué cambiar, el aviso no sirve de nada.'); return; }
  e.estado = 'devuelta';
  e.comentario = que.trim();
  e.actualizado = ahora();
  await guardar('entregas');
  pintarEntregas();
}

/* Retirar lo propio.
   Se puede mientras no esté programado. Una vez que el área lo
   llevó al calendario, la pieza apunta a estos mismos archivos:
   borrarlos rompería un post que ya tiene hora. Por eso ahí se
   bloquea y se dice a quién avisarle, en vez de fallar después. */
async function retirarEnvio(idEntrega) {
  const lista = (datos.entregas && datos.entregas.lista) || [];
  const e = lista.find(x => x.id === idEntrega);
  if (!e) return;
  if (e.estado === 'aceptada') {
    avisar('Ya está programado. Avísale al área para cambiarlo.');
    return;
  }
  if (!confirm(`¿Retirar «${e.titulo}»?

` +
      `Se borran ${(e.archivos || []).length} archivo(s) y no se puede deshacer.`)) return;

  for (const a of (e.archivos || [])) {
    try { await borrarArchivo(a.ruta); }
    catch (err) { /* si ya no está, da igual: lo que importa es el registro */ }
  }
  const i = lista.indexOf(e);
  if (i >= 0) lista.splice(i, 1);
  await guardar('entregas');
  avisar('Retirado.');
  pintarEntregas();
}

async function renombrarEnvio(idEntrega) {
  const e = ((datos.entregas && datos.entregas.lista) || []).find(x => x.id === idEntrega);
  if (!e) return;
  const nuevo = prompt('¿Cómo se llama esto?', e.titulo || '');
  if (nuevo === null) return;
  if (!nuevo.trim()) { avisar('Necesita un nombre para que lo reconozcan.'); return; }
  e.titulo = nuevo.trim();
  // Volvió a tocarlo: si le habían pedido cambios, deja de estar
  // devuelto y vuelve a la fila.
  if (e.estado === 'devuelta') { e.estado = 'entregada'; e.comentario = ''; }
  e.actualizado = ahora();
  await guardar('entregas');
  pintarEntregas();
}

async function bajarEntrega(idEntrega) {
  const e = (datos.entregas.lista || []).find(x => x.id === idEntrega);
  if (!e) return;
  for (const a of (e.archivos || [])) {
    try { await bajarArchivo(a.ruta); } catch (err) { avisar('No se pudo bajar ' + a.nombre); }
  }
}

/* ── Ficha ─────────────────────────────────────────────── */

function abrirEvento(idEvento, prellenado) {
  datos.parrilla.eventos = datos.parrilla.eventos || [];
  const existente = idEvento ? datos.parrilla.eventos.find(e => e.id === idEvento) : null;
  const e = existente || Object.assign({
    id: id(), tipo: 'cobertura', titulo: '', fecha: '', hora: '', hora_fin: '',
    lugar: '', solicita: '', necesita: [], estado: 'avisado', notas: '',
  }, prellenado || {});

  const t = tipoDe(e);
  const L = t.etiquetas;
  // Al cambiar de tipo el estado anterior puede no existir en el
  // nuevo: "cubierto" no significa nada en una reunion.
  if (!estadosDe(e).some(s => s.id === e.estado)) e.estado = t.estados[0].id;

  modalCtx = { tipo: 'evento', datos: e, esNuevo: !existente };
  $('#modalTitulo').textContent = existente ? 'Editar · ' + t.nombre : t.titulo;
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="grupo-campo">
      <label>Qué estás anotando</label>
      <div class="tipos-evento" id="e_tipo" role="radiogroup">
        ${TIPOS_EVENTO.map(x => `
          <button type="button" class="tipo-op${x.id === t.id ? ' activo' : ''}"
                  data-tipo="${x.id}" role="radio" aria-checked="${x.id === t.id}"
                  title="${esc(x.pista)}">
            <span class="tipo-icono" aria-hidden="true">${x.icono}</span>${esc(x.corto)}
          </button>`).join('')}
      </div>
      <span class="ayuda">${esc(t.pista)}</span>
    </div>

    <div class="grupo-campo">
      <label for="e_titulo">${esc(L.titulo)}</label>
      <input class="campo" id="e_titulo" value="${esc(e.titulo)}"
             placeholder="${esc(L.ejemplo)}">
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="e_fecha">Cuándo</label>
        <input type="date" class="campo" id="e_fecha" value="${esc(e.fecha)}">
      </div>
      <div class="grupo-campo">
        <label for="e_hora">De qué hora a qué hora</label>
        <div class="rango-hora">
          <input class="campo campo-hora" id="e_hora" list="horasSugeridas"
                 autocomplete="off" spellcheck="false" placeholder="9:00 am"
                 value="${esc(horaLegible(e.hora))}">
          <span class="rango-a" aria-hidden="true">a</span>
          <input class="campo campo-hora" id="e_hora_fin" list="horasSugeridas"
                 autocomplete="off" spellcheck="false" placeholder="opcional"
                 value="${esc(horaLegible(e.hora_fin))}">
        </div>
        <datalist id="horasSugeridas">
          ${HORAS_SUGERIDAS.map(h => `<option value="${esc(h)}">`).join('')}
        </datalist>
        <span class="ayuda" id="e_horaAyuda">Escríbela como quieras: <b>9</b>, <b>930</b>, <b>2 pm</b>, <b>14:00</b>. La de término es opcional; sirve para saber si alcanza con una salida de equipo.</span>
      </div>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="e_lugar">${esc(L.lugar)}</label>
        <input class="campo" id="e_lugar" value="${esc(e.lugar)}"
               placeholder="Auditorio, Explanada, fuera del campus…">
      </div>
      <div class="grupo-campo">
        <label for="e_solicita">${esc(L.quien)}</label>
        <input class="campo" id="e_solicita" value="${esc(e.solicita)}"
               placeholder="${esc(L.quienPista)}">
        ${t.id === 'cobertura' ? '<span class="ayuda">A futuro esto llegará solo desde la plataforma de solicitudes.</span>' : ''}
      </div>
    </div>

    <div class="fila-campos">
      ${t.necesita ? `
      <div class="grupo-campo">
        <label>Qué se necesita</label>
        <div class="opciones-canal" id="e_necesita">
          ${QUE_SE_NECESITA.map(q => {
            const marcado = necesidadesDe(e).includes(q.id);
            return `<label class="opcion-canal${marcado ? ' marcado' : ''}">
              <input type="checkbox" value="${q.id}"${marcado ? ' checked' : ''}>${esc(q.nombre)}
            </label>`;
          }).join('')}
        </div>
        <span class="ayuda">Marca todo lo que haga falta. Sirve para saber si alcanza con una salida de equipo o hay que dividirse.</span>
      </div>` : ''}
      <div class="grupo-campo">
        <label for="e_estado">Cómo va</label>
        <select class="campo" id="e_estado">
          ${estadosDe(e).map(s =>
            `<option value="${s.id}"${s.id === e.estado ? ' selected' : ''}>${esc(s.nombre)}</option>`).join('')}
        </select>
        <span class="ayuda">${esc(estadoDe(e).nota)}</span>
      </div>
    </div>

    <div class="grupo-campo">
      <label for="e_notas">Detalles${
        quienAnoto(e) ? ` <span class="tenue">· lo anotó ${esc(quienAnoto(e))}</span>` : ''}</label>
      <textarea class="campo" id="e_notas" placeholder="${esc(L.detalles)}">${esc(e.notas)}</textarea>
    </div>

    ${existente && t.cobertura ? `
    <div class="grupo-campo">
      <button type="button" class="btn-plano btn-auto ancho" id="e_cubrir">
        ◈ Programar la cobertura de este evento
      </button>
      <span class="ayuda">Crea una pieza con la fecha ya acotada: nada de cobertura puede publicarse antes de que el evento ocurra.</span>
    </div>` : ''}
  `;

  /* Se reescribe con lo que se entendio, para que lo veas antes de
     guardar en vez de descubrirlo despues en el calendario. */
  const ayudaHora = $('#e_horaAyuda');
  const ayudaOriginal = ayudaHora ? ayudaHora.innerHTML : '';
  const acomodarHoras = () => {
    let malo = '';
    [$('#e_hora'), $('#e_hora_fin')].forEach(campo => {
      if (!campo) return;
      const v = leerHora(campo.value);
      campo.classList.toggle('mal', v === null);
      if (v === null) { malo = campo.value.trim(); return; }
      campo.value = v ? horaLegible(v) : '';
    });
    if (!ayudaHora) return;
    const ini = leerHora($('#e_hora').value), fin = leerHora($('#e_hora_fin').value);
    if (malo) {
      ayudaHora.innerHTML = `No entendí <b>${esc(malo)}</b>. Prueba con algo como 9:30 am o 14:00.`;
    } else if (ini && fin && fin <= ini) {
      ayudaHora.innerHTML = 'La hora de término va antes que la de inicio.';
    } else if (ini && fin) {
      ayudaHora.innerHTML = `Dura <b>${esc(duracionEntre(ini, fin))}</b>.`;
    } else {
      ayudaHora.innerHTML = ayudaOriginal;
    }
  };
  [$('#e_hora'), $('#e_hora_fin')].forEach(c => {
    if (c) { c.addEventListener('change', acomodarHoras);
             c.addEventListener('blur', acomodarHoras); }
  });

  /* Cambiar de tipo vuelve a armar el formulario, porque cambian
     los campos y las etiquetas. Antes de rearmar se recoge lo ya
     escrito: perder el titulo por picar "Reunión" seria un castigo
     por explorar. */
  $$('#e_tipo .tipo-op').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.tipo === e.tipo) return;
    e.titulo   = ($('#e_titulo').value || '').trim();
    e.fecha    = $('#e_fecha').value;
    e.hora     = leerHora($('#e_hora').value) || '';
    e.hora_fin = leerHora($('#e_hora_fin').value) || '';
    e.lugar    = ($('#e_lugar').value || '').trim();
    e.solicita = ($('#e_solicita').value || '').trim();
    e.notas    = $('#e_notas').value;
    if ($('#e_necesita')) e.necesita = $$('#e_necesita input:checked').map(x => x.value);
    e.tipo = b.dataset.tipo;
    abrirEvento(existente ? e.id : null, existente ? null : e);
  }));

  const sel = $('#e_estado');
  if (sel) sel.addEventListener('change', () => {
    const x = estadosDe(e).find(s => s.id === sel.value);
    const ayuda = sel.parentElement.querySelector('.ayuda');
    if (ayuda && x) ayuda.textContent = x.nota;
  });

  const cubrir = $('#e_cubrir');
  if (cubrir) cubrir.addEventListener('click', () => coberturaDeEvento(e));

  mostrarModal();
}

function leerEvento() {
  const e = modalCtx.datos;
  e.titulo   = $('#e_titulo').value.trim();
  e.fecha    = $('#e_fecha').value;
  e.hora     = leerHora($('#e_hora').value);
  e.hora_fin = leerHora($('#e_hora_fin').value);
  e.lugar    = $('#e_lugar').value.trim();
  e.solicita = $('#e_solicita').value.trim();
  e.necesita = $('#e_necesita') ? $$('#e_necesita input:checked').map(x => x.value) : [];
  e.estado   = $('#e_estado').value;
  e.tipo     = e.tipo || 'cobertura';
  e.notas    = $('#e_notas').value;

  if (!e.titulo) { avisar('El evento necesita un nombre.'); return false; }
  if (!e.fecha)  { avisar('Sin fecha no se puede poner en el calendario. ¿Cuándo es?'); return false; }
  if (e.hora === null || e.hora_fin === null) {
    avisar('No entendí una de las horas. Escríbela como 9:30 am o como 14:00.');
    return false;
  }
  if (e.hora && e.hora_fin && e.hora_fin <= e.hora) {
    avisar('La hora de término va antes que la de inicio.');
    return false;
  }

  e.actualizado = ahora();
  // Quien lo anota no necesita que le avisen de lo que acaba de
  // anotar.
  if (!e.creadoPor) e.creadoPor = Almacen.usuario ? Almacen.usuario.nombre : '';
  if (modalCtx.esNuevo) {
    e.creado = ahora();
    datos.parrilla.eventos = datos.parrilla.eventos || [];
    datos.parrilla.eventos.push(e);
  }
  guardar('parrilla');
  return true;
}

/* De evento a cobertura. La ventana se acota sola: una foto del
   evento no puede publicarse antes del evento — ése fue el error
   que puso el reel de IGNITE dos días antes de IGNITE. */
function coberturaDeEvento(e) {
  /* El formato sale de lo que se pidio, con un orden de prioridad:
     si hay video se produce video, si solo hay nota es nota, y si
     no, foto. Cuando hay varias cosas se crea la primera y de ahi
     se derivan las demas. */
  const n = necesidadesDe(e);
  const formato = n.includes('video') || n.includes('transmision') || n.includes('testimonios') ? 'Reel'
                : n.includes('nota') ? 'Nota'
                : 'Foto';
  cerrarModal();
  abrirPieza(null, {
    titulo: 'Cobertura · ' + e.titulo,
    formato,
    fecha: e.fecha,
    no_antes: e.fecha,
    notas: [e.titulo,
            e.lugar ? 'Lugar: ' + e.lugar : '',
            e.hora ? 'Hora: ' + rangoHoras(e.hora, e.hora_fin) : '',
            e.notas].filter(Boolean).join('\n'),
    de_evento: e.id,
  });
}


/* ── Lo que viene ──────────────────────────────────────── */

function pintarEventos() {
  const cont = $('#listaEventos');
  if (!cont) return;

  const ahora = new Date();
  const vivos = (datos.parrilla.eventos || []).filter(e => e.estado !== 'cancelado');
  const orden = (a, b) => (a.fecha + (a.hora || '')).localeCompare(b.fecha + (b.hora || ''));

  // Lo que ya ocurrio no se lista aqui. No se pierde: sigue en el
  // calendario, en su dia. Esta barra mira hacia adelante.
  const proximos = vivos.filter(e => !yaPaso(e, ahora)).sort(orden).slice(0, 8);

  if (!proximos.length) {
    cont.innerHTML = `<div class="vacio">
      Nada anotado todavía.<br>
      Aquí van los eventos por cubrir, las reuniones, las entregas y los días
      que no estés. Con la fecha puesta, la cobertura de un evento se programa
      sola sin caer antes de que ocurra.
    </div>`;
    return;
  }

  const pintar = (e) => {
    const necesita = necesidadesDe(e)
      .map(id => (QUE_SE_NECESITA.find(x => x.id === id) || {}).nombre)
      .filter(Boolean).join(' + ');
    const dias = Math.round((aFecha(e.fecha) - aFecha(aTexto(ahora))) / 86400000);
    const cuando = dias === 0 ? 'Hoy'
                 : dias === 1 ? 'Mañana'
                 : dias === -1 ? 'Ayer'
                 : dias > 1 ? `En ${dias} días`
                 : `Hace ${-dias} días`;
    return `
      <div class="evento" data-id="${esc(e.id)}" style="--evento-tono:${colorEvento(e)}">
        <div class="evento-hora">${esc(horaLegible(e.hora) || '—')}</div>
        <div>
          <div class="evento-titulo">${esc(e.titulo)}</div>
          <div class="evento-meta">
            ${esc(fechaLegible(e.fecha))} · ${esc(cuando)}${e.lugar ? ' · ' + esc(e.lugar) : ''}
            ${necesita ? ' · ' + esc(necesita) : ''}${e.solicita ? ' · pide ' + esc(e.solicita) : ''}
          </div>
        </div>
        ${selloEstado(etiquetaEvento(e))}
      </div>`;
  };

  cont.innerHTML = proximos.map(pintar).join('');

  $$('.evento', cont).forEach(el =>
    el.addEventListener('click', () => abrirFichaEvento(el.dataset.id)));
}

/* El tiempo pasa aunque nadie toque nada. Sin esto, una reunion que
   termina a las 12 sigue en "lo que viene" hasta que algo mas
   provoque un repintado. */
setInterval(() => {
  if (document.hidden) return;
  if (!$('#modalFondo').hidden || !$('#previa').hidden) return;
  pintarEventos();
}, 120000);


/* ── Del banco al calendario ───────────────────────────────
   Tener el banco al lado sólo sirve si puedes tomar una idea y
   soltarla en un día. Al soltarla se abre la ficha con todo
   prellenado: la idea no se pierde hasta que la pieza se guarda,
   igual que al programarla con el botón. */

let ideaArrastrada = null;

function puedeProgramar() {
  return !soloLectura('parrilla_piezas');
}

function conectarArrastreDeIdeas() {
  $$('.idea[draggable="true"]').forEach(el => {
    el.addEventListener('dragstart', ev => {
      ideaArrastrada = (datos.parrilla.ideas || []).find(i => i.id === el.dataset.idea) || null;
      el.classList.add('arrastrando');
      ev.dataTransfer.effectAllowed = 'copy';
      ev.dataTransfer.setData('text/plain', el.dataset.idea);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('arrastrando');
      $$('.celda').forEach(c => c.classList.remove('recibe-idea'));
      ideaArrastrada = null;
    });
  });

  $$('.celda').forEach(celda => {
    if (celda.classList.contains('fuera')) return;

    celda.addEventListener('dragover', ev => {
      if (!ideaArrastrada) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'copy';
      celda.classList.add('recibe-idea');
    });
    celda.addEventListener('dragleave', () => celda.classList.remove('recibe-idea'));

    celda.addEventListener('drop', ev => {
      if (!ideaArrastrada) return;   // si viene una pieza, la maneja el otro
      ev.preventDefault();
      celda.classList.remove('recibe-idea');

      const idea = ideaArrastrada;
      ideaArrastrada = null;
      const fecha = celda.dataset.fecha;
      const c = clasificarTexto(idea.texto);

      if (c.no_antes && fecha < c.no_antes) {
        avisar(`Esa idea no puede ir antes del ${fechaLegible(c.no_antes)}.`);
        return;
      }

      abrirPieza(null, {
        vieneDeIdea: idea.id,
        estado: 'brief',
        titulo: c.titulo, pilar: c.pilar, formato: c.formato, canales: c.canales,
        fecha, notas: idea.texto, no_antes: c.no_antes, no_despues: c.no_despues,
        produccion: (idea.produccion && idea.produccion.length ? idea.produccion : c.produccion)
                      .map(x => '· ' + x).join('\n'),
      });
    });
  });
}


function refrescarParrilla() {
  pintarSemana();
  pintarProgreso();
  pintarBalance();
  pintarPiezas();
  pintarCalendario();
  pintarEfemerides();
  pintarEventos();
  pintarIdeas();
  conectarArrastreDeIdeas();
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
    enc.innerHTML = DIAS_CORTOS.map((d, i) =>
      `<span class="dia-nombre${i >= 5 ? ' finde' : ''}">${d}</span>`).join('');
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
      // Para RELLENAR va la variante solida, no la de tinta: es la
      // que esta medida contra el texto que se le pone encima.
      const relleno = pil ? pil.solido : 'var(--linea-control)';
      /* Dos y no tres: en la caja del calendario la tercera queda del
   tamano de una estampilla, y el contador tiene que cuadrar con
   lo que se ve. */
      const collage = collageDe(p, 2);
      /* El arte manda. Antes ganaba p.imagen, que es la miniatura
         provisional: quien subia una referencia y despues el arte
         de verdad seguia viendo la referencia en el calendario, y
         no habia forma de entender por que. */
      const img = collage
        ? collage
        : p.imagen ? `<img class="cal-miniatura" src="${esc(p.imagen)}" alt="" loading="lazy">` : '';
      const acotada = p.no_antes || p.no_despues;
      const rotulo = p.no_antes ? `Sólo a partir del ${fechaLegible(p.no_antes)}`
                   : p.no_despues ? `Sólo hasta el ${fechaLegible(p.no_despues)}` : '';
      return `
        <div class="cal-pieza${p.imagen || collage ? '' : ' sin-imagen'}${LISTO_PARA_SALIR.includes(p.estado) ? ' lista' : ''}${p.estado === 'publicado' ? ' publicada' : ''}${marcaAprobacion(p)}" data-id="${esc(p.id)}" style="--pieza-tono:${relleno}"
             draggable="true" title="${esc(p.titulo)}${rotulo ? ' — ' + esc(rotulo) : ''}">
          ${img}
          <div class="cal-cuerpo" style="border-left-color:${color}">
            <div class="cal-titulo">${acotada ? '<span class="marca-ventana" title="' + esc(rotulo) + '">⧖</span> ' : ''}${
              esc(p.titulo || 'Sin título')}</div>
            <div class="cal-meta">${selloEstado(etiquetaPieza(p))}${
              p.formato ? `<span class="cal-formato">${esc(p.formato)}</span>` : ''}</div>
          </div>
        </div>`;
    }).join('');

    const eventos = eventosDe(txt).map(ev => {
      const q = necesidadesDe(ev)
        .map(id => (QUE_SE_NECESITA.find(x => x.id === id) || {}).nombre)
        .filter(Boolean).join(' + ');
      return `
      <div class="cal-evento" data-evento="${esc(ev.id)}"
           style="--evento-tono:${colorEvento(ev)}"
           title="${esc(ev.titulo)}${ev.lugar ? ' — ' + esc(ev.lugar) : ''}${q ? ' — ' + esc(q) : ''}">
        <div class="cal-evento-alto">${selloEstado(etiquetaEvento(ev))}</div>
        <div class="cal-evento-bajo">
          ${ev.hora ? `<span class="hora">${esc(horaLegible(ev.hora))}</span>` : ''}
          <span class="titulo">${esc(ev.titulo)}</span>
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
        ${eventos}
        ${piezas}
      </div>`);
  }

  const cont = $('#calendarioMes');
  cont.innerHTML = celdas.join('');

  $$('.cal-pieza', cont).forEach(el =>
    el.addEventListener('click', () => abrirPrevia(el.dataset.id)));
  $$('.cal-evento', cont).forEach(el =>
    el.addEventListener('click', ev => { ev.stopPropagation(); abrirFichaEvento(el.dataset.evento); }));
  $$('.celda-agregar', cont).forEach(b =>
    b.addEventListener('click', ev => { ev.stopPropagation(); abrirPieza(null, { fecha: b.dataset.fecha }); }));

  conectarArrastre(cont);
  pintarMiniaturas(cont);
}

/* ── Reordenar las laminas de un carrusel ──────────────── */

/* POR QUE ESTO GUARDA SOLO Y NO ESPERA AL BOTON DE GUARDAR

   Porque si no, el acomodo se pierde sin avisar. Al sincronizar,
   los registros que cambiaron se REEMPLAZAN en la lista
   (lista[i] = registro), asi que el objeto que la ficha abierta
   trae en la mano se queda huerfano: seguir escribiendole no le
   llega a nadie, y ademas la sincronizacion vuelve a tomar la
   copia base, asi que ya ni se puede recuperar. Una sincronizacion
   entre el acomodo y el boton se lo llevaba entero.

   Aparte, arrastrar en esta aplicacion ya significa "queda asi":
   mover una pieza en el calendario guarda al soltar. Que aqui no
   lo hiciera era la incoherencia, no lo contrario. */
/* Volver a numerar SIN reconstruir la ficha.

   Repintarla entera despues de cada arrastre tiraba el scroll al
   principio: acomodabas la septima lamina y la pagina se te iba
   hasta arriba, a buscarla otra vez. Y encima sobraba -- el nodo ya
   quedo donde lo soltaste; lo unico que hay que corregir son los
   numeros y los indices de los botones. */
function renumerarLaminas() {
  const caja = $('#listaLaminas');
  if (!caja) return;
  $$('.lamina', caja).forEach((t, i) => {
    t.dataset.lamina = i;
    const n = $('.lamina-n', t);
    if (n) n.textContent = i + 1;
    const d = $('[data-descargar]', t); if (d) d.dataset.descargar = i;
    const q = $('[data-quitar]', t);    if (q) q.dataset.quitar = i;
    const x = $('[data-reemplazar]', t); if (x) x.dataset.reemplazar = i;
  });
}

/* Cuando SI hay que reconstruir -- al subir o al quitar, que cambian
   cuantas hay -- por lo menos no perder el sitio donde estabas. */
/* Cuantas hay y el texto de ayuda, al vuelo. Reconstruir la ficha
   entera para cambiar dos frases costaba el scroll Y lo que
   estuvieras escribiendo sin guardar. */
function refrescarRotuloLaminas() {
  const caja = $('#listaLaminas');
  if (!caja) return;
  const n = $$('.lamina', caja).length;
  const grupo = caja.closest('.grupo-campo');
  const rotulo = grupo && $('label', grupo);
  if (rotulo) rotulo.textContent = 'Arte final' + (n > 1 ? ` · ${n} láminas` : '');
  const ayuda = grupo && $('.ayuda', grupo);
  if (ayuda) {
    ayuda.textContent = n
      ? 'El orden importa: la primera lámina es la que detiene el pulgar. Arrastra para reacomodar — o con el teclado, ← y → sobre la lámina. El acomodo se guarda solo.'
      : 'Todavía no hay arte. Subelo aquí y el equipo lo podrá bajar en calidad completa — y se verá en la vista previa como va a salir.';
  }
  const btn = $('#btnSubirArchivo');
  if (btn && !btn.disabled) btn.textContent = n ? '+ Agregar láminas' : 'Subir arte final';
}

function asentarLaminas(mensaje) {
  const d = modalCtx && modalCtx.datos;
  if (!d) return;
  delete d.archivo;                 // el campo viejo se retira al migrar
  if (modalCtx.esNuevo) {           // todavia no existe: viaja al crearla
    avisar(mensaje.replace(', ya guardado', ''));
    return;
  }
  d.actualizado = ahora();
  guardar('parrilla');
  /* Sin esto el calendario se queda con el collage viejo: la ficha
     decia una cosa y la tarjeta de atras otra, y las dos con razon
     desde su punto de vista. */
  refrescarParrilla();
  avisar(mensaje);
}

/* Las flechitas obligaban a contar posiciones en la cabeza: para
   llevar la septima al frente eran seis clics y perder la cuenta.
   Se arrastra, que es lo que la mano ya quiere hacer.

   Con eventos de puntero y no con el drag-and-drop del navegador,
   porque aquel no existe en pantalla tactil y esto se va a usar
   desde el telefono. La captura va en el contenedor, no en la
   lamina: la lamina se mueve de sitio a media maniobra y perderia
   la captura. */
function conectarArrastreLaminas(laminas) {
  const caja = $('#listaLaminas');
  if (!caja || caja.children.length < 2) return;
  if (soloLectura('parrilla_piezas')) {
    $$('.lamina', caja).forEach(t => t.classList.add('quieta'));
    return;
  }

  let teja = null, px = 0, py = 0, viajando = false;

  const aplicarOrden = () => {
    const orden = $$('.lamina', caja).map(t => +t.dataset.lamina);
    const l = laminas();
    if (orden.length !== l.length || orden.some(i => isNaN(i) || !l[i])) return;
    if (orden.every((v, i) => v === i)) return;      // no se movio nada
    modalCtx.datos.archivos = orden.map(i => l[i]);
    renumerarLaminas();          // el nodo ya esta en su sitio
    asentarLaminas('Orden nuevo, ya guardado.');
  };

  const terminar = () => {
    if (!teja) return;
    teja.style.transform = '';
    teja.classList.remove('viajando');
    caja.classList.remove('reordenando');
    const hubo = viajando;
    teja = null; viajando = false;
    if (hubo) aplicarOrden();
  };

  caja.addEventListener('pointerdown', ev => {
    const t = ev.target.closest('.lamina');
    if (!t || ev.target.closest('button')) return;
    if (ev.button) return;                            // solo el boton principal
    teja = t; px = ev.clientX; py = ev.clientY; viajando = false;
    // Si la captura falla, el arrastre sigue sirviendo mientras el
    // dedo no se salga de la caja. Peor eso que romperlo entero.
    try { caja.setPointerCapture(ev.pointerId); } catch (e) {}
  });

  caja.addEventListener('pointermove', ev => {
    if (!teja) return;
    if (!viajando) {
      // Un clic limpio sigue siendo un clic: no arrastra hasta que
      // la mano se mueva de verdad.
      if (Math.abs(ev.clientX - px) + Math.abs(ev.clientY - py) < 6) return;
      viajando = true;
      teja.classList.add('viajando');
      caja.classList.add('reordenando');
    }
    teja.style.transform = `translate(${ev.clientX - px}px, ${ev.clientY - py}px)`;

    // Donde caeria: la lamina cuyo centro queda mas cerca del dedo.
    // La vertical pesa el triple porque las filas son fronteras: si
    // se mide plano, al arrimarse al borde izquierdo la lamina de
    // abajo le gana el hueco a la vecina de al lado y el orden pega
    // brincos que nadie pidio.
    let cerca = null, corta = Infinity;
    $$('.lamina', caja).forEach(o => {
      if (o === teja) return;
      const r = o.getBoundingClientRect();
      const d = Math.abs(ev.clientX - (r.left + r.width / 2))
              + Math.abs(ev.clientY - (r.top + r.height / 2)) * 3;
      if (d < corta) { corta = d; cerca = o; }
    });
    if (!cerca) return;

    const r = cerca.getBoundingClientRect();
    const despues = ev.clientX > r.left + r.width / 2;
    const vecino = despues ? cerca.nextElementSibling : cerca;
    if (vecino === teja || (despues && cerca === teja)) return;
    caja.insertBefore(teja, vecino);
    // El translate se mide desde donde estaba; al cambiarla de sitio
    // hay que reanclar o pega un brinco del tamano de la teja.
    px = ev.clientX; py = ev.clientY;
    teja.style.transform = '';
  });

  caja.addEventListener('pointerup', terminar);
  caja.addEventListener('pointercancel', terminar);

  /* Arrastrar no le sirve a quien va por teclado, y aqui hay gente
     que revisa sin mouse. Flechas sobre la lamina enfocada. */
  caja.addEventListener('keydown', ev => {
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
    const t = ev.target.closest('.lamina');
    if (!t) return;
    ev.preventDefault();
    const i = +t.dataset.lamina, l = laminas();
    const j = ev.key === 'ArrowLeft' ? i - 1 : i + 1;
    if (j < 0 || j >= l.length) return;
    [l[i], l[j]] = [l[j], l[i]];
    // Con teclado el nodo NO se movio solo: hay que moverlo.
    const caja2 = $('#listaLaminas');
    const tejas = $$('.lamina', caja2);
    if (j > i) caja2.insertBefore(tejas[i], tejas[j].nextElementSibling);
    else caja2.insertBefore(tejas[i], tejas[j]);
    modalCtx.datos.archivos = l;
    renumerarLaminas();
    asentarLaminas('Orden nuevo, ya guardado.');
    const nueva = $$('.lamina', caja2)[j];
    if (nueva) nueva.focus();
  });
}


/* ── Arrastrar y soltar en el calendario ───────────────── */

let piezaArrastrada = null;

function conectarArrastre(cont) {
  // Sin permiso de escritura no se arrastra: mover una pieza en el
  // calendario y verla regresar sola sería peor que no poder moverla.
  if (soloLectura('parrilla_piezas')) {
    $$('.cal-pieza', cont).forEach(el => el.removeAttribute('draggable'));
    return;
  }
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

  if (!p.formato) p.formato = 'Foto';
  const info = infoFormato(p.formato);

  modalCtx = { tipo: 'pieza', datos: p, esNuevo: !existente };

  $('#modalTitulo').textContent = existente ? 'Editar pieza' : 'Nueva pieza';
  $('#modalEliminar').hidden = !existente;

  $('#modalCuerpo').innerHTML = `
    <div class="grupo-campo">
      <label for="f_titulo">Título de la pieza</label>
      <input class="campo" id="f_titulo" value="${esc(p.titulo)}" placeholder="Ej. Carrusel talleres culturales otoño">
    </div>

    <div class="grupo-campo">
      <label>Qué es</label>
      <div class="tipos-evento" id="f_formato" role="radiogroup">
        ${FORMATOS.map(x => {
          const i = infoFormato(x);
          return `<button type="button" class="tipo-op${x === (p.formato || 'Foto') ? ' activo' : ''}"
                  data-formato="${esc(x)}" role="radio" aria-checked="${x === p.formato}">
            <span class="tipo-icono" aria-hidden="true">${i.icono}</span>${esc(x)}
          </button>`;
        }).join('')}
      </div>
      ${info.espec ? `<span class="ayuda">${esc(info.espec)}</span>` : ''}
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="f_pilar">Pilar</label>
        <select class="campo" id="f_pilar">
          ${PILARES.map(x => `<option value="${x.id}"${x.id === p.pilar ? ' selected' : ''}>${esc(x.nombre)}</option>`).join('')}
        </select>
        <span class="ayuda" id="ayudaPilar"></span>
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
        <label for="f_hora">Hora</label>
        <input class="campo" type="time" id="f_hora" value="${esc(p.hora || '')}">
      </div>
      <div class="grupo-campo">
        <label for="f_estado">Estado</label>
        <select class="campo" id="f_estado">
          ${ESTADOS.map(x => `<option value="${x.id}"${x.id === p.estado ? ' selected' : ''}>${esc(x.nombre)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="grupo-campo">
      <label class="check-inline">
        <input type="checkbox" id="f_autopublicar"${p.autopublicar ? ' checked' : ''}>
        <span>Publicar sola a su hora</span>
      </label>
      <span class="ayuda">Si está aprobada y tiene arte, sale sin que nadie apriete nada — a la hora de arriba, hora de Tijuana. Aprobar y armar la salida son dos actos distintos: por eso esto se enciende aparte.</span>
    </div>

    <div class="grupo-campo ventana${p.no_antes || p.no_despues ? '' : ' guardada'}" id="grupoVentana">
      <button type="button" class="abrir-ventana" id="abrirVentana">
        Acotar en qué fechas puede salir <span aria-hidden="true">▾</span>
      </button>
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
      <span class="ayuda">Acomodar pendientes y el arrastre en el calendario los respetan.</span>
    </div>

    <div class="fila-campos">
      <div class="grupo-campo">
        <label for="f_responsable">Responsable</label>
        <input class="campo" id="f_responsable" list="lista_responsables"
               value="${esc(p.responsable)}" placeholder="Quién produce esta pieza"
               autocomplete="off">
        <datalist id="lista_responsables">
          ${equipoConocido().map(n => `<option value="${esc(n)}"></option>`).join('')}
        </datalist>
        <span class="ayuda">Escribe o elige de la lista.</span>
      </div>
      ${!info.experto ? '' : `
      <div class="grupo-campo">
        <label for="f_experto">Experto que participa</label>
        <select class="campo" id="f_experto">
          <option value="">Ninguno</option>
          ${(datos.expertos.personas || []).map(x =>
            `<option value="${esc(x.id)}"${x.id === p.experto ? ' selected' : ''}>${esc(x.nombre)}${x.departamento ? ' · ' + esc(x.departamento) : ''}</option>`).join('')}
        </select>
        <span class="ayuda">Lleva la cuenta de a quién ya recurriste.</span>
      </div>`}
    </div>

    ${info.quiere === 'ninguno' || (archivosDe(p).length && !p.imagen) ? '' : `
    <div class="grupo-campo sangrado">
      <label>${archivosDe(p).length
        ? 'Miniatura provisional <span class="tenue">· ya no se usa, el arte manda</span>'
        : 'Mientras no hay arte'}</label>
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
      <span class="ayuda">${archivosDe(p).length
        ? 'Ya hay arte, así que el calendario enseña el arte. Puedes quitarla.'
        : 'Opcional. Una imagen cualquiera para que la pieza no se vea vacía en el calendario; en cuanto subas lo de arriba, se usa eso.'}</span>
    </div>`}

    ${info.quiere === 'ninguno' ? '' : `
    <div class="grupo-campo">
      <label>${esc(info.arte)}${
        info.quiere === 'laminas' && archivosDe(p).length ? ' · ' + archivosDe(p).length : ''}</label>
      <div class="laminas" id="listaLaminas">
        ${archivosDe(p).map(dibujarLamina).join('')}
      </div>
      ${archivosDe(p).length
        ? (info.quiere === 'laminas'
            ? `<span class="ayuda">${esc(info.ayuda || '')} Arrastra para reacomodar — o con el teclado, ← y → sobre la lámina. El acomodo se guarda solo.</span>`
            : '<span class="ayuda">Se guarda tal cual llegó. La vista previa lo enseña como va a salir.</span>')
        : `<span class="ayuda">${esc(info.espec)}${info.ayuda ? ' ' + esc(info.ayuda) : ''}</span>`}
      ${info.minimo && archivosDe(p).length && archivosDe(p).length < info.minimo
        ? `<span class="ayuda alerta-campo">Un carrusel necesita al menos ${info.minimo} láminas. Llevas ${archivosDe(p).length}.</span>` : ''}
      <input type="file" id="f_archivo" ${info.quiere === 'laminas' ? 'multiple' : ''} hidden>
      <input type="file" id="f_reemplazo" hidden>
      <div class="imagen-acciones">
        <button type="button" class="btn-plano" id="btnSubirArchivo">${
          archivosDe(p).length
            ? (info.quiere === 'laminas' ? '+ Agregar láminas' : 'Reemplazar')
            : 'Subir ' + (info.quiere === 'laminas' ? 'las láminas'
                        : info.quiere === 'video' ? 'el video' : 'la imagen')}</button>
      </div>
    </div>`}

    

    <div class="grupo-campo">
      <label for="f_notas">De dónde viene</label>
      <textarea class="campo" id="f_notas" placeholder="Lo que ya trae: la idea original, los detalles del evento, lo que dijo quien la entregó">${esc(p.notas)}</textarea>
      <span class="ayuda">Se llena solo cuando la pieza nace de una idea, de un evento por cubrir o de algo que entregó Creación.</span>
    </div>

    <div class="grupo-campo">
      <label for="f_copy">Copy</label>
      <textarea class="campo" id="f_copy" placeholder="El texto que acompaña la publicación">${esc(p.copy)}</textarea>
    </div>

    ${!info.copyFb ? '' : `
    <div class="grupo-campo">
      <label for="f_copy_fb">Copy para Facebook <span class="tenue">· opcional</span></label>
      <textarea class="campo" id="f_copy_fb" rows="3"
        placeholder="Déjalo vacío y sale el mismo de arriba">${esc(p.copy_fb || '')}</textarea>
      <span class="ayuda">En Instagram el copy va largo y con etiquetas al final; en Facebook las etiquetas estorban y se lee mejor corto. Si aquí no escribes nada, Facebook usa el de arriba.</span>
      <span class="ayuda">El copy se trabaja en sesión con Claude, donde puedes iterarlo. Aquí se guarda el resultado.</span>
    </div>`}

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

  /* Cambiar de formato vuelve a armar la ficha, porque cambia lo
     que se pide. Antes se recoge lo escrito: perder el título por
     picar "Carrusel" sería un castigo por elegir bien. */
  $$('#f_formato .tipo-op').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.formato === p.formato) return;
    const leer = id => { const el = $('#' + id); return el ? el.value : undefined; };
    p.titulo      = (leer('f_titulo') || '').trim();
    p.fecha       = leer('f_fecha')  ?? p.fecha;
    p.hora        = leer('f_hora')   ?? p.hora;
    p.estado      = leer('f_estado') ?? p.estado;
    p.pilar       = leer('f_pilar')  ?? p.pilar;
    p.responsable = (leer('f_responsable') || '').trim();
    p.notas       = leer('f_notas')  ?? p.notas;
    p.copy        = leer('f_copy')   ?? p.copy;
    if ($('#f_copy_fb')) p.copy_fb = $('#f_copy_fb').value;
    if ($('#f_experto')) p.experto = $('#f_experto').value;
    if ($('#f_canales')) p.canales = $$('#f_canales input:checked').map(x => x.value);
    p.formato = b.dataset.formato;
    abrirPieza(existente ? p.id : null, existente ? null : p);
  }));

  /* Miniatura provisional. El bloque ya no se dibuja cuando hay
     arte final y no hay miniatura vieja, asi que puede no existir. */
  const zonaImg = $('#zonaImagen');
  const abrirSelector = () => $('#f_imagen').click();
  if (zonaImg) {
  zonaImg.addEventListener('click', abrirSelector);
  $('#btnCambiarImagen').addEventListener('click', abrirSelector);
  $('#f_imagen').addEventListener('change', e => subirImagen(e.target.files[0]));
  const btnQuitar = $('#btnQuitarImagen');
  if (btnQuitar) btnQuitar.addEventListener('click', () => {
    modalCtx.datos.imagen = '';
    const z = $('#zonaImagen');
    z.classList.remove('con-imagen');
    z.innerHTML = '<div class="pista">Haz clic para subir la miniatura que se verá en el calendario</div>';
    btnQuitar.remove();
    $('#btnCambiarImagen').textContent = 'Subir imagen';
  });
  }

  /* Acotar fechas se pide poco: arranca guardado y se abre de un
     clic. Antes ocupaba dos selectores de fecha y tres renglones de
     explicacion en TODA pieza, se usaran o no. */
  const abrirVentana = $('#abrirVentana');
  if (abrirVentana) abrirVentana.addEventListener('click', () => {
    $('#grupoVentana').classList.remove('guardada');
    $('#f_no_antes').focus();
  });

  /* El archivo final. Sube el original tal cual -- sin reducir --
     porque el punto de este bloque es justo lo que la miniatura no
     puede dar. */
  /* Varias laminas de una vez. Se suben en el orden en que se
     eligieron, que es el que la gente espera. */
  /* El formato Texto no lleva arte, asi que este bloque puede no
     existir. Se guarda entero en vez de campo por campo. */
  if ($('#f_archivo')) {
  $('#f_archivo').addEventListener('change', async ev => {
    const elegidos = [...ev.target.files];
    if (!elegidos.length) return;
    if (modalCtx.esNuevo) {
      avisar('Guarda la pieza primero: las laminas se cuelgan de ella.');
      return;
    }
    // La cubeta topa en 50 MB. Un video de un minuto en vertical cabe;
    // uno de tres, no. Mas vale decirlo aqui que a la mitad de la subida.
    const grandes = elegidos.filter(f => f.size > 50 * 1024 * 1024);
    if (grandes.length) {
      fallo(new Error(`«${grandes[0].name}» pasa de 50 MB. Si es video, ` +
                      `expórtalo más corto o con menos calidad.`));
      return;
    }

    const b = $('#btnSubirArchivo');
    b.disabled = true;
    const d = modalCtx.datos;
    d.archivos = archivosDe(d);
    const nuevas = [];
    try {
      for (let i = 0; i < elegidos.length; i++) {
        b.textContent = `Subiendo ${i + 1} de ${elegidos.length}…`;
        const lamina = await subirLamina(d.id, elegidos[i]);
        d.archivos.push(lamina);
        nuevas.push(lamina);
      }
      /* Se agregan al final, que es donde quedaron en el array.
         Reconstruir la ficha aqui borraria lo que hayas escrito en
         los campos y todavia no guardes. */
      const caja = $('#listaLaminas');
      nuevas.forEach((a, k) => {
        caja.insertAdjacentHTML('beforeend', dibujarLamina(a, d.archivos.length - nuevas.length + k));
        const teja = caja.lastElementChild;
        conectarQuitar($('[data-quitar]', teja));
        conectarDescargar($('[data-descargar]', teja));
        conectarReemplazar($('[data-reemplazar]', teja));
      });
      renumerarLaminas();
      refrescarRotuloLaminas();
      pintarMiniaturas(caja);
      conectarArrastreLaminas(laminas);
      asentarLaminas(`${elegidos.length} lámina(s) arriba.`);
    } catch (e) {
      fallo(e);
    } finally {
      b.disabled = false;
      /* Sin esto, volver a elegir EL MISMO archivo no dispara nada:
         el navegador no manda 'change' si el valor no cambio, asi que
         el segundo intento no hace absolutamente nada y tampoco lo
         dice. Parece que subiste algo y no subiste nada. */
      ev.target.value = '';
    }
  });
  $('#btnSubirArchivo').addEventListener('click', () => $('#f_archivo').click());

  /* Un fallo al subir tiene que quedarse a la vista donde estabas
     mirando. El aviso de arriba se va solo en unos segundos y este
     es justo el que no te puedes perder. */
  function fallo(e) {
    const mensaje = (e && e.message) || 'No se pudo subir.';
    avisar(mensaje);
    const grupo = $('#listaLaminas') && $('#listaLaminas').closest('.grupo-campo');
    if (!grupo) return;
    let aviso = $('.lamina-error', grupo);
    if (!aviso) {
      aviso = document.createElement('p');
      aviso.className = 'lamina-error';
      aviso.setAttribute('role', 'alert');
      grupo.insertBefore(aviso, $('.imagen-acciones', grupo));
    }
    aviso.textContent = '⚠ ' + mensaje;
  }
  const limpiarFallo = () => { const a = $('.lamina-error'); if (a) a.remove(); };

  /* REEMPLAZAR, que es lo que la gente busca cuando corrige un arte.
     Sin esto lo unico que habia era "+ Agregar", que deja la version
     vieja dentro y obliga a borrarla a mano -- y en un post de una
     sola imagen ni siquiera parece la opcion correcta. */
  let aReemplazar = null;
  $('#f_reemplazo').addEventListener('change', async ev => {
    const f = ev.target.files[0];
    const i = aReemplazar;
    aReemplazar = null;
    ev.target.value = '';
    if (!f || i === null) return;
    if (f.size > 50 * 1024 * 1024) {
      fallo(new Error(`«${f.name}» pasa de 50 MB. Si es video, expórtalo más corto o con menos calidad.`));
      return;
    }

    const teja = $$('.lamina', $('#listaLaminas'))[i];
    if (teja) teja.classList.add('cargando');
    limpiarFallo();
    try {
      const l = laminas();
      l[i] = await subirLamina(modalCtx.datos.id, f);
      if (teja) {
        teja.outerHTML = dibujarLamina(l[i], i);
        const nueva = $$('.lamina', $('#listaLaminas'))[i];
        conectarQuitar($('[data-quitar]', nueva));
        conectarDescargar($('[data-descargar]', nueva));
        conectarReemplazar($('[data-reemplazar]', nueva));
        pintarMiniaturas(nueva);
      }
      asentarLaminas(`Lámina ${i + 1} cambiada por «${f.name}».`);
    } catch (e) {
      fallo(e);
      if (teja) teja.classList.remove('cargando');
    }
  });

  const conectarReemplazar = b => b.addEventListener('click', () => {
    aReemplazar = +b.dataset.reemplazar;
    limpiarFallo();
    $('#f_reemplazo').click();
  });
  $$('[data-reemplazar]').forEach(conectarReemplazar);
  }

  const laminas = () => { const d = modalCtx.datos; d.archivos = archivosDe(d); return d.archivos; };


  pintarMiniaturas($('#modalCuerpo'));
  conectarArrastreLaminas(laminas);

  const conectarDescargar = b => b.addEventListener('click', async () => {
    avisar('Bajando…');
    try { await bajarArchivo(laminas()[+b.dataset.descargar].ruta); }
    catch (e) { avisar(e.message); }
  });
  $$('[data-descargar]').forEach(conectarDescargar);
  const conectarQuitar = b => b.addEventListener('click', () => {
    const l = laminas();
    const fuera = l.splice(+b.dataset.quitar, 1)[0];
    const teja = b.closest('.lamina');
    if (teja) teja.remove();
    renumerarLaminas();
    refrescarRotuloLaminas();
    asentarLaminas(`«${fuera.nombre || 'Lámina'}» fuera del post.`);
  });
  $$('[data-quitar]').forEach(conectarQuitar);

  mostrarModal();
}

/* ══════════════════════════════════════════════════════════
   EL ARCHIVO DE VERDAD

   La miniatura que se ve en el calendario mide 480px: sirve para
   reconocer la pieza de un vistazo y para nada más. Quien la
   descargara recibiría una vista previa, no el entregable.

   El original vive en una cubeta aparte y se baja con la sesión de
   quien entra. La cubeta NO es pública: sin sesión no se abre, ni
   aunque alguien adivine la dirección.
   ══════════════════════════════════════════════════════════ */

const CUBETA = 'piezas';

/* ── Especificación de entrega ─────────────────────────────
   Instagram RECOMPRIME todo. Un master de 200 MB no llega mejor:
   llega comprimido dos veces, la del master y la de Instagram
   encima. Lo que conserva la calidad es entregar ya en su
   especificación, para que su codificador reciba material limpio y
   comprima una sola vez.

   Por eso esto no es un trámite de tamaño: es la parte que protege
   la calidad. Se leen los metadatos REALES del archivo antes de
   subir nada.

   El tope de 50 MB no lo elegimos: es el máximo por archivo del
   plan de Supabase donde vive todo. Un reel de 40 s a buena tasa
   cabe holgado; uno de dos minutos no, y ése no es un reel. */
const TOPE_ARCHIVO = 50 * 1024 * 1024;

const ESPEC = {
  video: {
    tipos: ['video/mp4', 'video/quicktime'],
    proporcion: 9 / 16,      // vertical
    anchoIdeal: 1080,
    anchoMinimo: 720,
    segundosMax: 90,
  },
  imagen: {
    tipos: ['image/jpeg', 'image/png', 'image/webp'],
    anchoIdeal: 1080,
    anchoMinimo: 1080,
    topeInstagram: 8 * 1024 * 1024,
  },
};

/* Ancho, alto y duración de verdad, leídos del archivo. Devuelve
   null si el navegador no puede abrirlo, que ya es información. */
function medirVideo(archivo) {
  return new Promise(listo => {
    const url = URL.createObjectURL(archivo);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    const fin = (r) => { URL.revokeObjectURL(url); listo(r); };
    v.onloadedmetadata = () => {
      /* Un .mov de ProRes carga sus metadatos pero no trae pista que
         el navegador sepa decodificar: videoWidth queda en 0. Eso no
         es "no se pudo leer", es un dato -- y de los buenos, porque
         Instagram tampoco lo va a aceptar. */
      if (!v.videoWidth) {
        return fin({ ancho: 0, alto: 0, segundos: v.duration, indescifrable: true });
      }
      fin({ ancho: v.videoWidth, alto: v.videoHeight, segundos: v.duration });
    };
    v.onerror = () => fin(null);
    setTimeout(() => fin(null), 15000);   // un archivo roto no cuelga la página
    v.src = url;
  });
}

function medirImagen(archivo) {
  return new Promise(listo => {
    const url = URL.createObjectURL(archivo);
    const i = new Image();
    const fin = (r) => { URL.revokeObjectURL(url); listo(r); };
    i.onload = () => fin({ ancho: i.naturalWidth, alto: i.naturalHeight });
    i.onerror = () => fin(null);
    i.src = url;
  });
}

function segundosLegibles(s) {
  if (!s || !isFinite(s)) return '';
  const m = Math.floor(s / 60), r = Math.round(s % 60);
  return m ? `${m}:${String(r).padStart(2, '0')}` : `${r} s`;
}

/* Devuelve qué es, qué mide y qué le falta. Los problemas IMPIDEN
   subir; los avisos no — que algo sea horizontal puede ser
   intencional, y no me toca a mí decidirlo. */
async function revisarEntrega(archivo) {
  const esVideo = /^video\//.test(archivo.type);
  const esImagen = /^image\//.test(archivo.type);
  const r = {
    archivo,                       // el File mismo: sin el no hay que subir
    nombre: archivo.nombre || archivo.name,
    peso: archivo.size,
    tipo: archivo.type,
    clase: esVideo ? 'video' : esImagen ? 'imagen' : 'otro',
    problemas: [], avisos: [],
  };

  if (!esVideo && !esImagen) {
    r.problemas.push('No es video ni imagen. Sube el material listo para publicar.');
    return r;
  }

  const e = esVideo ? ESPEC.video : ESPEC.imagen;
  if (!e.tipos.includes(archivo.type)) {
    r.problemas.push(esVideo
      ? 'Instagram sólo acepta MP4 y MOV. Exporta a MP4 con H.264.'
      : 'Usa JPG o PNG.');
  }

  if (archivo.size > TOPE_ARCHIVO) {
    r.problemas.push(`Pesa ${pesoLegible(archivo.size)} y el máximo son 50 MB. ` +
      (esVideo ? 'Exporta a 1080×1920 con H.264 a unos 10 Mbps.' : 'Guárdala a 1080 px de ancho.'));
  }

  const m = esVideo ? await medirVideo(archivo) : await medirImagen(archivo);
  if (!m) {
    r.avisos.push('No pude leer sus medidas. Revisa que el archivo abra bien.');
    return r;
  }
  Object.assign(r, m);

  if (m.indescifrable) {
    r.problemas.push('El navegador no puede decodificar este video. Casi siempre es ' +
      'ProRes, DNxHD o algún códec de edición: sirve para montar, no para publicar. ' +
      'Instagram tampoco lo acepta. Exporta a MP4 con H.264.');
    return r;
  }

  if (esVideo) {
    const prop = m.ancho / m.alto;
    if (prop > 0.75) {
      r.avisos.push(`Es horizontal (${m.ancho}×${m.alto}). Un reel se ve vertical, 1080×1920.`);
    } else if (Math.abs(prop - e.proporcion) > 0.06) {
      r.avisos.push(`La proporción es ${prop.toFixed(2)}:1 y un reel va a 0.56:1 (9:16).`);
    }
    if (m.ancho < e.anchoMinimo) {
      r.avisos.push(`Mide ${m.ancho} px de ancho. Instagram lo va a ver borroso; exporta a 1080.`);
    }
    if (m.segundos > e.segundosMax) {
      r.avisos.push(`Dura ${segundosLegibles(m.segundos)}. Un reel llega a 90 segundos.`);
    }
  } else {
    if (m.ancho < e.anchoMinimo) {
      r.avisos.push(`Mide ${m.ancho} px de ancho. Instagram pide 1080 para que no se vea suave.`);
    }
    if (archivo.size > e.topeInstagram) {
      r.avisos.push(`Instagram recomprime las fotos de más de 8 MB. Ésta pesa ${pesoLegible(archivo.size)}.`);
    }
  }

  return r;
}

function nombreLimpio(nombre) {
  // Sin acentos ni espacios: un nombre así rompe la petición hoy y
  // rompe a alguien más dentro de seis meses.
  const punto = nombre.lastIndexOf('.');
  const ext = punto > 0 ? nombre.slice(punto).toLowerCase() : '';
  const base = (punto > 0 ? nombre.slice(0, punto) : nombre)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return (base || 'archivo') + ext;
}

/* La previa se ve casi siempre en el telefono, muchas veces con
   datos. Un JPG de camara son 7 MB por lamina: ocho laminas serian
   50 MB para MIRAR un post, y a ese precio nadie revisa nada. Se
   sube tambien una version de pantalla. El original no se toca --
   quien lo vaya a descargar lo baja completo. */
const ANCHO_PREVIA = 1600;   // para mirar el post
const ANCHO_SELLO = 480;     // para el collage de la tarjeta

/* ── La que se publica ─────────────────────────────────────
   Meta recomprime toda foto que recibe. Hasta aquí se le mandaba la
   de 1600 al 82%, que se hizo para MIRAR el post en el celular sin
   gastar datos. Como material de publicación es mala: el 82% ya
   dejó artefactos, y encima va la compresión de Meta. Dos pérdidas
   donde debería haber una.

   Lo mejor es mandarle el ORIGINAL y que comprima una sola vez.
   Sólo cuando el original no cabe en su límite se hace una versión
   propia — a 1440, que es donde Meta redimensiona de todos modos, y
   con calidad de publicación, no de vista previa.

   Esa versión se genera únicamente cuando hace falta: un archivo de
   más por lámina, en una cuenta donde el espacio es lo que escasea,
   se paga sin dar nada a cambio. */
const TOPE_FOTO_META = 8 * 1024 * 1024;
const ANCHO_PUBLICAR = 1440;
const CALIDAD_PUBLICAR = 0.94;

/* Meta acepta JPEG para publicar. Un PNG grande o un HEIC hay que
   convertirlos igual, aunque pesen poco. */
function metaLaPuedeUsarTalCual(f) {
  return f.type === 'image/jpeg' && f.size <= TOPE_FOTO_META;
}

async function versionLigera(archivo, ancho, calidad) {
  if (!/^image\//.test(archivo.type)) return null;
  let bm;
  try { bm = await createImageBitmap(archivo); }
  catch (e) { return null; }          // formato que el navegador no abre

  ancho = ancho || ANCHO_PREVIA;
  const escala = Math.min(1, ancho / Math.max(bm.width, bm.height));
  if (escala === 1 && archivo.size < 600 * 1024) { bm.close(); return null; }

  const l = document.createElement('canvas');
  l.width = Math.round(bm.width * escala);
  l.height = Math.round(bm.height * escala);
  l.getContext('2d').drawImage(bm, 0, 0, l.width, l.height);
  bm.close();

  const blob = await new Promise(r => l.toBlob(r, 'image/jpeg', calidad || 0.82));
  return blob && blob.size < archivo.size ? blob : null;
}

/* Para MIRAR se pide la de pantalla; para el collage de la tarjeta,
   el sello. Si la lamina es vieja y no los tiene, cae al original:
   se ve lento, pero se ve. */
/* LOS TAMAÑOS SE DERIVAN, NO SE CONFIAN

   Una lamina guarda tres punteros a la MISMA foto: el original, la
   de 1600 para mirar y el sello de 480 para las tarjetas. Si uno se
   ensucia, dos vistas de la aplicacion enseñan fotos distintas de
   la misma lamina y las dos parecen tener razon.

   Paso: escribi los sellos en la base por indice (archivos,0,mini)
   mientras el navegador tenia el arreglo entero en memoria; el
   siguiente guardado lo sobrescribio y quedaron cruzados los de dos
   fotos. La ficha enseñaba una y la vista previa otra.

   Los nombres son deterministas -- previa-<base>.jpg y
   mini-<base>.jpg junto al original -- asi que se comprueban. Si un
   puntero no corresponde a su ruta, se ignora y se cae al original:
   mas vale una foto pesada que la foto equivocada. */
function varianteDe(a, prefijo) {
  const ruta = a && a.ruta;
  if (!ruta) return '';
  const guardado = a[prefijo];
  if (!guardado) return ruta;
  const barra = ruta.lastIndexOf('/');
  const base = ruta.slice(barra + 1).replace(/\.[^.]+$/, '');
  const debeSer = ruta.slice(0, barra + 1) + prefijo + '-' + base + '.jpg';
  return guardado === debeSer ? guardado : ruta;
}

function selloDe(a) { return varianteDe(a, 'mini') !== a.ruta ? varianteDe(a, 'mini')
                           : varianteDe(a, 'previa'); }

/* Una lamina se dibuja en un solo sitio. Se usa al abrir la ficha y
   al agregar mas sin reconstruirla. */
function dibujarLamina(a, i) {
  return `<div class="lamina" data-lamina="${i}" tabindex="0"
       title="${esc(a.nombre || a.ruta.split('/').pop())} — arrástrala para moverla">
    <span class="lamina-foto" data-sello="${esc(selloDe(a))}"></span>
    <span class="lamina-n">${i + 1}</span>
    <span class="lamina-acciones">
      <button type="button" class="btn-mini" data-reemplazar="${i}" title="Cambiar esta lámina por otra">⇄</button>
      <button type="button" class="btn-mini" data-descargar="${i}" title="Descargar el original">⬇</button>
      <button type="button" class="btn-mini" data-quitar="${i}" title="Quitar de la pieza">×</button>
    </span>
  </div>`;
}

/* Un carrusel en la parrilla se leia igual que un post suelto: solo
   el titulo. Con tres fotos encimadas se entiende de un vistazo que
   es carrusel Y de que es, sin abrir nada. */
function collageDe(pieza, cuantas) {
  const todas = archivosDe(pieza);
  if (!todas.length) return '';
  const muestra = todas.slice(0, cuantas);
  const resto = todas.length - muestra.length;
  return `<div class="collage n${muestra.length}">
    ${muestra.map(a => `<span class="collage-foto" data-sello="${esc(selloDe(a))}"></span>`).join('')}
    ${resto > 0 ? `<span class="collage-mas">+${resto}</span>` : ''}
  </div>`;
}

/* La cubeta es privada, asi que una <img src> pelada no trae nada:
   hay que pedir cada foto con la sesion. Se pinta despues de armar
   el HTML y se marca la que ya quedo, para que un repintado no
   vuelva a pedir lo mismo. */
function pintarMiniaturas(raiz) {
  $$('[data-sello]', raiz || document).forEach(async el => {
    if (el.dataset.puesto) return;
    el.dataset.puesto = '1';
    try {
      el.style.backgroundImage = `url("${await urlDeArchivo(el.dataset.sello)}")`;
      el.classList.add('cargada');
    } catch (e) {
      el.classList.add('rota');
    }
  });
}

/* Una lamina son sus tres tamaños. Se sube en un solo sitio para
   que agregar y reemplazar no acaben haciendo cosas distintas. */
async function subirLamina(idPieza, f) {
  const lamina = { ruta: await subirArchivo(idPieza, f),
                   nombre: f.name, peso: f.size, tipo: f.type };
  const raiz = f.name.replace(/\.[^.]+$/, '');
  const ligera = await versionLigera(f, ANCHO_PREVIA, 0.82);
  if (ligera) {
    lamina.previa = await subirArchivo(idPieza, ligera, 'previa-' + raiz + '.jpg');
    lamina.pesoPrevia = ligera.size;
  }
  const sello = await versionLigera(f, ANCHO_SELLO, 0.78);
  if (sello) lamina.mini = await subirArchivo(idPieza, sello, 'mini-' + raiz + '.jpg');

  /* Si Meta puede con el original, no se genera nada: se publica el
     original y se ahorra el archivo. Si no, ésta es la que va. */
  if (/^image\//.test(f.type) && !metaLaPuedeUsarTalCual(f)) {
    const alta = await versionLigera(f, ANCHO_PUBLICAR, CALIDAD_PUBLICAR);
    if (alta) {
      lamina.publicar = await subirArchivo(idPieza, alta, 'publicar-' + raiz + '.jpg');
      lamina.pesoPublicar = alta.size;
    }
  }
  return lamina;
}

/* Quitar un archivo de Storage. La politica solo deja borrar
   dentro de entregas/ a quien no maneja la parrilla, asi que un
   intento de mas rebota en el servidor y no aqui. */
async function borrarArchivo(ruta) {
  const token = await Almacen.motor._token();
  const r = await fetch(
    `${CONFIG.supabase.url}/storage/v1/object/${CUBETA}/${encodeURI(ruta)}`, {
      method: 'DELETE',
      headers: { apikey: CONFIG.supabase.llave, Authorization: 'Bearer ' + token },
    });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.message || d.error || 'No se pudo borrar el archivo.');
  }
  cacheArchivos.delete(ruta);
}

async function subirArchivo(idPieza, archivo, nombre) {
  const token = await Almacen.motor._token();
  const ruta = `${idPieza}/${nombreLimpio(nombre || archivo.name)}`;

  const r = await fetch(
    `${CONFIG.supabase.url}/storage/v1/object/${CUBETA}/${encodeURI(ruta)}`, {
      method: 'POST',
      headers: {
        apikey: CONFIG.supabase.llave,
        Authorization: 'Bearer ' + token,
        'Content-Type': archivo.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: archivo,
    });

  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.message || d.error || 'No se pudo subir el archivo.');
  }
  return ruta;
}

/* Se baja como blob y no como enlace directo: la cubeta es privada,
   así que la petición tiene que llevar la sesión. Un <a href> no la
   lleva. */
async function bajarArchivo(ruta) {
  const token = await Almacen.motor._token();
  const r = await fetch(
    `${CONFIG.supabase.url}/storage/v1/object/${CUBETA}/${encodeURI(ruta)}`, {
      headers: { apikey: CONFIG.supabase.llave, Authorization: 'Bearer ' + token },
    });
  if (!r.ok) throw new Error('No se pudo bajar el archivo.');

  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ruta.split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Se suelta después: revocarla en el mismo instante cancela la
  // descarga en algunos navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function pesoLegible(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}


/* ── Imagen de referencia ──────────────────────────────────
   Antes se mandaba a /api/miniatura, un endpoint del servidor de
   Python. Con los datos en la nube y la página en GitHub Pages esa
   ruta no existe: devolvía 404 siempre, así que subir imagen NUNCA
   funcionaba — y la auditoría además descontaba puntos por no tener
   miniaturas, castigando algo que el sistema hacía imposible.

   Ahora se reduce aquí mismo y se guarda con el registro. Un JPEG
   de 480px de ancho al 72% pesa entre 30 y 80 KB: cabe de sobra en
   la ficha y no necesita servidor, almacenamiento ni permisos. */

const MINIATURA_ANCHO = 480;
const MINIATURA_CALIDAD = .72;

function reducirImagen(archivo) {
  return new Promise((listo, falla) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      // No se agranda nunca: una foto chica se queda como está.
      const escala = Math.min(1, MINIATURA_ANCHO / img.naturalWidth);
      const lienzo = document.createElement('canvas');
      lienzo.width  = Math.round(img.naturalWidth  * escala);
      lienzo.height = Math.round(img.naturalHeight * escala);

      const ctx = lienzo.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);

      // PNG para lo que tiene transparencia, JPEG para lo demás:
      // un JPEG con fondo transparente sale con bordes negros.
      const tipo = archivo.type === 'image/png' ? 'image/png' : 'image/jpeg';
      listo(lienzo.toDataURL(tipo, MINIATURA_CALIDAD));
    };

    img.onerror = () => { URL.revokeObjectURL(url); falla(new Error('no se pudo leer')); };
    img.src = url;
  });
}

async function subirImagen(archivo) {
  if (!archivo) return;
  if (archivo.size > 25 * 1024 * 1024) { avisar('La imagen pesa más de 25 MB.'); return; }

  avisar('Preparando la imagen…');

  let miniatura;
  try {
    miniatura = await reducirImagen(archivo);
  } catch (e) {
    avisar('No se pudo leer esa imagen. ¿Es un archivo de imagen válido?');
    return;
  }

  // Guarda muy rara: si algo sale mal en el redimensionado y el
  // resultado sigue siendo enorme, mejor no meterlo en la ficha.
  if (miniatura.length > 900_000) {
    avisar('Esa imagen no se pudo reducir lo suficiente. Prueba con otra.');
    return;
  }

  modalCtx.datos.imagen = miniatura;

  const z = $('#zonaImagen');
  z.classList.add('con-imagen');
  z.innerHTML = `<img src="${esc(miniatura)}" alt="Vista previa">`;
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

  const kb = Math.round(miniatura.length * 0.75 / 1024);
  avisar(`Imagen lista (${kb} KB). Se guarda al guardar la pieza.`);
}

function leerPieza() {
  const p = modalCtx.datos;
  p.titulo      = $('#f_titulo').value.trim();
  p.pilar       = $('#f_pilar').value;
  // El formato ya no es un <select>: lo lleva el botón activo.
  p.formato     = ($('#f_formato .tipo-op.activo') || {}).dataset?.formato || p.formato || 'Foto';
  p.canales     = $$('#f_canales input:checked').map(i => i.value);
  p.fecha       = $('#f_fecha').value;
  p.hora        = $('#f_hora').value;
  p.autopublicar = $('#f_autopublicar').checked;
  p.estado      = $('#f_estado').value;
  p.responsable = $('#f_responsable').value.trim();
  // Estos dos campos ya no salen en todo formato.
  if ($('#f_experto')) p.experto = $('#f_experto').value;
  p.copy        = $('#f_copy').value;
  if ($('#f_copy_fb')) p.copy_fb = $('#f_copy_fb').value.trim();
  p.notas       = $('#f_notas').value;
  // El campo se quito de la ficha; lo ya capturado no se toca.
  p.no_antes    = $('#f_no_antes').value;
  p.no_despues  = $('#f_no_despues').value;

  if (!p.titulo) { avisar('Ponle un título a la pieza.'); return false; }
  if (!p.fecha)  { avisar('Falta la fecha de publicación.'); return false; }
  /* Sin hora no hay a que hora publicar. Suponer una -- las nueve,
     el mediodia -- seria decidir por alguien mas a que hora lo ven
     42 mil personas. */
  if (p.autopublicar && !p.hora) {
    avisar('Si va a publicarse sola, ponle la hora.');
    $('#f_hora').focus();
    return false;
  }
  if (p.autopublicar && !redesDe(p).length) {
    avisar('Sólo se publican solas Instagram y Facebook. Marca alguno de los dos.');
    return false;
  }

  const problema = fueraDeVentana(p, p.fecha);
  if (problema) { avisar(problema); return false; }

  p.actualizado = ahora();
  // Quien la anoto, para poder contestar "¿quien metio esto?" sin
  // entrar a la base.
  if (!p.creadoPor) p.creadoPor = Almacen.usuario ? Almacen.usuario.nombre : '';
  if (modalCtx.esNuevo) {
    p.creado = ahora();
    datos.parrilla.piezas.push(p);
  }
  guardar('parrilla');

  /* Si la pieza nacio de una entrega, la entrega deja de estar
     esperando. Sin esto quien entrego no se entera nunca de que su
     material ya tiene fecha, que es justo lo que vino a saber. */
  if (p.de_entrega) {
    const e = ((datos.entregas && datos.entregas.lista) || [])
      .find(x => x.id === p.de_entrega);
    if (e && (e.estado !== 'aceptada' || e.pieza !== p.id)) {
      e.estado = 'aceptada';
      e.pieza = p.id;
      e.comentario = '';
      e.actualizado = ahora();
      guardar('entregas');
      pintarEntregas();
    }
  }
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
   Si escribes "IGNITE, 10 de agosto", LA PIZARRA saca esa fecha y
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
  const texto = prompt('Describe la idea en tus palabras. LA PIZARRA la clasifica y la deja lista para que la revises.');
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
  { id: 'encargada',  nombre: 'Encargada',      quien: 'redaccion',    color: 'var(--estado-brief)', nota: 'Ya se mandó el encargo; falta que empiece' },
  { id: 'escribiendo',nombre: 'Escribiendo',    quien: 'redaccion',    color: 'var(--estado-produccion)', nota: 'En manos de quien redacta' },
  { id: 'borrador',   nombre: 'Borrador listo', quien: 'difusion',     color: 'var(--estado-revision)', nota: 'Texto terminado, falta armar el post y el reel' },
  { id: 'con_sitio',  nombre: 'Con publicación',quien: 'publicacion',  color: 'var(--estado-vobo)', nota: 'Enviada para subir al sitio' },
  { id: 'publicada',  nombre: 'En el sitio',    quien: 'difusion',     color: 'var(--estado-programado)', nota: 'Ya vive en el sitio; toca difundirla' },
  { id: 'difundida',  nombre: 'Difundida',      quien: '—',            color: 'var(--estado-publicado)', nota: 'Post y reel publicados. Cerrada.' },
];

/* Estas claves son funciones dentro del flujo de una nota — quién
   escribe, quién sube al sitio, quién la difunde — no puestos ni
   niveles de permiso. Son cosas distintas y no conviene mezclarlas. */
function rolDe(clave) {
  const eq = (datos.redaccion && datos.redaccion.equipo) || {};
  return eq[clave] || {
    redaccion: 'quien escribe', publicacion: 'quien publica', difusion: 'quien difunde',
  }[clave] || '—';
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
  l.push(`Cualquier duda: ${rolDe('difusion')}`);

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
  // El centro lleva fondo propio: es el hueco de la dona. Sin él, la
  // cifra flota sobre el anillo y su contraste depende de en qué
  // grado quedó el barrido — que es justo lo que no se puede medir.
  $('#marcador').innerHTML =
    `<div class="marcador-centro">
       <div class="marcador-cifra">${r.puntaje}</div>
       <div class="marcador-etiqueta" style="color:${color}">${esc(etiqueta)}</div>
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
   Marcas lo que te llevas y LA PIZARRA arma la lista: para
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
  // Cancelar aqui SI cancela. Antes 'regreso || ''' convertia el
  // null de Cancelar en cadena vacia y el prestamo se ejecutaba
  // igual sobre toda la seleccion.
  if (regreso === null) return;
  if (regreso && !/^\d{4}-\d{2}-\d{2}$/.test(regreso.trim())) {
    avisar('Esa fecha no sirve. Va como 2026-08-20, o dejala vacia.');
    return;
  }

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

/* ══════════════════════════════════════════════════════════
   VISTA PREVIA Y APROBACIÓN

   Antes, un clic en una pieza abría directo el formulario de
   edición. Eso está bien para quien la produce y mal para todos los
   demás: Marysol no entra a corregir campos, entra a VER cómo va a
   quedar el post y a decir si va.

   Ahora el clic abre una simulación de la publicación. Editar es un
   botón dentro, no la puerta de entrada.

   LO QUE CAMBIA EN EL MODELO
   Una pieza guardaba UN archivo. Un carrusel son varios, en un
   orden que importa: la primera lámina es la que detiene el pulgar.
   Por eso ahora es una lista, y se puede reordenar.

   QUIÉN APRUEBA
   Sólo dirección y quien administra. Publicación sube al sitio lo
   que ya se aprobó — no es quien decide.
   ══════════════════════════════════════════════════════════ */

const APROBACIONES = {
  pendiente: { nombre: 'Sin revisar',          color: 'var(--tinta-tenue)' },
  aprobado:  { nombre: 'Aprobado',             color: 'var(--ok)' },
  cambios:   { nombre: 'Pide cambios',         color: 'var(--alerta)' },
  revisar:   { nombre: 'Corregido, por ver',   color: 'var(--alerta)' },
};

/* HUELLA DE LO QUE SE REVISO

   Una aprobacion que sobrevive al cambio del arte es una mentira, y
   de las caras: alguien publica creyendo que lo aprobado es lo que
   tiene enfrente. Se guarda una huella de lo que habia cuando se
   reviso; si hoy no coincide, la aprobacion caduca sola.

   Va la ruta de cada lamina EN ORDEN, no solo cuantas: cambiar la
   portada no cambia el numero de laminas y es justo lo que se
   revisa. */
function selloDeRevision(p) {
  /* El copy de Facebook va colgado del de Instagram con un separador
     invisible en vez de ser un elemento aparte: asi una pieza sin
     copy propio de Facebook conserva la huella que ya tenia y no se
     caducan de golpe las aprobaciones viejas. */
  return JSON.stringify([
    archivosDe(p).map(a => a.ruta),
    (p.copy || '') + (p.copy_fb ? '\u0000' + p.copy_fb : ''),
    p.titulo || '', p.fecha || '', (p.canales || []).join(','),
  ]);
}

/* Facebook hereda el copy de Instagram si no tiene uno propio.
   Obligar a escribir dos veces lo mismo solo lograria que el segundo
   se quedara viejo. */
function copyDe(p, red) {
  return (red === 'fb' ? (p.copy_fb || p.copy) : p.copy) || '';
}

/* "La pieza cambio" no le sirve a nadie: lo que hace falta saber es
   QUE cambio, para decidir si hay que volver a mirarla entera o si
   basta con enterarse. Mover la fecha un dia y rehacer el arte
   caducan igual la revision, pero no piden lo mismo. */
const CAMPOS_DEL_SELLO = ['el arte', 'el copy', 'el título', 'la fecha de salida', 'los canales'];

function queCambio(p) {
  const ap = p.aprobacion || {};
  if (!ap.sello) return [];
  let antes;
  try { antes = JSON.parse(ap.sello); } catch (e) { return []; }
  const ahora = JSON.parse(selloDeRevision(p));
  const cambios = [];
  CAMPOS_DEL_SELLO.forEach((nombre, i) => {
    if (JSON.stringify(antes[i]) !== JSON.stringify(ahora[i])) cambios.push(nombre);
  });
  return cambios;
}

function estadoRevision(p) {
  const ap = p.aprobacion || {};
  const crudo = ap.estado || 'pendiente';
  // Sin huella no se puede saber, y decir que caduco seria inventar.
  const caducada = !!ap.sello && ap.sello !== selloDeRevision(p)
                   && (crudo === 'aprobado' || crudo === 'revisar');
  return { crudo, caducada, estado: caducada ? 'pendiente' : crudo };
}

/* Publicar no lo hace quien aprueba: lo hace quien publica. Son
   dos manos distintas a proposito -- el mismo motivo por el que la
   aprobacion existe. */
/* Las redes a las que esta pieza puede salir sola. El resto de
   canales -- sitio web, LinkedIn, YouTube -- siguen siendo trabajo
   de manos, y decirlo aqui evita prometer lo que no se cumple. */
const REDES_AUTOMATICAS = [
  { id: 'ig', nombre: 'Instagram' },
  { id: 'fb', nombre: 'Facebook' },
];

function redesDe(p) {
  return REDES_AUTOMATICAS.filter(r => (p.canales || []).includes(r.id));
}

/* Las que faltan por salir. Publicado es POR RED: una pieza que ya
   salio en Facebook puede salir despues en Instagram, y el sistema
   no tiene por que darla por terminada solo porque una de las dos
   ocurrio. Si no falta ninguna, se ofrecen todas -- volver a
   publicar es legitimo cuando se borro el post, pero se avisa. */
function redesPendientes(p) {
  const faltan = redesDe(p).filter(r => !(p.publicaciones || {})[r.id]);
  return faltan.length ? faltan : redesDe(p);
}

/* POR QUE UNA PIEZA ARMADA NO VA A SALIR

   Encender la casilla no basta: hacen falta aprobacion vigente,
   arte, canales automatizables y hora. Si algo falta, el reloj pasa
   de largo en silencio y nadie se entera hasta que el post no
   aparece. Esto lo dice ANTES, donde se toma la decision. */
/* CUANDO SALE — SU PROPIO BLOQUE

   Antes esto vivia en dos sitios que no se hablaban: la casilla para
   programar estaba enterrada en el formulario de Editar, y la
   decision se toma aqui. Leo busco el boton donde tenia que estar y
   no estaba; la unica pista era una leyenda pasiva mas arriba.

   Y el renglon de acciones mezclaba cuatro botones del mismo peso
   que contestan dos preguntas distintas: "¿va bien?" (eso lo decide
   quien revisa) y "¿cuando sale?" (eso lo decide quien publica).
   Ahora son dos bloques. */
function bloqueCuando(p, rev, archivos) {
  if (!archivos.length || !redesDe(p).length) return '';
  if (!puedePublicar() && !puedeAprobar()) return '';

  const donde = redesDe(p).map(r => r.nombre).join(' y ');
  const faltas = porQueNoSaldraSola(p);
  const armada = p.autopublicar && !faltas;
  const puedo = puedePublicar();
  const pendientes = redesPendientes(p);
  const nuevas = pendientes.some(r => !(p.publicaciones || {})[r.id]);
  const sePuedePublicar = rev.estado === 'aprobado' && puedo;

  let estado;
  if (armada) {
    estado = `<div class="cuando-estado sola">
      <b>⏱ Sale sola${p.hora ? ' a las ' + esc(horaLegible(p.hora)) : ''}</b>
      <span>${esc(fechaLegible(p.fecha))} · ${esc(donde)}. Nadie tiene que apretar nada.</span>
    </div>`;
  } else if (p.autopublicar) {
    estado = `<div class="cuando-estado rota">
      <b>⏱ Programada, pero no va a salir</b>
      <span>${esc(faltas.join(' · '))}</span>
    </div>`;
  } else {
    estado = `<div class="cuando-estado mano">
      <b>Sale cuando alguien la publique</b>
      <span>Nadie la va a publicar sola${p.fecha ? '. Estaba prevista para el ' + esc(fechaLegible(p.fecha)) : ''}.</span>
    </div>`;
  }

  return `
    <div class="previa-cuando">
      <h4>¿Cuándo sale?</h4>
      ${estado}
      <div class="cuando-acciones">
        ${puedo && !p.autopublicar ? `
          <button class="btn-primario" id="apProgramar">⏱ Programar${
            p.hora ? ' a las ' + esc(horaLegible(p.hora)) : '…'}</button>` : ''}
        ${puedo && p.autopublicar ? `
          <button class="btn-plano" id="apDesprogramar">Quitar la programación</button>` : ''}
        ${sePuedePublicar ? `
          <button class="${armada ? 'btn-plano' : 'btn-primario'}" id="apPublicar">${
            nuevas ? 'Publicar ahora' : 'Volver a publicar ahora'}</button>` : ''}
        ${p.estado !== 'publicado' && !soloLectura('parrilla_piezas') ? `
          <button class="btn-plano" id="apPublicado">Ya lo publiqué a mano</button>` : ''}
      </div>
      ${puedo && !p.autopublicar && !p.hora ? `
        <div class="cuando-hora" id="cuandoHora" hidden>
          <label for="apHora">¿A qué hora?</label>
          <input type="time" class="campo-mini" id="apHora" value="09:00">
          <button class="btn-plano" id="apHoraOk">Programar</button>
        </div>` : ''}
      ${!sePuedePublicar && rev.estado !== 'aprobado' ? `
        <p class="cuando-nota">Puedes programarla desde ya, pero no saldrá hasta que esté aprobada.</p>` : ''}
    </div>`;
}

/* QUIEN ANOTO ESTO

   El dato estaba desde el principio en la columna 'actor' de cada
   registro, pero nunca aparecio en pantalla. En una herramienta de
   tres personas "¿quien metio esto?" es una pregunta normal, y
   hasta hoy solo se podia contestar entrando a la base. */
function quienAnoto(x) {
  if (!x || !x.creadoPor) return '';
  const cuando = x.creado || x.actualizado;
  const fecha = cuando ? fechaLegible(String(cuando).slice(0, 10)) : '';
  return `${x.creadoPor}${fecha ? ' · ' + fecha : ''}`;
}

function porQueNoSaldraSola(p) {
  if (!p.autopublicar) return null;
  const faltas = [];
  if (!p.hora) faltas.push('falta la hora');
  if (!archivosDe(p).length) faltas.push('no tiene arte');
  if (!redesDe(p).length) faltas.push('ninguno de sus canales se publica solo');

  const rev = estadoRevision(p);
  if (rev.estado !== 'aprobado') {
    faltas.push(rev.caducada ? 'la aprobación caducó'
              : rev.crudo === 'cambios' ? 'está pidiendo cambios'
              : rev.crudo === 'revisar' ? 'falta que la revisen otra vez'
              : 'falta que la aprueben');
  }
  if (redesPendientes(p).length && !redesDe(p).some(r => !(p.publicaciones || {})[r.id])
      && redesDe(p).length) {
    faltas.push('ya salió en todas sus redes');
  }
  return faltas.length ? faltas : null;
}

function puedePublicar() {
  const rol = Almacen.usuario && Almacen.usuario.rol;
  return !Almacen.enLaNube || rol === 'admin' || rol === 'publicacion';
}

/* ── Ver como otro rol ─────────────────────────────────────
   Para comprobar cómo le queda la aplicación a cada quien sin
   pedirle su contraseña a nadie.

   SIMULA LA INTERFAZ, NO EL PERMISO. La sesión sigue siendo la de
   quien lo enciende, así que el servidor sigue contestando lo que
   le contesta a esa persona. Sirve para ver cómo se ve; no sirve
   para comprobar que alguien NO puede leer algo — eso lo decide
   puede_leer() en Postgres y se revisa aparte.

   No sobrevive a una recarga a propósito: quedarse a medias en la
   piel de otro sin recordarlo es peor que volver a encenderlo. */
let verComo = null;

function rolUI() {
  return verComo || (Almacen.usuario && Almacen.usuario.rol) || '';
}

function ponerseEnLaPielDe(rol) {
  verComo = rol || null;
  const sel = $('#selVerComo');
  if (sel) sel.value = verComo || '';
  const aviso = $('#avisoVerComo');
  if (aviso) {
    aviso.hidden = !verComo;
    if (verComo) {
      const nombreDe = id => (ROLES_SISTEMA.find(x => x.id === id) || {}).nombre || id;
      $('#avisoVerComoTexto').textContent =
        `Estás viendo la aplicación como ${nombreDe(verComo)}. Es la interfaz, ` +
        `no el permiso: el servidor te sigue contestando como ${nombreDe(Almacen.usuario.rol)}.`;
    }
  }
  document.body.classList.toggle('en-otra-piel', !!verComo);
  refrescarTodo();
}

function puedeAprobar() {
  const rol = rolUI();
  return !Almacen.enLaNube || rol === 'admin' || rol === 'direccion';
}

/* Los archivos de una pieza, siempre como lista. Lo capturado antes
   traía un solo `archivo`; se traduce al vuelo para no perderlo. */
function archivosDe(p) {
  if (Array.isArray(p.archivos)) return p.archivos;
  if (p.archivo) return [{ ruta: p.archivo, nombre: p.archivo.split('/').pop() }];
  return [];
}

/* Las imágenes viven en una cubeta privada: no se pueden poner en un
   src directo porque la petición tiene que llevar la sesión. Se bajan
   una vez y se guardan como URL de objeto mientras dure la pestaña. */
const cacheArchivos = new Map();

async function urlDeArchivo(ruta) {
  if (cacheArchivos.has(ruta)) return cacheArchivos.get(ruta);
  const token = await Almacen.motor._token();
  const r = await fetch(
    `${CONFIG.supabase.url}/storage/v1/object/${CUBETA}/${encodeURI(ruta)}`, {
      headers: { apikey: CONFIG.supabase.llave, Authorization: 'Bearer ' + token },
    });
  if (!r.ok) throw new Error('No se pudo abrir ' + ruta.split('/').pop());
  const url = URL.createObjectURL(await r.blob());
  cacheArchivos.set(ruta, url);
  return url;
}


/* ── Llevarse el post completo ─────────────────────────── */

/* Quien publica no viene a leer la ficha: viene por el material.
   Bajar ocho fotos de una en una, acordandose del orden, es donde
   se rompe la cadena -- y el orden es justo lo que costo decidir.

   El ZIP se arma a mano, sin comprimir. Son sesenta lineas y evita
   meter una libreria entera: los JPG ya vienen comprimidos, asi que
   volver a comprimir no ahorraria nada que valga la pena. */
const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) c = TABLA_CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function armarZip(entradas) {
  const cod = new TextEncoder();
  const u16 = n => [n & 255, (n >> 8) & 255];
  const u32 = n => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];
  const BANDERA = 0x0800;    // los nombres van en UTF-8

  const cuerpo = [], central = [];
  let offset = 0, largoCentral = 0;

  entradas.forEach(e => {
    const nombre = cod.encode(e.nombre);
    const crc = crc32(e.bytes), tam = e.bytes.length;
    const cab = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(BANDERA), ...u16(0),
      ...u16(0), ...u16(0),                       // hora y fecha: cero
      ...u32(crc), ...u32(tam), ...u32(tam),
      ...u16(nombre.length), ...u16(0),
    ]);
    cuerpo.push(cab, nombre, e.bytes);

    const ent = new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(BANDERA), ...u16(0),
      ...u16(0), ...u16(0),
      ...u32(crc), ...u32(tam), ...u32(tam),
      ...u16(nombre.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0), ...u32(offset),
    ]);
    central.push(ent, nombre);
    largoCentral += ent.length + nombre.length;
    offset += cab.length + nombre.length + tam;
  });

  const fin = new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0),
    ...u16(entradas.length), ...u16(entradas.length),
    ...u32(largoCentral), ...u32(offset), ...u16(0),
  ]);
  return new Blob([...cuerpo, ...central, fin], { type: 'application/zip' });
}

/* Sin pasar por el cache de miniaturas: son los originales, y
   guardarse cincuenta megas en la pestana no le sirve a nadie. */
async function bytesDeArchivo(ruta) {
  const token = await Almacen.motor._token();
  const r = await fetch(
    `${CONFIG.supabase.url}/storage/v1/object/${CUBETA}/${encodeURI(ruta)}`, {
      headers: { apikey: CONFIG.supabase.llave, Authorization: 'Bearer ' + token },
    });
  if (!r.ok) throw new Error('No se pudo bajar ' + ruta.split('/').pop());
  return new Uint8Array(await r.arrayBuffer());
}

/* El texto va adentro del ZIP y no aparte: quien publica necesita
   el copy tanto como las fotos, y un archivo suelto se pierde. */
function textoDelPost(p) {
  const lineas = [
    p.titulo || 'Sin título',
    ''.padEnd((p.titulo || 'Sin título').length, '='),
    '',
    `Sale:        ${p.fecha ? fechaLegible(p.fecha) : 'sin fecha'}${p.hora ? ' · ' + p.hora : ''}`,
    `Canales:     ${(p.canales || []).map(c => catalogo(CANALES, c)).join(', ') || '—'}`,
    `Formato:     ${p.formato || '—'}`,
    `Pilar:       ${catalogo(PILARES, p.pilar) || '—'}`,
    `Responsable: ${p.responsable || '—'}`,
    `Láminas:     ${archivosDe(p).length} (van en el orden del número)`,
    '',
    '── COPY ──────────────────────────────────',
    '',
    p.copy || '(sin copy todavía)',
  ];
  if (p.notas) lineas.push('', '── NOTAS ─────────────────────────────────', '', p.notas);
  return new TextEncoder().encode(lineas.join('\r\n'));   // \r\n: se abre bien en Windows
}

async function bajarPostCompleto() {
  const p = previaCtx && previaCtx.pieza;
  const b = $('#previaBajarTodo');
  if (!p || !b || b.disabled) return;

  const archivos = archivosDe(p);
  const original = b.textContent;
  b.disabled = true;

  try {
    const entradas = [];
    for (let i = 0; i < archivos.length; i++) {
      b.textContent = `Bajando ${i + 1} de ${archivos.length}…`;
      const a = archivos[i];
      const suelto = (a.nombre || a.ruta.split('/').pop());
      entradas.push({
        nombre: String(i + 1).padStart(2, '0') + '-' + nombreLimpio(suelto),
        bytes: await bytesDeArchivo(a.ruta),
      });
    }
    entradas.push({ nombre: 'texto-del-post.txt', bytes: textoDelPost(p) });

    b.textContent = 'Armando el archivo…';
    const zip = armarZip(entradas);
    const url = URL.createObjectURL(zip);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreLimpio((p.titulo || 'post') + '.zip')}`.replace(
      /\.zip$/, `-${p.fecha || ''}.zip`).replace('--', '-');
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    avisar(`${archivos.length} lámina(s) y el copy, en un solo archivo.`);
  } catch (e) {
    avisar(e.message || 'No se pudo armar la descarga.');
  } finally {
    b.disabled = false;
    b.textContent = original;
  }
}


/* ── Lo que a cada quien le concierne ──────────────────── */

/* POR QUE ESTO EXISTE

   Marysol dejo su primer comentario y Leo no se entero hasta que
   alguien se lo dijo. Un comentario que hay que salir a buscar
   pieza por pieza no es una revision: es una nota en un cajon.

   Los avisos no se guardan en ningun lado -- se deducen del estado
   de las piezas cada vez. Asi no hay una segunda verdad que se
   pueda desincronizar de la primera: si la pieza ya se corrigio, el
   aviso desaparece solo. */

function vistosDe(usuario) {
  try { return JSON.parse(localStorage.getItem('pizarra:vistos:' + usuario.id) || '{}'); }
  catch (e) { return {}; }
}

function marcarVisto(usuario, ...ids) {
  const v = vistosDe(usuario);
  ids.forEach(i => { v[i] = 1; });
  try { localStorage.setItem('pizarra:vistos:' + usuario.id, JSON.stringify(v)); }
  catch (e) {}
}

function avisosPara(yo) {
  if (!yo) return [];
  const piezas = datos.parrilla.piezas || [];
  const hoy = aTexto(new Date());
  const cerca = aTexto(sumarDias(new Date(), 3));
  const apruebo = puedeAprobar();
  const edito = !soloLectura('parrilla_piezas');
  const publico = yo.rol === 'publicacion' || yo.rol === 'admin';
  const soyYo = n => (n || '').toLowerCase() === (yo.nombre || '').toLowerCase();

  const lista = [];
  const meter = (p, clave, tono, titulo, detalle, cuando) => lista.push({
    id: p.id + ':' + clave + ':' + (cuando || ''), pieza: p.id,
    tono, titulo, detalle: detalle || '', pie: p.titulo || 'Sin título',
    cuando: cuando || p.actualizado || '',
  });

  piezas.forEach(p => {
    if (p.estado === 'idea') return;
    const ap = p.aprobacion || {};
    const r = estadoRevision(p);
    const ultimo = (ap.comentarios || []).slice(-1)[0];

    /* A quien la hace: le pidieron cambios. Si la pieza tiene
       responsable, es SUYO y de nadie mas -- un aviso que le llega a
       los cuatro es un aviso que no es de ninguno. Sin responsable
       sí va a todos: alguien tiene que levantarlo. */
    const meToca = p.responsable ? soyYo(p.responsable) : edito;
    if (r.crudo === 'cambios' && edito && meToca && !soyYo(ap.por)) {
      meter(p, 'cambios', 'pide', `${ap.por || 'Dirección'} pidió cambios`,
            ultimo ? ultimo.texto : '', ap.cuando);
    }
    // A quien revisa: ya lo corrigieron
    if (r.crudo === 'revisar' && apruebo && !soyYo(ap.corrigio)) {
      meter(p, 'revisar', 'revisa', `${ap.corrigio || 'El equipo'} lo corrigió`,
            'Falta que lo revises.', ap.corregido);
    }
    /* Fallo al publicarse sola. Es el aviso mas importante de todos:
       nadie estaba mirando cuando paso, y la pieza no salio. */
    if (p.autoerror && (edito || publico)) {
      meter(p, 'autoerror', 'pide', 'No se pudo publicar sola',
            p.autoerror.texto || '', p.autoerror.cuando);
    }
    // A quien revisa: aprobo algo que ya no es lo que hay
    if (r.caducada && apruebo) {
      meter(p, 'caduca', 'revisa', 'Cambió después de que la revisaste',
            'La aprobación ya no aplica a lo que hay ahora.', p.actualizado);
    }
    // A quien revisa: sale pronto y nadie la ha visto
    if (r.estado === 'pendiente' && !r.caducada && apruebo
        && archivosDe(p).length && p.fecha && p.fecha <= cerca && p.fecha >= hoy) {
      meter(p, 'sinver', 'revisa', 'Sale pronto y nadie la ha revisado',
            `Sale ${fechaLegible(p.fecha)}.`, p.fecha);
    }
    // A quien publica: ya esta lista
    if (r.estado === 'aprobado' && publico && p.estado !== 'publicado'
        && archivosDe(p).length) {
      meter(p, 'lista', 'lista', 'Aprobada, lista para publicar',
            `Sale ${fechaLegible(p.fecha)}.`, ap.cuando);
    }
  });

  /* EVENTOS POR CUBRIR

     Los avisos solo miraban piezas, y eso dejaba el concepto de
     evento a medias: alguien marca que hay que cubrir algo con foto,
     y no le llega a quien tiene que llevar la camara. Marysol anoto
     el curso de ultrasonido y Leo se entero preguntando.

     Le llega a quien hace la cobertura, no a quien la pidio. */
  const cubro = yo.rol === 'admin' || yo.rol === 'produccion';
  const dentroDe = n => aTexto(sumarDias(new Date(), n));

  if (cubro) {
    (datos.parrilla.eventos || []).forEach(ev => {
      if (ev.estado === 'cubierto' || ev.estado === 'cancelado') return;
      if (!ev.fecha || ev.fecha < hoy) return;
      if (ev.fecha > dentroDe(7)) return;      // mas alla de una semana, todavia no urge

      const q = necesidadesDe(ev)
        .map(id => (QUE_SE_NECESITA.find(x => x.id === id) || {}).nombre)
        .filter(Boolean);
      if (!q.length) return;                   // sin saber que se necesita no hay nada que avisar
      if (soyYo(ev.creadoPor)) return;

      const esHoy = ev.fecha === hoy;
      const cuando = esHoy ? 'Hoy' : fechaLegible(ev.fecha);
      lista.push({
        id: ev.id + ':cubrir:' + ev.fecha, pieza: ev.id, tipo: 'evento',
        tono: esHoy ? 'pide' : 'revisa',
        titulo: esHoy ? 'Hay que cubrir algo hoy' : 'Evento por cubrir',
        detalle: `${cuando}${ev.hora ? ' a las ' + horaLegible(ev.hora) : ''}${
                   ev.lugar ? ' · ' + ev.lugar : ''} · ${q.join(' y ').toLowerCase()}${
                   ev.estado === 'avisado' ? ' · falta confirmar' : ''}`,
        pie: ev.titulo || 'Evento sin nombre',
        cuando: ev.actualizado || ev.creado || ev.fecha,
      });
    });
  }

  const v = vistosDe(yo);
  lista.forEach(a => { a.visto = !!v[a.id]; });
  return lista.sort((a, b) => (b.cuando || '').localeCompare(a.cuando || ''));
}

/* La MISMA fila en el escritorio y en la campana. Si cada uno
   armara la suya, en tres meses dirian cosas distintas. */
function filaDeAviso(a) {
  return `<button class="aviso-fila ${a.visto ? 'visto' : ''} t-${a.tono}"
      data-aviso="${esc(a.id)}" data-pieza="${esc(a.pieza)}" data-tipo="${esc(a.tipo || 'pieza')}">
    <span class="aviso-punto"></span>
    <span class="aviso-texto">
      <b>${esc(a.titulo)}</b>
      ${a.detalle ? `<span class="aviso-detalle">${esc(a.detalle)}</span>` : ''}
      <span class="aviso-pie">${esc(a.pie)}</span>
    </span>
  </button>`;
}

/* Un clic en un aviso hace siempre lo mismo: marcarlo visto y abrir
   la pieza. Visto no es resuelto -- el aviso se va cuando la pieza
   deja de necesitarlo, no cuando alguien lo silencia. */
function conectarFilasDeAviso(raiz, yo, despues) {
  $$('.aviso-fila', raiz).forEach(el => el.addEventListener('click', () => {
    marcarVisto(yo, el.dataset.aviso);
    el.classList.add('visto');
    if (el.dataset.tipo === 'evento') abrirFichaEvento(el.dataset.pieza);
    else abrirPrevia(el.dataset.pieza);
    pintarContadorAvisos();
    if (despues) despues();
  }));
}

function sinVer() {
  return avisosPara(Almacen.usuario).filter(a => !a.visto).length;
}

/* El numero en la pestaña: sin el, los avisos solo los ve quien ya
   fue a buscarlos, que son justo los que no los necesitan. */
function pintarContadorAvisos() {
  const n = sinVer();
  const hay = avisosPara(Almacen.usuario).length;

  const globoEn = (sitio, cuantos) => {
    if (!sitio) return;
    let g = $('.tab-globo', sitio);
    if (!cuantos) { if (g) g.remove(); return; }
    if (!g) { g = document.createElement('span'); g.className = 'tab-globo'; sitio.appendChild(g); }
    g.textContent = cuantos > 9 ? '9+' : cuantos;
    g.title = `${cuantos} ${cuantos === 1 ? 'aviso sin ver' : 'avisos sin ver'}`;
  };

  globoEn($('.tab[data-vista="escritorio"]'), n);

  /* La campana aparece cuando hay algo y se va cuando no. Una
     campana siempre presente y siempre vacia enseña a no mirarla. */
  const btn = $('#btnAvisos');
  if (btn) {
    btn.hidden = !hay || !Almacen.usuario;
    globoEn(btn, n);
    if (btn.hidden && !$('#panelAvisos').hidden) alternarPanelAvisos(false);
  }
}

function alternarPanelAvisos(forzar) {
  const panel = $('#panelAvisos');
  const abrir = forzar !== undefined ? forzar : panel.hidden;
  panel.hidden = !abrir;
  $('#btnAvisos').classList.toggle('abierto', abrir);
  if (abrir) pintarPanelAvisos();
}

function pintarPanelAvisos() {
  const yo = Almacen.usuario;
  const caja = $('#listaAvisos');
  if (!yo || !caja) return;
  const lista = avisosPara(yo);
  caja.innerHTML = lista.length
    ? lista.map(filaDeAviso).join('') +
      (lista.some(a => !a.visto)
        ? '<button class="btn-mini todos-vistos" id="avisosTodosPanel">Marcar todo como visto</button>' : '')
    : '<p class="tenue nota">Nada que te toque ahora mismo.</p>';

  conectarFilasDeAviso(caja, yo, () => alternarPanelAvisos(false));
  const todos = $('#avisosTodosPanel', caja);
  if (todos) todos.addEventListener('click', () => {
    marcarVisto(yo, ...lista.map(a => a.id));
    pintarPanelAvisos();
    pintarEscritorio();
    pintarContadorAvisos();
  });
}


/* ── La ficha de vista previa ──────────────────────────── */

let previaCtx = null;
let laminaActual = 0;

function abrirPrevia(idPieza) {
  const p = datos.parrilla.piezas.find(x => x.id === idPieza);
  if (!p) return;

  previaCtx = { pieza: p };
  $('#previa').classList.remove('estrecha');
  // Sin laminas no hay nada que llevarse: el boton estorba.
  $('#previaBajarTodo').hidden = !archivosDe(p).length;
  laminaActual = 0;
  $('#previa').hidden = false;
  document.addEventListener('keydown', tecladoPrevia);
  pintarPrevia();
}

/* El mismo panel que las piezas: si el evento se abriera en otro
   lado, el gesto de "picar algo del calendario" tendria dos
   resultados distintos segun lo que picaste. */
function abrirFichaEvento(idEvento) {
  const e = (datos.parrilla.eventos || []).find(x => x.id === idEvento);
  if (!e) return;

  previaCtx = { evento: e };
  $('#previaBajarTodo').hidden = true;
  // El panel ancho es para la simulacion del post; un evento no
  // tiene que enseñar.
  $('#previa').classList.add('estrecha');
  $('#previa').hidden = false;
  document.addEventListener('keydown', tecladoPrevia);
  pintarPrevia();
}

function cerrarPrevia() {
  $('#previa').hidden = true;
  document.removeEventListener('keydown', tecladoPrevia);
  previaCtx = null;
}

function tecladoPrevia(ev) {
  if (!previaCtx) return;
  if (ev.key === 'Escape') { cerrarPrevia(); return; }
  if (!previaCtx.pieza) return;   // un evento no tiene láminas que pasar
  const n = archivosDe(previaCtx.pieza).length;
  if (n < 2) return;
  if (ev.key === 'ArrowRight') { laminaActual = (laminaActual + 1) % n; pintarLaminas(); }
  if (ev.key === 'ArrowLeft')  { laminaActual = (laminaActual - 1 + n) % n; pintarLaminas(); }
}

function pintarPrevia() {
  if (previaCtx.evento) return pintarFichaEvento();
  const p = previaCtx.pieza;
  const cuerpo = $('#previaCuerpo');
  const pil = PILARES.find(x => x.id === p.pilar);
  const est = ESTADOS.find(x => x.id === p.estado);
  const ap = p.aprobacion || { estado: 'pendiente', comentarios: [] };
  const rev = estadoRevision(p);
  const marca = APROBACIONES[rev.estado] || APROBACIONES.pendiente;
  const archivos = archivosDe(p);
  const esCarrusel = archivos.length > 1 || p.formato === 'Carrusel';

  const canales = (p.canales || [])
    .map(id => CANALES.find(c => c.id === id)).filter(Boolean);
  // La simulación se arma con el primer canal: un post de Instagram
  // y uno de LinkedIn no se ven igual, y enseñar un promedio de los
  // dos no le sirve a nadie.
  const canal = canales[0] || CANALES[1];

  cuerpo.innerHTML = `
    <div class="previa-rejilla">

      <div class="simulacion">
        <div class="sim-marco sim-${esc(canal.id)}">
          <div class="sim-cabecera">
            <div class="sim-avatar" aria-hidden="true">IB</div>
            <div>
              <b>iberotijuana</b>
              <span>${esc(canal.nombre)}</span>
            </div>
          </div>

          <div class="sim-lienzo" id="simLienzo"></div>

          ${esCarrusel ? '<div class="sim-puntos" id="simPuntos"></div>' : ''}

          <div class="sim-copy">
            <b>iberotijuana</b>
            ${p.copy ? esc(p.copy).replace(/\n/g, '<br>')
                     : '<i class="tenue">Sin copy todavía. Se escribe en Editar.</i>'}
          </div>
        </div>
      </div>

      <div class="previa-datos">
        <div class="previa-titulo">${esc(p.titulo || 'Sin título')}</div>

        <div class="previa-chips">
          ${pil ? `<span class="chip chip-pilar" style="background:${pil.solido}">${esc(pil.nombre)}</span>` : ''}
          ${p.formato ? `<span class="chip chip-estado" style="color:${est ? est.color : 'var(--tinta-media)'}">${esc(p.formato)}</span>` : ''}
          ${canales.map(c => `<span class="chip chip-canal" style="background:${c.color}">${esc(c.corto)}</span>`).join('')}
        </div>

        <dl class="previa-lista">
          <dt>Sale</dt><dd>${esc(fechaLegible(p.fecha) || 'sin fecha')}${
            p.hora ? ' · ' + esc(horaLegible(p.hora)) : ''}</dd>
          <dt>Estado</dt><dd style="color:${est ? est.color : ''}">${esc(est ? est.nombre : '—')}</dd>
          <dt>Responsable</dt><dd>${esc(p.responsable || 'sin asignar')}</dd>
          ${quienAnoto(p) ? `<dt>Quién la anotó</dt><dd class="tenue">${esc(quienAnoto(p))}</dd>` : ''}
          ${archivos.length ? `<dt>Archivos</dt><dd>${archivos.length} ${archivos.length === 1 ? 'lámina' : 'láminas'}</dd>` : ''}
        </dl>

        ${p.notas ? `<div class="previa-notas"><b>Notas</b>${esc(p.notas).replace(/\n/g,'<br>')}</div>` : ''}

        <div class="previa-aprobacion" style="--tono:${marca.color}">
          <div class="ap-estado">
            <span class="ap-punto"></span>
            <b>${esc(marca.nombre)}</b>
            ${ap.por ? `<span class="tenue">· ${esc(ap.por)}${ap.cuando ? ', ' + esc(fechaLegible(ap.cuando.slice(0,10))) : ''}</span>` : ''}
          </div>

          ${(ap.comentarios || []).length ? `
            <div class="ap-hilo">
              ${ap.comentarios.map(c => `
                <div class="ap-comentario">
                  <b>${esc(c.quien)}</b>
                  <span class="tenue">${esc(fechaLegible((c.cuando||'').slice(0,10)))}</span>
                  <p>${esc(c.texto).replace(/\n/g,'<br>')}</p>
                </div>`).join('')}
            </div>` : ''}

          ${REDES_AUTOMATICAS.filter(r => p.publicaciones && p.publicaciones[r.id]).map(r => {
            const s = p.publicaciones[r.id];
            return `<div class="ap-publicada">
              Publicada en ${esc(r.nombre)}${s.por ? ' por ' + esc(s.por) : ''}.
              ${s.enlace ? `<a href="${esc(s.enlace)}" target="_blank" rel="noopener">Ver el post ↗</a>` : ''}
            </div>`; }).join('')}

          ${rev.caducada ? (() => {
            const qs = queCambio(p);
            const lista = qs.length
              ? qs.slice(0, -1).join(', ') + (qs.length > 1 ? ' y ' : '') + qs[qs.length - 1]
              : '';
            /* El texto tiene que decir la verdad del estado en que
               esta: hablar de "la aprobacion" cuando todavia no hay
               ninguna confunde mas de lo que avisa. */
            return `<div class="ap-caducada">
              ${rev.crudo === 'aprobado'
                ? `Cambió ${lista || 'algo'} después de que ${esc(ap.por || 'la revisaron')} la aprobó,
                   así que la aprobación ya no aplica a lo que hay ahora.`
                : `Cambió ${lista || 'algo'} después de que ${esc(ap.corrigio || 'alguien')} la marcó
                   como corregida, así que quien la revise va a ver algo distinto.`}
            </div>`; })() : ''}

          <div class="ap-acciones">
            ${puedeAprobar() ? `
              <button class="btn-primario" id="apAprobar">✓ Aprobar</button>
              <button class="btn-plano" id="apCambios">Pedir cambios</button>` : ''}
            ${rev.crudo === 'cambios' && !soloLectura('parrilla_piezas') ? `
              <button class="btn-primario" id="apCorregido">Ya lo corregí</button>` : ''}
          </div>

          <div class="ap-nuevo">
            <label for="apTexto" class="sr-solo">Comentario</label>
            <textarea class="campo" id="apTexto" rows="2"
              placeholder="${puedeAprobar() ? 'Comentario (opcional al aprobar, necesario al pedir cambios)' : 'Deja un comentario'}"></textarea>
            <button class="btn-plano" id="apComentar">Comentar sin decidir</button>
          </div>
        </div>

        ${bloqueCuando(p, rev, archivos)}
      </div>
    </div>`;

  $('#previaTitulo').textContent = 'Vista previa';
  pintarLaminas();
  conectarPrevia();
}

function pintarFichaEvento() {
  const e = previaCtx.evento;
  const necesita = necesidadesDe(e)
    .map(id => (QUE_SE_NECESITA.find(x => x.id === id) || {}).nombre)
    .filter(Boolean);
  const t = tipoDe(e);
  const L = t.etiquetas;
  const est = estadoDe(e);

  /* Lo primero que uno quiere saber de un evento anotado es si ya
     hay alguien encargado de cubrirlo. Ese dato existia —las piezas
     guardan de_evento— pero no se veia en ningun lado. */
  const coberturas = datos.parrilla.piezas.filter(p => p.de_evento === e.id);

  const hoy = aTexto(new Date());
  const dias = Math.round((aFecha(e.fecha) - aFecha(hoy)) / 86400000);
  const cuando = !e.fecha ? '' : dias === 0 ? 'hoy'
               : dias === 1 ? 'mañana'
               : dias > 0 ? `en ${dias} días`
               : dias === -1 ? 'ayer' : `hace ${-dias} días`;

  const dura = duracionEntre(e.hora, e.hora_fin);

  $('#previaCuerpo').innerHTML = `
    <div class="ficha-ev">

      <header class="ficha-ev-cabeza">
        ${selloEstado(etiquetaEvento(e))}
        <h4 class="previa-titulo">${esc(e.titulo || 'Evento sin nombre')}</h4>
        ${est && est.nota ? `<p class="ficha-ev-nota">${esc(est.nota)}</p>` : ''}
      </header>

      <dl class="previa-lista">
        <dt>Cuándo</dt>
        <dd>${esc(fechaLegible(e.fecha) || 'sin fecha')}${
          e.hora ? ' · ' + esc(rangoHoras(e.hora, e.hora_fin)) : ''}
          ${cuando || dura ? `<span class="tenue">(${
            esc([cuando, dura].filter(Boolean).join(' · '))})</span>` : ''}</dd>

        <dt>${esc(L.lugar)}</dt>
        <dd>${e.lugar ? esc(e.lugar) : '<span class="tenue">sin definir</span>'}</dd>

        <dt>${esc(L.quien)}</dt>
        <dd>${e.solicita ? esc(e.solicita) : '<span class="tenue">sin registrar</span>'}</dd>

        ${t.necesita ? `<dt>Qué se necesita</dt>
        <dd>${necesita.length
          ? `<span class="ficha-ev-necesita">${necesita.map(n =>
              `<span class="chip-necesita">${esc(n)}</span>`).join('')}</span>`
          : '<span class="tenue">todavía sin definir</span>'}</dd>` : ''}

        ${quienAnoto(e) ? `<dt>Lo anotó</dt>
        <dd class="tenue">${esc(quienAnoto(e))}</dd>` : ''}
      </dl>

      ${e.notas ? `<div class="previa-notas"><b>Detalles</b>${
        esc(e.notas).replace(/\n/g, '<br>')}</div>` : ''}

      ${t.cobertura ? `
      <section class="ficha-cobertura">
        <b>Cobertura</b>
        ${coberturas.length ? `
          <div class="ficha-piezas">
            ${coberturas.map(p => `
              <button class="ficha-pieza" data-pieza="${esc(p.id)}">
                ${selloEstado(etiquetaPieza(p))}
                <span class="ficha-pieza-titulo">${esc(p.titulo || 'Sin título')}</span>
                <span class="tenue">${esc(fechaLegible(p.fecha) || 'sin fecha')}</span>
              </button>`).join('')}
          </div>`
          : `<p class="ficha-ev-vacio">Nadie ha programado todavía una pieza para este evento.</p>`}
        ${soloLectura('parrilla_piezas') ? '' : `
          <button type="button" class="btn-primario acento-evento ancho" id="fichaCubrir">
            ◈ Programar ${coberturas.length ? 'otra pieza' : 'la cobertura'}
          </button>
          <p class="ficha-ev-pie">Nace con la fecha acotada: nada de cobertura puede publicarse antes de que el evento ocurra.</p>`}
      </section>` : ''}
    </div>`;

  $('#previaTitulo').textContent = t.nombre;

  const cubrir = $('#fichaCubrir');
  if (cubrir) cubrir.addEventListener('click', () => {
    cerrarPrevia();
    coberturaDeEvento(e);
  });

  $$('.ficha-pieza').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.pieza;
    cerrarPrevia();
    abrirPrevia(id);
  }));
}

async function pintarLaminas() {
  const p = previaCtx.pieza;
  const archivos = archivosDe(p);
  const lienzo = $('#simLienzo');
  if (!lienzo) return;

  if (!archivos.length) {
    lienzo.innerHTML = p.imagen
      ? `<img src="${esc(p.imagen)}" alt="">
         <div class="sim-aviso">Sólo hay miniatura. Sube el arte final en Editar.</div>`
      : `<div class="sim-vacio">
           Todavía no hay arte.<br>
           <span class="tenue">Súbelo desde Editar y aquí se verá como va a salir.</span>
         </div>`;
    return;
  }

  const puntos = $('#simPuntos');
  if (puntos) {
    puntos.innerHTML = archivos.map((_, i) =>
      `<button class="sim-punto${i === laminaActual ? ' activo' : ''}" data-lamina="${i}"
         aria-label="Lámina ${i + 1} de ${archivos.length}"></button>`).join('');
    $$('.sim-punto', puntos).forEach(b => b.addEventListener('click', () => {
      laminaActual = +b.dataset.lamina; pintarLaminas();
    }));
  }

  const a = archivos[laminaActual] || archivos[0];
  lienzo.innerHTML = '<div class="sim-cargando">Cargando…</div>';
  try {
    const url = await urlDeArchivo(varianteDe(a, 'previa'));
    const flechas = archivos.length > 1 ? `
      <button class="sim-flecha izq" id="simAtras" aria-label="Lámina anterior">‹</button>
      <button class="sim-flecha der" id="simAdelante" aria-label="Lámina siguiente">›</button>
      <span class="sim-cuenta">${laminaActual + 1}/${archivos.length}</span>` : '';
    lienzo.innerHTML = `<img src="${url}" alt="${esc(a.nombre || '')}">${flechas}`;

    if (archivos.length > 1) {
      $('#simAtras').addEventListener('click', () => {
        laminaActual = (laminaActual - 1 + archivos.length) % archivos.length; pintarLaminas();
      });
      $('#simAdelante').addEventListener('click', () => {
        laminaActual = (laminaActual + 1) % archivos.length; pintarLaminas();
      });
    }
  } catch (e) {
    lienzo.innerHTML = `<div class="sim-vacio">${esc(e.message)}</div>`;
  }
}

function conectarPrevia() {
  const p = previaCtx.pieza;

  const registrarAprobacion = (estado) => {
    const texto = ($('#apTexto').value || '').trim();
    if (estado === 'cambios' && !texto) {
      avisar('Escribe qué hay que cambiar: sin eso el aviso no sirve de nada.');
      $('#apTexto').focus();
      return;
    }
    p.aprobacion = p.aprobacion || { comentarios: [] };
    p.aprobacion.estado = estado;
    p.aprobacion.por = Almacen.usuario ? Almacen.usuario.nombre : '';
    p.aprobacion.cuando = ahora();
    // La huella de lo que se acaba de revisar, para saber despues
    // si lo que hay sigue siendo esto.
    p.aprobacion.sello = selloDeRevision(p);
    if (texto) {
      p.aprobacion.comentarios = p.aprobacion.comentarios || [];
      p.aprobacion.comentarios.push({
        quien: Almacen.usuario ? Almacen.usuario.nombre : '',
        cuando: ahora(), texto,
      });
    }
    p.actualizado = ahora();
    guardar('parrilla');
    registrar(`${estado === 'aprobado' ? 'Aprobó' : 'Pidió cambios en'} «${p.titulo}»`);
    avisar(estado === 'aprobado' ? 'Aprobada.' : 'Se registró la petición de cambios.');
    pintarPrevia();
    refrescarParrilla();
  };

  if ($('#apAprobar')) $('#apAprobar').addEventListener('click', () => registrarAprobacion('aprobado'));
  if ($('#apCambios')) $('#apCambios').addEventListener('click', () => registrarAprobacion('cambios'));

  /* Sin esto el ciclo no cierra: ella pedia cambios, el los hacia, y
     la pieza se quedaba en "pide cambios" para siempre porque nadie
     tenia como decir "ya quedo, vuelvelo a ver". */
  /* Sin esto, el aviso de "lista para publicar" no se apaga nunca.
     Sergio la publicaba en Instagram y la unica forma de decirlo
     aqui era entrar a Editar y buscar el estado en un desplegable:
     nadie lo hace, y el aviso se queda dando lata hasta que estorba
     tanto que se ignoran todos. */
  /* CONFIRMACION EN DOS PASOS, A PROPOSITO

     Esto sale a 5,700 personas y no se deshace: borrar un post no
     borra a quien ya lo vio. Un solo clic para eso es poco clic. La
     confirmacion dice exactamente que va a salir y a donde, para
     que no haya que acordarse. */
  if ($('#apPublicar')) $('#apPublicar').addEventListener('click', () => {
    const cuantas = archivosDe(p).length;
    const redes = redesPendientes(p);
    /* Si ya salio antes en esa red, decirlo. Se puede querer -- se
       borro el post y se rehace -- pero nunca por descuido. */
    const repetidas = redes.filter(r => p.publicaciones && p.publicaciones[r.id]);
    const caja = $('.ap-acciones');
    const antes = caja.innerHTML;
    caja.innerHTML = `
      <div class="ap-confirma">
        <p>Va a salir <b>ahora mismo</b> a <b>${esc(redes.map(r => r.nombre).join(' y '))}</b>${
             cuantas > 1 ? `, con <b>${cuantas} láminas</b>` : ''}.
           Esto no se puede deshacer.</p>
        ${p.autopublicar && !porQueNoSaldraSola(p) ? `<p class="ap-repetida">
           Esta pieza <b>ya estaba armada para salir sola</b>${
             p.hora ? ' a las ' + esc(horaLegible(p.hora)) : ''} del ${esc(fechaLegible(p.fecha))}.
           Si publicas ahora, sale <b>ya</b> y no espera.</p>` : ''}
        ${repetidas.length ? `<p class="ap-repetida">
           Ojo: esta pieza <b>ya se publicó</b> en ${esc(repetidas.map(r => r.nombre).join(' y '))}.
           Si vuelves a darle, saldrá otra vez.</p>` : ''}
        <div class="ap-confirma-botones">
          <button class="btn-plano" id="apCancelarPub">Mejor no</button>
          <button class="btn-primario" id="apVaya">Sí, publicar</button>
        </div>
      </div>`;

    $('#apCancelarPub').addEventListener('click', () => { caja.innerHTML = antes; conectarPrevia(); });

    $('#apVaya').addEventListener('click', async () => {
      const b = $('#apVaya');
      b.disabled = true;
      $('#apCancelarPub').disabled = true;
      b.textContent = 'Publicando…';
      try {
        const d = await llamarFuncion('publicar', {
          accion: 'publicar', pieza: p.id, redes: redes.map(r => r.id) });

        // El servidor ya la marco; se refleja aqui para no esperar a
        // la siguiente sincronizacion.
        const quien = Almacen.usuario ? Almacen.usuario.nombre : '';
        p.estado = 'publicado';
        p.publicado = ahora();
        p.publicaciones = Object.assign({}, p.publicaciones);
        const salieron = Object.keys(d.salidas || {});
        salieron.forEach(red => {
          p.publicaciones[red] = { id: d.salidas[red].id, enlace: d.salidas[red].enlace,
                                   cuando: p.publicado, por: quien };
        });

        const nombra = ids => ids.map(x =>
          (REDES_AUTOMATICAS.find(r => r.id === x) || {}).nombre || x).join(' y ');
        registrar(`Publicó «${p.titulo}» en ${nombra(salieron)}`);

        /* Si una red salio y otra no, decirlo. Callarlo dejaria a
           alguien creyendo que ya esta en las dos. */
        const fallaron = Object.keys(d.fallos || {});
        avisar(fallaron.length
          ? `Salió en ${nombra(salieron)}. En ${nombra(fallaron)} no: ${d.fallos[fallaron[0]]}`
          : `Publicada en ${nombra(salieron)}.`);
        pintarPrevia();
        refrescarParrilla();
        pintarEscritorio();
        pintarContadorAvisos();
      } catch (e) {
        caja.innerHTML = `<p class="lamina-error">⚠ ${esc(e.message)}</p>` + antes;
        conectarPrevia();
      }
    });
  });

  /* Programar y desprogramar viven aqui, junto a publicar, porque
     son la misma pregunta con distinta respuesta. */
  const armar = (hora) => {
    p.autopublicar = true;
    if (hora) p.hora = hora;
    p.actualizado = ahora();
    guardar('parrilla');
    registrar(`Programó «${p.titulo}» para salir sola`);
    avisar(`Queda programada${p.hora ? ' a las ' + horaLegible(p.hora) : ''}. Ya no hay que apretar nada.`);
    pintarPrevia();
    refrescarParrilla();
  };

  if ($('#apProgramar')) $('#apProgramar').addEventListener('click', () => {
    if (p.hora) { armar(); return; }
    // Sin hora no se puede programar, y suponerla seria decidir a
    // que hora lo ven 42 mil personas.
    const caja = $('#cuandoHora');
    caja.hidden = false;
    $('#apHora').focus();
    $('#apHoraOk').addEventListener('click', () => {
      const h = $('#apHora').value;
      if (!h) { avisar('Ponle una hora.'); return; }
      armar(h);
    }, { once: true });
  });

  if ($('#apDesprogramar')) $('#apDesprogramar').addEventListener('click', () => {
    p.autopublicar = false;
    p.actualizado = ahora();
    guardar('parrilla');
    registrar(`Quitó la programación de «${p.titulo}»`);
    avisar('Ya no sale sola. Habrá que publicarla a mano.');
    pintarPrevia();
    refrescarParrilla();
  });

  if ($('#apPublicado')) $('#apPublicado').addEventListener('click', () => {
    p.estado = 'publicado';
    p.publicado = ahora();
    p.actualizado = ahora();
    guardar('parrilla');
    registrar(`Publicó «${p.titulo}»`);
    avisar('Marcada como publicada.');
    pintarPrevia();
    refrescarParrilla();
    pintarEscritorio();
    pintarContadorAvisos();
  });

  if ($('#apCorregido')) $('#apCorregido').addEventListener('click', () => {
    const texto = ($('#apTexto').value || '').trim();
    const quien = Almacen.usuario ? Almacen.usuario.nombre : '';
    p.aprobacion = p.aprobacion || { comentarios: [] };
    p.aprobacion.estado = 'revisar';
    p.aprobacion.corrigio = quien;
    p.aprobacion.corregido = ahora();
    p.aprobacion.sello = selloDeRevision(p);
    p.aprobacion.comentarios = p.aprobacion.comentarios || [];
    p.aprobacion.comentarios.push({
      quien, cuando: ahora(),
      texto: texto || 'Corregido, listo para revisar otra vez.',
    });
    p.actualizado = ahora();
    guardar('parrilla');
    registrar(`Corrigió «${p.titulo}» y la mandó a revisión`);
    avisar('Queda para revisión. Le va a aparecer a quien revisa.');
    pintarPrevia();
    refrescarParrilla();
    pintarEscritorio();
    pintarContadorAvisos();
  });

  if ($('#apComentar')) $('#apComentar').addEventListener('click', () => {
    const texto = ($('#apTexto').value || '').trim();
    if (!texto) return;
    p.aprobacion = p.aprobacion || { estado: 'pendiente', comentarios: [] };
    p.aprobacion.comentarios = p.aprobacion.comentarios || [];
    p.aprobacion.comentarios.push({
      quien: Almacen.usuario ? Almacen.usuario.nombre : '',
      cuando: ahora(), texto,
    });
    p.actualizado = ahora();
    guardar('parrilla');
    avisar('Comentario guardado.');
    pintarPrevia();
    pintarEscritorio();
    pintarContadorAvisos();
  });
}


/* ── Modal: control común ──────────────────────────────── */

/* Quien tenía el foco antes de abrir, para devolvérselo al cerrar. */
let focoPrevio = null;

function enfocablesDelModal() {
  return $$('#modalFondo button, #modalFondo input, #modalFondo select, ' +
            '#modalFondo textarea, #modalFondo [tabindex]')
    .filter(el => !el.disabled && el.offsetParent !== null);
}

/* El modal decía aria-modal="true" pero el foco no estaba atrapado:
   con el tabulador te salías a los cientos de controles de atrás,
   que además siguen ahí y siguen siendo clicables. Para quien navega
   con teclado, eso vuelve el modal inservible. */
function atraparFoco(ev) {
  if (ev.key !== 'Tab') return;
  const lista = enfocablesDelModal();
  if (!lista.length) return;
  const primero = lista[0], ultimo = lista[lista.length - 1];
  if (ev.shiftKey && document.activeElement === primero) {
    ev.preventDefault(); ultimo.focus();
  } else if (!ev.shiftKey && document.activeElement === ultimo) {
    ev.preventDefault(); primero.focus();
  }
}

function mostrarModal() {
  const yaEstaba = !$('#modalFondo').hidden;
  if (!yaEstaba) focoPrevio = document.activeElement;
  $('#modalFondo').hidden = false;
  aplicarPermisosModal();

  /* El foco entra al primer campo, no se queda afuera: si no, hay
     que tabular por toda la página para llegar a la ficha.

     Solo al ABRIR. Si la ficha se vuelve a pintar con el modal ya
     abierto, mandar el foco arriba te arrastra el scroll hasta el
     principio -- justo lo que pasaba al acomodar una lamina. */
  if (!yaEstaba) {
    const lista = enfocablesDelModal();
    const primerCampo = lista.find(el => /INPUT|TEXTAREA|SELECT/.test(el.tagName)) || lista[0];
    if (primerCampo) setTimeout(() => primerCampo.focus(), 30);
  }

  document.removeEventListener('keydown', atraparFoco, true);
  document.addEventListener('keydown', atraparFoco, true);
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
  document.removeEventListener('keydown', atraparFoco, true);
  // El foco vuelve a donde estaba: perderlo manda al principio de la
  // página y hay que rehacer todo el camino.
  if (focoPrevio && document.contains(focoPrevio)) {
    try { focoPrevio.focus(); } catch (e) { /* el nodo pudo desaparecer */ }
  }
  focoPrevio = null;

  // Ajustes esconde Guardar y renombra Cancelar; hay que devolver
  // el pie a su estado o la siguiente ficha abre sin boton de guardar.
  $('#modalGuardar').hidden = false;
  $('#modalGuardar').disabled = false;
  $('#modalGuardar').textContent = 'Guardar';
  $('#modalCancelar').textContent = 'Cancelar';
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
  if (tipo === 'evento')  ok = leerEvento();
  if (tipo === 'alta')    { crearUsuario(); return; }
  if (!ok) return;

  // Si esta pieza nació de una idea del banco, la idea se va AHORA, que es
  // cuando de verdad se convirtió en algo. Así cancelar el modal no cuesta
  // nada, y deshacer devuelve las dos cosas juntas.
  if (tipo === 'pieza' && esNuevo && d.vieneDeIdea) {
    datos.parrilla.ideas = datos.parrilla.ideas.filter(i => i.id !== d.vieneDeIdea);
    delete d.vieneDeIdea;
    guardar('parrilla');
  }

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
   Al guardar una, LA PIZARRA ofrece crear sus derivados de un jalón. */
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
               : t === 'experto' ? 'a este experto del directorio'
               : t === 'evento' ? 'este evento' : 'este registro de vuelo';
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
  } else if (t === 'evento') {
    datos.parrilla.eventos = (datos.parrilla.eventos || []).filter(x => x.id !== idBorrar);
    guardar('parrilla');
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
    if (vistaActual === 'escritorio') pintarEscritorio();
    if (vistaActual === 'ajustes') pintarAjustes();
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

  /* Elegir archivos y soltarlos encima hacen lo mismo. Se acepta
     soltar porque una creadora llega con la carpeta abierta al
     lado, no navegando un cuadro de dialogo. */
  const zona = $('#soltarEntrega');
  const campo = $('#archivoEntrega');
  if (zona && campo) {
    $('#elegirEntrega').addEventListener('click', () => campo.click());
    campo.addEventListener('change', () => {
      if (campo.files.length) revisarYEnseñar([...campo.files]);
      campo.value = '';        // para poder reelegir el mismo archivo
    });
    ['dragenter', 'dragover'].forEach(ev => zona.addEventListener(ev, e => {
      e.preventDefault(); zona.classList.add('encima');
    }));
    ['dragleave', 'drop'].forEach(ev => zona.addEventListener(ev, e => {
      e.preventDefault(); zona.classList.remove('encima');
    }));
    zona.addEventListener('drop', e => {
      const fs = [...(e.dataTransfer.files || [])];
      if (fs.length) revisarYEnseñar(fs);
    });
  }

  $('#nuevaPieza').addEventListener('click', () => abrirPieza(null));
  $('#nuevoEvento').addEventListener('click', () => abrirEvento(null));

  /* Sólo quien administra: es una herramienta para comprobar la
     aplicación, no una forma de asomarse a la cuenta de otro. */
  const selPiel = $('#selVerComo');
  if (selPiel) {
    selPiel.innerHTML = '<option value="">yo mismo</option>' +
      ROLES_SISTEMA.map(r => `<option value="${r.id}">${esc(r.nombre)}</option>`).join('');
    selPiel.addEventListener('change', () => ponerseEnLaPielDe(selPiel.value));
    $('#salirVerComo').addEventListener('click', () => ponerseEnLaPielDe(null));
  }

  $('#previaCerrar').addEventListener('click', cerrarPrevia);
  $('#previaBajarTodo').addEventListener('click', bajarPostCompleto);
  $('#previaEditar').addEventListener('click', () => {
    if (!previaCtx) return;
    const esEvento = !!previaCtx.evento;
    const id = esEvento ? previaCtx.evento.id : previaCtx.pieza.id;
    cerrarPrevia();
    if (!id) return;
    if (esEvento) abrirEvento(id); else abrirPieza(id);
  });
  // Cerrar al picar el fondo, con la misma guarda que el modal:
  // el gesto tiene que empezar Y terminar fuera.
  let origenPrevia = null;
  $('#previa').addEventListener('mousedown', ev => { origenPrevia = ev.target; });
  $('#previa').addEventListener('click', ev => {
    const empezoFuera = origenPrevia && origenPrevia.id === 'previa';
    origenPrevia = null;
    if (ev.target.id === 'previa' && empezoFuera) cerrarPrevia();
  });
  $('#btnAjustes').addEventListener('click', () => $('[data-vista="ajustes"]').click());
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
  $('#btnAvisos').addEventListener('click', () => alternarPanelAvisos());
  $('#cerrarAvisos').addEventListener('click', () => alternarPanelAvisos(false));
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
      if (!$('#panelAvisos').hidden) { alternarPanelAvisos(false); return; }
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

/* ══════════════════════════════════════════════════════════
   QUÉ VE CADA QUIEN

   Cambio de criterio, a pedido de Leo. Antes todos veían las siete
   pestañas y lo que no les tocaba salía apagado. El argumento era
   que el calendario compartido es el punto de la herramienta — y
   sigue siendo cierto PARA EL CALENDARIO.

   Pero no aplica a todo. El inventario es el control interno del
   equipo de Leo: para Marysol y Sergio no es contexto compartido,
   es ruido. Y la administración de cuentas con los roles de los
   demás no tiene por qué estar a la vista de nadie más.

   La regla que quedó: se comparte lo que es del EQUIPO, se esconde
   lo que es de UNA persona o de la administración.

   OJO — esto es comodidad, no seguridad. Quien manipule el
   navegador puede volver a mostrar una pestaña. Lo que de verdad
   cierra la puerta son las reglas de la base: escribir ya estaba
   bloqueado, y ahora leer el inventario también.
   ══════════════════════════════════════════════════════════ */

const VISTAS_POR_ROL = {
  admin: {
    ve: ['parrilla', 'escritorio', 'inventario', 'redaccion', 'expertos', 'auditoria', 'ajustes'],
    porque: 'Administra y opera todo',
  },
  direccion: {
    // La jefa: el plan, la mesa de redacción que es su trabajo, los
    // expertos que entrevista, y el diagnóstico. El inventario no:
    // no administra cámaras.
    ve: ['parrilla', 'escritorio', 'redaccion', 'expertos', 'auditoria', 'ajustes'],
    porque: 'Dirige el área y escribe las notas',
  },
  redaccion: {
    ve: ['parrilla', 'escritorio', 'redaccion', 'expertos', 'ajustes'],
    porque: 'Escribe las notas académicas',
  },
  publicacion: {
    // Sergio publica notas en el sitio: necesita ver la parrilla y
    // la mesa de redacción, que es de donde le llegan. No necesita
    // el directorio de expertos — él no entrevista a nadie — ni el
    // inventario, ni el diagnóstico del área.
    ve: ['parrilla', 'escritorio', 'redaccion', 'ajustes'],
    porque: 'Publica las notas en el sitio',
  },
  produccion: {
    // La agencia: sube piezas e ideas y nada más.
    ve: ['parrilla', 'escritorio', 'ajustes'],
    porque: 'Produce contenido',
  },
};

function vistasQueVeo() {
  if (!Almacen.enLaNube || !Almacen.usuario) {
    return ['parrilla', 'escritorio', 'inventario', 'redaccion', 'expertos', 'auditoria', 'ajustes'];
  }
  const r = VISTAS_POR_ROL[Almacen.usuario.rol];
  return r ? r.ve : ['parrilla', 'escritorio', 'ajustes'];
}

function aplicarVistasPorRol() {
  const mias = vistasQueVeo();

  $$('.tab').forEach(t => {
    const v = t.dataset.vista;
    if (!v) return;
    t.hidden = !mias.includes(v);
  });

  // Si estabas parado en una pestaña que ya no te toca — por
  // ejemplo al cambiar de cuenta en la misma computadora — te
  // devuelve a la parrilla en vez de dejarte en una vista muerta.
  if (!mias.includes(vistaActual)) {
    const primera = $(`.tab[data-vista="${mias[0]}"]`);
    if (primera) primera.click();
  }
}

/* ══════════════════════════════════════════════════════════
   QUÉ TOCA CADA QUIEN

   Todos ven todas las pestañas, a propósito. El calendario
   compartido es justo el punto de la herramienta: Sergio tiene
   que ver lo que viene aunque no lo mueva, y Marysol tiene que
   saber que hay inventario aunque no administre cámaras.
   Esconder pestañas haría creer que la aplicación está rota.

   Lo que sí cambia es qué se puede editar. Y se apaga ANTES de
   que alguien capture algo, no al guardar: perder media hora de
   captura por un permiso sería lo peor que puede pasar aquí.

   Esto es comodidad, no seguridad. Quien edite esta página
   puede reactivar los botones — y la base lo seguirá frenando
   igual, porque el permiso de verdad vive allá.
   ══════════════════════════════════════════════════════════ */

/* Cada control apunta a la colección REAL que va a escribir, no a
   la pestaña donde vive. La diferencia importa: Sergio puede
   escribir piezas pero no ideas, y las dos están en Parrilla. Si
   preguntáramos por pestaña, se le quedaría "+ Agregar idea"
   encendido para que la base se lo rebotara después.

   Sólo los que crean o modifican. Filtros, búsqueda, navegación
   y "copiar lista" se quedan vivos: en lectura siguen sirviendo. */
const CONTROLES_QUE_EDITAN = {
  parrilla: {
    nuevoEvento:        'parrilla_eventos',
    nuevaPieza:         'parrilla_piezas',
    acomodarPendientes: 'parrilla_piezas',
    ideaClasificada:    'parrilla_ideas',
    nuevaIdea:          'parrilla_ideas',
  },
  inventario: {
    nuevoEquipo:      'inventario_equipos',
    prestarSeleccion: 'inventario_equipos',
    nuevoVuelo:       'inventario_vuelos',
  },
  redaccion: {
    nuevoTema: 'redaccion_temas',
    nuevaNota: 'parrilla_piezas',   // una nota es una pieza de formato Nota
  },
  expertos: {
    nuevoExperto: 'expertos_personas',
  },
};

/* Qué colección escribe cada ficha del modal. */
const COLECCION_DE_MODAL = {
  evento:  'parrilla_eventos',
  pieza:   'parrilla_piezas',
  equipo:  'inventario_equipos',
  vuelo:   'inventario_vuelos',
  tema:    'redaccion_temas',
  experto: 'expertos_personas',
};

function soloLectura(coleccion) {
  if (!Almacen.enLaNube || !Almacen.usuario) return false;
  // De PERMISOS_UI y no de usuario.escribe, para que "ver como"
  // pase también por aquí. La restricción de verdad la aplica
  // Postgres; esto sólo atenúa botones.
  const permitidas = PERMISOS_UI[rolUI()] || [];
  return !(permitidas.includes('*') || permitidas.includes(coleccion));
}

function aplicarPermisos() {
  aplicarVistasPorRol();

  for (const [vista, controles] of Object.entries(CONTROLES_QUE_EDITAN)) {
    let algoSeEdita = false;

    for (const [id, coleccion] of Object.entries(controles)) {
      const bloqueado = soloLectura(coleccion);
      if (!bloqueado) algoSeEdita = true;
      const b = $('#' + id);
      if (!b) continue;
      b.disabled = bloqueado;
      if (bloqueado) b.title = 'Tu rol no edita esto';
      else b.removeAttribute('title');
    }

    // El aviso sale sólo cuando la pestaña entera quedó de consulta.
    // Si al menos una cosa se puede editar, los botones apagados ya
    // lo dicen solos y un letrero grande sobraría.
    const main = $('#vista-' + vista);
    if (!main) continue;
    const aviso = $('.aviso-lectura', main);

    if (!algoSeEdita && !aviso) {
      const nuevo = document.createElement('div');
      nuevo.className = 'aviso-lectura';
      nuevo.textContent =
        `Estás viendo esto en modo lectura. Tu rol (${
          (ROLES_SISTEMA.find(r => r.id === rolUI()) || {}).nombre || rolUI()}) ` +
        'no edita esta sección — puedes consultarla y copiar lo que necesites.';
      main.prepend(nuevo);
    } else if (algoSeEdita && aviso) {
      aviso.remove();
    }
  }
}

/* El modal se abre siempre — leer la ficha completa es útil para
   todos. Lo que se apaga es guardar y eliminar. */
function aplicarPermisosModal() {
  const coleccion = COLECCION_DE_MODAL[modalCtx && modalCtx.tipo];
  const bloqueado = coleccion ? soloLectura(coleccion) : false;
  ['#modalGuardar', '#modalEliminar'].forEach(sel => {
    const b = $(sel);
    if (!b) return;
    b.disabled = bloqueado;
    if (bloqueado) b.title = 'Tu rol no edita esta sección';
  });
  $$('#modalCuerpo input, #modalCuerpo textarea, #modalCuerpo select')
    .forEach(el => { el.readOnly = bloqueado && el.tagName !== 'SELECT';
                     if (el.tagName === 'SELECT') el.disabled = bloqueado; });
}


/* ══════════════════════════════════════════════════════════
   LA PUERTA
   Sólo existe cuando los datos viven en la nube. Corriendo en
   tu máquina no hay a quién pedirle contraseña: el servidor
   local es tuyo y ya.
   ══════════════════════════════════════════════════════════ */

/* Un campo con "required" dentro de un div oculto SIGUE contando
   para la validación del navegador. Como no se ve, tampoco puede
   enseñar el aviso: cancela el envío sin decir nada y el botón
   parece muerto. Apagarlos es lo que los saca de la revisión —
   ocultarlos no basta. */
function apagarPaso(idPaso, apagado) {
  $$(`#${idPaso} input`).forEach(i => { i.disabled = apagado; });
}

function mostrarPuerta(paso) {
  const enClave = paso === 'clave';
  $('#puerta').hidden = false;
  $('#pasoEntrar').hidden = enClave;
  $('#pasoClave').hidden  = !enClave;
  apagarPaso('pasoEntrar', enClave);
  apagarPaso('pasoClave', !enClave);
  $('#btnPuerta').textContent = enClave ? 'Guardar y entrar' : 'Entrar';
  $('#puertaError').hidden = true;
  $('#puertaPie').textContent = enClave
    ? 'No podrás seguir sin cambiarla.'
    : '';
  setTimeout(() => {
    const foco = enClave ? $('#claveNueva') : $('#entrarCorreo');
    if (foco) foco.focus();
  }, 60);
}

function errorPuerta(texto) {
  const el = $('#puertaError');
  el.textContent = texto;
  el.hidden = false;
}

function pintarQuien(u) {
  const el = $('#quien');
  if (!u) { el.hidden = true; $('#btnSalir').hidden = true; $('#btnAjustes').hidden = true;
    $('#tabAjustes').hidden = true; return; }
  el.innerHTML = `<b>${esc(u.nombre)}</b><span>${esc(u.rol)}</span>`;
  el.hidden = false;
  $('#btnSalir').hidden = false;
  $('#btnAjustes').hidden = false;
  // Las pestañas las destapa aplicarVistasPorRol, todas por el
  // mismo camino: aquí sólo se enciende el engrane.
  aplicarVistasPorRol();
}

/* Cerrar de este lado pase lo que pase. Quedarse dentro por un
   error de red sería justo lo contrario de lo que se busca. */
async function salirDeVerdad() {
  try { await Almacen.salir(); } catch (e) { /* ignorado a propósito */ }
  Almacen.usuario = null;
  pintarQuien(null);
  $('#entrarClave').value = '';
  mostrarPuerta('entrar');
}

async function pasarAdentro(usuario) {
  Almacen.usuario = usuario;
  pintarQuien(usuario);

  if (usuario.debe_cambiar_clave) { mostrarPuerta('clave'); return; }

  await cargar();
  await cargarPersonas();
  $('#puerta').hidden = true;
  historial.pila = []; historial.indice = -1;
  registrar('Estado al abrir LA PIZARRA');
  refrescarTodo();
  arrancarSincronizacion();
}

function conectarPuerta() {
  $('#formEntrar').addEventListener('submit', async ev => {
    ev.preventDefault();
    const btn = $('#btnPuerta');
    if (btn.disabled) return;
    btn.disabled = true;
    $('#puertaError').hidden = true;

    try {
      if ($('#pasoClave').hidden) {
        const usuario = await Almacen.entrar(
          $('#entrarCorreo').value, $('#entrarClave').value);
        $('#entrarClave').value = '';
        await pasarAdentro(usuario);
      } else {
        const a = $('#claveNueva').value, b = $('#claveRepite').value;
        if (a.length < 8)  throw new Error('La contraseña necesita al menos 8 caracteres.');
        if (a !== b)       throw new Error('Las dos contraseñas no coinciden.');
        await Almacen.cambiarClave(a);
        $('#claveNueva').value = ''; $('#claveRepite').value = '';
        avisar('Contraseña cambiada. Ya sólo tú la conoces.');
        await pasarAdentro(Almacen.usuario);
      }
    } catch (e) {
      errorPuerta(e.message || 'No se pudo completar. Intenta de nuevo.');
    } finally {
      btn.disabled = false;
    }
  });

  $('#btnSalir').addEventListener('click', async () => {
    if (!confirm('¿Cerrar sesión?')) return;
    detenerSincronizacion();
    await salirDeVerdad();
  });
}

/* ── Trabajo de los demás ───────────────────────────────── */
/* Cada tanto se pregunta qué movieron Marysol y Sergio. No se
   sincroniza con el modal abierto ni con un guardado en vuelo:
   traer cambios encima de algo a medio escribir lo pisaría. */

let latido = null;

function arrancarSincronizacion() {
  if (!Almacen.enLaNube || latido) return;
  latido = setInterval(async () => {
    if (!$('#modalFondo').hidden) return;
    /* Ni con la vista previa abierta. Al sincronizar, el registro se
       REEMPLAZA en la lista: quien esta mirando la previa se queda
       con un objeto huerfano, y si desde ahi aprueba o pide cambios,
       su decision se escribe en algo que ya no esta en la lista y se
       pierde en silencio. Es el mismo agujero que tenia el acomodo
       de las laminas. */
    if (!$('#previa').hidden) return;
    if (hayGuardadoEnVuelo()) return;
    try {
      const { entraron } = await Almacen.sincronizar(datos);
      if (entraron) {
        refrescarTodo();

        /* El historial guarda fotos COMPLETAS del estado. Las fotos
           anteriores a esta sincronizacion no contienen el trabajo
           que acaba de llegar, asi que restaurar una de ellas haria
           que el guardado lo interpretara como borrado y lo
           eliminara de la base PARA LOS TRES.

           Por eso al traer trabajo ajeno el historial se cierra y
           vuelve a arrancar aqui: se puede deshacer lo que hagas de
           ahora en adelante, pero no se puede retroceder a un punto
           donde el trabajo de tu companera todavia no existia. */
        historial.pila = [];
        historial.indice = -1;
        registrar('Llegó trabajo del equipo');

        avisar(`Entraron ${entraron} cambio${entraron === 1 ? '' : 's'} de tu equipo.`);
      }
    } catch (e) {
      if (e instanceof SinSesion) { detenerSincronizacion(); await salirDeVerdad(); }
    }
  }, 20_000);
}

function detenerSincronizacion() {
  clearInterval(latido);
  latido = null;
}


(async function iniciar() {
  iniciarTema();
  llenarSelectores();
  conectarEventos();

  if (!Almacen.enLaNube) {
    // Modo local: sin puerta, como siempre.
    await cargar();
    registrar('Estado al abrir LA PIZARRA');
    refrescarTodo();
    return;
  }

  // Se destapa ANTES de preguntar por la sesión guardada. Si no,
  // se alcanza a ver la aplicación vacía por un instante.
  $('#puerta').hidden = false;
  $('#puertaPie').textContent = 'Comprobando tu sesión…';

  conectarPuerta();
  try {
    const usuario = await Almacen.recuperarSesion();
    if (usuario) await pasarAdentro(usuario);
    else mostrarPuerta('entrar');
  } catch (e) {
    // Si algo revienta arrancando, la puerta tiene que quedar
    // usable de todos modos: sin esto se queda en "Comprobando…"
    // para siempre y no hay ni como escribir el correo.
    console.error('Arranque:', e);
    mostrarPuerta('entrar');
    errorPuerta('Hubo un problema al arrancar. Intenta entrar.');
  }
})();
