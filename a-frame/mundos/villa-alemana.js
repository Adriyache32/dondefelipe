/* =============================================================================
   MUNDO: villa-alemana — la plaza
   Primer mundo urbano. Registra sus propias formas (farol, banca, palmera…)
   sin tocar mundo.js, y usa objetos con posición propia para alinearlos.
   ============================================================================= */
/* Red de seguridad: este archivo puede cargarse con el motor completo, con un
   motor antiguo, o con el maniquí de la portada. Que no reviente en ningún caso. */
window.MUNDO = window.MUNDO || {};
if (!MUNDO.forma)  MUNDO.forma  = function () {};
if (!MUNDO.animar) MUNDO.animar = function () {};
if (!MUNDO.grupos) MUNDO.grupos = {};


/* ------------------------------------------------------------------ FORMAS */

// Palma canaria: tronco grueso y corona de frondas que caen
MUNDO.forma('palmera', function (H, color, b) {
  var alt = H.azar(6.5, 10);
  H.pieza('poste', '#9a8b72', 'solido', b, [0, 0, 0], [0, 0, 0], [0.34, alt, 0.34], 0);
  // anillos del tronco
  for (var a = 0; a < 4; a++) {
    H.pieza('cilindro', '#8a7a60', 'solido', b, [0, alt * (0.25 + a * 0.18), 0],
      [0, 0, 0], [0.38, 0.12, 0.38], 0);
  }
  for (var i = 0; i < 11; i++) {
    H.pieza('hoja', color, 'lamina', b, [0, alt - 0.15, 0],
      [0, i * 33 + H.azar(-9, 9), H.azar(52, 88)],
      [H.azar(0.5, 0.75), H.azar(2.8, 4), 1], 0.08);
  }
  // racimos de dátiles
  if (Math.random() > 0.45) {
    H.pieza('esferaB', '#c98b24', 'solido', b, [H.azar(-0.5, 0.5), alt - 0.5, H.azar(-0.5, 0.5)],
      [0, 0, 0], [0.4, 0.28, 0.4], 0.03);
  }
}, 11.5);

// Árbol de sombra: copa ancha y baja, como los grandes de la plaza
MUNDO.forma('arbolSombra', function (H, color, b) {
  var alt = H.azar(3.4, 5);
  H.pieza('poste', '#5a4a35', 'solido', b, [0, 0, 0], [0, 0, 0], [alt * 0.09, alt, alt * 0.09], 0);
  for (var i = 0; i < 4; i++) {
    var r = H.azar(2.6, 4.2) * (i ? 0.75 : 1);
    H.pieza('esfera', color, 'follaje', b,
      [H.azar(-r * 0.6, r * 0.6), alt + H.azar(-0.3, r * 0.45), H.azar(-r * 0.6, r * 0.6)],
      [0, H.azar(0, 360), 0], [r, r * 0.72, r], 0.07);
  }
}, 8.4);

// Farol de plaza: base, fuste, luminaria y capuchón
MUNDO.forma('farol', function (H, color, b) {
  H.pieza('cilindro', color, 'solido', b, [0, 0.18, 0], [0, 0, 0], [0.26, 0.36, 0.26], 0);
  H.pieza('poste', color, 'solido', b, [0, 0.3, 0], [0, 0, 0], [0.085, 3.3, 0.085], 0);
  H.pieza('campana', '#e9e2c6', 'solido', b, [0, 3.95, 0], [0, 45, 0], [0.3, 0.62, 0.3], 0);
  H.pieza('conoB', color, 'solido', b, [0, 4.42, 0], [0, 45, 0], [0.4, 0.3, 0.4], 0);
}, 5.2);

// Banca de plaza: listones y patas de fierro
MUNDO.forma('banca', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 0.45, 0], [0, 0, 0], [1.9, 0.09, 0.55], 0);
  H.pieza('caja', color, 'solido', b, [0, 0.76, -0.24], [-14, 0, 0], [1.9, 0.5, 0.07], 0);
  H.pieza('caja', '#3c4a42', 'solido', b, [-0.8, 0.22, 0], [0, 0, 0], [0.1, 0.45, 0.5], 0);
  H.pieza('caja', '#3c4a42', 'solido', b, [0.8, 0.22, 0], [0, 0, 0], [0.1, 0.45, 0.5], 0);
}, 1.7);

// Basurero verde
MUNDO.forma('basurero', function (H, color, b) {
  H.pieza('poste', color, 'solido', b, [0, 0, 0], [0, 0, 0], [0.28, 0.85, 0.28], 0);
  H.pieza('cilindro', '#2c3a33', 'solido', b, [0, 0.92, 0], [0, 0, 0], [0.32, 0.1, 0.32], 0);
}, 1.6);

// Macetero de concreto con arbusto
MUNDO.forma('macetero', function (H, color, b) {
  H.pieza('campana', color, 'solido', b, [0, 0.3, 0], [0, 0, 0], [0.75, 0.6, 0.75], 0);
  var r = H.azar(0.6, 1);
  H.pieza('esfera', '#4e7a3e', 'follaje', b, [0, 0.6 + r * 0.6, 0], [0, H.azar(0, 360), 0],
    [r, r * 0.85, r], 0.05);
}, 2.6);

// Quiosco
MUNDO.forma('quiosco', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 1.4, 0], [0, 0, 0], [5, 2.8, 3.4], 0);
  H.pieza('caja', '#d9d3c2', 'solido', b, [0, 2.92, 0], [0, 0, 0], [5.4, 0.24, 3.8], 0);
  H.pieza('caja', '#2f3b34', 'solido', b, [0, 1.3, 1.72], [0, 0, 0], [3, 2, 0.1], 0);
}, 4);

// Edificio del fondo
MUNDO.forma('edificio', function (H, color, b) {
  var alto = H.azar(14, 18), ancho = H.azar(16, 24);
  H.pieza('caja', color, 'solido', b, [0, alto / 2, 0], [0, 0, 0], [ancho, alto, 12], 0);
  // franjas de ventanas
  for (var i = 1; i < 6; i++) {
    H.pieza('caja', '#4d6472', 'solido', b, [0, alto * i / 6, 6.05], [0, 0, 0],
      [ancho * 0.88, alto * 0.055, 0.1], 0);
  }
}, 19);

// Reja perimetral
MUNDO.forma('reja', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 1.5, 0], [0, 0, 0], [6, 0.08, 0.08], 0);
  H.pieza('caja', color, 'solido', b, [0, 0.35, 0], [0, 0, 0], [6, 0.08, 0.08], 0);
  for (var i = 0; i <= 12; i++) {
    H.pieza('caja', color, 'solido', b, [-3 + i * 0.5, 0.85, 0], [0, 0, 0], [0.06, 1.7, 0.06], 0);
  }
}, 2.4);


/* ------------------------------------------------- FORMAS: estación y tren */

// Vía férrea: un tramo de 6 m, se repite a lo largo
MUNDO.forma('rieles', function (H, color, b) {
  H.pieza('caja', '#5d5348', 'solido', b, [0, 0.12, 0], [0, 0, 0], [3.6, 0.24, 6], 0);
  for (var i = 0; i < 4; i++) {
    H.pieza('caja', '#4a3b2c', 'solido', b, [0, 0.28, -2.25 + i * 1.5], [0, 0, 0], [2.4, 0.14, 0.32], 0);
  }
  H.pieza('caja', color, 'solido', b, [-0.72, 0.4, 0], [0, 0, 0], [0.12, 0.16, 6], 0);
  H.pieza('caja', color, 'solido', b, [0.72, 0.4, 0], [0, 0, 0], [0.12, 0.16, 6], 0);
}, 1.5);

// Andén con su línea de seguridad
MUNDO.forma('anden', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 0.45, 0], [0, 0, 0], [7, 0.9, 34], 0);
  H.pieza('caja', '#e0bd45', 'solido', b, [3.2, 0.92, 0], [0, 0, 0], [0.4, 0.04, 34], 0);
  H.pieza('caja', '#9aa0a6', 'solido', b, [3.5, 0.45, 0], [0, 0, 0], [0.12, 0.9, 34], 0);
}, 2);

// Marquesina del andén
MUNDO.forma('marquesina', function (H, color, b) {
  for (var i = 0; i < 7; i++) {
    var z = -13.5 + i * 4.5;
    H.pieza('poste', '#48555f', 'solido', b, [-2.2, 0.9, z], [0, 0, 0], [0.15, 3.5, 0.15], 0);
    H.pieza('poste', '#48555f', 'solido', b, [2.2, 0.9, z], [0, 0, 0], [0.15, 3.5, 0.15], 0);
  }
  H.pieza('caja', color, 'solido', b, [0, 4.5, 0], [0, 0, 0], [7.4, 0.26, 30], 0);
  H.pieza('caja', '#39454e', 'solido', b, [0, 4.18, 0], [0, 0, 0], [6.6, 0.16, 29], 0);
}, 6);

// Letrero de estación
MUNDO.forma('letrero', function (H, color, b) {
  H.pieza('poste', '#48555f', 'solido', b, [0, 0, 0], [0, 0, 0], [0.11, 2.7, 0.11], 0);
  H.pieza('caja', color, 'solido', b, [0, 3, 0], [0, 0, 0], [3.6, 0.85, 0.14], 0);
  H.pieza('caja', '#f4f6f8', 'solido', b, [0, 3, 0.09], [0, 0, 0], [3.2, 0.55, 0.05], 0);
}, 4.2);

// Un carro del tren
MUNDO.forma('vagon', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 2.15, 0], [0, 0, 0], [2.9, 2.5, 13.6], 0);
  H.pieza('caja', '#3a4148', 'solido', b, [0, 0.75, 0], [0, 0, 0], [2.7, 0.8, 13], 0);
  [-1.48, 1.48].forEach(function (x) {
    H.pieza('caja', '#1d2b38', 'solido', b, [x, 2.55, 0], [0, 0, 0], [0.07, 1, 12.4], 0);
    H.pieza('caja', '#2f6bab', 'solido', b, [x, 1.35, 0], [0, 0, 0], [0.08, 0.34, 13.2], 0);
  });
  H.pieza('caja', '#1d2b38', 'solido', b, [0, 2.55, 6.85], [0, 0, 0], [2.3, 1.1, 0.08], 0);
  H.pieza('caja', '#1d2b38', 'solido', b, [0, 2.55, -6.85], [0, 0, 0], [2.3, 1.1, 0.08], 0);
}, 4);

/* ------------------------------------------- FORMAS: más elementos de plaza */

MUNDO.forma('pileta', function (H, color, b) {
  H.pieza('cilindro', color, 'solido', b, [0, 0.3, 0], [0, 0, 0], [3.2, 0.6, 3.2], 0);
  H.pieza('cilindro', '#4d7f93', 'solido', b, [0, 0.58, 0], [0, 0, 0], [2.9, 0.06, 2.9], 0);
  H.pieza('cilindro', color, 'solido', b, [0, 0.9, 0], [0, 0, 0], [0.45, 0.7, 0.45], 0);
  H.pieza('esferaB', '#5f92a6', 'solido', b, [0, 1.35, 0], [0, 0, 0], [0.6, 0.4, 0.6], 0);
}, 2.6);

MUNDO.forma('paradero', function (H, color, b) {
  H.pieza('poste', '#3c4a42', 'solido', b, [-1.6, 0, 0], [0, 0, 0], [0.09, 2.6, 0.09], 0);
  H.pieza('poste', '#3c4a42', 'solido', b, [1.6, 0, 0], [0, 0, 0], [0.09, 2.6, 0.09], 0);
  H.pieza('caja', color, 'solido', b, [0, 2.7, 0], [0, 0, 0], [3.8, 0.16, 1.6], 0);
  H.pieza('caja', color, 'solido', b, [0, 1.3, -0.75], [0, 0, 0], [3.8, 2.6, 0.08], 0);
  H.pieza('caja', '#6d4032', 'solido', b, [0, 0.5, -0.35], [0, 0, 0], [3.2, 0.08, 0.45], 0);
}, 3.6);

MUNDO.forma('auto', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [0, 0.62, 0], [0, 0, 0], [1.8, 0.65, 4.2], 0);
  H.pieza('caja', color, 'solido', b, [0, 1.15, -0.2], [0, 0, 0], [1.6, 0.55, 2.1], 0);
  H.pieza('caja', '#2b3138', 'solido', b, [0, 1.18, -0.2], [0, 0, 0], [1.64, 0.4, 2], 0);
  [[-0.85, 1.4], [0.85, 1.4], [-0.85, -1.4], [0.85, -1.4]].forEach(function (r) {
    H.pieza('cilindro', '#1a1c1f', 'solido', b, [r[0], 0.32, r[1]], [0, 0, 90], [0.32, 0.2, 0.32], 0);
  });
}, 2);

MUNDO.forma('semaforo', function (H, color, b) {
  H.pieza('poste', color, 'solido', b, [0, 0, 0], [0, 0, 0], [0.12, 3.4, 0.12], 0);
  H.pieza('caja', color, 'solido', b, [0, 3.7, 0], [0, 0, 0], [0.36, 0.95, 0.3], 0);
  H.pieza('circulo', '#c4392f', 'lamina', b, [0, 4.02, 0.17], [0, 0, 0], [0.11, 0.11, 0.11], 0);
  H.pieza('circulo', '#d8b13c', 'lamina', b, [0, 3.72, 0.17], [0, 0, 0], [0.11, 0.11, 0.11], 0);
  H.pieza('circulo', '#3f9b57', 'lamina', b, [0, 3.42, 0.17], [0, 0, 0], [0.11, 0.11, 0.11], 0);
}, 4.6);

