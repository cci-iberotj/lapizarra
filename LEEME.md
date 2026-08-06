# LA PIZARRA
### Departamento de Diseño y Medios · IBERO Tijuana

Sistema de gestión para parrilla de contenido e inventario de equipo.

---

## Cómo entrar

# https://cci-iberotj.github.io/lapizarra/

Desde cualquier computadora o teléfono, con tu correo institucional y tu
contraseña. **Ya no depende de que la computadora de nadie esté prendida.**

La primera vez que entras te obliga a cambiar la contraseña provisional.
A partir de ese momento nadie más la conoce — ni quien te la dio.

---

## Quién puede tocar qué

Los tres ven **las cinco pestañas**. Eso es a propósito: el calendario
compartido es el punto de la herramienta, y esconder secciones sólo hace
creer que el programa está descompuesto.

Lo que cambia es qué se puede **editar**:

| | Piezas | Ideas | Inventario | Temas | Expertos |
|---|:--:|:--:|:--:|:--:|:--:|
| **Leo** — admin | sí | sí | sí | sí | sí |
| **Marysol** — dirección | sí | sí | — | sí | sí |
| **Sergio** — publicación | sí | — | — | — | — |

Donde no puedes editar, el botón sale apagado y arriba aparece un aviso
explicando por qué. Nada se bloquea a la mitad de la captura.

**El rol dice qué tocas en el programa, no quién manda en el departamento.**
Son dos cosas distintas. Leo tiene `admin` porque mantiene la herramienta;
Marysol es la jefa del área.

Los permisos los aplica la base de datos, no la página. Aunque alguien
manipule su navegador para reencender un botón, el cambio se rechaza igual.

---

## Dónde viven tus datos

En **Supabase** (el proyecto `wrezcukptrtmnhnlxmao`), no en tu computadora.
Por eso los tres ven lo mismo al instante.

**Se guarda solo.** No hay botón de "guardar todo": cada cambio se escribe
medio segundo después de que lo haces, y sólo viaja lo que de verdad cambió
— por eso dos personas pueden trabajar al mismo tiempo sin pisarse. Arriba a
la derecha ves la hora del último guardado.

Cada 20 segundos entra lo que movieron los demás, sin recargar.

> **Los archivos `datos/*.json` ya no son los datos vivos.** Quedaron
> congelados el día que se migró a la nube. Si los abres vas a ver la
> parrilla de ese momento, no la de hoy. No los borres, pero tampoco te
> confíes de ellos.

### Deshacer y rehacer

Arriba a la derecha hay dos flechas y un botón **Historial**.

| Atajo | Qué hace |
|---|---|
| `Ctrl + Z` | Deshacer |
| `Ctrl + Y` o `Ctrl + Shift + Z` | Rehacer |

Los atajos no funcionan mientras escribes en un campo ni con una ficha abierta —
ahí `Ctrl+Z` deshace lo que estás tecleando, como es de esperarse.

**El botón Historial es lo que de verdad te salva.** Abre la lista de todo lo
que has hecho en la sesión, con hora y descripción. Clic en cualquier punto y
LA PIZARRA vuelve a ese momento — no importa si fueron veinte cambios atrás. El paso
actual va marcado en rojo; los que quedaron adelante (deshechos) aparecen
atenuados y puedes volver a ellos.

Se conservan los últimos 60 cambios. **El historial es de la sesión**: al cerrar
LA PIZARRA arranca de nuevo. Para eso están los respaldos de disco.

### Respaldos — léelo, esto cambió

**El plan gratis de Supabase no guarda copias restaurables.** Se comprobó
contra su API: la lista de respaldos viene vacía y no hay "volver a ayer".
No es un descuido de configuración, es lo que incluye el plan.

Lo que sí protege:

**1. Nada se borra de verdad.** Cuando eliminas algo, se marca como borrado
pero el renglón se queda en la base. Un borrado por accidente se puede
recuperar; hay que pedirlo, pero está ahí.

**2. Respaldo a mano.** Baja una copia completa cuando quieras:

```
python supabase/respaldar.py
```

