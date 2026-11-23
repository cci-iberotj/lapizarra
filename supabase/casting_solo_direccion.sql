-- ═══════════════════════════════════════════════════════════
--  Convocatoria de imagen: los registros sólo los ven Leo y Marysol
--
--  23-nov-2026, a pedido de Leo. La tabla `casting` trae nombre,
--  correo, teléfono y foto de alumnos. Antes la leía cualquier cuenta
--  de LA PIZARRA salvo «consulta» (rol_consulta.sql); ahora sólo los
--  roles admin y direccion. Las demás cuentas (Silvia, Sergio, Less,
--  Belén, Ángel) ya no reciben nada aunque lo pidan a mano a la API.
--  Se escribe como lista de los que SÍ, no de los que no: una cuenta
--  o un rol nuevo queda fuera hasta que alguien decida lo contrario.
--
--  Lo que no cambia: el formulario público sigue registrando
--  (política «registrarse», anon), y la pantalla esconde la pestaña
--  «Convocatoria» a los mismos roles (VISTAS_POR_ROL en web/app.js).
--  Si algún día otro rol necesita verla, se agrega en los dos lados.
-- ═══════════════════════════════════════════════════════════

alter policy "ver registros"     on public.casting
  using (coalesce(public.mi_rol(), '') in ('admin', 'direccion'));

alter policy "atender registros" on public.casting
  using      (coalesce(public.mi_rol(), '') in ('admin', 'direccion'))
  with check (coalesce(public.mi_rol(), '') in ('admin', 'direccion'));

alter policy "quitar registros"  on public.casting
  using (coalesce(public.mi_rol(), '') in ('admin', 'direccion'));