MUNDO.forma('resbalin', function (H, color, b) {
  H.pieza('poste', '#c4553c', 'solido', b, [-0.7, 0, -1.2], [0, 0, 0], [0.09, 2.2, 0.09], 0);
  H.pieza('poste', '#c4553c', 'solido', b, [0.7, 0, -1.2], [0, 0, 0], [0.09, 2.2, 0.09], 0);
  H.pieza('caja', '#c4553c', 'solido', b, [0, 2.2, -1.2], [0, 0, 0], [1.5, 0.1, 1.5], 0);
  H.pieza('caja', color, 'solido', b, [0, 1.2, 1], [34, 0, 0], [1.1, 0.08, 3.6], 0);
  H.pieza('caja', color, 'solido', b, [-0.55, 1.35, 1], [34, 0, 0], [0.08, 0.35, 3.6], 0);
  H.pieza('caja', color, 'solido', b, [0.55, 1.35, 1], [34, 0, 0], [0.08, 0.35, 3.6], 0);
}, 3.4);


/* ------------------------------------------- FORMAS: estación real y tren */

// Poste de catenaria con ménsula sobre las dos vías
MUNDO.forma('catenaria', function (H, color, b) {
  H.pieza('poste', color, 'metal', b, [0, 0, 0], [0, 0, 0], [0.18, 7.2, 0.18], 0);
  H.pieza('caja', color, 'metal', b, [-3.6, 6.9, 0], [0, 0, 0], [7.6, 0.16, 0.16], 0);
  H.pieza('caja', color, 'metal', b, [-1.9, 6.3, 0], [0, 0, 24], [4.2, 0.09, 0.09], 0);
  // péndolas hacia el hilo de contacto
  [-1.6, -5.2].forEach(function (x) {
    H.pieza('caja', color, 'metal', b, [x, 6.35, 0], [0, 0, 0], [0.05, 1.1, 0.05], 0);
    H.pieza('caja', '#d8d2c4', 'solido', b, [x, 6.88, 0], [0, 0, 0], [0.34, 0.2, 0.34], 0);
  });
}, 8);

// Tramo de cable: se repite entre poste y poste
MUNDO.forma('cable', function (H, color, b) {
  H.pieza('caja', color, 'metal', b, [0, 5.75, 0], [0, 0, 0], [0.05, 0.05, 12], 0);  // hilo de contacto
  H.pieza('caja', color, 'metal', b, [0, 6.85, 0], [0, 0, 0], [0.05, 0.05, 12], 0);  // sustentador
}, 7);

// Acceso a la estación: bloque de hormigón y marquesina de lamas inclinada
MUNDO.forma('acceso', function (H, color, b) {
  H.pieza('caja', color, 'solido', b, [-4.6, 2.2, 0], [0, 0, 0], [4.4, 4.4, 7], 0);
  H.pieza('caja', '#3d4a52', 'vidrio', b, [-4.6, 3.1, 3.55], [0, 0, 0], [3.2, 1.1, 0.1], 0);
  // pórtico con techo inclinado
  [-3.2, 3.2].forEach(function (z) {
    H.pieza('poste', '#9a9488', 'solido', b, [-1.4, 0, z], [0, 0, 0], [0.22, 4.6, 0.22], 0);
    H.pieza('poste', '#9a9488', 'solido', b, [2.6, 0, z], [0, 0, 0], [0.22, 3.6, 0.22], 0);
  });
  H.pieza('caja', '#b9b2a4', 'solido', b, [0.6, 4.5, 0], [0, 0, -13], [5.4, 0.16, 7.4], 0);
  // lamas verticales del cierre
  for (var i = 0; i < 16; i++) {
    H.pieza('caja', '#c9c3b6', 'solido', b, [2.6, 1.9, -3.4 + i * 0.45], [0, 0, 0], [0.09, 3.6, 0.09], 0);
  }
  // letrero LED sobre el acceso
  H.pieza('caja', '#20262b', 'solido', b, [0.4, 3.5, 3.5], [0, 0, 0], [2.6, 0.55, 0.12], 0);
  H.pieza('caja', '#d94a3d', 'brillo', b, [0.4, 3.5, 3.58], [0, 0, 0], [2.3, 0.3, 0.05], 0);
}, 6.4);

// Torniquete
MUNDO.forma('torniquete', function (H, color, b) {
  H.pieza('caja', color, 'metal', b, [0, 0.5, 0], [0, 0, 0], [0.34, 1, 0.9], 0);
  H.pieza('caja', '#2f6bab', 'solido', b, [0, 1.02, 0], [0, 0, 0], [0.36, 0.06, 0.92], 0);
  H.pieza('cilindro', '#b8bcc0', 'metal', b, [0.35, 0.72, 0], [0, 0, 90], [0.04, 0.7, 0.04], 0);
}, 1.8);

// Asiento de tren: cojín azul, respaldo claro
MUNDO.forma('asiento', function (H, color, b) {
  H.pieza('caja', '#eef1f4', 'solido', b, [0, 0.36, 0], [0, 0, 0], [0.48, 0.08, 0.46], 0);
  H.pieza('caja', color, 'solido', b, [0, 0.42, 0.02], [0, 0, 0], [0.42, 0.07, 0.42], 0);
  H.pieza('caja', '#eef1f4', 'solido', b, [0, 0.68, -0.22], [-6, 0, 0], [0.48, 0.56, 0.08], 0);
  H.pieza('caja', color, 'solido', b, [0, 0.68, -0.17], [-6, 0, 0], [0.4, 0.5, 0.04], 0);
  H.pieza('caja', '#dfe3e7', 'solido', b, [0, 0.18, 0], [0, 0, 0], [0.14, 0.36, 0.3], 0);
  H.pieza('cilindro', '#b9bfc4', 'metal', b, [0.24, 0.78, -0.02], [90, 0, 0], [0.022, 0.36, 0.022], 0);
}, 1.2);

/* Carro con puertas automáticas y cabina de control.
   Las hojas de las puertas van a subgrupos con nombre para poder moverlas;
   ese nombre lo entrega el objeto en su campo "puertas". */
MUNDO.forma('vagonAbierto', function (H, color, b, ob) {
  var LARGO = 15.6, ALTO = 1.05, INT = '#e9edf0', AZUL = '#2f5fa8';
  var pref = (ob && ob.id) ? ob.id : 'v';

  H.pieza('caja', '#3a4148', 'solido', b, [0, 0.62, 0], [0, 0, 0], [2.8, 0.9, LARGO - 0.6], 0);
  H.pieza('caja', '#c9ced3', 'solido', b, [0, ALTO - 0.04, 0], [0, 0, 0], [2.66, 0.08, LARGO - 0.4], 0);

  var tramos = [[-6.6, -4.4], [-2.6, 2.6], [4.4, 6.6]];
  [-1.42, 1.42].forEach(function (x, li) {
    tramos.forEach(function (t) {
      var largo = t[1] - t[0], cz = (t[0] + t[1]) / 2;
      H.pieza('caja', color, 'solido', b, [x, ALTO + 0.55, cz], [0, 0, 0], [0.1, 1.1, largo], 0);
      H.pieza('caja', '#1d2b38', 'vidrio', b, [x, ALTO + 1.45, cz], [0, 0, 0], [0.09, 0.7, largo - 0.3], 0);
      H.pieza('caja', color, 'solido', b, [x, ALTO + 2, cz], [0, 0, 0], [0.1, 0.4, largo], 0);
      H.pieza('caja', AZUL, 'solido', b, [x, ALTO + 0.28, cz], [0, 0, 0], [0.11, 0.26, largo], 0);
    });
    // marcos y hojas de puerta (una puerta por costado, al centro)
    var lado = li === 0 ? 'I' : 'D';
    H.pieza('caja', '#9aa3ab', 'metal', b, [x, ALTO + 1.15, -0.9], [0, 0, 0], [0.12, 2.3, 0.09], 0);
    H.pieza('caja', '#9aa3ab', 'metal', b, [x, ALTO + 1.15, 0.9], [0, 0, 0], [0.12, 2.3, 0.09], 0);
    // dos hojas correderas, cada una en su subgrupo
    ['A', 'B'].forEach(function (h, hi) {
      var g = pref + '_p' + lado + h;
      _hoja(H, b, [x, ALTO + 1.15, hi ? 0.45 : -0.45], g, color);
    });
  });

  [-LARGO / 2, LARGO / 2].forEach(function (z) {
    H.pieza('caja', color, 'solido', b, [0, ALTO + 1.2, z], [0, 0, 0], [2.9, 2.4, 0.12], 0);
    H.pieza('caja', '#1d2b38', 'vidrio', b, [0, ALTO + 1.6, z], [0, 0, 0], [1.5, 0.9, 0.14], 0);
  });

  H.pieza('caja', INT, 'solido', b, [0, ALTO + 2.42, 0], [0, 0, 0], [2.9, 0.18, LARGO], 0);
  for (var i = 0; i < 6; i++)
    H.pieza('caja', '#fdfbf2', 'brillo', b, [0, ALTO + 2.3, -6.2 + i * 2.5], [0, 0, 0], [0.5, 0.05, 1.9], 0);

  [-0.62, 0.62].forEach(function (x) {
    H.pieza('caja', '#b9bfc4', 'metal', b, [x, ALTO + 2.02, 0], [0, 0, 0], [0.05, 0.05, LARGO - 1.4], 0);
  });
  [-0.9, 0.9].forEach(function (x) {
    H.pieza('cilindro', '#b9bfc4', 'metal', b, [x, ALTO + 1.15, 0], [0, 0, 0], [0.035, 2.3, 0.035], 0);
  });

  // asientos azules
  var filas = [-6.2, -5.2, 5.2, 6.2, -1.9, 1.9];
  filas.forEach(function (z) {
    [-1.02, -0.55, 0.55, 1.02].forEach(function (x) {
      H.pieza('caja', '#eef1f4', 'solido', b, [x, ALTO + 0.36, z], [0, 0, 0], [0.44, 0.08, 0.44], 0);
      H.pieza('caja', AZUL, 'solido', b, [x, ALTO + 0.42, z + 0.02], [0, 0, 0], [0.38, 0.07, 0.4], 0);
      H.pieza('caja', '#eef1f4', 'solido', b, [x, ALTO + 0.68, z - 0.21], [-6, 0, 0], [0.44, 0.54, 0.08], 0);
      H.pieza('caja', AZUL, 'solido', b, [x, ALTO + 0.68, z - 0.16], [-6, 0, 0], [0.36, 0.48, 0.04], 0);
      H.pieza('caja', '#dfe3e7', 'solido', b, [x, ALTO + 0.18, z], [0, 0, 0], [0.12, 0.36, 0.3], 0);
    });
  });
}, 4.6);

// Una hoja de puerta corredera: panel + ventana, en un subgrupo posicionable
function _hoja(H, b, off, grupo, color) {
  H.pieza('caja', color, 'solido', b, off, [0, 0, 0], [0.12, 2.2, 0.86], 0, grupo);
  H.pieza('caja', '#1d2b38', 'vidrio', b, [off[0], off[1] + 0.35, off[2]], [0, 0, 0], [0.1, 1, 0.72], 0, grupo);
}

// Cabina de control del conductor (sala de control del tren)
MUNDO.forma('cabina', function (H, color, b) {
  var A = 2.7, L = 2.4, ALTO = 1.05;
  // mampara que separa cabina de pasajeros
  H.pieza('caja', color, 'solido', b, [0, ALTO + 1.2, L / 2], [0, 0, 0], [A, 2.4, 0.12], 0);
  H.pieza('caja', '#1d2b38', 'vidrio', b, [0.6, ALTO + 1.5, L / 2], [0, 0, 0], [1.2, 1, 0.14], 0);
  // parabrisas frontal
  H.pieza('caja', '#243541', 'vidrio', b, [0, ALTO + 1.5, -L / 2], [0, 0, 0], [A - 0.2, 1.5, 0.12], 0);
  // pupitre de mando
  H.pieza('caja', '#2f363d', 'solido', b, [0, ALTO + 0.55, -L / 2 + 0.5], [0, 0, 0], [A - 0.4, 0.5, 0.7], 0);
  H.pieza('caja', '#20262b', 'solido', b, [0, ALTO + 0.82, -L / 2 + 0.5], [-18, 0, 0], [A - 0.5, 0.06, 0.5], 0);
  // palanca de tracción y pantallas
  H.pieza('poste', '#c4c8cc', 'metal', b, [-0.6, ALTO + 0.85, -L / 2 + 0.5], [0, 0, 0], [0.05, 0.32, 0.05], 0);
  H.pieza('esferaB', '#c4392f', 'solido', b, [-0.6, ALTO + 1.02, -L / 2 + 0.5], [0, 0, 0], [0.08, 0.08, 0.08], 0);
  H.pieza('caja', '#20262b', 'solido', b, [0.5, ALTO + 1.05, -L / 2 + 0.3], [-14, 0, 0], [0.5, 0.34, 0.05], 0);
  H.pieza('caja', '#2f6bab', 'brillo', b, [0.5, ALTO + 1.05, -L / 2 + 0.27], [-14, 0, 0], [0.42, 0.26, 0.02], 0);
  // asiento del conductor
  H.pieza('cilindro', '#2b3138', 'solido', b, [0, ALTO + 0.24, 0.2], [0, 0, 0], [0.3, 0.48, 0.3], 0);
  H.pieza('caja', '#39424a', 'solido', b, [0, ALTO + 0.52, 0.2], [0, 0, 0], [0.5, 0.09, 0.5], 0);
  H.pieza('caja', '#39424a', 'solido', b, [0, ALTO + 0.82, 0.44], [-8, 0, 0], [0.5, 0.6, 0.09], 0);
}, 4);




