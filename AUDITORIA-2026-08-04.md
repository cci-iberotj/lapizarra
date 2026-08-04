# LA PIZARRA — Informe de revisión

**82 hallazgos verificados uno por uno contra el código.** Están ordenados por cuánto estorban el trabajo real de tres personas, no por qué tan feo suena el defecto. Al final hay una sección de lo que está bien y no conviene tocar.

Dos avisos antes de empezar:

- Varios hallazgos que llegaron como "graves" bajaron de nivel al verificarlos, y algunos títulos originales eran directamente falsos. Aquí ya están corregidos.
- Hay tres arreglos que, hechos primero, apagan solos a otros seis. Están marcados con **↓**.

---

## 1. Lo que hay que arreglar antes que nada

### 1.1 Deshacer borra de la base el trabajo de Marysol y de Sergio ↓
**Grave · el parche es de minutos, el arreglo bueno de días**

El historial guarda fotos completas de las cuatro colecciones. La sincronización (cada 20 s) mete el trabajo ajeno directo en `datos` y actualiza la copia de referencia, pero **no empuja un paso al historial**. Entonces la foto que Ctrl+Z restaura es anterior a lo que trajo tu compañera. Al restaurarla, `guardar()` compara contra la copia, no encuentra la nota de Marysol, y emite `borrarRegistro`: la marca `borrado:true` **en Supabase, para los tres**.

Por qué importa aquí: no es un caso raro, es el modo normal. Marysol captura un tema, veinte segundos después le llega a Leo, Leo deshace un movimiento suyo cualquiera y el tema desaparece. El único mensaje que sale es «Deshecho: …» refiriéndose a otra cosa. La acción de seguridad es la que destruye.

El panel de Historial multiplica el alcance: cada renglón salta directo a ese punto sin confirmar, y el primero es «Estado al abrir LA PIZARRA». No son minutos de trabajo ajeno los que puede borrar, son horas.

**Qué haría falta:**
- *Ahora (minutos):* dentro del `if (entraron)` de `arrancarSincronizacion`, invalidar el historial — reiniciar la pila a un solo paso «Estado tras traer cambios del equipo». Tapa el sangrado completo.
- *Después (días):* que el historial deje de ser fotos globales y sea operaciones por registro, para que deshacer sólo reescriba los ids que esa operación tocó.
- *Complemento barato:* confirmar cuando el salto del panel sea de más de un paso, diciendo el número.

**Atenuante útil de saber:** el borrado es lógico, no físico. La fila sigue en Postgres con `borrado:true` y se puede resucitar desde el editor SQL de Supabase. Si esto ya pasó y algo se perdió, no está perdido.

### 1.2 El modal edita el registro real; "Descartar" no descarta nada ↓
**Grave · horas**

`modalCtx.datos` **no es una copia**: es el mismo objeto que vive en `datos.parrilla.piezas`. `leerPieza()` asigna los 13 campos al objeto vivo y *hasta después* valida. Si la validación falla, el registro ya quedó mutado. Luego el sistema pregunta «¿Descartar los cambios?» y `cerrarModal()` no revierte absolutamente nada.

Se reproduce en 20 segundos: abre una pieza existente, muévele la fecha fuera de su ventana válida, pulsa Guardar (sale el aviso), pulsa Cancelar y acepta descartar. La pieza en pantalla ya cambió. No se persiste en ese instante — viaja a Supabase con el siguiente guardado de cualquier otra acción, que es lo que lo vuelve indiagnosticable.

Mismo patrón en las seis fichas (evento, equipo, experto, tema, vuelo).

El caso de la imagen es el más caro para Leo: **«Quitar imagen» escribe sobre la pieza viva y ni siquiera cuenta como cambio sin guardar** — la huella del formulario sólo lee inputs, y la imagen no vive en ningún campo. Pulsas Quitar para ver cómo se ve sin miniatura, cierras con Escape, y no te pregunta nada. La miniatura se pierde de verdad media hora después, cuando arrastras cualquier otra pieza. Y al subir, el aviso dice «Se guarda al guardar la pieza», que para una pieza existente es literalmente falso.

**Qué haría falta:** en las funciones `abrir*()`, trabajar sobre una copia (`structuredClone`) y guardar aparte la referencia original; en `guardarModal()`, volcar la copia sobre la referencia sólo después de validar OK. Cuidado con `esNuevo`, que hoy hace el `push` dentro de `leerPieza()`.

