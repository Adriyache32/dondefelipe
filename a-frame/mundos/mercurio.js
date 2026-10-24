/* =============================================================================
   MUNDO: mercurio — la superficie del planeta más cercano al Sol
   Primer astro del sistema solar. Parámetros reales de Mercurio.
   ============================================================================= */
window.MUNDO = window.MUNDO || {};
if (!MUNDO.forma)  MUNDO.forma  = function () {};
if (!MUNDO.animar) MUNDO.animar = function () {};
if (!MUNDO.grupos) MUNDO.grupos = {};

/* ---------------------------------------------------------------- FORMAS */

// Cráter de impacto: anillo elevado con centro hundido
MUNDO.forma('crater', function (H, color, b, ob) {
  var r = (ob && ob.radio) ? ob.radio : H.azar(2, 5);
  var n = 16;
  for (var i = 0; i < n; i++) {
    var a = i / n * 6.2832;
    var h = H.azar(0.4, 0.9) * (r * 0.18);
    H.pieza('esferaB', color, 'solido', b,
      [Math.cos(a) * r, h * 0.4, Math.sin(a) * r],
      [0, a * 57.3, H.azar(-12, 12)], [r * 0.28, h, r * 0.28], 0);
  }
  // piso hundido del cráter (un poco más oscuro)
  H.pieza('circulo', '#5a5652', 'lamina', b, [0, 0.03, 0], [-90, 0, 0], [r * 0.85, r * 0.85, 1], 0);
}, 2);

// Roca / peñasco suelto
MUNDO.forma('penasco', function (H, color, b) {
  var t = H.azar(0.4, 1.6);
  H.pieza('esferaB', color, 'solido', b, [0, t * 0.35, 0],
    [H.azar(0, 40), H.azar(0, 360), H.azar(0, 40)], [t, t * 0.7, t * H.azar(0.7, 1.3)], 0);
}, 1.8);

// Bandera-hito con placa de datos (marcador del sitio)
MUNDO.forma('hito', function (H, color, b) {
  H.pieza('poste', '#c8ccce', 'metal', b, [0, 0, 0], [0, 0, 0], [0.08, 3, 0.08], 0);
  H.pieza('caja', color, 'solido', b, [0.6, 2.6, 0], [0, 0, 0], [1.3, 0.8, 0.04], 0);
}, 3.4);


// Escarpe (rupes): acantilado largo y curvo, rasgo típico de Mercurio
MUNDO.forma('escarpe', function (H, color, b, ob) {
  var largo = (ob && ob.largo) ? ob.largo : 40;
  var alto = (ob && ob.alto) ? ob.alto : 4;
  var seg = 14;
  for (var i = 0; i < seg; i++) {
    var t = i / seg;
    var z = -largo/2 + t * largo;
    var curva = Math.sin(t * Math.PI) * 6;   // arqueado
    var h = alto * (0.7 + 0.3 * Math.sin(t * 6.28));
    H.pieza('caja', color, 'solido', b, [curva, h/2, z], [0, H.azar(-8,8), H.azar(-6,6)],
      [H.azar(3,5), h, largo/seg + 0.5], 0);
    // cara iluminada del acantilado
    H.pieza('caja', '#9a918688', 'solido', b, [curva + 1.6, h/2, z], [0, 0, -18],
      [0.3, h*1.1, largo/seg + 0.5], 0);
  }
}, 4);

// Pico central de cráter grande
MUNDO.forma('picoCentral', function (H, color, b) {
  var h = H.azar(2, 3.5);
  H.pieza('cono', color, 'solido', b, [0, h/2, 0], [0, H.azar(0,360), 0], [1.6, h, 1.6], 0);
  H.pieza('cono', '#6e675f', 'solido', b, [0.3, h*0.4, 0.2], [0, 0, 12], [0.9, h*0.7, 0.9], 0);
}, 3.5);

// Depósito brillante (material fresco de cráter reciente, como Kuiper)
MUNDO.forma('rayos', function (H, color, b, ob) {
  var n = (ob && ob.rayos) ? ob.rayos : 8;
  for (var i = 0; i < n; i++) {
    var a = i / n * 6.2832 + H.azar(-0.2, 0.2);
    var largo = H.azar(4, 9);
    H.pieza('caja', '#d8d2c4', 'lamina', b,
      [Math.cos(a) * largo/2, 0.04, Math.sin(a) * largo/2],
      [-90, a * 57.3, 0], [H.azar(0.4, 0.8), largo, 1], 0);
  }
  H.pieza('circulo', '#e4ddce', 'lamina', b, [0, 0.05, 0], [-90, 0, 0], [1.6, 1.6, 1], 0);
}, 1);

// Bloque de hielo en sombra polar (los cráteres polares tienen hielo)
MUNDO.forma('hielo', function (H, color, b) {
  var t = H.azar(0.3, 0.8);
  H.pieza('esferaB', '#c8d8e0', 'solido', b, [0, t*0.3, 0],
    [H.azar(0,30), H.azar(0,360), 0], [t, t*0.5, t], 0);
}, 1.2);


// Base Discovery: hábitat presurizado GRANDE con paredes sólidas opacas.
// Las hojas de la puerta van a subgrupos para abrirse automáticamente.
/* ---------------------------------------------------------------------------
   BASE DISCOVERY · JARDÍN TERRESTRE
   Un invernadero sellado bajo una cúpula geodésica de vidrio: adentro ya se
   controla la atmósfera (aire, presión, temperatura) y crece un pequeño bosque
   con huerto y estanque. Afuera sigue Mercurio tal cual: vacío y regolito.
   - Lo sólido (zócalo, puerta, bancales, faroles) va con H.pieza (instanciado).
   - Cúpula, pasto, estanque y plantas (sprites) se arman aparte en _jardin():
     son pocas mallas grandes, una sola llamada de dibujo para todas las plantas.
   --------------------------------------------------------------------------- */
var JARDIN = {
  R: 16, ALTO: 5,         // radio del hábitat y altura del muro (la puerta mide eso)
  ZOCALO: 1.3,            // muro bajo opaco; encima, vidrio
  PISO: 0.71,             // altura del piso interior (y mundial)
  ANILLO: 9.6,            // radio del sendero circular
  ESTANQUE: { x: -2.6, z: -5.6, r: 2.1 },
  BANCALES: [[5.2, 1.7], [5.2, 3.4], [5.2, 5.1]],   // centros (x,z) del huerto
  // Árboles grandes (sprite, x, z, alto en metros). Lejos de la puerta (+z),
  // de los aparatos y del sendero.
  ARBOLES: [
    ['arbol2', -4.5, -12.4, 6.6], ['arbol_rojo', 4.8, -12.6, 6.2],
    ['arbol1', 12.2, -4.6, 6.2], ['pino_alto', -12.2, -5.4, 6.8],
    ['arbol3', -12.4, 3.6, 6.4], ['pino1', 12.8, 2.4, 5], ['pino2', 12.0, 6.6, 4.6],
    ['pino3', -7.6, 11.6, 4.8], ['arbol2', 7.8, 10.8, 5.6], ['arbolito2', -1.2, -13.4, 2.6],
    ['arbolito3', 9.4, -9.6, 2.3], ['arbolito1', -9.6, -9.0, 2.1], ['pino2', 0.4, -14.2, 4.4]
  ]
};
// Aparatos y zonas que las plantas no deben tapar (x, z, radio libre)
JARDIN.LIBRES = [[-6, -8, 1.7], [-10, 0, 1.9], [-9, 7, 2.0], [8, -6, 2.4]];

// Rectángulos del atlas jardin-mercurio.webp (x, y, ancho, alto en píxeles)
var ATLAS_JARDIN = { w: 1024, h: 528, img: 'mundos/img/jardin-mercurio.webp', r: {
  pino_alto: [3, 3, 104, 207], arbol3: [110, 3, 121, 204], arbol_rojo: [234, 3, 136, 203],
  arbol2: [373, 3, 154, 202], arbol1: [530, 3, 143, 195], rocas_musgo: [676, 3, 288, 189],
  helecho: [3, 213, 126, 152], pino1: [132, 213, 80, 138], pino2: [215, 213, 72, 132],
  pino3: [290, 213, 71, 132], copihue: [364, 213, 112, 130], arbolito2: [479, 213, 84, 102],
  helecho_roca: [566, 213, 164, 96], tronco: [733, 213, 165, 96], arbusto: [901, 213, 107, 94],
  palmita: [3, 368, 72, 92], arbolito3: [78, 368, 78, 91], flores_bl2: [159, 368, 110, 87],
  pasto3: [272, 368, 109, 82], pasto1: [384, 368, 119, 79], flores_bl: [506, 368, 118, 78],
  arbolito1: [627, 368, 65, 78], flores_am: [695, 368, 95, 70], flor_roja: [793, 368, 66, 64],
  pasto2: [862, 368, 90, 64], pasto4: [3, 463, 88, 62], hongos: [94, 463, 94, 58],
  arbusto2: [191, 463, 109, 58] } };

// Colisión: muro + troncos de los árboles grandes (relativo a la base en 0,0)
var MUROS_BASE = (function () {
  var R = JARDIN.R, seg = 44, muros = [];
  for (var i = 0; i < seg; i++) {
    var a = i / seg * 6.2832;
    if (Math.abs(a - Math.PI/2) < 0.18) continue;   // hueco de la puerta (alineado con el muro visual)
    muros.push({ r: 1.3, dx: Math.cos(a) * R, dz: Math.sin(a) * R, alto: 5, base: 0 });
  }
  JARDIN.ARBOLES.forEach(function (t) {
    if (t[3] >= 4) muros.push({ r: 0.35, dx: t[1], dz: t[2], alto: 3, base: 0 });
  });
  return muros;
})();

MUNDO.forma('habitat', function (H, color, b, ob) {
  var R = JARDIN.R, ALTO = JARDIN.ALTO, Z = JARDIN.ZOCALO;
  var pref = (ob && ob.id) ? ob.id : 'base';
  var P = JARDIN.PISO - 0.05;            // piso interior relativo a la base


  // ZÓCALO: muro bajo opaco, blanco con franja naranja (como los módulos)
  var seg = 40, ancho = 2*Math.PI*R/seg + 0.25;
  for (var i = 0; i < seg; i++) {
    var a = i / seg * 6.2832;
    if (Math.abs(a - Math.PI/2) < 0.18) continue;
    var x = Math.cos(a) * R, z = Math.sin(a) * R, g = a*57.3 + 90;
    H.pieza('caja', '#e6e4de', 'solido', b, [x, P + Z/2, z], [0, g, 0], [ancho, Z, 0.45], 0);
    H.pieza('caja', '#e07a2e', 'solido', b, [x, P + Z - 0.22, z], [0, g, 0], [ancho, 0.16, 0.47], 0);
    // jardinera corrida por dentro del muro
    H.pieza('caja', '#6b4a2f', 'solido', b, [Math.cos(a)*(R-0.75), P + 0.22, Math.sin(a)*(R-0.75)], [0, g, 0], [ancho - 0.1, 0.44, 0.9], 0);
    H.pieza('caja', '#3b2a1c', 'solido', b, [Math.cos(a)*(R-0.75), P + 0.45, Math.sin(a)*(R-0.75)], [0, g, 0], [ancho - 0.2, 0.04, 0.8], 0);
  }

  // MARCO Y PUERTA al frente (+z), con dos hojas correderas (subgrupos del motor)
  var zP = R;
  H.pieza('caja', '#e6e4de', 'solido', b, [-2.3, ALTO/2 + 0.3, zP], [0,0,0], [0.5, ALTO + 0.6, 0.8], 0);
  H.pieza('caja', '#e6e4de', 'solido', b, [2.3, ALTO/2 + 0.3, zP], [0,0,0], [0.5, ALTO + 0.6, 0.8], 0);
  H.pieza('caja', '#e6e4de', 'solido', b, [0, ALTO + 0.25, zP], [0,0,0], [5.1, 0.9, 0.8], 0);
  H.pieza('caja', '#e07a2e', 'solido', b, [0, ALTO + 0.25, zP + 0.41], [0,0,0], [5.1, 0.18, 0.02], 0);
  H.pieza('caja', '#4affa0', 'brillo', b, [0, ALTO - 0.15, zP + 0.42], [0,0,0], [1.2, 0.22, 0.02], 0);
  _hojaBase(H, b, [-1, ALTO/2 - 0.3, zP], pref + '_pA', '#d8dadc');
  _hojaBase(H, b, [1, ALTO/2 - 0.3, zP], pref + '_pB', '#d8dadc');

  // HUERTO: bancales de madera con tierra y hortalizas
  JARDIN.BANCALES.forEach(function (c, k) {
    H.pieza('caja', '#7a5534', 'solido', b, [c[0], P + 0.22, c[1]], [0,0,0], [3, 0.44, 1.1], 0);
    H.pieza('caja', '#3b2a1c', 'solido', b, [c[0], P + 0.45, c[1]], [0,0,0], [2.8, 0.04, 0.9], 0);
    for (var j = 0; j < 7; j++) {
      var px = c[0] - 1.2 + j * 0.4;
      if (k === 1) {   // tomates: tutor + mata
        H.pieza('poste', '#a08060', 'solido', b, [px, P + 0.45, c[1]], [0,0,0], [0.02, 0.8, 0.02], 0);
        H.pieza('esfera', '#3f8a34', 'follaje', b, [px, P + 0.8, c[1]], [0, j*40, 0], [0.17, 0.28, 0.17], 0.05);
        H.pieza('esferaB', '#d8402e', 'solido', b, [px + 0.08, P + 0.72, c[1] + 0.1], [0,0,0], [0.05, 0.05, 0.05], 0);
      } else {         // lechugas
        H.pieza('esfera', k ? '#7cc24a' : '#5fae3a', 'follaje', b, [px, P + 0.56, c[1] - 0.18], [0, j*50, 0], [0.16, 0.11, 0.16], 0.03);
        H.pieza('esfera', k ? '#6db842' : '#8ccf52', 'follaje', b, [px + 0.2, P + 0.56, c[1] + 0.2], [0, j*70, 0], [0.15, 0.1, 0.15], 0.03);
      }
    }
  });

  // FAROLES del sendero (luz cálida que no depende del sol)
  for (var f = 0; f < 6; f++) {
    var fa = (f + 0.5) / 6 * 6.2832;
    var fx = Math.cos(fa) * (JARDIN.ANILLO + 0.95), fz = Math.sin(fa) * (JARDIN.ANILLO + 0.95);
    H.pieza('poste', '#3d4248', 'metal', b, [fx, P, fz], [0,0,0], [0.05, 2.2, 0.05], 0);
    H.pieza('esferaB', '#ffe6a8', 'brillo', b, [fx, P + 2.3, fz], [0,0,0], [0.2, 0.2, 0.2], 0);
  }
  // bancas junto a la plaza
  [[-2.4, 2.4, 45], [2.4, -2.4, 45]].forEach(function (s) {
    H.pieza('caja', '#8a6240', 'solido', b, [s[0], P + 0.45, s[1]], [0, s[2], 0], [1.6, 0.08, 0.45], 0);
    H.pieza('caja', '#4a4f55', 'metal', b, [s[0], P + 0.22, s[1]], [0, s[2], 0], [1.4, 0.44, 0.1], 0);
  });

  _jardin(ob);
}, 6);