// Sala de control del metro: se puede entrar, con puerta al costado del andén
MUNDO.forma('salaControl', function (H, color, b) {
  var A = 7, L = 11, H2 = 3.4;   // ancho, largo, alto interior

  H.pieza('caja', '#b0aa9e', 'solido', b, [0, 0.08, 0], [0, 0, 0], [A + 0.6, 0.16, L + 0.6], 0);
  H.pieza('caja', color, 'solido', b, [0, H2 + 0.15, 0], [0, 0, 0], [A + 0.7, 0.3, L + 0.7], 0);

  // muro del fondo y laterales, con banda de ventanas
  H.pieza('caja', color, 'solido', b, [-A / 2, H2 / 2, 0], [0, 0, 0], [0.22, H2, L], 0);
  [-L / 2, L / 2].forEach(function (z) {
    H.pieza('caja', color, 'solido', b, [0, 0.55, z], [0, 0, 0], [A, 1.1, 0.22], 0);
    H.pieza('caja', '#3d4a52', 'vidrio', b, [0, 2, z], [0, 0, 0], [A, 1.8, 0.16], 0);
    H.pieza('caja', color, 'solido', b, [0, 3.15, z], [0, 0, 0], [A, 0.5, 0.22], 0);
  });
  // muro que mira al andén: ventanal y vano de puerta
  [[-3.2, 1.6], [1.4, 4.2]].forEach(function (t) {
    var largo = t[1] - t[0], cz = (t[0] + t[1]) / 2;
    H.pieza('caja', color, 'solido', b, [A / 2, 0.55, cz], [0, 0, 0], [0.22, 1.1, largo], 0);
    H.pieza('caja', '#3d4a52', 'vidrio', b, [A / 2, 2, cz], [0, 0, 0], [0.16, 1.8, largo], 0);
    H.pieza('caja', color, 'solido', b, [A / 2, 3.15, cz], [0, 0, 0], [0.22, 0.5, largo], 0);
  });
  H.pieza('caja', '#8e9aa2', 'metal', b, [A / 2, 2.3, -3.35], [0, 0, 0], [0.26, 0.12, 0.3], 0);

  // consola en U
  H.pieza('caja', '#4a5560', 'solido', b, [-2.4, 0.4, 0], [0, 0, 0], [1.4, 0.8, 6], 0);
  H.pieza('caja', '#2f3840', 'solido', b, [-2.4, 0.83, 0], [0, 0, 0], [1.5, 0.08, 6.1], 0);
  H.pieza('caja', '#4a5560', 'solido', b, [-0.6, 0.4, -2.6], [0, 0, 0], [2.4, 0.8, 1.2], 0);
  H.pieza('caja', '#2f3840', 'solido', b, [-0.6, 0.83, -2.6], [0, 0, 0], [2.5, 0.08, 1.3], 0);

  // pantallas de la consola
  [-2, -0.6, 0.8, 2.2].forEach(function (z) {
    H.pieza('caja', '#20262b', 'solido', b, [-2.2, 1.2, z], [0, 12, 0], [0.1, 0.6, 0.95], 0);
    H.pieza('caja', '#2f6bab', 'brillo', b, [-2.13, 1.2, z], [0, 12, 0], [0.03, 0.5, 0.85], 0);
  });
  // muro de monitores del fondo
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 2; j++) {
      H.pieza('caja', '#20262b', 'solido', b, [-A / 2 + 0.3, 2.6 - j * 0.85, -2.2 + i * 2.2], [0, 90, 0], [1.9, 0.75, 0.1], 0);
      H.pieza('caja', j ? '#3f8f6a' : '#2f6bab', 'brillo', b, [-A / 2 + 0.37, 2.6 - j * 0.85, -2.2 + i * 2.2], [0, 90, 0], [1.7, 0.62, 0.03], 0);
    }
  }
  // sillas
  [-1.4, 0.4].forEach(function (z) {
    H.pieza('cilindro', '#2b3138', 'solido', b, [-1.1, 0.24, z], [0, 0, 0], [0.32, 0.48, 0.32], 0);
    H.pieza('caja', '#39424a', 'solido', b, [-1.1, 0.52, z], [0, 0, 0], [0.5, 0.09, 0.5], 0);
    H.pieza('caja', '#39424a', 'solido', b, [-0.85, 0.82, z], [0, 0, 8], [0.09, 0.6, 0.5], 0);
  });
  // luminarias
  for (var k = 0; k < 3; k++) {
    H.pieza('caja', '#fdfbf2', 'brillo', b, [-1, H2 - 0.06, -3.4 + k * 3.4], [0, 0, 0], [3.4, 0.05, 0.5], 0);
  }
}, 5);

/* ----------------------------------------------------------------------------
   NOMBRE DEL ANFITRIÓN
   Se usa en el rótulo flotante y en el panel de diálogo. Cambiarlo acá lo
   cambia en todas partes; dejarlo vacío deja al personaje sin nombre.
   ---------------------------------------------------------------------------- */
var ANFITRION = 'Esteban Devia';


/* =========================================================================
   FORMAS DEL COLEGIO SAN AGUSTÍN
   ========================================================================= */

// Fachada de recepción: mesón de madera, escudo SA y puerta de acceso
MUNDO.forma('recepcion', function (H, color, b) {
  var A = 14, ALTO = 3.6;
  // muro de fondo con vano de puerta a la izquierda
  H.pieza('caja', color, 'solido', b, [3, ALTO / 2, -3.5], [0, 0, 0], [A - 4.2, ALTO, 0.2], 0);
  H.pieza('caja', color, 'solido', b, [-6, ALTO / 2, -3.5], [0, 0, 0], [1.8, ALTO, 0.2], 0);
  H.pieza('caja', color, 'solido', b, [-4, ALTO - 0.5, -3.5], [0, 0, 0], [2.4, 1, 0.2], 0);
  // techo con focos empotrados
  H.pieza('caja', '#eceae4', 'solido', b, [0, ALTO + 0.15, 0], [0, 0, 0], [A, 0.3, 8], 0);
  for (var i = 0; i < 3; i++) for (var j = 0; j < 2; j++) {
    H.pieza('circulo', '#fdfbf2', 'brillo', b, [-3 + i * 3, ALTO - 0.02, -1.5 + j * 3], [90, 0, 0], [0.28, 0.28, 0.28], 0);
  }
  // mesón: cuerpo blanco y cubierta de madera
  H.pieza('caja', '#e9e5dc', 'solido', b, [1, 0.6, 1.5], [0, 0, 0], [9, 1.2, 0.9], 0);
  H.pieza('caja', '#8a5a34', 'solido', b, [1, 1.24, 1.5], [0, 0, 0], [9.4, 0.14, 1.15], 0);
  // escudo circular SA en el frente del mesón
  H.pieza('cilindro', '#7a3f24', 'solido', b, [1, 0.62, 1.98], [90, 0, 0], [0.66, 0.12, 0.66], 0);
  H.pieza('cilindro', '#e8d8b0', 'solido', b, [1, 0.62, 2.02], [90, 0, 0], [0.5, 0.04, 0.5], 0);
  H.pieza('caja', '#e0c48a', 'brillo', b, [1, 0.62, 2.05], [0, 0, 0], [0.34, 0.34, 0.02], 0);
  // cuadro de San Agustín en el muro
  H.pieza('caja', '#5a4632', 'solido', b, [-1.5, 2.5, -3.38], [0, 0, 0], [1.4, 1.7, 0.08], 0);
  H.pieza('caja', '#4a6a8a', 'solido', b, [-1.5, 2.5, -3.34], [0, 0, 0], [1.1, 1.4, 0.04], 0);
  // puerta doble de vaivén a la izquierda del mesón
  H.pieza('caja', '#f2f0ea', 'solido', b, [-6, 1.4, 0.5], [0, 0, 0], [0.1, 2.8, 1.7], 0);
  H.pieza('caja', '#dfe6ea', 'vidrio', b, [-6, 1.7, 0.5], [0, 0, 0], [0.06, 1.6, 1.5], 0);
}, 4.4);

// Bloque de aulas de dos pisos, con pasillo vidriado al frente
MUNDO.forma('pabellon', function (H, color, b) {
  var A = 22, F = 9, PISO = 3.2;
  [0, 1].forEach(function (n) {
    var y = n * PISO;
    H.pieza('caja', color, 'solido', b, [0, y + PISO / 2, -F / 2], [0, 0, 0], [A, PISO, 0.25], 0);
    // ventanas del pasillo
    for (var i = 0; i < 7; i++) {
      H.pieza('caja', '#cdd8dd', 'vidrio', b, [-9 + i * 3, y + 1.9, F / 2 - 0.1], [0, 0, 0], [2.4, 2, 0.12], 0);
      H.pieza('caja', '#f0eee8', 'solido', b, [-9 + i * 3, y + 0.55, F / 2 - 0.1], [0, 0, 0], [2.6, 1.1, 0.14], 0);
    }
    // piso/losa
    H.pieza('caja', '#d9d4c8', 'solido', b, [0, y, 0], [0, 0, 0], [A, 0.3, F], 0);
  });
  // techo
  H.pieza('caja', '#c9c3b6', 'solido', b, [0, 2 * PISO + 0.2, 0], [0, 0, 0], [A + 0.6, 0.35, F + 0.6], 0);
  // pilares del pasillo
  for (var i = 0; i < 8; i++) {
    H.pieza('poste', '#e6e2d8', 'solido', b, [-9.5 + i * 2.7, PISO, F / 2 - 0.3], [0, 0, 0], [0.2, PISO, 0.2], 0);
  }
  // baranda del segundo piso
  H.pieza('caja', '#c4cace', 'metal', b, [0, PISO + 1, F / 2 - 0.3], [0, 0, 0], [A, 0.09, 0.09], 0);
}, 7);

// Caja de escalera: peldaños que se suben de verdad (la rampa la pone el objeto)
MUNDO.forma('escalera', function (H, color, b) {
  var pasos = 11, h = 0.2, d = 0.32, ancho = 2.6;
  for (var i = 0; i < pasos; i++) {
    H.pieza('caja', '#d8c23a', 'solido', b, [0, i * h + h / 2, -i * d], [0, 0, 0], [ancho, h, d + 0.02], 0);
    H.pieza('caja', '#3a3a3a', 'solido', b, [0, i * h, -i * d - d / 2], [0, 0, 0], [ancho, 0.06, 0.05], 0);
  }
  // pasamanos y muros laterales
  [-ancho / 2, ancho / 2].forEach(function (x) {
    H.pieza('caja', '#f0eee8', 'solido', b, [x, 1.1, -pasos * d / 2], [-32, 0, 0], [0.12, 2.4, pasos * d * 1.25], 0);
    H.pieza('caja', '#c9ccce', 'metal', b, [x * 0.82, 1.55, -pasos * d / 2], [-32, 0, 0], [0.06, 0.06, pasos * d * 1.25], 0);
  });
}, 3);

// Multicancha: piso azul con líneas, muro blanco, reja verde y arcos
MUNDO.forma('cancha', function (H, color, b) {
  var A = 20, L = 32;
  H.pieza('caja', '#2f74b5', 'solido', b, [0, 0.05, 0], [0, 0, 0], [A, 0.1, L], 0);
  // líneas amarillas y blancas
  H.pieza('caja', '#e8d24a', 'brillo', b, [0, 0.11, 0], [0, 0, 0], [0.16, 0.02, L - 2], 0);
  H.pieza('caja', '#f2f2f2', 'brillo', b, [0, 0.11, 0], [0, 0, 0], [A - 2, 0.02, 0.16], 0);
  H.pieza('circulo', '#f2f2f2', 'lamina', b, [0, 0.12, 0], [-90, 0, 0], [2.2, 2.2, 2.2], 0);
  // muro blanco perimetral y reja verde encima
  [-1, 1].forEach(function (sx) {
    H.pieza('caja', '#eef0f0', 'solido', b, [sx * A / 2, 0.7, 0], [0, 0, 0], [0.3, 1.4, L], 0);
    for (var i = 0; i < 10; i++)
      H.pieza('caja', '#3f7a4a', 'metal', b, [sx * A / 2, 2.6, -L / 2 + 1.6 + i * 3.4], [0, 0, 0], [0.08, 3.6, 0.08], 0);
    H.pieza('caja', '#3f7a4a', 'metal', b, [sx * A / 2, 4.3, 0], [0, 0, 0], [0.08, 0.08, L], 0);
  });
  [-1, 1].forEach(function (sz) {
    H.pieza('caja', '#eef0f0', 'solido', b, [0, 0.7, sz * L / 2], [0, 0, 0], [A, 1.4, 0.3], 0);
    for (var i = 0; i < 6; i++)
      H.pieza('caja', '#3f7a4a', 'metal', b, [-A / 2 + 1.6 + i * 3.4, 2.6, sz * L / 2], [0, 0, 0], [0.08, 3.6, 0.08], 0);
  });
  // arcos de baby fútbol
  [-1, 1].forEach(function (sz) {
    H.pieza('caja', '#f2f2f2', 'metal', b, [-1.6, 1.1, sz * (L / 2 - 1)], [0, 0, 0], [0.1, 2, 0.1], 0);
    H.pieza('caja', '#f2f2f2', 'metal', b, [1.6, 1.1, sz * (L / 2 - 1)], [0, 0, 0], [0.1, 2, 0.1], 0);
    H.pieza('caja', '#f2f2f2', 'metal', b, [0, 2.05, sz * (L / 2 - 1)], [0, 0, 0], [3.3, 0.1, 0.1], 0);
  });
  // tableros de básquetbol
  [-1, 1].forEach(function (sz) {
    H.pieza('caja', '#f6f6f6', 'solido', b, [0, 4.4, sz * (L / 2 - 0.6)], [0, 0, 0], [1.8, 1.2, 0.1], 0);
    H.pieza('toro', '#c4392f', 'metal', b, [0, 3.9, sz * (L / 2 - 1.1)], [-90, 0, 0], [0.34, 0.34, 0.34], 0);
  });
  // torres de iluminación
  [[-A / 2 - 1, -L / 2 - 1], [A / 2 + 1, L / 2 + 1]].forEach(function (t) {
    H.pieza('poste', '#c8ccce', 'metal', b, [t[0], 3, t[1]], [0, 0, 0], [0.16, 6, 0.16], 0);
    H.pieza('caja', '#fdfbf0', 'brillo', b, [t[0], 6, t[1]], [0, 0, 0], [0.9, 0.5, 0.3], 0);
  });
}, 5);

