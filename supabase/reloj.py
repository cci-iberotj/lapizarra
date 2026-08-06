# -*- coding: utf-8 -*-
"""Enciende, apaga y revisa el reloj que publica solo.

    python supabase/reloj.py            ver como va
    python supabase/reloj.py apagar     dejar de publicar solo
    python supabase/reloj.py encender   volver a publicar solo

POR QUE EXISTE
Un sistema que publica sin que nadie apriete nada necesita un
interruptor que cualquiera pueda alcanzar. Si el dia que algo sale
mal hay que buscar a quien sepa SQL, el interruptor no existe.

Apagarlo NO borra nada ni cancela piezas: solo deja de publicar
solo. Todo lo demas sigue igual, y el boton de publicar a mano
sigue ahi.
"""

import io
import json
import os
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROYECTO = 'wrezcukptrtmnhnlxmao'
TRABAJO = 'pizarra-autopublicar'


def token_cuenta():
    p = os.path.join(RAIZ, 'datos', 'token_supabase.txt')
    reales = [l.strip() for l in io.open(p, encoding='utf-8')
              if l.strip() and not l.strip().startswith('#')]
    if not reales:
        sys.exit('\n  Falta el token de Supabase en %s\n' % p)
    return reales[0]


def sql(consulta):
    r = urllib.request.Request(
        'https://api.supabase.com/v1/projects/%s/database/query' % PROYECTO,
        data=json.dumps({'query': consulta}).encode(), method='POST',
        headers={'Authorization': 'Bearer ' + token_cuenta(),
                 'Content-Type': 'application/json', 'User-Agent': 'la-pizarra/1.0'})
    try:
        with urllib.request.urlopen(r, timeout=60) as x:
            return json.loads(x.read().decode() or '[]')
    except urllib.error.HTTPError as e:
        print('\n  %s\n' % e.read().decode()[:300])
        sys.exit(1)


def estado():
    f = sql("""
      select j.active,
             to_char(now() at time zone 'America/Tijuana','HH24:MI') as hora_tj,
             (select count(*) from cron.job_run_details d where d.jobid = j.jobid) as corridas,
             (select to_char(max(d.start_time) at time zone 'America/Tijuana','dd Mon HH24:MI')
              from cron.job_run_details d where d.jobid = j.jobid) as ultima
      from cron.job j where j.jobname = '%s';""" % TRABAJO)
    if not f:
        print('\n  No hay ningún reloj puesto.\n')
        return None
    return f[0]


def pintar(e):
    print('\n  El reloj está %s' % ('ENCENDIDO' if e['active'] else 'APAGADO'))
    print('  Hora de Tijuana: %s' % e['hora_tj'])
    print('  Revisiones hechas: %s%s' % (e['corridas'],
          ('   ·   última: ' + e['ultima']) if e['ultima'] else ''))
    if e['active']:
        print('\n  Revisa la parrilla cada 5 minutos y publica lo que')
        print('  este aprobado, armado para salir solo, y le haya llegado')
        print('  su hora.\n')
    else:
        print('\n  Nada se publica solo. El boton de publicar a mano sigue')
        print('  funcionando igual.\n')


def main():
    accion = (sys.argv[1] if len(sys.argv) > 1 else 'ver').lower()

    if accion in ('apagar', 'encender'):
        activo = 'true' if accion == 'encender' else 'false'
        # Se cambia con la funcion de pg_cron, no tocando su tabla:
        # la tabla no admite escritura directa desde aqui.
        sql("""select cron.alter_job(jobid, active := %s)
               from cron.job where jobname = '%s';""" % (activo, TRABAJO))
        e = estado()
        if e:
            print('\n  Listo.', end='')
            pintar(e)
        return

    if accion in ('ver', 'estado'):
        e = estado()
        if e:
            pintar(e)
        return

    print('\n  python supabase/reloj.py [ver|apagar|encender]\n')


if __name__ == '__main__':
    main()
