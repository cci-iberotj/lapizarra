# -*- coding: utf-8 -*-
"""Sube los commits pendientes a GitHub por su API.

    python empujar.py

POR QUE EXISTE
La red de IBERO tiene bloqueado github.com en el puerto 443
(140.82.112.3 no abre), pero api.github.com si responde. git push va
por el primero; esto va por el segundo y llega igual. Comprobado el
4 de agosto de 2026, con git push fallando cuatro veces seguidas.

Reconstruye cada commit con la API de datos de Git -- blob, arbol,
commit y referencia -- asi que el historial queda con sus commits
separados y no aplastado en uno solo.

LO QUE HAY QUE SABER
El sha del commit CAMBIA: se rehace del otro lado, aunque el
contenido sea identico. Y como aqui tampoco se puede hacer fetch
--mismo bloqueo-- el repositorio local se queda diciendo "ahead 1"
para siempre. Es cosmetico. Para no perder la cuenta, este script
anota en .git/ultimo-empujado-por-api hasta donde llego, medido en
shas LOCALES.

Cuando la red vuelva a la normalidad, esto lo arregla de una vez:
    git fetch origin && git reset --hard origin/main
"""

import base64
import io
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.abspath(__file__))
REPO = 'cci-iberotj/lapizarra'
RAMA = 'main'
MARCA = os.path.join(RAIZ, '.git', 'ultimo-empujado-por-api')


def git(*args):
    r = subprocess.run(['git'] + list(args), cwd=RAIZ, capture_output=True,
                       text=True, encoding='utf-8', errors='replace')
    return r.stdout.strip()


def credencial():
    r = subprocess.run(['git', 'credential', 'fill'], cwd=RAIZ,
                       input='protocol=https\nhost=github.com\n\n',
                       capture_output=True, text=True)
    for l in r.stdout.splitlines():
        if l.startswith('password='):
            return l.split('=', 1)[1]
    raise SystemExit('  No hay credencial de GitHub guardada.')


TOKEN = credencial()


def api(ruta, metodo='GET', cuerpo=None):
    d = json.dumps(cuerpo).encode() if cuerpo is not None else None
    r = urllib.request.Request(
        'https://api.github.com' + ruta, data=d, method=metodo,
        headers={'Authorization': 'Bearer ' + TOKEN,
                 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28',
                 'User-Agent': 'la-pizarra'})
    try:
        with urllib.request.urlopen(r, timeout=120) as x:
            t = x.read().decode()
            return json.loads(t) if t.strip() else {}
    except urllib.error.HTTPError as e:
        print('  HTTP %d en %s' % (e.code, ruta))
        print('  ' + e.read().decode()[:400])
        sys.exit(1)


def desde_donde(remoto):
    """Desde que commit LOCAL hay que empujar."""
    if git('cat-file', '-t', remoto) == 'commit':
        return remoto                      # la red esta bien, hubo fetch
    if os.path.exists(MARCA):
        anotado = io.open(MARCA, encoding='utf-8').read().strip()
        if git('cat-file', '-t', anotado) == 'commit':
            print('  ultimo empujado (sha local): %s' % anotado[:7])
            return anotado
    print('\n  No se de donde partir: el sha remoto no existe aqui y no')
    print('  hay marca previa. Escribe en este archivo el sha local del')
    print('  ultimo commit que ya este en GitHub:')
    print('    %s\n' % MARCA)
    sys.exit(1)


def main():
    remoto = api('/repos/%s/git/ref/heads/%s' % (REPO, RAMA))['object']['sha']
    print('\n  remoto: %s' % remoto[:7])

    pendientes = git('rev-list', '--reverse', '%s..HEAD' % desde_donde(remoto)).split()
    if not pendientes:
        print('  Nada pendiente.\n')
        return
    print('  pendientes: %d commit(s)\n' % len(pendientes))

    padre = remoto
    for sha in pendientes:
        mensaje = git('log', '-1', '--format=%B', sha)
        cambios = git('diff-tree', '--no-commit-id', '--name-status', '-r', sha)

        arbol = []
        for linea in cambios.splitlines():
            partes = linea.split('\t')
            estado, ruta = partes[0], partes[-1]
            if estado.startswith('D'):
                arbol.append({'path': ruta, 'mode': '100644',
                              'type': 'blob', 'sha': None})
                print('    - %s' % ruta)
                continue
            with open(os.path.join(RAIZ, ruta), 'rb') as f:
                datos = f.read()
            blob = api('/repos/%s/git/blobs' % REPO, 'POST',
                       {'content': base64.b64encode(datos).decode(),
                        'encoding': 'base64'})
            arbol.append({'path': ruta, 'mode': '100644',
                          'type': 'blob', 'sha': blob['sha']})
            print('    + %s (%.0f KB)' % (ruta, len(datos) / 1024))

        base = api('/repos/%s/git/commits/%s' % (REPO, padre))['tree']['sha']
        nuevo = api('/repos/%s/git/trees' % REPO, 'POST',
                    {'base_tree': base, 'tree': arbol})
        commit = api('/repos/%s/git/commits' % REPO, 'POST',
                     {'message': mensaje, 'tree': nuevo['sha'], 'parents': [padre]})
        padre = commit['sha']
        print('    -> %s  %s\n' % (padre[:7], mensaje.splitlines()[0][:58]))

    api('/repos/%s/git/refs/heads/%s' % (REPO, RAMA), 'PATCH', {'sha': padre})
    io.open(MARCA, 'w', encoding='utf-8').write(git('rev-parse', 'HEAD'))

    print('  rama actualizada a %s' % padre[:7])
    print('  La publicacion arranca sola; tarda cerca de un minuto.\n')


if __name__ == '__main__':
    main()
