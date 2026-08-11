-- Cinco estados en vez de siete.
--   brief -> produccion   (es el mismo momento: se esta haciendo)
--   vobo  -> revision     (dar el visto bueno es un solo acto)
-- La pagina ya los traduce al vuelo; esto lo deja escrito en la base
-- para que no queden dos vocabularios conviviendo.
update public.registros
   set datos = jsonb_set(datos, '{estado}', '"produccion"'),
       actualizado = now()
 where coleccion = 'parrilla_piezas' and not borrado
   and datos->>'estado' = 'brief';

update public.registros
   set datos = jsonb_set(datos, '{estado}', '"revision"'),
       actualizado = now()
 where coleccion = 'parrilla_piezas' and not borrado
   and datos->>'estado' = 'vobo';

select datos->>'estado' as estado, count(*)
  from public.registros
 where coleccion = 'parrilla_piezas' and not borrado
 group by 1 order by 1;
