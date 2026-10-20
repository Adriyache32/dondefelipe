#!/usr/bin/env python3
"""
Ludo Chileno · servidor local del juego (solo usa la biblioteca estándar de Python 3.8+).

Uso:
    python servidor.py                 abre el juego en el navegador
    python servidor.py --revisar       solo revisa preguntas.json y sale
    python servidor.py --puerto 8080   usa otro puerto
    python servidor.py --sin-navegador no abre el navegador

Qué hace:
    · Sirve ludo.html y sus archivos (incluidos los sprites de la carpeta sprites/).
    · GET  /api/preguntas  preguntas del "Desafío PAES" (preguntas.json, se relee siempre).
    · POST /api/partida    guarda el resultado de cada equipo en partidas.csv.
    · GET  /api/ranking    victorias por nombre (solo personas, no el computador).
"""
import argparse
import csv
import json
import socket
import sys
import threading
import webbrowser
from collections import Counter
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

CARPETA = Path(__file__).resolve().parent
PREGUNTAS = CARPETA / "preguntas.json"
PARTIDAS = CARPETA / "partidas.csv"
PAGINA = "ludo.html"
CAMPOS = ["fecha", "nombre", "equipo", "tipo", "puesto", "capturas", "en_meta", "lanzamientos"]
candado = threading.Lock()


# ─────────────────────────── preguntas ───────────────────────────
def problemas_de(p):
    """Devuelve una lista con los problemas de una pregunta (vacía si está bien)."""
    errores = []
    if not isinstance(p, dict):
        return ["no es un objeto {...}"]
    for campo in ("eje", "enunciado", "explicacion"):
        if not str(p.get(campo, "")).strip():
            errores.append(f"falta '{campo}'")
    alt = p.get("alternativas")
    if not isinstance(alt, list) or len(alt) != 4 or not all(str(a).strip() for a in alt):
        errores.append("debe tener exactamente 4 alternativas con texto")
    c = p.get("correcta")
    if not isinstance(c, int) or isinstance(c, bool) or not 0 <= c <= 3:
        errores.append("'correcta' debe ser 0, 1, 2 o 3 (A, B, C o D)")
    return errores


