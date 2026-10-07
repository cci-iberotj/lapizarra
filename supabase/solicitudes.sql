-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Bandeja de solicitudes
--  IBERO Tijuana
--
--  Pegar completo en Supabase → SQL Editor → Run, o correrlo con
--    python supabase/correr.py solicitudes.sql
--  Se puede volver a correr sin miedo: no borra ni duplica nada.
--
--  PARA QUÉ ES
--  Un área llena la plataforma de solicitudes
--  (cci-iberotj.github.io/solicitudes-cci) y además del correo de
--  siempre, la solicitud cae aquí. En LA PIZARRA aparece en la
--  pestaña «Solicitudes». Desde ahí se acepta —y entonces sí nace
--  el evento o la pieza en el calendario— o se descarta.
--
--  POR QUÉ NO CAE DIRECTO EN EL CALENDARIO
--  Porque entonces cualquiera de fuera escribiría en la parrilla y
--  habría que limpiarla a mano. Aquí hay un paso de por medio: lo
--  que nadie aprobó no ensucia el plan, y lo que se descartó queda
--  escrito en vez de desaparecer.
--
--  POR QUÉ NO VIVE EN `registros`
--  Igual que `revisiones`: esa tabla exige sesión para todo, y
--  quien manda una solicitud NO tiene cuenta — es alguien de un
--  área con un navegador. Aquí el permiso va al revés: cualquiera
--  puede dejar algo, sólo el equipo puede leer la lista.
-- ═══════════════════════════════════════════════════════════


-- ── 1. La mesa de entrada ──────────────────────────────────

create table if not exists public.solicitudes (
  -- Lo escribe quien manda, con el mismo alfabeto que los códigos
  -- de revisión: ocho caracteres sin letras que se confundan al
  -- dictarlas por teléfono (nada de I, O, 0, 1). Sirve para que
  -- quien solicita pueda preguntar «¿cómo va la K7XM4TRQ?».
  folio     text primary key,

  tipo      text not null default '',   -- Evento, Diseño, Ya ocurrió, Otro
  titulo    text not null default '',
  area      text not null default '',
  de        text not null default '',   -- quién la manda
  correo    text not null default '',
  urgente   boolean not null default false,
  -- La fecha que pide el formulario: el día del evento, o para
  -- cuándo necesita la pieza. Sirve para ordenar la bandeja por lo
  -- que se viene encima, no por cuándo llegó.
  fecha     date,

  -- Todo lo capturado, tal cual. Los campos de arriba están
  -- repetidos aquí dentro a propósito: salen arriba para poder
  -- filtrar y ordenar sin abrir el jsonb de cada renglón.
  datos     jsonb not null default '{}'::jsonb,

  estado    text not null default 'pendiente',
  creado    timestamptz not null default now(),

  -- Quién la atendió y cuándo. `nota` es para escribir por qué se
  -- descartó: una solicitud que desaparece sin explicación hace
  -- que el área la vuelva a mandar la semana siguiente.
  atendido      timestamptz,
  atendido_por  text not null default '',
  nota          text not null default '',

  -- Al aceptarla nace un evento o una pieza en el calendario.
  -- Aquí queda su id, para poder ir de la solicitud a lo que
  -- produjo y al revés. Sin esto, aceptar dos veces la misma
  -- solicitud crearía dos entradas y nadie lo notaría.
  pizarra_coleccion text not null default '',
  pizarra_id        text not null default ''
);

alter table public.solicitudes drop constraint if exists solicitudes_estado_check;
alter table public.solicitudes add constraint solicitudes_estado_check
  check (estado in ('pendiente', 'aceptada', 'descartada'));

create index if not exists idx_solicitudes_pendientes
  on public.solicitudes (fecha asc nulls last, creado desc)
  where estado = 'pendiente';

comment on table public.solicitudes is
  'Solicitudes que mandan las areas desde la plataforma de solicitudes.';


-- ── 2. Consultar una solicitud con su folio ────────────────
--  Quien la manda no tiene cuenta, pero sí merece poder saber en
--  qué quedó. Se hace por esta función y no dando permiso de
--  lectura a la tabla: con el folio exacto se ve UNA solicitud, y
--  sin él no se ve nada. La lista completa sigue siendo del equipo.
--
--  No devuelve `datos` ni el correo de quien la mandó: para saber
--  en qué va basta el estado y la nota, y lo demás ya lo tiene
--  quien lo escribió.
create or replace function public.consultar_solicitud(p_folio text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'folio', folio, 'tipo', tipo, 'titulo', titulo,
    'estado', estado, 'creado', creado,
    'atendido', atendido, 'nota', nota)
  from public.solicitudes
  where folio = upper(trim(p_folio))
