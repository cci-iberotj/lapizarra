-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · el rol «eventos»
--
--      python supabase/correr.py rol_eventos.sql
--
--  Se puede volver a correr sin miedo.
--
--  PARA QUÉ
--  La pizarra pasa a manos de alguien de Eventos que va a hacer
--  UNA sola cosa: anotar lo que hay que cubrir. Ninguno de los seis
--  roles que había le queda: el más cercano, `produccion`, también
--  crea y edita piezas de contenido.
--
--  EL LÍMITE NO LO PONE LA PANTALLA
--  Esconder botones no es seguridad. Aquí se define lo que puede
--  tocar en la base: escribe eventos y nada más. Aunque alguien se
--  saltara la interfaz, Postgres le diría que no.
--
--  POR QUÉ TAMBIÉN LEE LAS PIEZAS
--  Para anotar un evento hay que ver el calendario, y el calendario
--  lleva piezas y eventos juntos. Leer no es escribir: puede verlas,
--  no moverlas.
-- ═══════════════════════════════════════════════════════════


-- ── 1. Que el rol exista ───────────────────────────────────
--  Sin esto la restricción rechaza la cuenta al crearla.

alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles add constraint perfiles_rol_check
  check (rol in ('admin', 'direccion', 'redaccion', 'publicacion',
                 'produccion', 'creacion', 'eventos'));


-- ── 2. Qué puede escribir ──────────────────────────────────

create or replace function public.puede_escribir(col text)
returns boolean
language sql
stable security definer
set search_path to 'public'
as $$
  select case public.mi_rol()
    when 'admin'       then true
    -- La jefatura toca todo lo editorial. El inventario no, porque no
    -- administra camaras: puede verlo, pero no tiene por que moverlo.
    -- Los eventos los puede anotar CUALQUIERA. Si Sergio se entera
    -- de una ceremonia, tiene que poder anotarla sin pedir permiso.
    when 'direccion'   then col in ('parrilla_piezas', 'parrilla_ideas',
                                    'parrilla_eventos', 'redaccion_temas',
                                    'expertos_personas', 'ajustes_equipo',
                                    'entregas')
    when 'redaccion'   then col in ('redaccion_temas', 'parrilla_piezas',
                                    'parrilla_ideas', 'parrilla_eventos',
                                    'expertos_personas')
    when 'publicacion' then col in ('parrilla_piezas', 'parrilla_eventos',
                                    'entregas')
    when 'produccion'  then col in ('parrilla_piezas', 'parrilla_ideas',
                                    'parrilla_eventos', 'entregas')
    -- Eventos: anota lo que hay que cubrir y nada mas. Ni piezas de
    -- contenido, ni ideas, ni inventario.
    when 'eventos'     then col = 'parrilla_eventos'
    when 'creacion'    then col = 'entregas'
    else false
  end
$$;


-- ── 3. Qué puede leer ──────────────────────────────────────

create or replace function public.puede_leer(col text)
returns boolean
language sql
stable security definer
set search_path to 'public'
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
    else col not like 'inventario_%'
  end
$$;


-- ── 4. Comprobar ───────────────────────────────────────────
select 'rol permitido en perfiles' as que,
       case when pg_get_constraintdef(oid) like '%eventos%' then 'sí' else 'FALTA' end as estado
  from pg_constraint where conname = 'perfiles_rol_check'
union all
select 'escribe eventos',
       case when pg_get_functiondef(oid) like '%when ''eventos''%' then 'sí' else 'FALTA' end
  from pg_proc where proname = 'puede_escribir'
union all
select 'lee el calendario',
       case when pg_get_functiondef(oid) like '%when ''eventos''%' then 'sí' else 'FALTA' end
  from pg_proc where proname = 'puede_leer';