Deja un archivo con fecha en `datos/respaldos-nube/`. Se lleva **también**
los borrados — un respaldo que ya decidió por ti qué se puede tirar no es un
respaldo. Vale la pena correrlo después de una sesión larga de captura.

Y para que sirva de verdad: **que la carpeta `datos/` esté en OneDrive**. Un
respaldo que vive en el mismo disco que todo lo demás no protege contra el
disco.

Los respaldos viejos en `datos/respaldos/` son de la época en que todo vivía
en tu computadora. Sirven como archivo histórico, no como copia de lo de hoy.

---

## Parrilla

**Los cinco pilares** vienen del plan maestro:

| Pilar | Carril | Meta mensual |
|---|---|---|
| Vida IBERO | casual | 35% |
| Orgullo IBERO | institucional | 20% |
| Sé IBERO | institucional | 20% |
| Cultura Viva | híbrido | 15% |
| Voz IBERO | institucional | 10% |

**El indicador de balance** es el corazón de la parrilla. Revisa la semana que
estás viendo y te dice si el carril institucional está desapareciendo:

- **Mezcla equilibrada** — 40% o más de piezas institucionales
- **Falta peso institucional** — entre 20% y 40%
- **Semana sin nada institucional / Muy cargada a lo casual** — menos del 20%

Ese aviso es justo el problema que detectamos en la auditoría de agosto de 2026:
el feed de julio era casi todo casual.

**Los siete estados** siguen el flujo de aprobación:
Idea → Brief → Producción → Revisión Leo → VoBo institucional → Programado → Publicado

### Banco de ideas

Cada idea se clasifica sola en cuanto la escribes, y **el color te dice de qué
pilar es** sin abrirla. Arriba hay un contador por pilar: de un vistazo ves si
tienes cinco de Sé IBERO y ninguna de Voz. Clic en cualquier pilar filtra el
banco por ese color.

Si LA PIZARRA no reconoció vocabulario claro, la tarjeta lleva un **?** ámbar: la
clasificó por descarte y conviene revisarla.

Cada ficha trae además:

- **El formato sugerido** junto al pilar.
- **Cómo se hace** — un brief plegable con la producción concreta: cuántas
  láminas lleva el carrusel y qué va en cada una, qué tomas necesitas antes de
  salir a grabar, cuánto debe durar el reel. Se despliega con un clic.
- **La fecha**, cuando la idea se cuelga de una efeméride. Aparece como una
  franja ámbar con el nombre y el día.

**Programar** convierte la idea en pieza con fecha, ya con pilar, formato,
canales, ventana **y el brief de producción** copiado a la ficha.

### Fechas que vienen

Arriba del banco hay una tira con las efemérides de los próximos dos meses y
medio: días profesionales (Médico, Arquitecto, Psicólogo, Ingeniero…), fechas
jesuitas como San Ignacio de Loyola, y el calendario nacional.

Cada tarjeta dice cuántos días faltan. Si ya tienes algo programado para esa
fecha aparece atenuada con un ✓. Clic en cualquiera para guardar una idea
anclada a esa fecha.

> **Verifica las fechas** contra el calendario oficial antes de programar:
> algunas varían por fuente. La lista se edita en `web/app.js`, en la constante
> `EFEMERIDES` — puedes quitar, corregir o añadir renglones.

### Cómo se hace (en la ficha de pieza)

Toda pieza tiene un campo **Cómo se hace**. El botón **Sugerir** trae la guía
del formato y del pilar que tengas elegidos — la estructura de un carrusel es
distinta si es Sé IBERO (cifras concretas) que si es Voz IBERO (mucho aire, una
idea por lámina). Es un punto de partida: edítalo a tu criterio.

### Tema claro y oscuro

El botón **◐** de la barra cambia entre los dos. Arranca siguiendo el tema de
tu sistema y después recuerda tu elección.

El oscuro no es decoración: cuando revisas miniaturas y color, un fondo gris
claro falsea lo que estás viendo.

### Vista de calendario

