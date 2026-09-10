-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Piezas por verificar
--  IBERO Tijuana
--
--  Pegar completo en Supabase → SQL Editor → Run, o correrlo con
--    python supabase/correr.py revisiones.sql
--  Se puede volver a correr sin miedo: no borra ni duplica nada.
--
--  PARA QUÉ ES
--  Un área arma su cartel en el generador de piezas y aprieta
--  «Enviar a revisión». La pieza cae aquí con un código de ocho
--  caracteres, y en LA PIZARRA aparece en la pestaña «Por
--  verificar». Desde ahí se abre en el generador para corregirla.
--
--  POR QUÉ NO VIVE EN `registros`
--  Esa tabla exige sesión para todo, y quien manda una propuesta
--  NO tiene cuenta: es alguien de un área que entró al generador
--  desde el navegador. Aquí el permiso es al revés que allá —
--  cualquiera puede dejar algo, sólo el equipo puede leer la
--  lista — así que le toca su propia tabla y sus propias reglas.
-- ═══════════════════════════════════════════════════════════


-- ── 1. La mesa de entrada ──────────────────────────────────

create table if not exists public.revisiones (
  -- Lo escribe quien manda. Ocho caracteres sin letras que se
  -- confundan al dictarlo por teléfono: nada de I, O, 0, 1.
  codigo   text primary key,
  titulo   text not null default '',
  area     text not null default '',
  de       text not null default '',   -- quién lo manda, texto libre
  nota     text not null default '',   -- lo que quiera advertir
  formato  text not null default '',
  diseno   text not null default '',
  estado   text not null default 'pendiente',
  -- El estado completo del generador, tal cual lo guarda su botón
  -- «Guardar». Se abre con eso y queda idéntico, fotos incluidas.
  pieza    jsonb not null,
  -- Miniatura para la tarjeta de la lista. Va aparte de `pieza`
  -- para poder pintar la bandeja sin bajarse un mega por renglón.
  vista    text,
  creado   timestamptz not null default now(),
  atendido timestamptz
);

-- La respuesta de Diseño. El panel del generador promete que «la abren, la
-- corrigen y te contestan»: sin un sitio donde escribir esa contestación, la
-- promesa se cumplía por correo, que es justo lo que veníamos a quitar.
alter table public.revisiones add column if not exists respuesta text not null default '';
alter table public.revisiones add column if not exists respondido timestamptz;

alter table public.revisiones drop constraint if exists revisiones_estado_check;
alter table public.revisiones add constraint revisiones_estado_check
  check (estado in ('pendiente', 'revisado', 'descartado'));

create index if not exists idx_revisiones_pendientes
  on public.revisiones (creado desc) where estado = 'pendiente';

comment on table public.revisiones is
  'Piezas que las areas mandan a verificar desde el generador.';


-- ── 2. Abrir una pieza con su código ───────────────────────
--  Quien manda no tiene cuenta, así que necesita poder volver a
--  abrir lo suyo. Se hace por esta función y no dando permiso de
--  lectura a la tabla: con el código exacto se ve una pieza, y
--  sin él no se ve nada. La lista completa sigue siendo del
--  equipo.

create or replace function public.abrir_revision(p_codigo text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'codigo', codigo, 'titulo', titulo, 'area', area, 'de', de,
    'nota', nota, 'estado', estado, 'creado', creado, 'pieza', pieza,
    'respuesta', respuesta, 'respondido', respondido)
  from public.revisiones
  where codigo = upper(trim(p_codigo))
$$;

comment on function public.abrir_revision(text) is
  'Devuelve una pieza dando su codigo. No permite listar ni buscar.';


-- ── 3. Quién puede tocar qué ───────────────────────────────

alter table public.revisiones enable row level security;

drop policy if exists "mandar a revision"  on public.revisiones;
drop policy if exists "ver revisiones"     on public.revisiones;
drop policy if exists "atender revisiones" on public.revisiones;
drop policy if exists "quitar revisiones"  on public.revisiones;

-- Dejar algo lo puede hacer cualquiera, con o sin cuenta: esa es
-- la gracia. Lo que no puede es dejar cualquier cosa — el renglón
-- entra como pendiente, con código bien formado y con un tamaño
-- que no sirva para llenar la base.
create policy "mandar a revision" on public.revisiones
  for insert to anon, authenticated
  with check (
    estado = 'pendiente'
    and atendido is null
    and codigo ~ '^[A-Z0-9]{8}$'
    and char_length(titulo) between 1 and 140
    and char_length(area)   <= 140
    and char_length(de)     <= 140
    and char_length(nota)   <= 600
    and octet_length(pieza::text) <= 6000000
    and (vista is null or octet_length(vista) <= 500000)
  );

-- La bandeja es de quien da el visto bueno: Diseño y la jefatura. No de
-- todo el que tenga cuenta. Esconder la pestaña en la página no cierra
-- nada; la que cierra es esta línea.
create policy "ver revisiones" on public.revisiones
  for select to authenticated
  using (public.mi_rol() in ('admin', 'direccion'));

create policy "atender revisiones" on public.revisiones
  for update to authenticated
  using      (public.mi_rol() in ('admin', 'direccion'))
  with check (public.mi_rol() in ('admin', 'direccion'));

-- Quitar de la lista sólo quien administra la herramienta.
create policy "quitar revisiones" on public.revisiones
  for delete to authenticated using (public.mi_rol() = 'admin');


-- ── 4. Permisos de tabla ───────────────────────────────────
--  Las políticas deciden qué renglón pasa; estos permisos, si la
--  puerta existe siquiera. Hacen falta los dos.

--  Supabase reparte permisos por omisión a `anon` sobre lo que se
--  crea en `public`. Aquí se los quitamos y le devolvemos sólo el
--  de dejar algo. Las políticas ya lo impedirían igual, pero si
--  alguna vez alguien apaga RLS por descuido, esta línea es la que
--  evita que la bandeja quede abierta de par en par.
revoke all on public.revisiones from anon;

grant insert on public.revisiones to anon;
grant select, insert, update, delete on public.revisiones to authenticated;
grant execute on function public.abrir_revision(text) to anon, authenticated;


-- ── 5. Lo que queda pendiente ──────────────────────────────
--  Esta tabla crece sola: cada envío deja un renglón con su pieza
--  adentro. Cuando estorbe, se limpian a mano las revisadas de
--  más de unos meses. No se pone borrado automático todavía
--  porque perder el trabajo de alguien por una regla de limpieza
--  es peor que tener la tabla grande.
