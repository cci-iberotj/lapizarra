-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Rol Creación y bandeja de entregas
--  IBERO Tijuana
--
--      python supabase/correr.py creacion.sql
--
--  POR QUÉ
--  Las creadoras que hacen los reels no son del área: entregan
--  material y ya. Necesitan subir lo suyo y ver cuándo sale, y
--  nada más. Antes no había forma de darles acceso sin darles
--  también las ideas, los expertos, el inventario y la facultad
--  de mover la parrilla.
--
--  El rol se llama 'creacion' y no 'agencia' porque los demás son
--  funciones —dirección, redacción, publicación, producción— y
--  porque 'agencia' las etiqueta como de fuera cada vez que entran.
--
--  ESCONDER LA PESTAÑA NO CIERRA NADA
--  Lo que de verdad limita es puede_leer(): sin esto los datos
--  salen por la API con sólo pedirlos, aunque la página no los
--  enseñe. Por eso Creación se restringe aquí y no en el navegador.
-- ═══════════════════════════════════════════════════════════


-- ── 1. El rol existe ───────────────────────────────────────
alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles add constraint perfiles_rol_check
  check (rol in ('admin', 'direccion', 'redaccion', 'publicacion',
                 'produccion', 'creacion'));


-- ── 2. Qué puede ESCRIBIR ──────────────────────────────────
--  Sólo su bandeja. No toca la parrilla: quién publica y cuándo
--  es decisión del área, y ése es justo el punto del arreglo.
create or replace function public.puede_escribir(col text)
returns boolean
language sql stable security definer set search_path = public
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
    when 'creacion'    then col = 'entregas'
    else false
  end
$$;


-- ── 3. Qué puede LEER ──────────────────────────────────────
create or replace function public.puede_leer(col text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case public.mi_rol()
    when 'admin' then true
    -- El calendario, para saber cuándo sale lo suyo, y su bandeja.
    -- Nada de ideas sin cocinar, expertos ni notas en borrador.
    when 'creacion' then col in ('parrilla_piezas', 'parrilla_eventos',
                                 'entregas')
    else col not like 'inventario_%'
  end
$$;


-- ── 4. Subir archivos ──────────────────────────────────────
--  Las politicas colgaban de puede_escribir('parrilla_piezas'), asi
--  que Creacion no podia subir nada. Se agrega su caso, acotado al
--  prefijo entregas/ para que no pueda tocar el material del area.
drop policy if exists "subir archivos"   on storage.objects;
drop policy if exists "cambiar archivos" on storage.objects;
drop policy if exists "quitar archivos"  on storage.objects;

create policy "subir archivos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'piezas' and (
      public.puede_escribir('parrilla_piezas')
      or (public.puede_escribir('entregas') and name like 'entregas/%')
    )
  );

create policy "cambiar archivos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'piezas' and (
      public.puede_escribir('parrilla_piezas')
      or (public.puede_escribir('entregas') and name like 'entregas/%')
    )
  )
  with check (
    bucket_id = 'piezas' and (
      public.puede_escribir('parrilla_piezas')
      or (public.puede_escribir('entregas') and name like 'entregas/%')
    )
  );

-- Borrar lo propio antes de que lo acepten: una entrega equivocada
-- tiene que poder retirarse sin pedirle a nadie que la borre.
create policy "quitar archivos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'piezas' and (
      public.puede_escribir('parrilla_piezas')
      or (public.puede_escribir('entregas') and name like 'entregas/%')
    )
  );


-- ── 5. Comprobar ───────────────────────────────────────────
select 'roles permitidos' as que,
       pg_get_constraintdef(oid) as valor
  from pg_constraint where conname = 'perfiles_rol_check';
