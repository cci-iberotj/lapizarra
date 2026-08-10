// ═══════════════════════════════════════════════════════════
//  LA PIZARRA · administrar
//  Alta y baja de cuentas desde la propia aplicación.
//
//  POR QUÉ ESTO EXISTE
//  Crear una cuenta requiere la llave service_role, que salta TODOS
//  los permisos. Esa llave no puede vivir en el navegador: la
//  página es pública y cualquiera la leería. Aquí sí puede, porque
//  esto corre en el servidor de Supabase y la llave llega como
//  variable de entorno, nunca viaja al cliente.
//
//  LA REGLA QUE NO SE ROMPE
//  Cada petición se verifica DE NUEVO contra la base: se lee el
//  token de quien llama, se busca su perfil y se exige rol 'admin'.
//  No se confía en nada que venga del cliente — ni en un campo que
//  diga "soy admin", ni en el rol que traiga el token.
// ═══════════════════════════════════════════════════════════

const URL_BASE = Deno.env.get('SUPABASE_URL')!;
const LLAVE_ADMIN = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  // Ojo: 'apikey' TIENE que ir aqui. El cliente de Supabase la manda
  // siempre, y si no esta permitida el navegador tumba la peticion en
  // el preflight con un 'Failed to fetch' que no explica nada.
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function responder(cuerpo: unknown, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

/* Llamada con permisos de dueño. Sólo se usa aquí dentro. */
async function comoAdmin(ruta: string, opciones: RequestInit = {}) {
  const r = await fetch(URL_BASE + ruta, {
    ...opciones,
    headers: {
      apikey: LLAVE_ADMIN,
      Authorization: 'Bearer ' + LLAVE_ADMIN,
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  });
  const texto = await r.text();
  let cuerpo: any = null;
  try { cuerpo = texto ? JSON.parse(texto) : null; } catch { cuerpo = texto; }
  if (!r.ok) throw new Error(cuerpo?.msg || cuerpo?.message || cuerpo?.error_description || texto || 'error ' + r.status);
  return cuerpo;
}

/* Quién llama, comprobado contra la base y no contra lo que dice. */
async function quienLlama(peticion: Request) {
  const cabecera = peticion.headers.get('Authorization') || '';
  const token = cabecera.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sin sesión.');

  // El token se valida en Supabase: si está vencido o alterado, falla aquí.
  const r = await fetch(URL_BASE + '/auth/v1/user', {
    headers: { apikey: LLAVE_ADMIN, Authorization: 'Bearer ' + token },
  });
  if (!r.ok) throw new Error('Tu sesión no es válida. Vuelve a entrar.');
  const usuario = await r.json();

  const perfiles = await comoAdmin(
    `/rest/v1/perfiles?id=eq.${usuario.id}&select=rol,nombre`);
  const perfil = (perfiles || [])[0];
  if (!perfil) throw new Error('Tu cuenta no tiene perfil.');

  return { id: usuario.id, correo: usuario.email, rol: perfil.rol, nombre: perfil.nombre };
}

/* Tiene que ir a la par de perfiles_rol_check en la base y de
   ROLES_SISTEMA en la pagina. Son tres listas del mismo hecho: la
   de aqui es la que decide, las otras dos son espejo. Al agregar
   'creacion' se me paso esta y dar de alta la cuenta rebotaba con
   "Ese rol no existe". */
const ROLES = ['admin', 'direccion', 'redaccion', 'publicacion',
               'produccion', 'creacion'];

Deno.serve(async (peticion) => {
  if (peticion.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const yo = await quienLlama(peticion);
    const { accion, ...datos } = await peticion.json();

    // Ver la lista puede cualquiera que haya entrado: saber quién es
    // quién no es un secreto y hace falta para asignar responsables.
    if (accion === 'listar') {
      const cuentas = await comoAdmin('/auth/v1/admin/users?per_page=200');
      const perfiles = await comoAdmin('/rest/v1/perfiles?select=id,nombre,rol,debe_cambiar_clave');
      const porId = new Map((perfiles || []).map((p: any) => [p.id, p]));
      const lista = (cuentas.users || []).map((u: any) => {
        const p: any = porId.get(u.id) || {};
        return {
          id: u.id,
          correo: u.email,
          nombre: p.nombre || (u.email || '').split('@')[0],
          rol: p.rol || 'produccion',
          debe_cambiar_clave: !!p.debe_cambiar_clave,
          creado: u.created_at,
          ultima_entrada: u.last_sign_in_at,
        };
      }).sort((a: any, b: any) => a.nombre.localeCompare(b.nombre, 'es'));
      return responder({ usuarios: lista, yo });
    }

    // De aquí en adelante hay que administrar.
    if (yo.rol !== 'admin') {
      return responder({ error: 'Sólo quien administra puede hacer esto.' }, 403);
    }

    if (accion === 'crear') {
      const correo = String(datos.correo || '').trim().toLowerCase();
      const nombre = String(datos.nombre || '').trim();
      const rol = String(datos.rol || 'produccion');
      const clave = String(datos.clave || '');

      if (!correo.includes('@')) return responder({ error: 'Ese correo no se ve bien.' }, 400);
      if (!nombre) return responder({ error: 'Falta el nombre.' }, 400);
      if (!ROLES.includes(rol)) return responder({ error: 'Ese rol no existe.' }, 400);
      if (clave.length < 8) return responder({ error: 'La contraseña provisional necesita 8 caracteres.' }, 400);

      // Auto-confirmado: no se manda correo de verificación. La
      // aplicación obliga a cambiar la clave al primer ingreso, así
      // que la provisional deja de servir en cuanto entran.
      const creado = await comoAdmin('/auth/v1/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email: correo, password: clave, email_confirm: true }),
      });

      // El disparador ya creó el perfil con el rol de menos permisos.
      await comoAdmin(`/rest/v1/perfiles?id=eq.${creado.id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ nombre, rol, debe_cambiar_clave: true }),
      });

      return responder({ ok: true, id: creado.id, correo, nombre, rol });
    }

    if (accion === 'rol') {
      if (datos.id === yo.id) {
        return responder({ error: 'No puedes cambiarte el rol a ti mismo. Pídeselo a otra persona con permiso de administrar.' }, 400);
      }
      if (!ROLES.includes(datos.rol)) return responder({ error: 'Ese rol no existe.' }, 400);

      // Nunca dejar el sistema sin nadie que lo administre.
      if (datos.rol !== 'admin') {
        const admins = await comoAdmin('/rest/v1/perfiles?rol=eq.admin&select=id');
        if ((admins || []).length <= 1 && (admins || [])[0]?.id === datos.id) {
          return responder({ error: 'Es la única cuenta que administra. Nombra otra antes de quitarle el permiso.' }, 400);
        }
      }

      await comoAdmin(`/rest/v1/perfiles?id=eq.${datos.id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ rol: datos.rol }),
      });
      return responder({ ok: true });
    }

    if (accion === 'nombre') {
      await comoAdmin(`/rest/v1/perfiles?id=eq.${datos.id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ nombre: String(datos.nombre || '').trim() }),
      });
      return responder({ ok: true });
    }

    // Reponer contraseña: vuelve a marcarse como provisional, así
    // que la persona la cambia al entrar y nadie más la conoce.
    if (accion === 'reponer_clave') {
      const clave = String(datos.clave || '');
      if (clave.length < 8) return responder({ error: 'La contraseña necesita 8 caracteres.' }, 400);
      await comoAdmin(`/auth/v1/admin/users/${datos.id}`, {
        method: 'PUT',
        body: JSON.stringify({ password: clave }),
      });
      await comoAdmin(`/rest/v1/perfiles?id=eq.${datos.id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ debe_cambiar_clave: true }),
      });
      return responder({ ok: true });
    }

    if (accion === 'baja') {
      if (datos.id === yo.id) {
        return responder({ error: 'No puedes darte de baja a ti mismo.' }, 400);
      }
      await comoAdmin(`/auth/v1/admin/users/${datos.id}`, { method: 'DELETE' });
      return responder({ ok: true });
    }

    return responder({ error: 'No sé hacer eso.' }, 400);

  } catch (e) {
    return responder({ error: (e as Error).message || 'Algo salió mal.' }, 400);
  }
});
