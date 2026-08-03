# -*- coding: utf-8 -*-
"""
CABINA - Almacen de datos y cuentas
IBERO Tijuana

Sustituye los archivos JSON por SQLite. El cambio de fondo no es la base de
datos: es que ahora se guarda REGISTRO POR REGISTRO en vez del documento
completo. Con el modelo anterior, dos personas guardando al mismo tiempo se
borraban el trabajo entre ellas sin avisar.

Sobre las contrasenas: se usan primitivas de la biblioteca estandar aplicadas
como marca la practica corriente -- PBKDF2-HMAC-SHA256 con 240 000 vueltas y
sal aleatoria por usuario, tokens de sesion de 32 bytes de secrets, y
comparacion en tiempo constante. No se inventa criptografia.
"""

import hashlib
import json
import os
import secrets
import sqlite3
import threading
from datetime import datetime, timedelta

RAIZ = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(RAIZ, "datos")
BD = os.path.join(DATOS, "cabina.db")

VUELTAS = 240_000
DIAS_SESION = 30

# Que puede tocar cada rol. La coleccion "*" significa todo.
PERMISOS = {
    "coordinacion": {"escribe": ["*"], "descripcion": "Coordina todo el departamento"},
    "redaccion":    {"escribe": ["redaccion_temas", "parrilla_piezas", "expertos_personas"],
                     "descripcion": "Escribe las notas academicas"},
    "publicacion":  {"escribe": ["parrilla_piezas"],
                     "descripcion": "Publica las notas en el sitio"},
    "produccion":   {"escribe": ["parrilla_piezas", "parrilla_ideas"],
                     "descripcion": "Produce contenido"},
}

_local = threading.local()


def conexion():
    """Una conexion por hilo. SQLite no comparte conexiones entre hilos."""
    if not hasattr(_local, "cx"):
        os.makedirs(DATOS, exist_ok=True)
        cx = sqlite3.connect(BD, timeout=10)
        cx.row_factory = sqlite3.Row
        cx.execute("PRAGMA journal_mode=WAL")      # permite leer mientras se escribe
        cx.execute("PRAGMA foreign_keys=ON")
        cx.execute("PRAGMA busy_timeout=8000")
        _local.cx = cx
    return _local.cx


def preparar():
    cx = conexion()
    cx.executescript("""
    CREATE TABLE IF NOT EXISTS registros (
        coleccion   TEXT NOT NULL,
        id          TEXT NOT NULL,
        datos       TEXT NOT NULL,
        actualizado TEXT NOT NULL,
        actor       TEXT,
        borrado     INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (coleccion, id)
    );
    CREATE INDEX IF NOT EXISTS idx_reg_actualizado ON registros(actualizado);

    CREATE TABLE IF NOT EXISTS usuarios (
        id       TEXT PRIMARY KEY,
        usuario  TEXT NOT NULL UNIQUE,
        nombre   TEXT NOT NULL,
        rol      TEXT NOT NULL,
        clave    TEXT NOT NULL,
        sal      TEXT NOT NULL,
        activo   INTEGER NOT NULL DEFAULT 1,
        creado   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sesiones (
        token    TEXT PRIMARY KEY,
        usuario  TEXT NOT NULL,
        expira   TEXT NOT NULL,
        creada   TEXT NOT NULL,
        FOREIGN KEY (usuario) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS bitacora (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        momento     TEXT NOT NULL,
        actor       TEXT,
        accion      TEXT NOT NULL,
        coleccion   TEXT,
        registro    TEXT,
        detalle     TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_bit_momento ON bitacora(momento);
    """)
    cx.commit()


# ── Cuentas ────────────────────────────────────────────────

def _cifrar(clave, sal):
    return hashlib.pbkdf2_hmac("sha256", clave.encode("utf-8"),
                               bytes.fromhex(sal), VUELTAS).hex()


