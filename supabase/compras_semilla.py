"""
LA PIZARRA - Contenido inicial del tablero de necesidades de equipo

    python supabase/compras_semilla.py precios.json   -> escribe datos/compras_semilla.sql
    python supabase/correr.py datos/compras_semilla.sql

El código del tablero vive en datos/compras_codigo.txt (fuera de git).
La liga para los jefes es  https://cci-iberotj.github.io/lapizarra/equipo/#CODIGO

Crea el tablero (si no existe) y carga las necesidades. Es para la
PRIMERA carga: si una necesidad ya existe, sólo le actualiza los
precios de las opciones y no toca lo que los jefes ya eligieron,
aprobaron o comentaron.

precios.json: {"precios": {"<clave>": [{"precio_mxn":..,"tienda":..,"url":..}]}}
Lo que no tenga precio verificado se queda con el estimado y la marca
«estimado» en la página.
"""

import json
import os
import sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(os.path.dirname(RAIZ), "datos")
# El código abre el tablero sin cuenta: no puede vivir en el repositorio,
# que es público. Se genera una vez y se queda en datos/ (fuera de git).
ARCH_CODIGO = os.path.join(DATOS, "compras_codigo.txt")


def codigo():
    if os.path.exists(ARCH_CODIGO):
        return open(ARCH_CODIGO, encoding="utf-8").read().strip()
    import secrets
    c = "".join(secrets.choice("ABCDEFGHJKLMNPQRSTUVWXYZ23456789") for _ in range(8))
    with open(ARCH_CODIGO, "w", encoding="utf-8") as f:
        f.write(c)
    return c


def op(id_, nombre, detalle, clave, estimado, cantidad=1):
    return {"id": id_, "nombre": nombre, "detalle": detalle, "clave": clave,
            "precio": estimado, "cantidad": cantidad, "tienda": "", "url": "", "estimado": True}