El botón **Calendario** (junto a *+ Nueva pieza*) cambia de la lista al mes
completo. Cada pieza aparece en su día:

- **Con imagen** → se ve la miniatura.
- **Sin imagen** → se ve el título sobre una barra del color de su pilar.

Clic en una pieza la abre. Al pasar el mouse sobre un día aparece un `+` para
crear una pieza directamente en esa fecha.

**Arrastrar y soltar:** toma una pieza y llévala a otro día. Mientras arrastras,
el calendario te dice de un vistazo dónde puedes soltarla:

- **Verde** → el día acepta la pieza
- **Atenuado** → no se puede (ya hay algo ese día, o violaría su ventana de fechas)

Si sueltas en un día inválido no pasa nada y LA PIZARRA te dice por qué.

Para subir la miniatura: abre la pieza y usa **Imagen de referencia**. Las
imágenes se guardan en `datos/miniaturas/` (máximo 12 MB cada una).

---

## Los dos automatismos

Corren en tu máquina. Sin internet, sin costo, y con el mismo resultado cada
vez que los usas.

### Capturar y clasificar

En el banco de ideas. Describes la idea en tus palabras y LA PIZARRA propone
título, pilar, formato y canales. Funciona reconociendo el vocabulario propio
de cada pilar: *POV*, *parcial* o *cafetería* apuntan a Vida IBERO; *egresado*
o *investigación* a Orgullo; *convocatoria* o *beca* a Sé IBERO; *taller* o
*exposición* a Cultura; *jesuita* o *comunidad* a Voz.

Te dice con qué confianza clasificó — **alta**, **media** o **baja** — y por
qué. Es una sugerencia: tú confirmas o corriges antes de guardar.

### Ventana válida de publicación

Cada pieza puede llevar dos límites: **no antes de** y **no después de**. Es lo
que evita que una cobertura salga antes del evento.

LA PIZARRA los propone sola cuando escribes la fecha en el texto. Si capturas
*"Reel de IGNITE, el evento es el 10 de agosto"*, detecta el 10, entiende que
un reel del evento es cobertura, y fija **no antes del 10 de agosto**. Si en
cambio escribes *"Invitación a IGNITE, te esperamos el 10 de agosto"*, entiende
que es un anuncio y fija **no después del 10**.

Reconoce formatos como `10 de agosto`, `10 ago` y `15/09`. Si la fecha ya pasó
hace más de un mes, asume que hablas del año siguiente.

Las piezas con ventana llevan un **⧖** en el calendario. Tanto *Acomodar
pendientes* como el arrastre respetan esos límites.

### Acomodar pendientes

En la vista de calendario. Toma todo lo que no tiene fecha (piezas e ideas del
banco) y lo reparte en el mes aplicando las reglas del plan maestro:

- Contenido institucional preferentemente entre martes y jueves
- Casual hacia el fin de semana
- Nunca dos piezas del mismo pilar en días consecutivos
- Una pieza por día como máximo
- Domingos libres
- Nada hacia atrás en el tiempo

Te muestra la propuesta completa antes de aplicar nada, y **te dice la verdad
sobre cómo queda la mezcla**: si alguna semana sigue por debajo del 40%
institucional, te lo advierte en vez de fingir que quedó bien.

---

## Redacción

La mesa donde vive el pilar académico. Una nota pasa por **tres manos**:
tú detectas la oportunidad y produces el reel, **Marysol** escribe, **Sergio**
publica en el sitio.

Los nombres se editan en `datos/redaccion.json`, en el bloque `equipo`.

### Temas en observación

Asuntos donde ya sabes quién puede opinar, esperando que la coyuntura los
active. Cada tema guarda el **ángulo** que buscarías y el **experto** que lo
hablaría.

Escribe el ángulo con calma ahora: el día que estalle la noticia no vas a tener
tiempo de pensarlo. Cuando el tema se active, el botón **Encargar** lo convierte
en nota con todo prellenado.

### Notas en curso

Un tablero de seis columnas, una por etapa. Cada columna dice **de quién se está
esperando algo**:

