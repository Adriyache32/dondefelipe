/* =============================================================================
   MUNDO: bosque — bosque nativo de la Cordillera de la Costa (V Región)
   Enfoque: consecuencias del cambio climático sobre recursos naturales y
   comunidades humanas. Biología, Unidad 3: Ecosistemas.
   Funciona como GUÍA DE TRABAJO: estaciones con actividades para el cuaderno.
   ============================================================================= */
window.MUNDO = window.MUNDO || {};
if (!MUNDO.forma)  MUNDO.forma  = function () {};
if (!MUNDO.animar) MUNDO.animar = function () {};
if (!MUNDO.grupos) MUNDO.grupos = {};

/* ---------------------------------------------------------------- FORMAS
   Cada árbol nativo tiene una silueta distinta para poder diferenciarlos. */

// Boldo: copa redondeada y densa, follaje verde grisáceo
MUNDO.forma('boldo', function (H, color, b) {
  var alt = H.azar(4, 6);
  H.pieza('tronco', '#5a4632', 'corteza', b, [0, alt/2, 0], [0,0,0], [alt*0.055, alt, alt*0.055], 0);
  for (var i = 0; i < 3; i++) {
    var r = H.azar(1.6, 2.3) * (i ? 0.8 : 1);
    H.pieza('esfera', color, 'follaje', b,
      [H.azar(-r*0.4,r*0.4), alt + H.azar(-0.2, r*0.4), H.azar(-r*0.4,r*0.4)],
      [0, H.azar(0,360), 0], [r, r*0.95, r], 0.08);
  }
}, 7);

// Litre: copa ancha y algo aplanada, verde oscuro
MUNDO.forma('litreN', function (H, color, b) {
  var alt = H.azar(3, 4.5);
  H.pieza('tronco', '#52402d', 'corteza', b, [0, alt/2, 0], [0,0,0], [alt*0.06, alt, alt*0.06], 0);
  for (var i = 0; i < 2; i++) {
    var r = H.azar(2, 2.8) * (i ? 0.82 : 1);
    H.pieza('esfera', color, 'follaje', b,
      [H.azar(-r*0.5,r*0.5), alt + H.azar(-0.2, r*0.3), H.azar(-r*0.5,r*0.5)],
      [0, H.azar(0,360), 0], [r, r*0.6, r], 0.07);
  }
}, 6);

// Belloto / árbol alto de quebrada húmeda: esbelto y frondoso
MUNDO.forma('belloto', function (H, color, b) {
  var alt = H.azar(7, 11);
  H.pieza('tronco', '#4a3a2a', 'corteza', b, [0, alt/2, 0], [0,0,0], [alt*0.05, alt, alt*0.05], 0);
  for (var i = 0; i < 4; i++) {
    var r = H.azar(2, 3) * (1 - i*0.15);
    H.pieza('esfera', color, 'follaje', b,
      [H.azar(-r*0.4,r*0.4), alt*0.6 + i*alt*0.12, H.azar(-r*0.4,r*0.4)],
      [0, H.azar(0,360), 0], [r, r*1.1, r], 0.09);
  }
  // barba de viejo (liquen colgante), indicador de aire limpio y húmedo
  if (Math.random() > 0.5) {
    H.pieza('lamina', '#9db08a', 'lamina', b, [H.azar(-1,1), alt*0.7, H.azar(-1,1)],
      [0, H.azar(0,360), 0], [0.3, H.azar(0.6,1.1), 1], 0.06);
  }
}, 12);

// Helecho del sotobosque (indicador de humedad)
MUNDO.forma('helecho', function (H, color, b) {
  var n = 7;
  for (var i = 0; i < n; i++) {
    var a = i / n * 6.2832;
    var largo = H.azar(0.7, 1.2);
    H.pieza('hoja', color, 'lamina', b, [0, 0.1, 0],
      [H.azar(30,55), a*57.3, 0], [0.22, largo, 1], 0.05);
  }
}, 1.4);

// Tocón / árbol muerto en pie (indicador de estrés hídrico)
MUNDO.forma('seco', function (H, color, b) {
  var alt = H.azar(2.5, 5);
  H.pieza('tronco', color, 'corteza', b, [0, alt/2, 0], [0, H.azar(0,360), H.azar(-4,4)], [alt*0.05, alt, alt*0.05], 0);
  for (var i = 0; i < 3; i++) {
    H.pieza('cilindro', color, 'solido', b, [0, alt*H.azar(0.5,0.9), 0],
      [H.azar(20,60), H.azar(0,360), 0], [alt*0.02, H.azar(0.8,1.6), alt*0.02], 0.03);
  }
}, 5);

// Poste-estación de trabajo (marca una parada de la guía)
MUNDO.forma('estacion', function (H, color, b, ob) {
  H.pieza('tronco', '#6d5236', 'solido', b, [0, 1.1, 0], [0,0,0], [0.12, 2.2, 0.12], 0);
  H.pieza('caja', color, 'solido', b, [0, 2.3, 0], [0, (ob&&ob.giroCartel)||0, 0], [1.5, 1, 0.08], 0);
  H.pieza('caja', '#f4f2ec', 'brillo', b, [0, 2.3, 0.05], [0, (ob&&ob.giroCartel)||0, 0], [1.3, 0.8, 0.02], 0);
}, 3.4);

// Casa rural / comunidad humana
MUNDO.forma('casa', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 1.3, 0], [0,0,0], [4.5, 2.6, 4], 0);
  H.pieza('cono', '#7a3f2a', 'solido', b, [0, 3.1, 0], [0, 45, 0], [3.6, 1.4, 3.6], 0);
  H.pieza('caja', '#5a4632', 'solido', b, [0, 0.9, 2.02], [0,0,0], [0.9, 1.8, 0.1], 0);
  H.pieza('caja', '#3d5566', 'vidrio', b, [1.4, 1.5, 2.02], [0,0,0], [0.8, 0.8, 0.08], 0);
  // pozo de agua al lado
  H.pieza('cilindro', '#8a827a', 'solido', b, [3.2, 0.5, 1], [0,0,0], [0.6, 1, 0.6], 0);
}, 4.6);


/* ---------------------------------------------- BIODIVERSIDAD DE VALPARAÍSO */

// Palma chilena (Jubaea chilensis): la especie emblema de la región (Ocoa).
MUNDO.forma('palma', function (H, color, b) {
  var alt = H.azar(9, 15);
  // estípite grueso que se angosta arriba, rasgo propio de la especie
  H.pieza('tronco', '#8a7f6a', 'corteza', b, [0, alt*0.5, 0], [0,0,0], [alt*0.075, alt, alt*0.075], 0);
  H.pieza('tronco', '#9a8f78', 'corteza', b, [0, alt*0.88, 0], [0,0,0], [alt*0.055, alt*0.25, alt*0.055], 0);
  var n = 11;
  for (var i = 0; i < n; i++) {
    var a = i / n * 6.2832;
    H.pieza('fronda', color, 'lamina', b, [0, alt, 0],
      [H.azar(18, 62), a*57.3, 0], [0.55, H.azar(2.6, 3.8), 1], 0.07);
  }
  // racimo de coquitos
  if (Math.random() > 0.55)
    H.pieza('esfera', '#c8a24a', 'solido', b, [H.azar(-0.5,0.5), alt*0.94, H.azar(-0.5,0.5)],
      [0,0,0], [0.5, 0.35, 0.5], 0.04);
}, 16);