def crear_usuario(usuario, nombre, rol, clave):
    if rol not in PERMISOS:
        raise ValueError("Rol desconocido: " + rol)
    if len(clave) < 8:
        raise ValueError("La contrasena necesita al menos 8 caracteres")

    cx = conexion()
    sal = secrets.token_hex(16)
    try:
        cx.execute(
            "INSERT INTO usuarios (id, usuario, nombre, rol, clave, sal, creado) "
            "VALUES (?,?,?,?,?,?,?)",
            (secrets.token_hex(8), usuario.strip().lower(), nombre.strip(), rol,
             _cifrar(clave, sal), sal, datetime.now().isoformat(timespec="seconds")))
        cx.commit()
    except sqlite3.IntegrityError:
        raise ValueError("Ya existe una cuenta con ese usuario")
    return True


def cambiar_clave(usuario, clave_nueva):
    if len(clave_nueva) < 8:
        raise ValueError("La contrasena necesita al menos 8 caracteres")
    cx = conexion()
    sal = secrets.token_hex(16)
    cx.execute("UPDATE usuarios SET clave=?, sal=? WHERE usuario=?",
               (_cifrar(clave_nueva, sal), sal, usuario.strip().lower()))
    cx.commit()


def verificar(usuario, clave):
    """Devuelve el usuario si las credenciales sirven, o None."""
    cx = conexion()
    f = cx.execute("SELECT * FROM usuarios WHERE usuario=? AND activo=1",
                   (usuario.strip().lower(),)).fetchone()
    if not f:
        # Se cifra igual aunque no exista, para no delatar por tiempo de
        # respuesta cuales usuarios son reales.
        _cifrar(clave, secrets.token_hex(16))
        return None
    if not secrets.compare_digest(_cifrar(clave, f["sal"]), f["clave"]):
        return None
    return dict(f)


def listar_usuarios():
    cx = conexion()
    return [{"id": f["id"], "usuario": f["usuario"], "nombre": f["nombre"],
             "rol": f["rol"], "activo": bool(f["activo"])}
            for f in cx.execute("SELECT * FROM usuarios ORDER BY nombre")]


def hay_usuarios():
    cx = conexion()
    return cx.execute("SELECT COUNT(*) c FROM usuarios").fetchone()["c"] > 0


# ── Sesiones ───────────────────────────────────────────────

def abrir_sesion(id_usuario):
    cx = conexion()
    token = secrets.token_urlsafe(32)
    cx.execute("INSERT INTO sesiones (token, usuario, expira, creada) VALUES (?,?,?,?)",
               (token, id_usuario,
                (datetime.now() + timedelta(days=DIAS_SESION)).isoformat(timespec="seconds"),
                datetime.now().isoformat(timespec="seconds")))
    cx.commit()
    return token


def sesion(token):
    if not token:
        return None
    cx = conexion()
    f = cx.execute(
        "SELECT u.* FROM sesiones s JOIN usuarios u ON u.id = s.usuario "
        "WHERE s.token=? AND s.expira > ? AND u.activo=1",
        (token, datetime.now().isoformat(timespec="seconds"))).fetchone()
    return dict(f) if f else None


def cerrar_sesion(token):
    cx = conexion()
    cx.execute("DELETE FROM sesiones WHERE token=?", (token,))
    cx.commit()


def limpiar_sesiones():
    cx = conexion()
    cx.execute("DELETE FROM sesiones WHERE expira <= ?",
               (datetime.now().isoformat(timespec="seconds"),))
    cx.commit()


def puede_escribir(usuario, coleccion):
    if not usuario:
        return False
    permitidas = PERMISOS.get(usuario["rol"], {}).get("escribe", [])
    return "*" in permitidas or coleccion in permitidas


# ── Registros ──────────────────────────────────────────────

def leer_todo():
    """Devuelve todas las colecciones vivas, agrupadas."""
    cx = conexion()
    out = {}
    for f in cx.execute("SELECT coleccion, datos FROM registros WHERE borrado=0"):
        out.setdefault(f["coleccion"], []).append(json.loads(f["datos"]))
    return out


