/* ═══════════════════════════════════════════════════════════
   LA PIZARRA · Capa de datos
   IBERO Tijuana

   Todo lo que sale o entra de la aplicación pasa por aquí. El
   resto del código no sabe si atrás hay un archivo, un servidor
   propio o un servicio en la nube: sólo pide guardar.

   POR QUÉ EXISTE
   Antes había 24 lugares distintos llamando a guardar, y cada
   uno mandaba la colección COMPLETA. Con dos personas trabajando,
   la última en guardar borraba el trabajo de la otra.

   Ahora esos 24 lugares siguen llamando igual, pero este módulo
   compara contra la última copia conocida y manda únicamente los
   registros que de verdad cambiaron. Nadie pisa a nadie.
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* Cómo se reparte cada colección en registros sueltos.
   La izquierda es como lo ve la aplicación; la derecha, como se
   guarda. */
const MAPA_COLECCIONES = {
  parrilla:   { piezas: 'parrilla_piezas', ideas: 'parrilla_ideas' },
  inventario: {
    equipos: 'inventario_equipos',
    vuelos: 'inventario_vuelos',
    prestamos_historial: 'inventario_prestamos',
  },
  expertos:   { personas: 'expertos_personas' },
  redaccion:  { temas: 'redaccion_temas' },
};

/* Lo que no es lista sino un objeto suelto: se guarda como un
   registro único con id fijo. */
const AJUSTES = {
  redaccion: { equipo: 'ajustes_equipo' },
};


/* ═══════════════════════════════════════════════════════════
   MOTOR LOCAL — habla con el servidor de Python de tu máquina.
   Para cambiar a otro proveedor se escribe otro motor con estos
   mismos métodos y se cambia una línea en Almacen.motor.
   ═══════════════════════════════════════════════════════════ */