**Esto resuelve tres hallazgos de un golpe:** la mutación al fallar validación, el borrado de imagen silencioso y el "descartar" que no descarta al subir imagen.

### 1.3 El sistema anuncia tus propios cambios como si fueran de tus compañeros
**Medio · minutos**

`cambiosDesde()` pide todo lo que tenga `actualizado` mayor que la última sincronización, y `guardar()` nunca adelanta esa marca. Resultado: **lo que acabas de escribir tú entra en la siguiente consulta** y sale «Entraron N cambios de tu equipo». Una vez por guardado, siempre.

Por qué importa aquí: es la única señal que tiene el sistema para decir «alguien más tocó esto». Está permanentemente en falso. A la tercera vez dejas de leerla, y el día que Sergio de verdad mueva algo, el aviso ya no significa nada.

**Qué haría falta:** el campo `actor` ya se escribe en cada fila y nadie lo consulta. Pedirlo en `cambiosDesde()` y descartar en `sincronizar()` las filas cuyo actor sea el usuario en sesión.

**No hagas la otra solución que parece más fácil** (adelantar `ultimaSync` al terminar de guardar): se comería los cambios ajenos que caigan en esa misma ventana.

---

## 2. Lo que estorba todos los días

### 2.1 El sistema cobra caro un dato y luego regaña por no dártelo
**Medio · horas**

No existe «marcar publicado» en ningún lado. El único camino es abrir la ficha, desplegar el select Estado, elegir y guardar: cuatro clics más el repintado completo al cerrar. Con la meta de 3-4 piezas por semana son ~64 clics mensuales de pura contabilidad. Mientras tanto la auditoría levanta «N piezas con fecha vencida sin publicar» y el escritorio abre con el regaño.

El bucle está cerrado: la app cobra caro un dato del que después depende su propio diagnóstico, y el propio texto de la auditoría lo dice — «si se quedan ahí, el diagnóstico deja de ser confiable».

**Qué haría falta:** un botón «✓» en la tarjeta del calendario y en las del escritorio que ponga `estado='publicado'`, guarde y registre. Un clic. Complemento de un minuto: «marcar todas las de hoy» para el cierre del día. (En notas ya existe ese camino vía `avanzarNota`; falta para todo lo demás.)

### 2.2 El gesto central — idea → pieza en el calendario — está roto en tres puntos distintos

**a) Filtrar el banco por pilar mata el arrastre. Medio · minutos.** `pintarIdeas()` reescribe el HTML y sólo reengancha los botones; quien engancha el arrastre es `conectarArrastreDeIdeas()`, que sólo se llama desde `refrescarParrilla()`. Filtras por «Academia» — que es justo lo que haces *antes* de arrastrar — y ninguna tarjeta responde. El `draggable` sigue puesto, así que la tarjeta se levanta y no pasa nada. Se recupera sola al provocar un refresco completo, lo que lo hace parecer intermitente. **Una línea al final de `pintarIdeas()`.** De todo el lote, es el arreglo que más devuelve por minuto invertido.

**b) La pieza programada nace en estado 'idea' y por eso no aparece en Mi escritorio. Medio · minutos.** Las tres rutas de promoción («Programar», arrastre, «Acomodar pendientes») dejan `estado:'idea'`, y `loMio()` excluye explícitamente ese estado. Programas seis piezas el lunes, te asignas cuatro, abres Mi escritorio y lees «Nada pendiente de tu lado». Arreglo: pasar `estado:'brief'` en el prellenado. Ojo: las de «Acomodar pendientes» nacen además con responsable vacío, así que a ésas el cambio de una palabra no las rescata.

**c) Dos relojes independientes: la pieza nueva usa el que no se ve. Medio · horas.** El calendario se mueve con `anclaMes`; la cabecera de semana y **la fecha por defecto de una pieza nueva** con `anclaSemana`. Navegas a octubre, pulsas «Programar» sobre una idea, guardas, y la pieza aterriza en agosto. Nada dice dónde cayó. Sólo caen en la trampa el botón «Programar» del banco y «+ Nueva pieza» — el «+» de la celda y el arrastre sí pasan la fecha correcta. Arreglo: derivar un ancla del otro en los handlers, dos líneas en cada uno.