// Una hoja de puerta de la base (panel opaco), en subgrupo posicionable
function _hojaBase(H, b, off, grupo, color) {
  H.pieza('caja', color, 'metal', b, off, [0, 0, 0], [2, 4, 0.18], 0, grupo);
  H.pieza('caja', '#7fb8d0', 'solido', b, [off[0], off[1]+0.4, off[2]], [0,0,0], [1.2, 1.4, 0.2], 0, grupo);
}

/* ---------------------------------------------------------------------------
   _jardin(): cúpula, pasto, estanque, plantas y estrellas. Se agrega una vez
   a la escena cuando A-Frame está listo. */
function _jardin(ob) {
  var escena = document.getElementById('escena');
  if (!escena || !window.THREE) return;
  var hacer = function () {
    if (MUNDO._jardin) { escena.object3D.remove(MUNDO._jardin); }
    var g = new THREE.Group(); g.name = 'jardin-mercurio';
    var bx = ob && ob.pos ? ob.pos[0] : 0, bz = ob && ob.pos ? ob.pos[2] : 0;
    g.position.set(bx, 0, bz);
    g.add(_explanada());
    g.add(_pastoJardin());
    g.add(_estanqueJardin());
    _cupulaJardin(g);
    g.add(_plantasJardin());
    escena.object3D.add(g);
    escena.object3D.add(_estrellas());
    // el piso cuadrado de colisión queda invisible: lo cubre la explanada redonda
    document.querySelectorAll('a-box.suelo').forEach(function (bx) {
      if (+bx.getAttribute('width') !== 32 || Math.abs(bx.object3D.position.x - (ob && ob.pos ? ob.pos[0] : 0)) > 0.1) return;
      var mm = bx.getObject3D('mesh'); if (mm) { mm.material.colorWrite = false; mm.material.depthWrite = false; }
    });
    MUNDO._jardin = g;
  };
  if (escena.hasLoaded) hacer(); else escena.addEventListener('loaded', hacer);
}

// EXPLANADA redonda de hormigón alrededor de la cúpula, con franja naranja
// (cubre el piso cuadrado de colisión que pone el motor, que queda invisible)
function _explanada() {
  var g = new THREE.Group(), top = JARDIN.PISO;
  var m = new THREE.Mesh(new THREE.CylinderGeometry(23, 23.6, top + 0.3, 64),
    new THREE.MeshStandardMaterial({ color: '#8f8a82', roughness: 0.95 }));
  m.position.y = (top - 0.3) / 2 - 0.001; g.add(m);
  var f = new THREE.Mesh(new THREE.RingGeometry(21.9, 22.3, 64), new THREE.MeshBasicMaterial({ color: '#e07a2e' }));
  f.rotation.x = -Math.PI / 2; f.position.y = top + 0.004; g.add(f);
  return g;
}

// Generador pseudoaleatorio fijo (el jardín se ve igual siempre)
function _rngJardin(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

// PISO: un solo disco con textura pintada (pasto, senderos, tierra del huerto)
function _pastoJardin() {
  var N = 1024, R = JARDIN.R, c = document.createElement('canvas'); c.width = c.height = N;
  var x = c.getContext('2d'), k = N / (2 * R), rnd = _rngJardin(4242);
  var P = function (v) { return N / 2 + v * k; };
  x.fillStyle = '#4f8a32'; x.fillRect(0, 0, N, N);
  // manchas de pasto (claras y oscuras) y briznas: un solo trazo por color (rápido)
  ['rgba(98,150,52,0.22)', 'rgba(46,96,34,0.22)'].forEach(function (col) {
    x.fillStyle = col;
    for (var i = 0; i < 1300; i++) {
      var r = 6 + rnd() * 26, cx = rnd() * N, cy = rnd() * N;
      x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.fill();
    }
  });
  x.lineWidth = 1.4;
  ['#6fae45', '#3f7a2a', '#86c057', '#2f6424'].forEach(function (col) {
    x.strokeStyle = col; x.beginPath();
    for (var i = 0; i < 6500; i++) {
      var px = rnd() * N, py = rnd() * N, l = 3 + rnd() * 5;
      x.moveTo(px, py); x.lineTo(px + (rnd() - 0.5) * 3, py - l);
    }
    x.stroke();
  });
  // senderos de maicillo: anillo, plaza central y camino a la puerta
  var sendero = function (dibuja, ancho) {
    x.lineCap = 'round';
    x.strokeStyle = '#8a7a5e'; x.lineWidth = (ancho + 0.25) * k; x.beginPath(); dibuja(); x.stroke();
    x.strokeStyle = '#c2b08a'; x.lineWidth = ancho * k; x.beginPath(); dibuja(); x.stroke();
  };
  sendero(function () { x.arc(N/2, N/2, JARDIN.ANILLO * k, 0, 6.2832); }, 1.3);
  sendero(function () { x.moveTo(P(0), P(2.6)); x.lineTo(P(0), P(R)); }, 1.8);
  sendero(function () { x.moveTo(P(-2), P(-2)); x.lineTo(P(-6.9), P(-6.9)); }, 1.0);
  x.fillStyle = '#8a7a5e'; x.beginPath(); x.arc(N/2, N/2, 3.15 * k, 0, 6.2832); x.fill();
  x.fillStyle = '#c9b892'; x.beginPath(); x.arc(N/2, N/2, 3.0 * k, 0, 6.2832); x.fill();
  // grano del maicillo
  for (var i = 0; i < 9000; i++) {
    var gx = rnd() * N, gy = rnd() * N;
    var dx = (gx - N/2) / k, dz = (gy - N/2) / k, rr = Math.sqrt(dx*dx + dz*dz);
    var enSendero = rr < 3 || Math.abs(rr - JARDIN.ANILLO) < 0.65 || (Math.abs(dx) < 0.9 && dz > 2.6);
    if (!enSendero) continue;
    x.fillStyle = rnd() < 0.5 ? 'rgba(120,104,78,0.5)' : 'rgba(236,224,196,0.5)';
    x.fillRect(gx, gy, 2, 2);
  }
  // losetas de la plaza
  x.strokeStyle = 'rgba(110,96,70,0.55)'; x.lineWidth = 2;
  for (i = 1; i < 3; i++) { x.beginPath(); x.arc(N/2, N/2, i * 1.0 * k, 0, 6.2832); x.stroke(); }
  for (i = 0; i < 12; i++) { var aa = i / 12 * 6.2832; x.beginPath(); x.moveTo(N/2 + Math.cos(aa)*k, N/2 + Math.sin(aa)*k); x.lineTo(N/2 + Math.cos(aa)*3*k, N/2 + Math.sin(aa)*3*k); x.stroke(); }
  // tierra bajo el huerto y orilla del estanque
  x.fillStyle = '#5a4130';
  JARDIN.BANCALES.forEach(function (b) { x.fillRect(P(b[0] - 1.7), P(b[1] - 0.75), 3.4 * k, 1.5 * k); });
  var E = JARDIN.ESTANQUE;
  x.fillStyle = '#5d6a4a'; x.beginPath(); x.arc(P(E.x), P(E.z), (E.r + 0.45) * k, 0, 6.2832); x.fill();
  var tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  var m = new THREE.Mesh(new THREE.CircleGeometry(R - 0.2, 64),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 }));
  m.rotation.x = -Math.PI / 2;   // arriba del lienzo = -z (fondo del jardín)
  m.position.y = JARDIN.PISO + 0.012;
  return m;
}

// ESTANQUE: agua con brillo + piedras alrededor (una malla instanciada)
function _estanqueJardin() {
  var E = JARDIN.ESTANQUE, g = new THREE.Group(), rnd = _rngJardin(77);
  var agua = new THREE.Mesh(new THREE.CircleGeometry(E.r, 40),
    new THREE.MeshStandardMaterial({ color: '#2f7f9a', roughness: 0.06, metalness: 0.35, emissive: '#0c2a36' }));
  agua.rotation.x = -Math.PI / 2; agua.position.set(E.x, JARDIN.PISO + 0.03, E.z);
  g.add(agua);
  var n = 22, piedras = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, flatShading: true }), n);
  var m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (var i = 0; i < n; i++) {
    var a = i / n * 6.2832 + rnd() * 0.2, s = 0.22 + rnd() * 0.25;
    e.set(rnd() * 3, rnd() * 3, rnd() * 3); q.setFromEuler(e);
    m.compose(new THREE.Vector3(E.x + Math.cos(a) * (E.r + 0.1), JARDIN.PISO + s * 0.35, E.z + Math.sin(a) * (E.r + 0.1)),
      q, new THREE.Vector3(s * 1.3, s * 0.7, s));
    piedras.setMatrixAt(i, m);
    var v = 0.8 + rnd() * 0.3; piedras.setColorAt(i, new THREE.Color().setRGB(0.62 * v, 0.64 * v, 0.56 * v));
  }
  g.add(piedras);
  return g;
}

