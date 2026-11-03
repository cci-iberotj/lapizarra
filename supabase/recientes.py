"""
LA PIZARRA - Lo que ya esta publicado en Instagram y Facebook
IBERO Tijuana

    python supabase/recientes.py

Lista las ultimas publicaciones de cada red y dice cuales tienen
ficha en la parrilla y cuales no -- lo que se subio a mano y la
Pizarra no sabe. Solo lee: no publica ni cambia nada en Meta.

Pregunta a la funcion 'publicar' con la llave del reloj (la misma
que usa la tanda automatica), que se lee de la base y no se imprime.
Las llaves de Meta nunca salen del servidor.
"""

import datetime
import json
import os
import re
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import correr

FUNCION = "https://{}.supabase.co/functions/v1/publicar".format(correr.PROYECTO)


def llave_del_reloj(token):
    filas = correr.ejecutar(
        "select command from cron.job where jobname = 'pizarra-autopublicar'", token)
    if not filas:
        correr.salir("No encuentro el reloj (pizarra-autopublicar) en la base.")
    m = re.search(r"'x-pizarra-reloj'\s*,\s*'([^']+)'", filas[0]["command"])
    if not m:
        correr.salir("El reloj no trae su llave donde la espero.")
    return m.group(1)


def _domingo(anio, mes, cual):
    """El n-esimo domingo de un mes (cual=1 primero, 2 segundo)."""
    d = datetime.date(anio, mes, 1)
    d += datetime.timedelta(days=(6 - d.weekday()) % 7)
    return d + datetime.timedelta(weeks=cual - 1)


def hora_tijuana(iso):
    """Meta da la hora en UTC. Tijuana sigue el horario de California:
    UTC-7 del segundo domingo de marzo al primer domingo de noviembre
    (a las 2 a. m. locales), UTC-8 el resto. El Python de Windows no
    trae la base de husos, asi que la regla va escrita aqui."""
    try:
        u = datetime.datetime.strptime(iso[:19], "%Y-%m-%dT%H:%M:%S")
        a = u.year
        inicio = datetime.datetime.combine(_domingo(a, 3, 2), datetime.time(10))  # 2 a. m. PST
        fin = datetime.datetime.combine(_domingo(a, 11, 1), datetime.time(9))     # 2 a. m. PDT
        local = u - datetime.timedelta(hours=7 if inicio <= u < fin else 8)
        return local.strftime("%d-%m %H:%M")
    except Exception:
        return iso[:16].replace("T", " ") + " UTC"


def main():
    token = correr.leer_token()
    peticion = urllib.request.Request(
        FUNCION, method="POST",
        data=json.dumps({"accion": "recientes"}).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "la-pizarra/1.0",
                 "x-pizarra-reloj": llave_del_reloj(token)})
    with urllib.request.urlopen(peticion, timeout=120) as r:
        d = json.loads(r.read().decode("utf-8"))
    if d.get("error"):
        correr.salir(d["error"])

    for red, corto, nombre in (("instagram", "ig", "INSTAGRAM"), ("facebook", "fb", "FACEBOOK")):
        print("\n  " + nombre)
        print("  " + "-" * 60)
        err = (d.get("errores") or {}).get(corto)
        if err:
            print("  No se pudo leer: " + err)
        for p in d.get(red) or []:
            ficha = p.get("ficha")
            marca = ("ficha: " + ficha["titulo"][:40]) if ficha else "** SIN FICHA **"
            copy = " ".join((p.get("copy") or "").split())[:60]
            print("  {:<13} {:<8} {}".format(hora_tijuana(p.get("cuando") or ""), p["tipo"], marca))
            if not ficha:
                print("  {:<22}{}".format("", copy))
                print("  {:<22}{}".format("", p.get("enlace") or ""))
    print()


if __name__ == "__main__":
    main()
