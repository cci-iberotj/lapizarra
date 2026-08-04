"""
LA PIZARRA - Subir los datos locales a Supabase
IBERO Tijuana

    python supabase/migrar.py            (muestra que haria)
    python supabase/migrar.py --hazlo    (lo sube)

Lee los .json de datos/ y los mete en la tabla registros, uno por
renglon. Es idempotente: correrlo dos veces no duplica nada, porque
la llave primaria es (coleccion, id) y se pisa el renglon existente.

NO BORRA NADA. Si en la nube hay algo que aqui no esta, se queda.
"""

import io
import json
import os
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN = os.path.join(RAIZ, "datos", "token_supabase.txt")
PROYECTO = "wrezcukptrtmnhnlxmao"
API = "https://api.supabase.com/v1/projects/{}/database/query".format(PROYECTO)

# El mismo reparto que usa web/datos.js. Si uno cambia, cambia el otro.
MAPA = {
    "parrilla":   {"piezas": "parrilla_piezas", "ideas": "parrilla_ideas"},
    "inventario": {"equipos": "inventario_equipos",
                   "vuelos": "inventario_vuelos",
                   "prestamos_historial": "inventario_prestamos"},
    "expertos":   {"personas": "expertos_personas"},
    "redaccion":  {"temas": "redaccion_temas"},
}
AJUSTES = {"redaccion": {"equipo": "ajustes_equipo"}}


def token():
    if not os.path.exists(TOKEN):
        print("\n  Falta el token en {}\n".format(TOKEN))
        sys.exit(1)
    reales = [l.strip() for l in io.open(TOKEN, encoding="utf-8")
              if l.strip() and not l.strip().startswith("#")]
    if not reales:
        print("\n  El archivo del token esta vacio.\n")
        sys.exit(1)
    return reales[0]


def leer(coleccion):
    ruta = os.path.join(RAIZ, "datos", coleccion + ".json")
    if not os.path.exists(ruta):
        return {}
    with io.open(ruta, encoding="utf-8") as f:
        return json.load(f)


def recolectar():
    """Devuelve [(coleccion_real, id, datos), ...] listo para subir."""
    filas = []
    for coleccion, listas in MAPA.items():
        d = leer(coleccion)
        for clave, real in listas.items():
            for registro in (d.get(clave) or []):
                if not isinstance(registro, dict) or not registro.get("id"):
                    continue
                filas.append((real, str(registro["id"]), registro))
    for coleccion, ajustes in AJUSTES.items():
        d = leer(coleccion)
        for clave, real in ajustes.items():
            valor = d.get(clave)
            if valor:
                filas.append((real, real, dict(valor, id=real)))
    return filas


def comilla(t):
    """Literal de texto para Postgres, con las comillas escapadas."""
    return "'" + str(t).replace("'", "''") + "'"


def main():
    de_verdad = "--hazlo" in sys.argv
    filas = recolectar()

    if not filas:
        print("\n  No hay nada que subir.\n")
        return

    print("\n  LA PIZARRA - migrar a Supabase")
    print("  " + "-" * 44)
    porcol = {}
    for real, _, _ in filas:
        porcol[real] = porcol.get(real, 0) + 1
    for real in sorted(porcol):
        print("    {:<24} {}".format(real, porcol[real]))
    print("  " + "-" * 44)
    print("    {:<24} {}".format("TOTAL", len(filas)))

    if not de_verdad:
        print("\n  Esto fue un ensayo. Para subirlo de verdad:")
        print("      python supabase/migrar.py --hazlo\n")
        return

    valores = ",\n  ".join(
        "({}, {}, {}::jsonb)".format(comilla(c), comilla(i),
                                     comilla(json.dumps(d, ensure_ascii=False)))
        for c, i, d in filas)

    sql = (
        "insert into public.registros (coleccion, id, datos) values\n  "
        + valores +
        "\non conflict (coleccion, id) do update\n"
        "   set datos = excluded.datos,\n"
        "       actualizado = now(),\n"
        "       borrado = false;\n"
        "select coleccion, count(*)::text as cuantos\n"
        "  from public.registros where borrado = false\n"
        " group by coleccion order by coleccion;"
    )

    peticion = urllib.request.Request(
        API,
        data=json.dumps({"query": sql}).encode("utf-8"),
        headers={"Authorization": "Bearer " + token(),
                 "Content-Type": "application/json",
                 "User-Agent": "la-pizarra/1.0"},
        method="POST")

    print("\n  Subiendo...\n")
    try:
        with urllib.request.urlopen(peticion, timeout=120) as r:
            resultado = json.loads(r.read().decode("utf-8") or "[]")
    except urllib.error.HTTPError as e:
        print("  Error {}: {}\n".format(e.code, e.read().decode("utf-8", "replace")[:400]))
        sys.exit(1)

    print("  Asi quedo la nube:")
    for f in resultado:
        print("    {:<24} {}".format(f["coleccion"], f["cuantos"]))
    print("")


if __name__ == "__main__":
    main()