### 2.3 El módulo de auditoría no es confiable, y ya se sabe por qué
**Medio · horas**

Confirmado el mecanismo exacto de la caída 67 → ~30: **todo el diagnóstico está dentro del `else` de «no hay nada programado»**. Con la parrilla vacía sólo pueden dispararse dos hallazgos (22 + 11 = 33, de ahí el 67 de arranque). Al guardar la primera pieza se abre el `else` entero y entran de golpe seis o siete hallazgos que estaban tapados, con penalización aditiva y sin tope: el puntaje puede tocar 0.

**Corrección importante al remedio que parecía obvio:** de todo lo encerrado en el `else`, sólo la regla del directorio de expertos es realmente independiente de las piezas. Las demás se calculan *sobre* las piezas y, sacadas de ahí, dispararían con la parrilla vacía y hundirían también el estado inicial. **Mover llaves de sitio no arregla nada por sí solo.** Lo que arregla es el tope: máximo un hallazgo contable por categoría, o calcular sobre porcentaje de reglas cumplidas en vez de restar sin límite.

Dos cosas más del mismo módulo:
- **El color del veredicto está muerto.** El JS calcula verde / ocre / rojo y lo manda en línea; un `!important` en `.marcador-etiqueta` lo anula siempre y las tres etiquetas salen en gris. Los dos `!important` de ese bloque son innecesarios: esa regla ya gana la cascada por orden. *Minutos.*
- **Los eventos son invisibles para la auditoría.** `auditar()` no menciona los eventos en ninguna regla. Y el carril «Lo que hay que cubrir» sólo lista eventos futuros, así que un evento que no se cubrió sale de la lista al día siguiente sin dejar nada. (Corrección: el evento **no desaparece** — sigue en su celda del calendario y sigue siendo clickeable. Lo que falta es la red de seguridad.) *Horas.*

### 2.4 La mesa de redacción — el módulo compartido — no tiene marcha atrás
**Medio · horas**

`estado_nota` sólo se escribe en tres sitios y `avanzarNota` **sólo avanza**. El modal no muestra ni lee ese campo, no hay botón «←» ni arrastre entre columnas. Si Sergio pulsa «→» de más y la nota salta a «En el sitio» sin estar subida, no hay forma de regresarla. La única salida es Ctrl+Z en la misma sesión — que es justo lo que hay que arreglar en el punto 1.1.

Dos cosas más de la misma vista:
- **«Encargada» se pone al crear la nota, no al mandar el encargo.** El botón «Encargo» copia el texto al portapapeles y no cambia nada: no avanza estado, no sella fecha, no deja rastro. Con cuatro notas abiertas ya no sabes cuáles están de verdad en la cancha de Marysol. Falta un estado «por encargar» al frente, y que `generarEncargo` avance y selle la fecha al copiar. *~6 líneas.*
- **Los derivados (reel + post) se ofrecen cuando la nota aún no existe, y sólo una vez.** El `confirm` sale al crear, cuando la nota está en 'encargada' y nadie escribió una línea. Lo racional es decir que no — y al decir que no se pierde la función para siempre, porque `ofrecerDerivados` no está enganchada a nada más. Lo que se pierde al declinar es más de lo que parece: esos derivados copian pilar, canales, responsable, experto, fecha y producción de la nota. Debería ofrecerse al entrar en 'borrador' («texto terminado, falta armar el post y el reel»), que es el momento real. *Horas.*

Aparte: el tablero nunca se vacía. La columna «Difundida» retiene todo lo cerrado desde siempre, sin filtro ni periodo. El patrón a copiar (`#periodoAuditoria`) ya existe. *Minutos.*

---

## 3. Lo que muerde cada tanto, pero muerde fuerte

