# -*- coding: utf-8 -*-
"""Sube un archivo a la cubeta 'piezas' de Supabase.

    python supabase/subir.py "ruta/al/archivo.jpg" id-de-la-pieza

Usa el token de administracion, asi que sirve para cargar cosas
desde aqui sin pasar por la aplicacion. Lo normal es que la gente
suba desde la ficha de la pieza; esto es para el trabajo que ya
estaba hecho antes de que existiera el almacenamiento.
"""

import io
import json
import mimetypes
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROYECTO = 'wrezcukptrtmnhnlxmao'
BASE = 'https://%s.supabase.co' % PROYECTO
CUBETA = 'piezas'


def token_admin():
    p = os.path.join(RAIZ, 'datos', 'token_supabase.txt')
    reales = [l.strip() for l in io.open(p, encoding='utf-8')
              if l.strip() and not l.strip().startswith('#')]
    if not reales:
        print('\n  Falta el token en %s\n' % p)
        sys.exit(1)
    return reales[0]


def llave_de_servicio():
    """La cubeta es privada: subir necesita una llave con permiso.
    Se pide a la API de administracion en el momento y NO se guarda
    en ningun archivo."""
    r = urllib.request.Request(
        'https://api.supabase.com/v1/projects/%s/api-keys?reveal=true' % PROYECTO,
        headers={'Authorization': 'Bearer ' + token_admin(),
                 'User-Agent': 'la-pizarra/1.0'})
    with urllib.request.urlopen(r, timeout=40) as x:
        llaves = json.loads(x.read())
    for k in llaves:
        if k.get('name') == 'service_role' or k.get('type') == 'secret':
            return k.get('api_key') or k.get('secret')
    raise SystemExit('  No encontre la llave de servicio.')


def limpiar(nombre):
    """Un nombre de archivo que sobreviva a una URL: sin acentos, sin
    espacios, sin mayusculas. Los espacios rompen la peticion y los
    acentos rompen a alguien mas dentro de seis meses."""
    base, ext = os.path.splitext(nombre)
    base = unicodedata.normalize('NFKD', base)
    base = base.encode('ascii', 'ignore').decode('ascii')
    base = re.sub(r'[^A-Za-z0-9]+', '-', base).strip('-').lower()
    return (base or 'archivo') + ext.lower()


def subir(ruta, destino):
    tipo = mimetypes.guess_type(ruta)[0] or 'application/octet-stream'
    with open(ruta, 'rb') as f:
        cuerpo = f.read()

    llave = llave_de_servicio()
    url = '%s/storage/v1/object/%s/%s' % (
        BASE, CUBETA, urllib.parse.quote(destino))
    r = urllib.request.Request(url, data=cuerpo, method='POST', headers={
        'Authorization': 'Bearer ' + llave,
        'apikey': llave,
        'Content-Type': tipo,
        'x-upsert': 'true',
        'User-Agent': 'la-pizarra/1.0',
    })
    try:
        with urllib.request.urlopen(r, timeout=180) as x:
            return json.loads(x.read().decode() or '{}'), tipo, len(cuerpo)
    except urllib.error.HTTPError as e:
        print('  HTTP %d: %s' % (e.code, e.read().decode()[:300]))
        sys.exit(1)


def main():
    if len(sys.argv) < 3:
        print('\n  python supabase/subir.py "archivo" id-de-la-pieza\n')
        sys.exit(1)

    ruta = sys.argv[1]
    idpieza = sys.argv[2]
    if not os.path.exists(ruta):
        print('\n  No existe: %s\n' % ruta)
        sys.exit(1)

    nombre = limpiar(os.path.basename(ruta))
    destino = '%s/%s' % (idpieza, nombre)

    print('\n  Subiendo %s (%.0f KB)...' % (nombre, os.path.getsize(ruta) / 1024))
    resp, tipo, peso = subir(ruta, destino)
    print('  Listo.')
    print('    ruta:  %s' % destino)
    print('    tipo:  %s' % tipo)
    print('    peso:  %.0f KB' % (peso / 1024))
    print('\n  Se descarga desde la ficha de la pieza, con la sesion de')
    print('  quien entra. La cubeta es privada: sin sesion no se abre.\n')


if __name__ == '__main__':
    main()
