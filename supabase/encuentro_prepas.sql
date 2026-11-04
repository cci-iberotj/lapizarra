-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Preparatorias del Encuentro IBERO 2027
--  IBERO Tijuana
--
--      python supabase/correr.py encuentro_prepas.sql
--  Se puede volver a correr sin miedo: no borra ni duplica nada.
--
--  PARA QUÉ ES
--  La presentación que Admisiones da en las preparatorias
--  (herramientas/encuentro-ibero.html y la copia local con el video
--  en 4K) lleva en la tuerca la lista de preparatorias: nombre y
--  logotipo. Antes, lo que se agregaba desde la tuerca se quedaba en
--  el navegador de esa computadora («Sólo por hoy») y se perdía al
--  cambiar de equipo o limpiar el navegador. Ahora todo vive aquí:
--  lo que se agrega en una computadora sale en todas.
--
--  QUIÉN PUEDE TOCAR QUÉ
--  Quien expone no tiene cuenta en la Pizarra, así que agregar,
--  corregir y quitar lo puede hacer cualquiera que tenga la
--  presentación. Por eso:
--    · no se entra a la tabla directo, sólo por las tres funciones
--      de abajo, que revisan tamaños y formatos;
--    · QUITAR NO BORRA: marca `borrado` y la fila se queda. Si
--      alguien quita una por error, se recupera con
--          update public.encuentro_prepas set borrado = false
--           where nombre ilike '%playas%';
--  Los nombres y logotipos de las escuelas son públicos: no hay
--  nada aquí que esconder, sólo que proteger de un borrado.
-- ═══════════════════════════════════════════════════════════


-- ── 1. La lista ────────────────────────────────────────────

create table if not exists public.encuentro_prepas (
  -- Ocho caracteres sin I, O, 0 ni 1, como los demás folios. Lo
  -- pone el navegador: así una preparatoria agregada sin internet
  -- ya tiene su id y se sube después sin duplicarse.
  id          text primary key,
  nombre      text not null,
  -- El logotipo como data URL (PNG, WebP o SVG). La presentación
  -- tiene que funcionar abierta desde el disco y sin carpeta de
  -- apoyo, así que el logotipo viaja entero, no como enlace.
  logo        text not null,
  -- Orden en la tuerca. La primera es la que sale al abrir el
  -- archivo en una computadora que nunca eligió ninguna.
  orden       double precision not null default extract(epoch from now()),
  creado      timestamptz not null default now(),
  actualizado timestamptz not null default now(),
  borrado     boolean not null default false
);

-- Dos preparatorias vivas con el mismo nombre confunden; una
-- quitada no cuenta, para poder volver a agregarla.
create unique index if not exists encuentro_prepas_nombre_unico
  on public.encuentro_prepas (lower(nombre)) where not borrado;

comment on table public.encuentro_prepas is
  'Preparatorias (nombre y logotipo) de la presentacion del Encuentro IBERO 2027.';

-- Nadie entra directo: sólo por las funciones.
alter table public.encuentro_prepas enable row level security;
revoke all on public.encuentro_prepas from anon, authenticated;


-- ── 2. Listar ──────────────────────────────────────────────
--  Sin logotipos: la presentación guarda copia de los que ya tiene
--  y sólo pide los que cambiaron (`actualizado` distinto). Así abrir
--  la presentación no baja megas cada vez.
create or replace function public.encuentro_prepas()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', id, 'nombre', nombre, 'actualizado', actualizado)
         order by orden, creado), '[]'::jsonb)
  from public.encuentro_prepas
  where not borrado
$$;

create or replace function public.encuentro_prepas_logos(p_ids text[])
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_object_agg(id, logo), '{}'::jsonb)
  from public.encuentro_prepas
  where id = any(p_ids[1:60]) and not borrado
$$;


-- ── 3. Guardar (agregar o corregir) ────────────────────────
--  Con un id que no existe, agrega. Con uno que existe, corrige el
--  nombre y, si viene, el logotipo; sin logotipo deja el que tenía.
create or replace function public.encuentro_prepa_guardar(
  p_id text, p_nombre text, p_logo text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  n text := btrim(regexp_replace(coalesce(p_nombre, ''), '\s+', ' ', 'g'));
  l text := nullif(btrim(coalesce(p_logo, '')), '');
  fila public.encuentro_prepas;
begin
  if coalesce(p_id, '') !~ '^[A-Z0-9]{8}$' then
    raise exception 'id mal formado' using errcode = '22023';
  end if;
  if char_length(n) not between 1 and 120 then
    raise exception 'El nombre va de 1 a 120 letras.' using errcode = '22023';
  end if;
  if l is not null and (l !~ '^data:image/(png|webp|jpeg|svg\+xml);base64,'
                        or char_length(l) > 1500000) then
    raise exception 'El logotipo no es una imagen válida o pesa demasiado.' using errcode = '22023';
  end if;
  if exists (select 1 from public.encuentro_prepas
              where lower(nombre) = lower(n) and not borrado and id <> p_id) then
    raise exception 'Ya hay una preparatoria con ese nombre.' using errcode = '23505';
  end if;

  select * into fila from public.encuentro_prepas where id = p_id;
  if not found then
    if l is null then
      raise exception 'Falta el logotipo.' using errcode = '22023';
    end if;
    insert into public.encuentro_prepas (id, nombre, logo)
    values (p_id, n, l) returning * into fila;
  else
    update public.encuentro_prepas
       set nombre = n,
           logo = coalesce(l, logo),
           borrado = false,
           actualizado = now()
     where id = p_id
    returning * into fila;
  end if;

  return jsonb_build_object('id', fila.id, 'nombre', fila.nombre,
                            'actualizado', fila.actualizado);
end
$$;


-- ── 4. Quitar ──────────────────────────────────────────────
--  No borra: la marca. Ver arriba cómo se recupera.
create or replace function public.encuentro_prepa_quitar(p_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.encuentro_prepas
     set borrado = true, actualizado = now()
   where id = p_id
$$;


revoke all on function public.encuentro_prepas()                         from public;
revoke all on function public.encuentro_prepas_logos(text[])             from public;
revoke all on function public.encuentro_prepa_guardar(text, text, text)  from public;
revoke all on function public.encuentro_prepa_quitar(text)               from public;
grant execute on function public.encuentro_prepas()                        to anon, authenticated;
grant execute on function public.encuentro_prepas_logos(text[])            to anon, authenticated;
grant execute on function public.encuentro_prepa_guardar(text, text, text) to anon, authenticated;
grant execute on function public.encuentro_prepa_quitar(text)              to anon, authenticated;

select count(*) filter (where not borrado) as vivas,
       count(*) filter (where borrado)     as quitadas
  from public.encuentro_prepas;