### 3.1 Inventario: el rastro del equipo físico
- **Cancelar la segunda pregunta no cancela el préstamo.** El primer prompt respeta la cancelación; el segundo no: `regreso || ''` convierte el `null` en cadena vacía y el préstamo se ejecuta igual sobre toda la selección. **`if (regreso === null) return;` — una línea, sin contraargumento.**
- **La fecha entra sin validar y luego se compara como texto.** Escribe «15/08/2026» y el préstamo aparece vencido desde el primer segundo (la comparación es lexicográfica); escribe «viernes» y no vencerá nunca. El prompt viene precargado con una fecha correcta, así que el riesgo es menor de lo que suena, pero validar con una expresión regular son minutos. La ficha de equipo ya usa un `<input type="date">`: ése es el arreglo de fondo.
- **La selección sobrevive al cambio de filtro.** Marcas todas las cámaras, cambias el filtro a Audio, marcas dos micrófonos y das salida: salen también las cámaras que ya no ves. Vaciar la selección al cambiar filtro es un renglón por listener. (Atenuantes: el prompt anuncia el número exacto y Ctrl+Z lo revierte entero.)
- **Prestar es en lote, devolver es de uno en uno.** El kit completo de una cobertura sale en un gesto y regresa en ocho clics, cada uno con repintado e auditoría. La asimetría empuja a no registrar el regreso. Falta un `prestamo_id` de lote. Y `prestamos_historial` **se escribe religiosamente, se persiste en Supabase y no se pinta en ninguna pantalla** — mismo patrón que el `origen` ya conocido.

### 3.2 Cuando algo falla, la aplicación miente en la dirección que asusta
- **Si la carga falla, la app dice «no hay nada» en vez de «no pude leer».** El catch muestra un aviso que se autodestruye en 2.4 s y sigue: «El banco está vacío», «Todavía no hay equipo registrado». Un lunes con mala conexión, Marysol ve todo en cero y concluye que alguien borró todo. **Efecto colateral peor, que nadie había visto:** tras una carga fallida `ultimaSync` tampoco se asigna, y `sincronizar()` sale de inmediato — **la sesión queda mudamente desconectada del equipo hasta que alguien recargue la página.** Hace falta una bandera + banda fija con botón Reintentar. *Horas.* (Buena noticia: no hay peligro de que escribas encima y borres en la nube; la copia de referencia queda vacía y el bucle de borrado no recorre nada.)
- **Cerrar la pestaña con el modal lleno no avisa nada.** El guardián de salida sólo mira los guardados que *ya* fallaron. El caso frecuente —copy escrito a mano, sin pulsar Guardar— no está cubierto, y las dos funciones que lo detectan están escritas treinta líneas más abajo. **Es literalmente una línea:** `if (!sinGuardar.size && !hayCambiosSinGuardar() && !hayGuardadoEnVuelo()) return;`
- **Cuando caduca la sesión, el campo de contraseña se borra solo cada minuto.** `salirDeVerdad()` no limpia los reintentos, así que cada 60 s se vuelve a intentar guardar, vuelve a fallar, vuelve a llamar a `salirDeVerdad()` y vacía `#entrarClave` con el foco saltando a media palabra. Arreglo: limpiar `relojReintento` y `sinGuardar` al salir, y no repintar la puerta si ya está visible. *Minutos.*
- **«No se puede deshacer» y «Puedes deshacerlo con Ctrl+Z» salen de la misma función**, con doce líneas de diferencia. La segunda es la verdadera. Un confirm que miente se aprende a saltar. Texto correcto: «Podrás recuperarla con Ctrl+Z mientras no cierres la sesión» (60 pasos, se pierde al recargar). *Una cadena.*
- **El ✕ del banco de ideas es el único borrado del producto que no dice nada** — sin confirmar y sin aviso, pegado a «Programar» con 30 px de lado. Sí registra en el historial, así que Ctrl+Z lo devuelve; el problema es que nada en pantalla lo dice. `avisar('Idea borrada. Ctrl+Z la devuelve.')` cierra el hueco casi entero. *Una línea.*

### 3.3 Eventos y efemérides: se cierran solos
- **Una efeméride se marca «✓ cubierta» por cualquier pieza que caiga ese día.** Sin comprobar pilar ni título. Un meme programado el 16 de noviembre marca «Mártires de la UCA» como resuelto, y la tarjeta se ve idéntica a una cubierta de verdad. Con la regla de una pieza por día, basta una. Arreglo: exigir coincidencia de pilar o usar `detectarEfemeride()`, que ya está escrita. *Minutos.*
- **La cobertura de un evento nace en pilar «Vida IBERO»**, que es carril casual, porque `coberturaDeEvento` no pasa pilar. La ceremonia de graduación y el informe anual entran como contenido casual, y después la auditoría castiga la semana por «sin nada institucional». Atenuante real: el modal se abre antes de guardar y muestra el select con su carril rotulado, así que es un mal valor por omisión, no una clasificación a espaldas de nadie. *Horas.*
- **«Programar la cobertura» sólo existe si cierras el evento y lo vuelves a abrir** (el botón está dentro del `${existente ? ... : ''}`). Incoherente con el propio producto, que al guardar una nota sí encadena los derivados en el acto. *Cuatro líneas.*