// Maitén (Maytenus boaria): copa llorona, de bordes de quebrada y potreros.
MUNDO.forma('maiten', function (H, color, b) {
  var alt = H.azar(5, 8);
  H.pieza('tronco', '#5a4a38', 'corteza', b, [0, alt/2, 0], [0,0,0], [alt*0.045, alt, alt*0.045], 0);
  for (var i = 0; i < 5; i++) {
    var r = H.azar(1.5, 2.4);
    H.pieza('esfera', color, 'follaje', b,
      [H.azar(-1.2,1.2), alt*0.62 + i*alt*0.08, H.azar(-1.2,1.2)],
      [0, H.azar(0,360), 0], [r, r*0.78, r], 0.13);
  }
}, 9);

// Molle (Schinus latifolius): esclerófilo típico, copa irregular.
MUNDO.forma('molle', function (H, color, b) {
  var alt = H.azar(3.5, 6);
  H.pieza('tronco', '#5f4c38', 'corteza', b, [0, alt/2, 0], [0, H.azar(0,360), H.azar(-6,6)], [alt*0.05, alt, alt*0.05], 0);
  for (var i = 0; i < 4; i++) {
    var r = H.azar(1.2, 2);
    H.pieza('esfera', color, 'follaje', b,
      [H.azar(-1,1), alt*0.66 + i*alt*0.1, H.azar(-1,1)],
      [0, H.azar(0,360), 0], [r, r*0.85, r], 0.1);
  }
}, 7);

// Maqui (Aristotelia chilensis): arbusto de frutos morados comestibles.
MUNDO.forma('maqui', function (H, color, b) {
  var alt = H.azar(1.8, 3);
  H.pieza('tronco', '#4e4030', 'corteza', b, [0, alt*0.4, 0], [0,0,0], [alt*0.05, alt*0.8, alt*0.05], 0);
  for (var i = 0; i < 3; i++)
    H.pieza('esfera', color, 'follaje', b, [H.azar(-0.6,0.6), alt*0.75 + i*0.28, H.azar(-0.6,0.6)],
      [0, H.azar(0,360), 0], [H.azar(0.8,1.3), H.azar(0.7,1), H.azar(0.8,1.3)], 0.14);
  for (var f = 0; f < 5; f++)
    H.pieza('esfera', '#3a2350', 'brillo', b, [H.azar(-0.8,0.8), alt*H.azar(0.7,1), H.azar(-0.8,0.8)],
      [0,0,0], [0.09, 0.09, 0.09], 0.1);
}, 3.4);

// Colliguay (Colliguaja odorifera): arbusto resinoso de laderas soleadas.
MUNDO.forma('colliguay', function (H, color, b) {
  var alt = H.azar(1, 1.8);
  for (var i = 0; i < 6; i++) {
    var a = i / 6 * 6.2832;
    H.pieza('esfera', color, 'follaje', b,
      [Math.cos(a)*H.azar(0.2,0.6), alt*H.azar(0.4,0.9), Math.sin(a)*H.azar(0.2,0.6)],
      [0, H.azar(0,360), 0], [H.azar(0.4,0.7), H.azar(0.4,0.7), H.azar(0.4,0.7)], 0.12);
  }
}, 2);

// Zorro chilla (Lycalopex griseus): el carnívoro más visible del matorral.
MUNDO.forma('zorro', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 0.42, 0], [0,0,0], [0.28, 0.26, 0.78], 0);
  H.pieza('esfera', color, 'solido', b, [0, 0.55, 0.44], [0,0,0], [0.24, 0.22, 0.26], 0);
  H.pieza('cono', color, 'solido', b, [0, 0.58, 0.56], [90, 0, 0], [0.12, 0.18, 0.12], 0);
  [-0.08, 0.08].forEach(function (dx) {
    H.pieza('cono', '#3a2e24', 'solido', b, [dx, 0.7, 0.42], [0,0,0], [0.09, 0.13, 0.09], 0);
  });
  [[-0.11,0.3],[0.11,0.3],[-0.11,-0.3],[0.11,-0.3]].forEach(function (q) {
    H.pieza('caja', '#5a4a3a', 'solido', b, [q[0], 0.16, q[1]], [0,0,0], [0.07, 0.32, 0.07], 0);
  });
  H.pieza('esfera', '#6a5a48', 'solido', b, [0, 0.4, -0.55], [18,0,0], [0.16, 0.16, 0.42], 0.05);
}, 0.9);

// Degú (Octodon degus): roedor endémico, muy común en el matorral.
MUNDO.forma('degu', function (H, color, b) {
  H.pieza('esfera', color, 'solido', b, [0, 0.13, 0], [0,0,0], [0.13, 0.12, 0.24], 0);
  H.pieza('esfera', color, 'solido', b, [0, 0.17, 0.15], [0,0,0], [0.09, 0.09, 0.1], 0);
  H.pieza('cilindro', '#6a5a46', 'solido', b, [0, 0.12, -0.22], [70,0,0], [0.02, 0.22, 0.02], 0.05);
}, 0.35);

/* ------------------------------------------------------- CONSTRUCCIONES */

// Casa de adobe con corredor: la vivienda rural clásica de la zona central.
MUNDO.forma('casaAdobe', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 1.4, 0], [0,0,0], [7, 2.8, 5], 0);
  // techo de teja a dos aguas
  H.pieza('caja', '#8a4a32', 'solido', b, [0, 3.05, -1.3], [22,0,0], [7.4, 0.2, 3.2], 0);
  H.pieza('caja', '#8a4a32', 'solido', b, [0, 3.05, 1.3], [-22,0,0], [7.4, 0.2, 3.2], 0);
  // corredor con pilares de madera
  H.pieza('caja', '#8a4a32', 'solido', b, [0, 2.75, 3.4], [-14,0,0], [7.4, 0.16, 2.6], 0);
  [-3, -1, 1, 3].forEach(function (dx) {
    H.pieza('tronco', '#6d5236', 'corteza', b, [dx, 1.25, 4.4], [0,0,0], [0.13, 2.5, 0.13], 0);
  });
  H.pieza('caja', '#5a4632', 'solido', b, [0, 1, 2.53], [0,0,0], [1.1, 2, 0.1], 0);
  [-2.2, 2.2].forEach(function (dx) {
    H.pieza('caja', '#3d5566', 'vidrio', b, [dx, 1.7, 2.53], [0,0,0], [1, 1, 0.08], 0);
  });
}, 5.2);

// Galpón / bodega de herramientas con techo de zinc.
MUNDO.forma('galpon', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 1.3, 0], [0,0,0], [6, 2.6, 4], 0);
  H.pieza('caja', '#8d949a', 'metal', b, [0, 2.75, 0], [0,0,0], [6.4, 0.14, 4.4], 0);
  H.pieza('caja', '#4a3a2a', 'solido', b, [0, 1.1, 2.03], [0,0,0], [2.2, 2.2, 0.1], 0);
  // leña apilada al costado
  for (var i = 0; i < 10; i++)
    H.pieza('tronco', '#6d5236', 'corteza', b, [3.6, 0.16 + (i%5)*0.22, -1.4 + Math.floor(i/5)*0.5],
      [0, 90, 0], [0.12, 1.6, 0.12], 0);
}, 3.2);

