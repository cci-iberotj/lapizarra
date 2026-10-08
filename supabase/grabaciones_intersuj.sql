-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Agenda de grabación INTERSUJ 2026
--  IBERO Tijuana
--
--  Pegar completo en Supabase → SQL Editor → Run, o correrlo con
--    python supabase/correr.py grabaciones_intersuj.sql
--  Se puede volver a correr sin miedo: no borra ni duplica nada.
--
--  PARA QUÉ ES
--  Los atletas del INTERSUJ apartan su día para la sesión de video
--  con fondo proyectado, desde el formulario:
--    cci-iberotj.github.io/lapizarra/intersuj.html
--  Cada registro es una persona que viene a grabar.
--
--  EL PERMISO VA AL REVÉS QUE EN `registros`
--  Quien se apunta es un alumno con un navegador: no tiene cuenta y
--  no debe tenerla. Así que cualquiera puede DEJAR su registro, y
--  sólo el equipo con sesión puede LEER la lista. Si la lectura
--  fuera pública, cualquiera bajaría los teléfonos y los correos de
--  todos los deportistas.
-- ═══════════════════════════════════════════════════════════


-- ── 1. La lista ────────────────────────────────────────────

create table if not exists public.grabaciones_intersuj (
  -- Ocho caracteres sin I, O, 0 ni 1: el acuse se dicta por
  -- teléfono y esas cuatro se confunden siempre. Mismo alfabeto que
  -- los folios de revisiones y solicitudes.
  folio      text primary key,

  nombre     text not null default '',
  equipo     text not null default '',   -- disciplina: voleibol, flag, tae kwon do…
  telefono   text not null default '',
  correo     text not null default '',

  -- El día que eligió. Se guarda el id Y la fecha con su horario:
  -- el id sirve para agrupar, y la fecha para que el registro siga
  -- siendo legible aunque después se cambien los días del
  -- formulario. Sin la fecha, un registro viejo diría nada más "d2".
  dia_id     text not null default '',
  dia_fecha  date,
  dia_desde  text not null default '',
  dia_hasta  text not null default '',

  -- Marcó que también podría otro día. Sirve para reacomodar a
  -- alguien cuando un bloque se llena y otro queda vacío.
  flexible   boolean not null default false,

  -- Para el día de la grabación: quién llegó y quién no.
  estado     text not null default 'apuntado',
  nota       text not null default '',

  creado     timestamptz not null default now()
);

alter table public.grabaciones_intersuj
  drop constraint if exists grabaciones_intersuj_estado_check;
alter table public.grabaciones_intersuj
  add constraint grabaciones_intersuj_estado_check
  check (estado in ('apuntado', 'grabado', 'no llego', 'cancelado'));

create index if not exists idx_grabaciones_intersuj_dia
  on public.grabaciones_intersuj (dia_fecha asc nulls last, creado asc);

comment on table public.grabaciones_intersuj is
  'Atletas apuntados a la sesion de video de INTERSUJ 2026.';


-- ── 2. Consultar el propio registro con el acuse ───────────
--  Quien se apunta no tiene cuenta, pero sí merece poder comprobar
--  que quedó. Con el acuse exacto se ve UNO, y sin él no se ve
--  nada: la lista completa sigue siendo del equipo. No devuelve el
--  teléfono ni el correo, que ya los sabe quien los escribió.
create or replace function public.consultar_grabacion(p_folio text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'folio', folio, 'nombre', nombre, 'equipo', equipo,
    'dia_fecha', dia_fecha, 'dia_desde', dia_desde, 'dia_hasta', dia_hasta,
    'estado', estado, 'creado', creado)
  from public.grabaciones_intersuj
  where folio = upper(trim(p_folio))
$$;

comment on function public.consultar_grabacion(text) is
  'Devuelve un registro dando su acuse. No permite listar.';


-- ── 3. Quién puede tocar qué ───────────────────────────────

alter table public.grabaciones_intersuj enable row level security;

drop policy if exists "apuntarse a grabar"   on public.grabaciones_intersuj;
drop policy if exists "ver los apuntados"    on public.grabaciones_intersuj;
drop policy if exists "marcar los apuntados" on public.grabaciones_intersuj;
drop policy if exists "quitar apuntados"     on public.grabaciones_intersuj;

-- Apuntarse lo puede hacer cualquiera, con o sin cuenta: ésa es la
-- gracia. Lo que no puede es dejar cualquier cosa — entra como
-- apuntado, sin nota, con acuse bien formado y con tamaños que no
-- sirvan para llenar la base.
create policy "apuntarse a grabar" on public.grabaciones_intersuj
  for insert to anon, authenticated
  with check (
    estado = 'apuntado'
    and char_length(nota) = 0
    and folio ~ '^[A-Z0-9]{8}$'
    and char_length(nombre)   between 1 and 90
    and char_length(equipo)   between 1 and 70
    and char_length(telefono) between 1 and 25
    and char_length(correo)   between 1 and 90
    and char_length(dia_id)   <= 20
    and char_length(dia_desde) <= 10
    and char_length(dia_hasta) <= 10
  );

-- Leer la lista, sólo con sesión. Aquí están los teléfonos y los
-- correos de los deportistas: esto NO se abre a anon.
create policy "ver los apuntados" on public.grabaciones_intersuj
  for select to authenticated using (true);

-- Marcar quién llegó y dejar notas, el día de la grabación.
create policy "marcar los apuntados" on public.grabaciones_intersuj
  for update to authenticated using (true) with check (true);

create policy "quitar apuntados" on public.grabaciones_intersuj
  for delete to authenticated using (true);
