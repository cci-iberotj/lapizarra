# -*- coding: utf-8 -*-
"""Sube tokens a los secretos de Supabase sin abrir el navegador.

    python supabase/secretos.py

POR QUE EXISTE
Un token que publica en las redes de IBERO no se pega en un chat ni
se manda por correo: queda escrito para siempre y en un sitio que no
controlamos. Pero entrar al panel de Supabase por cada token tampoco
es razonable.

Esto es el punto medio. Pegas el token en un archivo de texto que ya
esta fuera del repositorio, corres esto, y viaja directo a los
secretos del proyecto. Nadie mas lo ve, y el archivo local se borra
en cuanto llego.

COMO SE USA
1. Abre datos/tokens_pendientes.txt (se crea solo la primera vez)
2. Pega cada token en su renglon, despues del signo igual
3. python supabase/secretos.py
4. El archivo se vacia solo

Los renglones que empiecen con # se ignoran, y los que no tengan
valor tambien: puedes subir uno hoy y otro la semana que viene sin
tocar los demas.
"""

import io
import json
import os
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROYECTO = 'wrezcukptrtmnhnlxmao'
PENDIENTES = os.path.join(RAIZ, 'datos', 'tokens_pendientes.txt')

PLANTILLA = """\
# ══════════════════════════════════════════════════════════
#  Tokens por subir a Supabase
#
#  Pega cada token despues del =, guarda, y corre:
#      python supabase/secretos.py
#
#  Este archivo NO se sube a GitHub (datos/ esta ignorada) y se
#  vacia solo en cuanto los tokens llegan a Supabase.
#
#  Los renglones vacios se saltan: sube el que tengas hoy y deja
#  los otros para despues.
# ══════════════════════════════════════════════════════════

META_TOKEN_IG=
META_TOKEN_FB=
"""


def token_cuenta():
    p = os.path.join(RAIZ, 'datos', 'token_supabase.txt')
    reales = [l.strip() for l in io.open(p, encoding='utf-8')
              if l.strip() and not l.strip().startswith('#')]
    if not reales:
        sys.exit('\n  Falta el token de Supabase en %s\n' % p)
    return reales[0]


def api(ruta, metodo='GET', cuerpo=None):
    d = json.dumps(cuerpo).encode() if cuerpo is not None else None
    r = urllib.request.Request(
        'https://api.supabase.com/v1/projects/%s%s' % (PROYECTO, ruta),
        data=d, method=metodo,
        headers={'Authorization': 'Bearer ' + token_cuenta(),
                 'Content-Type': 'application/json',
                 'User-Agent': 'la-pizarra/1.0'})
    try:
        with urllib.request.urlopen(r, timeout=60) as x:
            t = x.read().decode()
            return json.loads(t) if t.strip() else {}
    except urllib.error.HTTPError as e:
        print('  HTTP %d: %s' % (e.code, e.read().decode()[:300]))
        sys.exit(1)


def leer():
    """Lo que haya escrito, sin decir en voz alta lo que vale."""
    if not os.path.exists(PENDIENTES):
        os.makedirs(os.path.dirname(PENDIENTES), exist_ok=True)
        io.open(PENDIENTES, 'w', encoding='utf-8').write(PLANTILLA)
        print('\n  Te dejé el archivo listo:\n    %s\n' % PENDIENTES)
        print('  Pega los tokens ahí y vuelve a correr esto.\n')
        sys.exit(0)

    pares = []
    for linea in io.open(PENDIENTES, encoding='utf-8'):
        linea = linea.strip()
        if not linea or linea.startswith('#') or '=' not in linea:
            continue
        nombre, valor = linea.split('=', 1)
        nombre, valor = nombre.strip(), valor.strip()
        if nombre and valor:
            pares.append((nombre, valor))
    return pares


def main():
    pares = leer()
    if not pares:
        print('\n  No hay ningún token escrito todavía en:')
        print('    %s\n' % PENDIENTES)
        return

    print('\n  Subiendo a Supabase:')
    for nombre, valor in pares:
        # El valor NO se imprime nunca. Solo su tamaño, que basta
        # para notar un copiado a medias sin exponer nada.
        print('    %-16s %d caracteres' % (nombre, len(valor)))

    api('/secrets', 'POST', [{'name': n, 'value': v} for n, v in pares])

    puestos = {s['name'] for s in api('/secrets')}
    faltan = [n for n, _ in pares if n not in puestos]
    if faltan:
        print('\n  NO llegaron: %s\n' % ', '.join(faltan))
        sys.exit(1)

    io.open(PENDIENTES, 'w', encoding='utf-8').write(PLANTILLA)
    print('\n  Listos y comprobados. El archivo local quedó vacío.\n')


if __name__ == '__main__':
    main()
