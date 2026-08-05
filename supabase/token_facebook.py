# -*- coding: utf-8 -*-
"""Convierte un token corto de Facebook en uno que no caduca.

    python supabase/token_facebook.py

POR QUE HACE FALTA
El token que da el Explorador dura un par de horas. Sirve para
probar y para nada mas: se muere el mismo dia y el boton de publicar
deja de funcionar sin avisar.

El camino bueno son tres pasos que Meta no junta en ningun boton:

  1. un token de USUARIO corto  ->  token de usuario LARGO (60 dias)
  2. con ese, pedir los tokens de las PAGINAS que administras
  3. el token de pagina que sale de ahi NO caduca

Esto hace los tres de un tiron y sube el resultado a Supabase. Ni el
token ni la clave secreta se imprimen nunca ni salen de esta
computadora mas que hacia Meta y Supabase.

QUE HAY QUE PEGAR
Se crea datos/facebook_token.txt con tres renglones. El de arriba
es el que suele confundirse: tiene que ser token de USUARIO, no de
pagina -- el intercambio solo funciona con el de usuario.
"""

import io
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVO = os.path.join(RAIZ, 'datos', 'facebook_token.txt')
FB = 'https://graph.facebook.com'

sys.path.insert(0, os.path.join(RAIZ, 'supabase'))
import secretos as S

PLANTILLA = """\
# ══════════════════════════════════════════════════════════
#  Convertir el token corto de Facebook en uno permanente
#
#  1. Identificador y clave secreta de la app:
#     developers.facebook.com -> La Pizarra Paginas
#     -> Configuracion de la app -> Basica
#     (la clave secreta esta detras del boton "Mostrar")
#
#  2. Token CORTO, en el Explorador de la API Graph:
#     - App: La Pizarra Paginas
#     - Usuario o pagina: "Obtener token de acceso de USUARIO"
#       OJO: de USUARIO, no de pagina. Es al reves que la vez
#       pasada; el intercambio solo funciona con el de usuario.
#     - Permisos: pages_show_list, pages_read_engagement,
#       pages_manage_posts
#     - Generar token
#
#  3. Guarda este archivo y corre:
#       python supabase/token_facebook.py
#
#  Este archivo se borra solo en cuanto termine.
# ══════════════════════════════════════════════════════════

FB_APP_ID=
FB_APP_SECRET=
FB_TOKEN_CORTO=
"""


def leer():
    if not os.path.exists(ARCHIVO):
        os.makedirs(os.path.dirname(ARCHIVO), exist_ok=True)
        io.open(ARCHIVO, 'w', encoding='utf-8').write(PLANTILLA)
        print('\n  Te dejé el archivo con las instrucciones:\n    %s\n' % ARCHIVO)
        sys.exit(0)

    d = {}
    for linea in io.open(ARCHIVO, encoding='utf-8'):
        linea = linea.strip()
        if linea and not linea.startswith('#') and '=' in linea:
            n, v = linea.split('=', 1)
            if v.strip():
                d[n.strip()] = v.strip()

    faltan = [k for k in ('FB_APP_ID', 'FB_APP_SECRET', 'FB_TOKEN_CORTO') if k not in d]
    if faltan:
        print('\n  Faltan por llenar: %s' % ', '.join(faltan))
        print('  Están en:\n    %s\n' % ARCHIVO)
        sys.exit(1)
    return d


def api(ruta, **params):
    url = FB + ruta + '?' + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=60) as x:
            return json.loads(x.read().decode())
    except urllib.error.HTTPError as e:
        d = json.loads(e.read().decode() or '{}')
        m = (d.get('error') or {}).get('message', 'error %d' % e.code)
        print('\n  Meta dijo: %s\n' % m)
        sys.exit(1)


def main():
    d = leer()
    print('\n  1. Cambiando el token corto por uno largo…')
    largo = api('/oauth/access_token',
                grant_type='fb_exchange_token',
                client_id=d['FB_APP_ID'],
                client_secret=d['FB_APP_SECRET'],
                fb_exchange_token=d['FB_TOKEN_CORTO'])['access_token']

    print('  2. Pidiendo los tokens de tus páginas…')
    paginas = api('/me/accounts', access_token=largo,
                  fields='id,name,access_token,tasks').get('data', [])
    if not paginas:
        print('\n  Ese usuario no administra ninguna página.\n')
        sys.exit(1)

    for i, p in enumerate(paginas, 1):
        tareas = ', '.join(p.get('tasks') or []) or 'sin tareas'
        print('     %d) %s  [%s]' % (i, p['name'], tareas.lower()))

    # Se puede decir por nombre para no tener que estar presente:
    #     python supabase/token_facebook.py "Ibero Tijuana"
    pedida = sys.argv[1].strip().lower() if len(sys.argv) > 1 else ''
    coinciden = [x for x in paginas if x['name'].strip().lower() == pedida]

    if coinciden:
        elegida = coinciden[0]
        print('\n     Elegida por nombre: %s' % elegida['name'])
    elif pedida:
        sys.exit('\n  No administras ninguna página que se llame «%s».\n' % sys.argv[1])
    elif len(paginas) == 1:
        elegida = paginas[0]
    else:
        # No adivinar cual: publicar en la pagina equivocada no se
        # deshace. Se elige por numero.
        print()
        n = input('  Cuál es la de IBERO Tijuana (número): ').strip()
        try:
            elegida = paginas[int(n) - 1]
        except Exception:
            sys.exit('\n  Número no válido.\n')

    print('\n  3. Comprobando que el token de «%s» no caduque…' % elegida['name'])
    info = api('/debug_token', input_token=elegida['access_token'],
               access_token=largo).get('data', {})
    caduca = info.get('expires_at')
    if caduca:
        import datetime
        cuando = datetime.datetime.fromtimestamp(caduca)
        print('     OJO: todavía caduca el %s' % cuando.strftime('%d-%b-%Y'))
        print('     Suele pasar si el token corto era de PÁGINA y no de usuario.')
    else:
        print('     Bien: no caduca.')

    faltan = [t for t in ('CREATE_CONTENT',) if t not in (info.get('scopes') or [])
              and t not in (elegida.get('tasks') or [])]
    if faltan:
        print('     Aviso: la página no reporta permiso de crear contenido.')

    S.api('/secrets', 'POST', [{'name': 'META_TOKEN_FB',
                                'value': elegida['access_token']}])
    puestos = {x['name'] for x in S.api('/secrets')}
    if 'META_TOKEN_FB' not in puestos:
        sys.exit('\n  No llegó a Supabase.\n')

    io.open(ARCHIVO, 'w', encoding='utf-8').write(PLANTILLA)
    print('\n  Listo. El token de «%s» ya está en Supabase.' % elegida['name'])
    print('  El archivo local quedó vacío.\n')


if __name__ == '__main__':
    main()
