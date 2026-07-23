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

/* Carro abierto: se puede entrar. El piso pisable lo declara el objeto
   con el campo "piso"; acá van las paredes, el techo y el mobiliario. */
MUNDO.forma('vagonAbierto', function (H, color, b) {
  var LARGO = 15.6, ALTO = 1.05, INT = '#e9edf0', AZUL = '#2f5fa8';

  // faldón y bogies
  H.pieza('caja', '#3a4148', 'solido', b, [0, 0.62, 0], [0, 0, 0], [2.8, 0.9, LARGO - 0.6], 0);
  // piso visible (el pisable lo pone el motor)
  H.pieza('caja', '#c9ced3', 'solido', b, [0, ALTO - 0.04, 0], [0, 0, 0], [2.66, 0.08, LARGO - 0.4], 0);

  // paredes laterales con dos vanos de puerta por costado
  var tramos = [[-6.6, -4.4], [-2.6, 2.6], [4.4, 6.6]];
  [-1.42, 1.42].forEach(function (x) {
    tramos.forEach(function (t) {
      var largo = t[1] - t[0], cz = (t[0] + t[1]) / 2;
      H.pieza('caja', color, 'solido', b, [x, ALTO + 0.55, cz], [0, 0, 0], [0.1, 1.1, largo], 0);
      H.pieza('caja', '#1d2b38', 'vidrio', b, [x, ALTO + 1.45, cz], [0, 0, 0], [0.09, 0.7, largo - 0.3], 0);
      H.pieza('caja', color, 'solido', b, [x, ALTO + 2, cz], [0, 0, 0], [0.1, 0.4, largo], 0);
      H.pieza('caja', AZUL, 'solido', b, [x, ALTO + 0.28, cz], [0, 0, 0], [0.11, 0.26, largo], 0);
    });
    // marcos de puerta
    [-3.5, 3.5].forEach(function (cz) {
      H.pieza('caja', '#9aa3ab', 'metal', b, [x, ALTO + 1.15, cz - 0.9], [0, 0, 0], [0.12, 2.3, 0.09], 0);
      H.pieza('caja', '#9aa3ab', 'metal', b, [x, ALTO + 1.15, cz + 0.9], [0, 0, 0], [0.12, 2.3, 0.09], 0);
    });
  });

  // testeros
  [-LARGO / 2, LARGO / 2].forEach(function (z) {
    H.pieza('caja', color, 'solido', b, [0, ALTO + 1.2, z], [0, 0, 0], [2.9, 2.4, 0.12], 0);
    H.pieza('caja', '#1d2b38', 'vidrio', b, [0, ALTO + 1.6, z], [0, 0, 0], [1.5, 0.9, 0.14], 0);
  });

  // techo y luminarias
  H.pieza('caja', INT, 'solido', b, [0, ALTO + 2.42, 0], [0, 0, 0], [2.9, 0.18, LARGO], 0);
  for (var i = 0; i < 6; i++) {
    H.pieza('caja', '#fdfbf2', 'brillo', b, [0, ALTO + 2.3, -6.2 + i * 2.5], [0, 0, 0], [0.5, 0.05, 1.9], 0);
  }

  // pasamanos: barra corrida y montantes junto a las puertas
  [-0.62, 0.62].forEach(function (x) {
    H.pieza('caja', '#b9bfc4', 'metal', b, [x, ALTO + 2.02, 0], [0, 0, 0], [0.05, 0.05, LARGO - 1.4], 0);
  });
  [-3.5, 3.5].forEach(function (cz) {
    [-0.85, 0.85].forEach(function (x) {
      H.pieza('cilindro', '#b9bfc4', 'metal', b, [x, ALTO + 1.15, cz], [0, 0, 0], [0.035, 2.3, 0.035], 0);
    });
  });

  // asientos: dos por costado, pasillo al centro
  var filas = [-6.2, -5.2, 5.2, 6.2, -1.9, -0.9, 0.9, 1.9];
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
OBJ.push({ forma: 'quiosco', color: '#2f8f4f', pos: [-19, 0, -14], giro: 12, nombre: 'Quiosco' });
OBJ.push({ forma: 'edificio', color: '#eceae4', pos: [0, 0, -30], nombre: 'Edificio del borde' });
OBJ.push({ forma: 'edificio', color: '#ddd8cd', pos: [26, 0, -32] });
OBJ.push({ forma: 'edificio', color: '#e4dfd4', pos: [-27, 0, -32] });


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
OBJ.push({ forma: 'acceso', color: '#b6afa3', pos: [XA - 11, 0.05, 26], giro: -90 });
[-1, 0.2, 1.4].forEach(function (d) {
  OBJ.push({ forma: 'torniquete', color: '#dcdfe2', pos: [XA - 8.4 + d, 0.05, 24], giro: 90 });
});
[[XA - 8, 20], [XA - 8, 14], [XA - 8, -2], [XA - 8, -8]].forEach(function (r) {
  OBJ.push({ forma: 'reja', color: '#2f6b45', pos: [r[0], 0.05, r[1]], giro: 90 });
});

// El tren detenido en el andén: se puede entrar
[7.9, -7.9].forEach(function (z) {
  OBJ.push({ forma: 'vagonAbierto', color: '#eef1f3', pos: [XV1, 0.05, z],
             piso: { ancho: 2.66, largo: 15.2, alto: 1.1, color: '#c9ced3' } });
});
OBJ.push({ forma: 'vagonAbierto', color: '#eef1f3', pos: [XV1, 0.05, 23.7],
           piso: { ancho: 2.66, largo: 15.2, alto: 1.1, color: '#c9ced3' },
           ficha: 'interior', altoFicha: 5 });

// El tren que pasa por la otra vía, sin detenerse
[16, 1.4, -13.2].forEach(function (z) {
  OBJ.push({ forma: 'vagon', color: '#eef1f3', pos: [XV2, 0.55, z], grupo: 'tren' });
});

/* ---- Más elementos de la plaza ---- */
OBJ.push({ forma: 'pileta', color: '#cdc6b6', pos: [0, 0.05, 18], nombre: 'Pileta', altoFicha: 3 });
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
  OBJ.push({ forma: 'arbolSombra', color: '#4c7038', pos: [q[0], 0.05, q[1]] });
});

