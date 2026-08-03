# -*- coding: utf-8 -*-
"""
LA PIZARRA - Sistema de gestion del Departamento de Diseno y Medios
IBERO Tijuana

Servidor local sin dependencias externas (solo stdlib de Python).
Los datos viven en archivos JSON dentro de /datos, con respaldo automatico
en cada guardado.
"""

import base64
import json
import os
import re
import shutil
import sys
import threading
import webbrowser
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

RAIZ = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(RAIZ, "web")
DATOS = os.path.join(RAIZ, "datos")
RESPALDOS = os.path.join(DATOS, "respaldos")
MINIATURAS = os.path.join(DATOS, "miniaturas")
PUERTO = 8770
MAX_RESPALDOS = 30
MAX_MINIATURA = 12 * 1024 * 1024  # 12 MB por imagen

try:
    import ia
except Exception:  # el modulo es opcional: LA PIZARRA funciona sin el
    ia = None

# Estructura inicial de cada coleccion
ESQUEMAS = {
    "parrilla": {"piezas": [], "ideas": []},
    "inventario": {"equipos": [], "vuelos": [], "prestamos_historial": []},
    "expertos": {"personas": []},
    "redaccion": {"temas": [], "equipo": {
        "redaccion": "Marysol",
        "publicacion": "Sergio",
        "coordinacion": "Leo",
    }},
    "config": {
        "nombre_depto": "Departamento de Diseno y Medios",
        "responsable": "Leo",
        "creado": None,
    },
}

MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
}


def asegurar_carpetas():
    os.makedirs(DATOS, exist_ok=True)
    os.makedirs(RESPALDOS, exist_ok=True)
    os.makedirs(MINIATURAS, exist_ok=True)
    for nombre, esquema in ESQUEMAS.items():
        ruta = os.path.join(DATOS, nombre + ".json")
        if not os.path.exists(ruta):
            base = json.loads(json.dumps(esquema))
            if nombre == "config":
                base["creado"] = datetime.now().isoformat(timespec="seconds")
            with open(ruta, "w", encoding="utf-8") as f:
                json.dump(base, f, ensure_ascii=False, indent=2)


def ruta_coleccion(nombre):
    if nombre not in ESQUEMAS:
        return None
    return os.path.join(DATOS, nombre + ".json")


def leer(nombre):
    ruta = ruta_coleccion(nombre)
    if not ruta or not os.path.exists(ruta):
        return None
    try:
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        # Si el archivo se corrompio, intenta el respaldo mas reciente
        recuperado = recuperar_ultimo_respaldo(nombre)
        return recuperado if recuperado is not None else json.loads(json.dumps(ESQUEMAS[nombre]))