### 3.4 Una regla que sólo se aplica en uno de cuatro caminos
El veto «una pieza por día» vive únicamente en el arrastre de piezas. El «+» de la celda, el modal, el arrastre de ideas y la cadena de derivados la ignoran — y `ofrecerDerivados` **crea el post de Facebook a +0 días, encima de la nota, por diseño**. Eso sugiere que la regla nunca fue una invariante del producto sino una heurística del arrastre.

**Esto es decisión tuya, no bug:** o la regla vale (y hay que comprobarla en las cuatro vías, con aviso no bloqueante) o no vale (y hay que degradar el veto del arrastre a sugerencia). Lo que no puede quedarse es a medias, porque enseña que los mensajes del sistema no describen el sistema.

---

## 4. Oficio visual — lo que tú vas a ver y nadie más va a saber nombrar

### 4.1 Regresiones de cascada: tres piezas perdieron su color o su relieve. *Minutos, y son las que más devuelven.*
- **Las efemérides perdieron su código de color.** `.efemeride` declara `border-top: 3px solid var(--tono)` y una regla posterior declara el atajo `border: 1px solid ...`, que lo borra. `app.js` sigue inyectando la variable `--tono` en cada ficha y ya no la lee nadie. Arreglo: separar el atajo del `border-top`.
- **Cada ficha de experto lleva una franja gris de 3px arriba** que parece error de maquetación: la lista de bisel declara `border-color` y le quita el color de pilar dejando el grosor. (Impacto visual moderado: el gris sutil sobre la capa clara apenas se distingue.)
- **El panel de Historial se quedó sin sombra.** Bajó a `--elev-1` con la lista de bisel y nunca se restauró; el modal sí se restauró, el panel no. Es un panel flotante con una sombra de 1 px al 5 %: no despega.

### 4.2 Cosas de una línea
- **Toda pieza se rotula «Post» en la vista lista**, incluidas las Notas: el sello está escrito como literal, y a dos centímetros la misma tarjeta ya imprime el formato real. Lo más limpio es borrar el span.
- **Las pestañas engordan al activarse** (500 → 600), justo lo que el comentario de al lado dice que no debe pasar. Con Iberoamericana el salto es mayor porque no hay 600 y el navegador cae al 700. Borrar una declaración.
- **El título del panel de Historial es el único h3 de toda la aplicación que cae en la regla base** — versalitas de 11 px — mientras todos los demás títulos de panel van a 20 px. Como gobierna exactamente un elemento, lo más limpio es invertir la regla base directamente.
- **Los títulos largos se cortan a media letra sin puntos suspensivos** en `.pieza` (tiene `overflow:hidden` y el título no tiene line-clamp), cuando `.cal-titulo` siete líneas más arriba ya lo hace bien. En todo el CSS no hay ni una regla de `text-wrap`, `overflow-wrap` ni `hyphens`: cuatro reglas con `:where()` arreglan viudas, cortes y desbordes de golpe.

### 4.3 El anillo de foco está anulado justo donde más importa. *Medio · minutos.*
La regla global de foco usa `:where()` (especificidad cero) y `.campo:focus` la gana declarando `outline: none`, sustituyéndola por un halo de `--marca-velo` que da **1.18:1** — no se ve. Lo único que queda es el cambio de borde de 1 px, que da 2.56:1, por debajo del 3:1 que pide la norma. Hay además una tercera regla muerta más arriba: el archivo intenta tres cosas y gana la más débil.

Éste es el único hallazgo de accesibilidad que muerde hoy, a un usuario vidente, tabulando por el modal de pieza mientras captura. Arreglo: borrar el `outline: none`, borrar la regla muerta, dejar el halo como refuerzo.

