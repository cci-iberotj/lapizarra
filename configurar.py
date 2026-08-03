# -*- coding: utf-8 -*-
"""
CABINA - Configuracion inicial de cuentas
IBERO Tijuana

Corre esto UNA VEZ para pasar tus datos a la base y crear las tres cuentas.
Se puede volver a correr sin miedo: no duplica registros ni pisa cuentas
que ya existan.

    python configurar.py
"""

import getpass
import sys

import almacen

ROLES = {
    "1": ("coordinacion", "Coordinacion - ve y edita todo"),
    "2": ("redaccion",    "Redaccion - escribe las notas academicas"),
    "3": ("publicacion",  "Publicacion - marca las notas como publicadas"),
    "4": ("produccion",   "Produccion - sube piezas y avanza su estado"),
}


def pedir_clave(para):
    while True:
        a = getpass.getpass(f"  Contrasena para {para} (minimo 8): ")
        if len(a) < 8:
            print("  Muy corta. Intenta de nuevo.")
            continue
        b = getpass.getpass("  Repitela: ")
        if a != b:
            print("  No coinciden. Intenta de nuevo.")
            continue
        return a


def alta(usuario, nombre, rol):
    existentes = {u["usuario"] for u in almacen.listar_usuarios()}
    if usuario in existentes:
        print(f"  · {nombre} ({usuario}) ya tiene cuenta. Se deja como esta.")
        return
    print(f"\n  {nombre} — usuario: {usuario} — rol: {rol}")
    clave = pedir_clave(nombre)
    almacen.crear_usuario(usuario, nombre, rol, clave)
    print(f"  · Cuenta creada para {nombre}.")


def main():
    print("")
    print("  CABINA — configuracion inicial")
    print("  " + "-" * 44)

    almacen.preparar()

    traidos = almacen.migrar_desde_json()
    print(f"\n  Datos traidos de los archivos JSON: {traidos} registros.")
    print("  (Los .json se quedan donde estan, como respaldo.)")

    print("\n  Ahora las cuentas. Vas a escribir tres contrasenas.")
    print("  No se muestran mientras las tecleas: es normal.")

    alta("leo",     "Leo",     "coordinacion")
    alta("marysol", "Marysol", "redaccion")
    alta("sergio",  "Sergio",  "publicacion")

    print("\n  " + "-" * 44)
    print("  Cuentas registradas:")
    for u in almacen.listar_usuarios():
        print(f"    {u['usuario']:<10} {u['nombre']:<12} {u['rol']}")

    print("\n  Listo. Ya puedes abrir CABINA.")
    print("  Para agregar a alguien mas despues, vuelve a correr este script")
    print("  o pidemelo y lo agrego.\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  Cancelado. No se hizo ningun cambio irreversible.\n")
        sys.exit(1)
