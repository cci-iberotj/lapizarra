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
const FB = 'https://graph.facebook.com';

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
    /* Meta manda un titulo corto y un detalle, pensados para ir
       juntos. Pero en los errores tecnicos los dos traen casi el
       mismo texto, y pegarlos deja un parrafo que se repite a si
       mismo. Se pega el titulo SOLO si es corto de verdad -- o sea,
       si parece un rotulo y no otra copia del mensaje. */
    const cuerpo = String(e.error_user_msg || e.message || '').trim();
    const titulo = String(e.error_user_title || '').trim();
    const texto = (cuerpo && titulo && titulo.length <= 60 && !cuerpo.startsWith(titulo))
      ? `${titulo}: ${cuerpo}` : (cuerpo || titulo);
    throw new Error(texto || `Meta respondió ${r.status}`);
  }
  return d;
}

/* Cuanto le queda de vida a una llave. Los tokens de Meta caducan
   y el dia que dejen de servir no queremos enterarnos con un post a
   medio publicar. Si Meta no lo dice, se calla en vez de inventar. */
async function caducidad(host: string, token: string) {
  try {
    const d = await aMeta(
      `${host}/debug_token?input_token=${token}&access_token=${token}`);
    const cuando = d?.data?.expires_at;
    if (!cuando) return { caduca: null, dias: null };   // 0 = no caduca
    const dias = Math.round((cuando * 1000 - Date.now()) / 86400000);
    return { caduca: new Date(cuando * 1000).toISOString().slice(0, 10), dias };
  } catch {
    return { caduca: null, dias: null };
  }
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
        ...(await caducidad(IG, TOKEN_IG)),
      };
    } catch (e) {
      salida.instagram = { ok: false, porque: (e as Error).message };
    }
  }

  if (!TOKEN_FB) {
    salida.facebook = { ok: false, porque: 'No hay META_TOKEN_FB en el servidor.' };
  } else {
    try {
      // Nada de 'username': Meta lo descontinuo hace anos y pedirlo
      // tumba la consulta entera con un error que habla de v2.0.
      const pg = await aMeta(`${FB}/me?fields=id,name&access_token=${TOKEN_FB}`);
      salida.facebook = { ok: true, id: pg.id, usuario: pg.name,
                          nombre: pg.name, ...(await caducidad(FB, TOKEN_FB)) };
    } catch (e) {
      salida.facebook = { ok: false, porque: (e as Error).message };
    }
  }

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
  /* El copy de Facebook se cuelga del de Instagram con un separador
     invisible en vez de ser un elemento aparte. Asi una pieza que no
     tenga copy propio de Facebook conserva EXACTAMENTE la huella que
     ya tenia, y las aprobaciones viejas no se caducan de golpe por un
     cambio de formato. */
  return JSON.stringify([
    archivos.map((a: any) => a.ruta),
    (p.copy || '') + (p.copy_fb ? '\u0000' + p.copy_fb : ''),
    p.titulo || '', p.fecha || '', (p.canales || []).join(','),
  ]);
}

/* El copy que le toca a cada red. Facebook hereda el de Instagram
   si no tiene uno propio: obligarte a escribir dos veces lo mismo
   solo lograria que el segundo se quedara viejo. */
function copyDe(p: any, red: 'ig' | 'fb') {
  return (red === 'fb' ? (p.copy_fb || p.copy) : p.copy) || '';
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

/* REVISAR EL ARTE ANTES DE MANDARLO

   Meta rechaza lo que no le sirve con errores que hablan de su API
   y no del problema: "Only photo or video can be accepted as media
   type" no le dice a nadie que subio un PNG. Mas vale negarse aqui
   y decir que pasa y como se arregla.

   Video todavia no: un Reel se sube por otro camino, con su propio
   tipo de contenedor y su propia espera. Negarlo claramente es
   mejor que intentarlo y fallar a medias. */
const VIDEOS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];

function extension(ruta: string) {
  const punto = ruta.lastIndexOf('.');
  return punto < 0 ? '' : ruta.slice(punto).toLowerCase();
}

function esVideo(a: any) { return VIDEOS.includes(extension(a?.ruta || '')); }