| Etapa | Espera a |
|---|---|
| Encargada | Marysol |
| Escribiendo | Marysol |
| Borrador listo | Tú |
| Con publicación | Sergio |
| En el sitio | Tú (falta difundir) |
| Difundida | Nadie — cerrada |

La flecha `→` avanza la nota de etapa. Las que se pasaron de fecha se marcan en
rojo.

### El encargo

El botón **Encargo** arma el texto completo que le mandas a quien escribe y lo
copia al portapapeles: para quién, fecha meta, ángulo, la ficha del experto con
su contacto y sus mañas, qué debe llevar la nota, y qué haces tú después con
ella.

Es el artefacto que hace funcionar la cadena sin juntas.

---

## Expertos

Directorio de académicos: grado, departamento, **temas que puede comentar**,
**qué tan rápido responde** y notas de trato.

Arriba hay un **mapa de cobertura** de doce temas de coyuntura. Los que salen
en gris son territorio donde hoy no podrías responder a una nota. Sirve para
pedirle nombres a los directores de carrera enseñando los huecos.

---

## Auditoría

La tercera pestaña. Revisa la parrilla y el inventario contra las reglas del
plan maestro y te da una calificación del 0 al 100 con hallazgos ordenados por
severidad.

Qué revisa:

| Área | Qué detecta |
|---|---|
| Mezcla | Semanas sin nada institucional, o por debajo del 40% |
| Ritmo | Si vas por debajo de 3 piezas por semana |
| Flujo | Piezas atoradas en Revisión o VoBo, fechas vencidas sin publicar |
| Preparación | Piezas de esta semana sin copy, sin miniatura o sin responsable |
| Canales | Canales que no reciben nada en el periodo |
| Inventario | Préstamos vencidos, equipo sin serie, sin valor, drone sin bitácora |

Cada hallazgo trae un **Qué hacer** concreto. Abajo están las barras de mezcla
contra la meta de cada pilar (la línea vertical marca el objetivo), la
cobertura por canal y el embudo de producción, que se pinta en ámbar cuando
una etapa se satura.

Puedes ver el diagnóstico de este mes, del próximo, del trimestre o de todo lo
registrado.

---

## Sobre el copy

El copy no se genera dentro de LA PIZARRA: se trabaja en sesión con Claude, donde
puedes iterarlo hasta que suene bien, y aquí guardas el resultado. Escribir
con criterio de ritmo no es algo que unas reglas locales puedan hacer.

**Nota sobre `ia.py` y `clave_ia.txt`:** quedaron en la carpeta pero **no están
en uso**. Fueron un intento de meter IA dentro de la app; resultó que dos de
las tres funciones se resuelven mejor con reglas locales y la tercera se
resuelve mejor en sesión. Los dejé por si algún día quieres que otra persona
del equipo genere copy sin pasar por ti — ese día se pega una llave de API y se
reconecta. Mientras tanto puedes ignorarlos.

---

## Inventario

**Esto es control interno, no el registro patrimonial.** El inventario legal lo
lleva Planta Física. Aquí sólo se responde lo que necesitas para trabajar: qué
tienes, dónde está y quién lo trae. Por eso no se piden valores, números de
serie obligatorios ni fechas de compra.

Registra cámaras, lentes, drone, audio, iluminación, soportes, almacenamiento,
baterías, cómputo y accesorios.

**Cantidad:** para lo que tienes repetido. Seis baterías son un renglón con
cantidad 6, no seis fichas.

**Seña para identificarlo** (opcional): sólo si tienes dos iguales y necesitas
distinguirlos — "cinta azul", los últimos dígitos de la serie, un apodo.

### Listas rápidas

Marca las casillas del equipo que te vas a llevar y aparece una barra abajo con
tres acciones:

| Acción | Qué hace |
|---|---|
| **Copiar lista** | Arma un checklist agrupado por categoría, con cantidades y dónde está cada cosa, y lo copia al portapapeles. Le pones nombre y lo pegas donde lo necesites. |
| **Marcar como salida** | Pone todo lo seleccionado como prestado de un jalón: pides el nombre y la fecha de regreso una sola vez. |
| **Quitar selección** | Limpia las casillas. |