NECESIDADES = [
  # ── Arreglos rápidos ──
  dict(id="hdmi", titulo="Cable HDMI para el monitor de campo", area="foto", prioridad="arreglo", orden=1,
       porque="El monitor Viltrox funciona, pero el cable corto que trae no. Con uno nuevo vuelve a servir.",
       riesgo="Se sigue grabando sin monitor externo: enfoque y encuadre a ojo en la pantallita de la cámara.",
       opciones=[op("o1", "Cable HDMI corto", "HDMI completo a HDMI completo, 30-50 cm.", "hdmi", 250)]),
  dict(id="extensiones", titulo="Extensiones y multicontactos", area="general", prioridad="arreglo", orden=2,
       porque="No hay una sola extensión en el área. Luces y cargadores dependen de dónde quede el enchufe.",
       riesgo="Montajes improvisados en auditorios y salones, o luces que no se pueden usar.",
       opciones=[op("o1", "2 extensiones de uso rudo + 2 multicontactos + cinta gaffer", "Lo básico para montar en cualquier salón.", "extensiones", 1200)]),
  dict(id="cargador_mavic", titulo="Cargador del control del Mavic Air", area="foto", prioridad="arreglo", orden=3,
       porque="El control del drone actual no tiene con qué cargarse.",
       riesgo="Si se aprueba un drone nuevo, este arreglo sobra.",
       opciones=[op("o1", "Cable y cargador USB", "Hay que revisar antes: puede bastar uno común.", None, 300),
                 op("o2", "No comprar", "Si entra el drone nuevo.", None, 0)]),
  dict(id="diag6d", titulo="Diagnóstico de la Canon 6D Mark II", area="foto", prioridad="arreglo", orden=4,
       porque="Falló al grabar video hace unos meses. Antes de gastar en repararla hay que saber qué tiene.",
       riesgo="Sigue ocupando lugar como cámara que nadie confía en usar.",
       opciones=[op("o1", "Diagnóstico en servicio técnico", "Con eso se decide si se repara o se da de baja. Canon y sus talleres cotizan hasta ver la cámara.", None, 800),
                 op("o2", "Darla de baja", "Sin gasto.", None, 0)]),

  # ── Urgente ──
  dict(id="camara2", titulo="Segunda cámara", area="foto", prioridad="urgente", orden=1,
       porque="Hoy toda la producción depende de una sola cámara, la Sony A7 IV. Una segunda permite entrevistas a dos ángulos y cubrir dos cosas a la vez.",
       riesgo="Si la A7 IV falla o está ocupada, no hay con qué cubrir un evento.",
       opciones=[op("a6700", "Sony A6700 (solo cuerpo)", "Misma batería y color que la A7 IV. Aprovecha el lente 18-105 y convierte el 85 en close-up. Más barata y más ligera.", "a6700", 30000),
                 op("a7iv", "Sony A7 IV idéntica (solo cuerpo)", "Mismo menú y color, todo intercambiable. Es una cámara principal completa para un futuro fotógrafo.", "a7iv", 47000)]),
  dict(id="baterias", titulo="Baterías y cargador para la Sony", area="foto", prioridad="urgente", orden=2,
       porque="Hay dos baterías y se cargan dentro de la cámara por USB: mientras carga, no se puede usar. Sirven también para la segunda cámara si es Sony.",
       riesgo="Un evento de día completo se queda sin batería a media cobertura.",
       opciones=[op("gen", "Kit de 2 baterías + cargador doble", "Marca de accesorios de calidad (SmallRig, Neewer o similar).", "npfz100_kit", 2500),
                 op("orig", "2 baterías Sony originales + cargador Sony", "Lo más confiable; cuesta el doble o más.", "orig_sony", 6000)]),
  dict(id="monitor", titulo="Monitor para la diseñadora", area="diseno", prioridad="urgente", orden=3,
       porque="La computadora asignada ya está. Los monitores de oficina no muestran el color real: lo que se diseñe saldría distinto impreso y en redes.",
       riesgo="La diseñadora trabaja a ciegas en color, y las correcciones regresan a Leo.",
       opciones=[op("pa278", "Asus ProArt PA278CV (2K)", "El mismo que usa Leo. Calibrado de fábrica, cubre todo el color de web y redes.", "pa278cv", 9000),
                 op("pa279", "Asus ProArt PA279CRV (4K)", "La versión 4K de la misma línea (sucesor del PA279CV): más nitidez para tipografía fina y fotografía, y más gama de color.", "pa279crv", 11000)]),

  # ── Importante ──
  dict(id="drone", titulo="Drone del departamento", area="foto", prioridad="importante", orden=1,
       porque="El Mavic Air es de 2018, con una sola batería (unos 20 minutos de vuelo) y sin cargador del control. En la práctica, el área usa el drone personal de Leo. Todo drone de uso institucional se registra ante la AFAC.",
       riesgo="Si Leo no puede prestar el suyo, no hay tomas aéreas.",
       opciones=[op("mini5", "DJI Mini 5 Pro (combo con baterías)", "El de todos los días. Menos de 250 g, sensor de 1\", graba vertical nativo para reels.", "mini5pro", 22000),
                 op("air3s", "DJI Air 3S (combo con baterías)", "Punto medio: sensor de 1\" más una segunda cámara con zoom 3x para tomas comprimidas del campus.", "air3s", 32000),
                 op("mavic4", "DJI Mavic 4 Pro (combo con baterías)", "Tope de gama, el sucesor del Mavic Pro. Para espectaculares y video institucional.", "mavic4pro", 55000),
                 op("avata2", "DJI Avata 2 · FPV (combo con goggles)", "Tomas inmersivas: atravesar pasillos, recorrer el campus en una sola toma. Trae protectores; aun así pide práctica.", "avata2", 25000),
                 op("avata360", "DJI Avata 360 · FPV (combo con goggles)", "FPV con cámara 360: se vuela una vez y el encuadre se decide en la edición.", "avata360", 28000)]),
  dict(id="discos", titulo="Discos para el material", area="general", prioridad="importante", orden=2,
       porque="El inventario no tiene ningún disco: el material crudo depende de la laptop y de las memorias.",
       riesgo="Si falla la laptop o se pierde una memoria, se pierde el material. No hay copia.",
       opciones=[op("dos", "SSD de 2 TB para trabajar + disco de 4 TB de respaldo", "SanDisk Extreme 2 TB para editar + Seagate Portable 4 TB para la copia de seguridad.", "ssd_hdd", 5500),
                 op("respaldo", "Solo el disco de respaldo de 4 TB", "Lo mínimo para que exista una copia.", "hdd4tb", 2200)]),
  dict(id="canon_mic", titulo="Micrófono de cañón", area="foto", prioridad="importante", orden=3,
       porque="Todo el audio depende del kit inalámbrico Lark M2. Un micrófono sobre la cámara capta el ambiente de los eventos y sirve de respaldo.",
       riesgo="Si fallan los Lark en una entrevista, no hay audio usable.",
       opciones=[op("go2", "Rode VideoMic GO II", "Ligero y sencillo. Para ambiente y respaldo.", "videomic_go2", 2000),
                 op("ntg", "Rode VideoMic NTG", "Mejor calidad; sirve también en caña para entrevistas.", "videomic_ntg", 5500),
                 op("b10", "Sony ECM-B10", "Se conecta directo a la zapata de la A7 IV, sin cables ni pilas.", "ecm_b10", 5000)]),
  dict(id="pedestales", titulo="Pedestales y caja de luz", area="foto", prioridad="importante", orden=4,
       porque="Hay 2 pedestales para 4 luces. Con dos más y una caja de luz se arma una entrevista con tres luces fuera del laboratorio.",
       riesgo="Las entrevistas de Academia dependen de la agenda del laboratorio de foto.",
       opciones=[op("o1", "2 pedestales de luz + caja de luz para la Godox SL100D", "Montura Bowens, 60-90 cm.", "pedestales_softbox", 3500)]),
  dict(id="mochila", titulo="Mochila y estuches", area="foto", prioridad="importante", orden=5,
       porque="No hay mochila ni estuches: el equipo se mueve suelto.",
       riesgo="Golpes y piezas perdidas en cada salida.",
       opciones=[op("o1", "Mochila de cámara + estuche para luces y pedestales", "Gama media: cámara, lentes y drone en una sola mochila.", "mochila_estuche", 4000)]),
  dict(id="nd", titulo="Filtro ND variable", area="foto", prioridad="importante", orden=6,
       porque="Para grabar con el 85 mm abierto bajo el sol de Tijuana sin quemar la imagen: es el look de las entrevistas en exterior.",
       riesgo="En exteriores hay que cerrar el diafragma y se pierde el fondo desenfocado.",
       opciones=[op("o1", "ND variable de 77 mm + aro adaptador 55-77", "Sirve para el 85 y, con el aro, para el 28-70.", "nd77", 2500)]),

  # ── Deseable ──
  dict(id="pocket", titulo="Osmo Pocket para las creadoras", area="contenido", prioridad="deseable", orden=1,
       porque="Camarita con estabilizador para las creadoras de la agencia: mejor imagen que el celular con poca luz y movimiento fluido. Cuando no la usan, sirve como tercera cámara en eventos.",
       riesgo="Es equipo de la universidad en manos de personal subcontratado: necesita resguardo firmado.",
       opciones=[op("p4", "DJI Osmo Pocket 4", "Sensor de 1\", 4K, graba vertical, sigue caras.", "pocket4", 11000),
                 op("p4p", "DJI Osmo Pocket 4P", "Agrega un segundo lente para retrato.", "pocket4p", 15000),
                 op("no", "No comprar: celular + Osmo Mobile 8", "Si las creadoras prefieren seguir con su teléfono.", None, 0)]),
  dict(id="ipad", titulo="iPad", area="general", prioridad="deseable", orden=2,
       porque="Hace funcionar el teleprompter que ya existe y le sirve a Diseño para bocetos. Dos usos en una compra.",
       riesgo="El teleprompter sigue guardado, o se usa con un iPad personal.",
       opciones=[op("o1", "iPad (modelo base, 128 GB)", "", "ipad", 8500)]),
  dict(id="tableta", titulo="Tableta gráfica", area="diseno", prioridad="deseable", orden=3,
       porque="Para ilustración y retoque fino. Depende de lo que traiga o pida la diseñadora.",
       riesgo="",
       opciones=[op("intuos", "Wacom Intuos M", "La tableta clásica, sin pantalla.", "intuos_m", 4500),
                 op("one", "Wacom One 14 (con pantalla)", "Se dibuja directo sobre la imagen.", "wacom_one14", 9000),
                 op("esperar", "Esperar a lo que pida ella", "", None, 0)]),
  dict(id="fondo", titulo="Fondo portátil", area="foto", prioridad="deseable", orden=4,
       porque="Retratos rápidos cuando el laboratorio de foto está ocupado por clases.",
       riesgo="Los retratos esperan a que se libere el laboratorio.",
       opciones=[op("o1", "Fondo plegable de 1.5 × 2 m", "Se arma en dos minutos en cualquier salón.", "fondo", 2500)]),
  dict(id="v90", titulo="Memoria V90", area="foto", prioridad="deseable", orden=5,
       porque="Las memorias actuales (V30) cubren el 4K normal. Una V90 abre la cámara lenta en 4K y la máxima calidad de la A7 IV para graduaciones y espectaculares.",
       riesgo="",
       opciones=[op("o1", "SD de 128 GB V90", "", "v90", 2800)]),
]