def guardar_registro(coleccion, registro, actor=None):
    """Alta o actualizacion de UN registro. Esta es la diferencia de fondo
       con el modelo anterior: nadie reescribe la coleccion completa."""
    rid = registro.get("id")
    if not rid:
        raise ValueError("El registro necesita un id")
    cx = conexion()
    ahora = datetime.now().isoformat(timespec="seconds")
    existia = cx.execute("SELECT 1 FROM registros WHERE coleccion=? AND id=? AND borrado=0",
                         (coleccion, rid)).fetchone()
    cx.execute(
        "INSERT INTO registros (coleccion, id, datos, actualizado, actor, borrado) "
        "VALUES (?,?,?,?,?,0) "
        "ON CONFLICT(coleccion, id) DO UPDATE SET "
        "datos=excluded.datos, actualizado=excluded.actualizado, "
        "actor=excluded.actor, borrado=0",
        (coleccion, rid, json.dumps(registro, ensure_ascii=False), ahora, actor))
    anotar(actor, "actualiza" if existia else "crea", coleccion, rid,
           registro.get("titulo") or registro.get("nombre") or registro.get("texto", "")[:60])
    cx.commit()
    return ahora


def borrar_registro(coleccion, rid, actor=None):
    """Borrado marcado, no fisico: asi los demas equipos se enteran de que
       algo desaparecio la proxima vez que consulten cambios."""
    cx = conexion()
    ahora = datetime.now().isoformat(timespec="seconds")
    cx.execute("UPDATE registros SET borrado=1, actualizado=?, actor=? "
               "WHERE coleccion=? AND id=?", (ahora, actor, coleccion, rid))
    anotar(actor, "borra", coleccion, rid, "")
    cx.commit()
    return ahora


def cambios_desde(momento):
    """Lo que se movio despues de 'momento'. Es lo que permite que cada
       quien vea el trabajo de los demas sin recargar la pagina."""
    cx = conexion()
    vivos, muertos = {}, []
    for f in cx.execute("SELECT * FROM registros WHERE actualizado > ? ORDER BY actualizado",
                        (momento,)):
        if f["borrado"]:
            muertos.append({"coleccion": f["coleccion"], "id": f["id"]})
        else:
            vivos.setdefault(f["coleccion"], []).append(json.loads(f["datos"]))
    return {"cambiados": vivos, "borrados": muertos,
            "momento": datetime.now().isoformat(timespec="seconds")}


# ── Bitacora ───────────────────────────────────────────────

def anotar(actor, accion, coleccion=None, registro=None, detalle=""):
    conexion().execute(
        "INSERT INTO bitacora (momento, actor, accion, coleccion, registro, detalle) "
        "VALUES (?,?,?,?,?,?)",
        (datetime.now().isoformat(timespec="seconds"), actor, accion,
         coleccion, registro, (detalle or "")[:200]))


def leer_bitacora(limite=120):
    cx = conexion()
    return [dict(f) for f in cx.execute(
        "SELECT b.*, u.nombre FROM bitacora b LEFT JOIN usuarios u ON u.id = b.actor "
        "ORDER BY b.id DESC LIMIT ?", (limite,))]


# ── Migracion desde los archivos JSON ──────────────────────

MAPA = {
    "parrilla":   {"piezas": "parrilla_piezas", "ideas": "parrilla_ideas"},
    "inventario": {"equipos": "inventario_equipos", "vuelos": "inventario_vuelos",
                   "prestamos_historial": "inventario_prestamos"},
    "expertos":   {"personas": "expertos_personas"},
    "redaccion":  {"temas": "redaccion_temas"},
}


def migrar_desde_json():
    """Trae lo que ya existe en los .json. Se puede correr varias veces:
       no duplica, porque cada registro conserva su id."""
    traidos = 0
    for archivo, listas in MAPA.items():
        ruta = os.path.join(DATOS, archivo + ".json")
        if not os.path.exists(ruta):
            continue
        try:
            with open(ruta, "r", encoding="utf-8") as f:
                contenido = json.load(f)
        except (OSError, json.JSONDecodeError):
            continue
        for clave, coleccion in listas.items():
            for registro in contenido.get(clave, []) or []:
                if isinstance(registro, dict) and registro.get("id"):
                    guardar_registro(coleccion, registro, actor=None)
                    traidos += 1
    conexion().commit()
    return traidos
