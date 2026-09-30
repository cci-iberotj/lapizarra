-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Necesidades de equipo (tablero para los jefes)
--  IBERO Tijuana
--
--  Correr con:  python supabase/correr.py compras.sql
--  Se puede volver a correr sin miedo: no borra ni duplica nada.
--
--  PARA QUÉ ES
--  Una página aparte (web/equipo/) donde los jefes ven lo que
--  hace falta, eligen entre opciones, arman el presupuesto,
--  aprueban y comentan, sin cuenta en LA PIZARRA.
--
--  CÓMO SE ENTRA
--  Con una liga que lleva un código de ocho caracteres. Nadie
--  lee ni escribe las tablas directo: todo pasa por funciones
--  `security definer` que piden el código exacto. Es el mismo
--  patrón de `abrir_revision` en revisiones.sql.
--
--  POR QUÉ UNA FILA POR NECESIDAD
--  Si dos jefes mueven cosas al mismo tiempo, cada cambio toca
--  sólo las claves que cambió de una sola necesidad (datos || cambios).
--  Guardar el tablero entero haría que uno borrara lo del otro.
-- ═══════════════════════════════════════════════════════════


-- ── 1. Tablas ──────────────────────────────────────────────

create table if not exists public.compras_tableros (
  codigo  text primary key check (codigo ~ '^[A-Z0-9]{8}$'),
  titulo  text not null default '',
  ajustes jsonb not null default '{}'::jsonb,   -- textos de portada, diagnóstico
  creado  timestamptz not null default now(),
  actualizado timestamptz not null default now()
);

create table if not exists public.compras_necesidades (
  tablero     text not null references public.compras_tableros(codigo) on delete cascade,
  id          text not null,
  datos       jsonb not null,
  borrado     boolean not null default false,
  actualizado timestamptz not null default now(),
  autor       text not null default '',
  primary key (tablero, id)
);

create table if not exists public.compras_comentarios (
  id        bigserial primary key,
  tablero   text not null references public.compras_tableros(codigo) on delete cascade,
  necesidad text not null default '',     -- '' = comentario general
  autor     text not null default '',
  texto     text not null,
  creado    timestamptz not null default now()
);

create table if not exists public.compras_movimientos (
  id        bigserial primary key,
  tablero   text not null references public.compras_tableros(codigo) on delete cascade,
  necesidad text not null default '',
  autor     text not null default '',
  que       text not null,
  creado    timestamptz not null default now()
);

create index if not exists idx_compras_com on public.compras_comentarios (tablero, creado);
create index if not exists idx_compras_mov on public.compras_movimientos (tablero, creado desc);


-- ── 2. Nadie entra directo ─────────────────────────────────
--  Supabase reparte permisos por omisión; se retiran todos y se
--  deja sólo la lectura al equipo con sesión (admin y dirección),
--  por si algún día se quiere ver desde LA PIZARRA.

alter table public.compras_tableros    enable row level security;
alter table public.compras_necesidades enable row level security;
alter table public.compras_comentarios enable row level security;
alter table public.compras_movimientos enable row level security;

revoke all on public.compras_tableros, public.compras_necesidades,
              public.compras_comentarios, public.compras_movimientos from anon;


-- ── 3. Funciones de la página ──────────────────────────────

-- Abre el tablero completo: necesidades, comentarios, los últimos
-- movimientos y el inventario vivo (sólo lectura, lo mínimo).
create or replace function public.compras_abrir(p_codigo text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case when t.codigo is null then null else jsonb_build_object(
    'codigo', t.codigo,
    'titulo', t.titulo,
    'ajustes', t.ajustes,
    'necesidades', coalesce((
      select jsonb_agg(n.datos || jsonb_build_object('_actualizado', n.actualizado, '_autor', n.autor)
                       order by n.datos->>'prioridad', (n.datos->>'orden')::numeric nulls last)
      from public.compras_necesidades n
      where n.tablero = t.codigo and not n.borrado), '[]'::jsonb),
    'comentarios', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'necesidad', c.necesidad,
               'autor', c.autor, 'texto', c.texto, 'creado', c.creado) order by c.creado)
      from public.compras_comentarios c where c.tablero = t.codigo), '[]'::jsonb),
    'movimientos', coalesce((
      select jsonb_agg(m order by m.creado desc) from (
        select necesidad, autor, que, creado from public.compras_movimientos
        where tablero = t.codigo order by creado desc limit 60) m), '[]'::jsonb),
    'inventario', coalesce((
      select jsonb_agg(jsonb_build_object(
               'nombre', r.datos->>'nombre', 'marca', r.datos->>'marca',
               'modelo', r.datos->>'modelo', 'categoria', r.datos->>'categoria',
               'cantidad', r.datos->'cantidad', 'estado', r.datos->>'estado',
               'notas', r.datos->>'notas')
             order by r.datos->>'categoria', r.datos->>'nombre')
      from public.registros r
      where r.coleccion = 'inventario_equipos' and not r.borrado), '[]'::jsonb),
    'version', greatest(t.actualizado,
      (select max(actualizado) from public.compras_necesidades where tablero = t.codigo),
      (select max(creado) from public.compras_comentarios where tablero = t.codigo))
  ) end
  from (select * from public.compras_tableros where codigo = upper(trim(p_codigo))) t
