# -*- coding: utf-8 -*-
"""
CABINA - Asistente de IA
IBERO Tijuana

Usa el SDK oficial de Anthropic. La llave de API vive SOLO aqui, del lado del
servidor: el navegador nunca la ve.

Para configurarla, cualquiera de las dos:
  1. Pega la llave en el archivo  clave_ia.txt  (en esta misma carpeta)
  2. O define la variable de entorno  ANTHROPIC_API_KEY
"""

import json
import os

RAIZ = os.path.dirname(os.path.abspath(__file__))
ARCHIVO_LLAVE = os.path.join(RAIZ, "clave_ia.txt")

MODELO = "claude-opus-5"

# Contexto que acompana a cada peticion. Sale del plan maestro y de la
# auditoria del 3 de agosto de 2026.
CONTEXTO = """Eres el asistente de contenido del Departamento de Diseno y Medios
de la Universidad Iberoamericana Tijuana (IBERO Tijuana). Ayudas a Leo, que
dirige diseno, foto/video y redes sociales.

LOS CINCO PILARES DE CONTENIDO:
1. "vida" - Vida IBERO: pasillos, cafeteria, POV de estudiante, humor de campus.
   Tono casual, rapido, imperfecto. Es el carril casual.
2. "orgullo" - Orgullo IBERO: logros, investigacion, profesores, egresados.
   Tono serio pero con gancho. Carril institucional.
3. "se_ibero" - Se IBERO: oferta educativa, admisiones, becas, posgrados.
   Tono aspiracional, orientado a conversion. Carril institucional.
4. "cultura" - Cultura Viva: talleres, eventos, arte y cultura, CCI.
   Tono hibrido.
5. "voz" - Voz IBERO: valores jesuitas, postura social, comunidad.
   Tono sobrio, con peso. Carril institucional. Es el diferenciador de la
   universidad y el contenido que mas se comparte en Facebook.

CONTEXTO DE LOS CANALES (auditoria del 3 de agosto de 2026):
- Instagram: 5,721 seguidores. Es el eje. El feed viene saturado de contenido
  casual; hace falta peso institucional.
- Facebook: 37,000 seguidores pero engagement bajo (0.16%). Audiencia de padres
  de familia, egresados y publico general. El contenido de identidad jesuita es
  lo que mas se comparte ahi.
- LinkedIn: posgrados, educacion continua, vinculacion empresarial.
- YouTube: 804 suscriptores, canal descuidado. Sin Shorts pese a producir reels.
- Medicina es la carrera con mejor desempeno historico.

CRITERIO DE COPY (esto es importante y no negociable):
- Nada de copy generico de bienestar o superacion personal. Nada de "descubre tu
  potencial", "transforma tu futuro", "vive la experiencia".
- El copy se juzga por como suena leido en voz alta: ritmo, cadencia, peso de
  las silabas. Un slogan sin ritmo no sirve aunque el mensaje sea correcto.
- Frases cortas. Verbos concretos. Sin adjetivos de relleno.
- Espanol de Mexico, tono de Tijuana: directo, sin solemnidad falsa.
- Prohibido el uso de emojis en piezas institucionales (pilares orgullo,
  se_ibero y voz). En vida y cultura se permiten con moderacion.
"""

PILARES = ["vida", "orgullo", "se_ibero", "cultura", "voz"]
FORMATOS = ["Reel", "Short", "Carrusel", "Foto", "Video", "Story", "Texto"]
CANALES = ["ig", "fb", "li", "yt"]


class IANoConfigurada(Exception):
    """La llave de API no esta disponible."""


def leer_llave():
    llave = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if llave:
        return llave
    if os.path.exists(ARCHIVO_LLAVE):
        try:
            with open(ARCHIVO_LLAVE, "r", encoding="utf-8") as f:
                for linea in f:
                    linea = linea.strip()
                    if linea and not linea.startswith("#"):
                        return linea
        except OSError:
            pass
    return ""


def disponible():
    return bool(leer_llave())


def _cliente():
    llave = leer_llave()
    if not llave:
        raise IANoConfigurada(
            "Falta la llave de API. Pegala en clave_ia.txt o define "
            "ANTHROPIC_API_KEY."
        )
    import anthropic  # import diferido: CABINA arranca aunque no este instalado
    return anthropic.Anthropic(api_key=llave)


def _pedir(prompt, esquema, esfuerzo="medium"):
    """Una peticion con salida estructurada, validada contra el esquema."""
    cliente = _cliente()
    respuesta = cliente.messages.create(
        model=MODELO,
        max_tokens=16000,
        system=CONTEXTO,
        output_config={
            "effort": esfuerzo,
            "format": {"type": "json_schema", "schema": esquema},
        },
        messages=[{"role": "user", "content": prompt}],
    )

    if respuesta.stop_reason == "refusal":
        raise RuntimeError("El modelo declino responder a esta peticion.")

    texto = next((b.text for b in respuesta.content if b.type == "text"), "")
    if not texto:
        raise RuntimeError("El modelo no devolvio contenido.")
    return json.loads(texto)


# ── Redaccion de copy ──────────────────────────────────────────────────