def recuperar_ultimo_respaldo(nombre):
    try:
        candidatos = sorted(
            [f for f in os.listdir(RESPALDOS) if f.startswith(nombre + "-")],
            reverse=True,
        )
    except OSError:
        return None
    for archivo in candidatos:
        try:
            with open(os.path.join(RESPALDOS, archivo), "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            continue
    return None


def respaldar(nombre):
    origen = ruta_coleccion(nombre)
    if not origen or not os.path.exists(origen):
        return
    sello = datetime.now().strftime("%Y%m%d-%H%M%S")
    destino = os.path.join(RESPALDOS, "{}-{}.json".format(nombre, sello))
    try:
        shutil.copy2(origen, destino)
    except OSError:
        return
    # Conserva solo los ultimos N respaldos de esa coleccion
    try:
        previos = sorted(
            [f for f in os.listdir(RESPALDOS) if f.startswith(nombre + "-")],
            reverse=True,
        )
        for viejo in previos[MAX_RESPALDOS:]:
            os.remove(os.path.join(RESPALDOS, viejo))
    except OSError:
        pass


def escribir(nombre, contenido):
    ruta = ruta_coleccion(nombre)
    if not ruta:
        return False
    respaldar(nombre)
    temporal = ruta + ".tmp"
    with open(temporal, "w", encoding="utf-8") as f:
        json.dump(contenido, f, ensure_ascii=False, indent=2)
    os.replace(temporal, ruta)  # escritura atomica
    return True


class Manejador(BaseHTTPRequestHandler):
    server_version = "La Pizarra/1.0"

    def log_message(self, formato, *args):
        pass  # silencio: no ensuciar la consola

    # -- utilidades de respuesta -------------------------------------------

    def responder_json(self, datos, codigo=200):
        cuerpo = json.dumps(datos, ensure_ascii=False).encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(cuerpo)

    def responder_archivo(self, ruta_rel):
        destino = os.path.normpath(os.path.join(WEB, ruta_rel.lstrip("/")))
        if not destino.startswith(WEB) or not os.path.isfile(destino):
            self.send_error(404, "No encontrado")
            return
        ext = os.path.splitext(destino)[1].lower()
        try:
            with open(destino, "rb") as f:
                cuerpo = f.read()
        except OSError:
            self.send_error(500, "No se pudo leer el archivo")
            return
        self.send_response(200)
        self.send_header("Content-Type", MIME.get(ext, "application/octet-stream"))
        self.send_header("Content-Length", str(len(cuerpo)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(cuerpo)

    # -- rutas --------------------------------------------------------------

    def responder_miniatura(self, nombre_archivo):
        seguro = os.path.basename(nombre_archivo)
        destino = os.path.join(MINIATURAS, seguro)
        if not os.path.isfile(destino):
            self.send_error(404, "No encontrado")
            return
        ext = os.path.splitext(destino)[1].lower()
        try:
            with open(destino, "rb") as f:
                cuerpo = f.read()
        except OSError:
            self.send_error(500, "No se pudo leer la imagen")
            return
        self.send_response(200)
        self.send_header("Content-Type", MIME.get(ext, "application/octet-stream"))
        self.send_header("Content-Length", str(len(cuerpo)))
        self.send_header("Cache-Control", "max-age=86400")
        self.end_headers()
        self.wfile.write(cuerpo)

    def do_GET(self):
        ruta = urlparse(self.path).path

        if ruta == "/":
            self.responder_archivo("index.html")
            return

        if ruta.startswith("/miniaturas/"):
            self.responder_miniatura(ruta[len("/miniaturas/"):])
            return

        if ruta == "/api/ia/estado":
            self.responder_json({
                "disponible": bool(ia and ia.disponible()),
                "modulo": ia is not None,
            })
            return

        if ruta.startswith("/api/"):
            nombre = ruta[5:].strip("/")
            if nombre == "todo":
                self.responder_json({k: leer(k) for k in ESQUEMAS})
                return
            datos = leer(nombre)
            if datos is None:
                self.responder_json({"error": "Coleccion desconocida"}, 404)
            else:
                self.responder_json(datos)
            return

        self.responder_archivo(ruta)

    def leer_cuerpo(self):
        try:
            largo = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            largo = 0
        if largo <= 0 or largo > 24 * 1024 * 1024:
            return None
        try:
            crudo = self.rfile.read(largo)
            contenido = json.loads(crudo.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError, OSError):
            return None
        return contenido if isinstance(contenido, dict) else None

    def guardar_miniatura(self, contenido):
        datos_uri = contenido.get("datos", "")
        m = re.match(r"^data:image/(png|jpeg|jpg|webp|gif);base64,(.+)$", datos_uri, re.S)
        if not m:
            self.responder_json({"error": "Formato de imagen no soportado"}, 400)
            return
        extension = ".jpg" if m.group(1) in ("jpeg", "jpg") else "." + m.group(1)
        try:
            binario = base64.b64decode(m.group(2), validate=True)
        except (ValueError, TypeError):
            self.responder_json({"error": "Imagen corrupta"}, 400)
            return
        if len(binario) > MAX_MINIATURA:
            self.responder_json({"error": "La imagen pesa mas de 12 MB"}, 400)
            return

        sello = datetime.now().strftime("%Y%m%d-%H%M%S")
        aleatorio = base64.urlsafe_b64encode(os.urandom(6)).decode("ascii").rstrip("=")
        nombre = "{}-{}{}".format(sello, aleatorio, extension)
        try:
            with open(os.path.join(MINIATURAS, nombre), "wb") as f:
                f.write(binario)
        except OSError:
            self.responder_json({"error": "No se pudo guardar la imagen"}, 500)
            return
        self.responder_json({"ok": True, "archivo": nombre, "url": "/miniaturas/" + nombre})

    def atender_ia(self, accion, contenido):
        if ia is None:
            self.responder_json(
                {"error": "El modulo de IA no esta disponible. Falta instalar "
                          "el paquete: pip install anthropic"}, 503)
            return
        try:
            if accion == "copy":
                self.responder_json(ia.redactar_copy(contenido.get("pieza") or {}))
            elif accion == "clasificar":
                texto = (contenido.get("texto") or "").strip()
                if not texto:
                    self.responder_json({"error": "Falta el texto de la idea"}, 400)
                    return
                self.responder_json(ia.clasificar(texto))
            elif accion == "calendarizar":
                self.responder_json(ia.calendarizar(
                    contenido.get("piezas") or [],
                    contenido.get("ya_programado") or [],
                    contenido.get("desde", ""),
                    contenido.get("hasta", ""),
                ))
            else:
                self.responder_json({"error": "Accion de IA desconocida"}, 404)
        except ia.IANoConfigurada as e:
            self.responder_json({"error": str(e), "sin_llave": True}, 503)
        except Exception as e:
            self.responder_json({"error": "{}: {}".format(type(e).__name__, e)}, 502)

    def do_POST(self):
        ruta = urlparse(self.path).path
        if not ruta.startswith("/api/"):
            self.send_error(404, "No encontrado")
            return

        contenido = self.leer_cuerpo()
        if contenido is None:
            self.responder_json({"error": "Cuerpo invalido o vacio"}, 400)
            return

        if ruta == "/api/miniatura":
            self.guardar_miniatura(contenido)
            return

        if ruta.startswith("/api/ia/"):
            self.atender_ia(ruta[len("/api/ia/"):].strip("/"), contenido)
            return

        nombre = ruta[5:].strip("/")
        if nombre not in ESQUEMAS:
            self.responder_json({"error": "Coleccion desconocida"}, 404)
            return

        escribir(nombre, contenido)
        self.responder_json({"ok": True, "guardado": datetime.now().isoformat(timespec="seconds")})


def main():
    asegurar_carpetas()
    direccion = "http://localhost:{}".format(PUERTO)

    try:
        servidor = ThreadingHTTPServer(("127.0.0.1", PUERTO), Manejador)
    except OSError:
        print("\n  El puerto {} ya esta ocupado.".format(PUERTO))
        print("  Probablemente LA PIZARRA ya esta abierta en otra ventana.")
        print("  Abre {} en tu navegador.\n".format(direccion))
        input("  Presiona Enter para cerrar...")
        sys.exit(1)

    print("")
    print("  LA PIZARRA - Departamento de Diseno y Medios")
    print("  IBERO Tijuana")
    print("  " + "-" * 44)
    print("  Corriendo en: {}".format(direccion))
    print("  Datos en:     {}".format(DATOS))
    print("")
    print("  Para cerrar: Ctrl+C o cierra esta ventana.")
    print("")

    threading.Timer(1.0, lambda: webbrowser.open(direccion)).start()

    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\n  LA PIZARRA cerrada. Tus datos quedaron guardados.\n")
        servidor.shutdown()


if __name__ == "__main__":
    main()