const MotorLocal = {
  nombre: 'servidor local',

  async _pedir(ruta, opciones = {}) {
    const r = await fetch(ruta, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
    if (r.status === 401) throw new SinSesion();
    if (r.status === 403) throw new SinPermiso();
    const cuerpo = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(cuerpo.error || `Error ${r.status}`);
    return cuerpo;
  },

  cargarTodo()                  { return this._pedir('/api/registros'); },
  cambiosDesde(momento)         { return this._pedir('/api/cambios?desde=' + encodeURIComponent(momento)); },

  guardarRegistro(coleccion, registro) {
    return this._pedir(`/api/r/${encodeURIComponent(coleccion)}`, {
      method: 'PUT', body: JSON.stringify(registro),
    });
  },

  borrarRegistro(coleccion, id) {
    return this._pedir(`/api/r/${encodeURIComponent(coleccion)}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  entrar(usuario, clave) {
    return this._pedir('/api/entrar', {
      method: 'POST', body: JSON.stringify({ usuario, clave }),
    });
  },

  salir()   { return this._pedir('/api/salir', { method: 'POST' }); },
  sesion()  { return this._pedir('/api/sesion'); },
};


/* Errores con significado, para que la interfaz sepa qué decir. */
class SinSesion  extends Error { constructor() { super('Tu sesión expiró'); this.nombre = 'SinSesion'; } }
class SinPermiso extends Error { constructor() { super('Tu rol no puede modificar esto'); this.nombre = 'SinPermiso'; } }


/* ═══════════════════════════════════════════════════════════
   ALMACÉN
   ═══════════════════════════════════════════════════════════ */

const Almacen = {
  motor: MotorLocal,
  usuario: null,
  ultimaSync: null,

  /* Copia de lo último que sabemos que está guardado. Es contra
     esto que se compara para saber qué cambió de verdad. */
  _copia: {},

  /* ── Sesión ──────────────────────────────────────────── */

  async entrar(usuario, clave) {
    const r = await this.motor.entrar(usuario, clave);
    this.usuario = r.usuario;
    return r.usuario;
  },

  async salir() {
    await this.motor.salir();
    this.usuario = null;
    this._copia = {};
  },

  async recuperarSesion() {
    try {
      const r = await this.motor.sesion();
      this.usuario = r.usuario || null;
    } catch (e) {
      this.usuario = null;
    }
    return this.usuario;
  },

  puedeEscribir(coleccion) {
    if (!this.usuario) return false;
    const permitidas = this.usuario.escribe || [];
    return permitidas.includes('*') || permitidas.includes(coleccion);
  },

  /* ── Carga ───────────────────────────────────────────── */

  /* Trae todo y lo acomoda en la forma que espera la aplicación. */
  async cargar(destino) {
    const crudo = await this.motor.cargarTodo();
    const registros = crudo.registros || {};
    this.ultimaSync = crudo.momento || new Date().toISOString();

    for (const [coleccion, listas] of Object.entries(MAPA_COLECCIONES)) {
      destino[coleccion] = destino[coleccion] || {};
      for (const [clave, nombreReal] of Object.entries(listas)) {
        destino[coleccion][clave] = registros[nombreReal] || [];
      }
    }
    for (const [coleccion, ajustes] of Object.entries(AJUSTES)) {
      for (const [clave, nombreReal] of Object.entries(ajustes)) {
        const guardado = (registros[nombreReal] || [])[0];
        if (guardado) {
          const { id, ...valores } = guardado;
          destino[coleccion][clave] = valores;
        }
      }
    }

    this._tomarCopia(destino);
    return destino;
  },

  _tomarCopia(estado) {
    this._copia = {};
    for (const [coleccion, listas] of Object.entries(MAPA_COLECCIONES)) {
      for (const [clave, nombreReal] of Object.entries(listas)) {
        const lista = (estado[coleccion] || {})[clave] || [];
        this._copia[nombreReal] = new Map(
          lista.map(r => [r.id, JSON.stringify(r)]));
      }
    }
    for (const [coleccion, ajustes] of Object.entries(AJUSTES)) {
      for (const [clave, nombreReal] of Object.entries(ajustes)) {
        const v = (estado[coleccion] || {})[clave];
        this._copia[nombreReal] = new Map(v ? [[nombreReal, JSON.stringify(v)]] : []);
      }
    }
  },

  /* ── Guardado ────────────────────────────────────────── */

  /* La aplicación sigue diciendo "guarda la parrilla". Aquí se
     traduce a: qué piezas nacieron, cuáles cambiaron, cuáles se
     fueron — y sólo eso viaja. */
  async guardar(coleccion, estado) {
    const listas  = MAPA_COLECCIONES[coleccion] || {};
    const ajustes = AJUSTES[coleccion] || {};
    const tareas = [];
    let tocados = 0;

    for (const [clave, nombreReal] of Object.entries(listas)) {
      const actual = ((estado[coleccion] || {})[clave]) || [];
      const previo = this._copia[nombreReal] || new Map();
      const vistos = new Set();

      for (const registro of actual) {
        if (!registro || !registro.id) continue;
        vistos.add(registro.id);
        const serializado = JSON.stringify(registro);
        if (previo.get(registro.id) === serializado) continue;   // sin cambios
        tareas.push(this.motor.guardarRegistro(nombreReal, registro));
        tocados++;
      }

      for (const id of previo.keys()) {
        if (vistos.has(id)) continue;
        tareas.push(this.motor.borrarRegistro(nombreReal, id));
        tocados++;
      }
    }

    for (const [clave, nombreReal] of Object.entries(ajustes)) {
      const valor = (estado[coleccion] || {})[clave];
      if (!valor) continue;
      const serializado = JSON.stringify(valor);
      if ((this._copia[nombreReal] || new Map()).get(nombreReal) === serializado) continue;
      tareas.push(this.motor.guardarRegistro(nombreReal, { id: nombreReal, ...valor }));
      tocados++;
    }

    if (!tareas.length) return { tocados: 0 };

    await Promise.all(tareas);
    this._tomarCopia(estado);
    return { tocados };
  },

  /* ── Trabajo de los demás ────────────────────────────── */

  /* Trae lo que otros movieron desde la última vez y lo mezcla
     con lo que tienes en pantalla. Devuelve cuántas cosas
     entraron, para poder avisar. */
  async sincronizar(estado) {
    if (!this.ultimaSync) return { entraron: 0 };
    const r = await this.motor.cambiosDesde(this.ultimaSync);
    this.ultimaSync = r.momento;

    const inverso = {};
    for (const [coleccion, listas] of Object.entries(MAPA_COLECCIONES)) {
      for (const [clave, nombreReal] of Object.entries(listas)) {
        inverso[nombreReal] = [coleccion, clave];
      }
    }

    let entraron = 0;

    for (const [nombreReal, registros] of Object.entries(r.cambiados || {})) {
      const destino = inverso[nombreReal];
      if (!destino) continue;
      const [coleccion, clave] = destino;
      const lista = (estado[coleccion][clave] = estado[coleccion][clave] || []);
      for (const registro of registros) {
        const i = lista.findIndex(x => x.id === registro.id);
        if (i >= 0) lista[i] = registro; else lista.push(registro);
        entraron++;
      }
    }

    for (const { coleccion: nombreReal, id } of (r.borrados || [])) {
      const destino = inverso[nombreReal];
      if (!destino) continue;
      const [coleccion, clave] = destino;
      const lista = estado[coleccion][clave] || [];
      const i = lista.findIndex(x => x.id === id);
      if (i >= 0) { lista.splice(i, 1); entraron++; }
    }

    if (entraron) this._tomarCopia(estado);
    return { entraron };
  },
};
