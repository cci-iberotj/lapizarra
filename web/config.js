/* ═══════════════════════════════════════════════════════════
   LA PIZARRA · Configuración
   IBERO Tijuana

   Estas dos líneas son públicas a propósito: la llave publicable
   está diseñada para vivir dentro del navegador de cualquiera.
   Lo que protege los datos no es esconderla, son las reglas de
   permiso que corren en la base — un usuario sin sesión no lee
   nada, y Sergio no puede tocar el inventario aunque manipule
   esta página.

   La llave SECRETA (service_role) nunca va aquí ni en ningún
   archivo de este repositorio.
   ═══════════════════════════════════════════════════════════ */

'use strict';

const CONFIG = {
  supabase: {
    url:   'https://wrezcukptrtmnhnlxmao.supabase.co',
    llave: 'sb_publishable_XTkkarWw-P3Ls31g5ZDTOA_ZghkWshN',
  },

  /* ── Alverata, por Adobe Fonts ─────────────────────────
     Alverata es la tipografía institucional de la IBERO a nivel
     mundial. Es de Type Together y la tienes activada por Creative
     Cloud, pero los archivos que Adobe sincroniza están cifrados a
     propósito: copiarlos rompe sus términos. El camino correcto es
     un PROYECTO WEB, que ya viene incluido en tu suscripción.

     Cómo obtener el código:
       1. fonts.adobe.com → busca Alverata → "Add to Web Project"
       2. Crea el proyecto: "La Pizarra"
       3. Marca los pesos: Light 300, Regular 400, Medium 500,
          Semibold 600, Bold 700, Black 900
       4. En Domains agrega:  cci-iberotj.github.io
       5. Te da un enlace tipo  https://use.typekit.net/abc1def.css
          De ahí sólo copia el código:  abc1def

     Pégalo aquí y la tipografía cambia sola. Mientras esté vacío,
     LA PIZARRA usa Iberoamericana, que también es de la casa. */
  tipografia: '',

  /* 'supabase' → la nube, con las tres cuentas. Es el modo bueno.

     'local' → NO ESTÁ CONECTADO. Quedó a medias: el motor local
     pide los datos registro por registro (/api/registros) y
     servidor.py todavía manda la colección completa (/api/todo).
     Cambiarlo a 'local' deja la aplicación sin datos. Si algún
     día hace falta trabajar sin internet, hay que terminar esos
     endpoints en servidor.py primero.

     Ojo: servidor.py SÍ se sigue usando para abrir la página en
     tu máquina. Lo que ya no hace es guardar. */
  motor: 'supabase',
};

/* ── Encender Alverata ─────────────────────────────────────
   Si hay código de proyecto, se pide la hoja a Adobe y se marca el
   documento. El CSS hace el resto: la familia ya lleva Alverata al
   frente, así que en cuanto la hoja llega, el texto cambia solo.

   Va aquí y no en el HTML porque así el código vive en un solo
   lugar y no hay que tocar el marcado para cambiarlo. */
if (CONFIG.tipografia) {
  const hoja = document.createElement('link');
  hoja.rel = 'stylesheet';
  hoja.href = 'https://use.typekit.net/' + CONFIG.tipografia + '.css';
  // Si Adobe no responde, no pasa nada: Iberoamericana queda detrás
  // en la pila y la página nunca se queda sin tipografía.
  hoja.onerror = () => console.warn('No se pudo cargar Alverata; se usa Iberoamericana.');
  document.head.appendChild(hoja);
  document.documentElement.dataset.alverata = '1';
}