// CÚPULA GEODÉSICA: vidrio facetado sobre un muro de vidrio, con armazón blanco.
// Por dentro, una capa de "cielo" celeste semitransparente: la atmósfera
// controlada se ve azul desde adentro y como una burbuja desde afuera.
function _cupulaJardin(g) {
  var R = JARDIN.R, y0 = JARDIN.PISO + JARDIN.ZOCALO - 0.05, yT = JARDIN.PISO + JARDIN.ALTO - 0.05;
  var RD = R + 0.05, HD = R * 0.62, gap = 0.18;          // radio y alto de la cúpula
  var vidrio = new THREE.MeshStandardMaterial({ color: '#cfeeff', transparent: true, opacity: 0.16,
    roughness: 0.05, metalness: 0.3, side: THREE.FrontSide, depthWrite: false, flatShading: true });
  // (solo cara externa: desde adentro se ve la capa de cielo, una capa transparente menos que pintar)
  // muro de vidrio (cilindro abierto con el hueco de la puerta en +z)
  var muro = new THREE.Mesh(new THREE.CylinderGeometry(RD, RD, yT - y0, 40, 1, true, gap, 6.2832 - 2 * gap), vidrio);
  muro.position.y = (y0 + yT) / 2; g.add(muro);
  // cúpula: media esfera de pocos segmentos = facetas tipo geodésica
  var SEG = 20, ANI = 7;
  var domo = new THREE.Mesh(new THREE.SphereGeometry(1, SEG, ANI * 2, 0, 6.2832, 0, Math.PI / 2), vidrio);
  domo.scale.set(RD, HD, RD); domo.position.y = yT; g.add(domo);
  // cielo interior (degradado celeste, solo cara interna)
  var cielo = new THREE.SphereGeometry(1, 32, 12, 0, 6.2832, 0, Math.PI / 2);
  var col = [], pos = cielo.attributes.position, alto = new THREE.Color('#3a82d4'), bajo = new THREE.Color('#a8d6f2'), t = new THREE.Color();
  for (var i = 0; i < pos.count; i++) { t.copy(bajo).lerp(alto, Math.pow(Math.max(0, pos.getY(i)), 0.7)); col.push(t.r, t.g, t.b); }
  cielo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  var mc = new THREE.Mesh(cielo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.82,
    side: THREE.BackSide, depthWrite: false, fog: false }));
  mc.scale.set(RD - 0.3, HD - 0.3, RD - 0.3); mc.position.y = yT; mc.renderOrder = -1; g.add(mc);
  // franja de cielo en el muro (para que el horizonte interior también sea claro)
  var cm = new THREE.Mesh(new THREE.CylinderGeometry(RD - 0.3, RD - 0.3, yT - y0, 40, 1, true, gap, 6.2832 - 2 * gap),
    new THREE.MeshBasicMaterial({ color: '#a8d6f2', transparent: true, opacity: 0.72, side: THREE.BackSide, depthWrite: false, fog: false }));
  cm.position.y = (y0 + yT) / 2; cm.renderOrder = -1; g.add(cm);

  // ARMAZÓN: barras blancas instanciadas (meridianos, paralelos y diagonales)
  var barras = [];
  var punto = function (a, f) {   // f: 0 ecuador … 1 cénit
    var phi = f * Math.PI / 2;
    return new THREE.Vector3(Math.cos(a) * Math.cos(phi) * RD, yT + Math.sin(phi) * HD, Math.sin(a) * Math.cos(phi) * RD);
  };
  for (var s = 0; s < SEG; s++) {
    for (var r = 0; r < ANI; r++) {
      var a0 = s / SEG * 6.2832 + (r % 2) * Math.PI / SEG, a1 = a0 + 6.2832 / SEG;
      var f0 = r / ANI, f1 = (r + 1) / ANI;
      var b0 = punto(a0, f0), b1 = punto(a1, f0), c0 = punto(a0 + Math.PI / SEG, f1);
      barras.push([b0, b1], [b0, c0], [b1, c0]);
    }
  }
  // parantes del muro de vidrio
  for (s = 0; s < 40; s++) {
    var aa = s / 40 * 6.2832;
    if (Math.abs(aa - Math.PI / 2) < gap + 0.05) continue;
    barras.push([new THREE.Vector3(Math.cos(aa) * RD, y0, Math.sin(aa) * RD), new THREE.Vector3(Math.cos(aa) * RD, yT, Math.sin(aa) * RD)]);
  }
  var geoB = new THREE.CylinderGeometry(1, 1, 1, 5); geoB.translate(0, 0.5, 0);
  var IM = new THREE.InstancedMesh(geoB, new THREE.MeshStandardMaterial({ color: '#eef0f2', roughness: 0.4, metalness: 0.5 }), barras.length);
  var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
  barras.forEach(function (bb, k) {
    d.subVectors(bb[1], bb[0]); var L = d.length(); d.normalize();
    q.setFromUnitVectors(up, d);
    m4.compose(bb[0], q, new THREE.Vector3(0.07, L, 0.07));
    IM.setMatrixAt(k, m4);
  });
  g.add(IM);
  // anillos: base del vidrio y unión muro-cúpula
  [y0, yT].forEach(function (yy) {
    var an = new THREE.Mesh(new THREE.TorusGeometry(RD, 0.1, 5, 64), IM.material);
    an.rotation.x = Math.PI / 2; an.position.y = yy; g.add(an);
  });
}

// PLANTAS: todas en UNA malla. Cada planta es un cuadro que gira sobre su eje
// vertical hacia la cámara (no se inclina al mirar arriba/abajo) y se mece.
function _plantasJardin() {
  var A = ATLAS_JARDIN, rnd = _rngJardin(1907), lista = [];
  var R = JARDIN.R, E = JARDIN.ESTANQUE;
  JARDIN.ARBOLES.forEach(function (t) { lista.push([t[0], t[1], t[2], t[3]]); });
  // ¿se puede poner una planta aquí?
  var libre = function (x, z, rad) {
    var rr = Math.sqrt(x*x + z*z);
    if (rr > R - 0.9 - rad * 0.4 || rr < 3.6) return false;                    // muro y plaza
    if (Math.abs(rr - JARDIN.ANILLO) < 0.95 + rad * 0.5) return false;         // sendero
    if (Math.abs(x) < 1.6 + rad * 0.5 && z > 2) return false;                  // camino a la puerta
    if (Math.abs(x - z) < 1.3 && x < -1.5 && x > -7.5) return false;          // camino al estanque
    if (Math.hypot(x - E.x, z - E.z) < E.r + 0.5 + rad * 0.4) return false;    // estanque
    if (x > 3.2 && x < 7.3 && z > 0.6 && z < 6.2) return false;                // huerto
    for (var i = 0; i < JARDIN.LIBRES.length; i++) {
      var L = JARDIN.LIBRES[i]; if (Math.hypot(x - L[0], z - L[1]) < L[2] + rad * 0.4) return false;
    }
    for (i = 0; i < lista.length; i++) {
      var o = lista[i]; if (Math.hypot(x - o[1], z - o[2]) < (o[3] > 3 ? 1.1 : 0.45) + rad * 0.25) return false;
    }
    return true;
  };
  var poner = function (tipos, n, hMin, hMax, rMin, rMax) {
    for (var i = 0, intentos = 0; i < n && intentos < n * 40; intentos++) {
      var a = rnd() * 6.2832, r = rMin + rnd() * (rMax - rMin), x = Math.cos(a) * r, z = Math.sin(a) * r;
      var h = hMin + rnd() * (hMax - hMin);
      if (!libre(x, z, h)) continue;
      lista.push([tipos[(rnd() * tipos.length) | 0], x, z, h]); i++;
    }
  };
  // rocas con musgo y tronco caído, a mano
  lista.push(['rocas_musgo', -13.0, -0.6, 2.0], ['tronco', 10.6, -1.4, 0.9], ['helecho_roca', -5.4, -12.9, 0.9],
             ['helecho_roca', 11.4, 4.4, 0.8], ['copihue', -11.6, -2.3, 1.3], ['copihue', 2.4, -13.0, 1.2]);
  poner(['arbusto', 'helecho', 'arbusto2', 'palmita'], 26, 0.9, 1.6, 10.6, 14.6);
  poner(['helecho', 'arbusto', 'flores_bl2'], 10, 0.8, 1.3, 4.2, 8.6);
  poner(['flores_bl', 'flores_bl2', 'flores_am', 'flor_roja', 'copihue'], 46, 0.5, 0.9, 3.7, 14.8);
  poner(['pasto1', 'pasto2', 'pasto3', 'pasto4'], 70, 0.4, 0.75, 3.7, 15.0);
  poner(['hongos'], 10, 0.3, 0.45, 10.4, 14.4);
  // juncos y flores junto al estanque
  for (var k = 0; k < 9; k++) {
    var aa = k / 9 * 6.2832 + 0.3, rr = E.r + 0.55;
    lista.push([['pasto1', 'pasto3', 'flores_am'][k % 3], E.x + Math.cos(aa) * rr, E.z + Math.sin(aa) * rr, 0.55 + (k % 3) * 0.1]);
  }

  var n = lista.length, pos = new Float32Array(n * 12), cen = new Float32Array(n * 12), uv = new Float32Array(n * 8), idx = [];
  lista.forEach(function (p, i) {
    var r = A.r[p[0]]; if (!r) return;
    var h = p[3], w = h * r[2] / r[3], y = JARDIN.PISO - 0.03;
    var u0 = r[0] / A.w, u1 = (r[0] + r[2]) / A.w, v1 = 1 - r[1] / A.h, v0 = 1 - (r[1] + r[3]) / A.h;
    var esq = [[-w/2, 0, u0, v0], [w/2, 0, u1, v0], [w/2, h, u1, v1], [-w/2, h, u0, v1]];
    for (var j = 0; j < 4; j++) {
      pos.set([esq[j][0], esq[j][1], 0], (i * 4 + j) * 3);
      cen.set([p[1], y, p[2]], (i * 4 + j) * 3);
      uv.set([esq[j][2], esq[j][3]], (i * 4 + j) * 2);
    }
    var o = i * 4; idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
  });
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('centro', new THREE.BufferAttribute(cen, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  var tex = new THREE.TextureLoader().load(A.img);
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  var mat = new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide, color: '#f2f2f2' });
  var uT = { value: 0 };
  mat.onBeforeCompile = function (sh) {
    sh.uniforms.tiempo = uT;
    sh.vertexShader = 'attribute vec3 centro;\nuniform float tiempo;\n' + sh.vertexShader.replace('#include <begin_vertex>',
      'vec2 dirc = cameraPosition.xz - centro.xz; float Ld = length(dirc);\n' +
      'dirc = Ld > 0.001 ? dirc / Ld : vec2(0.0, 1.0);\n' +
      'float mece = sin(tiempo * 1.3 + centro.x * 0.7 + centro.z * 0.4) * 0.035 * position.y;\n' +
      'vec3 transformed = centro + vec3(dirc.y * (position.x + mece), position.y, -dirc.x * (position.x + mece));');
  };
  var mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;     // los vértices se mueven en el shader
  mesh.onBeforeRender = function () { uT.value = performance.now() / 1000; };
  mesh.name = 'plantas-jardin';
  return mesh;
}

// ESTRELLAS del cielo de Mercurio (sin aire, se verían nítidas en la sombra).
// Se apagan si se activa una atmósfera para todo el planeta.
function _estrellas() {
  if (MUNDO._estrellas) return MUNDO._estrellas;
  var n = 1400, p = new Float32Array(n * 3), rnd = _rngJardin(31337);
  for (var i = 0; i < n; i++) {
    var u = rnd() * 2 - 1, a = rnd() * 6.2832, s = Math.sqrt(1 - u * u);
    p[i*3] = Math.cos(a) * s * 360; p[i*3+1] = Math.abs(u) * 360 - 20; p[i*3+2] = Math.sin(a) * s * 360;
  }
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  var pts = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false,
    transparent: true, opacity: 0.85, fog: false, depthWrite: false }));
  pts.frustumCulled = false; pts.name = 'estrellas';
  MUNDO._estrellas = pts;
  // seguir a la cámara (el cielo nunca se alcanza)
  pts.onBeforeRender = function (r, s, cam) { var w = cam.matrixWorld.elements; pts.position.set(w[12], 0, w[14]); pts.updateMatrixWorld(); };
  if (MUNDO.setAtmosfera && !MUNDO._atmEstrellas) {
    var orig = MUNDO.setAtmosfera; MUNDO._atmEstrellas = true;
    MUNDO.setAtmosfera = function (a) { orig(a); pts.material.opacity = a && a.niebla ? 0 : 0.85; pts.visible = !(a && a.niebla); };
  }
  return pts;
}

// Grieta/hoyo peligroso en la superficie
MUNDO.forma('grieta', function (H, color, b, ob) {
  var r = (ob && ob.radio) ? ob.radio : 2.5;
  // borde oscuro
  H.pieza('toro', '#3a3630', 'solido', b, [0, 0.1, 0], [-90,0,0], [r, r, 0.4], 0);
  // interior negro (el vacío)
  H.pieza('circulo', '#08070a', 'lamina', b, [0, 0.06, 0], [-90,0,0], [r*0.85, r*0.85, 1], 0);
}, 0.5);

// Placa de metal recalentado (peligro: quema)
MUNDO.forma('placaMetal', function (H, color, b, ob) {
  var s = (ob && ob.lado) ? ob.lado : 3;
  H.pieza('caja', '#7a4a3a', 'metal', b, [0, 0.1, 0], [0,0,0], [s, 0.15, s], 0);
  // vetas incandescentes
  for (var i = 0; i < 5; i++) {
    H.pieza('caja', '#e08040', 'brillo', b, [azarLocal(-s/2,s/2), 0.18, azarLocal(-s/2,s/2)],
      [0, azarLocal(0,90), 0], [azarLocal(0.3,1), 0.02, 0.1], 0);
  }
}, 0.6);
function azarLocal(a,b){ return a + Math.random()*(b-a); }


// Montaña / macizo rocoso de Mercurio
MUNDO.forma('montana', function (H, color, b) {
  var alt = H.azar(5, 10);
  H.pieza('cono', color, 'roca', b, [0, alt/2, 0], [0, H.azar(0,360), H.azar(-4,4)], [alt*0.6, alt, alt*0.6], 0);
  // riscos secundarios
  for (var i = 0; i < 3; i++) {
    var a = H.azar(0, 6.28);
    H.pieza('cono', '#6e675f', 'roca', b, [Math.cos(a)*alt*0.3, alt*0.3, Math.sin(a)*alt*0.3],
      [0, H.azar(0,360), H.azar(-8,8)], [alt*0.3, alt*0.6, alt*0.3], 0);
  }
  // cima clara (contraste de luz dura)
  H.pieza('cono', '#a89f92', 'solido', b, [0, alt*0.85, 0], [0,0,0], [alt*0.22, alt*0.3, alt*0.22], 0);
}, 10);

