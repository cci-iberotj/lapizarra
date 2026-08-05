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

/* ── Publicar de verdad ────────────────────────────────────

   TODO lo que decide si esto puede salir se lee de la BASE, no de
   lo que mande el navegador. El botón se puede esconder, pero la
   petición se puede fabricar a mano. Y publicar no se deshace:
   borrar un post no borra a quien ya lo vio. */

/* La misma huella que calcula el navegador, letra por letra. Si las
   dos no coinciden, una aprobación válida se vería como caducada —
   o peor, una caducada como válida. */
function selloDeRevision(p: any) {
  const archivos = Array.isArray(p.archivos) ? p.archivos
                 : p.archivo ? [{ ruta: p.archivo }] : [];
  return JSON.stringify([
    archivos.map((a: any) => a.ruta),
    p.copy || '', p.titulo || '', p.fecha || '', (p.canales || []).join(','),
  ]);
}

function archivosDe(p: any) {
  if (Array.isArray(p.archivos)) return p.archivos;
  if (p.archivo) return [{ ruta: p.archivo }];
  return [];
}

async function leerPieza(id: string) {
  const r = await fetch(
    `${URL_BASE}/rest/v1/registros?coleccion=eq.parrilla_piezas&id=eq.${encodeURIComponent(id)}&select=datos,borrado`,
    { headers: { apikey: LLAVE_ADMIN, Authorization: 'Bearer ' + LLAVE_ADMIN } });
  const filas = await r.json();
  if (!filas?.length || filas[0].borrado) throw new Error('Esa pieza ya no existe.');
  return filas[0].datos;
}

/* Meta descarga las imágenes por URL: no se le suben. La cubeta es
   privada, así que se firma un enlace temporal. Diez minutos es de
   sobra para que las baje, y poco para que sirva de algo si se
   filtrara. */
async function enlaceFirmado(ruta: string) {
  const limpia = ruta.split('/').map(encodeURIComponent).join('/');
  const r = await fetch(`${URL_BASE}/storage/v1/object/sign/piezas/${limpia}`, {
    method: 'POST',
    headers: { apikey: LLAVE_ADMIN, Authorization: 'Bearer ' + LLAVE_ADMIN,
               'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn: 600 }),
  });
  const d = await r.json().catch(() => null);
  if (!d?.signedURL) throw new Error('No pude firmar el enlace de ' + ruta.split('/').pop());
  return URL_BASE + '/storage/v1' + d.signedURL;
}

/* Instagram solo acepta JPEG. Se manda la versión de 1600 px y no el
   original: Instagram reescala a 1080 de todos modos, y un original
   de cámara puede pasarse del límite de peso y tumbar la publicación
   entera. Si el puntero de la versión de pantalla no corresponde a
   su ruta, se usa el original — más vale pesado que la foto
   equivocada. */
function paraPublicar(a: any) {
  const ruta = a.ruta || '';
  const barra = ruta.lastIndexOf('/');
  const base = ruta.slice(barra + 1).replace(/\.[^.]+$/, '');
  const debeSer = ruta.slice(0, barra + 1) + 'previa-' + base + '.jpg';
  return a.previa === debeSer ? a.previa : ruta;
}

async function aMetaPost(url: string, campos: Record<string, string>) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(campos),
  });
  const texto = await r.text();
  let d: any = null;
  try { d = texto ? JSON.parse(texto) : null; } catch { d = texto; }
  if (!r.ok || d?.error) {
    const e = d?.error || {};
    throw new Error([e.error_user_title, e.error_user_msg || e.message]
      .filter(Boolean).join(': ') || `Meta respondió ${r.status}`);
  }
  return d;
}

/* Un contenedor recién creado puede tardar en estar listo. Para
   fotos suele ser inmediato, pero si no se espera, publicar falla
   con un error que no dice por qué. */
