-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Rol «consulta»
--  IBERO Tijuana
--
--      python supabase/correr.py rol_consulta.sql
--  Se puede volver a correr sin miedo.
--
--  PARA QUÉ ES
--  Gente de otras áreas que necesita VER lo que viene (la parrilla:
--  piezas y eventos) y usar las herramientas, sin tocar nada. El
--  primero: Ángel López, Director de Vinculación (18-nov-2026).
--  Las herramientas no piden sesión; lo que da la cuenta es el
--  calendario.
--
--  QUÉ VE Y QUÉ NO
--    · lee parrilla_piezas y parrilla_eventos. Nada más de
--      `registros`: ni ideas, ni redacción, ni expertos, ni
--      inventario.
--    · no escribe nada: puede_escribir() cae en el `else false`.
--    · y lo importante: varias tablas sueltas se abrieron en su día
--      a «cualquiera con sesión» (using true) porque sólo había
--      cuentas del equipo. Ahí hay datos personales —teléfonos de
--      los atletas, el casting con fotos, las solicitudes, los
--      registros de la conferencia—. A este rol se le cierran.
-- ═══════════════════════════════════════════════════════════


-- ── 1. El rol existe ───────────────────────────────────────
alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles add constraint perfiles_rol_check
  check (rol in ('admin', 'direccion', 'redaccion', 'publicacion',
                 'produccion', 'creacion', 'eventos', 'consulta'));


-- ── 2. Qué lee de `registros` ──────────────────────────────
create or replace function public.puede_leer(col text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case public.mi_rol()
    when 'admin' then true
    -- El calendario, para saber cuándo sale lo suyo, y su bandeja.
    -- Nada de ideas sin cocinar, expertos ni notas en borrador.
    when 'creacion' then col in ('parrilla_piezas', 'parrilla_eventos',
                                 'entregas')
    -- Eventos ve el calendario completo --piezas y eventos-- porque
    -- sin verlo no se puede anotar sin encimar. Nada mas.
    when 'eventos'  then col in ('parrilla_piezas', 'parrilla_eventos')
    -- Consulta: otras áreas que sólo miran lo que viene.
    when 'consulta' then col in ('parrilla_piezas', 'parrilla_eventos')
    else col not like 'inventario_%'
  end
$$;
-- puede_escribir() no se toca: 'consulta' no tiene renglón y cae en
-- `else false`.


-- ── 3. Cerrarle las tablas con datos personales ────────────
--  Mismo permiso que antes para todos los demás; sólo se le quita a
--  'consulta'. coalesce: una cuenta sin perfil seguía entrando
--  (using true) y se respeta igual.
alter policy "ver registros"      on public.casting              using (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "atender registros"  on public.casting              using (coalesce(public.mi_rol(), '') <> 'consulta')
                                                                  with check (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "quitar registros"   on public.casting              using (coalesce(public.mi_rol(), '') <> 'consulta');

alter policy "ver registros"      on public.conferencia_canaco   using (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "atender"            on public.conferencia_canaco   using (coalesce(public.mi_rol(), '') <> 'consulta')
                                                                  with check (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "quitar"             on public.conferencia_canaco   using (coalesce(public.mi_rol(), '') <> 'consulta');

alter policy "ver los apuntados"    on public.grabaciones_intersuj using (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "marcar los apuntados" on public.grabaciones_intersuj using (coalesce(public.mi_rol(), '') <> 'consulta')
                                                                    with check (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "quitar apuntados"     on public.grabaciones_intersuj using (coalesce(public.mi_rol(), '') <> 'consulta');

alter policy "ver solicitudes"    on public.solicitudes          using (coalesce(public.mi_rol(), '') <> 'consulta');
alter policy "ver lo enviado"     on public.avisos_enviados      using (coalesce(public.mi_rol(), '') <> 'consulta');


select pg_get_constraintdef(oid) as roles
  from pg_constraint where conname = 'perfiles_rol_check';