$$;

-- Versión: para que la página sepa si alguien más movió algo sin
-- bajarse todo el tablero cada 20 segundos.
create or replace function public.compras_version(p_codigo text)
returns timestamptz
language sql
stable
security definer
set search_path = public
as $$
  select greatest(t.actualizado,
    (select max(actualizado) from public.compras_necesidades where tablero = t.codigo),
    (select max(creado) from public.compras_comentarios where tablero = t.codigo))
  from public.compras_tableros t where t.codigo = upper(trim(p_codigo))
$$;

-- Ajusta una necesidad: mezcla sólo las claves que cambiaron.
-- Si la necesidad no existe, la crea (así se agregan nuevas).
create or replace function public.compras_ajustar(
  p_codigo text, p_id text, p_cambios jsonb, p_autor text, p_que text)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare v_cod text := upper(trim(p_codigo)); v_hora timestamptz := now();
begin
  if not exists (select 1 from public.compras_tableros where codigo = v_cod) then
    raise exception 'Código no válido';
  end if;
  if p_id !~ '^[a-z0-9_-]{1,40}$' then raise exception 'Identificador no válido'; end if;
  if jsonb_typeof(p_cambios) <> 'object' or octet_length(p_cambios::text) > 60000 then
    raise exception 'Cambio demasiado grande';
  end if;

  insert into public.compras_necesidades as n (tablero, id, datos, actualizado, autor)
  values (v_cod, p_id, p_cambios || jsonb_build_object('id', p_id), v_hora, left(coalesce(p_autor,''), 80))
  on conflict (tablero, id) do update
    set datos = n.datos || p_cambios, actualizado = v_hora,
        autor = left(coalesce(p_autor,''), 80), borrado = false;

  if coalesce(p_que, '') <> '' then
    insert into public.compras_movimientos (tablero, necesidad, autor, que)
    values (v_cod, p_id, left(coalesce(p_autor,''), 80), left(p_que, 300));
  end if;
  return v_hora;
end $$;

-- Quitar no borra: marca. Se puede recuperar desde la base.
create or replace function public.compras_quitar(p_codigo text, p_id text, p_autor text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_cod text := upper(trim(p_codigo)); v_tit text;
begin
  update public.compras_necesidades set borrado = true, actualizado = now(),
         autor = left(coalesce(p_autor,''), 80)
   where tablero = v_cod and id = p_id
  returning datos->>'titulo' into v_tit;
  if found then
    insert into public.compras_movimientos (tablero, necesidad, autor, que)
    values (v_cod, p_id, left(coalesce(p_autor,''), 80), 'quitó «' || coalesce(v_tit,'') || '»');
  end if;
end $$;

create or replace function public.compras_comentar(
  p_codigo text, p_necesidad text, p_autor text, p_texto text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_cod text := upper(trim(p_codigo));
begin
  if not exists (select 1 from public.compras_tableros where codigo = v_cod) then
    raise exception 'Código no válido';
  end if;
  if char_length(trim(coalesce(p_texto,''))) not between 1 and 1500 then
    raise exception 'El comentario está vacío o es demasiado largo';
  end if;
  insert into public.compras_comentarios (tablero, necesidad, autor, texto)
  values (v_cod, left(coalesce(p_necesidad,''), 40), left(coalesce(p_autor,''), 80), trim(p_texto));
end $$;

-- Ajustes del tablero (portada, diagnóstico): también por mezcla.
create or replace function public.compras_ajustes(
  p_codigo text, p_cambios jsonb, p_autor text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_cod text := upper(trim(p_codigo));
begin
  if octet_length(p_cambios::text) > 30000 then raise exception 'Cambio demasiado grande'; end if;
  update public.compras_tableros set ajustes = ajustes || p_cambios, actualizado = now()
   where codigo = v_cod;
  if not found then raise exception 'Código no válido'; end if;
end $$;

revoke all on function public.compras_abrir(text), public.compras_version(text),
  public.compras_ajustar(text, text, jsonb, text, text),
  public.compras_quitar(text, text, text),
  public.compras_comentar(text, text, text, text),
  public.compras_ajustes(text, jsonb, text) from public;

grant execute on function public.compras_abrir(text), public.compras_version(text),
  public.compras_ajustar(text, text, jsonb, text, text),
  public.compras_quitar(text, text, text),
  public.compras_comentar(text, text, text, text),
  public.compras_ajustes(text, jsonb, text) to anon, authenticated;
