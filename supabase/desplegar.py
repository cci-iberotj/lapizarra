# -*- coding: utf-8 -*-
"""Sube una funcion de servidor a Supabase.

    python supabase/desplegar.py administrar
    python supabase/desplegar.py publicar

Usa la API de administracion, asi que no hace falta el CLI de
Supabase (que ademas pide Docker). Solo stdlib de Python.

El codigo de las funciones vive en supabase/funciones/<nombre>/,
dentro del repositorio, para que se pueda leer y versionar como
cualquier otra cosa. Lo unico que NO vive ahi son los secretos:
esos van por supabase/secretos.py y solo existen del lado del
servidor.
"""

import io
import json
import os
import sys
import urllib.error
import urllib.request
import uuid

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROYECTO = 'wrezcukptrtmnhnlxmao'


def token_cuenta():
    p = os.path.join(RAIZ, 'datos', 'token_supabase.txt')
    reales = [l.strip() for l in io.open(p, encoding='utf-8')
              if l.strip() and not l.strip().startswith('#')]
    if not reales:
        sys.exit('\n  Falta el token de Supabase en %s\n' % p)
    return reales[0]


def multipartes(campos, archivo):
    """Arma un cuerpo multipart a mano: es lo unico que acepta el
    punto de despliegue, y no vale la pena una dependencia por esto."""
    linde = '----lapizarra' + uuid.uuid4().hex
    trozos = []
    for nombre, valor in campos.items():
        trozos.append(('--%s\r\n' % linde).encode())
        trozos.append(('Content-Disposition: form-data; name="%s"\r\n' % nombre).encode())
        trozos.append(b'Content-Type: application/json\r\n\r\n')
        trozos.append(valor.encode('utf-8') + b'\r\n')

    nombre, contenido = archivo
    trozos.append(('--%s\r\n' % linde).encode())
    trozos.append(('Content-Disposition: form-data; name="file"; filename="%s"\r\n' % nombre).encode())
    trozos.append(b'Content-Type: application/typescript\r\n\r\n')
    trozos.append(contenido.encode('utf-8') + b'\r\n')
    trozos.append(('--%s--\r\n' % linde).encode())
    return b''.join(trozos), 'multipart/form-data; boundary=' + linde


def main():
    if len(sys.argv) < 2:
        print('\n  python supabase/desplegar.py <nombre-de-la-funcion>\n')
        sys.exit(1)

    slug = sys.argv[1]
    ruta = os.path.join(RAIZ, 'supabase', 'funciones', slug, 'index.ts')
    if not os.path.exists(ruta):
        sys.exit('\n  No existe: %s\n' % ruta)

    codigo = io.open(ruta, encoding='utf-8').read()
    print('\n  %s  ·  %.1f KB' % (slug, len(codigo.encode('utf-8')) / 1024))

    cuerpo, tipo = multipartes(
        {'metadata': json.dumps({'name': slug, 'entrypoint_path': 'index.ts',
                                 'verify_jwt': False})},
        ('index.ts', codigo))

    r = urllib.request.Request(
        'https://api.supabase.com/v1/projects/%s/functions/deploy?slug=%s' % (PROYECTO, slug),
        data=cuerpo, method='POST',
        headers={'Authorization': 'Bearer ' + token_cuenta(),
                 'Content-Type': tipo, 'User-Agent': 'la-pizarra/1.0'})
    try:
        with urllib.request.urlopen(r, timeout=180) as x:
            d = json.loads(x.read().decode() or '{}')
    except urllib.error.HTTPError as e:
        print('  HTTP %d: %s\n' % (e.code, e.read().decode()[:500]))
        sys.exit(1)

    print('  version %s · %s' % (d.get('version'), d.get('status')))
    print('  https://%s.supabase.co/functions/v1/%s\n' % (PROYECTO, slug))


if __name__ == '__main__':
    main()