(El foco de la barra superior da 1.4:1 sobre el rojo. El token que lo arregla —`--foco-halo`— **ya está declarado en los dos temas, medido, y no se usa en ninguna regla del archivo**. Es deuda de conexión, no de decisión. Prioridad preventiva: entra cuando entre la agencia.)

### 4.4 El marcador de auditoría dibuja dos donas concéntricas
Un `::after` viejo y un `.marcador-centro` nuevo resuelven el mismo hueco a la vez: queda un aro de ~5 px de otro tono entre el barrido y la cifra. En claro casi no se nota; en oscuro sí. **Ojo antes de aplicar:** borrar el bloque viejo no es neutro — hoy el `::after` recorta el barrido a 11 px en vez de los 16 que implicaría el centro al 76 %. Cambia la proporción de la dona; hay que verlo en pantalla.

### 4.5 Tipografía y sistema — el trabajo de días
- **La escala sigue siendo una meseta.** 151 de 169 declaraciones de `font-size` (89 %) viven entre 11 y 15 px. El defecto concreto no es «la escala entera»: son **cuatro tokens formando dos parejas separadas por 1 px** (sello 11 / meta 12, cuerpo 14 / guía 15) que se usan **en el mismo objeto** — dentro de una `.pieza` conviven título 15, meta 12 y chip 11. Eso no se lee como jerarquía, se lee como descuido. Fusionar esas dos parejas y subir el título de tarjeta a 18 px son **seis líneas del `:root`**, no rehacer las 169 declaraciones. Rehacer la escala completa arriesga descuadrar el trabajo de contraste y responsivo que ya está cerrado.
- **Las dos cifras del bloque de progreso.** El anillo va a 34 px y la racha a 38. El argumento no es que difieran 4 px: es que **la métrica secundaria es más grande que la métrica héroe**, al revés de lo que quiere el bloque. Y el sello que distingue publicación de evento en el calendario va a 9.5 px, por debajo del escalón más pequeño de la escala — es justo la meseta que el rediseño vino a eliminar.
- **No hay canalón de página único.** La marca empieza en x=28, la Parrilla en x=46, las demás vistas en x=324 (a 1920 px). Corrección al hallazgo original: el salto sólo existe por encima de 1400 px, y una cabecera a sangre desfasada del contenido es patrón normal. Lo que sí falta es el token: `--gutter: clamp(24px, 2.4vw, 56px)` en la barra y en todas las vistas, y mover el `max-width` de la vista a los párrafos, medido en `ch`.
- **Ocho interletras distintas para el mismo rol de versalitas** (.03 a .11em). Y la regla que iba a unificarlas no alcanza a las tarjetas de dato del Inventario por especificidad, así que esos cuatro rótulos pesan más que todo lo demás sin motivo. Un token y una búsqueda-reemplazo. *(La idea de usar `font-variant-caps` real hay que dejarla para después: no se puede verificar desde el repositorio si el proyecto de Adobe trae `smcp` para Alverata, y si no lo trae el navegador las sintetiza y queda peor.)*
- **Diez implementaciones de la misma etiqueta pequeña redondeada**, con ocho rellenos y tres radios distintos, y ninguna comparte modificador de color: **son diez sitios donde volver a equivocarse con el contraste** que ya se corrigió uno por uno. Ése es el argumento sólido, no la desalineación visual. Un componente `.etiqueta` con tres modificadores, migrable módulo a módulo. *Días.*
- **Espaciado sin sistema:** 92 gaps y 90 paddings literales contra 25 y 27 con token; once tarjetas del mismo rango con once rellenos distintos. La única pareja donde se ve de verdad es `.semana-nav` junto a `.balance` en la misma fila. Higiene de sistema. Borrar los cuatro tokens muertos (`--e-1`, `--e-bloque`, `--e-seccion`, `--alto-fila`) son minutos.
- **El orden de carga invierte la prioridad tipográfica declarada.** Se precargan con prioridad alta los dos woff2 de **Iberoamericana**, que es la fuente de respaldo, mientras la hoja de Adobe no se pide hasta que el analizador llega a `config.js`, al final del body. La página pinta completa en la fuente equivocada y recompone en Alverata. Arreglo casi gratis: quitar los dos preload y añadir `preconnect` + `preload as=style` a Typekit en el `<head>`. El `size-adjust` para que el respaldo no mueva la maqueta exige medir Alverata primero y es la parte cara.
- **Los iconos son doce glifos sueltos de seis bloques Unicode.** Verificado con fontTools: de los quince símbolos que usa la aplicación, la fuente de la casa **sólo tiene ‹, › y ×**. Los otros doce salen de la fuente del sistema operativo — no comparten peso ni línea de base y cambian de dibujo según la máquina. `⧖` (símbolos matemáticos) es el más frágil: si el sistema no lo tiene, sale una caja vacía. *Medida de emergencia hoy (minutos):* sustituir `⧖` por algo universal y añadir el selector de presentación de texto a `⚠ ⚙ ☀`. *Set propio de `<symbol>` SVG en línea: días, y no lo resuelve Adobe — Alverata tampoco trae esos glifos.*