// REFUGIO: tres niveles habitables, escaleras y piezas. La estructura física
// (pisos, muros, peldaños) se declara en el objeto; acá va solo lo visible.
MUNDO.forma('refugio', function (H, color, b) {
  var NIV = [0.15, 3.3, 6.5], AL = 3.15;
  // losas de entrepiso visibles
  NIV.forEach(function (y, i) {
    if (i === 0) return;
    H.pieza('caja', '#8a7a5e', 'solido', b, [0, y - 0.16, 0], [0,0,0], [14.2, 0.32, 12.2], 0);
  });
  // muros de piedra y madera por nivel
  NIV.forEach(function (y, i) {
    var col = i === 0 ? '#8f8272' : color;
    var acab = i === 0 ? 'roca' : 'solido';
    // trasero y laterales
    H.pieza('caja', col, acab, b, [0, y + AL/2, -6], [0,0,0], [14, AL, 0.34], 0);
    H.pieza('caja', col, acab, b, [-7, y + AL/2, 0], [0,0,0], [0.34, AL, 12], 0);
    H.pieza('caja', col, acab, b, [7, y + AL/2, 0], [0,0,0], [0.34, AL, 12], 0);
    // frente en dos paños, dejando el vano central
    H.pieza('caja', col, acab, b, [-4.1, y + AL/2, 6], [0,0,0], [5.8, AL, 0.34], 0);
    H.pieza('caja', col, acab, b, [4.1, y + AL/2, 6], [0,0,0], [5.8, AL, 0.34], 0);
    // ventanas: al frente y a los costados
    [-4.1, 4.1].forEach(function (dx) {
      H.pieza('caja', '#3d5566', 'vidrio', b, [dx, y + 1.7, 6.02], [0,0,0], [2.2, 1.3, 0.1], 0);
    });
    H.pieza('caja', '#3d5566', 'vidrio', b, [-7.02, y + 1.7, -2], [0,0,0], [0.1, 1.3, 2.4], 0);
    H.pieza('caja', '#3d5566', 'vidrio', b, [7.02, y + 1.7, 2], [0,0,0], [0.1, 1.3, 2.4], 0);
  });
  // dintel sobre el vano de entrada (el hueco queda pasable)
  H.pieza('caja', color, 'solido', b, [0, 2.75, 6], [0,0,0], [2.6, 0.7, 0.34], 0);
  // tabiques interiores visibles
  H.pieza('caja', '#c3b79c', 'solido', b, [-1, 1.7, -1.5], [0,0,0], [0.24, 3.1, 7], 0);
  H.pieza('caja', '#c3b79c', 'solido', b, [1, 4.85, 0], [0,0,0], [0.24, 3.1, 8], 0);
  H.pieza('caja', '#c3b79c', 'solido', b, [-1, 8, 2], [0,0,0], [8, 2.6, 0.24], 0);
  // techo a dos aguas
  H.pieza('caja', '#7a4634', 'solido', b, [0, 10.1, -3], [26,0,0], [14.8, 0.26, 7.4], 0);
  H.pieza('caja', '#7a4634', 'solido', b, [0, 10.1, 3], [-26,0,0], [14.8, 0.26, 7.4], 0);
  // chimenea de piedra
  H.pieza('caja', '#8f8272', 'roca', b, [-5, 10.6, -3.5], [0,0,0], [1.1, 2.6, 1.1], 0);
  // balcón-mirador del último nivel
  H.pieza('caja', '#6d5236', 'solido', b, [0, 6.5, 7.4], [0,0,0], [9, 0.22, 2.8], 0);
  for (var i = 0; i < 10; i++)
    H.pieza('caja', '#6d5236', 'solido', b, [-4.2 + i*0.93, 7.05, 8.7], [0,0,0], [0.1, 1.1, 0.1], 0);
  H.pieza('caja', '#6d5236', 'solido', b, [0, 7.6, 8.7], [0,0,0], [9, 0.12, 0.12], 0);
}, 11);

// Fogón de piedra (acompaña a la luz local del refugio)
MUNDO.forma('fogon', function (H, color, b) {
  for (var i = 0; i < 8; i++) {
    var a = i / 8 * 6.2832;
    H.pieza('roca', '#7c7364', 'roca', b, [Math.cos(a)*0.75, 0.15, Math.sin(a)*0.75],
      [0, H.azar(0,360), 0], [0.34, 0.28, 0.34], 0);
  }
  H.pieza('cono', '#e8913a', 'brillo', b, [0, 0.35, 0], [0,0,0], [0.42, 0.6, 0.42], 0.2);
}, 1);