// Pasillo subterráneo: piso gris, zócalo de ladrillo, cielo con luces
MUNDO.forma('subterraneo', function (H, color, b) {
  var A = 5, L = 24, ALTO = 3;
  H.pieza('caja', '#cfd2d4', 'solido', b, [0, 0.05, 0], [0, 0, 0], [A, 0.1, L], 0);
  [-1, 1].forEach(function (sx) {
    H.pieza('caja', '#f0efe9', 'solido', b, [sx * A / 2, 2.2, 0], [0, 0, 0], [0.2, 1.6, L], 0);   // muro claro arriba
    H.pieza('caja', '#a86a4a', 'solido', b, [sx * A / 2, 0.75, 0], [0, 0, 0], [0.22, 1.5, L], 0); // zócalo ladrillo
  });
  H.pieza('caja', '#eceae4', 'solido', b, [0, ALTO, 0], [0, 0, 0], [A, 0.2, L], 0);
  for (var i = 0; i < 6; i++)
    H.pieza('caja', '#fdfbf2', 'brillo', b, [0, ALTO - 0.12, -L / 2 + 2 + i * 4], [0, 0, 0], [1.2, 0.06, 0.5], 0);
  // felpudos oscuros del piso
  for (var i = 0; i < 3; i++)
    H.pieza('caja', '#33383c', 'solido', b, [0, 0.12, -6 + i * 6], [0, 45, 0], [1.4, 0.02, 1.4], 0);
}, 3.4);

// Portón de acceso al colegio, con nombre
MUNDO.forma('porton', function (H, color, b) {
  [-3, 3].forEach(function (x) {
    H.pieza('caja', color, 'solido', b, [x, 2, 0], [0, 0, 0], [0.6, 4, 0.6], 0);
  });
  H.pieza('caja', color, 'solido', b, [0, 4.3, 0], [0, 0, 0], [7, 0.9, 0.5], 0);
  H.pieza('caja', '#f4f2ec', 'brillo', b, [0, 4.3, 0.28], [0, 0, 0], [5.4, 0.5, 0.05], 0);
  for (var i = 0; i < 9; i++)
    H.pieza('caja', '#3c4a42', 'metal', b, [-2.4 + i * 0.6, 1.6, 0], [0, 0, 0], [0.07, 3.2, 0.07], 0);
}, 5.2);


// Pasajero sentado: reutiliza la persona pero con las piernas hacia adelante
MUNDO.forma('pasajeroSentado', function (H, color, b, ob) {
  var c = (ob && ob.cuerpo) || {};
  var piel = c.piel || '#c88d6b', pelo = c.pelo || '#241b16',
      chaq = c.chaqueta || '#5b3a26', pol = c.polera || '#1b2430',
      pant = c.pantalon || '#2b2f36', zap = c.zapato || '#1a1917';
  // muslos horizontales
  [-0.15, 0.15].forEach(function (x) {
    H.pieza('caja', pant, 'solido', b, [x, 0.42, 0.2], [0, 0, 0], [0.22, 0.2, 0.5], 0);
    H.pieza('caja', pant, 'solido', b, [x, 0.24, 0.42], [0, 0, 0], [0.22, 0.42, 0.2], 0);
    H.pieza('caja', zap, 'solido', b, [x, 0.05, 0.5], [0, 0, 0], [0.22, 0.1, 0.34], 0);
  });
  // torso
  H.pieza('caja', pol, 'solido', b, [0, 0.78, 0.04], [0, 0, 0], [0.36, 0.5, 0.24], 0);
  H.pieza('caja', chaq, 'solido', b, [-0.21, 0.78, 0.03], [0, 0, 0], [0.2, 0.54, 0.3], 0);
  H.pieza('caja', chaq, 'solido', b, [0.21, 0.78, 0.03], [0, 0, 0], [0.2, 0.54, 0.3], 0);
  H.pieza('caja', chaq, 'solido', b, [0, 0.78, -0.12], [0, 0, 0], [0.58, 0.54, 0.1], 0);
  // brazos sobre las piernas
  H.pieza('caja', chaq, 'solido', b, [-0.34, 0.7, 0.12], [20, 0, 6], [0.16, 0.5, 0.18], 0);
  H.pieza('caja', chaq, 'solido', b, [0.34, 0.7, 0.12], [20, 0, -6], [0.16, 0.5, 0.18], 0);
  // cabeza
  H.pieza('caja', piel, 'solido', b, [0, 1.1, 0.02], [0, 0, 0], [0.14, 0.12, 0.14], 0);
  H.pieza('esfera', piel, 'solido', b, [0, 1.26, 0.02], [0, 0, 0], [0.15, 0.18, 0.15], 0);
  H.pieza('esfera', pelo, 'solido', b, [0, 1.32, 0.008], [0, 0, 0], [0.158, 0.12, 0.163], 0);
  // rasgos mínimos
  [-0.056, 0.056].forEach(function (x) {
    H.pieza('esferaB', '#2a2320', 'solido', b, [x, 1.28, 0.15], [0, 0, 0], [0.02, 0.02, 0.016], 0);
  });
  H.pieza('caja', piel, 'solido', b, [0, 1.24, 0.16], [0, 0, 0], [0.03, 0.045, 0.035], 0);
}, 1.5);


// Losa/plataforma elevada con pilares (un piso del edificio)
MUNDO.forma('losa', function (H, color, b, ob) {
  var A = (ob && ob.dim) ? ob.dim[0] : 24;
  var L = (ob && ob.dim) ? ob.dim[1] : 20;
  H.pieza('caja', color, 'solido', b, [0, 0, 0], [0, 0, 0], [A, 0.4, L], 0);
  H.pieza('caja', '#c9c3b6', 'solido', b, [0, 0.22, 0], [0, 0, 0], [A - 0.4, 0.06, L - 0.4], 0);
  // pilares en las esquinas y bordes (bajan al piso inferior)
  var h = (ob && ob.pilar) ? ob.pilar : 3.4;
  [[-A/2+0.6, -L/2+0.6],[A/2-0.6,-L/2+0.6],[-A/2+0.6,L/2-0.6],[A/2-0.6,L/2-0.6],
   [0,-L/2+0.6],[0,L/2-0.6],[-A/2+0.6,0],[A/2-0.6,0]].forEach(function(pz){
    H.pieza('caja', '#e0dcd2', 'solido', b, [pz[0], -h/2, pz[1]], [0,0,0], [0.44, h, 0.44], 0);
  });
}, 1);

// Baranda perimetral de un piso abierto
MUNDO.forma('baranda', function (H, color, b, ob) {
  var largo = (ob && ob.largo) ? ob.largo : 20;
  H.pieza('caja', color, 'metal', b, [0, 1.05, 0], [0, 0, 0], [largo, 0.09, 0.09], 0);
  H.pieza('caja', color, 'metal', b, [0, 0.55, 0], [0, 0, 0], [largo, 0.06, 0.06], 0);
  var n = Math.floor(largo / 1.2);
  for (var i = 0; i <= n; i++) {
    H.pieza('caja', color, 'metal', b, [-largo/2 + i*1.2, 0.55, 0], [0,0,0], [0.05, 1.1, 0.05], 0);
  }
}, 1.5);

// Sala de clases: piso, tres muros, pizarra, escritorio y pupitres en grilla
MUNDO.forma('sala', function (H, color, b, ob) {
  var A = 6.4, L = 5.6, ALTO = 3;
  var muros = (ob && ob.muros) ? ob.muros : 'IFD';  // I=izq F=fondo D=der (frente abierto al pasillo)
  // piso
  H.pieza('caja', '#d7d2c6', 'solido', b, [0, 0.06, 0], [0, 0, 0], [A, 0.12, L], 0);
  // cielo
  H.pieza('caja', '#eceae4', 'solido', b, [0, ALTO, 0], [0, 0, 0], [A, 0.12, L], 0);
  H.pieza('caja', '#fdfbf2', 'brillo', b, [0, ALTO - 0.08, 0], [0, 0, 0], [1.6, 0.05, 2.2], 0);
  // muros según config
  if (muros.indexOf('F') >= 0) H.pieza('caja', color, 'solido', b, [0, ALTO/2, -L/2], [0,0,0], [A, ALTO, 0.16], 0);
  if (muros.indexOf('I') >= 0) H.pieza('caja', color, 'solido', b, [-A/2, ALTO/2, 0], [0,0,0], [0.16, ALTO, L], 0);
  if (muros.indexOf('D') >= 0) H.pieza('caja', color, 'solido', b, [A/2, ALTO/2, 0], [0,0,0], [0.16, ALTO, L], 0);
  // pizarra blanca en el muro del fondo
  H.pieza('caja', '#3a3a3a', 'solido', b, [0, 1.6, -L/2 + 0.12], [0,0,0], [3.4, 1.3, 0.06], 0);
  H.pieza('caja', '#f6f7f4', 'solido', b, [0, 1.6, -L/2 + 0.16], [0,0,0], [3.1, 1.05, 0.03], 0);
  // escritorio del profesor
  H.pieza('caja', '#8a5a34', 'solido', b, [-2, 0.55, -L/2 + 1], [0,0,0], [1.4, 0.08, 0.7], 0);
  H.pieza('caja', '#6d4426', 'solido', b, [-2, 0.28, -L/2 + 1], [0,0,0], [1.3, 0.5, 0.6], 0);
  // pupitres 3x3 mirando la pizarra
  for (var fila = 0; fila < 3; fila++) {
    for (var col = 0; col < 3; col++) {
      var px = -1.7 + col * 1.7, pz = -0.4 + fila * 1.5;
      // mesa
      H.pieza('caja', '#d8c9a8', 'solido', b, [px, 0.55, pz], [0,0,0], [0.7, 0.06, 0.5], 0);
      H.pieza('caja', '#a89878', 'solido', b, [px, 0.3, pz], [0,0,0], [0.06, 0.5, 0.06], 0);
      H.pieza('caja', '#a89878', 'solido', b, [px, 0.3, pz - 0.2], [0,0,0], [0.06, 0.5, 0.06], 0);
      // silla
      H.pieza('caja', '#3f6b8a', 'solido', b, [px, 0.34, pz + 0.5], [0,0,0], [0.42, 0.06, 0.42], 0);
      H.pieza('caja', '#3f6b8a', 'solido', b, [px, 0.6, pz + 0.68], [-6,0,0], [0.42, 0.5, 0.06], 0);
      H.pieza('caja', '#2f2f2f', 'solido', b, [px, 0.16, pz + 0.5], [0,0,0], [0.06, 0.34, 0.06], 0);
    }
  }
}, 3.2);


// Pasamanos laterales de una escalera (los peldaños los genera el motor)
MUNDO.forma('baranda-esc', function (H, color, b, ob) {
  var es = ob.escalones[0];
  var largoDiag = Math.sqrt(es.largo * es.largo + es.alto * es.alto);
  var ang = -Math.atan2(es.alto, es.largo) * 180 / Math.PI;
  [-es.ancho/2, es.ancho/2].forEach(function (x) {
    H.pieza('caja', '#f0eee8', 'solido', b, [x, es.alto/2 + 0.3, es.dz - es.largo/2],
      [ang, 0, 0], [0.14, 0.9, largoDiag], 0);
    H.pieza('caja', color, 'metal', b, [x, es.alto/2 + 0.95, es.dz - es.largo/2],
      [ang, 0, 0], [0.07, 0.07, largoDiag], 0);
  });
}, 3);


// Municipalidad de Villa Alemana: edificio institucional con bandera
MUNDO.forma('municipalidad', function (H, color, b) {
  var A = 20, ALTO = 9, F = 14;
  // cuerpo principal
  H.pieza('caja', color, 'solido', b, [0, ALTO/2, 0], [0, 0, 0], [A, ALTO, F], 0);
  // basamento
  H.pieza('caja', '#c9c3b6', 'solido', b, [0, 0.4, F/2 + 0.3], [0, 0, 0], [A + 1, 0.8, 1], 0);
  // pórtico de columnas al frente
  for (var i = 0; i < 5; i++) {
    H.pieza('poste', '#f2f0ea', 'solido', b, [-8 + i * 4, ALTO*0.42, F/2 + 0.6], [0, 0, 0], [0.5, ALTO*0.85, 0.5], 0);
  }
  H.pieza('caja', '#e8e4da', 'solido', b, [0, ALTO*0.9, F/2 + 0.6], [0, 0, 0], [A, 1.2, 1.4], 0);
  // frontón triangular
  H.pieza('cono', '#e0dcd2', 'solido', b, [0, ALTO + 1, F/2 + 0.6], [0, 0, 0], [A*0.62, 2, 1.4], 0);
  // ventanas en dos pisos
  for (var p2 = 0; p2 < 2; p2++) for (var i = 0; i < 6; i++) {
    H.pieza('caja', '#3d5566', 'vidrio', b, [-7.5 + i * 3, 2.4 + p2 * 3.2, F/2 + 0.05], [0, 0, 0], [1.4, 1.8, 0.14], 0);
  }
  // asta con bandera
  H.pieza('poste', '#c8ccce', 'metal', b, [-11, 0, F/2 + 2], [0, 0, 0], [0.12, 11, 0.12], 0);
  H.pieza('caja', '#d33', 'solido', b, [-10.2, 10, F/2 + 2], [0, 0, 0], [1.6, 0.5, 0.05], 0);
  H.pieza('caja', '#fff', 'solido', b, [-10.2, 10.5, F/2 + 2], [0, 0, 0], [1.6, 0.5, 0.05], 0);
  H.pieza('caja', '#2f5fa8', 'solido', b, [-10.9, 10.75, F/2 + 2.02], [0, 0, 0], [0.5, 0.25, 0.06], 0);
  // letrero
  H.pieza('caja', '#20262b', 'solido', b, [0, 6.2, F/2 + 0.7], [0, 0, 0], [6, 0.7, 0.1], 0);
  H.pieza('caja', '#e8d8a0', 'brillo', b, [0, 6.2, F/2 + 0.76], [0, 0, 0], [5.4, 0.42, 0.03], 0);
}, 12);

