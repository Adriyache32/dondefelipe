# Modelos 3D de los mundos

Cada especie tiene dos archivos `.glb`:

| Archivo | Uso |
|---|---|
| `quillay.glb` | Modelo completo (se ve de cerca) |
| `quillay-lejos.glb` | Versión simplificada (se ve de lejos) |

## Requisitos de un modelo

- Metros, eje Y hacia arriba, origen en la base del tronco.
- Mallas con nombre (`Tronco`, `Ramas`, `Follaje`): el viento, el tinte y los colores se aplican por nombre.
- Colores por material, sin texturas. Ideal: 1.000–2.000 triángulos.

## Cómo se genera la versión `-lejos`

Con [glTF-Transform](https://gltf-transform.dev) y meshoptimizer (Node):

```
npm i @gltf-transform/core @gltf-transform/functions meshoptimizer
node lod.mjs quillay.glb quillay-lejos.glb Follaje=0.12 Ramas=0.4 Tronco=1
```

`lod.mjs` suelda vértices y simplifica cada malla con la proporción indicada
(el follaje se reduce mucho; el tronco casi nada porque ya es simple).

| Modelo | Completo | Lejos |
|---|---|---|
| Quillay | 1.216 triángulos | 396 |
| Peumo | 2.624 triángulos | 402 |

## Construcciones (casas, cabañas): `optimizar.mjs`

Un modelo hecho de muchas piezas sueltas (la cabaña trae 44) se dibujaría con una
llamada por pieza. `optimizar.mjs` las funde por material en **2 mallas**: `Cuerpo`
(colores por vértice) y `Vidrio` (transparente), y con `--lejos` genera además una
versión sin interior ni molduras.

```
node optimizar.mjs cabana_original.glb cabana.glb --lejos cabana-lejos.glb
```

| Modelo | Original | Optimizado | Lejos |
|---|---|---|---|
| Cabaña | 44 piezas | 2 mallas · 506 triángulos | 2 mallas · 182 triángulos |

Corrección aplicada al original: las aguas del techo venían invertidas (en «V»);
el script las refleja. Colisiones y piso de la cabaña se declaran en `bosque.js`.