ESQUEMA_COPY = {
    "type": "object",
    "properties": {
        "opciones": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "hook": {"type": "string"},
                    "copy": {"type": "string"},
                    "cta": {"type": "string"},
                    "nota": {"type": "string"},
                },
                "required": ["hook", "copy", "cta", "nota"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["opciones"],
    "additionalProperties": False,
}

NOMBRES_CANAL = {
    "ig": "Instagram",
    "fb": "Facebook",
    "li": "LinkedIn",
    "yt": "YouTube",
}


def redactar_copy(pieza):
    canales = [NOMBRES_CANAL.get(c, c) for c in (pieza.get("canales") or [])]
    prompt = """Escribe TRES opciones de copy para esta pieza.

Pieza: {titulo}
Pilar: {pilar}
Formato: {formato}
Canales: {canales}
Notas de produccion: {notas}

Para cada opcion entrega:
- "hook": la primera linea, la que detiene el scroll. Maximo 12 palabras.
- "copy": el cuerpo del texto. Ajusta el largo al canal (Instagram breve,
  Facebook y LinkedIn admiten mas). Sin hashtags.
- "cta": la llamada a la accion, una sola frase.
- "nota": en una linea, por que esta version funciona. Se especifico sobre el
  ritmo o el recurso que usaste, no digas generalidades.

Que las tres opciones sean genuinamente distintas entre si en enfoque, no tres
versiones de la misma idea. Aplica el criterio de copy al pie de la letra.
""".format(
        titulo=pieza.get("titulo", "(sin titulo)"),
        pilar=pieza.get("pilar", "?"),
        formato=pieza.get("formato", "?"),
        canales=", ".join(canales) or "sin definir",
        notas=pieza.get("notas") or "(ninguna)",
    )
    return _pedir(prompt, ESQUEMA_COPY, esfuerzo="high")


# ── Clasificacion de una idea ──────────────────────────────────────────

ESQUEMA_CLASIFICAR = {
    "type": "object",
    "properties": {
        "titulo": {"type": "string"},
        "pilar": {"type": "string", "enum": PILARES},
        "formato": {"type": "string", "enum": FORMATOS},
        "canales": {
            "type": "array",
            "items": {"type": "string", "enum": CANALES},
        },
        "razon": {"type": "string"},
    },
    "required": ["titulo", "pilar", "formato", "canales", "razon"],
    "additionalProperties": False,
}


def clasificar(texto):
    prompt = """Clasifica esta idea de contenido:

"{texto}"

Entrega:
- "titulo": un titulo corto y claro para la parrilla (maximo 8 palabras).
- "pilar": el pilar que le corresponde.
- "formato": el formato mas adecuado.
- "canales": los canales donde conviene publicarla. Se selectivo: no todo va a
  los cuatro. El humor de campus no va a LinkedIn.
- "razon": una linea explicando la clasificacion.
""".format(texto=texto)
    return _pedir(prompt, ESQUEMA_CLASIFICAR, esfuerzo="low")


# ── Calendarizacion de un lote ─────────────────────────────────────────

ESQUEMA_CALENDARIO = {
    "type": "object",
    "properties": {
        "asignaciones": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "fecha": {"type": "string"},
                    "razon": {"type": "string"},
                },
                "required": ["id", "fecha", "razon"],
                "additionalProperties": False,
            },
        },
        "diagnostico": {"type": "string"},
    },
    "required": ["asignaciones", "diagnostico"],
    "additionalProperties": False,
}


def calendarizar(piezas, ya_programado, desde, hasta):
    pendientes = "\n".join(
        '- id "{}": "{}" (pilar {}, formato {})'.format(
            p.get("id"), p.get("titulo"), p.get("pilar"), p.get("formato")
        )
        for p in piezas
    )
    ocupado = "\n".join(
        "- {}: \"{}\" (pilar {})".format(p.get("fecha"), p.get("titulo"), p.get("pilar"))
        for p in ya_programado
    ) or "(la ventana esta vacia)"

    prompt = """Asigna fecha de publicacion a estas piezas pendientes.

VENTANA DISPONIBLE: del {desde} al {hasta} (formato AAAA-MM-DD).

PIEZAS PENDIENTES DE FECHA:
{pendientes}

YA PROGRAMADO EN ESA VENTANA:
{ocupado}

REGLAS DE CALENDARIZACION:
1. La mezcla semanal debe quedar equilibrada. Al menos el 40% de las piezas de
   cada semana deben ser del carril institucional (pilares orgullo, se_ibero y
   voz). Este es el criterio mas importante: el problema historico de la cuenta
   fue publicar casi puro contenido casual.
2. No pongas dos piezas del mismo pilar en dias consecutivos.
3. Maximo una pieza por dia.
4. Deja libre el domingo salvo que haya un evento que lo justifique.
5. El contenido institucional funciona mejor entre martes y jueves.

Entrega:
- "asignaciones": una por pieza, con su id exacto, la fecha AAAA-MM-DD y una
  linea explicando por que ahi.
- "diagnostico": dos o tres lineas sobre como queda la mezcla despues de
  acomodar todo, y que le falta a la ventana.
""".format(desde=desde, hasta=hasta, pendientes=pendientes, ocupado=ocupado)

    return _pedir(prompt, ESQUEMA_CALENDARIO, esfuerzo="high")
