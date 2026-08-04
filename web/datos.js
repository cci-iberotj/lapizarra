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
  parrilla:   { piezas: 'parrilla_piezas', ideas: 'parrilla_ideas',
                eventos: 'parrilla_eventos' },
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
   MOTOR SUPABASE — la nube, para que los tres entren desde
   donde sea sin depender de que tu computadora esté prendida.

   Habla con Supabase por HTTP pelón, sin librería. Se puede
   porque su API es REST normal, y así LA PIZARRA sigue sin
   depender de npm ni de ningún CDN que se pueda caer.

   LO IMPORTANTE
   La llave que va aquí es la publicable, y está bien que
   cualquiera la vea: por sí sola no abre nada. Lo que decide
   qué puede tocar cada quien vive en la base (esquema.sql), no
   en este archivo. Si alguien edita esto desde su navegador,
   la base lo sigue frenando igual.
   ═══════════════════════════════════════════════════════════ */

/* Espejo de puede_escribir() del esquema, SÓLO para atenuar
   botones que de todos modos no van a funcionar. No es una
   restricción: la de verdad la aplica Postgres. Si algún día
   se desincroniza, el peor caso es un botón encendido que
   devuelve error — nunca un permiso de más. */
const PERMISOS_UI = {
  admin:       ['*'],
  direccion:   ['parrilla_piezas', 'parrilla_ideas', 'parrilla_eventos',
                'redaccion_temas', 'expertos_personas', 'ajustes_equipo'],
  redaccion:   ['redaccion_temas', 'parrilla_piezas', 'parrilla_ideas',
                'parrilla_eventos', 'expertos_personas'],
  publicacion: ['parrilla_piezas', 'parrilla_eventos'],
  produccion:  ['parrilla_piezas', 'parrilla_ideas', 'parrilla_eventos'],
};

const LLAVE_SESION = 'la-pizarra-sesion';

