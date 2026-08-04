"""
LA PIZARRA - Bajar una copia de todo lo que hay en la nube
IBERO Tijuana

    python supabase/respaldar.py

POR QUE EXISTE
El plan gratis de Supabase NO guarda copias restaurables: se
comprobo con la API y la lista de respaldos viene vacia. Si un dia
alguien borra algo grande, o la cuenta se pierde, no hay boton de
"volver a ayer". Esto es ese boton, a mano.

Deja un archivo con fecha y hora en datos/respaldos-nube/. Es un
JSON legible: se puede abrir, leer y volver a subir con migrar.py
si algun dia hace falta.

Correrlo de vez en cuando -- despues de una sesion larga de captura,
o antes de tocar algo que de miedo. No borra ni modifica nada en la
nube: solo lee.
"""

import io
import json
import os
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKEN = os.path.join(RAIZ, "datos", "token_supabase.txt")
DESTINO = os.path.join(RAIZ, "datos", "respaldos-nube")
PROYECTO = "wrezcukptrtmnhnlxmao"
API = "https://api.supabase.com/v1/projects/{}/database/query".format(PROYECTO)


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


def consultar(sql):
    peticion = urllib.request.Request(
        API,
        data=json.dumps({"query": sql}).encode("utf-8"),
        headers={"Authorization": "Bearer " + token(),
                 "Content-Type": "application/json",
                 "User-Agent": "la-pizarra/1.0"},
        method="POST")
    try:
        with urllib.request.urlopen(peticion, timeout=120) as r:
            return json.loads(r.read().decode("utf-8") or "[]")
    except urllib.error.HTTPError as e:
        print("\n  Error {}: {}\n".format(e.code, e.read().decode("utf-8", "replace")[:300]))
        sys.exit(1)


def main():
    # Se lleva TAMBIEN los borrados. Un respaldo que ya decidio por ti
    # que se puede tirar no es un respaldo.
    filas = consultar(
        "select coleccion, id, datos, borrado,"
        "       to_char(actualizado, 'YYYY-MM-DD\"T\"HH24:MI:SSOF') as actualizado"
        "  from public.registros order by coleccion, id")

    perfiles = consultar(
        "select p.nombre, p.rol, u.email"
        "  from public.perfiles p join auth.users u on u.id = p.id"
        " order by p.nombre")

    # La marca de tiempo sale de la base, no de esta computadora: si el
    # reloj de aqui esta desfasado, el nombre del archivo mentiria.
    sello = consultar("select to_char(now(), 'YYYYMMDD-HH24MISS') as t")[0]["t"]

    os.makedirs(DESTINO, exist_ok=True)
    ruta = os.path.join(DESTINO, "la-pizarra-{}.json".format(sello))

    with io.open(ruta, "w", encoding="utf-8") as f:
        json.dump({"tomado": sello, "proyecto": PROYECTO,
                   "personas": perfiles, "registros": filas},
                  f, ensure_ascii=False, indent=2)

    porcol = {}
    for r in filas:
        clave = r["coleccion"] + (" (borrados)" if r["borrado"] else "")
        porcol[clave] = porcol.get(clave, 0) + 1

    print("\n  LA PIZARRA - respaldo de la nube")
    print("  " + "-" * 44)
    for c in sorted(porcol):
        print("    {:<26} {}".format(c, porcol[c]))
    print("  " + "-" * 44)
    print("    {:<26} {}".format("TOTAL", len(filas)))
    print("    {:<26} {}".format("personas", len(perfiles)))
    print("\n  Guardado en:\n    {}\n".format(ruta))

    # Aviso honesto: un respaldo que vive en el mismo disco que todo
    # lo demas no protege contra el disco.
    print("  Esto vive en tu computadora. Para que sirva de verdad,")
    print("  que la carpeta datos/ este en OneDrive o copiala aparte.\n")


if __name__ == "__main__":
    main()