async function esperarContenedor(id: string) {
  for (let i = 0; i < 8; i++) {
    const d = await aMeta(`${IG}/${id}?fields=status_code&access_token=${TOKEN_IG}`);
    if (d.status_code === 'FINISHED') return;
    if (d.status_code === 'ERROR' || d.status_code === 'EXPIRED') {
      throw new Error('Instagram rechazó la imagen (' + d.status_code + ').');
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('Instagram tardó demasiado en preparar la imagen.');
}

async function publicarEnInstagram(pieza: any) {
  if (!TOKEN_IG) throw new Error('No hay llave de Instagram en el servidor.');

  const archivos = archivosDe(pieza);
  if (!archivos.length) throw new Error('La pieza no tiene arte que publicar.');
  if (archivos.length > 10) {
    throw new Error(`Instagram admite 10 láminas y esta tiene ${archivos.length}.`);
  }

  const yo = await aMeta(`${IG}/me?fields=user_id&access_token=${TOKEN_IG}`);
  const idIG = yo.user_id || yo.id;
  const copy = pieza.copy || '';
  let contenedor: string;

  if (archivos.length === 1) {
    const d = await aMetaPost(`${IG}/${idIG}/media`, {
      image_url: await enlaceFirmado(paraPublicar(archivos[0])),
      caption: copy,
      access_token: TOKEN_IG,
    });
    contenedor = d.id;
    await esperarContenedor(contenedor);
  } else {
    // Cada lámina primero, y después el carrusel que las junta.
    const hijos: string[] = [];
    for (const a of archivos) {
      const d = await aMetaPost(`${IG}/${idIG}/media`, {
        image_url: await enlaceFirmado(paraPublicar(a)),
        is_carousel_item: 'true',
        access_token: TOKEN_IG,
      });
      await esperarContenedor(d.id);
      hijos.push(d.id);
    }
    const d = await aMetaPost(`${IG}/${idIG}/media`, {
      media_type: 'CAROUSEL',
      children: hijos.join(','),
      caption: copy,
      access_token: TOKEN_IG,
    });
    contenedor = d.id;
    await esperarContenedor(contenedor);
  }

  const salida = await aMetaPost(`${IG}/${idIG}/media_publish`, {
    creation_id: contenedor,
    access_token: TOKEN_IG,
  });

  let enlace = null;
  try {
    const m = await aMeta(`${IG}/${salida.id}?fields=permalink&access_token=${TOKEN_IG}`);
    enlace = m.permalink || null;
  } catch { /* el permalink es un extra: ya se publicó */ }

  return { id: salida.id, enlace, laminas: archivos.length };
}

/* Se guarda con la llave de dueño: quien publica no necesariamente
   tiene permiso de escribir esa colección, y el registro de que ya
   salió no puede depender de eso. */
async function marcarPublicada(id: string, pieza: any, resultado: any, quien: string) {
  const cuando = new Date().toISOString();
  pieza.estado = 'publicado';
  pieza.publicado = cuando;
  pieza.actualizado = cuando;
  pieza.publicaciones = {
    ...(pieza.publicaciones || {}),
    ig: { id: resultado.id, enlace: resultado.enlace, cuando, por: quien },
  };

  await fetch(
    `${URL_BASE}/rest/v1/registros?coleccion=eq.parrilla_piezas&id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { apikey: LLAVE_ADMIN, Authorization: 'Bearer ' + LLAVE_ADMIN,
                 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ datos: pieza, actualizado: cuando }),
    });
}


Deno.serve(async (peticion) => {
  if (peticion.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const quien = await quienLlama(peticion);
    const cuerpo = await peticion.json().catch(() => ({}));
    const accion = cuerpo.accion || '';
    const idPieza = cuerpo.pieza || '';

    if (accion === 'comprobar') {
      // Comprobar no publica nada, pero enseña a qué cuentas está
      // atada la herramienta. Eso no es para cualquiera.
      if (quien.rol !== 'admin' && quien.rol !== 'direccion') {
        return responder({ error: 'Tu rol no puede revisar la conexión.' }, 403);
      }
      return responder(await comprobar());
    }

    if (accion === 'publicar') {
      if (quien.rol !== 'admin' && quien.rol !== 'publicacion') {
        return responder({ error: 'Tu rol no publica en las redes.' }, 403);
      }

      const pieza = await leerPieza(idPieza);

      if (pieza.estado === 'publicado') {
        return responder({ error: 'Esa pieza ya está marcada como publicada.' }, 400);
      }
      const ap = pieza.aprobacion || {};
      if (ap.estado !== 'aprobado') {
        return responder({ error: 'Solo se publica lo aprobado. Falta el visto bueno.' }, 400);
      }
      if (ap.sello && ap.sello !== selloDeRevision(pieza)) {
        return responder({ error: 'La pieza cambió después de aprobarse. Hay que revisarla otra vez.' }, 400);
      }
      if (!(pieza.canales || []).includes('ig')) {
        return responder({ error: 'Esta pieza no tiene Instagram entre sus canales.' }, 400);
      }

      const resultado = await publicarEnInstagram(pieza);
      await marcarPublicada(idPieza, pieza, resultado, quien.nombre);
      return responder({ ok: true, ...resultado });
    }

    return responder({ error: 'Acción desconocida: ' + accion }, 400);
  } catch (e) {
    return responder({ error: (e as Error).message }, 400);
  }
});
