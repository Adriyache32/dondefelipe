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

```
node optimizar.mjs cabana_original.glb cabana.glb --lejos cabana-lejos.glb --plano 2 --alto 1.3
```

- **Funde** las piezas sueltas (la cabaña trae 44) en 2 mallas: `Cuerpo` y `Vidrio`.
- **Agranda** la construcción (`--plano` largo y ancho, `--alto` altura) sin agrandar los
  muebles: solo los reubica, así conservan su tamaño humano.
- **Quita la puerta fija** del modelo: el motor pone una puerta doble que se abre al acercarse.
- **Cierra el techo** con una cumbrera y corrige las aguas invertidas del original.
- **Escribe la física** en `cabana.choca.json`: muros y muebles (colisión), pisos (pisables)
  y el vano de la puerta. El motor la aplica a cada copia con su giro y escala.

| Cabaña | Piezas | Triángulos | Tamaño |
|---|---|---|---|
| Original | 44 | 640 | 5,5 × 6,5 m |
| `cabana.glb` | 2 mallas | 494 | 11 × 13 m |
| `cabana-lejos.glb` | 2 mallas | 182 | sin interior |

En el mundo: `cabana: { url, lejos, fisica: 'modelos/cabana.choca.json', tinte: { Cuerpo: 0.22 } }`
y cada copia es un objeto `{ modelo: 'cabana', pos, giro }`.