// Roca con jeroglíficos antiguos grabados (¿huella de otra forma de vida?)
MUNDO.forma('roca-glifo', function (H, color, b) {
  // monolito plano, casi una estela
  H.pieza('caja', color, 'roca', b, [0, 1.6, 0], [0, H.azar(-15,15), H.azar(-4,4)], [2.6, 3.2, 0.6], 0);
  // cara pulida donde van los glifos
  H.pieza('caja', '#8a7f70', 'solido', b, [0, 1.7, 0.32], [0, 0, 0], [2, 2.6, 0.05], 0);
  // glifos: filas de símbolos incisos brillantes (líneas y puntos)
  var filas = 5;
  for (var f = 0; f < filas; f++) {
    var y = 0.7 + f * 0.5;
    var cols = 3 + Math.floor(H.azar(0, 2.5));
    for (var c = 0; c < cols; c++) {
      var x = -0.7 + c * 0.5;
      var tipo = Math.floor(H.azar(0, 4));
      var col = '#c8a24a';
      if (tipo === 0) H.pieza('caja', col, 'brillo', b, [x, y, 0.36], [0,0,0], [0.06, 0.28, 0.02], 0);       // vertical
      else if (tipo === 1) H.pieza('caja', col, 'brillo', b, [x, y, 0.36], [0,0,0], [0.28, 0.06, 0.02], 0);  // horizontal
      else if (tipo === 2) { H.pieza('caja', col, 'brillo', b, [x, y, 0.36], [0,0,45], [0.24, 0.05, 0.02], 0);
                             H.pieza('caja', col, 'brillo', b, [x, y, 0.36], [0,0,-45], [0.24, 0.05, 0.02], 0); } // aspa
      else H.pieza('cilindro', col, 'brillo', b, [x, y, 0.36], [90,0,0], [0.09, 0.03, 0.09], 0);              // círculo
    }
  }
}, 4);

// Charco de regolito profundo / lava viscosa (zona pegajosa)
MUNDO.forma('cienagaM', function (H, color, b, ob) {
  var r = (ob && ob.radio) ? ob.radio : 3.5;
  H.pieza('circulo', color, 'lamina', b, [0, 0.08, 0], [-90,0,0], [r, r, 1], 0);
  // burbujas / textura
  for (var i = 0; i < 10; i++) {
    var a = H.azar(0,6.28), rr = H.azar(0, r*0.8);
    H.pieza('esferaB', '#5a4a3a', 'solido', b, [Math.cos(a)*rr, 0.12, Math.sin(a)*rr],
      [0,0,0], [H.azar(0.15,0.4), 0.1, H.azar(0.15,0.4)], 0);
  }
}, 0.4);

// --- GADGETS del hábitat ---
// Activador de oxígeno: cilindro con manómetro y luz
MUNDO.forma('oxigeno', function (H, color, b) {
  H.pieza('cilindro', '#3f7a9a', 'metal', b, [0, 0.9, 0], [0,0,0], [0.4, 1.8, 0.4], 0);
  H.pieza('cilindro', '#5a9ab8', 'metal', b, [0, 1.85, 0], [0,0,0], [0.42, 0.15, 0.42], 0);
  H.pieza('caja', '#20262b', 'solido', b, [0, 1.3, 0.4], [0,0,0], [0.34, 0.34, 0.06], 0);
  H.pieza('circulo', '#4affa0', 'brillo', b, [0, 1.3, 0.44], [0,0,0], [0.12, 0.12, 1], 0);   // luz verde = O2 ok
  H.pieza('caja', '#c8ccce', 'metal', b, [0, 0.5, 0.35], [0,0,0], [0.1, 0.5, 0.1], 0);       // válvula
  H.pieza('caja', '#e8d8a0', 'brillo', b, [0, 2.1, 0], [0,0,0], [0.7, 0.18, 0.05], 0);       // etiqueta O₂
}, 2.3);

// Televisor / pantalla de monitoreo
MUNDO.forma('tele', function (H, color, b) {
  H.pieza('caja', '#26170f', 'solido', b, [0, 1.4, 0], [0,0,0], [2.2, 1.3, 0.12], 0);
  H.pieza('caja', '#1a2a3a', 'brillo', b, [0, 1.4, 0.08], [0,0,0], [1.9, 1.05, 0.02], 0);
  // "imagen": franjas de color tenue
  H.pieza('caja', '#3f6b8a', 'brillo', b, [0, 1.6, 0.09], [0,0,0], [1.8, 0.3, 0.01], 0);
  H.pieza('caja', '#8a6a3f', 'brillo', b, [0, 1.3, 0.09], [0,0,0], [1.8, 0.3, 0.01], 0);
  H.pieza('poste', '#4a5560', 'metal', b, [0, 0.5, 0], [0,0,0], [0.1, 1, 0.1], 0);
  H.pieza('caja', '#4a5560', 'solido', b, [0, 0.05, 0], [0,0,0], [0.8, 0.1, 0.5], 0);
}, 2.2);

// Panel de cultivo hidropónico (plantas bajo luz)
MUNDO.forma('cultivo', function (H, color, b) {
  H.pieza('caja', '#3a4048', 'metal', b, [0, 0.5, 0], [0,0,0], [2.4, 1, 0.8], 0);
  H.pieza('caja', '#2a3820', 'solido', b, [0, 1.02, 0], [0,0,0], [2.2, 0.1, 0.7], 0);
  for (var i = 0; i < 8; i++) {
    H.pieza('esfera', '#4a9a3a', 'follaje', b, [-0.9 + i*0.26, 1.2, H.azar(-0.2,0.2)],
      [0, H.azar(0,360), 0], [0.16, 0.22, 0.16], 0.05);
  }
  // luz de cultivo rosada
  H.pieza('caja', '#d060a0', 'brillo', b, [0, 1.8, 0], [0,0,0], [2.2, 0.08, 0.6], 0);
  H.pieza('poste', '#c8ccce', 'metal', b, [-1, 1.5, -0.3], [0,0,0], [0.05, 0.9, 0.05], 0);
  H.pieza('poste', '#c8ccce', 'metal', b, [1, 1.5, -0.3], [0,0,0], [0.05, 0.9, 0.05], 0);
}, 2.2);


// Mesa de laboratorio: superficie con microscopio, matraces y pantalla
MUNDO.forma('laboratorio', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 0.5, 0], [0,0,0], [3, 1, 1.2], 0);
  H.pieza('caja', '#e8ebe4', 'solido', b, [0, 1.02, 0], [0,0,0], [3.1, 0.08, 1.3], 0);
  // microscopio
  H.pieza('cilindro', '#2a2f34', 'metal', b, [-1, 1.2, 0], [0,0,0], [0.18, 0.35, 0.18], 0);
  H.pieza('cilindro', '#3a4048', 'metal', b, [-1, 1.5, 0.05], [12,0,0], [0.08, 0.4, 0.08], 0);
  H.pieza('caja', '#20262b', 'solido', b, [-1, 1.1, 0.18], [0,0,0], [0.4, 0.1, 0.3], 0);
  // matraces de colores
  H.pieza('cilindro', '#4a9a6a', 'vidrio', b, [0, 1.2, 0], [0,0,0], [0.14, 0.35, 0.14], 0);
  H.pieza('cilindro', '#c85a4a', 'vidrio', b, [0.4, 1.18, 0.1], [0,0,0], [0.12, 0.3, 0.12], 0);
  H.pieza('cilindro', '#4a6ac8', 'vidrio', b, [-0.4, 1.16, -0.1], [0,0,0], [0.11, 0.26, 0.11], 0);
  // pantalla de análisis
  H.pieza('caja', '#20262b', 'solido', b, [1.1, 1.5, -0.2], [0,0,0], [0.9, 0.6, 0.06], 0);
  H.pieza('caja', '#3f8f6a', 'brillo', b, [1.1, 1.5, -0.16], [0,0,0], [0.78, 0.48, 0.02], 0);
  H.pieza('poste', '#4a5560', 'metal', b, [1.1, 1.15, -0.2], [0,0,0], [0.05, 0.3, 0.05], 0);
}, 2.6);

// Océano seco: cuenca lisa con polígonos de contracción (barro seco a lo grande)
MUNDO.forma('oceanoSeco', function (H, color, b) {
  H.pieza('circulo', color, 'roca', b, [0, 0.04, 0], [-90,0,0], [22, 22, 1], 0);
  // grietas poligonales
  for (var i = 0; i < 30; i++) {
    var a = H.azar(0, 6.28), r = H.azar(2, 20);
    H.pieza('caja', '#4a453e', 'solido', b, [Math.cos(a)*r, 0.06, Math.sin(a)*r],
      [0, a*57.3 + H.azar(-30,30), 0], [H.azar(2,6), 0.02, 0.12], 0);
  }
  // borde de la antigua costa
  H.pieza('toro', '#847b70', 'roca', b, [0, 0.15, 0], [-90,0,0], [21, 21, 0.5], 0);
}, 0.5);

// Cueva: boca oscura de tubo de lava con dos columnas
MUNDO.forma('cueva', function (H, color, b) {
  // montículo sobre la entrada
  H.pieza('esferaB', '#5a544c', 'roca', b, [0, 2, -3], [0,0,0], [7, 5, 6], 0);
  // boca negra
  H.pieza('caja', '#050405', 'solido', b, [0, 1.6, 0], [0,0,0], [5, 3.2, 0.5], 0);
  H.pieza('esferaB', '#050405', 'solido', b, [0, 2.4, 0.2], [0,0,0], [2.6, 1.6, 1], 0);
  // columnas a los lados
  H.pieza('cilindro', color, 'roca', b, [-3, 1.6, 0.3], [0,0,0], [0.8, 3.2, 0.8], 0);
  H.pieza('cilindro', color, 'roca', b, [3, 1.6, 0.3], [0,0,0], [0.8, 3.2, 0.8], 0);
  H.pieza('caja', color, 'roca', b, [0, 3.4, 0.3], [0,0,0], [6.6, 0.7, 1], 0);
}, 4);

// Sonda estrellada: cápsula abollada, panel roto, antena torcida
MUNDO.forma('sonda', function (H, color, b) {
  // cuerpo inclinado, semienterrado
  H.pieza('cilindro', color, 'metal', b, [0, 0.7, 0], [18, 20, 8], [1.1, 1.8, 1.1], 0);
  H.pieza('cono', '#c8ccce', 'metal', b, [0.3, 1.5, 0.2], [18, 20, 8], [1, 1.2, 1], 0);
  // panel solar roto colgando
  H.pieza('caja', '#2a3f6a', 'solido', b, [-2, 1, 0.5], [20, 30, 40], [2.5, 0.08, 1.4], 0);
  H.pieza('caja', '#3a4f7a', 'solido', b, [2.2, 0.6, -0.4], [-10, 60, -20], [1.8, 0.08, 1.2], 0);
  // antena torcida
  H.pieza('poste', '#c8ccce', 'metal', b, [0.5, 2, -0.3], [0,0,35], [0.05, 2, 0.05], 0);
  H.pieza('toro', '#e8e4da', 'metal', b, [1.2, 2.9, -0.3], [0, 0, 60], [0.5, 0.5, 0.06], 0);
  // restos esparcidos
  H.pieza('caja', '#8a8078', 'metal', b, [-1.5, 0.2, -1.5], [30, 40, 10], [0.5, 0.2, 0.7], 0);
  H.pieza('caja', '#9a9088', 'metal', b, [1.8, 0.15, 1.6], [10, 70, 20], [0.4, 0.15, 0.5], 0);
  // placa con bandera descolorida
  H.pieza('caja', '#7a7570', 'solido', b, [0, 0.9, 1], [18, 20, 8], [0.6, 0.4, 0.03], 0);
}, 3.5);

/* ---------------------------------------------------------------- MUNDO */
window.MUNDOS = window.MUNDOS || {};

/* Recursos compartidos por TODAS las instancias de roca del generador: una sola
   geometría y un solo material para todos los sectores (se crean una vez). */
var GEO_ROCA = null, MAT_ROCA = null, GEO_CRIS = null, MAT_CRIS = null;
function _recursosRoca() {
  if (!GEO_ROCA) {
    GEO_ROCA = new THREE.DodecahedronGeometry(1);
    MAT_ROCA = new THREE.MeshStandardMaterial({ color: '#7d756c', roughness: 0.95, flatShading: true });
  }
  if (!GEO_CRIS) {
    // cono de radio 1 y alto 1: la escala de cada instancia le da su tamaño
    GEO_CRIS = new THREE.ConeGeometry(1, 1, 6);
    // OPACO a propósito: transparente obliga a ordenar cada cristal por
    // profundidad en cada cuadro, y en las cuevas hay decenas. El brillo se
    // consigue con emissive, que no cuesta nada.
    MAT_CRIS = new THREE.MeshStandardMaterial({
      color: '#6ad0e0', emissive: '#3aa8bc', emissiveIntensity: 0.9, roughness: 0.4 });
  }
}