La lista sale así:

```
Salida — grabación IGNITE
─────────────────────────

CÁMARA
  [ ] Cámara principal — Sony A7 IV  (Gaveta 1)

AUDIO
  [ ] 2× Micrófono de solapa — Rode Wireless GO II  (Mochila chica)

ENERGÍA / BATERÍAS
  [ ] 6× Baterías NP-FZ100 — Sony  (Mochila chica)

Total: 10 piezas en 4 renglones
```

Una salida en lote es un solo paso del historial: `Ctrl+Z` la revierte completa.

**Préstamos:** cambia el estado de un equipo a *Prestado* y se te piden el
responsable y la fecha de regreso. Los préstamos activos aparecen arriba, y los
vencidos se marcan en rojo. Al devolverlo, el préstamo pasa al historial.

**Dónde está.** El campo que más te va a servir: "Gaveta 1", "Mochila chica",
"Taller". Es lo que te ahorra la vuelta a bodega, y sale impreso en las listas.

**Bitácora de drone:** aparece automáticamente cuando registras un equipo de
categoría *Drone*. Sirve para dejar constancia de quién voló, dónde, para qué y
bajo qué permiso.

---

## Atajos

| Tecla | Qué hace |
|---|---|
| `Esc` | Cierra la ventana de edición |
| `Ctrl + Enter` | Guarda lo que estás editando |

---

## Notas técnicas

**Cómo está armado.** Página estática (HTML, CSS y JavaScript sin librerías ni
`npm`) hospedada en GitHub Pages, hablando con Supabase por HTTP normal. No hay
nada que compilar: lo que ves en `web/` es exactamente lo que corre.

**Publicar un cambio.** Cualquier cosa que entre a `main` se publica sola
(`.github/workflows/publicar.yml`). Tarda un minuto. Los archivos se sellan con
el número del cambio para que el navegador no sirva una mezcla de código viejo
y nuevo.

**Los permisos viven en la base**, no en la página — `supabase/esquema.sql`.
Para comprobar que siguen aplicando:

```
python supabase/verificar.sql
```

Se mete en la piel de cada persona y le pregunta a la base si la dejaría
escribir. No es una copia de la regla: es la regla.

**Correr SQL sin copiar y pegar:** `python supabase/correr.py <archivo.sql>`.
Se niega a ejecutar instrucciones que borran a menos que se lo pidas a
propósito con `--si-borra`.

**El token de Supabase** vive en `datos/token_supabase.txt`, fuera del
repositorio. El repositorio es público: nunca metas ahí contraseñas ni llaves.
La llave que sí está en `web/config.js` es la publicable, y es pública por
diseño — lo que protege los datos son los permisos de la base.

### Lo que quedó a medias, a propósito

- **`servidor.py` ya no guarda nada.** Sigue sirviendo para abrir la página en
  tu máquina (`LA PIZARRA.bat`), pero los datos van a la nube. Poner
  `motor: 'local'` en `web/config.js` deja la aplicación **sin datos**: ese
  camino se quedó a medio terminar.
- **`ia.py` está desconectado**, no roto. Se retiró cuando quedó claro que
  clasificar y calendarizar son reglas, no lenguaje. Sigue ahí por si algún día
  el diseñador nuevo necesita generar copy sin pasar por Leo.
- Cada registro tiene identificador único, para que el día que se integre con el
  CRM de Sergio la migración sea directa.

## Publicar en redes

Dos apps de Meta, una por red, porque una sola app no puede usar los dos
tipos de inicio de sesión a la vez:

- **La Pizarra · IBERO Tijuana** — Instagram, con *inicio de sesión de
  Instagram*. Ése es el camino que **no** exige vincular la cuenta con una
  página de Facebook, que es lo que en Tijuana no se puede hacer porque el
  portafolio vive en CDMX.
- **La Pizarra Páginas · IBERO Tijuana** — Facebook, con token de página.

