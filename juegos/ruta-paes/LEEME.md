# Ruta PAES · De la costa a la cordillera

Un juego de tablero con dados y preguntas tipo PAES. Juegan de 1 a 4 personas en el mismo equipo.

## Cómo jugar
1. Necesitas Python 3.8 o una versión más nueva. No hay que instalar nada más.
2. Abre una terminal en esta carpeta y escribe:

       python servidor.py

   En Mac o Linux puede ser `python3 servidor.py`. El navegador se abre solo.
3. Para cerrar, presiona `Ctrl + C` en la terminal.

No abras `ruta-paes.html` con doble clic, porque el navegador bloquea la lectura de las preguntas. Usa siempre el servidor.

## Archivos
- `ruta-paes.html`: el juego (tablero, dado, fichas y preguntas).
- `preguntas.json`: el banco de preguntas. Puedes editarlo cuando quieras; el juego lo vuelve a leer en cada partida.
- `servidor.py`: muestra el juego, entrega las preguntas y guarda los resultados.
- `partidas.csv`: se crea solo al terminar la primera partida y guarda los resultados. Se abre en Excel.

## Agregar preguntas
Copia un bloque en `preguntas.json` y cambia el texto:

    {
     "eje": "Ciencias",
     "tema": "Biología · Célula",
     "enunciado": "¿Qué organelo ...?",
     "alternativas": ["...", "...", "...", "..."],
     "correcta": 1,
     "explicacion": "Porque ..."
    }

- En `correcta`, 0 es la primera alternativa, 1 la segunda, 2 la tercera y 3 la cuarta. En el juego las alternativas aparecen en otro orden.
- `eje` debe ser uno de estos: `Matemática M1`, `Competencia Lectora`, `Ciencias`, `Historia y Cs. Sociales`.
- Para comprensión lectora, agrega `"texto": "..."` con el fragmento que hay que leer.
- Para revisar que todo esté bien, escribe: `python servidor.py --revisar`

## Jugar desde otros equipos
Al iniciar, el servidor muestra una dirección como `http://192.168.x.x:8000/ruta-paes.html`.
Cualquier equipo conectado al mismo wifi puede abrirla. Si Windows pregunta por el firewall, permite el acceso en redes privadas.

## En El Mundo de Felipe
En el sitio, el juego está en `juegos/ruta-paes/ruta-paes.html` y no necesita Python: lee `preguntas.json` directamente.
Al terminar, cada estudiante toca su nombre, entra con su cuenta y su puntaje queda en el ranking (`rankings.html`).
Sus respuestas por eje (M1, Lectora, Ciencias, Historia) llegan al panel del profe.
Con `servidor.py` el juego funciona sin internet, por ejemplo en la sala, y los resultados se guardan en `partidas.csv`.