/* Una pieza es de video o es de fotos, no las dos. Un carrusel de
   Instagram admite mezclar, pero aqui no hay forma de decir en que
   orden ni cual es la portada, y publicar algo a medias entender no
   es mejor que negarse. */
function revisarArte(pieza: any, red: 'ig' | 'fb') {
  const archivos = archivosDe(pieza);
  const nombre = (a: any) => a.nombre || (a.ruta || '').split('/').pop();
  const videos = archivos.filter(esVideo);

  if (videos.length && videos.length !== archivos.length) {
    throw new Error(
      'Esta pieza mezcla video y fotos. Separa el video en su propia pieza.');
  }
  if (videos.length > 1) {
    throw new Error(`Un solo video por pieza, y esta tiene ${videos.length}.`);
  }

  if (red === 'ig' && !videos.length) {
    // Instagram solo acepta JPEG. No es negociable ni convertible
    // desde aqui: el archivo se sube tal cual desde el navegador.
    const malos = archivos.filter((a: any) => {
      const e = extension(paraPublicar(a));
      return e !== '.jpg' && e !== '.jpeg';
    });
    if (malos.length) {
      throw new Error(
        `Instagram solo acepta JPEG y «${nombre(malos[0])}» no lo es. ` +
        `Vuelve a exportarla como JPG y reemplázala en la pieza.`);
    }
  }
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
   fotos suele ser inmediato; para VIDEO no -- Instagram lo transcodi-
   fica y eso tarda minutos. Meta recomienda preguntar una vez por
   minuto durante cinco. Se pregunta mas seguido pero durante el
   mismo rato: si el video ya quedó, no tiene sentido esperar un
   minuto entero para enterarse. */
async function esperarContenedor(id: string, video = false) {
  const cada = video ? 5000 : 1500;
  const veces = video ? 60 : 8;          // 5 minutos / 12 segundos
  const que = video ? 'el video' : 'la imagen';

  for (let i = 0; i < veces; i++) {
    const d = await aMeta(`${IG}/${id}?fields=status_code,status&access_token=${TOKEN_IG}`);
    if (d.status_code === 'FINISHED') return;
    if (d.status_code === 'ERROR' || d.status_code === 'EXPIRED') {
      // 'status' trae el motivo de verdad; 'status_code' solo dice ERROR.
      throw new Error(`Instagram rechazó ${que}: ${d.status || d.status_code}`);
    }
    await new Promise((r) => setTimeout(r, cada));
  }
  throw new Error(`Instagram tardó demasiado en preparar ${que}.`);
}

async function publicarEnInstagram(pieza: any) {
  if (!TOKEN_IG) throw new Error('No hay llave de Instagram en el servidor.');

  const archivos = archivosDe(pieza);
  if (!archivos.length) throw new Error('La pieza no tiene arte que publicar.');
  if (archivos.length > 10) {
    throw new Error(`Instagram admite 10 láminas y esta tiene ${archivos.length}.`);
  }
  revisarArte(pieza, 'ig');

  const yo = await aMeta(`${IG}/me?fields=user_id&access_token=${TOKEN_IG}`);
  const idIG = yo.user_id || yo.id;
  const copy = copyDe(pieza, 'ig');
  let contenedor: string;
  const video = esVideo(archivos[0]);

  if (video) {
    /* En Instagram todo video es Reel: el formato de video suelto ya
       no existe. share_to_feed lo deja tambien en el perfil, que es
       lo que espera cualquiera que lo suba desde el telefono. */
    const d = await aMetaPost(`${IG}/${idIG}/media`, {
      media_type: 'REELS',
      video_url: await enlaceFirmado(archivos[0].ruta),
      share_to_feed: 'true',
      caption: copy,
      access_token: TOKEN_IG,
    });
    contenedor = d.id;
    await esperarContenedor(contenedor, true);
  } else if (archivos.length === 1) {
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

  return { id: salida.id, enlace, laminas: archivos.length, video };
}

/* Facebook no tiene carrusel como Instagram. Varias fotos se suben
   sin publicar y despues se juntan en un solo post: asi salen como
   una publicacion con galeria y no como cinco posts sueltos. */
async function publicarEnFacebook(pieza: any) {
  if (!TOKEN_FB) throw new Error('No hay llave de Facebook en el servidor.');

  const archivos = archivosDe(pieza);
  revisarArte(pieza, 'fb');
  const pagina = await aMeta(`${FB}/me?fields=id,name&access_token=${TOKEN_FB}`);
  const copy = copyDe(pieza, 'fb');
  let idPost: string;

  if (archivos.length === 1 && esVideo(archivos[0])) {
    /* El video de pagina va por su propio punto de entrada, y el
       texto se llama 'description' y no 'message'. */
    const d = await aMetaPost(`${FB}/${pagina.id}/videos`, {
      file_url: await enlaceFirmado(archivos[0].ruta),
      description: copy,
      access_token: TOKEN_FB });
    idPost = d.post_id || d.id;
  } else if (!archivos.length) {
    const d = await aMetaPost(`${FB}/${pagina.id}/feed`, {
      message: copy, access_token: TOKEN_FB });
    idPost = d.id;
  } else if (archivos.length === 1) {
    const d = await aMetaPost(`${FB}/${pagina.id}/photos`, {
      url: await enlaceFirmado(paraPublicar(archivos[0])),
      caption: copy, published: 'true', access_token: TOKEN_FB });
    idPost = d.post_id || d.id;
  } else {
    const fotos: string[] = [];
    for (const a of archivos) {
      const d = await aMetaPost(`${FB}/${pagina.id}/photos`, {
        url: await enlaceFirmado(paraPublicar(a)),
        published: 'false', temporary: 'true', access_token: TOKEN_FB });
      fotos.push(d.id);
    }
    const campos: Record<string, string> = { message: copy, access_token: TOKEN_FB };
    fotos.forEach((id, i) => {
      campos[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id });
    });
    const d = await aMetaPost(`${FB}/${pagina.id}/feed`, campos);
    idPost = d.id;
  }

  let enlace = null;
  try {
    const m = await aMeta(`${FB}/${idPost}?fields=permalink_url&access_token=${TOKEN_FB}`);
    enlace = m.permalink_url || null;
  } catch { /* el enlace es un extra: ya se publico */ }

  return { id: idPost, enlace, laminas: archivos.length };
}

/* Se guarda con la llave de dueño: quien publica no necesariamente
   tiene permiso de escribir esa colección, y el registro de que ya
   salió no puede depender de eso. */
async function marcarPublicada(id: string, pieza: any, salidas: any, quien: string) {
  const cuando = new Date().toISOString();
  pieza.estado = 'publicado';
  pieza.publicado = cuando;
  pieza.actualizado = cuando;
  pieza.publicaciones = { ...(pieza.publicaciones || {}) };
  for (const [red, r] of Object.entries<any>(salidas)) {
    pieza.publicaciones[red] = { id: r.id, enlace: r.enlace, cuando, por: quien };
  }

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
      /* A donde diga la pieza. Instagram y Facebook se publican por
         separado a proposito: el crossposting de Meta refleja el
         post tal cual, con el mismo recorte y el mismo copy, y lo
         que funciona en una red no funciona igual en la otra. */
      const canales = pieza.canales || [];
      const pedidas = ['ig', 'fb'].filter((c) => canales.includes(c));
      if (!pedidas.length) {
        return responder({ error: 'Esta pieza no tiene Instagram ni Facebook entre sus canales.' }, 400);
      }

      /* Si una red falla, la que ya salio NO se pierde: se registra
         lo que si ocurrio y se dice claramente que falto. Deshacer
         una publicacion no es posible, asi que fingir que no paso
         seria peor que el fallo. */
      const salidas: Record<string, any> = {};
      const fallos: Record<string, string> = {};

      for (const red of pedidas) {
        try {
          salidas[red] = red === 'ig'
            ? await publicarEnInstagram(pieza)
            : await publicarEnFacebook(pieza);
        } catch (e) {
          fallos[red] = (e as Error).message;
        }
      }

      if (!Object.keys(salidas).length) {
        return responder({ error: Object.values(fallos).join(' · ') }, 400);
      }

      await marcarPublicada(idPieza, pieza, salidas, quien.nombre);
      return responder({ ok: true, salidas, fallos });
    }

    return responder({ error: 'Acción desconocida: ' + accion }, 400);
  } catch (e) {
    return responder({ error: (e as Error).message }, 400);
  }
});
