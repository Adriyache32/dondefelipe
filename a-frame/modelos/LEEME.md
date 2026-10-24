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