// Toldo de local comercial del paseo (fachada con toldo de colores)
MUNDO.forma('local', function (H, color, b, ob) {
  var A = (ob && ob.dim) ? ob.dim : 6;
  H.pieza('caja', '#d8d2c4', 'solido', b, [0, 2, 0], [0, 0, 0], [A, 4, 0.3], 0);
  // vitrina
  H.pieza('caja', '#2b3540', 'vidrio', b, [0, 1.3, 0.16], [0, 0, 0], [A - 1, 2.2, 0.12], 0);
  // toldo
  H.pieza('caja', color, 'solido', b, [0, 2.7, 0.9], [-24, 0, 0], [A - 0.6, 0.1, 1.6], 0);
  H.pieza('caja', '#f4f2ec', 'brillo', b, [0, 3.3, 0.2], [0, 0, 0], [A - 1.5, 0.5, 0.05], 0);
}, 4.4);

// Barrera vial roja (las de la foto del paseo)
MUNDO.forma('barrera', function (H, color, b) {
  H.pieza('caja', '#d33', 'solido', b, [0, 0.5, 0], [0, 0, 0], [1.8, 1, 0.5], 0);
  H.pieza('caja', '#f2f2f2', 'brillo', b, [0, 0.65, 0.26], [0, 0, 0], [1.5, 0.5, 0.02], 0);
  H.pieza('caja', '#b02a2a', 'solido', b, [0, 0.12, 0], [0, 0, 0], [1.9, 0.24, 0.7], 0);
}, 1.4);

// Guirnalda de luces cruzando el paseo (postes + cable con ampolletas)
MUNDO.forma('guirnalda', function (H, color, b, ob) {
  var largo = (ob && ob.largo) ? ob.largo : 16;
  H.pieza('poste', '#3c4a42', 'metal', b, [-largo/2, 0, 0], [0, 0, 0], [0.14, 5, 0.14], 0);
  H.pieza('poste', '#3c4a42', 'metal', b, [largo/2, 0, 0], [0, 0, 0], [0.14, 5, 0.14], 0);
  H.pieza('caja', '#222', 'metal', b, [0, 4.7, 0], [0, 0, 0], [largo, 0.04, 0.04], 0);
  var n = Math.floor(largo / 1.3);
  for (var i = 0; i <= n; i++) {
    var caida = Math.sin(i / n * Math.PI) * 0.4;
    H.pieza('esferaB', '#fff2c0', 'brillo', b, [-largo/2 + i * 1.3, 4.55 - caida, 0], [0, 0, 0], [0.09, 0.09, 0.09], 0);
  }
}, 5.4);

/* ------------------------------------------------------------ COLOCACIONES */
var OBJ = [];
var FIERRO = '#38463f';

// Dos hileras de faroles bordeando el paseo central
for (var i = 0; i < 9; i++) {
  var z = 34 - i * 5.5;
  OBJ.push({ forma: 'farol', color: FIERRO, pos: [-8.5, 0, z] });
  OBJ.push({ forma: 'farol', color: FIERRO, pos: [8.5, 0, z] });
}
OBJ[0].nombre = 'Farol';

// Bancas mirando al paseo
for (var j = 0; j < 6; j++) {
  var zb = 30 - j * 7;
  OBJ.push({ forma: 'banca', color: '#7c3f2f', pos: [-12.5, 0, zb], giro: 90 });
  OBJ.push({ forma: 'banca', color: '#7c3f2f', pos: [12.5, 0, zb], giro: -90 });
}
OBJ[18].nombre = 'Banca';

// Basureros y maceteros
[-10.5, 10.5].forEach(function (x) {
  [26, 12, -2].forEach(function (zz) { OBJ.push({ forma: 'basurero', color: '#2f6b45', pos: [x, 0, zz] }); });
});
OBJ.push({ forma: 'macetero', color: '#9c6a52', pos: [-6.5, 0, 4], nombre: 'Macetero' });
OBJ.push({ forma: 'macetero', color: '#9c6a52', pos: [6.5, 0, 4] });

// Borde norte: reja, quiosco y edificios
for (var k = -4; k <= 4; k++) OBJ.push({ forma: 'reja', color: '#2f6b45', pos: [k * 6, 0, -19] });
OBJ.push({ forma: 'quiosco', color: '#2f8f4f', pos: [-19, 0, -14], giro: 12, nombre: 'Quiosco',
           choca: [{ dx: 0, dz: 0, ancho: 5, largo: 3.4, alto: 2.9 }] });
var MURO_EDIF = [{ dx: 0, dz: 0, ancho: 20, largo: 12, alto: 16 }];
OBJ.push({ forma: 'edificio', color: '#eceae4', pos: [0, 0, -30], nombre: 'Edificio del borde', choca: MURO_EDIF });
OBJ.push({ forma: 'edificio', color: '#ddd8cd', pos: [26, 0, -32], choca: MURO_EDIF });
OBJ.push({ forma: 'edificio', color: '#e4dfd4', pos: [-27, 0, -32], choca: MURO_EDIF });


/* ---- Estación de Villa Alemana, al costado derecho de la plaza ---- */
var XA  = 34.5;   // eje del andén
var XV1 = 39.5;   // vía del andén (tren detenido, se puede subir)
var XV2 = 45.5;   // vía de paso (tren en movimiento)

// Las dos vías
for (var v = 0; v < 22; v++) {
  var zv = 58 - v * 6;
  OBJ.push({ forma: 'rieles', color: '#8a8d90', pos: [XV1, 0.05, zv] });
  OBJ.push({ forma: 'rieles', color: '#8a8d90', pos: [XV2, 0.05, zv] });
}

// Catenaria: postes cada 12 m y los cables entre medio
for (var c = 0; c < 11; c++) {
  OBJ.push({ forma: 'catenaria', color: '#7c8288', pos: [49, 0.05, 56 - c * 12] });
  OBJ.push({ forma: 'cable', color: '#8e9498', pos: [XV1, 0.05, 50 - c * 12] });
  OBJ.push({ forma: 'cable', color: '#8e9498', pos: [XV2, 0.05, 50 - c * 12] });
}

// Andén: superficie pisable de verdad
OBJ.push({ forma: 'anden', color: '#c6bfae', pos: [XA, 0.05, 6],
           piso: { ancho: 7, largo: 34, alto: 0.95, color: '#c6bfae' } });
OBJ.push({ forma: 'marquesina', color: '#5b6a74', pos: [XA, 0.05, 6] });
OBJ.push({ forma: 'letrero', color: '#2f4f7d', pos: [XA - 3.4, 0.95, 20],
           nombre: 'Estación Villa Alemana', ficha: 'estacion', altoFicha: 5.6 });
OBJ.push({ forma: 'letrero', color: '#2f4f7d', pos: [XA - 3.4, 0.95, -8] });

// Mobiliario del andén
[14, 8, 2, -4].forEach(function (z) {
  OBJ.push({ forma: 'banca', color: '#2f6b45', pos: [XA - 1.6, 0.95, z], giro: 90 });
});
OBJ.push({ forma: 'basurero', color: '#2f6b45', pos: [XA - 1.6, 0.95, 11] });
OBJ.push({ forma: 'basurero', color: '#2f6b45', pos: [XA - 1.6, 0.95, -1] });

// Gente esperando
OBJ.push({ forma: 'persona', pos: [XA - 0.6, 0.95, 5], giro: 90,
  cuerpo: { altura: 1.68, piel: '#b57a56', pelo: '#1e1814', chaqueta: '#2f4257',
            polera: '#c9d2d8', pantalon: '#22262c', zapato: '#17161a' } });
OBJ.push({ forma: 'persona', pos: [XA + 1.4, 0.95, -6], giro: 88,
  cuerpo: { altura: 1.6, piel: '#d8a077', pelo: '#3a2a20', chaqueta: '#8a4a3c',
            polera: '#1b2430', pantalon: '#3d4450', zapato: '#201d1b' } });

// Acceso a la estación, con torniquetes
OBJ.push({ forma: 'acceso', color: '#b6afa3', pos: [XA - 11, 0.05, 26], giro: -90,
           choca: [{ dx: -4.6, dz: 0, ancho: 4.4, largo: 7, alto: 4.4 }] });
[-1, 0.2, 1.4].forEach(function (d) {
  OBJ.push({ forma: 'torniquete', color: '#dcdfe2', pos: [XA - 8.4 + d, 0.05, 24], giro: 90 });
});
[[XA - 8, 20], [XA - 8, 14], [XA - 8, -2], [XA - 8, -8]].forEach(function (r) {
  OBJ.push({ forma: 'reja', color: '#2f6b45', pos: [r[0], 0.05, r[1]], giro: 90 });
});

// Paredes del carro: tres tramos por costado, con los vanos de puerta libres
var MUROS_VAGON = [];
[-1.42, 1.42].forEach(function (x) {
  [[-6.6, -4.4], [-2.6, 2.6], [4.4, 6.6]].forEach(function (t) {
    MUROS_VAGON.push({ dx: x, dz: (t[0] + t[1]) / 2, ancho: 0.24,
                       largo: t[1] - t[0], base: 1, alto: 2.4 });
  });
});
[-7.8, 7.8].forEach(function (z) {
  MUROS_VAGON.push({ dx: 0, dz: z, ancho: 2.9, largo: 0.24, base: 1, alto: 2.4 });
});

// El tren detenido en el andén: se puede entrar, con puertas automáticas
var CARROS = [
  { id: 't1', z: 7.9 },
  { id: 't2', z: -7.9 },
  { id: 't3', z: 23.7, ficha: 'interior' }
];
CARROS.forEach(function (cr) {
  var o = { forma: 'vagonAbierto', id: cr.id, color: '#eef1f3', pos: [XV1, 0.05, cr.z],
            piso: { ancho: 2.66, largo: 15.2, alto: 1.1, color: '#c9ced3' },
            choca: MUROS_VAGON };
  if (cr.ficha) { o.ficha = cr.ficha; o.altoFicha = 5; }
  OBJ.push(o);

  // registrar las puertas de ambos costados de este carro
  ['I', 'D'].forEach(function (lado) {
    MUNDO.puerta({
      hojas: [null, null], _lado: lado, _id: cr.id,
      x: XV1 + (lado === 'I' ? -1.42 : 1.42), z: cr.z,
      radio: 3.2, abre: 0.82, eje: 'z'
    });
  });
});

// La cabina de control, al frente del primer carro
OBJ.push({ forma: 'cabina', color: '#eef1f3', pos: [XV1, 0.05, 16.5],
           piso: { ancho: 2.7, largo: 2.4, alto: 1.1, color: '#c9ced3' },
           ficha: 'cabina', altoFicha: 4.4 });
OBJ.push({ forma: 'persona', pos: [XV1, 1.15, 15.9], giro: 0,
  cuerpo: { altura: 1.72, piel: '#c48a63', pelo: '#2a2018', chaqueta: '#28405c',
            polera: '#28405c', pantalon: '#20262b', zapato: '#17161a' } });

// Pasajeros aleatorios dentro de los carros
var PIELES = ['#c88d6b', '#b57a56', '#d8a077', '#a9714f', '#e0b48c', '#8a5a3c'];
var PELOS  = ['#241b16', '#2a2018', '#3a2a20', '#5a4634', '#4a3a2c', '#1c1712'];
var ROPAS  = ['#7a3f4a', '#2f4257', '#2f6b45', '#8a4a3c', '#3f5d6b', '#5b3a26', '#444a52', '#7a5a2c'];
function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }

CARROS.forEach(function (cr) {
  // sentados: en algunos asientos al azar
  var asientos = [-6.2, -5.2, 5.2, 6.2, -1.9, 1.9];
  asientos.forEach(function (z) {
    [-0.78, 0.78].forEach(function (x) {
      if (Math.random() > 0.5) {
        OBJ.push({ forma: 'pasajeroSentado', pos: [XV1 + x, 1.1, cr.z + z], giro: x < 0 ? 90 : -90,
          cuerpo: { altura: 1.68, piel: rnd(PIELES), pelo: rnd(PELOS),
                    chaqueta: rnd(ROPAS), polera: rnd(ROPAS), pantalon: '#2b2f36', zapato: '#1a1917' } });
      }
    });
  });
  // de pie: agarrados de la barra central
  var nDePie = 1 + Math.floor(Math.random() * 3);
  for (var k = 0; k < nDePie; k++) {
    var zx = cr.z + (Math.random() * 8 - 4);
    OBJ.push({ forma: 'persona', pos: [XV1 + (Math.random() > 0.5 ? 0.5 : -0.5), 1.1, zx],
      giro: Math.random() * 360,
      cuerpo: { altura: 1.6 + Math.random() * 0.2, piel: rnd(PIELES), pelo: rnd(PELOS),
                chaqueta: rnd(ROPAS), polera: rnd(ROPAS), pantalon: '#2b2f36', zapato: '#1a1917',
                mochila: Math.random() > 0.6 } });
  }
});