$$;

comment on function public.consultar_solicitud(text) is
  'Devuelve el estado de una solicitud dando su folio. No permite listar.';


-- ── 3. Quién puede tocar qué ───────────────────────────────

alter table public.solicitudes enable row level security;

drop policy if exists "mandar solicitud"    on public.solicitudes;
drop policy if exists "ver solicitudes"     on public.solicitudes;
drop policy if exists "atender solicitudes" on public.solicitudes;
drop policy if exists "quitar solicitudes"  on public.solicitudes;

-- Dejar una solicitud lo puede hacer cualquiera, con o sin cuenta:
-- esa es la gracia. Lo que no puede es dejar cualquier cosa — entra
-- como pendiente, sin marcarse como atendida, con folio bien formado
-- y con tamaños que no sirvan para llenar la base.
create policy "mandar solicitud" on public.solicitudes
  for insert to anon, authenticated
  with check (
    estado = 'pendiente'
    and atendido is null
    and atendido_por = ''
    and pizarra_id = ''
    and folio ~ '^[A-Z0-9]{8}$'
    and char_length(titulo) between 1 and 200
    and char_length(tipo)   <= 60
    and char_length(area)   <= 140
    and char_length(de)     <= 140
    and char_length(correo) <= 140
    and char_length(nota)   = 0
    -- El formulario completo con sus notas ronda los 4 KB. El tope
    -- deja aire de sobra y cierra la puerta a usar esto de almacén.
    and octet_length(datos::text) <= 200000
  );

-- La bandeja la ve TODO el equipo, no sólo quien la atiende: una
-- solicitud de diseño le importa a quien hace diseño y a quien
-- planea la semana, y saber qué está entrando es justo el punto de
-- tener un tablero compartido.
create policy "ver solicitudes" on public.solicitudes
  for select to authenticated using (true);

-- Aceptarla o descartarla, en cambio, sí es de quien después va a
-- cargar con ello: aceptar CREA trabajo en el calendario. Son los
-- mismos roles que pueden escribir piezas y eventos.
create policy "atender solicitudes" on public.solicitudes
  for update to authenticated
  using      (public.mi_rol() in ('admin', 'direccion', 'publicacion', 'produccion'))
  with check (public.mi_rol() in ('admin', 'direccion', 'publicacion', 'produccion'));

-- Borrar de verdad, sólo quien administra. Descartar NO borra: deja
-- el renglón con su motivo, que es lo que evita que la misma
-- solicitud vuelva a llegar el mes que entra.
create policy "quitar solicitudes" on public.solicitudes
  for delete to authenticated using (public.mi_rol() = 'admin');


-- ── 4. Permisos de tabla ───────────────────────────────────
--  Las políticas deciden qué renglón pasa; estos permisos, si la
--  puerta existe siquiera. Hacen falta los dos.
--
--  Supabase reparte permisos por omisión a `anon` sobre lo que se
--  crea en `public`. Aquí se los quitamos y le devolvemos sólo el
--  de dejar algo: si alguna vez alguien apaga RLS por descuido,
--  esta línea evita que la bandeja quede abierta de par en par.
revoke all on public.solicitudes from anon;

grant insert on public.solicitudes to anon;
grant select, insert, update, delete on public.solicitudes to authenticated;
grant execute on function public.consultar_solicitud(text) to anon, authenticated;


-- ── 5. Comprobar ───────────────────────────────────────────
select 'tabla de solicitudes' as revisa,
       case when to_regclass('public.solicitudes') is not null
            then 'sí' else 'FALTA' end as estado
union all
select 'anon solo puede insertar',
       case when (select count(*) from information_schema.role_table_grants
                   where table_schema = 'public' and table_name = 'solicitudes'
                     and grantee = 'anon') = 1
            then 'sí' else 'REVISAR' end
union all
select 'RLS encendido',
       case when (select relrowsecurity from pg_class
                   where oid = 'public.solicitudes'::regclass)
            then 'sí' else 'FALTA' end;
