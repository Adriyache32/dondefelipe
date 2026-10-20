# Ludo Chileno

Ludo para 2 a 4 equipos: Cóndores azules, Araucarias verdes, Montañas blancas y Flores moradas.
Cada equipo lo juega una persona o el computador.

## Cómo jugar
1. Necesitas Python 3.8 o una versión más nueva. No hay que instalar nada más.
2. Abre una terminal en esta carpeta y escribe `python servidor.py` (en Mac o Linux, `python3 servidor.py`). El navegador se abre solo.
3. Para cerrar, presiona `Ctrl + C` en la terminal.

No abras `ludo.html` con doble clic: usa siempre el servidor.

## Reglas (se pueden cambiar al empezar)
- Para sacar una ficha de la base hay que sacar 6 (opción: 1 o 6).
- Las fichas dan la vuelta a la pista y entran por su pasillo de color. A la meta se llega con el número exacto.
- Si caes sobre una ficha rival, la capturas y vuelve a su base. En las salidas y en las estrellas ★ no se captura.
- Con 6 se lanza otra vez; con tres 6 seguidos se pierde el turno (opcional).
- Capturar y llegar a la meta dan otro lanzamiento (opcional).
- Barreras (opcional): dos fichas del mismo equipo juntas no dejan pasar a los rivales.
- Partida rápida (opcional): 2 fichas por equipo en vez de 4.
- Desafío PAES (opcional): para capturar hay que responder bien una pregunta de `preguntas.json`.

## Archivos
- `ludo.html`: el juego (tablero, fichas, dado y ventanas).
- `ludo-logica.js`: las reglas, separadas del dibujo. Funciona en el navegador y en Node.
- `servidor.py`: muestra el juego, entrega las preguntas y guarda los resultados en `partidas.csv`.
- `preguntas.json`: las preguntas del Desafío PAES (las mismas de Ruta PAES).
- `sprites/`: fichas, bases, centro y adornos (recortados de las hojas de recursos). Detalle en `sprites/LEEME.txt`.

## El computador
- Fácil: elige cualquier jugada válida.
- Astuto: prefiere llegar a la meta, capturar, sacar fichas, entrar a su pasillo y pararse en casillas seguras, y evita las casillas donde un rival lo puede alcanzar.
