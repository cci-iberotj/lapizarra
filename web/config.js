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

  /* 'local'    → servidor de Python en tu máquina
     'supabase' → la nube, con las tres cuentas */
  motor: 'local',
};
