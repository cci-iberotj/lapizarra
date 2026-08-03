-- ═══════════════════════════════════════════════════════════
--  LA PIZARRA · Asignación de roles
--  IBERO Tijuana
--
--  Correr DESPUÉS de haber creado las tres cuentas en
--  Authentication → Users.
--
--  Ya trae los correos reales: no hay que editar nada.
-- ═══════════════════════════════════════════════════════════


-- ── PASO A · Revisar que la base quedó bien ────────────────
--  Correr esto solo. Deben salir cuatro renglones diciendo "sí".

select 'tabla de perfiles'          as revisa,
       case when to_regclass('public.perfiles')  is not null then 'sí' else 'FALTA' end as estado
union all
select 'tabla de registros',
       case when to_regclass('public.registros') is not null then 'sí' else 'FALTA' end
union all
select 'marca de contraseña temporal',
       case when exists (select 1 from information_schema.columns
                         where table_schema = 'public' and table_name = 'perfiles'
                           and column_name = 'debe_cambiar_clave')
            then 'sí' else 'FALTA — vuelve a correr esquema.sql' end
union all
select 'roles renombrados (admin / direccion)',
       case when exists (select 1 from pg_constraint
                         where conname = 'perfiles_rol_check'
                           and pg_get_constraintdef(oid) like '%admin%')
            then 'sí' else 'FALTA — vuelve a correr esquema.sql' end;


-- ── PASO B · Ver quién existe ──────────────────────────────
--  Deben aparecer las tres cuentas que creaste en el panel.

select u.email,
       p.nombre,
       p.rol,
       p.debe_cambiar_clave
  from auth.users u
  left join public.perfiles p on p.id = u.id
 order by u.created_at;


-- ── PASO C · Asignar los roles ─────────────────────────────
--  Esto es lo que convierte tres cuentas iguales en tres
--  personas con permisos distintos.
--
--  El rol dice qué puede tocar cada quien en el programa, no quién
--  manda en el departamento. Marysol es la jefa del área; Leo tiene
--  'admin' porque es quien opera y mantiene la herramienta. El día
--  que eso cambie, se cambia aquí y ya.

update public.perfiles
   set rol = 'admin', nombre = 'Leo', debe_cambiar_clave = false
 where id = (select id from auth.users
              where email = 'leonardo.gonzalez@tijuana.ibero.mx');

update public.perfiles
   set rol = 'direccion', nombre = 'Marysol'
 where id = (select id from auth.users
              where email = 'marysol.castro@tijuana.ibero.mx');

update public.perfiles
   set rol = 'publicacion', nombre = 'Sergio'
 where id = (select id from auth.users
              where email = 'sergio.mancilla@tijuana.ibero.mx');


-- ── PASO D · Comprobar ─────────────────────────────────────
--  Así debe quedar:
--
--    Leo      admin        marca apagada  (ya pusiste tu clave buena)
--    Marysol  direccion    marca prendida (cambia al entrar)
--    Sergio   publicacion  marca prendida (cambia al entrar)

select p.nombre,
       p.rol,
       case when p.debe_cambiar_clave then 'prendida' else 'apagada' end as marca,
       u.email
  from public.perfiles p
  join auth.users u on u.id = p.id
 order by p.rol;