const MotorSupabase = {
  nombre: 'Supabase',
  _sesion: null,

  get _base()  { return CONFIG.supabase.url; },
  get _llave() { return CONFIG.supabase.llave; },

  /* ── Sesión guardada en el navegador ─────────────────── */

  _recordar(s) {
    this._sesion = s;
    if (s) localStorage.setItem(LLAVE_SESION, JSON.stringify(s));
    else   localStorage.removeItem(LLAVE_SESION);
  },

  _leerGuardada() {
    if (this._sesion) return this._sesion;
    try {
      const s = JSON.parse(localStorage.getItem(LLAVE_SESION) || 'null');
      this._sesion = s;
      return s;
    } catch (e) { return null; }
  },

  /* ── Peticiones ──────────────────────────────────────── */

  async _auth(ruta, cuerpo, metodo = 'POST', token = null) {
    const r = await fetch(this._base + '/auth/v1' + ruta, {
      method: metodo,
      headers: Object.assign(
        { apikey: this._llave, 'Content-Type': 'application/json' },
        token ? { Authorization: 'Bearer ' + token } : {}),
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error(d.error_description || d.msg || d.message || `Error ${r.status}`);
      e.codigo = r.status;
      throw e;
    }
    return d;
  },

  /* El token de acceso dura una hora. Cuando se vence se cambia
     por uno nuevo con el de refresco, sin molestar a nadie. Sólo
     si eso también falla se pide entrar otra vez. */
  async _token() {
    const s = this._leerGuardada();
    if (!s) throw new SinSesion();
    if (Date.now() < (s.expira - 60_000)) return s.acceso;

    try {
      const d = await this._auth('/token?grant_type=refresh_token',
                                 { refresh_token: s.refresco });
      this._recordar({
        acceso:   d.access_token,
        refresco: d.refresh_token,
        expira:   Date.now() + (d.expires_in || 3600) * 1000,
        usuario:  s.usuario,
      });
      return d.access_token;
    } catch (e) {
      this._recordar(null);
      throw new SinSesion();
    }
  },

  async _rest(ruta, opciones = {}) {
    const token = await this._token();
    const r = await fetch(this._base + '/rest/v1' + ruta, {
      method: opciones.method || 'GET',
      headers: Object.assign({
        apikey: this._llave,
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      }, opciones.headers || {}),
      body: opciones.body ? JSON.stringify(opciones.body) : undefined,
    });

    if (r.status === 401) { this._recordar(null); throw new SinSesion(); }
    // La base no dice "no puedes": simplemente no deja pasar el
    // renglón. PostgREST lo reporta como 403 o como 0 afectados.
    if (r.status === 403) throw new SinPermiso();

    if (r.status === 204) return null;
    const d = await r.json().catch(() => null);
    if (!r.ok) {
      if (d && /row-level security/i.test(d.message || '')) throw new SinPermiso();
      throw new Error((d && (d.message || d.hint)) || `Error ${r.status}`);
    }
    return d;
  },

  /* ── Entrar y salir ──────────────────────────────────── */

  async entrar(correo, clave) {
    let d;
    try {
      d = await this._auth('/token?grant_type=password',
                           { email: correo.trim(), password: clave });
    } catch (e) {
      if (e.codigo === 400) throw new Error('Correo o contraseña incorrectos.');
      throw e;
    }

    this._recordar({
      acceso:   d.access_token,
      refresco: d.refresh_token,
      expira:   Date.now() + (d.expires_in || 3600) * 1000,
      usuario:  null,
    });

    const usuario = await this._perfil(d.user.id, d.user.email);
    this._recordar(Object.assign({}, this._sesion, { usuario }));
    return { usuario };
  },

  async _perfil(id, correo) {
    const filas = await this._rest(
      `/perfiles?id=eq.${id}&select=nombre,rol,debe_cambiar_clave`);
    const p = (filas || [])[0] || {};
    const rol = p.rol || 'produccion';
    return {
      id,
      correo,
      nombre: p.nombre || (correo || '').split('@')[0],
      rol,
      escribe: PERMISOS_UI[rol] || [],
      debe_cambiar_clave: !!p.debe_cambiar_clave,
    };
  },

  async salir() {
    try {
      const s = this._leerGuardada();
      if (s) await this._auth('/logout', {}, 'POST', s.acceso);
    } catch (e) {
      /* Si el servidor no contesta igual cerramos de este lado:
         quedarse dentro por un error de red sería lo peor. */
    }
    this._recordar(null);
  },

  async sesion() {
    const s = this._leerGuardada();
    if (!s || !s.usuario) return { usuario: null };
    try {
      await this._token();                       // valida o renueva
      const usuario = await this._perfil(s.usuario.id, s.usuario.correo);
      this._recordar(Object.assign({}, this._sesion, { usuario }));
      return { usuario };
    } catch (e) {
      return { usuario: null };
    }
  },

  /* Cambiar la contraseña y apagar la marca de temporal. Van
     juntas a propósito: si la marca no se apaga, la persona
     vuelve a la misma pantalla en el siguiente arranque. */
  async cambiarClave(nueva) {
    const token = await this._token();
    await this._auth('/user', { password: nueva }, 'PUT', token);

    const s = this._leerGuardada();
    await this._rest(`/perfiles?id=eq.${s.usuario.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: { debe_cambiar_clave: false },
    });

    s.usuario.debe_cambiar_clave = false;
    this._recordar(s);
  },

  /* ── Contenido ───────────────────────────────────────── */

  async cargarTodo() {
    const filas = await this._rest(
      '/registros?borrado=eq.false&select=coleccion,id,datos,actualizado');
    const registros = {};
    let momento = null;

    for (const f of (filas || [])) {
      (registros[f.coleccion] = registros[f.coleccion] || []).push(f.datos);
      if (!momento || f.actualizado > momento) momento = f.actualizado;
    }
    // Se usa la marca más nueva que trajo la base, no la hora de
    // esta computadora: así un reloj desfasado no se come cambios.
    return { registros, momento: momento || '1970-01-01T00:00:00Z' };
  },

  async cambiosDesde(momento) {
    const filas = await this._rest(
      `/registros?actualizado=gt.${encodeURIComponent(momento)}` +
      '&select=coleccion,id,datos,actualizado,borrado');

    const cambiados = {}, borrados = [];
    let ultimo = momento;

    for (const f of (filas || [])) {
      if (f.borrado) borrados.push({ coleccion: f.coleccion, id: f.id });
      else (cambiados[f.coleccion] = cambiados[f.coleccion] || []).push(f.datos);
      if (f.actualizado > ultimo) ultimo = f.actualizado;
    }
    return { cambiados, borrados, momento: ultimo };
  },

  guardarRegistro(coleccion, registro) {
    const s = this._leerGuardada();
    return this._rest('/registros', {
      method: 'POST',
      // merge-duplicates = si ya existe ese (coleccion, id), lo pisa.
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: {
        coleccion,
        id: String(registro.id),
        datos: registro,
        actor: s && s.usuario ? s.usuario.id : null,
        actualizado: new Date().toISOString(),
        borrado: false,
      },
    });
  },

  /* Nada se borra de verdad: se marca. Así los demás se enteran
     de que desapareció en vez de que reaparezca al sincronizar. */
  borrarRegistro(coleccion, id) {
    return this._rest(
      `/registros?coleccion=eq.${encodeURIComponent(coleccion)}` +
      `&id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: { borrado: true, actualizado: new Date().toISOString() },
    });
  },
};