// El tren que pasa por la otra vía, sin detenerse
[16, 1.4, -13.2].forEach(function (z) {
  OBJ.push({ forma: 'vagon', color: '#eef1f3', pos: [XV2, 0.55, z], grupo: 'tren' });
});

/* ---- Más elementos de la plaza ---- */
OBJ.push({ forma: 'pileta', color: '#cdc6b6', pos: [0, 0.05, 18], nombre: 'Pileta', altoFicha: 3,
           choca: [{ r: 1.7, alto: 0.7 }] });
OBJ.push({ forma: 'resbalin', color: '#3f78a8', pos: [-19, 0.05, -6], nombre: 'Juegos' });
OBJ.push({ forma: 'paradero', color: '#41525c', pos: [-14, 0.05, 44], giro: 180, nombre: 'Paradero' });
OBJ.push({ forma: 'semaforo', color: '#3c4a42', pos: [-24, 0.05, 45] });
OBJ.push({ forma: 'semaforo', color: '#3c4a42', pos: [20, 0.05, 45], giro: 180 });
[[-30, 46, 0, '#9c3b34'], [-22, 46.5, 0, '#2f4257'], [8, 46, 180, '#d8d4cc'], [24, 46.5, 180, '#43584a']]
  .forEach(function (a) {
    OBJ.push({ forma: 'auto', color: a[3], pos: [a[0], 0.05, a[1]], giro: a[2] });
  });

// Árboles sueltos del borde de la estación
[[28, 26], [28, -14], [30, 34], [26, -22]].forEach(function (q) {
  OBJ.push({ forma: 'arbolSombra', color: '#4c7038', pos: [q[0], 0.05, q[1]],
             choca: [{ r: 0.32, alto: 4 }] });
});


/* ================= COLEGIO SAN AGUSTÍN (al otro lado de la estación) =========
   La estación está en X positivo (derecha). El colegio va en X negativo.
   Tres pisos reales conectados por escaleras:
     Piso 0 (calle)  y = 0     → recepción, patio, Felipe
     Piso 1          y = 4     → la multicancha
     Piso 2          y = 8     → cinco salas de clases
   ========================================================================== */
var CX = 6;      // centrado, cruzando hacia el norte
var CZ = -78;    // al fondo del todo: más al norte que la estación
var P1 = 4;      // altura del piso 1
var P2 = 8;      // altura del piso 2
var EDA = 30, EDL = 24;   // ancho y largo del edificio

// ---- Portón de acceso, mirando a la plaza ----
OBJ.push({ forma: 'porton', color: '#7a4a30', pos: [CX + 4, 0.05, CZ + 16],
           nombre: 'Colegio San Agustín', ficha: 'colegio', altoFicha: 6,
           choca: [{ dx: -3, dz: 0, r: 0.4, alto: 4 }, { dx: 3, dz: 0, r: 0.4, alto: 4 }] });

/* ---------- PISO 0 · nivel calle ---------- */
// piso del recinto
OBJ.push({ forma: 'losa', color: '#b8b2a4', pos: [CX, 0, CZ], dim: [EDA, EDL], pilar: 0.4,
           piso: { ancho: EDA, largo: EDL, alto: 0.25, color: '#c3bdaf' } });
// recepción con escudo SA, contra el muro del fondo
OBJ.push({ forma: 'recepcion', color: '#f0eee8', pos: [CX + 4, 0.25, CZ - 7], giro: 0,
           ficha: 'recepcion', altoFicha: 4.6,
           choca: [
             { dx: 3, dz: -3.5, ancho: 9.8, largo: 0.3, alto: 3.6 },
             { dx: -6, dz: -3.5, ancho: 1.8, largo: 0.3, alto: 3.6 },
             { dx: 1, dz: 1.5, ancho: 9, largo: 1, alto: 1.3 }
           ] });
// muros perimetrales del piso 0 (dejan el frente abierto)
OBJ.push({ forma: 'losa', color: '#b8b2a4', pos: [CX, 0, CZ], dim: [0.1,0.1], pilar: 0,
           choca: [
             { dx: -EDA/2, dz: 0, ancho: 0.4, largo: EDL, alto: P1, base: 0 },
             { dx: EDA/2, dz: 0, ancho: 0.4, largo: EDL, alto: P1, base: 0 },
             { dx: 0, dz: -EDL/2, ancho: EDA, largo: 0.4, alto: P1, base: 0 }
           ] });

// Felipe, en la entrada, a nivel de la calle
OBJ.push({
  forma: 'persona', pos: [CX + 4, 0.25, CZ + 10], giro: 0,
  dialogo: 'felipe', altoFicha: 2.6, nombre: 'Felipe', alto: 2.1,
  cuerpo: {
    altura: 1.74, piel: '#c48a63', pelo: '#1c1712',
    chaqueta: '#c4342e', polera: '#20242a', pantalon: '#2b2f36', zapato: '#1a1917',
    barba: '#241b16', lentes: '#20201f', capucha: true, mochila: '#7a7168'
  }
});
OBJ.push({ forma: 'persona', pos: [CX + 8, 0.25, CZ + 2], giro: 30,
  cuerpo: { altura: 1.62, piel: '#b57a56', pelo: '#1e1814', chaqueta: '#3f5d6b',
            polera: '#20242a', pantalon: '#2b3138', zapato: '#17161a' } });

// Escalera piso 0 → piso 1 (a la izquierda del edificio), con peldaños reales
OBJ.push({ forma: 'baranda-esc', color: '#c4cace', pos: [CX - 12, 0.25, CZ + 6], giro: 0,
           escalones: [{ dx: 0, dz: 5.5, ancho: 2.8, largo: 11, alto: P1 - 0.25, base: 0, pasos: 16, color: '#d8c23a' }] });

/* ---------- PISO 1 · la multicancha ---------- */
OBJ.push({ forma: 'losa', color: '#a8a294', pos: [CX, P1, CZ], dim: [EDA, EDL], pilar: P1,
           piso: { ancho: EDA, largo: EDL, alto: 0.25, color: '#9aa0a6' } });
OBJ.push({ forma: 'cancha', color: '#2f74b5', pos: [CX, P1 + 0.2, CZ],
           ficha: 'cancha', altoFicha: 6,
           piso: { ancho: 20, largo: 20, alto: 0.1, color: '#2f74b5' },
           choca: [
             { dx: -10, dz: 0, ancho: 0.3, largo: 20, alto: 4.4, base: P1 },
             { dx: 10, dz: 0, ancho: 0.3, largo: 20, alto: 4.4, base: P1 },
             { dx: 0, dz: -10, ancho: 20, largo: 0.3, alto: 4.4, base: P1 },
             { dx: 0, dz: 10, ancho: 20, largo: 0.3, alto: 4.4, base: P1 }
           ] });
// baranda del borde frontal del piso 1
OBJ.push({ forma: 'baranda', color: '#c4cace', pos: [CX, P1 + 0.25, CZ + EDL/2 - 0.3], largo: EDA });

// Escalera piso 1 → piso 2 (a la derecha), con peldaños reales
OBJ.push({ forma: 'baranda-esc', color: '#c4cace', pos: [CX + 12, P1 + 0.2, CZ + 6], giro: 0,
           escalones: [{ dx: 0, dz: 5.5, ancho: 2.8, largo: 11, alto: P2 - P1, base: 0, pasos: 16, color: '#d8c23a' }] });

/* ---------- PISO 2 · cinco salas de clases ---------- */
OBJ.push({ forma: 'losa', color: '#a8a294', pos: [CX, P2, CZ], dim: [EDA, EDL], pilar: P1,
           piso: { ancho: EDA, largo: EDL, alto: 0.25, color: '#d9d4c8' } });
// techo del edificio
OBJ.push({ forma: 'losa', color: '#c9c3b6', pos: [CX, P2 + 3.3, CZ], dim: [EDA + 0.6, EDL + 0.6], pilar: 0 });
// baranda del pasillo frontal del piso 2
OBJ.push({ forma: 'baranda', color: '#c4cace', pos: [CX, P2 + 0.25, CZ + EDL/2 - 0.3], largo: EDA });

// Las cinco salas, alineadas contra el muro del fondo, mirando al pasillo
var SALAS = [
  { n: '1° Medio', muros: 'IF' },
  { n: '2° Medio', muros: 'F'  },
  { n: '3° Medio', muros: 'F'  },
  { n: '4° Medio', muros: 'F'  },
  { n: 'Laboratorio', muros: 'FD' }
];
SALAS.forEach(function (sa, i) {
  var sx = CX - EDA/2 + 3.6 + i * 5.7;
  OBJ.push({ forma: 'sala', color: '#eceae4', pos: [sx, P2 + 0.2, CZ - 2.4], muros: sa.muros,
             nombre: sa.n, ficha: 'salas', altoFicha: 3.4,
             choca: [
               { dx: 0, dz: -2.8, ancho: 6.4, largo: 0.3, alto: 3, base: P2 },
               (sa.muros.indexOf('I') >= 0 ? { dx: -3.2, dz: 0, ancho: 0.3, largo: 5.6, alto: 3, base: P2 } : null),
               (sa.muros.indexOf('D') >= 0 ? { dx: 3.2, dz: 0, ancho: 0.3, largo: 5.6, alto: 3, base: P2 } : null)
             ].filter(Boolean) });
  // un estudiante en la primera fila de algunas salas
  if (i < 3) {
    OBJ.push({ forma: 'pasajeroSentado', pos: [sx - 1.7, P2 + 0.75, CZ - 2.8], giro: 180,
      cuerpo: { altura: 1.6, piel: '#c88d6b', pelo: '#241b16', chaqueta: '#3f5d6b',
                polera: '#20242a', pantalon: '#2b2f36', zapato: '#1a1917' } });
  }
});


/* ================= MUNICIPALIDAD (al este) ================= */
OBJ.push({ forma: 'municipalidad', color: '#e8e4da', pos: [66, 0.05, -6], giro: -90,
           nombre: 'Municipalidad de Villa Alemana', ficha: 'municipalidad', altoFicha: 13,
           choca: [{ dx: 0, dz: 0, ancho: 14, largo: 20, alto: 9 }] });

/* ================= PASEO PEATONAL (al sur) ================= */
// El paseo baja hacia z positivo desde la plaza. Piso de baldosa.
OBJ.push({ forma: 'anden', color: '#c9c3b4', pos: [0, 0.02, 66],
           piso: { ancho: 22, largo: 40, alto: 0.12, color: '#cfc7b4' } });
// dos hileras de locales con toldos de colores
var COLORES_TOLDO = ['#c4342e', '#2f6b45', '#2f5fa8', '#d88a2c', '#7a3f7a', '#2f8f8f'];
for (var i = 0; i < 6; i++) {
  var pz = 50 + i * 5.5;
  OBJ.push({ forma: 'local', color: COLORES_TOLDO[i % 6], pos: [-11.5, 0.05, pz], giro: 90, dim: 5,
             choca: [{ dx: 0, dz: 0, ancho: 5, largo: 0.4, alto: 4 }] });
  OBJ.push({ forma: 'local', color: COLORES_TOLDO[(i+3) % 6], pos: [11.5, 0.05, pz], giro: -90, dim: 5,
             choca: [{ dx: 0, dz: 0, ancho: 5, largo: 0.4, alto: 4 }] });
}
// guirnaldas de luces cruzando el paseo
[52, 60, 68, 76].forEach(function (pz) {
  OBJ.push({ forma: 'guirnalda', color: '#fff2c0', pos: [0, 0.05, pz], largo: 20 });
});
// barreras rojas de obra, como en la foto
[[-4, 82], [-1.5, 82], [1, 82], [3.5, 82], [-7, 48], [7, 48]].forEach(function (br) {
  OBJ.push({ forma: 'barrera', color: '#d33', pos: [br[0], 0.05, br[1]],
             choca: [{ dx: 0, dz: 0, ancho: 1.8, largo: 0.5, alto: 1 }] });
});
// palmeras y bancas en el paseo
[54, 64, 74].forEach(function (pz) {
  OBJ.push({ forma: 'palmera', color: '#5f8a4a', pos: [-8, 0.05, pz], choca: [{ r: 0.42, alto: 7 }] });
  OBJ.push({ forma: 'palmera', color: '#5f8a4a', pos: [8, 0.05, pz], choca: [{ r: 0.42, alto: 7 }] });
  OBJ.push({ forma: 'banca', color: '#7c3f2f', pos: [-4, 0.05, pz], giro: 0 });
  OBJ.push({ forma: 'banca', color: '#7c3f2f', pos: [4, 0.05, pz], giro: 0 });
});
// gente paseando
OBJ.push({ forma: 'persona', pos: [-2, 0.05, 58], giro: 20,
  cuerpo: { altura: 1.68, piel: '#c88d6b', pelo: '#241b16', chaqueta: '#2f6b45',
            polera: '#e8e2d4', pantalon: '#2b2f36', zapato: '#1a1917' } });