def cargar_preguntas():
    try:
        datos = json.loads(PREGUNTAS.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return [], [f"No encuentro {PREGUNTAS.name}"]
    except json.JSONDecodeError as e:
        return [], [f"{PREGUNTAS.name} tiene un error de formato en la línea {e.lineno}: {e.msg}"]
    if not isinstance(datos, list):
        return [], [f"{PREGUNTAS.name} debe ser una lista [ ... ]"]
    validas, errores = [], []
    for i, p in enumerate(datos, 1):
        prob = problemas_de(p)
        if prob:
            errores.append(f"Pregunta {i}: " + "; ".join(prob))
        else:
            validas.append(p)
    return validas, errores


def revisar():
    validas, errores = cargar_preguntas()
    if not PREGUNTAS.exists():
        print(f"\n📝 Sin {PREGUNTAS.name}: el Desafío PAES quedará desactivado.")
        return True
    print(f"\n📝 {PREGUNTAS.name}: {len(validas)} preguntas válidas (Desafío PAES)")
    for eje, n in Counter(p["eje"] for p in validas).most_common():
        print(f"   · {eje}: {n}")
    letras = Counter("ABCD"[p["correcta"]] for p in validas)
    print("   Respuestas correctas por letra:", ", ".join(f"{k}={letras[k]}" for k in "ABCD"))
    if errores:
        print(f"\n⚠️  {len(errores)} con problemas (no se usarán):")
        for e in errores:
            print("   -", e)
    return not errores


# ─────────────────────────── partidas ───────────────────────────
def limpiar_nombre(s):
    s = " ".join(str(s or "").split())[:30]
    return s or "Sin nombre"


def entero(v, minimo=0, maximo=100000):
    try:
        return max(minimo, min(maximo, int(v)))
    except (TypeError, ValueError):
        return 0


def guardar_partida(datos):
    jugadores = datos.get("jugadores") if isinstance(datos, dict) else None
    if not isinstance(jugadores, list) or not 2 <= len(jugadores) <= 4:
        raise ValueError("Se esperaban entre 2 y 4 equipos")
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M")
    filas = [{
        "fecha": fecha,
        "nombre": limpiar_nombre(j.get("nombre")),
        "equipo": limpiar_nombre(j.get("equipo")),
        "tipo": "cpu" if j.get("tipo") == "cpu" else "humano",
        "puesto": entero(j.get("puesto"), 1, 4),
        "capturas": entero(j.get("capturas"), 0, 500),
        "en_meta": entero(j.get("enMeta"), 0, 4),
        "lanzamientos": entero(j.get("lanzamientos"), 0, 5000),
    } for j in jugadores if isinstance(j, dict)]
    with candado:
        nuevo = not PARTIDAS.exists()
        with PARTIDAS.open("a", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=CAMPOS)
            if nuevo:
                w.writeheader()
            w.writerows(filas)
    return len(filas)


def ranking(n=10):
    """Victorias por nombre, contando solo a las personas."""
    if not PARTIDAS.exists():
        return []
    with candado, PARTIDAS.open(encoding="utf-8") as f:
        filas = list(csv.DictReader(f))
    tabla = {}
    for r in filas:
        if r.get("tipo") == "cpu":
            continue
        t = tabla.setdefault(r.get("nombre", "?"), {"nombre": r.get("nombre", "?"), "victorias": 0, "partidas": 0, "capturas": 0})
        t["partidas"] += 1
        t["capturas"] += entero(r.get("capturas"))
        if entero(r.get("puesto")) == 1:
            t["victorias"] += 1
    lista = sorted(tabla.values(), key=lambda t: (t["victorias"], t["capturas"]), reverse=True)
    return lista[:n]


# ─────────────────────────── servidor ───────────────────────────
class Manejador(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(CARPETA), **kwargs)

    def log_message(self, formato, *args):
        if "/api/" in str(args[0] if args else ""):
            sys.stderr.write("  ↳ %s\n" % (formato % args))

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, obj, codigo=200):
        cuerpo = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def do_GET(self):
        ruta = self.path.split("?", 1)[0]
        if ruta == "/":
            self.send_response(302)
            self.send_header("Location", "/" + PAGINA)
            self.end_headers()
            return
        if ruta == "/api/preguntas":
            validas, errores = cargar_preguntas()
            for e in errores:
                print("  ⚠️ ", e)
            return self._json(validas)
        if ruta == "/api/ranking":
            return self._json(ranking())
        if ruta.endswith(".csv") or ruta.endswith(".py"):
            return self.send_error(403)
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?", 1)[0] != "/api/partida":
            return self.send_error(404)
        largo = entero(self.headers.get("Content-Length"), 0, 10**6)
        if largo > 20000:
            return self._json({"ok": False, "error": "demasiado grande"}, 413)
        try:
            datos = json.loads(self.rfile.read(largo) or b"{}")
            n = guardar_partida(datos)
        except (ValueError, json.JSONDecodeError) as e:
            return self._json({"ok": False, "error": str(e)}, 400)
        print(f"  💾 Partida guardada ({n} jugador/es) en {PARTIDAS.name}")
        return self._json({"ok": True})


def ip_local():
    """IP en la red wifi, para jugar desde otros equipos (no envía datos)."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("10.255.255.255", 1))
            return s.getsockname()[0]
    except OSError:
        return None


def main():
    ap = argparse.ArgumentParser(description="Servidor local de Ludo Chileno")
    ap.add_argument("--puerto", type=int, default=8000)
    ap.add_argument("--revisar", action="store_true", help="solo revisa preguntas.json")
    ap.add_argument("--sin-navegador", action="store_true")
    a = ap.parse_args()

    ok = revisar()
    if a.revisar:
        sys.exit(0 if ok else 1)

    try:
        srv = ThreadingHTTPServer(("0.0.0.0", a.puerto), Manejador)
    except OSError:
        sys.exit(f"\n❌ El puerto {a.puerto} está ocupado. Prueba: python servidor.py --puerto 8080")

    url = f"http://localhost:{a.puerto}/{PAGINA}"
    print(f"\n🎲 Ludo Chileno listo en  {url}")
    ip = ip_local()
    if ip and not ip.startswith("127."):
        print(f"   Desde otro equipo en la misma red:  http://{ip}:{a.puerto}/{PAGINA}")
    print("   Ctrl + C para cerrar.\n")
    if not a.sin_navegador:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Servidor cerrado.")
        srv.server_close()


if __name__ == "__main__":
    main()