---

## 5. Lo que se está construyendo para cuando entren más manos

No urge hoy con tres personas, pero cada contratación lo vuelve más caro:

- **Dos personas en la misma pieza: gana quien guarda al último, sin aviso ni marca.** Y el latido se suspende mientras hay un modal abierto, así que si tienes la ficha veinte minutos escribiendo copy, mandas el objeto entero como estaba al abrirlo. El flujo de una nota está diseñado para pasar por tres manos sobre **el mismo registro**. La parte barata vale ya y es de horas: **mostrar en la ficha quién la tocó al último y cuándo** — `actor` y `actualizado` ya se escriben en la tabla y hoy nadie los lee. La detección de conflicto con relectura previa es lo caro; puede esperar a la agencia.
- **La marca de tiempo la pone el reloj de quien escribe, no la base.** La columna tiene `default now()` pero el cliente siempre manda su valor, así que el default nunca aplica. Si una máquina va adelantada, una sola fila con marca futura **envenena a los tres de forma persistente**: cada arranque vuelve a fijar el corte en esa marca hasta que el tiempo real la alcance. Requiere un reloj desfasado para dispararse (las tres máquinas son Windows con NTP), pero el arreglo es quitar el campo del cuerpo y dejar que Postgres lo ponga.
- **Ninguna tarjeta se puede abrir sin ratón** (son divs con onclick, sin tabindex ni keydown), no hay `<h1>`, y el `role="tablist"` del conmutador Calendario/Lista está declarado con cero pestañas — eso último se arregla **borrando una palabra**, y es peor que no haberlo puesto. `aria-current` en el bucle que ya intercambia clases es el otro cambio que vale. Rehacer las siete pestañas como patrón tab/tabpanel es trabajo de horas sin beneficio para este equipo.
- **Ninguna petición tiene tiempo límite.** Un fetch que ni resuelve ni rechaza deja el guardado marcado como "en vuelo" y el latido devuelve sin hacer nada. Poco común en Chrome sobre Windows. El cinturón barato son cinco líneas: caducar la entrada a los 60 s.
- **El historial guarda 60 clones del conjunto completo, imágenes base64 incluidas.** Los números que circulaban estaban inflados — el horizonte realista (~200 piezas al año, no todas ilustradas) da ~400-500 MB con la pila llena, pesado pero lejos de tumbar la pestaña. **El 90 % del beneficio está en una línea: bajar `historial.max` a 15-20.** Sacar las miniaturas a Supabase Storage es correcto pero es otro proyecto.
- **Ajustes se traga cualquier error al leer las cuentas** y no deja ni una línea en consola (en 4400 líneas hay un solo `console.error`). Cuando falle —es una Edge Function detrás de CORS— no habrá nada que diga por qué. Un `console.error` y mostrar el mensaje real. *Minutos.*
- **En Ajustes, lo escrito en el reparto de la mesa de redacción se pierde al cambiar de pestaña.** Guardar en `change` como ya hacen los selectores de rol de esa misma pantalla. Daño chico: tres nombres cortos.

---

## 6. Lo que está bien — no lo toques

Esto no es cortesía; es la lista de lo que *no* hay que meterle mano al arreglar lo de arriba.

**La arquitectura de datos.** La capa persiste por registro, no por colección: dos personas guardando a la vez no se pisan colecciones enteras. Ese fue el cambio correcto. Y el borrado es lógico (`borrado:true`), lo que significa que **nada de lo que se ha "perdido" está realmente perdido** — sigue en Postgres.