/* ---------------------------------------------------------------- MUNDO */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS.bosque = {

  titulo: 'Bosque esclerófilo · luz, agua y comunidad',
  semilla: 58390,
  materia: 'Biología · U3 Ecosistemas',
  resumen: 'Bosque de la Cordillera de la Costa, Región de Valparaíso. Palmar, quebrada de umbría y ladera de solana: la luz cambia al caminar. Con la fauna del matorral y el refugio de la comunidad.',

  cielo: '#a9c4d4',
  niebla: { color: '#bcd0d8', cerca: 40, lejos: 150 },
  luz: { cielo: '#dcecf0', suelo: '#5a5238', ambiente: 0.9, sol: '#fff2d8', intensidad: 0.85, posicion: '-16 24 12' },

  clima: { inicial: 'despejado', real: true, auto: false, fallback: { lat: -33.05, lon: -71.5 } },

  // Sonido: ambiente de viento (global) + fuentes posicionales
  sonido: {
    fuentes: [
      // arroyo en el fondo de la quebrada (agua corriente)
      { pos: [-18, 0, 22], filtro: 'bandpass', freq: 1500, q: 0.7, cat: 'naturaleza', vol: 0.34, refDist: 5, maxDist: 28 },
      // susurro de hojas movidas por el viento (varias fuentes suaves)
      { pos: [-4, 4, 28], filtro: 'highpass', freq: 3800, cat: 'naturaleza', tremolo: 0.4, vol: 0.22, refDist: 6, maxDist: 30 },
      { pos: [10, 4, -2], filtro: 'highpass', freq: 4200, cat: 'naturaleza', tremolo: 0.55, vol: 0.2, refDist: 6, maxDist: 30 },
      // aves: chincol y fío-fío en el sotobosque
      { pos: [-10, 3, 20], filtro: 'bandpass', freq: 3200, q: 4, cat: 'fauna', tremolo: 0.9, vol: 0.24, refDist: 5, maxDist: 22 },
      { pos: [6, 4, 44], filtro: 'bandpass', freq: 2800, q: 5, cat: 'fauna', tremolo: 1.3, vol: 0.2, refDist: 5, maxDist: 20 },
      { pos: [16, 5, -22], filtro: 'bandpass', freq: 3600, q: 4, cat: 'fauna', tremolo: 0.7, vol: 0.18, refDist: 6, maxDist: 24 },
      // crepitar del fogón de la comunidad
      { pos: [-6, 0.6, -42], filtro: 'bandpass', freq: 900, q: 1.2, cat: 'ambiente', tremolo: 2.2, vol: 0.2, refDist: 4, maxDist: 14 }
    ]
  },

  ancho: 150,
  anchoVida: 116,
  inicio: '0 1.7 64',

  vistas: {
    inicio:  { etiqueta: 'Inicio del sendero',  pos: '0 1.7 64',   pitch: -2, yaw: 0 },
    palmar:  { etiqueta: 'El palmar',           pos: '6 1.7 44',   pitch: 4,  yaw: 10 },
    umbria:  { etiqueta: 'Quebrada de umbría',  pos: '-20 1.7 22', pitch: 0,  yaw: -30 },
    solana:  { etiqueta: 'Ladera de solana',    pos: '24 1.7 -2',  pitch: 2,  yaw: 40 },
    matorral:{ etiqueta: 'Matorral y fauna',    pos: '8 1.7 -24',  pitch: 0,  yaw: 150 },
    refugio: { etiqueta: 'El refugio',          pos: '-14 1.9 -36', pitch: 2, yaw: 180 }
  },

  /* ZONAS DE LUZ: el motor mezcla la luz global con estos valores según dónde
     esté el jugador. Caminar de la solana a la umbría se SIENTE: la luz cae y
     se enfría. Es el contenido de la clase convertido en experiencia. */
  luzZonas: [
    { x: 0, z: 43, ancho: 150, largo: 18, ambiente: 1.0,  intensidad: 1.05, borde: 7 },
    { x: 0, z: 22, ancho: 150, largo: 24, ambiente: 0.38, intensidad: 0.2,  borde: 9 },
    { x: 0, z: -2, ancho: 150, largo: 24, ambiente: 1.12, intensidad: 1.3,  borde: 9 }
  ],

  // Luces locales: interior del refugio y el fogón de la comunidad
  luces: [
    { pos: [-14, 2.4, -46], color: '#ffd9a0', intensidad: 0.7, alcance: 13 },
    { pos: [-14, 5.5, -46], color: '#ffd9a0', intensidad: 0.6, alcance: 12 },
    { pos: [-14, 8.6, -46], color: '#ffe2b4', intensidad: 0.5, alcance: 11 },
    { pos: [-6, 0.9, -42],  color: '#ff9840', intensidad: 0.9, alcance: 9 }
  ],

  franjas: [
    {
      id: 'sendero', nombre: 'Sendero de entrada', rango: 'Bienvenida a la guía',
      z: [70, 52], y: 0, color: '#7a6f4e', superficie: 'tierra',
      texto: 'Estás en el bosque esclerófilo de la Cordillera de la Costa, en la Región de Valparaíso. Este recorrido es una guía de trabajo: en cada estación hay algo que observar, dibujar o responder. El hilo es una pregunta: ¿qué le está pasando a este bosque, y a la gente que vive de él?',
      vida: ['Sigue las estaciones numeradas', 'Fíjate en cuánta luz hay en cada tramo', 'Cada color de recuadro es un tipo de tarea distinta'],
      especies: [
        { forma: 'helecho', n: 26, color: '#3f6b34' },
        { forma: 'boldo', n: 10, color: '#6f8a5c', nombre: 'Boldo', choca: { r: 0.3, alto: 4 } },
        { forma: 'molle', n: 12, color: '#5f7d4c', nombre: 'Molle', choca: { r: 0.28, alto: 4 } }
      ]
    },
    {
      id: 'palmar', nombre: 'Palmar de palma chilena', rango: 'La especie emblema de la región',
      z: [52, 34], y: 0.1, color: '#8a7f5c', superficie: 'tierra',
      texto: 'La palma chilena (<i>Jubaea chilensis</i>) es el árbol emblema de la Región de Valparaíso y la palmera que crece más al sur del mundo. Quedan pocos palmares: el de Ocoa, en La Campana, es el mayor. Crece lentísimo y puede vivir siglos, pero casi no hay palmas jóvenes: el ganado y los roedores comen los coquitos antes de que germinen.',
      vida: ['Palma chilena (<i>Jubaea chilensis</i>), emblema regional', 'Casi no hay renovales: faltan palmas jóvenes', 'Bajo las palmas crecen espino y colliguay'],
      reto: 'Cuenta cuántas palmas grandes ves y cuántas pequeñas. ¿Qué le pasará a este palmar en cien años si la proporción no cambia?',
      especies: [
        { forma: 'palma',     n: 26, color: '#5f7a44', nombre: 'Palma chilena', choca: { r: 0.5, alto: 12 } },
        { forma: 'espino',    n: 22, color: '#818c5e', nombre: 'Espino', choca: { r: 0.24, alto: 3.5 } },
        { forma: 'colliguay', n: 34, color: '#6b7f4a', nombre: 'Colliguay' },
        { forma: 'pasto',     n: 130, color: '#a09257', nombre: 'Pasto seco' }
      ]
    },
    {
      id: 'umbria', nombre: 'Quebrada de umbría', rango: 'La ladera que no recibe sol',
      z: [34, 10], y: -0.3, color: '#43492c', superficie: 'tierra',
      texto: 'Esta ladera mira al sur: el sol nunca le pega de frente. Fíjate en la luz al entrar. Menos radiación significa menos evaporación, y esa agua que se queda sostiene un bosque completamente distinto al de la ladera de enfrente, a solo doscientos metros. Aquí crecen los árboles que necesitan humedad constante.',
      vida: ['Belloto del norte, especie amenazada de quebradas húmedas', 'Boldo (<i>Peumus boldus</i>), aromático y medicinal', 'Maitén de copa llorona en el borde del agua', 'Helechos y musgos: solo viven donde hay humedad constante'],
      reto: 'Mira el mismo cerro hacia los dos lados. ¿Por qué una ladera tiene bosque denso y la otra matorral? La respuesta no es el suelo ni la lluvia: es cuántas horas de sol recibe cada una.',
      especies: [
        { forma: 'belloto', n: 26, color: '#35603a', nombre: 'Belloto del norte', choca: { r: 0.4, alto: 7 } },
        { forma: 'boldo',   n: 24, color: '#4f6f42', nombre: 'Boldo', choca: { r: 0.32, alto: 4 } },
        { forma: 'maiten',  n: 14, color: '#456b3e', nombre: 'Maitén', choca: { r: 0.3, alto: 6 } },
        { forma: 'maqui',   n: 30, color: '#3c5c38', nombre: 'Maqui' },
        { forma: 'helecho', n: 110, color: '#315a2c' },
        { forma: 'costra',  n: 40, color: '#4a5c3a', nombre: 'Musgo' }
      ]
    },
    {
      id: 'solana', nombre: 'Ladera de solana', rango: 'Donde el sol pega todo el día',
      z: [10, -14], y: 0.2, color: '#8f8155', superficie: 'tierra',
      texto: 'La ladera que mira al norte recibe sol de la mañana a la tarde. Acá la luz es dura y el suelo se seca: dominan las especies de hoja gruesa y dura —de ahí el nombre esclerófilo, "hoja dura"— que resisten perder agua. Pero incluso ellas muestran árboles secos en pie: con la megasequía, el límite del bosque retrocede ladera abajo.',
      vida: ['Litre (<i>Lithraea caustica</i>), de hoja dura y resinosa', 'Quillay (<i>Quillaja saponaria</i>), de corteza con saponina', 'Peumo (<i>Cryptocarya alba</i>), de fruto rojo comestible', 'Quisco y chagual: suculentas que almacenan agua', 'Árboles secos en pie: la marca del estrés hídrico'],
      reto: 'Toca (con cuidado) una hoja de litre y una de belloto. ¿Por qué la de la solana es gruesa y dura, y la de la quebrada delgada y blanda?',
      especies: [
        { forma: 'litreN',    n: 38, color: '#5c7040', nombre: 'Litre', choca: { r: 0.3, alto: 3.5 } },
        { forma: 'quillay',   n: 30, color: '#6f8256', nombre: 'Quillay', choca: { r: 0.34, alto: 5 } },
        { forma: 'peumo',     n: 24, color: '#3f5c34', nombre: 'Peumo', choca: { r: 0.3, alto: 5 } },
        { forma: 'columna',   n: 30, color: '#55703f', nombre: 'Quisco', choca: { r: 0.3, alto: 3.5 } },
        { forma: 'roseta',    n: 26, color: '#7d8b6a', nombre: 'Chagual' },
        { forma: 'colliguay', n: 30, color: '#7b8a52', nombre: 'Colliguay' },
        { forma: 'seco',      n: 26, color: '#9a8f7a', nombre: 'Árbol seco', choca: { r: 0.2, alto: 3 } }
      ]
    },
    {
      id: 'matorral', nombre: 'Matorral y fauna', rango: 'Quién vive en el bosque',
      z: [-14, -34], y: 0.1, color: '#847451', superficie: 'tierra',
      texto: 'El matorral parece vacío, pero es donde se concentra la fauna. El zorro chilla caza al atardecer; el degú, un roedor endémico de Chile central, hace galerías bajo los arbustos y es la presa principal de casi todos los depredadores. Si desaparece el matorral, se cae la cadena completa.',
      vida: ['Zorro chilla (<i>Lycalopex griseus</i>), carnívoro del matorral', 'Degú (<i>Octodon degus</i>), roedor endémico y social', 'Lagartijas que regulan su temperatura al sol', 'Espino y colliguay como refugio y alimento'],
      reto: 'El degú come plantas y el zorro come degús. Dibuja la cadena y agrega una flecha más: ¿qué pasa si se quema el matorral?',
      especies: [
        { forma: 'espino',    n: 30, color: '#818c5e', nombre: 'Espino', choca: { r: 0.24, alto: 3.5 } },
        { forma: 'colliguay', n: 40, color: '#7b8a52', nombre: 'Colliguay' },
        { forma: 'maqui',     n: 18, color: '#41613a', nombre: 'Maqui' },
        { forma: 'degu',      n: 16, color: '#9a8258', nombre: 'Degú' },
        { forma: 'zorro',     n: 3,  color: '#9a8464', nombre: 'Zorro chilla' },
        { forma: 'pasto',     n: 150, color: '#a09257', nombre: 'Pasto seco' }
      ]
    },
    {
      id: 'comunidad', nombre: 'La comunidad humana', rango: 'Quienes viven del bosque',
      z: [-34, -60], y: 0, color: '#7d6f4c', superficie: 'tierra',
      texto: 'Al borde del bosque vive gente que depende de él: agua de vertiente, leña, recolección de frutos y hierbas, apicultura. El cambio climático no es solo un problema de los árboles: cuando la vertiente baja su caudal o el bosque retrocede, son estas familias las que lo sienten primero. El refugio grande es el punto de encuentro de la comunidad.',
      vida: ['Pozos y vertientes que dependen de la recarga del bosque', 'Recolección de boldo, peumo, maqui y miel', 'La sequía obliga a comprar agua en camiones aljibe', 'El refugio se usa para reuniones y para brigadas de incendio'],
      especies: [
        { forma: 'seco',   n: 12, color: '#9a8f7a' },
        { forma: 'litreN', n: 10, color: '#5c7040' },
        { forma: 'maiten', n: 6,  color: '#4d7043', nombre: 'Maitén', choca: { r: 0.3, alto: 6 } }
      ]
    }
  ],

  // AVES NATIVAS del bosque esclerófilo de Chile central
  aves: [
    { nombre: 'Chincol',    n: 5, tam: 0.8, color: '#7a6248', pecho: '#b8a888', ala: '#5a4632',
      altura: [3, 7], radio: [6, 12], vel: 0.3 },
    { nombre: 'Fío-fío',    n: 3, tam: 0.75, color: '#6a7258', pecho: '#c8c4a0', ala: '#4e5240',
      altura: [4, 9], radio: [8, 14], vel: 0.35 },
    { nombre: 'Tenca',      n: 3, tam: 1.0, color: '#9a8f7a', pecho: '#d8d0bc', ala: '#6a5f4c',
      altura: [3, 8], radio: [10, 16], vel: 0.28 },
    { nombre: 'Tórtola',    n: 4, tam: 1.05, color: '#a89684', pecho: '#c4b0a0', ala: '#7a6858',
      altura: [2, 6], radio: [6, 12], vel: 0.22, planea: 1 },
    { nombre: 'Golondrina', n: 6, tam: 0.7, color: '#2a3548', pecho: '#e4e0d4', ala: '#1e2838',
      altura: [8, 16], radio: [14, 24], vel: 0.55, planea: 1 },
    { nombre: 'Zorzal',     n: 3, tam: 1.0, color: '#4a4038', pecho: '#c88a4a', ala: '#38302a',
      altura: [3, 7], radio: [8, 14], vel: 0.26 },
    { nombre: 'Chercán',    n: 4, tam: 0.62, color: '#7a5c3c', pecho: '#c8b088', ala: '#5c4028',
      altura: [1.5, 4], radio: [5, 9], vel: 0.34 },
    { nombre: 'Picaflor chico', n: 3, tam: 0.5, color: '#2e6a4a', pecho: '#d8c8a8', ala: '#1e4a34',
      altura: [2, 5], radio: [4, 8], vel: 0.6 },
    { nombre: 'Diucón',     n: 3, tam: 0.9, color: '#7c8288', pecho: '#d4d8da', ala: '#5a6066',
      altura: [3, 8], radio: [8, 14], vel: 0.27 },
    { nombre: 'Loica',      n: 3, tam: 1.0, color: '#4a4038', pecho: '#c8342a', ala: '#38302a',
      altura: [2, 6], radio: [8, 15], vel: 0.3 },
    { nombre: 'Queltehue',  n: 2, tam: 1.15, color: '#5a5a5a', pecho: '#e8e8e4', ala: '#2e2e2e',
      altura: [2, 5], radio: [10, 18], vel: 0.25 },
    { nombre: 'Aguilucho',  n: 2, tam: 1.6, color: '#6a5a48', pecho: '#d8cfbc', ala: '#4a3e30',
      altura: [16, 26], radio: [22, 34], vel: 0.4, planea: 1 },
    { nombre: 'Jote de cabeza colorada', n: 2, tam: 1.7, color: '#2e2823', pecho: '#3a322c', ala: '#221d19',
      altura: [18, 30], radio: [24, 38], vel: 0.32, planea: 1 }
  ],

  objetos: [
    // ---------- ESTACIONES DE LA GUÍA ----------
    { forma: 'estacion', color: '#2f6b45', pos: [4, 0, 58], giroCartel: -20,
      nombre: 'Estación 1', ficha: 'e1', altoFicha: 3.6 },
    { forma: 'estacion', color: '#2f6b45', pos: [8, 0.1, 44],
      nombre: 'Estación 2', ficha: 'palmar', altoFicha: 3.6 },
    { forma: 'estacion', color: '#2f6b45', pos: [-14, -0.3, 24],
      nombre: 'Estación 3', ficha: 'e2', altoFicha: 3.6 },
    { forma: 'estacion', color: '#2f6b45', pos: [-10, -0.3, 14],
      nombre: 'Estación 4', ficha: 'e6', altoFicha: 3.6 },
    { forma: 'estacion', color: '#8a6a2c', pos: [16, 0.2, -2],
      nombre: 'Estación 5', ficha: 'e3', altoFicha: 3.6 },
    { forma: 'estacion', color: '#8a6a2c', pos: [6, 0.2, -10],
      nombre: 'Estación 6', ficha: 'e4', altoFicha: 3.6 },
    { forma: 'estacion', color: '#8a6a2c', pos: [10, 0.1, -24],
      nombre: 'Estación 7', ficha: 'fauna', altoFicha: 3.6 },
    { forma: 'estacion', color: '#5a4a8a', pos: [-4, 0, -40],
      nombre: 'Estación 8', ficha: 'e5', altoFicha: 3.6 },

    /* ---------- ESTACIONES TEMÁTICAS ----------
       Recorren el hilo conceptual del mundo: biodiversidad → sequía →
       refugios climáticos → fuego → resiliencia → acción. Van en teal para
       distinguirlas de las estaciones numeradas de la guía. */
    { forma: 'estacion', color: '#1f6f78', pos: [-8, 0.1, 48],
      nombre: 'Biodiversidad', ficha: 'diversidad', altoFicha: 3.6 },
    { forma: 'estacion', color: '#1f6f78', pos: [-20, -0.3, 16],
      nombre: 'Refugios climáticos', ficha: 'refugios', altoFicha: 3.6 },
    { forma: 'estacion', color: '#1f6f78', pos: [22, 0.2, -6],
      nombre: 'La megasequía', ficha: 'sequia', altoFicha: 3.6 },
    { forma: 'estacion', color: '#1f6f78', pos: [14, 0.1, -18],
      nombre: 'El fuego', ficha: 'incendio', altoFicha: 3.6 },
    { forma: 'estacion', color: '#1f6f78', pos: [-2, 0.1, -28],
      nombre: 'Resiliencia', ficha: 'resiliencia', altoFicha: 3.6 },
    { forma: 'estacion', color: '#c07a2c', pos: [-10, 0, -52],
      nombre: '¿Qué podemos hacer?', ficha: 'accion', altoFicha: 3.6 },

    /* ---------- EL REFUGIO: tres niveles, escaleras y piezas ----------
       Toda la física va acá: 'pisos' son las superficies pisables de cada
       nivel (dejando el hueco de la caja de escala), 'escalones' los dos
       tramos, y 'choca' los muros exteriores y los tabiques de cada piso. */
    { forma: 'refugio', color: '#d5cbb2', pos: [-14, 0, -46], giro: 0,
      nombre: 'Refugio de la comunidad', ficha: 'refugio', altoFicha: 12,
      pisos: [
        { dx: 0,    dz: 0,   ancho: 14, largo: 12, alto: 0.15, color: '#9c8f76' },
        { dx: -1.5, dz: 0,   ancho: 11, largo: 12, alto: 3.3,  color: '#a89a80' },
        { dx: 5.5,  dz: 5.5, ancho: 3,  largo: 1,  alto: 3.3,  color: '#a89a80' },
        { dx: 5.5,  dz: -5,  ancho: 3,  largo: 2,  alto: 3.3,  color: '#a89a80' },
        { dx: 1.5,  dz: 0,   ancho: 11, largo: 12, alto: 6.5,  color: '#a89a80' },
        { dx: -5.5, dz: 5.5, ancho: 3,  largo: 1,  alto: 6.5,  color: '#a89a80' },
        { dx: -5.5, dz: -5,  ancho: 3,  largo: 2,  alto: 6.5,  color: '#a89a80' },
        { dx: 0,    dz: 7.4, ancho: 9,  largo: 2.8, alto: 6.5, color: '#8a7048' }
      ],
      escalones: [
        { dx: 5.5,  dz: 5, ancho: 2.8, largo: 9, alto: 3.15, base: 0.15, pasos: 16, color: '#a8894e' },
        { dx: -5.5, dz: 5, ancho: 2.8, largo: 9, alto: 3.2,  base: 3.3,  pasos: 16, color: '#a8894e' }
      ],
      choca: [
        { dx: 0,    dz: -6,  ancho: 14,  largo: 0.34, base: 0, alto: 9.6 },
        { dx: -7,   dz: 0,   ancho: 0.34, largo: 12,  base: 0, alto: 9.6 },
        { dx: 7,    dz: 0,   ancho: 0.34, largo: 12,  base: 0, alto: 9.6 },
        { dx: -4.1, dz: 6,   ancho: 5.8, largo: 0.34, base: 0, alto: 9.6 },
        { dx: 4.1,  dz: 6,   ancho: 5.8, largo: 0.34, base: 0, alto: 9.6 },
        { dx: -1,   dz: -1.5, ancho: 0.24, largo: 7,  base: 0,   alto: 3.1 },
        { dx: 1,    dz: 0,   ancho: 0.24, largo: 8,   base: 3.3, alto: 3.1 },
        { dx: -1,   dz: 2,   ancho: 8,   largo: 0.24, base: 6.5, alto: 2.6 },
        { dx: 0,    dz: 8.7, ancho: 9,   largo: 0.14, base: 6.5, alto: 1.1 }
      ] },

    // ---------- OTRAS VIVIENDAS DE LA COMUNIDAD ----------
    { forma: 'casa', color: '#c9bfa6', pos: [-2, 0, -36], giro: 20,
      nombre: 'Casa rural', choca: [{ dx: 0, dz: 0, ancho: 4.5, largo: 4, alto: 2.6 }] },
    { forma: 'casaAdobe', color: '#d8c8a8', pos: [12, 0, -44], giro: -18,
      nombre: 'Casa de adobe', ficha: 'adobe', altoFicha: 5.4,
      choca: [{ dx: 0, dz: 0, ancho: 7, largo: 5, alto: 2.8 }] },
    { forma: 'casaAdobe', color: '#cfc0a0', pos: [22, 0, -54], giro: 8,
      nombre: 'Casa de adobe', choca: [{ dx: 0, dz: 0, ancho: 7, largo: 5, alto: 2.8 }] },
    { forma: 'galpon', color: '#b8a888', pos: [2, 0, -52], giro: 34,
      nombre: 'Galpón de leña', choca: [{ dx: 0, dz: 0, ancho: 6, largo: 4, alto: 2.6 }] },
    { forma: 'fogon', color: '#e8913a', pos: [-6, 0, -42],
      nombre: 'Fogón', ficha: 'fogon', altoFicha: 2 }
  ],

  fichas: [
    {
      id: 'resiliencia', nombre: 'Resiliencia: qué se recupera y qué no', rango: 'Idea central del recorrido',
      texto: 'Resiliencia es la capacidad de un ecosistema de volver a funcionar después de un golpe. Este bosque es muy resiliente frente a las perturbaciones con las que evolucionó: un verano seco, un incendio ocasional, un año malo. La mayoría de estos árboles rebrota de cepa —del tocón vuelve a salir el árbol— y por eso un bosque quemado puede recuperarse solo. Pero la resiliencia tiene un límite: si los golpes se repiten antes de que alcance a recuperarse, el sistema cruza un umbral y ya no vuelve al estado anterior. Queda convertido en otra cosa, casi siempre más pobre.',
      vida: ['Rebrote de cepa: del tocón sale el árbol nuevo', 'La resiliencia depende del TIEMPO entre golpes, no solo de su tamaño', 'Cruzado el umbral, el sistema no vuelve: cambia de estado', 'Espinal y matorral suelen ser bosque que cruzó ese umbral'],
      reto: '¿Por qué un incendio cada 50 años puede ser tolerable y uno cada 5 años ser destructivo, aunque cada incendio sea del mismo tamaño? Tu respuesta debe usar la palabra "tiempo".',
      actividad: 'Compara la ladera de solana con la quebrada. Anota cuál crees que se recuperaría más rápido de un incendio y por qué. Después revisa la ficha de la umbría para contrastar tu hipótesis.'
    },
    {
      id: 'incendio', nombre: 'Fuego: el golpe que más cambió', rango: 'Perturbación y umbral',
      texto: 'El bosque esclerófilo conoce el fuego, pero no este fuego. Casi todos los incendios de Chile central son causados por personas, y con la sequía prolongada la vegetación llega al verano con menos agua en los tejidos: arde más fácil, más rápido y más caliente. Un incendio muy caliente ya no solo quema la parte aérea: mata la cepa bajo tierra, que es justamente la estructura de la que el bosque rebrota. Ahí se pierde la capacidad de recuperación.',
      vida: ['La mayoría de los incendios son de origen humano', 'La sequía hace que la misma vegetación arda más intensamente', 'Si muere la cepa subterránea, ya no hay rebrote', 'Tras el fuego repetido suele instalarse pasto seco y espino'],
      reto: 'Explica esta cadena con tus palabras: menos lluvia → plantas más secas → fuego más caliente → muere la cepa → no hay rebrote. ¿En qué eslabón sería más efectivo intervenir?',
      actividad: 'Recorre la ladera de solana y cuenta los árboles secos en pie. Imagina un incendio ahí y otro en la quebrada húmeda: describe las dos escenas.'
    },
    {
      id: 'sequia', nombre: 'La megasequía', rango: 'El golpe lento',
      texto: 'Desde 2010 Chile central vive un déficit de lluvias sostenido, sin precedentes en el registro instrumental: es lo que se llama la megasequía. A diferencia de un incendio, es un golpe lento y por eso más difícil de ver. Sus marcas están a la vista: árboles secos en pie, límite del bosque que retrocede ladera abajo, y vertientes que bajan su caudal cada año. Un bosque debilitado por años de sequía es además más vulnerable a plagas y a incendios: los golpes se suman.',
      vida: ['Déficit de lluvias sostenido desde 2010', 'El límite del bosque retrocede hacia las zonas más húmedas', 'La sequía debilita y hace al bosque más vulnerable a otros golpes', 'Las quebradas de umbría funcionan como refugio climático'],
      reto: 'La sequía no mata al bosque directamente: lo debilita. Explica por qué eso puede ser peor que un golpe único y fuerte.',
      actividad: 'Busca tres árboles secos en pie y anota en qué franja está cada uno. ¿Se reparten al azar o hay un patrón?'
    },
    {
      id: 'refugios', nombre: 'Refugios climáticos', rango: 'Dónde sobrevive el bosque',
      texto: 'No todo el paisaje se calienta igual. Las quebradas de umbría —las que miran al sur, con menos horas de sol— conservan humedad cuando todo alrededor se seca. Funcionan como refugios climáticos: lugares donde las especies más exigentes en agua, como el belloto del norte, pueden aguantar mientras el clima general empeora. Son las piezas del paisaje que más conviene proteger, porque desde ahí puede volver a expandirse el bosque si las condiciones mejoran.',
      vida: ['Las quebradas de umbría retienen humedad todo el verano', 'Ahí sobreviven las especies que necesitan más agua', 'Son fuente de semillas para recolonizar cuando mejora el clima', 'Proteger una quebrada rinde más que plantar en la ladera seca'],
      reto: 'Si tuvieras recursos para proteger solo una parte de este cerro, ¿elegirías la ladera de solana o la quebrada de umbría? Justifica pensando en el futuro, no en el presente.',
      actividad: 'Camina de la solana a la umbría y fíjate en el cambio de luz. Anota qué sientes distinto y qué especies aparecen y desaparecen.'
    },
    {
      id: 'diversidad', nombre: 'Por qué importa la diversidad', rango: 'Biodiversidad y seguro',
      texto: 'Chile central es un punto caliente de biodiversidad mundial: una zona con muchísimas especies que no existen en ningún otro lugar y que además está muy amenazada. Un bosque con muchas especies es más resiliente que uno con pocas, y la razón es sencilla: cada especie responde distinto al mismo golpe. Si llega una sequía, unas mueren y otras aguantan; el sistema pierde piezas pero sigue funcionando. Un bosque de una sola especie no tiene ese seguro: si el golpe le pega a esa especie, se cae entero.',
      vida: ['Chile central es uno de los 36 puntos calientes del planeta', 'Alta proporción de especies endémicas: solo viven aquí', 'Más especies = más respuestas distintas al mismo golpe', 'La diversidad funciona como un seguro frente a la incertidumbre'],
      reto: 'Compara una plantación de pinos con este bosque nativo frente a una sequía. ¿Cuál se recupera mejor y por qué? Usa la idea de "seguro".',
      actividad: 'Anota todas las especies distintas que reconozcas en el recorrido. Después marca cuáles viven solo en Chile: esa es la parte irremplazable.'
    },
    {
      id: 'accion', nombre: 'Qué se puede hacer', rango: 'Cierre del recorrido',
      texto: 'Frente a un problema global es fácil sentir que nada de lo local sirve. Pero la resiliencia se juega justamente en la escala local: proteger las quebradas de umbría, evitar el fuego en los meses críticos, dejar que el bosque rebrote en vez de despejar el terreno, mantener conectados los parches de vegetación para que la fauna pueda moverse. Ninguna de esas acciones detiene el cambio climático, pero todas aumentan el tiempo que este bosque tiene para adaptarse.',
      vida: ['Proteger los refugios de umbría, que son fuente de semillas', 'Cuidar el rebrote en vez de despejar el terreno quemado', 'Mantener corredores entre parches para la fauna', 'Prevención de incendios en los meses de mayor riesgo'],
      reto: 'De estas cuatro acciones, ¿cuál crees que tendría más efecto en este cerro concreto? Defiende tu elección con lo que observaste en el recorrido.',
      actividad: 'Escribe una propuesta de media página dirigida a la comunidad del refugio: qué harías tú primero y con qué argumento los convencerías.'
    },
    {
      id: 'palmar', nombre: 'La palma chilena', rango: 'Emblema de la Región de Valparaíso',
      texto: 'La palma chilena (<i>Jubaea chilensis</i>) es la palmera que crece más al sur del planeta y el árbol emblema de esta región. Es endémica de Chile central: no existe de forma natural en ningún otro lugar del mundo. Crece muy lento y puede superar los 500 años, pero su tronco no se ramifica: si se corta, no rebrota.',
      vida: ['Endémica de Chile central', 'El palmar de Ocoa, en La Campana, es el mayor que queda', 'Durante siglos se derribaron palmas para extraer la miel de su savia', 'El coquito es su fruto: comestible y muy buscado'],
      reto: 'Una palma tarda más de 60 años en dar sus primeros frutos. Si hoy plantas una, ¿quién la verá fructificar? Escribe qué implica eso para las decisiones de conservación.',
      actividad: 'Cuenta las palmas grandes y las pequeñas que ves en el palmar. Anota la proporción y proyéctala a cien años.'
    },
    {
      id: 'fauna', nombre: 'La fauna del matorral', rango: 'Quién vive donde parece que no hay nada',
      texto: 'El matorral parece pobre comparado con el bosque, pero sostiene la mayor parte de la fauna. El degú es un roedor endémico, diurno y social, que vive en colonias con galerías subterráneas. Es la presa principal del zorro chilla, del aguilucho y de casi todos los depredadores de la zona central: por eso se le llama una especie clave.',
      vida: ['Degú (<i>Octodon degus</i>), endémico y diurno', 'Zorro chilla (<i>Lycalopex griseus</i>)', 'Aguilucho y cernícalo cazando desde el aire', 'Lagartijas que se asolean para regular su temperatura'],
      reto: 'Si el degú desaparece, ¿a cuántas especies afecta? Dibuja la red y cuenta las flechas que llegan a él.',
      actividad: 'Observa a los degús y a los zorros. Anota a qué distancia de un arbusto están siempre: ¿por qué nunca se alejan mucho?'
    },
    {
      id: 'refugio', nombre: 'El refugio de la comunidad', rango: 'Tres niveles',
      texto: 'Este refugio es el punto de encuentro de la comunidad: abajo el comedor y la cocina a leña, en el nivel intermedio las piezas donde se aloja quien viene de lejos, y arriba el mirador desde donde se vigila el bosque. En verano funciona como base de la brigada contra incendios: desde el balcón se ve toda la ladera de solana.',
      vida: ['Planta baja: comedor, cocina a leña y bodega', 'Nivel intermedio: piezas de alojamiento', 'Mirador: vigilancia de incendios sobre la ladera'],
      reto: 'Sube al mirador y observa las dos laderas desde arriba. ¿Cuál se ve más verde? ¿Por dónde crees que avanzaría más rápido un incendio?',
      actividad: 'Recorre los tres niveles. Desde el balcón, dibuja el perfil del cerro marcando dónde termina el bosque y empieza el matorral.'
    },
    {
      id: 'adobe', nombre: 'La casa de adobe', rango: 'Arquitectura de la zona central',
      texto: 'El adobe —barro, paja y agua secados al sol— fue el material de la vivienda rural chilena durante siglos. Sus muros gruesos funcionan como un regulador térmico: tardan tanto en calentarse que la casa se mantiene fresca en los días de sol fuerte y tibia de noche. El corredor exterior da sombra a las paredes y a las ventanas.',
      vida: ['Muros gruesos de barro y paja', 'Corredor que da sombra a la fachada', 'Fresca de día y tibia de noche, sin gastar energía'],
      reto: 'El adobe hace lo mismo que la hoja dura del litre: administrar el calor y el agua. Explica en qué se parecen las dos soluciones.'
    },
    {
      id: 'fogon', nombre: 'El fogón y la leña', rango: 'Energía y bosque',
      texto: 'Buena parte de las familias del secano se calientan y cocinan con leña del bosque nativo. Es energía renovable solo si se extrae más lento de lo que el bosque crece: cuando la extracción supera esa tasa, el bosque se degrada y termina convertido en matorral de espino.',
      vida: ['La leña es la principal fuente de calor del secano', 'Renovable solo si se extrae bajo la tasa de crecimiento', 'El espinal suele ser bosque degradado, no vegetación original'],
      reto: 'Un quillay tarda décadas en alcanzar el porte para dar leña. ¿Cuántos árboles necesita al año una familia, y cuántos deberían estar creciendo al mismo tiempo para que sea sostenible?'
    },
    {
      id: 'e1', estacion: '1', nombre: 'Reconocer el bosque nativo', rango: 'Sendero de entrada',
      texto: 'Antes de hablar de cambio climático, hay que saber qué bosque estamos mirando. Este es bosque esclerófilo: árboles de hoja dura adaptados al verano seco de Chile central.',
      actividad: 'Identifica al menos tres árboles nativos distintos usando sus etiquetas: fíjate en la forma de la copa, la altura y el color del follaje. El boldo es redondeado, el litre ancho y bajo, el belloto alto y esbelto.',
      esquema: 'Dibuja la silueta de tres árboles que reconozcas y anota su nombre debajo. No tienen que ser perfectos: lo importante es notar las diferencias de forma.',
      pregunta: ['¿Qué es un árbol "de hoja dura" y por qué le sirve en un lugar con veranos secos?']
    },
    {
      id: 'e2', estacion: '2', nombre: 'La quebrada: el bosque que depende del agua', rango: 'Zona húmeda',
      texto: 'Baja al fondo de la quebrada. Aquí hay helechos, boldos grandes y bellotos: todos necesitan humedad constante. Esta es la parte del bosque más sensible a que llueva menos.',
      actividad: 'Compara este sector con la ladera seca que verás después. Observa el suelo, la cantidad de helechos y el tamaño de los árboles.',
      esquema: 'Haz un perfil del terreno: dibuja la quebrada abajo y la ladera arriba, y ubica en tu dibujo dónde crece cada tipo de planta.',
      pregunta: [
        '¿Por qué los helechos crecen aquí y no en la ladera soleada?',
        'Si las lluvias disminuyen, ¿qué franja del bosque crees que cambiará primero: la quebrada o la ladera? Justifica.'
      ]
    },
    {
      id: 'e3', estacion: '3', nombre: 'La ladera seca y los árboles muertos', rango: 'Consecuencia sobre el bosque',
      texto: 'En la ladera de solana encuentras litre, quillay y peumo, todos resistentes. Pero mira con atención: hay árboles secos en pie. La megasequía que afecta a Chile central desde hace más de una década está empujando el límite del bosque ladera abajo.',
      actividad: 'Cuenta cuántos árboles secos ves en esta zona frente a cuántos árboles vivos. Anota la proporción aproximada.',
      esquema: 'Dibuja un árbol vivo y uno seco lado a lado, y rotula qué le falta al segundo (hojas, follaje verde, ramas nuevas).',
      pregunta: [
        '¿Qué relación hay entre la falta de lluvia y los árboles secos que observas?',
        'Un árbol tarda décadas en crecer. Si mueren más rápido de lo que crecen los nuevos, ¿qué le pasa al bosque en el largo plazo?'
      ]
    },
    {
      id: 'e4', estacion: '4', nombre: 'Cadenas y consecuencias', rango: 'Pensar el ecosistema completo',
      texto: 'El bosque no es solo árboles. Es un sistema: los árboles dan sombra y humedad al suelo, el suelo retiene agua, esa agua alimenta las vertientes, y de las vertientes bebe la fauna y la gente. Si se debilita una parte, el efecto se propaga.',
      actividad: 'Elige un árbol nativo del bosque (boldo, quillay, peumo) y piensa en todo lo que depende de él: qué animales lo usan, qué le da al suelo, qué le da a las personas.',
      esquema: 'Construye un esquema de flechas (mapa conceptual) que empiece en "menos lluvia" y llegue hasta "menos agua para la comunidad". Pon al menos cuatro pasos intermedios conectados con flechas.',
      pregunta: ['En tu esquema, ¿cuál es el primer eslabón que se rompe, y cuál es el último en notarse?']
    },
    {
      id: 'e6', estacion: '6', nombre: 'Las aves del bosque', rango: 'Fauna e indicadores',
      texto: 'Mira hacia arriba: el bosque está lleno de aves. El chincol de copete, el fío-fío que repite su nombre al cantar, la tenca imitadora, la tórtola, las golondrinas que cazan insectos en el aire, el zorzal de pecho anaranjado. Cada una cumple un papel: dispersan semillas, controlan insectos, polinizan. Y cada una depende del bosque que ves desabastecerse de agua.',
      actividad: 'Observa las aves volando. Fíjate en las diferencias: tamaño, color, cómo vuelan (las golondrinas planean y hacen giros, las tórtolas van más rectas). Intenta identificar al menos tres.',
      esquema: 'Dibuja dos aves distintas que hayas observado y anota una función que cada una cumple en el ecosistema (dispersar semillas, comer insectos, etc.).',
      pregunta: [
        'Si un ave come los frutos del boldo y luego dispersa sus semillas al volar, ¿qué pasa con el boldo si esa ave desaparece?',
        'Las aves dependen de los árboles para anidar y alimentarse. Si el bosque retrocede por la sequía, ¿qué pasa con las aves? ¿Y qué pasa después con las plantas que dependían de esas aves?'
      ]
    },
    {
      id: 'e5', estacion: '5', nombre: 'Las personas del bosque', rango: 'Consecuencia sobre la comunidad',
      texto: 'Junto al bosque vive gente que depende de él: del agua de sus vertientes, de la leña, de la recolección de boldo y miel. Cuando el bosque se seca, la vertiente baja y a veces hay que traer agua en camiones aljibe. El cambio climático llega a la mesa de las familias.',
      actividad: 'Observa la casa y su pozo. Imagina que eres parte de esta familia y que la vertiente da cada año menos agua.',
      esquema: 'Haz una tabla de dos columnas: "Cómo era antes" y "Cómo podría ser con más sequía", con al menos cuatro filas (agua, leña, cultivos, recolección).',
      pregunta: [
        '¿Por qué el cambio climático es también un problema social y no solo ambiental?',
        'Propón dos acciones concretas que la comunidad o el país podrían tomar para proteger este bosque y a quienes viven de él.'
      ]
    }
  ]
};