/* ═══════════════════════════════════════════════════════════
   ALMACÉN
   ═══════════════════════════════════════════════════════════ */

const Almacen = {
  /* Qué motor se usa lo decide config.js con una sola línea. */
  motor: (typeof CONFIG !== 'undefined' && CONFIG.motor === 'supabase')
         ? MotorSupabase : MotorLocal,
  usuario: null,
  ultimaSync: null,

  get enLaNube() { return this.motor === MotorSupabase; },

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

  async cambiarClave(nueva) {
    if (!this.motor.cambiarClave) throw new Error('Este modo no cambia contraseñas.');
    await this.motor.cambiarClave(nueva);
    if (this.usuario) this.usuario.debe_cambiar_clave = false;
  },

  /* Para atenuar botones nada más. El permiso de verdad lo aplica
     la base; esto sólo evita que alguien pique algo que va a
     rebotar. Ver PERMISOS_UI. */
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

  /* OJO con el segundo parametro. Sin el, esta funcion rehacia la
     copia de TODAS las colecciones despues de guardar UNA sola. Y
     como Ctrl+Z dispara cuatro guardados a la vez, el primero que
     terminaba borraba el diff pendiente de los otros tres.

     El sintoma era distinto segun la latencia: con red instantanea
     los cambios se perdian en silencio; con red normal viajaban
     borrados que no debian. Que un cambio persistiera dependia del
     tiempo de red, que es lo peor que puede pasarle a un guardado.

     Sin argumento se rehace todo, que es lo correcto al cargar. */
  _tomarCopia(estado, soloEsta) {
    if (!soloEsta) this._copia = {};

    for (const [coleccion, listas] of Object.entries(MAPA_COLECCIONES)) {
      if (soloEsta && coleccion !== soloEsta) continue;
      for (const [clave, nombreReal] of Object.entries(listas)) {
        const lista = (estado[coleccion] || {})[clave] || [];
        this._copia[nombreReal] = new Map(
          lista.map(r => [r.id, JSON.stringify(r)]));
      }
    }
    for (const [coleccion, ajustes] of Object.entries(AJUSTES)) {
      if (soloEsta && coleccion !== soloEsta) continue;
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
    this._tomarCopia(estado, coleccion);   // SOLO esta, ver arriba
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