OBJ.push({ forma: 'persona', pos: [3, 0.05, 70], giro: -150,
  cuerpo: { altura: 1.63, piel: '#d8a077', pelo: '#3a2a20', chaqueta: '#7a3f4a',
            polera: '#20242a', pantalon: '#3d4450', zapato: '#201d1b', mochila: true } });

/* ---- El anfitrión, junto a la entrada del paseo ---- */
OBJ.push({
  forma: 'persona', pos: [3.2, 0.05, 36], giro: 4,
  grupo: 'anfitrion', dialogo: 'anfitrion', altoFicha: 2.55,
  nombre: ANFITRION, alto: 2.1,
  cuerpo: {
    altura: 1.78,
    piel: '#c88d6b', pelo: '#241b16',
    chaqueta: '#5b3a26', polera: '#1b2430',
    pantalon: '#15171b', zapato: '#0d0e10'
  }
});

// Un par de personas más, para que la plaza no esté vacía
OBJ.push({ forma: 'persona', pos: [-13.5, 0.05, 12], giro: 115,
  cuerpo: { altura: 1.64, piel: '#a9714f', pelo: '#2b201a', chaqueta: '#7a4a58',
            polera: '#e8e2d4', pantalon: '#3a4351', zapato: '#2a2622' } });
OBJ.push({ forma: 'persona', pos: [15, 0.05, -4], giro: -70,
  cuerpo: { altura: 1.71, piel: '#e0b48c', pelo: '#5a4634', chaqueta: '#3f5d6b',
            polera: '#20242a', pantalon: '#4a4f57', zapato: '#1c1a18' } });

/* ---------------------------------------------------------- ANIMACIONES ---- */

// El tren llega, se detiene un rato en el andén y se va
MUNDO.animar(function (t) {
  var g = MUNDO.grupos['tren'];
  if (!g) return;
  var CICLO = 26;                      // segundos entre paso y paso
  var f = (t % CICLO) / CICLO;
  // cruza de largo por la vía exterior, sin detenerse
  g.position.z = (f < 0.42) ? 200 - (f / 0.42) * 400 : 220;
});

// El anfitrión respira
MUNDO.animar(function (t) {
  var g = MUNDO.grupos['anfitrion'];
  if (g) g.position.y = Math.sin(t * 1.5) * 0.025;
});

