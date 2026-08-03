"""
LA PIZARRA - Correr SQL en Supabase sin copy-paste
IBERO Tijuana

    python supabase/correr.py esquema.sql
    python supabase/correr.py cuentas.sql

EL TOKEN
Vive en datos/token_supabase.txt, que esta fuera del repositorio
(la carpeta datos/ entera esta en .gitignore). Este archivo lo lee
para firmar la peticion y nada mas: no lo imprime, no lo copia, no
lo manda a ningun otro lado.

Si el token se te sale de las manos, se revoca en
https://supabase.com/dashboard/account/tokens y el viejo muere.

LO QUE NO HACE SOLO
Cualquier instruccion que borre datos -- drop, delete, truncate,
alter ... drop column -- lo detiene y te lo enseña antes. Para
correrla de todos modos hay que agregar --si-borra a proposito.
El objetivo es que un descuido no se lleve la base por delante.
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN = os.path.join(RAIZ, "datos", "token_supabase.txt")
PROYECTO = "wrezcukptrtmnhnlxmao"
API = "https://api.supabase.com/v1/projects/{}/database/query"

# Lo que puede destruir trabajo. No es una lista exhaustiva de SQL
# peligroso; es la lista de lo que de verdad nos puede morder aqui.
PELIGROSAS = [
    (r"\bdrop\s+table\b", "drop table"),
    (r"\bdrop\s+schema\b", "drop schema"),
    (r"\bdrop\s+database\b", "drop database"),
    (r"\btruncate\b", "truncate"),
    (r"\bdelete\s+from\b", "delete from"),
    (r"\bdrop\s+column\b", "drop column"),
]


def leer_token():
    if not os.path.exists(TOKEN):
        salir(
            "No encuentro el token.\n\n"
            "  1. Ve a https://supabase.com/dashboard/account/tokens\n"
            "  2. Generate new token. Nombre: la-pizarra\n"
            "  3. Copialo y pegalo TAL CUAL, solo, en este archivo:\n\n"
            "       {}\n\n"
            "  Esa carpeta esta fuera del repositorio: no se sube a GitHub.".format(TOKEN)
        )
    # El archivo trae instrucciones arriba para que se explique solo.
    # Se salta los renglones con # y se queda con el primero de verdad.
    with open(TOKEN, "r", encoding="utf-8") as f:
        reales = [l.strip() for l in f
                  if l.strip() and not l.strip().startswith("#")]
    t = reales[0] if reales else ""
    if not t:
        salir("Todavia no hay token en el archivo. Pega el tuyo en:\n\n"
              "    {}".format(TOKEN))
    if not t.startswith("sbp_"):
        salir(
            "Eso no parece un token de Supabase: los que sirven empiezan\n"
            "  con sbp_. Revisa que hayas copiado el token de cuenta y no\n"
            "  la llave del proyecto."
        )
    return t


def revisar(sql):
    """Devuelve la lista de instrucciones destructivas encontradas."""
    limpio = re.sub(r"--[^\n]*", "", sql).lower()
    return [nombre for patron, nombre in PELIGROSAS if re.search(patron, limpio)]


def ejecutar(sql, token):
    peticion = urllib.request.Request(
        API.format(PROYECTO),
        data=json.dumps({"query": sql}).encode("utf-8"),
        headers={
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            # Sin esto Cloudflare corta la peticion antes de que llegue
            # a Supabase: el User-Agent de fabrica de Python le huele a
            # robot y responde 403 sin explicar por que.
            "User-Agent": "la-pizarra/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(peticion, timeout=120) as r:
            return json.loads(r.read().decode("utf-8") or "[]")
    except urllib.error.HTTPError as e:
        cuerpo = e.read().decode("utf-8", "replace")
        try:
            cuerpo = json.loads(cuerpo).get("message", cuerpo)
        except Exception:
            pass
        if e.code in (401, 403):
            salir(
                "Supabase rechazo el token ({}).\n\n"
                "  Puede estar vencido o revocado. Genera otro en\n"
                "  https://supabase.com/dashboard/account/tokens\n"
                "  y reemplaza el contenido de {}".format(e.code, TOKEN)
            )
        salir("Supabase respondio error {}:\n\n  {}".format(e.code, cuerpo))
    except urllib.error.URLError as e:
        salir("No hubo forma de llegar a Supabase: {}".format(e.reason))


def tabla(filas):
    """Imprime los renglones que devolvio la consulta."""
    if not isinstance(filas, list) or not filas:
        return
    columnas = list(filas[0].keys())
    anchos = [
        max(len(c), max(len(str(f.get(c, ""))) for f in filas)) for c in columnas
    ]
    print("  " + "  ".join(c.ljust(a) for c, a in zip(columnas, anchos)))
    print("  " + "  ".join("-" * a for a in anchos))
    for f in filas:
        print("  " + "  ".join(str(f.get(c, "")).ljust(a)
                               for c, a in zip(columnas, anchos)))


def salir(mensaje):
    print("\n  " + mensaje.replace("\n", "\n  ") + "\n")
    sys.exit(1)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    a_proposito = "--si-borra" in sys.argv

    if not args:
        salir("Falta decir que archivo correr:\n\n"
              "    python supabase/correr.py esquema.sql")

    ruta = args[0]
    if not os.path.exists(ruta):
        alterna = os.path.join(RAIZ, "supabase", os.path.basename(ruta))
        if os.path.exists(alterna):
            ruta = alterna
        else:
            salir("No existe el archivo: {}".format(args[0]))

    with open(ruta, "r", encoding="utf-8") as f:
        sql = f.read()

    nombre = os.path.basename(ruta)
    print("\n  LA PIZARRA - {}".format(nombre))
    print("  " + "-" * 44)
    print("  Proyecto: {}".format(PROYECTO))
    print("  Lineas:   {}".format(len(sql.splitlines())))

    riesgos = revisar(sql)
    if riesgos and not a_proposito:
        salir(
            "ALTO. Este archivo trae instrucciones que borran:\n\n"
            "    {}\n\n"
            "  No lo corro solo. Si de verdad es lo que quieres:\n\n"
            "    python supabase/correr.py {} --si-borra".format(
                ", ".join(riesgos), nombre)
        )
    if riesgos:
        print("  Ojo:     corriendo instrucciones destructivas ({})"
              .format(", ".join(riesgos)))

    token = leer_token()
    print("  Corriendo...\n")

    filas = ejecutar(sql, token)
    tabla(filas)

    print("\n  Listo. {}\n".format(
        "{} renglon(es) de vuelta.".format(len(filas))
        if isinstance(filas, list) and filas else "Sin resultados que mostrar."))


if __name__ == "__main__":
    main()