window.MUNDOS.mercurio = {

  titulo: 'Mercurio · la superficie',
  materia: 'Física · Astronomía · Sistema Solar',
  resumen: 'El planeta más cercano al Sol, con un jardín terrestre bajo una cúpula de vidrio. Afuera, vacío y regolito; adentro, aire y fotosíntesis.',

  // BANDA SONORA (se toca en orden y en bucle; volumen en el panel de sonido)
  musica: [
    { titulo: 'Watching the Twin Suns Rise', src: 'mundos/audio/mercurio-twin-suns.mp3' },
    { titulo: 'The Glass Tide', src: 'mundos/audio/mercurio-glass-tide.mp3' }
  ],

  // Cielo negro: Mercurio casi no tiene atmósfera
  cielo: '#050608',
  luz: { cielo: '#141820', suelo: '#2e2820', ambiente: 0.22,
         sol: '#fff8ec', intensidad: 2.9, posicion: '55 24 -30' },

  ancho: 240,
  anchoVida: 200,
  inicio: '0 2.5 0',

  cotaMuerte: -25,
  semilla: 73519,
  guardado: true,

  // Rocas rompibles fijas cerca de la base (golpéalas por monedas)
  rompibles: [
    { id: 'r0', pos: [20, 0.8, 6], radio: 1.2, golpes: 3, monedas: 2, color: '#8a7f6a' },
    { id: 'r1', pos: [-22, 0.8, -10], radio: 1, golpes: 3, monedas: 1, color: '#7d756c' },
    { id: 'r2', pos: [12, 0.8, 24], radio: 1.4, golpes: 4, monedas: 3, color: '#948b80' },
    { id: 'r3', pos: [-16, 0.9, 20], radio: 1.1, golpes: 3, monedas: 2, color: '#847b70' }
  ],

  // GENERADOR PROCEDURAL: puebla cada sector nuevo de forma determinista.
  // Recibe {gx,gz,cx,cz,rng,terreno,nuevo,pieza}. Mismo sector → mismo contenido.
  generador: function (S) {
    // el sector 0,0 es la zona hecha a mano: no lo repueblan
    if (S.gx === 0 && S.gz === 0) return;
    var R = S.rng;
    // rocas dispersas: las DECORATIVAS van a una sola InstancedMesh (1 draw call
    // por sector); las ROMPIBLES siguen siendo entidad (las necesita el raycaster
    // de golpes). El orden del rng se conserva para que el sector regenere igual.
    _recursosRoca();
    var _deco = [];
    var nRocas = 3 + Math.floor(R() * 6);
    for (var i = 0; i < nRocas; i++) {
      var x = S.cx + (R() - 0.5) * 36;
      var z = S.cz + (R() - 0.5) * 36;
      var t = 0.5 + R() * 1.3;
      var esRompible = (R() < 0.25);
      var mon = 1 + Math.floor(R()*3);   // se consume siempre → determinista al regenerar
      if (esRompible) {
        var id = 's' + S.gx + '_' + S.gz + '_' + i;
        if (!MUNDO.rotos[id]) {
          var e = S.nuevo('a-entity', { position: x + ' ' + (t*0.4) + ' ' + z });
          e.setAttribute('geometry', 'primitive:dodecahedron; radius:' + t);
          e.setAttribute('material', 'color:#7d756c; roughness:0.95; flatShading:true');
          S.terreno.appendChild(e);
          MUNDO.rocaRompible({ id: id, x: x, z: z, golpes: 3, monedas: mon, el: e });
          var v = S.nuevo('a-entity', { position: x + ' ' + (t*0.4+0.2) + ' ' + z });
          v.setAttribute('geometry', 'primitive:sphere; radius:0.16');
          v.setAttribute('material', 'color:#f0c850; shader:flat; emissive:#f0c850');
          S.terreno.appendChild(v);
        }
        // si ya está rota, no se dibuja
      } else {
        _deco.push({ x: x, y: t*0.4, z: z, s: t });
        // solo las rocas grandes bloquean el paso; los guijarros se pueden pisar.
        // La colisión queda etiquetada con el sector y se borra al descargarlo.
        if (t > 1.1 && S.chocaCilindro) S.chocaCilindro(x, z, t*0.55, 0, t*0.9);
      }
    }
    // volcar las decorativas a una InstancedMesh colgada del grupo por object3D
    if (_deco.length) {
      var _malla = new THREE.InstancedMesh(GEO_ROCA, MAT_ROCA, _deco.length);
      _malla.frustumCulled = false;
      var _m = new THREE.Matrix4(), _p = new THREE.Vector3(),
          _q = new THREE.Quaternion(), _eu = new THREE.Euler(), _sc = new THREE.Vector3();
      for (var j = 0; j < _deco.length; j++) {
        var d = _deco[j];
        _p.set(d.x, d.y, d.z);
        _eu.set(R()*0.6, R()*6.28, R()*0.6);
        _q.setFromEuler(_eu);
        _sc.set(d.s, d.s*0.7, d.s*(0.7 + R()*0.6));
        _malla.setMatrixAt(j, _m.compose(_p, _q, _sc));
      }
      _malla.instanceMatrix.needsUpdate = true;
      S.terreno.setObject3D('rocas', _malla);
    }
    // algún cráter ocasional
    if (R() < 0.5) {
      var crx = S.cx + (R()-0.5)*30, crz = S.cz + (R()-0.5)*30;
      var cr = S.nuevo('a-ring', { position: crx + ' 0.06 ' + crz, rotation: '-90 0 0',
        'radius-inner': 2 + R()*3, 'radius-outer': 3 + R()*4,
        material: 'color:#5a5650; shader:flat; side:double' });
      S.terreno.appendChild(cr);
    }

    // CUEVA SUBTERRÁNEA: 1 de cada 3 sectores tiene una entrada con rampa que baja
    if (R() < 0.34) {
      var cux = S.cx + (R()-0.5)*24, cuz = S.cz + (R()-0.5)*24;
      var prof = 6 + R()*3;   // profundidad de la cámara

      // montículo de entrada
      var mont = S.nuevo('a-entity', { position: cux + ' 1.6 ' + (cuz-3) });
      mont.setAttribute('geometry', 'primitive:sphere; radius:4');
      mont.setAttribute('material', 'color:#5a544c; roughness:1; flatShading:true');
      S.terreno.appendChild(mont);
      // boca oscura
      var boca = S.nuevo('a-box', { position: cux + ' 1.4 ' + cuz,
        width: 4, height: 2.8, depth: 0.5, material: 'color:#050405; shader:flat' });
      S.terreno.appendChild(boca);

      // RAMPA pisable que baja a la cámara
      var rampa = S.nuevo('a-box', { 'class': 'suelo', width: 3.4, height: 0.3, depth: 12,
        position: cux + ' ' + (-prof/2 + 0.5) + ' ' + (cuz + 6),
        rotation: (Math.atan2(prof, 12) * 57.3) + ' 0 0',
        material: 'color:#3a352f; roughness:1' });
      S.terreno.appendChild(rampa);

      // CÁMARA subterránea: piso pisable + paredes + techo (a profundidad -prof)
      var camz = cuz + 12, camY = -prof;
      var pisoC = S.nuevo('a-box', { 'class': 'suelo', width: 16, height: 0.3, depth: 16,
        position: cux + ' ' + camY + ' ' + camz, material: 'color:#2e2a24; roughness:1' });
      S.terreno.appendChild(pisoC);
      // paredes de la cámara
      [[0,-8,16,0.5],[0,8,16,0.5],[-8,0,0.5,16],[8,0,0.5,16]].forEach(function(w){
        var pared = S.nuevo('a-box', { width: w[2], height: 5, depth: w[3],
          position: (cux+w[0]) + ' ' + (camY+2.5) + ' ' + (camz+w[1]),
          material: 'color:#3a352f; roughness:1' });
        S.terreno.appendChild(pared);
      });
      // techo de la cámara
      var techoC = S.nuevo('a-box', { width: 16, height: 0.4, depth: 16,
        position: cux + ' ' + (camY+5) + ' ' + camz, material: 'color:#252119' });
      S.terreno.appendChild(techoC);
      // cristales luminosos en la cámara (algo que descubrir abajo)
      // CRISTALES: todos los de la cueva en una sola InstancedMesh opaca.
      // El orden del azar se consume SIEMPRE, esté rota o no la roca, para que
      // al descargar y regenerar el sector salga exactamente igual.
      _recursosRoca();
      var _cris = [];
      var nCrist = 3 + Math.floor(R()*4);
      for (var cc = 0; cc < nCrist; cc++) {
        var chx = cux + (R()-0.5)*12, chz = camz + (R()-0.5)*12;
        var cgy = R()*6.2832, cinc = (R()*20-10) * Math.PI/180;
        var calt = 1 + R()*1.5;
        _cris.push({ x: chx, y: camY + 0.6, z: chz, alt: calt, gy: cgy, inc: cinc });
        var hayRoca = (R() < 0.5);
        var mon = 3 + Math.floor(R()*4);   // se consume siempre → determinista
        if (hayRoca) {
          var idc = 'cave' + S.gx + '_' + S.gz + '_' + cc;
          if (!MUNDO.rotos[idc]) {
            var rc = S.nuevo('a-entity', { position: chx + ' ' + (camY+0.6) + ' ' + (chz+1) });
            rc.setAttribute('geometry', 'primitive:dodecahedron; radius:1');
            rc.setAttribute('material', 'color:#4a4038; roughness:0.9; flatShading:true');
            S.terreno.appendChild(rc);
            MUNDO.rocaRompible({ id: idc, x: chx, z: chz+1, golpes: 4, monedas: mon, el: rc });
          }
        }
      }
      if (_cris.length) {
        var _mc = new THREE.InstancedMesh(GEO_CRIS, MAT_CRIS, _cris.length);
        _mc.frustumCulled = false;
        var _m2 = new THREE.Matrix4(), _p2 = new THREE.Vector3(),
            _q2 = new THREE.Quaternion(), _e2 = new THREE.Euler(), _s2 = new THREE.Vector3();
        for (var ci = 0; ci < _cris.length; ci++) {
          var d2 = _cris[ci];
          _p2.set(d2.x, d2.y + d2.alt/2, d2.z);
          _e2.set(d2.inc, d2.gy, 0);
          _q2.setFromEuler(_e2);
          _s2.set(0.3, d2.alt, 0.3);
          _mc.setMatrixAt(ci, _m2.compose(_p2, _q2, _s2));
        }
        _mc.instanceMatrix.needsUpdate = true;
        S.terreno.setObject3D('cristales', _mc);
      }
    }

    // piso del sector (para que se pueda pisar lo nuevo)
    var piso = S.nuevo('a-box', { 'class': 'suelo', width: 40, depth: 40, height: 0.2,
      position: S.cx + ' -0.3 ' + S.cz, material: 'color:#8a827a; roughness:1' });
    S.terreno.appendChild(piso);
  },


  // ATMÓSFERAS ARTIFICIALES del hábitat (se activan con el botón dentro)
  atmosferas: [
    { id: 'vacio',    nombre: 'Sin atmósfera (Mercurio real)', cielo: '#050608', niebla: null, aire: 0, subsuelo: 0.5 },
    { id: 'terrestre',nombre: 'Atmósfera terrestre con ozono', cielo: '#7fb3d5', niebla: '#cfe4f2', near: 6, far: 80, luz: '#dceaf5', intensidad: 0.9, aire: 0.7, subsuelo: 0.1 },
    { id: 'rosada',   nombre: 'Atmósfera rosada', cielo: '#e0789a', niebla: '#f2c0d4', near: 6, far: 70, luz: '#f5d0de', intensidad: 0.85, aire: 0.6, subsuelo: 0.2 },
    { id: 'morada',   nombre: 'Atmósfera morada', cielo: '#5a3f8a', niebla: '#8a6ab0', near: 6, far: 70, luz: '#c0a8e0', intensidad: 0.7, aire: 0.5, subsuelo: 0.4 },
    { id: 'ambar',    nombre: 'Atmósfera ámbar', cielo: '#c88a3c', niebla: '#e0b878', near: 6, far: 70, luz: '#f0d0a0', intensidad: 0.85, aire: 0.8, subsuelo: 0.2 },
    { id: 'verde',    nombre: 'Atmósfera verde (metano)', cielo: '#3f8a5c', niebla: '#8ac0a0', near: 6, far: 70, luz: '#c0e0c8', intensidad: 0.75, aire: 0.9, subsuelo: 0.3 }
  ],

  // ZONAS PEGAJOSAS: cuesta caminar (regolito profundo / material viscoso)
  pegajosas: [
    { x: -2.6, z: -5.6, r: 2.1, factor: 0.5 },   // estanque (el agua frena)
    { x: -24, z: 40, r: 4, factor: 0.3 },
    { x: 30, z: -34, r: 4.5, factor: 0.28 },
    { x: -50, z: -20, r: 4, factor: 0.32 }
  ],

  // PELIGROS de la superficie
  peligros: [
    { x: -8, z: 18, r: 2.2, dano: 100, causa: 'Caíste en una grieta sin fondo' },
    { x: 21, z: 13, r: 2, dano: 100, causa: 'Caíste en una grieta sin fondo' },
    { x: 26, z: -2, ancho: 3, largo: 3, dano: 18, causa: 'Pisaste metal a 400°C' },
    { x: -18, z: -12, ancho: 3, largo: 3, dano: 18, causa: 'Pisaste metal a 400°C' },
    { x: -60, z: 60, r: 2.4, dano: 100, causa: 'Caíste en una grieta sin fondo' },
    { x: 70, z: 40, r: 2.2, dano: 100, causa: 'Caíste en una grieta sin fondo' },
    { x: 50, z: -70, ancho: 3, largo: 3, dano: 18, causa: 'Pisaste metal a 400°C' }
  ],

  // PUNTOS DE MUESTRA: recolectar en la superficie, analizar en el laboratorio
  muestras: [
    { id: 'roca1', pos: [26, 0.05, -20], tipo: 'roca', color: '#c0b8a0',
      nombre: 'Roca de regolito',
      analisis: 'Roca silicatada rica en minerales sin oxidar. La ausencia de agua y oxígeno significa que no se ha alterado químicamente: es casi idéntica a como quedó tras el último impacto, hace miles de millones de años. <b>Sin rastros orgánicos.</b>' },
    { id: 'tierra1', pos: [-30, 0.05, 24], tipo: 'tierra', color: '#c8a068',
      nombre: 'Polvo de regolito',
      analisis: 'Polvo finísimo producido por micrometeoritos que trituran la superficie. Muy abrasivo y cargado eléctricamente por el viento solar. En la Tierra el suelo tiene vida (bacterias, hongos, raíces); esta muestra está <b>estéril</b>, sin materia orgánica detectable.' },
    { id: 'pegajosa1', pos: [-24, 0.05, 40], tipo: 'pegajosa', color: '#6a5a3a',
      nombre: 'Material viscoso',
      analisis: 'Mezcla de regolito fino y compuestos de azufre semifundidos por el calor extremo. Su viscosidad explica por qué cuesta caminar sobre él. <b>Curiosamente contiene trazas de compuestos de carbono</b>, aunque de origen mineral, no biológico… hasta donde sabemos.' },
    { id: 'hielo1', pos: [-72, 0.05, 66], tipo: 'hielo', color: '#c8d8e0',
      nombre: 'Hielo polar',
      analisis: 'Hielo de agua tomado de un cráter en sombra permanente. Su existencia junto al Sol demuestra lo fría que se mantiene la sombra. El agua es el ingrediente que buscamos primero cuando preguntamos si un lugar <b>pudo albergar vida</b>.' },
    { id: 'metal1', pos: [45, 0.05, 60], tipo: 'metal', color: '#b8bcc0',
      nombre: 'Fragmento de la sonda',
      analisis: 'Aleación de aluminio y titanio: claramente <b>fabricada</b>, no natural. Es humano, de una misión anterior. Un buen recordatorio de cómo distinguir lo hecho por seres inteligentes de lo que produce la naturaleza: la pregunta clave de los monolitos.' }
  ],

  // GRAVEDAD DE MERCURIO: 3,70 m/s² (0,38 g). Salto escalado igual.
  gravedad: {
    valor: 3.70, salto: 3.2,
    opciones: [
      { g: 3.70, salto: 3.2, etiqueta: 'Mercurio (3,70)' },
      { g: 9.81, salto: 5.2, etiqueta: 'Tierra (9,81)' },
      { g: 1.62, salto: 2.1, etiqueta: 'Luna (1,62)' },
      { g: 0.5,  salto: 1.2, etiqueta: 'Casi nula (0,5)' }
    ]
  },

  vistas: {
    llegada: { etiqueta: 'Punto de llegada',  pos: '0 2 30',   pitch: -3, yaw: 0 },
    crater:  { etiqueta: 'El gran cráter',     pos: '-18 2 -6', pitch: 2,  yaw: -40 },
    sol:     { etiqueta: 'Mirar al Sol',       pos: '0 2 10',   pitch: 8,  yaw: 150 },
    base:    { etiqueta: 'Base Discovery',     pos: '40 2.5 2', pitch: 0,  yaw: 0 },
    montes:  { etiqueta: 'La cordillera',      pos: '-50 3 -30', pitch: 4, yaw: -45 },
    monolito:{ etiqueta: 'Los monolitos',      pos: '-38 2 12',  pitch: 0, yaw: -90 }
  },

  // El Sol, enorme y brillante desde acá (Mercurio está muy cerca)
  cielos: [
    { id: 'sol', posicion: '60 34 -60', radio: 7, color: '#fff4d8' }
  ],

  franjas: [
    {
      id: 'regolito', nombre: 'Llanura de regolito', rango: 'Superficie de Mercurio',
      z: [110, -110], y: 0, color: '#8a827a', superficie: 'roca',
      texto: 'Estás parado sobre el regolito de Mercurio: polvo y roca triturada por miles de millones de años de impactos. Sin atmósfera que los frene, cada meteorito llega directo a la superficie, y por eso Mercurio está tan lleno de cráteres como la Luna.',
      detalle: [
        'Mercurio es el planeta más pequeño y el más cercano al Sol. Un año dura apenas 88 días terrestres, pero rota tan lento que un día solar completo dura 176 días: aquí el Sol saldría, cruzaría el cielo y se pondría a lo largo de dos años mercurianos.',
        'La falta de atmósfera hace que la temperatura oscile como en ningún otro planeta: puede pasar de unos 430 °C bajo el Sol a unos 180 grados bajo cero en la sombra. No hay aire que reparta el calor.',
        'La gravedad en la superficie es de 3,70 m/s², un 38% de la terrestre. Con el selector de gravedad puedes sentir la diferencia: en Mercurio saltas mucho más alto y caes más lento que en la Tierra, porque tu masa es la misma pero el planeta tira de ti con menos fuerza.'
      ],
      reto: 'Salta en la Tierra, cambia a la gravedad de Mercurio y vuelve a saltar. Tu cuerpo pesa menos aquí, ¿pero tu masa cambió? ¿Qué es distinto entre peso y masa?',
      detalle2: 'CUIDADO: la superficie tiene grietas sin fondo y placas de metal recalentado. Sin traje reforzado, un paso en falso es fatal. Observa tu barra de salud.',
      especies: [
        { forma: 'penasco', n: 160, color: '#7d756c', nombre: 'Roca', choca: { r: 0.5, alto: 1 } },
        { forma: 'penasco', n: 120, color: '#948b80' },
        { forma: 'penasco', n: 80, color: '#6e675f' },
        { forma: 'crater',  n: 30, color: '#6e675f' },
        { forma: 'montana', n: 10, color: '#7a726a', nombre: 'Monte', choca: { r: 1.4, alto: 8 } }
      ]
    }
  ],

  // PUERTA AUTOMÁTICA de la base (se abre al acercarse desde dentro o fuera)
  puertas: [
    { id: 'base', x: 0, z: 16, radio: 5, abre: 1.8, eje: 'x' }
  ],

  objetos: [
    /* ---------- ESTACIONES DE ASTRONOMÍA ----------
       El hilo: dónde estamos (sistema solar) → cómo lo supimos (heliocentrismo,
       Galileo) → qué tiene de propio este planeta (órbita, día, atmósfera). */
    { forma: 'hito', color: '#c8a33a', pos: [14, 0.05, 26],
      nombre: 'El sistema solar', ficha: 'sistemasolar', altoFicha: 4 },
    { forma: 'hito', color: '#c8a33a', pos: [26, 0.05, 18],
      nombre: 'Modelo heliocéntrico', ficha: 'heliocentrico', altoFicha: 4 },
    { forma: 'hito', color: '#c8a33a', pos: [34, 0.05, 6],
      nombre: 'Las pruebas de Galileo', ficha: 'galileo', altoFicha: 4 },
    { forma: 'hito', color: '#7ac4d8', pos: [-16, 0.05, 24],
      nombre: 'La órbita de Mercurio', ficha: 'orbita', altoFicha: 4 },
    { forma: 'hito', color: '#7ac4d8', pos: [-28, 0.05, 14],
      nombre: 'Un día más largo que un año', ficha: 'diaymes', altoFicha: 4 },
    { forma: 'hito', color: '#7ac4d8', pos: [-34, 0.05, -2],
      nombre: 'Sin atmósfera', ficha: 'sintema', altoFicha: 4 },

    // Cuenca Caloris: una de las mayores del sistema solar (~1550 km real)
    { forma: 'crater', color: '#6e675f', pos: [-30, 0.05, -30], radio: 16,
      nombre: 'Cuenca Caloris', ficha: 'caloris', altoFicha: 4 },
    { forma: 'picoCentral', color: '#7d756c', pos: [-30, 0.05, -30] },
    // Cráter Kuiper: joven, con rayos brillantes
    { forma: 'rayos', color: '#d8d2c4', pos: [24, 0.05, -14], rayos: 10,
      nombre: 'Cráter Kuiper', ficha: 'kuiper', altoFicha: 2.5 },
    { forma: 'crater', color: '#6e675f', pos: [24, 0.05, -14], radio: 4,
      nombre: 'Cráter de impacto', ficha: 'crater', altoFicha: 2.6 },
    // Escarpe de Discovery: un gran acantilado de contracción del planeta
    { forma: 'escarpe', color: '#847b70', pos: [40, 0.05, 10], giro: 20,
      largo: 44, alto: 5, nombre: 'Escarpe Discovery', ficha: 'escarpe', altoFicha: 6 },
    // Región polar en sombra permanente, con hielo
    { forma: 'crater', color: '#5a5650', pos: [-40, 0.05, 30], radio: 7,
      nombre: 'Cráter polar con hielo', ficha: 'hielo', altoFicha: 3 },
    // BASE DISCOVERY: el hábitat presurizado GRANDE, centrado. Se inicia adentro.
    { forma: 'habitat', id: 'base', color: '#c4ccd2', pos: [0, 0.05, 0],
      nombre: 'Base Discovery', ficha: 'base', altoFicha: 8,
      piso: { ancho: 32, largo: 32, alto: 0.66, color: '#8f8a82' },
      choca: MUROS_BASE },
    // grietas peligrosas (visuales, el daño lo dan las zonas de peligro)
    { forma: 'grieta', color: '#08070a', pos: [-8, 0.05, 18], radio: 2.2 },
    { forma: 'grieta', color: '#08070a', pos: [21, 0.05, 13], radio: 2 },
    // placas de metal recalentado
    { forma: 'placaMetal', color: '#7a4a3a', pos: [26, 0.05, -2], lado: 3 },
    { forma: 'placaMetal', color: '#7a4a3a', pos: [-18, 0.05, -12], lado: 3 },
    // CORDILLERA: macizos grandes hacia los bordes del mapa ampliado
    { forma: 'montana', color: '#7a726a', pos: [-70, 0.05, -60], choca: [{ r: 3, alto: 10 }] },
    { forma: 'montana', color: '#847b70', pos: [80, 0.05, -50], choca: [{ r: 3, alto: 10 }] },
    { forma: 'montana', color: '#6e675f', pos: [-85, 0.05, 40], choca: [{ r: 3, alto: 10 }] },
    { forma: 'montana', color: '#7a726a', pos: [60, 0.05, 80], choca: [{ r: 3, alto: 10 }] },

    // MONOLITOS con jeroglíficos antiguos (¿otra forma de vida?)
    { forma: 'roca-glifo', color: '#6e675f', pos: [-40, 0.05, 12],
      nombre: 'Monolito con inscripciones', ficha: 'glifos', altoFicha: 4,
      choca: [{ dx: 0, dz: 0, ancho: 2.6, largo: 0.6, alto: 3.2 }] },
    { forma: 'roca-glifo', color: '#726a60', pos: [52, 0.05, 24], giro: 40,
      nombre: 'Monolito con inscripciones', ficha: 'glifos', altoFicha: 4,
      choca: [{ dx: 0, dz: 0, ancho: 2.6, largo: 0.6, alto: 3.2 }] },
    { forma: 'roca-glifo', color: '#6a635a', pos: [-8, 0.05, -64], giro: -25,
      nombre: 'Monolito con inscripciones', ficha: 'glifos', altoFicha: 4,
      choca: [{ dx: 0, dz: 0, ancho: 2.6, largo: 0.6, alto: 3.2 }] },

    // CIÉNAGAS visibles sobre las zonas pegajosas
    { forma: 'cienagaM', color: '#4a3f32', pos: [-24, 0.05, 40], radio: 4 },
    { forma: 'cienagaM', color: '#463a30', pos: [30, 0.05, -34], radio: 4.5 },
    { forma: 'cienagaM', color: '#4a3f32', pos: [-50, 0.05, -20], radio: 4 },

    // Estación de estudio con el panel de gravedad
    { forma: 'hito', color: '#c4342e', pos: [3, 0.05, 22],
      nombre: 'Estación de estudio', ficha: 'gravedad', altoFicha: 3.6 },
    { forma: 'hito', color: '#c8a84a', pos: [18, 0.05, 4],
      nombre: 'Zona de minería', ficha: 'monedas', altoFicha: 3.6 },

    // JARDÍN TERRESTRE: el hito de la fotosíntesis, junto a la plaza
    { forma: 'hito', color: '#5fae3a', pos: [2.3, 0.66, 1.9],
      nombre: 'Jardín terrestre', ficha: 'jardin', altoFicha: 3.4 },
    // GADGETS dentro de la Base Discovery (centrada en 0,0)
    { forma: 'oxigeno', color: '#3f7a9a', pos: [-6, 0.66, -8],
      nombre: 'Activador de oxígeno', dialogo: 'oxigeno', altoFicha: 2.6,
      choca: [{ r: 0.5, alto: 2 }] },
    { forma: 'tele', color: '#26170f', pos: [-10, 0.66, 0], giro: 90,
      nombre: 'Monitor de la base', ficha: 'tele', altoFicha: 2.5 },
    { forma: 'cultivo', color: '#3a4048', pos: [-9, 0.66, 7], giro: -40,
      nombre: 'Cultivo hidropónico', ficha: 'cultivo', altoFicha: 2.5,
      choca: [{ dx: 0, dz: 0, ancho: 2.4, largo: 0.8, alto: 1 }] },
    // LABORATORIO: mesa de análisis dentro de la base (interactúa por diálogo)
    { forma: 'laboratorio', color: '#2f363d', pos: [8, 0.66, -6], giro: -90,
      nombre: 'Laboratorio de muestras', dialogo: 'laboratorio', altoFicha: 2.6,
      choca: [{ dx: 0, dz: 0, ancho: 3, largo: 1.2, alto: 1.2 }] },

    // ===== LUGARES NUEVOS DE LA SUPERFICIE =====
    // Océano seco: una gran cuenca lisa y agrietada (mar de lava solidificada)
    { forma: 'oceanoSeco', color: '#6e675f', pos: [-55, 0.05, 55],
      nombre: 'Mar de lava seco', ficha: 'oceano', altoFicha: 3 },
    // Boca de cueva de tubo de lava
    { forma: 'cueva', color: '#3a352f', pos: [70, 0.05, -30],
      nombre: 'Tubo de lava', ficha: 'cueva', altoFicha: 4,
      choca: [{ dx: -3, dz: 0, r: 1, alto: 5 }, { dx: 3, dz: 0, r: 1, alto: 5 }] },
    // Sonda estrellada antigua
    { forma: 'sonda', color: '#9a9088', pos: [45, 0.05, 60], giro: 30,
      nombre: 'Sonda estrellada', ficha: 'sonda', altoFicha: 3.5,
      choca: [{ r: 1.5, alto: 2 }] }
  ],

  // ACCIONES que los diálogos pueden ejecutar
  acciones: {
    activarOxigeno: function () {
      MUNDO.oxigenoOn = true;
      if (MUNDO.curar) MUNDO.curar(100);
    }
  },

  dialogos: {
    oxigeno: {
      nombre: 'Activador de oxígeno',
      inicio: 'menu',
      nodos: {
        menu: {
          texto: 'Consola del generador de oxígeno. El nivel de O₂ de la base está bajo tu control. ¿Qué deseas hacer?',
          opciones: [
            { dice: 'Activar el oxígeno', accion: 'activarOxigeno', va: 'activado' },
            { dice: '¿Cómo funciona?', va: 'info' },
            { dice: 'Ver la ficha del sistema', ficha: 'oxigeno', va: null },
            { dice: 'Cerrar', va: null }
          ]
        },
        activado: {
          texto: 'Oxígeno activado. Los niveles suben a valores seguros y el aire de la cúpula se renueva. La luz del equipo pasa a verde. Ahora puedes respirar con normalidad dentro de la base.',
          opciones: [
            { dice: '¿Cómo funciona?', va: 'info' },
            { dice: 'Listo', va: null }
          ]
        },
        info: {
          texto: 'El equipo separa oxígeno del hielo de agua traído de los cráteres polares, por electrólisis: se aplica electricidad al agua y se divide en hidrógeno y oxígeno. En la Tierra las plantas hacen algo parecido con la fotosíntesis, gratis y a gran escala.',
          opciones: [
            { dice: 'Activar el oxígeno', accion: 'activarOxigeno', va: 'activado' },
            { dice: 'Volver', va: 'menu' }
          ]
        }
      }
    },
    laboratorio: {
      nombre: 'Laboratorio de muestras',
      inicio: 'menu',
      nodos: {
        menu: {
          texto: 'Estación de análisis. Aquí puedes examinar las muestras que recolectaste en la superficie con el instrumental del laboratorio.',
          opciones: [
            { dice: 'Abrir el analizador', accion: 'abrirLaboratorio', va: null },
            { dice: '¿Qué busco en las muestras?', va: 'info' },
            { dice: 'Ver la ficha del laboratorio', ficha: 'laboratorio', va: null },
            { dice: 'Cerrar', va: null }
          ]
        },
        info: {
          texto: 'Buscamos tres cosas: agua (base de la vida como la conocemos), carbono (el ladrillo de las moléculas orgánicas) y patrones que la química sola no explique. Recolecta muestras afuera y tráelas aquí para analizarlas.',
          opciones: [
            { dice: 'Abrir el analizador', accion: 'abrirLaboratorio', va: null },
            { dice: 'Volver', va: 'menu' }
          ]
        }
      }
    }
  },

  fichas: [
    {
      id: 'heliocentrico', nombre: 'Del geocentrismo al heliocentrismo', rango: 'Cómo cambió el modelo',
      texto: 'Durante casi mil quinientos años se enseñó que la Tierra estaba quieta en el centro y que todo giraba a su alrededor. No era una idea absurda: explicaba lo que se ve. El problema eran los planetas, que a veces parecen detenerse y retroceder en el cielo —el movimiento retrógrado—. El modelo geocéntrico lo resolvía agregando círculos sobre círculos, los epiciclos, cada vez más complicados. Copérnico propuso otra cosa: poner el Sol al centro. Con eso, el retroceso deja de necesitar explicación especial: es lo que se ve cuando un planeta más rápido adelanta a otro más lento, igual que un auto parece ir hacia atrás cuando lo sobrepasas.',
      vida: ['El geocentrismo explicaba lo observado, pero con creciente complejidad', 'El movimiento retrógrado exigía epiciclos', 'Copérnico (1543) puso el Sol al centro', 'Kepler corrigió: las órbitas son elipses, no círculos', 'Galileo aportó pruebas con el telescopio'],
      reto: 'Los dos modelos predecían las posiciones de los planetas con precisión parecida al principio. Entonces, ¿por qué terminó imponiéndose el heliocéntrico? Tu respuesta debería hablar de simplicidad y de capacidad de explicar, no solo de acertar.',
      actividad: 'Estás parado en Mercurio, el planeta más rápido. Explica con eso el movimiento retrógrado: ¿qué se vería desde la Tierra cuando Mercurio la adelanta?'
    },
    {
      id: 'galileo', nombre: 'Las pruebas de Galileo', rango: 'Cuando mirar decidió la discusión',
      texto: 'Galileo apuntó un telescopio al cielo y encontró cosas que el modelo geocéntrico no podía acomodar. Vio cuatro lunas girando alrededor de Júpiter: había centros de giro que no eran la Tierra. Y vio que Venus presenta fases completas, como la Luna, incluida una fase llena que solo puede ocurrir si Venus pasa por detrás del Sol. En el modelo geocéntrico Venus nunca podría verse lleno. Ese fue el dato que no admitía arreglo.',
      vida: ['Las lunas de Júpiter: centros de giro distintos de la Tierra', 'Las fases completas de Venus, imposibles en el geocentrismo', 'Manchas solares y montañas en la Luna: los cielos no eran perfectos'],
      reto: 'Una sola observación bien elegida puede descartar un modelo entero. Explica por qué la fase llena de Venus es incompatible con que Venus gire alrededor de la Tierra.',
      actividad: 'Dibuja las dos situaciones: Venus girando en torno a la Tierra y Venus girando en torno al Sol. Marca en cada una desde dónde se vería iluminado.'
    },
    {
      id: 'orbita', nombre: 'La órbita de Mercurio', rango: 'El año más corto del sistema solar',
      texto: 'Mercurio da una vuelta completa al Sol en 88 días terrestres: es el año más corto de todos los planetas. Y no es casualidad que sea el más cercano. Kepler descubrió que cuanto más cerca está un planeta, más rápido se mueve, y esa relación es exacta y calculable. Además la órbita de Mercurio es la más alargada, la menos circular de todos los planetas: su distancia al Sol varía muchísimo entre el punto más cercano y el más lejano.',
      vida: ['Un año de Mercurio dura 88 días terrestres', 'Es el planeta más cercano al Sol y el más veloz', 'Su órbita es la más elíptica de los planetas', 'Kepler: mientras más cerca, más rápido'],
      reto: 'Si Mercurio tarda 88 días en dar una vuelta y la Tierra 365, ¿cuántas vueltas da Mercurio mientras la Tierra da una? Calcula y explica qué relación hay entre distancia y velocidad.',
      actividad: 'Anota tu edad en años terrestres y calcula cuántos años de Mercurio tendrías. Después haz lo mismo con la duración de un día.'
    },
    {
      id: 'diaymes', nombre: 'Un día más largo que un año', rango: 'Rotación y traslación',
      texto: 'Aquí ocurre algo que parece imposible: en Mercurio un día dura más que un año. Mercurio rota muy lentamente sobre su eje, y por su resonancia con el Sol tarda unos 176 días terrestres en completar un ciclo de día y noche, mientras que su año dura solo 88. Es decir, un habitante de Mercurio vería salir el Sol una sola vez cada dos años mercurianos. La lección de fondo es que día y año miden dos movimientos distintos: el día es rotación sobre el propio eje, el año es traslación alrededor del Sol.',
      vida: ['Día solar en Mercurio: unos 176 días terrestres', 'Año: 88 días terrestres', 'El día dura exactamente dos años mercurianos', 'Día = rotación; año = traslación'],
      reto: 'Mucha gente confunde el día con el año porque en la Tierra ambos parecen naturales. Explica con Mercurio por qué son movimientos independientes y por qué uno puede durar más que el otro.',
      actividad: 'Dibuja Mercurio en cuatro posiciones de su órbita e indica hacia dónde apunta un punto fijo de su superficie en cada una. ¿Cuántas vueltas dio sobre sí mismo?'
    },
    {
      id: 'sistemasolar', nombre: 'El sistema solar y las distancias', rango: 'Dónde estamos',
      texto: 'Mercurio es el primero de ocho planetas. Los cuatro interiores —Mercurio, Venus, Tierra y Marte— son rocosos, pequeños y densos; los cuatro exteriores son gigantes gaseosos o helados. Esa división no es casual: cerca del Sol hacía demasiado calor para que se condensaran los gases y los hielos, de modo que solo quedó la roca y el metal. Lo más difícil de captar es la escala: si el Sol fuera una pelota de fútbol, Mercurio sería un grano de arena a unos 12 metros, y la Tierra otro grano a 30.',
      vida: ['Cuatro planetas rocosos interiores y cuatro gigantes exteriores', 'La temperatura durante la formación explica esa división', 'El sistema solar es sobre todo espacio vacío', 'Mercurio es el más pequeño de los ocho'],
      reto: '¿Por qué los planetas cercanos al Sol son rocosos y los lejanos gaseosos? Tu respuesta debe mencionar la temperatura en la época en que se formaron.',
      actividad: 'Construye un modelo a escala del sistema solar en el patio del colegio: elige un objeto para el Sol y calcula a cuántos pasos quedaría cada planeta. Anota qué te sorprendió.'
    },
    {
      id: 'sintema', nombre: 'Sin atmósfera', rango: 'Por qué aquí todo es distinto',
      texto: 'Mercurio casi no tiene atmósfera, y eso explica casi todo lo que ves alrededor. Sin aire no hay quien reparta el calor: la cara iluminada supera los 400 °C y la oscura baja de los 170 bajo cero, en el mismo mundo y al mismo tiempo. Sin aire tampoco hay erosión: los cráteres de hace miles de millones de años siguen intactos, mientras que en la Tierra el viento y el agua los habrían borrado. Y sin aire el cielo es negro incluso de día, porque no hay nada que disperse la luz del Sol.',
      vida: ['Diferencia térmica enorme entre el día y la noche', 'Sin erosión: los cráteres se conservan intactos', 'Cielo negro incluso a pleno día', 'Los meteoritos llegan enteros a la superficie'],
      reto: 'En la Tierra el cielo es celeste y en Mercurio negro, aunque el Sol es el mismo. Explica la diferencia. Después explica por qué en la Tierra casi no quedan cráteres antiguos.',
      actividad: 'Cambia la atmósfera con el botón correspondiente y observa qué ocurre con el cielo y con la luz. Anota tres diferencias entre la versión real y la imaginada con aire.'
    },
    {
      id: 'base', nombre: 'Base Discovery', rango: 'Invernadero presurizado',
      texto: 'Bajo esta cúpula geodésica de vidrio ya se controla la atmósfera: hay aire, presión y temperatura como en la Tierra, y por eso crece un pequeño bosque con huerto y estanque. Afuera, a un paso del vidrio, sigue Mercurio tal como es: vacío, regolito y un cielo negro.',
      detalle: [
        'El vidrio deja pasar la luz del Sol para la fotosíntesis, pero un filtro bloquea gran parte de la radiación ultravioleta y del calor. Bajo la cúpula, el aire dispersa la luz azul y el cielo se ve celeste; afuera, sin aire que la disperse, el cielo es negro incluso de día.',
        'Las plantas no son decoración: absorben el dióxido de carbono que exhalamos, liberan oxígeno, reciclan el agua al transpirar y dan alimento. Un invernadero así es un ecosistema cerrado: si algo falla (pocas plantas, demasiadas personas), el aire se desequilibra.',
        'El botón "Atmósfera" es un experimento mental: ¿qué pasaría si esta atmósfera se extendiera a todo el planeta? La terrestre con ozono es la que respiramos; las otras (rosada, morada, ámbar, verde) muestran que cada gas y partícula colorea distinto el cielo.'
      ],
      actividad: 'Sal por la esclusa y compara: mira el cielo, escucha y fíjate en el suelo dentro y fuera de la cúpula. Anota tres diferencias y explica qué las produce.',
      pregunta: [
        '¿Por qué el cielo se ve celeste dentro de la cúpula y negro afuera, si el Sol es el mismo?',
        'Nombra dos cosas que el invernadero tiene que controlar para que las plantas y las personas sobrevivan juntas.'
      ]
    },
    {
      id: 'glifos', nombre: 'Inscripciones antiguas', rango: '¿Huella de otra vida?',
      texto: 'En la cara pulida de este monolito hay símbolos grabados que no parecen naturales: filas ordenadas de líneas, círculos y aspas. Nadie sabe cómo llegaron aquí. ¿Erosión que imita un patrón? ¿Una broma de la geología? ¿O la señal de que alguna vez existió algo más?',
      detalle: [
        'La ciencia trabaja con evidencia, pero también con preguntas abiertas. Buscar vida más allá de la Tierra —la astrobiología— parte de una idea sencilla: si la vida surgió aquí, ¿por qué no en otro lugar? Hasta ahora no hay prueba de vida fuera de nuestro planeta, pero tampoco hemos terminado de buscar.',
        'Estos glifos son ficción, un detalle para imaginar. Pero la pregunta que despiertan es real y seria: ¿qué contaría como prueba de que hubo vida en otro mundo? ¿Un fósil? ¿Una molécula? ¿Un patrón que no pueda explicarse sin un ser que lo hiciera?'
      ],
      pregunta: [
        'Si encontraras estos símbolos de verdad, ¿qué harías para saber si son obra de un ser vivo o solo una casualidad de la roca?',
        '¿Qué diferencia a un patrón hecho por vida de uno hecho por procesos físicos (viento, agua, minerales)?'
      ]
    },
    {
      id: 'monedas', nombre: 'Minerales valiosos', rango: 'Economía de la exploración',
      texto: 'Algunas rocas guardan vetas de minerales valiosos (el brillo dorado las delata). Golpéalas varias veces para romperlas y extraer las monedas. Servirán, más adelante, para comprar equipo y mejoras en la base.',
      actividad: 'Rompe algunas rocas con veta y junta monedas. Aléjate de la base explorando: el terreno se genera solo a medida que avanzas, y siempre igual, porque nace de una misma semilla.',
      reto: 'El mundo se expande con una "semilla" que hace que el mismo terreno se genere igual cada vez. ¿Por qué crees que un videojuego prefiere guardar una semilla en vez del mapa completo?'
    },
    {
      id: 'laboratorio', nombre: 'Laboratorio de muestras', rango: 'El corazón científico de la base',
      texto: 'Aquí se analizan las muestras que recolectas en la superficie. Sal por la puerta, acércate a un punto marcado, usa Recolectar, y vuelve aquí: abre el laboratorio para leer el análisis de cada muestra. Buscamos lo mismo que toda misión a otro mundo: ¿hay agua? ¿hay carbono? ¿hay algo que la química sola no explique?',
      actividad: 'Recolecta al menos tres muestras distintas (roca, tierra, material viscoso) y analízalas en el laboratorio. Anota qué tienen en común y qué las diferencia.',
      pregunta: [
        '¿Cuál de las muestras se acerca más a las condiciones que podrían permitir vida? ¿Por qué?',
        'El fragmento de la sonda es "artificial". ¿Cómo distingue un científico algo fabricado de algo natural?'
      ]
    },
    {
      id: 'oceano', nombre: 'Mar de lava seco', rango: 'Un océano que nunca fue de agua',
      texto: 'Esta enorme llanura lisa parece el lecho de un mar, pero nunca hubo agua aquí. Es una cuenca de lava que se derramó tras un gran impacto y se solidificó, agrietándose al enfriarse en polígonos, igual que el barro seco pero a escala de kilómetros.',
      reto: 'En la Tierra, una llanura tan lisa sería un fondo marino. Aquí es lava. ¿Qué otras pistas buscarías para saber si un terreno liso fue alguna vez cubierto por agua?'
    },
    {
      id: 'cueva', nombre: 'Tubo de lava', rango: 'Refugio bajo la superficie',
      texto: 'Cuando la lava corre, su superficie se enfría y forma una costra, mientras por dentro sigue fluyendo. Al vaciarse, deja un túnel: un tubo de lava. En Mercurio y la Luna, estos tubos son candidatos serios para futuras bases: bajo tierra protegen de la radiación, los micrometeoritos y los cambios brutales de temperatura.',
      reto: 'Una base dentro de un tubo de lava estaría más protegida que una en la superficie. Nombra tres peligros de los que el subsuelo te protegería.'
    },
    {
      id: 'sonda', nombre: 'Sonda estrellada', rango: 'Una visita anterior',
      texto: 'Los restos de una sonda que llegó antes: cápsula abollada, panel solar roto, antena torcida. La humanidad ya ha enviado naves a Mercurio (como Mariner 10 y MESSENGER). Encontrar sus restos plantea una pregunta bonita: dentro de miles de años, ¿qué contarán nuestros artefactos sobre nosotros a quien los encuentre?',
      reto: 'Esta sonda es claramente artificial. Si un explorador futuro la hallara sin saber nada de la Tierra, ¿qué podría deducir de quienes la construyeron solo mirándola?'
    },
    {
      id: 'oxigeno', nombre: 'Activador de oxígeno', rango: 'Gadget del hábitat',
      texto: 'Este equipo genera y regula el oxígeno de la base. En un mundo sin aire, respirar depende por completo de la máquina: si falla, no hay atmósfera de repuesto afuera. La luz verde indica que el nivel de oxígeno es seguro.',
      reto: 'En la Tierra el oxígeno lo producen las plantas y las algas, gratis. Aquí hay que fabricarlo. ¿Qué proceso natural tendría que reemplazar esta máquina?'
    },
    {
      id: 'tele', nombre: 'Monitor de la base', rango: 'Gadget del hábitat',
      texto: 'Una pantalla de monitoreo: muestra el estado de los sistemas, las cámaras del exterior y las comunicaciones con la Tierra. A esta distancia, una señal tarda varios minutos en llegar: hablar en tiempo real con casa es imposible.',
      reto: 'La luz tarda en viajar. Si Mercurio está a unos 90 millones de km de la Tierra en cierto momento, y la señal viaja a 300.000 km/s, ¿cuántos minutos tarda un mensaje en llegar?'
    },
    {
      id: 'jardin', nombre: 'Jardín terrestre', rango: 'Fotosíntesis bajo la cúpula',
      texto: 'Árboles, helechos, flores, un huerto y un estanque: un trozo de la Tierra llevado a Mercurio. Las plantas toman dióxido de carbono y agua y, con la energía de la luz, fabrican glucosa y liberan oxígeno. Esa reacción, la fotosíntesis, es la que mantiene respirable el aire de la cúpula.',
      detalle: [
        'Ecuación resumida: 6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂. Las personas hacemos lo contrario al respirar: usamos oxígeno y glucosa y liberamos CO₂. En la base, ambos procesos se equilibran.',
        'El estanque guarda agua y humedece el aire; el suelo del huerto tiene bacterias y hongos que descomponen restos y devuelven nutrientes. Afuera, el regolito de Mercurio es estéril: para cultivar en él habría que agregarle materia orgánica.'
      ],
      actividad: 'Busca en el jardín un productor (planta), un descomponedor (hongos) y el lugar donde se guarda el agua. Explica qué aporta cada uno al aire de la base.',
      reto: 'Si en la base viven más personas pero no se agregan plantas, ¿qué gas aumenta y cuál disminuye? ¿Qué harías para corregirlo?'
    },
    {
      id: 'cultivo', nombre: 'Cultivo hidropónico', rango: 'Gadget del hábitat',
      texto: 'Plantas creciendo sin tierra, alimentadas por agua con nutrientes y luz artificial rosada. Fue el primer cultivo de la base, antes de que la cúpula tuviera atmósfera propia; hoy convive con el huerto de tierra y los árboles. Las dos formas de cultivar dan alimento, reciclan dióxido de carbono y producen oxígeno.',
      reto: 'La luz de cultivo es rosada, no blanca. Las plantas usan sobre todo luz roja y azul para la fotosíntesis. ¿Por qué entonces las vemos verdes?'
    },
    {
      id: 'caloris', nombre: 'Cuenca Caloris', rango: 'Uno de los mayores cráteres del sistema solar',
      texto: 'Caloris es una cuenca de impacto gigantesca, de unos 1.550 kilómetros de diámetro: cabría gran parte de Chile dentro. Se formó por el choque de un asteroide hace unos 3.800 millones de años, y el golpe fue tan brutal que en el punto exactamente opuesto del planeta se levantó un terreno caótico, como si el impacto hubiera resonado a través de todo Mercurio.',
      detalle: [
        'Su nombre viene de "calor": queda en una de las zonas que apunta al Sol en el perihelio, cuando Mercurio está más cerca, y alcanza las temperaturas más altas del planeta.',
        'El interior de la cuenca está relleno de llanuras de lava que salieron tras el impacto, y cruzado por fracturas y crestas producto del enfriamiento posterior.'
      ],
      reto: 'Un impacto tan grande dejó su huella hasta en el lado opuesto del planeta. ¿Qué te dice eso sobre la energía liberada y sobre cómo se propaga por un cuerpo rocoso?'
    },
    {
      id: 'kuiper', nombre: 'Cráter Kuiper', rango: 'Un cráter joven y brillante',
      texto: 'Kuiper es un cráter relativamente reciente, y por eso destaca: sus rayos de material claro se extienden radialmente sobre el terreno más oscuro y antiguo. Esos rayos son polvo fresco lanzado por el impacto, que todavía no ha sido oscurecido por la intemperie espacial.',
      reto: 'Los cráteres con rayos brillantes son jóvenes; los que ya no los tienen, viejos. ¿Qué proceso va "apagando" esos rayos con el paso de millones de años?'
    },
    {
      id: 'escarpe', nombre: 'Escarpe de Discovery', rango: 'Una arruga de todo el planeta',
      texto: 'Los escarpes o rupes son acantilados larguísimos, de cientos de kilómetros, que recorren Mercurio. No son fallas comunes: se formaron porque el planeta entero se encogió. Al enfriarse su núcleo de hierro, Mercurio se contrajo varios kilómetros de radio, y la corteza se arrugó como la piel de una manzana que se seca.',
      detalle: [
        'Discovery Rupes tiene cerca de 650 km de largo y hasta 2 km de altura. Es la evidencia directa de que Mercurio fue geológicamente activo y se contrajo con el tiempo.',
        'Mercurio tiene un núcleo enorme para su tamaño: ocupa cerca del 85% del radio del planeta. Ese núcleo metálico es también el origen de su débil campo magnético.'
      ],
      reto: 'Un planeta que se encoge arruga su corteza. Compara con lo que le pasa a una fruta al deshidratarse. ¿Por qué se forman crestas y no hoyos?'
    },
    {
      id: 'hielo', nombre: 'Hielo en el planeta del Sol', rango: 'Cráteres polares en sombra eterna',
      texto: 'Suena imposible: el planeta más cercano al Sol tiene hielo. Pero como el eje de Mercurio casi no está inclinado, el fondo de algunos cráteres cerca de los polos nunca recibe luz solar. En esa sombra permanente la temperatura se mantiene bajísima, y ahí se acumula hielo de agua, probablemente traído por cometas.',
      reto: 'El hielo sobrevive junto al Sol solo porque nunca le llega la luz. ¿Qué necesitaría cambiar en la inclinación del eje de Mercurio para que ese hielo desapareciera?'
    },
    {
      id: 'crater', nombre: 'Cráteres de impacto', rango: 'La marca de un mundo sin aire',
      texto: 'Los cráteres se forman cuando un meteorito golpea la superficie. En la Tierra la atmósfera quema la mayoría antes de llegar, y la erosión borra las cicatrices con el tiempo. En Mercurio no hay aire ni agua ni viento: los cráteres quedan casi intactos durante miles de millones de años.',
      reto: 'Cuenta los cráteres que ves. Cuantos más hay en una superficie, más antigua es. ¿Por qué la cantidad de cráteres sirve para estimar la edad de un terreno?'
    },
    {
      id: 'gravedad', nombre: 'Mercurio · datos técnicos', rango: 'Estación de estudio',
      texto: 'Ficha del planeta. Mercurio es el más pequeño y el más cercano al Sol, un mundo de roca y metal sin atmósfera que lo proteja.',
      detalle: [
        'Diámetro: 4.879 km (poco más que la Luna). Masa: 5,5% de la de la Tierra.',
        'Gravedad en superficie: 3,70 m/s² (0,38 g). Un cuerpo de 70 kg pesa allí unos 259 N contra 686 N en la Tierra.',
        'Distancia media al Sol: 58 millones de km (0,39 UA). Año: 88 días terrestres.',
        'Día solar: 176 días terrestres. Rota tres veces por cada dos órbitas.',
        'Temperatura: de unos 430 °C al Sol a unos −180 °C en sombra. Sin atmósfera que reparta el calor.',
        'Núcleo metálico que ocupa ~85% del radio, con un débil campo magnético. Sí tiene hielo en cráteres polares.'
      ],
      reto: 'Tu masa es la misma en todas partes, pero tu peso cambia. Con el selector, salta en Tierra, Mercurio y la Luna: ¿en cuál caes más lento y por qué?'
    }
  ]
};
