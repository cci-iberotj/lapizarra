// ═══════════════════════════════════════════════════════════
//  LA PIZARRA · publicar
//  Habla con Meta para publicar en las redes de IBERO Tijuana.
//
//  POR QUÉ ESTO CORRE EN EL SERVIDOR Y NO EN EL NAVEGADOR
//  El token de Meta puede publicar ante 42 mil personas. La página
//  de La Pizarra es estática y pública: cualquiera puede leer su
//  código. Un token ahí sería una llave tirada en la banqueta.
//  Aquí vive como variable de entorno y nunca sale hacia el cliente.
//
//  LA REGLA QUE NO SE ROMPE
//  Cada petición se comprueba DE NUEVO contra la base: quién llama,
//  qué rol tiene, y si la pieza está aprobada. No se confía en nada
//  que venga del navegador — publicar no se deshace.
// ═══════════════════════════════════════════════════════════

const URL_BASE = Deno.env.get('SUPABASE_URL')!;
const LLAVE_ADMIN = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TOKEN_IG = Deno.env.get('META_TOKEN_IG') || '';
const TOKEN_FB = Deno.env.get('META_TOKEN_FB') || '';

const IG = 'https://graph.instagram.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  // 'apikey' TIENE que ir: el cliente la manda siempre y sin ella el
  // navegador tumba la petición en el preflight con un 'Failed to
  // fetch' que no explica nada.
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function responder(cuerpo: unknown, estado = 200) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

/* Quién llama, comprobado contra la base y no contra lo que dice. */
async function quienLlama(peticion: Request) {
  const token = (peticion.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Sin sesión.');

  const u = await fetch(URL_BASE + '/auth/v1/user', {
    headers: { apikey: LLAVE_ADMIN, Authorization: 'Bearer ' + token },
  });
  if (!u.ok) throw new Error('Sesión no válida.');
  const usuario = await u.json();

  const p = await fetch(
    `${URL_BASE}/rest/v1/perfiles?id=eq.${usuario.id}&select=nombre,rol`, {
      headers: { apikey: LLAVE_ADMIN, Authorization: 'Bearer ' + LLAVE_ADMIN },
    });
  const perfiles = await p.json();
  if (!perfiles?.length) throw new Error('Sin perfil en el sistema.');

  return { id: usuario.id, nombre: perfiles[0].nombre, rol: perfiles[0].rol };
}

/* Los errores de Meta vienen anidados y en inglés. Se desenredan
   aquí para que en la pantalla salga algo que se pueda leer. */
async function aMeta(url: string) {
  const r = await fetch(url);
  const texto = await r.text();
  let d: any = null;
  try { d = texto ? JSON.parse(texto) : null; } catch { d = texto; }
  if (!r.ok || d?.error) {
    const e = d?.error || {};
    throw new Error(
      [e.error_user_title, e.error_user_msg || e.message]
        .filter(Boolean).join(': ') || `Meta respondió ${r.status}`);
  }
  return d;
}

/* ── Comprobar que el token sirve ──────────────────────────
   Antes de colgarle un botón a esto, hay que saber que la llave
   abre. Devuelve a qué cuenta apunta y cuánto le queda de cuota,
   sin enseñar el token jamás. */
async function comprobar() {
  const salida: any = { instagram: null, facebook: null };

  if (!TOKEN_IG) {
    salida.instagram = { ok: false, porque: 'No hay META_TOKEN_IG en el servidor.' };
  } else {
    try {
      const yo = await aMeta(
        `${IG}/me?fields=user_id,username,account_type,name&access_token=${TOKEN_IG}`);
      const idIG = yo.user_id || yo.id;
      let cuota = null;
      try {
        const c = await aMeta(
          `${IG}/${idIG}/content_publishing_limit?access_token=${TOKEN_IG}`);
        cuota = c?.data?.[0]?.quota_usage ?? null;
      } catch { /* la cuota es un extra: que no tumbe la comprobación */ }
      salida.instagram = {
        ok: true, id: idIG, usuario: yo.username,
        tipo: yo.account_type, nombre: yo.name, publicadasHoy: cuota,
      };
    } catch (e) {
      salida.instagram = { ok: false, porque: (e as Error).message };
    }
  }

  salida.facebook = TOKEN_FB
    ? { ok: false, porque: 'Todavía no conectado (falta la segunda app).' }
    : { ok: false, porque: 'No hay META_TOKEN_FB en el servidor.' };

  return salida;
}

Deno.serve(async (peticion) => {
  if (peticion.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const quien = await quienLlama(peticion);
    const { accion } = await peticion.json().catch(() => ({ accion: '' }));

    if (accion === 'comprobar') {
      // Comprobar no publica nada, pero enseña a qué cuentas está
      // atada la herramienta. Eso no es para cualquiera.
      if (quien.rol !== 'admin' && quien.rol !== 'direccion') {
        return responder({ error: 'Tu rol no puede revisar la conexión.' }, 403);
      }
      return responder(await comprobar());
    }

    return responder({ error: 'Acción desconocida: ' + accion }, 400);
  } catch (e) {
    return responder({ error: (e as Error).message }, 400);
  }
});
