-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Verificar que los permisos de verdad aplican
--  IBERO Tijuana
--
--      python supabase/correr.py verificar.sql
--
--  Que la tabla de perfiles diga "direccion" no prueba nada por
--  si solo. Esto se pone en los zapatos de cada persona y le
--  pregunta a la base, una por una, si la dejaria escribir en
--  cada coleccion. Lo que sale es lo que realmente va a pasar.
--
--  No modifica nada. Se puede correr cuando sea.
-- ═══════════════════════════════════════════════════════════


-- Se mete en la piel de cada usuario y prueba cada coleccion.
-- Es la misma funcion puede_escribir() que usan las politicas,
-- no una copia: si un dia cambia, esta prueba cambia con ella.
create or replace function public._probar_permisos()
returns table(persona text, rol text, coleccion text, puede boolean)
language plpgsql
security definer set search_path = public
as $$
declare
  u       record;
  c       text;
  previo  text;
begin
  previo := coalesce(current_setting('request.jwt.claims', true), '');

  for u in select p.id, p.nombre, p.rol from public.perfiles p
            order by p.nombre loop
    -- auth.uid() sale de aqui: fingir el claim es fingir la sesion
    perform set_config('request.jwt.claims',
                       json_build_object('sub', u.id)::text, true);

    foreach c in array array['parrilla_piezas', 'parrilla_ideas',
                             'parrilla_eventos', 'inventario_equipos',
                             'redaccion_temas', 'expertos_personas'] loop
      persona   := u.nombre;
      rol       := u.rol;
      coleccion := c;
      puede     := public.puede_escribir(c);
      return next;
    end loop;
  end loop;

  perform set_config('request.jwt.claims', previo, true);
end $$;

-- Esta funcion corre con permisos de dueño y sabe fingir sesiones
-- ajenas. Nadie que entre por la aplicacion tiene por que poder
-- llamarla: queda solo para quien administra.
revoke all on function public._probar_permisos() from public, anon, authenticated;


-- Todo junto en una sola tabla, porque solo vuelve el ultimo select.
with candados as (
  select 'CANDADO' as seccion,
         'RLS en ' || c.relname as detalle,
         case when c.relrowsecurity then 'encendido' else 'APAGADO' end as resultado
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname in ('perfiles', 'registros')
),
politicas as (
  select 'CANDADO',
         'politicas en ' || tablename,
         count(*)::text || ' activas'
    from pg_policies
   where schemaname = 'public' and tablename in ('perfiles', 'registros')
   group by tablename
),
antiescalada as (
  select 'CANDADO',
         'nadie se sube el rol solo',
         case when exists (
                select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'perfiles'
                   and policyname = 'actualizar lo mio'
                   and with_check like '%mi_rol()%')
              then 'protegido' else 'SIN PROTEGER' end
),
sin_borrado as (
  select 'CANDADO',
         'nada se borra de verdad',
         case when not exists (
                select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'registros'
                   and cmd = 'DELETE')
              then 'protegido' else 'HAY POLITICA DE BORRADO' end
),
matriz as (
  select 'PERMISO',
         rpad(persona, 8) || ' (' || rol || ')  ->  ' || coleccion,
         case when puede then 'si escribe' else 'no' end
    from public._probar_permisos()
)
select * from candados
union all select * from politicas
union all select * from antiescalada
union all select * from sin_borrado
union all select * from matriz;