**El manejo de fallo de guardado, que está mejor de lo que aparenta.** Cuando un guardado revienta: sale un aviso flotante, la colección entra en la cola de pendientes, se arma un reintento con espera creciente, el indicador se queda fijo en «No se pudo guardar» y hay un `beforeunload` que impide cerrar la pestaña. **Tres canales independientes.** Varios hallazgos afirmaban «se pierde trabajo sin que nadie lo note» y eso no puede pasar por esta vía.

**Las guardas del latido de sincronización.** Se salta la ronda si hay un modal abierto o un guardado en vuelo. Es una decisión correcta y es lo que hace que varios de los defectos de arriba sean estrechos en vez de constantes.

**El clasificador de texto.** `clasificarTexto()` devuelve pilar, formato, canales, ventana de fechas **y además confianza con su explicación en castellano**, y `detectarEfemeride()` funciona. La tarjeta del banco ya marca la confianza baja con «?» y su explicación. Sólo falta pasar `razon` y `confianza` al modal en las rutas de «Programar» y arrastre — cuatro líneas repetidas dos veces.

**`ofrecerDerivados` y `acomodarPendientes`.** Los derivados copian pilar, canales, responsable, experto, fecha y producción — hacen exactamente lo que hay que hacer. Y `acomodarPendientes` respeta las ventanas de fecha y la ocupación de días. Está bien pensado; el problema es *cuándo* se ofrece, no *qué* hace.

**El manejo de foco del modal.** `focoPrevio` + `atraparFoco` es el patrón correcto y está escrito. Falla sólo porque las tarjetas que lo disparan no son enfocables; se cura solo cuando lo sean.

**El aviso flotante.** Sí tiene `role="status"` y `aria-live="polite"`, sí está por encima del velo del modal, y visualmente es una píldora fija con sombra y animación que se ve perfectamente. Varios hallazgos lo daban por roto y no lo está.

**El sistema de tokens, como decisión.** Los tokens de color están medidos contra su fondo real y documentados con sus ratios en el propio archivo. `--marca-velo` está bien calculado *para relleno* (8.60 detrás de texto guinda); el error es usarlo también como trazo. La cabecera del archivo razona bien y los cortes responsivos están justificados por escrito. Lo que falta es cablear y colapsar duplicados, no repensar.

**Y lo ya cerrado, que sigue cerrado:** cero fallas de contraste en ambos temas, responsivo de 320 a 1975 px sin desborde, la sincronización que se moría en silencio, la subida de imagen en la nube, «Programar» una idea sin guardar, las colisiones de clase, el descuadre del modal.

---

## 7. Orden sugerido

**Esta semana (todo son minutos, todo se puede verificar solo):**
1. Invalidar el historial al sincronizar — tapa el sangrado de 1.1.
2. `conectarArrastreDeIdeas()` al final de `pintarIdeas()`.
3. `if (regreso === null) return;` en el préstamo.
4. La condición del `beforeunload`.
5. Filtrar por `actor` en la sincronización.
6. Los dos `!important` del marcador; las tres regresiones de cascada; el sello «Post»; el peso de las pestañas; el `outline: none` de los campos; el h3 del historial; el texto del confirm de borrado; el aviso del ✕ de ideas.
7. Limpiar reintentos al cerrar sesión.

**Este mes (horas):**
8. Modal sobre copia — cierra 1.2 y los dos hallazgos de imagen.
9. Botón «✓ publicado» en tarjeta y escritorio.
10. `estado: 'brief'` al promover + derivar las dos anclas de fecha.
11. Select de `estado_nota` en la ficha + «←» en el tablero.
12. Tope por categoría en el puntaje de auditoría.
13. Banda de error persistente con Reintentar en la carga fallida.
14. Mostrar último `actor` y `actualizado` en la ficha.
15. `historial.max` a 15-20.

**Cuando haya un bloque de tiempo (días):**
16. Historial por operación en vez de fotos globales.
17. Fusionar las dos parejas de tokens tipográficos y subir el título de tarjeta.
18. Token `--gutter` y canalón único.
19. Componente `.etiqueta` único.
20. Set propio de iconos SVG.

**Una decisión que no es técnica y hay que tomar antes de escribir código:** si «una pieza por día» es una regla del producto o una sugerencia del arrastre. Todo lo demás del punto 3.4 depende de esa respuesta.