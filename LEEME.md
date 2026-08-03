# CABINA
### Departamento de Diseño y Medios · IBERO Tijuana

Sistema de gestión para parrilla de contenido e inventario de equipo.

---

## Cómo abrirla

Doble clic en **`CABINA.bat`**.

Se abre una ventana negra (el servidor) y el navegador con la aplicación.
**No cierres la ventana negra** mientras la estés usando — es lo que la mantiene viva.

Para cerrar: cierra la ventana negra, o presiona `Ctrl+C` dentro de ella.

Si el navegador no abre solo, entra a `http://localhost:8770`.

---

## Dónde viven tus datos

Todo se guarda en la carpeta **`datos/`**, en archivos de texto legibles:

| Archivo | Qué contiene |
|---|---|
| `parrilla.json` | Piezas programadas y banco de ideas |
| `inventario.json` | Equipos, préstamos y bitácora de vuelos |
| `config.json` | Configuración del departamento |

**Se guarda solo.** No hay botón de "guardar todo": cada cambio se escribe medio
segundo después de que lo haces. Arriba a la derecha ves la hora del último guardado.

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
CABINA vuelve a ese momento — no importa si fueron veinte cambios atrás. El paso
actual va marcado en rojo; los que quedaron adelante (deshechos) aparecen
atenuados y puedes volver a ellos.

Se conservan los últimos 60 cambios. **El historial es de la sesión**: al cerrar
CABINA arranca de nuevo. Para eso están los respaldos de disco.

### Respaldos

Cada vez que se guarda algo, se copia la versión anterior a `datos/respaldos/`.
Se conservan los últimos 30 respaldos de cada archivo. Si algo sale mal y ya
cerraste CABINA, ahí está la versión previa: los archivos llevan fecha y hora en
el nombre, así que basta con copiar el que quieras encima de `datos/parrilla.json`
con CABINA cerrada.

Para respaldar todo: **copia la carpeta `datos/`** a OneDrive o a un disco externo.
Eso es todo lo que necesitas guardar.

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

Si CABINA no reconoció vocabulario claro, la tarjeta lleva un **?** ámbar: la
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

Si sueltas en un día inválido no pasa nada y CABINA te dice por qué.

Para subir la miniatura: abre la pieza y usa **Imagen de referencia**. Las
imágenes se guardan en `datos/miniaturas/` (máximo 12 MB cada una).

---

## Los dos automatismos

Corren en tu máquina. Sin internet, sin costo, y con el mismo resultado cada
vez que los usas.

### Capturar y clasificar

En el banco de ideas. Describes la idea en tus palabras y CABINA propone
título, pilar, formato y canales. Funciona reconociendo el vocabulario propio
de cada pilar: *POV*, *parcial* o *cafetería* apuntan a Vida IBERO; *egresado*
o *investigación* a Orgullo; *convocatoria* o *beca* a Sé IBERO; *taller* o
*exposición* a Cultura; *jesuita* o *comunidad* a Voz.

Te dice con qué confianza clasificó — **alta**, **media** o **baja** — y por
qué. Es una sugerencia: tú confirmas o corriges antes de guardar.

### Ventana válida de publicación

Cada pieza puede llevar dos límites: **no antes de** y **no después de**. Es lo
que evita que una cobertura salga antes del evento.

CABINA los propone sola cuando escribes la fecha en el texto. Si capturas
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

El copy no se genera dentro de CABINA: se trabaja en sesión con Claude, donde
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

- Corre con **Python 3.12**. El núcleo usa solo la biblioteca estándar; el
  asistente de IA necesita el SDK oficial (`pip install anthropic`, ya instalado).
  Si ese paquete faltara, CABINA arranca igual y solo oculta la IA.
- Solo escucha en `127.0.0.1` — nadie fuera de esta computadora puede entrar.
- Los datos son JSON plano y cada registro tiene un identificador único, para que
  el día que se integre con el CRM de Sergio la migración sea directa.
- Puerto: `8770`. Se cambia en `servidor.py`, en la variable `PUERTO`.
