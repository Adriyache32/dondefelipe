# Spritesheets — Profe RPG

Inspirado en el sistema DRS/SLP de Age of Empires II.
Cada archivo PNG es un "sheet" de tiles o personajes.
El motor carga estos archivos al iniciar; si no están, usa
renderizado procedural como fallback (el juego siempre funciona).

---

## tiles-school.png (256×128)

Tiles del pasillo y salas. Cada tile = 32×32 px.

```
     Col 0      Col 1      Col 2      Col 3      Col 4      Col 5      Col 6      Col 7
Row0 [piso_1]  [piso_2]   [pared_1]  [pared_2]  [pasto]    [árbol]    [pine]     [void]
Row1 [puerta]  [escalera] [farmacia] [letrero]  [mina]     [forja]    [carpint.] [cofre]
Row2 [pizarrón][ventana]  [mesa_alu] [mesa_prof][silla]    [libro]    [mapa]     [reloj]
Row3 [suelo_cls][suelo2]  [borde_N]  [borde_S]  [borde_E]  [borde_O]  [esquina]  [columna]
```

Paleta recomendada: tonos tierra + madera para piso, gris azulado para paredes.

---

## tiles-garden.png (256×96)

Tiles del Jardín del Edén.

```
     Col 0      Col 1      Col 2      Col 3      Col 4      Col 5      Col 6      Col 7
Row0 [pasto_1]  [pasto_2]  [pasto_3]  [flor_rosa][flor_amar][flor_roja][árbol_1]  [árbol_2]
Row1 [adoquin]  [tierra]   [valla]    [valla_flr][fuente]   [banco]    [hiedra]   [musgo]
Row2 [puerta_E] [puerta_H] [sendero_N][sendero_E][cruce]    [borde]    [sombra]   [void]
```

---

## chars.png (256×160)

Personajes del juego. Cada frame = 32×32 px.

```
Frames (columnas): 0=idle_abajo  1=camina1_abajo  2=camina2_abajo
                   3=idle_arriba 4=camina1_arriba  5=camina2_arriba
                   6=batalla_1   7=batalla_2

Personajes (filas):
  Row 0: Profe Felipe (bata blanca, lentes, barba)
  Row 1: Profesora Carol (vestido rosa, pelo largo)
  Row 2: Tío Antonio (uniforme azul, placa dorada)
  Row 3: Jorge (overoles azul, pelo canoso)
  Row 4: Alumno genérico
  Row 5-7: Reservado para nuevos personajes
```

### Instrucciones de dibujo para Aseprite:

1. Nuevo archivo: 256×160 px, modo RGBA
2. Crea una capa por personaje
3. Cada frame debe ser exactamente 32×32 px (usa guías cada 32px)
4. Usa "Edit > Grid > Set Grid" → 32×32
5. Exporta como PNG con "File > Export Sprite Sheet"
   - Layout: Horizontal strip
   - Bounds: Whole canvas

---

## ui.png (256×64)

Elementos de UI e iconos de items.

```
Row 0: HUD buttons, barras HP/MP, marco de batalla
Row 1: Anticonceptivos (cols 0-9): 💊🟡🔵🔴🩹⭕💉📏🫙🧪
Row 2: Items de crafting, pociones, semillas
```

---

## Herramientas recomendadas

| Herramienta | Costo | Notas |
|---|---|---|
| **Aseprite** | ~$20 | El estándar para pixel art, exporta spritesheet directo |
| **Libresprite** | Gratis | Fork de Aseprite, igual de bueno |
| **Pixelorama** | Gratis | App web + desktop, muy amigable |
| **GIMP** | Gratis | Más general, funciona |