/* ------------------------------------------------------------------ MUNDO */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS['villa-alemana'] = {

  titulo: 'Villa Alemana: la plaza',
  clima: { inicial: 'despejado', real: true, auto: false, fallback: { lat: -33.04, lon: -71.37 } },

  sonido: {
    fuentes: [
      // murmullo de gente en la plaza
      { pos: [0, 2, 10], filtro: 'bandpass', freq: 700, q: 0.8, vol: 0.14, refDist: 8, maxDist: 30 },
      // zumbido de la estación / rieles
      { pos: [39, 1, 6], filtro: 'lowpass', freq: 300, q: 0.7, vol: 0.2, refDist: 6, maxDist: 34 },
      // paseo comercial al sur
      { pos: [0, 2, 62], filtro: 'bandpass', freq: 900, q: 0.6, vol: 0.16, refDist: 10, maxDist: 40 }
    ]
  },
  materia: 'Ciencias para la Ciudadanía · Ecología urbana',
  resumen: 'El paseo de palmas, el arbolado, el pasto y el borde construido. Isla de calor, sombra y superficies permeables.',
  cielo: '#a8cbe4',
  niebla: { color: '#c3d5e0', cerca: 70, lejos: 220 },
  luz: { cielo: '#e2f0f8', suelo: '#9a8f74', ambiente: 0.95, sol: '#fff6e0', intensidad: 0.85,
         posicion: '-14 26 10' },

  ancho: 200,
  anchoVida: 56,
  inicio: '0 1.7 42',

  vistas: {
    entrada: { etiqueta: 'Entrada del paseo',  pos: '0 1.7 42',  pitch: -2,  yaw: 0 },
    palmas:  { etiqueta: 'Bajo las palmas',    pos: '-11 1.7 20', pitch: 12, yaw: 25 },
    aerea:   { etiqueta: 'Vista aérea',        pos: '0 26 40',   pitch: -32, yaw: 0 },
    sombra:  { etiqueta: 'La zona de sombra',  pos: '14 1.7 0',  pitch: 4,   yaw: -60 },
    estacion:{ etiqueta: 'La estación',        pos: '30 1.7 26', pitch: 0,   yaw: 178 },
    anden:   { etiqueta: 'En el andén',        pos: '33.5 2.7 14', pitch: -3, yaw: 178 },
    vagon:   { etiqueta: 'Dentro del vagón',   pos: '39.5 2.8 4',  pitch: 0,  yaw: 180 },
    colegio: { etiqueta: 'Colegio: entrada',    pos: '6 1.9 -60',   pitch: -2,  yaw: 0 },
    cancha:  { etiqueta: 'Colegio: la cancha',  pos: '6 5.9 -80',   pitch: 0,   yaw: 0 },
    salas:   { etiqueta: 'Colegio: las salas',  pos: '6 9.9 -76',   pitch: -4,  yaw: 180 },
    municip: { etiqueta: 'Municipalidad (este)', pos: '48 2 -6',    pitch: 2,   yaw: 90 },
    paseo:   { etiqueta: 'Paseo peatonal (sur)', pos: '0 1.7 46',   pitch: -1,  yaw: 180 }
  },

  cielos: [
    { id: 'sol', posicion: '-40 40 30', radio: 2.4, color: '#fff3c9' }
  ],

  objetos: OBJ,

  franjas: [
    {
      id: 'calle', nombre: 'Calle y vereda', rango: 'El borde de la plaza',
      z: [50, 40], y: 0, color: '#6d6a66', superficie: 'asfalto',
      texto: 'El pavimento es una superficie impermeable: el agua de lluvia no se infiltra, corre. Además absorbe radiación durante el día y la devuelve como calor de noche. Es el punto de partida para entender por qué una ciudad es más calurosa que el campo que la rodea.',
      vida: [
        'Sin suelo vivo: el agua escurre en vez de infiltrarse',
        'El asfalto puede superar los 50 °C en un día de verano',
        'Árboles de la vereda como única sombra disponible'
      ],
      reto: 'Camina de la calle al pasto y compara. Si pudieras medir la temperatura del suelo en ambos puntos al mediodía, ¿cuánta diferencia esperarías? ¿Por qué?',
      especies: []
    },
    {
      id: 'paseo', nombre: 'El paseo de palmas', rango: 'Eje central de la plaza',
      z: [40, 8], y: 0.05, color: '#cfc7b4', superficie: 'baldosa', hueco: 9,
      texto: 'La palma canaria (<i>Phoenix canariensis</i>) es la firma de las plazas chilenas, y viene de las Islas Canarias. Da altura y carácter, pero muy poca sombra: sus frondas se concentran arriba y dejan pasar el sol. Por eso la gente camina por el eje y se sienta bajo los árboles del costado.',
      vida: [
        'Palma canaria (<i>Phoenix canariensis</i>), introducida',
        'Baldosa clara, que refleja más radiación que el asfalto',
        'Faroles, bancas y basureros: el mobiliario que define el uso'
      ],
      reto: 'Observa dónde se sienta la gente en la plaza a las 15:00 de un día de enero. ¿Qué variable física explica mejor la distribución de las personas?',
      especies: [
        { forma: 'palmera', n: 22, color: '#5f8a4a', nombre: 'Palma canaria', hueco: 9, choca: { r: 0.42, alto: 7 } }
      ]
    },
    {
      id: 'arbolado', nombre: 'Arbolado y áreas verdes', rango: 'A ambos lados del paseo',
      z: [8, -18], y: 0.05, color: '#6f7d4a', superficie: 'pasto', hueco: 9,
      texto: 'Acá está el trabajo real de la plaza. Un árbol grande de sombra baja la temperatura del aire bajo su copa varios grados, retiene material particulado en sus hojas y permite que el agua se infiltre al suelo. Todo eso son servicios ecosistémicos, y no aparecen en ningún presupuesto municipal.',
      vida: [
        'Pimiento (<i>Schinus molle</i>), nativo, copa amplia y colgante',
        'Especies introducidas de copa densa que dan la sombra del sector',
        'Pasto: superficie permeable, la contraria del asfalto',
        'Aves urbanas: tordos, zorzales, palomas, queltehues en el pasto'
      ],
      reto: 'Elige un árbol de la plaza y estima su copa en metros. Con eso calcula cuántos metros cuadrados de suelo mantiene a la sombra. ¿Cuántos árboles harían falta para cubrir el paseo completo?',
      especies: [
        { forma: 'arbolSombra', n: 26, color: '#4c7038', nombre: 'Árbol de sombra', hueco: 10, choca: { r: 0.32, alto: 4 } },
        { forma: 'arbolSombra', n: 14, color: '#5f7d42', choca: { r: 0.32, alto: 4 } },
        { forma: 'pasto',       n: 260, color: '#6f8a45', hueco: 10 },
        { forma: 'cojin',       n: 30, color: '#5d7a3c', hueco: 11 }
      ]
    },
    {
      id: 'borde', nombre: 'El borde construido', rango: 'Reja, quiosco y edificios',
      z: [-18, -34], y: 0.05, color: '#c8c1b0', superficie: 'baldosa',
      texto: 'Donde termina la plaza empieza la ciudad. La altura de lo construido define cuánta sombra recibe la plaza en invierno y cuánto viento la cruza. Un edificio nuevo no solo tapa la vista: cambia el microclima del espacio público que tiene al lado.',
      vida: [
        'Reja perimetral: define horarios y usos',
        'Quiosco: comercio que sostiene la vida de la plaza',
        'Edificación en altura, cada vez más frecuente en el centro'
      ],
      reto: 'Mira la sombra que proyectan los edificios. En junio el sol está mucho más bajo. ¿Qué parte de la plaza quedaría sin sol toda la mañana de invierno?',
      especies: []
    }
  ],

  dialogos: {
    felipe: {
      nombre: 'Felipe',
      inicio: 'saludo',
      nodos: {
        saludo: {
          texto: 'Hola, soy Felipe. Me gusta la historia de este lugar, y hay más de la que se ve a simple vista. ¿Te cuento cómo nació Villa Alemana?',
          opciones: [
            { dice: '¿Cómo empezó todo?',       va: 'origen' },
            { dice: '¿Por qué se llama así?',    va: 'nombre' },
            { dice: '¿Y el ferrocarril?',        va: 'tren' },
            { dice: 'La ciudad de los molinos',  va: 'molinos' },
            { dice: 'En otro momento',           va: null }
          ]
        },
        origen: {
          texto: 'Antes de ser ciudad, esto eran campos: una pequeña viña, árboles y sobre todo espino. En 1894, don Buenaventura Joglar compró y loteó el predio, que primero se llamó Viña Miraflores. Vendía el metro de terreno a veinte centavos.',
          opciones: [
            { dice: '¿Y de dónde el nombre alemán?', va: 'nombre' },
            { dice: 'Sigue', va: 'tren' },
            { dice: 'Volvamos al inicio', va: 'saludo' }
          ]
        },
        nombre: {
          texto: 'Los primeros en comprar esos sitios fueron inmigrantes alemanes, y por eso la villa tomó ese nombre. Curiosamente, muchos de ellos nunca edificaron ni vivieron aquí: vendieron y se fueron. El nombre quedó como homenaje a quienes llegaron primero.',
          opciones: [
            { dice: '¿Y el tren qué papel jugó?', va: 'tren' },
            { dice: 'Volvamos al inicio', va: 'saludo' }
          ]
        },
        tren: {
          texto: 'El ferrocarril es la clave de todo: la ciudad nació a su amparo. La línea entre Valparaíso y el interior pasó por acá, y alrededor de la estación se armó el pueblo. Sin el tren, Villa Alemana no existiría donde está. Ese mismo tren es hoy el Metro de Valparaíso que viste en la estación.',
          opciones: [
            { dice: 'Por eso el lema del clima', va: 'lema' },
            { dice: 'Cuéntame lo de los molinos', va: 'molinos' },
            { dice: 'Volvamos al inicio', va: 'saludo' }
          ]
        },
        lema: {
          texto: 'El clima templado le dio su lema: "Por su clima, la juventud no teme a la vejez". Era famosa como lugar sano para vivir, y por un tiempo fue destino de descanso para gente de Valparaíso.',
          opciones: [
            { dice: '¿Los molinos?', va: 'molinos' },
            { dice: 'Gracias, Felipe', va: null }
          ]
        },
        molinos: {
          texto: 'También la llamaban la Ciudad de los Molinos. En sus inicios el agua se sacaba de pozos con molinos de viento, tantos que se volvieron un sello del paisaje. En el escudo comunal el molino recuerda esa época, junto al racimo de uva de la antigua Viña Miraflores.',
          opciones: [
            { dice: '¿Qué más hay en el escudo?', va: 'escudo' },
            { dice: 'Volvamos al inicio', va: 'saludo' }
          ]
        },
        escudo: {
          texto: 'El racimo recuerda la viña que dio origen a la ciudad; el molino, los pozos de agua; y las franjas con los colores de Chile y de Alemania, el porqué del nombre. Cada símbolo es un pedazo de esta historia que acabas de recorrer.',
          opciones: [
            { dice: 'Impresionante', va: null },
            { dice: 'Otra vez desde el inicio', va: 'saludo' }
          ]
        }
      }
    },
    anfitrion: {
      nombre: ANFITRION,
      inicio: 'saludo',
      nodos: {
        saludo: {
          texto: 'Hola, soy ' + ANFITRION + '. ¡Bienvenido a Villa Alemana! Estás parado en la plaza, que es el punto donde se cruzan el comercio, el transporte y la gente que viene a pasar la tarde. ¿Te muestro algo?',
          opciones: [
            { dice: '¿Dónde estoy exactamente?', va: 'ubicacion' },
            { dice: '¿Qué es ese tren?',          va: 'tren' },
            { dice: '¿Por qué hace tanto calor?', va: 'calor' },
            { dice: '¿Dónde queda el colegio?',    va: 'colegio' },
            { dice: 'Voy a mirar solo',           va: null }
          ]
        },
        ubicacion: {
          texto: 'Villa Alemana está en la Provincia de Marga Marga, Región de Valparaíso, y forma parte del Gran Valparaíso junto a Quilpué, Viña del Mar y Valparaíso. El clima es mediterráneo: veranos secos y calurosos, inviernos lluviosos. Por eso los árboles que ves aguantan meses sin agua.',
          opciones: [
            { dice: '¿Y el tren?',       va: 'tren' },
            { dice: 'Volvamos al inicio', va: 'saludo' },
            { dice: 'Gracias',            va: null }
          ]
        },
        tren: {
          texto: 'Ese es el Metro de Valparaíso. Pasa cada pocos minutos y conecta la ciudad con Limache por un lado y con Valparaíso por el otro. Fíjate en algo: la estación está a pasos de la plaza. No es casualidad.',
          opciones: [
            { dice: '¿Por qué no es casualidad?', va: 'ferrocarril' },
            { dice: 'Muéstrame la ficha completa', ficha: 'estacion' },
            { dice: 'Entendido', va: 'saludo' }
          ]
        },
        ferrocarril: {
          texto: 'Las ciudades de este valle crecieron siguiendo la vía. Primero llegó el ferrocarril, después la estación, y alrededor de la estación se armó el pueblo. Por eso el centro está donde está, y la plaza quedó pegada al andén.',
          opciones: [
            { dice: '¿Eso sigue importando hoy?', va: 'hoy' },
            { dice: 'Volvamos al inicio', va: 'saludo' }
          ]
        },
        hoy: {
          texto: 'Más que antes. Un carro lleno saca decenas de autos de la calle, y vivir cerca de una estación te ahorra tiempo y plata todos los días. Cuenta los autos estacionados y compáralos con la gente que cabe en un solo carro.',
          opciones: [
            { dice: 'Lo voy a contar', va: null },
            { dice: 'Otra cosa', va: 'saludo' }
          ]
        },
        colegio: {
          texto: 'El Colegio San Agustín está pasando la estación, hacia el fondo. Se entra por el portón; adentro tienes la recepción, el patio con las canchas y el pabellón, y hasta un subterráneo. Date una vuelta.',
          opciones: [
            { dice: 'Ver la ficha del colegio', ficha: 'colegio' },
            { dice: 'Gracias, voy para allá', va: null },
            { dice: 'Otra cosa', va: 'saludo' }
          ]
        },
        calor: {
          texto: 'Porque el pavimento absorbe radiación todo el día y la devuelve de noche. La ciudad completa funciona como una plancha caliente. Pero pisa el pasto bajo los árboles y vas a sentir la diferencia: esta plaza es una isla fría dentro de la isla de calor.',
          opciones: [
            { dice: 'Cuéntame más de eso', ficha: 'sol' },
            { dice: 'Voy a probarlo', va: null },
            { dice: 'Otra cosa', va: 'saludo' }
          ]
        }
      }
    }
  },

  fichas: [
    {
      id: 'municipalidad', nombre: 'Municipalidad de Villa Alemana', rango: 'El edificio del gobierno comunal',
      texto: 'Aquí funciona el gobierno de la comuna: la administración local, el alcalde y el concejo municipal. Es la institución que decide sobre el espacio público que acabas de recorrer, desde el arbolado de la plaza hasta el estado del paseo peatonal.',
      vida: [
        'Administra servicios locales: aseo, áreas verdes, permisos, patentes',
        'El alcalde y los concejales son elegidos por la gente de la comuna',
        'Decide sobre el uso del espacio público y la planificación urbana'
      ],
      reto: 'Muchas decisiones sobre la plaza y el paseo se toman aquí. Si pudieras proponer un cambio para tu barrio ante el municipio, ¿cuál sería y cómo lo justificarías?'
    },
    {
      id: 'paseo', nombre: 'El paseo peatonal', rango: 'Corazón comercial de Villa Alemana',
      texto: 'El paseo peatonal es donde se concentra el comercio y la vida de calle. Al cerrar el paso a los autos, el espacio se vuelve de las personas: se camina, se compra, se conversa. Las guirnaldas de luces y los toldos de colores le dan su carácter.',
      vida: [
        'Peatonalizar una calle prioriza a la gente por sobre los autos',
        'El comercio a pie de calle sostiene la economía local',
        'Las barreras rojas marcan obras: la ciudad siempre está cambiando'
      ],
      reto: 'Compara este paseo con una calle normal con autos. ¿Qué gana y qué pierde el comercio cuando se cierra al tránsito vehicular?'
    },
    {
      id: 'bienvenida', nombre: '¡Bienvenido a Villa Alemana!',
      rango: 'El anfitrión de la plaza',
      texto: 'Hola, y bienvenido. Estás parado en la plaza, que es el corazón de la ciudad: acá se cruzan el comercio, el transporte y la gente que viene a pasar la tarde. Camina hacia el fondo y vas a llegar al borde construido; a tu derecha está la estación, por donde pasa el Metro de Valparaíso.',
      vida: [
        'Villa Alemana está en la Provincia de Marga Marga, Región de Valparaíso',
        'Forma parte del Gran Valparaíso junto a Quilpué, Viña del Mar y Valparaíso',
        'El tren la conecta con Limache por un lado y con Valparaíso por el otro',
        'Clima mediterráneo: veranos secos y calurosos, inviernos lluviosos'
      ],
      reto: 'Recorre la plaza y anota tres cosas que hoy no existían hace cincuenta años. Después pregúntale a alguien mayor si tenías razón.'
    },
    {
      id: 'colegio', nombre: 'Colegio San Agustín de Villa Alemana', rango: 'Entrada del establecimiento',
      texto: 'Bienvenido al colegio. Tiene tres pisos que se recorren subiendo escaleras: en el nivel de la calle está la recepción y te recibe Felipe; una escalera sube a la multicancha del segundo piso; y otra más lleva al tercer piso, donde están las salas de clases. Casi todo se puede pisar.',
      vida: [
        'Piso 1, a nivel de calle: recepción con el escudo San Agustín',
        'Piso 2: la multicancha con arcos y tableros',
        'Piso 3: cinco salas de clases con pizarras y pupitres',
        'Escaleras que conectan los tres niveles'
      ],
      reto: 'Recorre el colegio completo y haz un plano a mano de lo que viste. Después compáralo con el colegio real: ¿qué falta y qué sobra en esta versión?'
    },
    {
      id: 'recepcion', nombre: 'Recepción', rango: 'La entrada del colegio',
      texto: 'El mesón de madera, el escudo del San Agustín al frente y el cuadro en el muro. Es el primer punto de contacto de cualquiera que llega al establecimiento.',
      reto: 'Toda institución tiene una imagen que la representa. ¿Qué elementos del escudo crees que resumen la identidad del colegio?'
    },
    {
      id: 'cancha', nombre: 'La multicancha', rango: 'Zona deportiva',
      texto: 'Piso azul con líneas amarillas y blancas, reja verde perimetral, arcos de baby fútbol y tableros de básquetbol. Cuando llueve, el agua queda sobre la superficie porque es impermeable: la misma idea de la isla de calor que vimos en la plaza, pero acá al servicio del deporte.',
      reto: 'La cancha se moja y demora en secar. ¿Qué solución de drenaje propondrías sin perder la superficie dura que el deporte necesita?'
    },
    {
      id: 'subterraneo', nombre: 'El subterráneo', rango: 'Bajo el patio',
      texto: 'Un pasillo bajo el nivel del patio, con zócalo de ladrillo y cielo iluminado, que conecta sectores del colegio. Bajar y subir escaleras dentro del mundo es posible gracias a las superficies inclinadas que sigues con los pies.',
      reto: 'Los espacios subterráneos son más frescos y estables en temperatura. ¿Por qué? Piensa en la tierra que los rodea como un aislante.'
    },
    {
      id: 'control', nombre: 'La sala de control', rango: 'El cerebro del servicio',
      texto: 'Desde una sala como esta se regula la circulación: dónde está cada tren, qué señal está en rojo, qué andén está ocupado y cuánto se atrasó el servicio. Un sistema ferroviario no funciona por los trenes, funciona por la coordinación entre ellos.',
      detalle: [
        'La lógica de fondo es el bloqueo: la vía se divide en tramos y solo un tren puede ocupar cada tramo a la vez. Las señales no son adornos, son la manera física de garantizar esa regla. Si un tren no respeta una señal, el sistema puede frenarlo por su cuenta.',
        'La otra mitad del trabajo es la información al pasajero. Los letreros del andén salen de acá, y esa información cambia el comportamiento de la gente: saber que el próximo tren llega en tres minutos evita que alguien cruce corriendo la vía.'
      ],
      vida: [
        'Control de circulación: posición de los trenes y estado de las señales',
        'Regulación de frecuencia cuando el servicio se atrasa',
        'Cámaras y comunicación con el personal de las estaciones',
        'Información en tiempo real hacia los letreros del andén'
      ],
      reto: 'Si dos trenes van con diez minutos de retraso, ¿conviene apurar al primero o retener al segundo? Piensa en qué le pasa a la cantidad de gente esperando en cada andén.'
    },
    {
      id: 'salas', nombre: 'Las salas de clases', rango: 'Tercer piso del colegio',
      texto: 'Cinco salas en fila, cada una con su pizarra, el escritorio del profesor y los pupitres mirando al frente. Es el espacio donde ocurre lo esencial del colegio, y también el más simple de reconocer: casi cualquiera ha pasado horas en una sala como esta.',
      reto: 'Mira la disposición de los pupitres: todos mirando la pizarra. ¿Qué otras formas de ordenar una sala conoces, y qué tipo de clase favorece cada una?'
    },
    {
      id: 'cabina', nombre: 'La cabina de control', rango: 'El puesto del conductor',
      texto: 'Desde aquí se conduce el tren: la palanca de tracción regula la velocidad, las pantallas muestran las señales de la vía y el parabrisas da la vista al frente. En sistemas modernos el conductor no está solo, lo respalda la sala de control central que regula todo el servicio.',
      detalle: [
        'La conducción sigue las señales de la vía, que dividen el recorrido en tramos: el tren solo avanza al siguiente tramo cuando está libre. El conductor obedece esas señales igual que un auto obedece un semáforo, pero con sistemas que pueden frenar el tren si se pasa una en rojo.',
        'La cabina y la sala de control central son dos escalas del mismo trabajo: una maneja este tren, la otra coordina todos los trenes de la línea para que no se junten ni se atrasen.'
      ],
      reto: 'El conductor ve una señal amarilla, que significa "prepárate a detenerte en la próxima". ¿Por qué el sistema avisa con una señal de anticipación en vez de solo una roja de golpe?'
    },
    {
      id: 'interior', nombre: 'Dentro del carro', rango: 'Sube y camina por el pasillo',
      texto: 'Los asientos van en pares a cada lado con un pasillo al centro, y hay barras y montantes junto a las puertas para quien viaja de pie. Cada centímetro está pensado para mover mucha gente en poco espacio.',
      vida: [
        'Un carro transporta del orden de cien a doscientas personas entre sentadas y de pie',
        'Las puertas anchas y el piso a nivel del andén aceleran la subida y bajada',
        'La superficie de calle que ocuparían esos pasajeros en auto es decenas de veces mayor'
      ],
      reto: 'Cuenta los asientos de este carro y estima cuánta gente cabe de pie. Después cuenta los autos estacionados afuera y calcula cuántos viajes reemplaza un solo tren.'
    },
    {
      id: 'estacion', nombre: 'La estación y la ciudad', rango: 'Metro de Valparaíso',
      texto: 'Las ciudades del valle del Marga Marga crecieron siguiendo la línea del ferrocarril: primero llegó la vía, después la estación, y alrededor de la estación se armó el pueblo. Por eso el centro de Villa Alemana está donde está, y por eso la plaza y la estación quedaron a pasos una de la otra.',
      vida: [
        'El tren mueve muchas personas ocupando muy poco espacio por pasajero',
        'Un carro lleno equivale a decenas de autos sacados de la carretera',
        'Vivir cerca de una estación reduce el tiempo y el costo de moverse',
        'Alrededor de las estaciones el suelo tiende a valer más y a construirse en altura'
      ],
      reto: 'Cuenta cuántos autos ves en la calle y cuánta gente cabe en un carro del tren. ¿Cuánto espacio de calle ahorra el tren en cada viaje?'
    },
    {
      id: 'sol', nombre: 'Isla de calor urbana', rango: 'Por qué la ciudad es más caliente',
      texto: 'Una ciudad puede estar varios grados más caliente que su entorno rural, sobre todo de noche. El asfalto y el hormigón absorben radiación todo el día y la liberan lentamente después del atardecer, mientras el suelo con vegetación se enfría rápido porque el agua que evapora se lleva calor consigo.',
      vida: [
        'Superficies oscuras e impermeables: absorben y no infiltran',
        'Menos vegetación: menos evapotranspiración, menos enfriamiento',
        'Calor de vehículos, industria y aire acondicionado',
        'La geometría de las calles atrapa la radiación entre muros'
      ],
      reto: 'La plaza es una isla fría dentro de la isla de calor. ¿Qué tres cambios concretos harías en tu barrio para bajarle la temperatura, y cuál de ellos es el más barato?'
    }
  ]
};
