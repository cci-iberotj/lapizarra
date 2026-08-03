-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Esquema de la base
--  IBERO Tijuana
--
--  Pegar completo en Supabase → SQL Editor → Run.
--  Se puede volver a correr sin miedo: no borra ni duplica nada.
--
--  LO IMPORTANTE DE ESTE ARCHIVO
--  Los permisos por rol NO viven en el código de la página, viven
--  aquí. Aunque alguien manipule el navegador, la base sigue sin
--  dejar que Sergio toque el inventario. Esa es la diferencia
--  entre una restricción de verdad y una de adorno.
-- ═══════════════════════════════════════════════════════════


-- ── 1. Quién es quién ──────────────────────────────────────

create table if not exists public.perfiles (
  id     uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  rol    text not null default 'produccion'
         check (rol in ('coordinacion', 'redaccion', 'publicacion', 'produccion')),
  creado timestamptz not null default now()
);

comment on table public.perfiles is
  'Rol de cada persona. coordinacion = Leo, redaccion = Marysol, publicacion = Sergio.';


-- ── 2. Todo el contenido ───────────────────────────────────
--  Una sola tabla para piezas, ideas, equipos, temas y expertos.
--  La columna "coleccion" dice de qué se trata cada renglón.
--  Se guarda registro por registro: por eso dos personas pueden
--  trabajar al mismo tiempo sin borrarse el trabajo.

create table if not exists public.registros (
  coleccion   text not null,
  id          text not null,
  datos       jsonb not null,
  actualizado timestamptz not null default now(),
  actor       uuid references auth.users(id),
  borrado     boolean not null default false,
  primary key (coleccion, id)
);

create index if not exists idx_registros_actualizado
  on public.registros (actualizado);

create index if not exists idx_registros_vivos
  on public.registros (coleccion) where borrado = false;


-- ── 3. Quién puede tocar qué ───────────────────────────────

create or replace function public.mi_rol()
returns text
language sql stable security definer set search_path = public
as $$
  select rol from public.perfiles where id = auth.uid()
$$;

create or replace function public.puede_escribir(col text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case public.mi_rol()
    when 'coordinacion' then true
    when 'redaccion'    then col in ('redaccion_temas', 'parrilla_piezas',
                                     'parrilla_ideas', 'expertos_personas')
    when 'publicacion'  then col = 'parrilla_piezas'
    when 'produccion'   then col in ('parrilla_piezas', 'parrilla_ideas')
    else false
  end
$$;


-- ── 4. Encender los candados ───────────────────────────────
--  Sin esto, cualquiera con la llave publica leeria y escribiria
--  todo. Con esto, cada peticion se revisa contra el rol.

alter table public.perfiles  enable row level security;
alter table public.registros enable row level security;

drop policy if exists "ver perfiles"        on public.perfiles;
drop policy if exists "administrar perfiles" on public.perfiles;
drop policy if exists "ver registros"       on public.registros;
drop policy if exists "crear registros"     on public.registros;
drop policy if exists "cambiar registros"   on public.registros;

-- Todos los que entran ven quién es quién
create policy "ver perfiles" on public.perfiles
  for select to authenticated using (true);

-- Sólo coordinación asigna roles
create policy "administrar perfiles" on public.perfiles
  for all to authenticated
  using      (public.mi_rol() = 'coordinacion')
  with check (public.mi_rol() = 'coordinacion');

-- Todos leen el contenido: el calendario es de todos
create policy "ver registros" on public.registros
  for select to authenticated using (true);

-- Escribir depende del rol
create policy "crear registros" on public.registros
  for insert to authenticated
  with check (public.puede_escribir(coleccion));

create policy "cambiar registros" on public.registros
  for update to authenticated
  using      (public.puede_escribir(coleccion))
  with check (public.puede_escribir(coleccion));

-- No hay política de borrado a propósito: nada se borra de verdad.
-- Se marca "borrado" y así los demás se enteran de que desapareció.


-- ── 5. Perfil automático al crear cuenta ───────────────────
--  Entra con el rol de menos permisos. Coordinación lo sube
--  después. Si un alta se cuela, no puede hacer daño.

create or replace function public.nuevo_perfil()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)),
    'produccion'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.nuevo_perfil();


-- ── 6. Avisar en vivo ──────────────────────────────────────
--  Para que el tema que anote Marysol aparezca en tu pantalla
--  sin recargar.

do $$
begin
  alter publication supabase_realtime add table public.registros;
exception
  when duplicate_object then null;
end $$;


-- ═══════════════════════════════════════════════════════════
--  DESPUÉS DE CORRER ESTO
--
--  1. Authentication → Providers → Email: apagar "Allow new users
--     to sign up". Sin eso, cualquiera con la llave publica puede
--     crearse cuenta.
--
--  2. Authentication → Users → INVITE USER (no "Add user"):
--     escribir el correo de cada quien. Les llega una liga y ELLOS
--     ponen su contraseña. Nadie mas la conoce, ni Leo.
--
--     Ojo: el correo que Supabase manda gratis es limitado. Para
--     dos invitaciones alcanza; si alguien pierde su contrasena
--     mas adelante y el correo de recuperacion no llega, se puede
--     reenviar desde este mismo panel.
--
--  3. Cuando cada quien haya aceptado su invitacion y puesto su
--     contrasena, volver aquí y correr con los correos reales:
--
--       update public.perfiles set rol = 'coordinacion', nombre = 'Leo'
--        where id = (select id from auth.users where email = 'CORREO_DE_LEO');
--
--       update public.perfiles set rol = 'redaccion', nombre = 'Marysol'
--        where id = (select id from auth.users where email = 'CORREO_DE_MARYSOL');
--
--       update public.perfiles set rol = 'publicacion', nombre = 'Sergio'
--        where id = (select id from auth.users where email = 'CORREO_DE_SERGIO');
--
--  4. Comprobar que quedó bien:
--
--       select p.nombre, p.rol, u.email
--         from public.perfiles p join auth.users u on u.id = p.id;
-- ═══════════════════════════════════════════════════════════
