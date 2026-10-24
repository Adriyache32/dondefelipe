// Genera la versión simplificada («-lejos») de un modelo .glb, malla por malla.
// Uso: node lod.mjs quillay.glb quillay-lejos.glb Follaje=0.12 Ramas=0.4 Tronco=1
// Requiere: npm i @gltf-transform/core @gltf-transform/functions meshoptimizer
import { NodeIO } from '@gltf-transform/core';
import { weld, dedup, prune, simplifyPrimitive } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';

const [, , entrada, salida, ...pares] = process.argv;
const proporcion = Object.fromEntries(pares.map(p => p.split('=')).map(([k, v]) => [k, +v]));
const io = new NodeIO();
const doc = await io.read(entrada);
await MeshoptSimplifier.ready;

const triangulos = () => doc.getRoot().listMeshes()
  .map(m => m.getName() + ': ' + m.listPrimitives().reduce((s, p) => s + p.getIndices().getCount() / 3, 0));
console.log('antes   ', triangulos().join(' · '));

await doc.transform(weld({ tolerance: 0.001 }));   // unir vértices repetidos: sin esto no se puede simplificar
for (const malla of doc.getRoot().listMeshes()) {
  const ratio = proporcion[malla.getName()] ?? 0.5;
  for (const prim of malla.listPrimitives()) {
    simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio, error: 0.08, lockBorder: false });
  }
}
await doc.transform(dedup(), prune());
console.log('después ', triangulos().join(' · '));
await io.write(salida, doc);
