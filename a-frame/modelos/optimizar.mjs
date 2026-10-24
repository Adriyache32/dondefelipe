// Prepara una construcción hecha de muchas piezas (cabaña, casa) para instanciarla en un mundo.
//
// Uso:
//   node optimizar.mjs original.glb salida.glb [--lejos salida-lejos.glb] [--plano 2] [--alto 1.3]
//
// Qué hace:
//   1. Agranda la construcción: --plano multiplica largo y ancho; --alto, la altura de muros y
//      techo (medida desde el piso). Los MUEBLES no se agrandan: solo se reubican, así la cama
//      y la mesa conservan su tamaño humano dentro de una cabaña más grande.
//   2. Quita la puerta fija del modelo (la puerta la pone el motor, y se abre al acercarse).
//   3. Agrega una cumbrera (viga del techo) que cierra la franja entre las dos aguas.
//   4. Funde todas las piezas en 2 mallas: «Cuerpo» (colores por vértice) y «Vidrio».
//   5. Escribe salida.choca.json con la FÍSICA: cajas de colisión (muros y muebles),
//      superficies pisables y el vano de la puerta. El motor la aplica a cada copia,
//      con su giro y su escala.
//   6. --lejos: versión sin interior ni molduras, para verla de lejos.
//
// Requiere: npm i @gltf-transform/core @gltf-transform/functions
import { NodeIO } from '@gltf-transform/core';
import { flatten, join, weld, dedup, prune } from '@gltf-transform/functions';
import fs from 'fs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [entrada, salida] = args;
const salidaLejos = opt('--lejos', null);
const PLANO = +opt('--plano', 1), ALTO = +opt('--alto', 1);

const VIDRIO = /glass|vidrio/i;
const MUEBLE = /^(bed|mattress|pillow|table|chair|rug|fireplace)/i;
const QUITAR = /^(open_door|door_knob)$/i;                 // puerta fija del modelo: la reemplaza el motor
const DETALLE = /frame|trim|mullion|window_(horizontal|vertical)/i;   // se omite en la versión lejana
const PISO = /floor|platform/i;
const MURO = /wall/i;