AJUSTES = {
    "rotulo": "Diseño y Medios /",
    "bajada": "Lo que tenemos, lo que hace falta y cuánto cuesta, para producir el contenido de redes, campañas y eventos de la IBERO Tijuana.",
    "nota_diagnostico": "La universidad tiene laboratorio de foto con fondos y cabina de audio, pero con prioridad para las clases. Por eso esta lista pide un kit portátil y no un estudio.",
    "diagnostico": [
        {"titulo": "Una sola cámara confiable", "texto": "La Sony A7 IV. La Canon 6D Mark II falla al grabar video y la Nikon D3300 tiene más de diez años."},
        {"titulo": "El drone es prestado", "texto": "El Mavic Air del área tiene una batería y no tiene cargador del control. Se usa el drone personal de Leo."},
        {"titulo": "Audio de un solo kit", "texto": "Todo el sonido sale de un kit inalámbrico Lark M2. No hay micrófono de respaldo."},
        {"titulo": "Luces sin dónde pararse", "texto": "Cuatro luces y dos pedestales: no alcanza para una entrevista con tres luces."},
        {"titulo": "Sin discos ni mochilas", "texto": "El material no tiene respaldo y el equipo viaja suelto. Tampoco hay extensiones."},
    ],
}


def main():
    precios = {}
    fecha = ""
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8") as f:
            data = json.load(f)
        precios = data.get("precios", {})
        fecha = data.get("fecha_legible", "")

    def mejor(clave):
        filas = [p for p in precios.get(clave) or [] if p and p.get("precio_mxn")]
        return min(filas, key=lambda p: p["precio_mxn"]) if filas else None

    CODIGO = codigo()
    sql = []
    ajustes = dict(AJUSTES)
    if fecha:
        ajustes["fecha_precios"] = fecha
    j = lambda o: "$j$" + json.dumps(o, ensure_ascii=False) + "$j$::jsonb"
    sql.append(
        "insert into public.compras_tableros (codigo, titulo, ajustes) values "
        "('{}', 'Equipo multimedia', {}) on conflict (codigo) do update "
        "set ajustes = public.compras_tableros.ajustes || excluded.ajustes, actualizado = now();"
        .format(CODIGO, j(ajustes)))

    for n in NECESIDADES:
        n = json.loads(json.dumps(n))
        for o in n["opciones"]:
            p = mejor(o.pop("clave")) if o.get("clave") else None
            if p:
                o.update(precio=int(p["precio_mxn"]), tienda=p.get("tienda", ""), url=p.get("url", ""), estimado=False)
            elif o["precio"] == 0:
                o["estimado"] = False
        n.update(elegida=n["opciones"][0]["id"], estado="propuesta",
                 incluida=n["prioridad"] in ("arreglo", "urgente", "importante"))
        sql.append(
            "insert into public.compras_necesidades (tablero, id, datos, autor) values "
            "('{c}', '{i}', {d}, 'Leo') on conflict (tablero, id) do update "
            "set datos = public.compras_necesidades.datos || jsonb_build_object('opciones', excluded.datos->'opciones'), "
            "actualizado = now();".format(c=CODIGO, i=n["id"], d=j(n)))

    salida = os.path.join(DATOS, "compras_semilla.sql")
    with open(salida, "w", encoding="utf-8") as f:
        f.write("\n".join(sql) + "\n")
    faltan = sorted({o["nombre"] for n in NECESIDADES for o in n["opciones"]
                     if o.get("clave") and not mejor(o["clave"])})
    print("Escrito", salida, "·", len(NECESIDADES), "necesidades")
    if faltan:
        print("Con precio estimado:", "; ".join(faltan))


if __name__ == "__main__":
    main()