Los tokens viven en los secretos de Supabase (`META_TOKEN_IG`,
`META_TOKEN_FB`), nunca en el navegador: la página es pública y cualquiera
leería su código. Se suben con `PEGAR TOKEN.bat`.

### Las dos apps tienen que estar en MODO ACTIVO

Esto costó una tarde y no es obvio. Una app en **modo de desarrollo**
publica de verdad —el post existe, la API responde bien, el enlace
funciona— pero **sólo lo ven las personas que tienen un rol en la app**.
Para todos los demás, incluidos los seguidores, la publicación no aparece
en el muro.

El síntoma es engañoso: quien administra la app ve el post normal y jura
que todo salió bien; los demás ven una foto suelta en la pestaña de Fotos,
o nada.

Se cambia en el panel de cada app, menú izquierdo → **Publicar**. Para
poder activarlo hay que llenar antes, en *Configuración de la app →
Básica*, la **URL de la política de privacidad** (sirve el aviso de
privacidad de IBERO) y la **categoría**.

Al pasar a modo activo, lo ya publicado durante el modo de desarrollo se
vuelve visible solo: no hay que republicar nada.

### El token de Facebook cuelga de una persona

El de Instagram lo autoriza la cuenta, así que sobrevive a cambios de
contraseña. El de Facebook sale del rol de Leo sobre la página: si deja de
ser publicador, Facebook deja de funcionar e Instagram sigue.

Se arregla el día que CDMX conceda *acceso de socio* al portafolio de
Tijuana: con eso se puede crear un usuario del sistema y el token deja de
depender de nadie. `TOKEN FACEBOOK.bat` convierte un token corto en uno
permanente y comprueba con Meta que de verdad no caduque.

### Publicar solo, a la hora

Una pieza con la casilla **«Publicar sola a su hora»** encendida sale sin
que nadie apriete nada. La casilla está aparte de la aprobación a
propósito: Marysol aprueba el contenido; armar la salida sola es otra
decisión.

**Quién guarda la fecha: nosotros, no Meta.** Un reloj en la base
(`pg_cron`) despierta cada cinco minutos, llama a la función `publicar`, y
ésta le dice a Meta «publica esto ahora». Se pensó lo contrario —dejarle
la fecha a Meta— y no sirve: Facebook sí admite programar, Instagram no,
así que una misma pieza tendría dos mecanismos con fallas distintas.

Y sobre todo: **las reglas se comprueban en el momento de publicar.** Si
alguien cambia el arte a las 16:55 de una pieza armada para las 17:00, la
aprobación caduca y no sale. Si la fecha viviera en Meta, saldría igual —
toda la red de seguridad se volvería decorativa.

Las condiciones son las mismas que las del botón: aprobada, aprobación no
caducada, con arte, con canales automatizables y sin haber salido ya en
esa red. Sale **una por corrida**, así que una cola atrasada se vacía
espaciada y no de golpe.

**La hora se compara como texto, no con cuentas de husos.** Las piezas
dicen «17:00 en Tijuana»; el servidor piensa en UTC y hay horario de
verano. Restar horas a mano se rompe en silencio: el post sale bien pero
una hora antes. En vez de calcular se le pide a la máquina la hora de
Tijuana ya formateada igual que como la guardamos.

Si falla, el motivo se guarda en la pieza y aparece en la campana como
**«No se pudo publicar sola»**. Un fallo callado sería el peor final: la
pieza no sale y nadie se entera.

#### El interruptor

**`RELOJ.bat`** — doble clic. Dice cómo va y permite apagarlo o
encenderlo. Apagarlo no borra ni cancela nada: sólo deja de publicar
solo, y el botón de publicar a mano sigue igual.

También `python supabase/reloj.py [ver|apagar|encender]`.

Existe porque un sistema que publica sin que nadie apriete nada necesita
un freno que cualquiera pueda alcanzar. Si el día que algo sale mal hay
que buscar a quien sepa SQL, el freno no existe.

El reloj se identifica con un secreto propio (`CRON_SECRETO`) que vive en
las variables del servidor, porque no tiene sesión de nadie.