async function procesar(destino, lejos) {
  const io = new NodeIO();
  const doc = await io.read(entrada);
  const raiz = doc.getRoot();
  const nodos = raiz.listNodes().filter(n => n.getMesh());

  // altura del piso interior (tope de la pieza «Interior_wood_floor» o de la plataforma)
  const caja = n => { const a = n.getMesh().listPrimitives()[0].getAttribute('POSITION'); return { min: a.getMin([]), max: a.getMax([]) }; };
  const pisoInt = nodos.find(n => /interior.*floor/i.test(n.getName())) || nodos.find(n => PISO.test(n.getName()));
  const F = pisoInt ? caja(pisoInt).max[1] : 0;

  // ---- 1. agrandar (casco) / reubicar (muebles); 2. quitar puerta fija; 6. omitir interior
  for (const n of nodos) {
    const nom = n.getName();
    if (QUITAR.test(nom) || (lejos && (MUEBLE.test(nom) || DETALLE.test(nom) || /interior/i.test(nom)))) { n.dispose(); continue; }
    const c = caja(n), cx = (c.min[0] + c.max[0]) / 2, cz = (c.min[2] + c.max[2]) / 2;
    for (const p of n.getMesh().listPrimitives()) {
      const pos = p.getAttribute('POSITION'), arr = pos.getArray().slice();
      for (let i = 0; i < arr.length; i += 3) {
        if (MUEBLE.test(nom)) { arr[i] += cx * (PLANO - 1); arr[i + 2] += cz * (PLANO - 1); }
        else {
          arr[i] *= PLANO; arr[i + 2] *= PLANO;
          if (arr[i + 1] > F) arr[i + 1] = F + (arr[i + 1] - F) * ALTO;
        }
      }
      p.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(arr).setBuffer(pos.getBuffer()));
    }
  }
  let vivos = raiz.listNodes().filter(n => n.getMesh());

  // Corrección del modelo original: las dos aguas del techo venían invertidas (en «V»).
  // Se reflejan en X dentro de su ancho y se invierte el orden de los triángulos.
  for (const n of vivos.filter(n => /^roof_(left|right)$/i.test(n.getName()))) {
    for (const p of n.getMesh().listPrimitives()) {
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

  // ---- 3. cumbrera: caja a lo largo del techo, del color del techo
  const techo = vivos.find(n => /^roof_left$/i.test(n.getName()));
  const molde = vivos.find(n => PISO.test(n.getName()));   // una caja de 8 vértices (orden x,y,z binario)
  if (techo && molde) {
    const ct = caja(techo), pt = techo.getMesh().listPrimitives()[0], pm = molde.getMesh().listPrimitives()[0];
    const yTop = ct.max[1], largo = ct.max[2], an = 0.22 * PLANO;
    const v = [];
    for (let i = 0; i < 8; i++) v.push(i & 4 ? an : -an, i & 2 ? yTop + 0.12 : yTop - 0.28, i & 1 ? largo : -largo);
    const col = pt.getAttribute('COLOR_0');
    const prim = doc.createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(v)).setBuffer(pm.getAttribute('POSITION').getBuffer()))
      .setIndices(pm.getIndices());
    if (col) {
      const raw = col.getArray(), k = col.getElementSize(), c0 = raw.slice(0, k), carr = new raw.constructor(8 * k);
      for (let i = 0; i < 8; i++) carr.set(c0, i * k);
      prim.setAttribute('COLOR_0', doc.createAccessor().setType(col.getType()).setArray(carr).setNormalized(col.getNormalized()).setBuffer(col.getBuffer()));
    }
    const nodo = doc.createNode('Ridge').setMesh(doc.createMesh('Ridge').addPrimitive(prim));
    techo.getParentNode() ? techo.getParentNode().addChild(nodo) : raiz.listScenes()[0].addChild(nodo);
  }
  vivos = raiz.listNodes().filter(n => n.getMesh());

  // ---- 5. física (solo con la versión completa)
  if (!lejos) {
    const r2 = x => Math.round(x * 1000) / 1000;
    const fisica = { cajas: [], suelos: [], puertas: [] };
    const grupos = {};   // muebles: unir piezas de un mismo mueble (Bed_frame + Bed_mattress…)
    for (const n of vivos) {
      const nom = n.getName(), c = caja(n);
      const b = { dx: r2((c.min[0] + c.max[0]) / 2), dz: r2((c.min[2] + c.max[2]) / 2), ancho: r2(c.max[0] - c.min[0]), largo: r2(c.max[2] - c.min[2]) };
      if (PISO.test(nom)) fisica.suelos.push(Object.assign(b, { alto: r2(c.max[1]) }));
      else if (MURO.test(nom) && !VIDRIO.test(nom) && c.max[1] - c.min[1] > 1) fisica.cajas.push(Object.assign(b, { base: 0, alto: r2(c.max[1]) }));
      else if (MUEBLE.test(nom) && !/rug|pillow/i.test(nom)) {
        const g = nom.split('_')[0].toLowerCase();
        const u = grupos[g] = grupos[g] || { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
        for (let k = 0; k < 3; k++) { u.min[k] = Math.min(u.min[k], c.min[k]); u.max[k] = Math.max(u.max[k], c.max[k]); }
      }
    }
    for (const g in grupos) {
      const c = grupos[g];
      fisica.cajas.push({ dx: r2((c.min[0] + c.max[0]) / 2), dz: r2((c.min[2] + c.max[2]) / 2), ancho: r2(c.max[0] - c.min[0]), largo: r2(c.max[2] - c.min[2]), base: 0, alto: r2(c.max[1]), mueble: g });
    }
    // vano de la puerta: entre los dos muros del frente, bajo el dintel
    const fi = vivos.find(n => /front_wall_left/i.test(n.getName())), fd = vivos.find(n => /front_wall_right/i.test(n.getName()));
    const di = vivos.find(n => /front_wall_header/i.test(n.getName()));
    if (fi && fd) {
      const a = caja(fi), b = caja(fd), x0 = a.max[0], x1 = b.min[0];
      fisica.puertas.push({ x0: r2(x0), x1: r2(x1), z: r2((a.min[2] + a.max[2]) / 2), base: r2(F), alto: r2((di ? caja(di).min[1] : a.max[1]) - F), grosor: 0.08 });
    }
    fs.writeFileSync(destino.replace(/\.glb$/, '.choca.json'), JSON.stringify(fisica, null, 1));
    console.log('física:', fisica.cajas.length, 'cajas ·', fisica.suelos.length, 'suelos ·', fisica.puertas.length, 'puerta(s)');
  }

  // ---- 4. fundir por material en «Cuerpo» y «Vidrio»
  const cuerpo = doc.createMaterial('Cuerpo').setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.9).setMetallicFactor(0);
  const vidrio = doc.createMaterial('Vidrio').setBaseColorFactor([1, 1, 1, 0.45]).setAlphaMode('BLEND')
    .setRoughnessFactor(0.1).setMetallicFactor(0).setDoubleSided(true);
  for (const n of vivos) for (const p of n.getMesh().listPrimitives()) p.setMaterial(VIDRIO.test(n.getName()) ? vidrio : cuerpo);
  await doc.transform(flatten(), dedup(), join({ keepNamed: false, keepMeshes: false }), weld({ tolerance: 0.0001 }), prune());
  for (const n of raiz.listNodes()) {
    const m = n.getMesh(); if (!m) continue;
    const nombre = m.listPrimitives()[0].getMaterial() === vidrio ? 'Vidrio' : 'Cuerpo';
    n.setName(nombre); m.setName(nombre);
  }
  const tri = raiz.listMeshes().map(m => m.getName() + ': ' + m.listPrimitives().reduce((s, p) => s + p.getIndices().getCount() / 3, 0));
  console.log(destino, '→', raiz.listMeshes().length, 'mallas ·', tri.join(' · '));
  await io.write(destino, doc);
}

await procesar(salida, false);
if (salidaLejos) await procesar(salidaLejos, true);
