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
  rol    text not null default 'produccion',
  creado timestamptz not null default now()
);

-- OJO: el rol dice qué puede TOCAR cada quien en el sistema, no quién
-- manda en el departamento. Son dos cosas distintas y conviene no
-- confundirlas: Marysol es la jefa del área, y Leo es quien administra
-- la herramienta porque es quien la opera todos los días.
--
--   admin       Administra el sistema y opera todo.        (Leo)
--   direccion   Jefatura: todo lo editorial, sin inventario. (Marysol)
--   redaccion   Escribe notas academicas.       (para cuando contraten)
--   publicacion Publica las notas en el sitio.             (Sergio)
--   produccion  Sube piezas e ideas.               (agencia, a futuro)

-- La primera version llamaba 'coordinacion' al permiso total, y eso
-- daba a entender una jerarquia que no existe. Se renombra. Este
-- renglon traduce lo que ya estuviera guardado antes de apretar la
-- regla, para que el archivo se pueda volver a correr sin tronar.
update public.perfiles set rol = 'admin' where rol = 'coordinacion';

alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles add constraint perfiles_rol_check
  check (rol in ('admin', 'direccion', 'redaccion', 'publicacion', 'produccion'));

comment on table public.perfiles is
  'Permiso de cada persona en el sistema. No refleja jerarquia del departamento.';

-- Marca de contraseña temporal. Mientras esté encendida, la aplicación
-- no deja pasar a nadie sin cambiarla primero. Asi Leo puede entregar
-- una clave provisional de viva voz sin quedarse sabiendo la definitiva.
alter table public.perfiles
  add column if not exists debe_cambiar_clave boolean not null default true;


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
    when 'admin'       then true
    -- La jefatura toca todo lo editorial. El inventario no, porque no
    -- administra camaras: puede verlo, pero no tiene por que moverlo.
    -- Los eventos los puede anotar CUALQUIERA. Si Sergio se entera
    -- de una ceremonia, tiene que poder anotarla sin pedir permiso.
    when 'direccion'   then col in ('parrilla_piezas', 'parrilla_ideas',
                                    'parrilla_eventos', 'redaccion_temas',
                                    'expertos_personas', 'ajustes_equipo')
    when 'redaccion'   then col in ('redaccion_temas', 'parrilla_piezas',
                                    'parrilla_ideas', 'parrilla_eventos',
                                    'expertos_personas')
    when 'publicacion' then col in ('parrilla_piezas', 'parrilla_eventos')
    when 'produccion'  then col in ('parrilla_piezas', 'parrilla_ideas',
                                    'parrilla_eventos')
    else false
  end
$$;


-- ── 4. Encender los candados ───────────────────────────────
--  Sin esto, cualquiera con la llave publica leeria y escribiria
--  todo. Con esto, cada peticion se revisa contra el rol.

alter table public.perfiles  enable row level security;
alter table public.registros enable row level security;

drop policy if exists "ver perfiles"         on public.perfiles;
drop policy if exists "administrar perfiles" on public.perfiles;
drop policy if exists "actualizar lo mio"    on public.perfiles;
drop policy if exists "ver registros"       on public.registros;
drop policy if exists "crear registros"     on public.registros;
drop policy if exists "cambiar registros"   on public.registros;

-- Todos los que entran ven quién es quién
create policy "ver perfiles" on public.perfiles
  for select to authenticated using (true);

-- Sólo quien administra el sistema asigna roles
create policy "administrar perfiles" on public.perfiles
  for all to authenticated
  using      (public.mi_rol() = 'admin')
  with check (public.mi_rol() = 'admin');

-- Cada quien puede apagar su marca de contraseña temporal y corregir
-- su nombre. Lo que NO puede es cambiarse el rol: la condicion exige
-- que el rol siga siendo el mismo que ya tenia, asi que nadie se
-- asciende solo aunque manipule la peticion.
create policy "actualizar lo mio" on public.perfiles
  for update to authenticated
  using      (id = auth.uid())
  with check (id = auth.uid() and rol = public.mi_rol());

-- Leer tambien depende del rol. El calendario SIGUE siendo de
-- todos -- piezas, ideas, eventos, temas y expertos se comparten a
-- proposito -- pero el inventario es el control interno del equipo
-- de Leo y no es contexto compartido de nadie mas.
--
-- Esto importa: esconder la pestana en la pagina no cerraba nada.
-- Los datos seguian saliendo por la API con pedirlos.
create or replace function public.puede_leer(col text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select case
    when col like 'inventario_%' then public.mi_rol() = 'admin'
    else true
  end
$$;

create policy "ver registros" on public.registros
  for select to authenticated
  using (public.puede_leer(coleccion));

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
--  Entra con el rol de menos permisos. Quien administra lo sube
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
--  2. Authentication → Users → Add user → Create new user.
--     Marcar AUTO CONFIRM. Contrasena temporal para Marysol y
--     Sergio, la que sea; se las pasas de viva voz.
--
--     No hace falta invitacion por correo: la aplicacion los obliga
--     a cambiar la contrasena la primera vez que entran, y a partir
--     de ahi tu ya no la conoces.
--
--  3. Volver aquí y correr, con los correos reales, para asignar
--     los roles:
--
--       update public.perfiles set rol = 'admin', nombre = 'Leo'
--        where id = (select id from auth.users where email = 'CORREO_DE_LEO');
--
--       update public.perfiles set rol = 'direccion', nombre = 'Marysol'
--        where id = (select id from auth.users where email = 'CORREO_DE_MARYSOL');
--
--       update public.perfiles set rol = 'publicacion', nombre = 'Sergio'
--        where id = (select id from auth.users where email = 'CORREO_DE_SERGIO');
--
--  4. Si tu ya pusiste tu contrasena definitiva y no quieres que
--     te la pida cambiar, exímete a ti nada mas:
--
--       update public.perfiles set debe_cambiar_clave = false
--        where id = (select id from auth.users where email = 'CORREO_DE_LEO');
--
--  5. Comprobar que quedó bien:
--
--       select p.nombre, p.rol, p.debe_cambiar_clave, u.email
--         from public.perfiles p join auth.users u on u.id = p.id;
-- ═══════════════════════════════════════════════════════════
