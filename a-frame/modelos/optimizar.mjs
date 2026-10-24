// Optimiza un modelo hecho de muchas piezas (casas, cabañas, muebles) para instanciarlo:
// agrupa las piezas por material y las FUNDE en pocas mallas (menos llamadas de dibujo).
// Uso: node optimizar.mjs cabana_original.glb cabana.glb [--lejos cabana-lejos.glb]
//   - Las piezas con «glass» en el nombre van a la malla «Vidrio» (transparente); el resto a «Cuerpo».
//   - --lejos: además genera una versión sin interior ni detalles (para verla de lejos).
// Requiere: npm i @gltf-transform/core @gltf-transform/functions
import { NodeIO } from '@gltf-transform/core';
import { flatten, join, weld, dedup, prune } from '@gltf-transform/functions';

const [, , entrada, salida, flag, salidaLejos] = process.argv;
const VIDRIO = /glass|vidrio/i;
const INTERIOR = /bed|mattress|pillow|table|chair|rug|fireplace|interior|knob|frame|trim|mullion|window_(horizontal|vertical)/i;

async function procesar(destino, sinInterior) {
  const io = new NodeIO();
  const doc = await io.read(entrada);
  const raiz = doc.getRoot();
  const madera = doc.createMaterial('Cuerpo').setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.9).setMetallicFactor(0);
  const vidrio = doc.createMaterial('Vidrio').setBaseColorFactor([1, 1, 1, 0.45]).setAlphaMode('BLEND')
    .setRoughnessFactor(0.1).setMetallicFactor(0).setDoubleSided(true);
  // Corrección del modelo original: las dos aguas del techo venían invertidas (altas en el
  // alero y bajas en la cumbrera, en «V»). Se reflejan en X dentro de su propio ancho y se
  // invierte el orden de los triángulos para que las caras sigan mirando hacia afuera.
  for (const nodo of raiz.listNodes()) {
    if (!/^roof_(left|right)$/i.test(nodo.getName()) || !nodo.getMesh()) continue;
    for (const p of nodo.getMesh().listPrimitives()) {
      const pos = p.getAttribute('POSITION'), arr = pos.getArray().slice();
      let mn = Infinity, mx = -Infinity;
      for (let i = 0; i < arr.length; i += 3) { mn = Math.min(mn, arr[i]); mx = Math.max(mx, arr[i]); }
      for (let i = 0; i < arr.length; i += 3) arr[i] = mn + mx - arr[i];
      p.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arr).setBuffer(pos.getBuffer()));
      const idx = p.getIndices().getArray().slice();
      for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
      p.setIndices(doc.createAccessor().setType('SCALAR').setArray(idx).setBuffer(p.getIndices().getBuffer()));
    }
  }
  for (const nodo of raiz.listNodes()) {
    const m = nodo.getMesh(); if (!m) continue;
    if (sinInterior && INTERIOR.test(nodo.getName())) { nodo.dispose(); continue; }
    for (const p of m.listPrimitives()) p.setMaterial(VIDRIO.test(nodo.getName()) ? vidrio : madera);
  }
  await doc.transform(flatten(), dedup(), join({ keepNamed: false, keepMeshes: false }), weld({ tolerance: 0.0001 }), prune());
  for (const nodo of raiz.listNodes()) {
    const m = nodo.getMesh(); if (!m) continue;
    const mat = m.listPrimitives()[0].getMaterial();
    const nombre = mat === vidrio ? 'Vidrio' : 'Cuerpo';
    nodo.setName(nombre); m.setName(nombre);
  }
  const tri = raiz.listMeshes().map(m => m.getName() + ': ' + m.listPrimitives().reduce((s, p) => s + p.getIndices().getCount() / 3, 0));
  console.log(destino, '→', raiz.listMeshes().length, 'mallas ·', tri.join(' · '));
  await io.write(destino, doc);
}
await procesar(salida, false);
if (flag === '--lejos' && salidaLejos) await procesar(salidaLejos, true);