/* ---- El anfitrión, junto a la entrada del paseo ---- */
OBJ.push({
  forma: 'persona', pos: [3.2, 0.05, 36], giro: 4,
  grupo: 'anfitrion', dialogo: 'anfitrion', altoFicha: 2.55,
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
  materia: 'Ciencias para la Ciudadanía · Ecología urbana',
  resumen: 'El paseo de palmas, el arbolado, el pasto y el borde construido. Isla de calor, sombra y superficies permeables.',
  cielo: '#a8cbe4',
  niebla: { color: '#c3d5e0', cerca: 70, lejos: 220 },
  luz: { cielo: '#e2f0f8', suelo: '#9a8f74', ambiente: 0.95, sol: '#fff6e0', intensidad: 0.85,
         posicion: '-14 26 10' },

  ancho: 104,
  anchoVida: 56,
  inicio: '0 1.7 42',

  vistas: {
    entrada: { etiqueta: 'Entrada del paseo',  pos: '0 1.7 42',  pitch: -2,  yaw: 0 },
    palmas:  { etiqueta: 'Bajo las palmas',    pos: '-11 1.7 20', pitch: 12, yaw: 25 },
    aerea:   { etiqueta: 'Vista aérea',        pos: '0 26 40',   pitch: -32, yaw: 0 },
    sombra:  { etiqueta: 'La zona de sombra',  pos: '14 1.7 0',  pitch: 4,   yaw: -60 },
    estacion:{ etiqueta: 'La estación',        pos: '30 1.7 26', pitch: 0,   yaw: 178 },
    anden:   { etiqueta: 'En el andén',        pos: '33.5 2.7 14', pitch: -3, yaw: 178 },
    vagon:   { etiqueta: 'Dentro del vagón',   pos: '39.5 2.8 4',  pitch: 0,  yaw: 180 }
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
        { forma: 'palmera', n: 22, color: '#5f8a4a', nombre: 'Palma canaria', hueco: 9 }
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
        { forma: 'arbolSombra', n: 26, color: '#4c7038', nombre: 'Árbol de sombra', hueco: 10 },
        { forma: 'arbolSombra', n: 14, color: '#5f7d42' },
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
    anfitrion: {
      nombre: 'Anfitrión de la plaza',
      inicio: 'saludo',
      nodos: {
        saludo: {
          texto: '¡Hola! Bienvenido a Villa Alemana. Estás parado en la plaza, que es el punto donde se cruzan el comercio, el transporte y la gente que viene a pasar la tarde. ¿Te muestro algo?',
          opciones: [
            { dice: '¿Dónde estoy exactamente?', va: 'ubicacion' },
            { dice: '¿Qué es ese tren?',          va: 'tren' },
            { dice: '¿Por qué hace tanto calor?', va: 'calor' },
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
