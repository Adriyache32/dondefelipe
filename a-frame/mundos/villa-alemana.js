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



// Tramo de escaleras con peldaños pisables (el motor los genera por 'escalones')
// Aquí va solo la baranda; los peldaños los pone el objeto con campo escalones.
MUNDO.forma('escaleraBaranda', function (H, color, b, ob) {
  var es = ob.escalones[0];
  var largoDiag = Math.sqrt(es.largo*es.largo + es.alto*es.alto);
  var ang = -Math.atan2(es.alto, es.largo) * 180 / Math.PI;
  [-es.ancho/2, es.ancho/2].forEach(function (x) {
    H.pieza('caja', color, 'metal', b, [x, es.alto/2 + 0.5, es.dz - es.largo/2],
      [ang, 0, 0], [0.08, 0.9, largoDiag], 0);
  });
}, 2);

// Sala de boletería subterránea: piso, paredes, cielo y luces
MUNDO.forma('boleteria', function (H, color, b, ob) {
  var A = (ob && ob.dim) ? ob.dim[0] : 10;
  var L = (ob && ob.dim) ? ob.dim[1] : 16;
  var ALTO = 3;
  var abierto = !!(ob && ob.abierto);   // extremos abiertos: pasaje peatonal
  var hu = (ob && ob.hueco) ? ob.hueco : null;  // {x, z, ancho, largo} en coords locales
  // paredes largas de baldosa
  [-1,1].forEach(function (sx) {
    H.pieza('caja', color, 'baldosa', b, [sx*A/2, ALTO/2, 0], [0,0,0], [0.3, ALTO, L], 0);
  });
  // testeras: solo si NO es pasaje abierto
  if (!abierto) [-1,1].forEach(function (sz) {
    H.pieza('caja', color, 'baldosa', b, [0, ALTO/2, sz*L/2], [0,0,0], [A, ALTO, 0.3], 0);
  });
  // cielo: entero, o en cuatro tramos si hay hueco de escalera
  if (!hu) {
    H.pieza('caja', '#e8ebe4', 'solido', b, [0, ALTO, 0], [0,0,0], [A, 0.2, L], 0);
  } else {
    var x0 = hu.x - hu.ancho/2, x1 = hu.x + hu.ancho/2;
    var z0 = hu.z - hu.largo/2, z1 = hu.z + hu.largo/2;
    var aS = x0 - (-A/2), aN = (A/2) - x1;      // franjas a los costados del hueco
    if (aS > 0.05) H.pieza('caja', '#e8ebe4', 'solido', b, [(-A/2 + x0)/2, ALTO, 0], [0,0,0], [aS, 0.2, L], 0);
    if (aN > 0.05) H.pieza('caja', '#e8ebe4', 'solido', b, [(x1 + A/2)/2, ALTO, 0], [0,0,0], [aN, 0.2, L], 0);
    var lW = z0 - (-L/2), lE = (L/2) - z1;      // franjas antes y después del hueco
    if (lW > 0.05) H.pieza('caja', '#e8ebe4', 'solido', b, [hu.x, ALTO, (-L/2 + z0)/2], [0,0,0], [hu.ancho, 0.2, lW], 0);
    if (lE > 0.05) H.pieza('caja', '#e8ebe4', 'solido', b, [hu.x, ALTO, (z1 + L/2)/2], [0,0,0], [hu.ancho, 0.2, lE], 0);
  }
  for (var i = 0; i < 4; i++)
    H.pieza('caja', '#fdfbf2', 'brillo', b, [0, ALTO-0.1, -L/2+2.5+i*4], [0,0,0], [1.6, 0.05, 0.6], 0);
  // módulo de boletería (caseta)
  H.pieza('caja', '#3a4750', 'solido', b, [-A/2+2, 1.1, 0], [0,0,0], [1.6, 2.2, 3], 0);
  H.pieza('caja', '#2b3540', 'vidrio', b, [-A/2+2.85, 1.4, 0], [0,0,0], [0.1, 1, 2.4], 0);
  H.pieza('caja', '#1f5f7a', 'brillo', b, [-A/2+2, 2.35, 0], [0,0,0], [1.4, 0.3, 0.05], 0);
}, 3.4);

// Tablero de viaducto: losa sin pilares (los pilares se colocan aparte, para
// poder saltarse la zona del paso peatonal)
MUNDO.forma('viaducto', function (H, color, b, ob) {
  var A = (ob && ob.dim) ? ob.dim[0] : 12;
  var L = (ob && ob.dim) ? ob.dim[1] : 30;
  H.pieza('caja', color, 'solido', b, [0, 0, 0], [0, 0, 0], [A, 0.4, L], 0);
  H.pieza('caja', '#8e8a80', 'solido', b, [0, -0.24, 0], [0, 0, 0], [A - 1.2, 0.12, L], 0);
}, 1);

// Pilar de hormigón del viaducto (baja hasta el suelo)
MUNDO.forma('pilarV', function (H, color, b, ob) {
  var h = (ob && ob.alto) ? ob.alto : 4;
  H.pieza('caja', color, 'solido', b, [0, -h/2, 0], [0, 0, 0], [0.7, h, 0.7], 0);
  H.pieza('caja', '#b8b2a6', 'solido', b, [0, -h + 0.2, 0], [0, 0, 0], [1.2, 0.4, 1.2], 0);
}, 1);

// Charco / lámina de agua en el piso (el humor de la inundación)
MUNDO.forma('agua', function (H, color, b, ob) {
  var A = (ob && ob.dim) ? ob.dim[0] : 6;
  var L = (ob && ob.dim) ? ob.dim[1] : 6;
  H.pieza('caja', '#4a7a8a', 'vidrio', b, [0, 0.06, 0], [0,0,0], [A, 0.06, L], 0);
  H.pieza('caja', '#6a9aa8', 'vidrio', b, [0, 0.09, 0], [0,0,0], [A*0.7, 0.02, L*0.7], 0);
}, 0.3);


/* ============================================================================
   COLOCACIONES
   Empezamos de nuevo: por ahora SOLO la estación con sus trenes.
   El resto de la plaza/ciudad se reconstruirá con orden desde aquí.
   Todas las formas siguen disponibles arriba para volver a usarlas.
   ============================================================================ */
var OBJ = [];

/* ---- Estación de Villa Alemana, al costado derecho de la plaza ---- */
var XA  = 34.5;   // eje del andén
var XV1 = 39.5;   // vía del andén (tren detenido, se puede subir)
var XV2 = 45.5;   // vía de paso (tren en movimiento)

/* ============================ DOS NIVELES ============================
   NIVEL 1 (suelo, y = 0): el paso peatonal con la boletería, que cruza
     TRANSVERSAL por debajo de la línea. Es el nivel de calle: se entra
     caminando por cualquiera de los dos extremos.
   NIVEL 2 (viaducto, y = YA): el andén, las dos vías y los trenes, sobre
     un tablero con pilares. Se sube por la escalera que nace en el paso.
   Así no hace falta perforar el terreno: el suelo natural ES el piso del
   nivel 1. Para subir o bajar todo el conjunto, basta cambiar YA.
   ==================================================================== */
var YA  = 4.6;              // altura del tablero del viaducto (nivel 2)
var YAND = YA + 1.0;        // superficie pisable del andén
var XDECK = 39.35;          // eje del tablero

// ---- Tablero del viaducto (tres bandas: deja libre el hueco de la escalera) ----
OBJ.push({ forma: 'viaducto', color: '#a9a49a', pos: [36.35, YA - 0.15, -23.5], dim: [12.3, 93] });
OBJ.push({ forma: 'viaducto', color: '#a9a49a', pos: [45.5,  YA - 0.15, -5],   dim: [6, 130] });
OBJ.push({ forma: 'viaducto', color: '#a9a49a', pos: [39.5,  YA - 0.15, 41.5], dim: [6, 37] });

// Pilares cada 13 m, salteando la franja del paso peatonal (z 19 a 33)
[31.5, 41, 47].forEach(function (px) {
  for (var pz = -66; pz <= 58; pz += 13) {
    if (pz > 19 && pz < 33) continue;
    OBJ.push({ forma: 'pilarV', color: '#b0aaa0', pos: [px, YA - 0.2, pz], alto: YA });
  }
});

// ---- NIVEL 2: las dos vías sobre el tablero ----
for (var v = 0; v < 22; v++) {
  var zv = 58 - v * 6;
  OBJ.push({ forma: 'rieles', color: '#8a8d90', pos: [XV1, YA + 0.05, zv] });
  OBJ.push({ forma: 'rieles', color: '#8a8d90', pos: [XV2, YA + 0.05, zv] });
}

// Catenaria: postes cada 12 m y los cables entre medio
for (var c = 0; c < 11; c++) {
  OBJ.push({ forma: 'catenaria', color: '#7c8288', pos: [49, YA + 0.05, 56 - c * 12] });
  OBJ.push({ forma: 'cable', color: '#8e9498', pos: [XV1, YA + 0.05, 50 - c * 12] });
  OBJ.push({ forma: 'cable', color: '#8e9498', pos: [XV2, YA + 0.05, 50 - c * 12] });
}

// Andén elevado: superficie pisable de verdad
OBJ.push({ forma: 'anden', color: '#c6bfae', pos: [XA, YA + 0.05, 6],
           piso: { ancho: 7, largo: 34, alto: 0.95, color: '#c6bfae' } });
OBJ.push({ forma: 'marquesina', color: '#5b6a74', pos: [XA, YA + 0.05, 6] });
OBJ.push({ forma: 'letrero', color: '#2f4f7d', pos: [XA - 3.4, YAND, 20],
           nombre: 'Estación Villa Alemana', ficha: 'estacion', altoFicha: 5.6 });
OBJ.push({ forma: 'letrero', color: '#2f4f7d', pos: [XA - 3.4, YAND, -8] });

// Baranda en el borde libre del andén (ahora está en altura)
OBJ.push({ forma: 'baranda', color: '#9aa3ab', pos: [31.3, YAND, 6], giro: 90, largo: 33 });

// Mobiliario del andén
[14, 8, 2, -4].forEach(function (z) {
  OBJ.push({ forma: 'banca', color: '#2f6b45', pos: [XA - 1.6, YAND, z], giro: 90 });
});
OBJ.push({ forma: 'basurero', color: '#2f6b45', pos: [XA - 1.6, YAND, 11] });
OBJ.push({ forma: 'basurero', color: '#2f6b45', pos: [XA - 1.6, YAND, -1] });

// Gente esperando en el andén
OBJ.push({ forma: 'persona', pos: [XA - 0.6, YAND, 5], giro: 90,
  cuerpo: { altura: 1.68, piel: '#b57a56', pelo: '#1e1814', chaqueta: '#2f4257',
            polera: '#c9d2d8', pantalon: '#22262c', zapato: '#17161a' } });
OBJ.push({ forma: 'persona', pos: [XA + 1.4, YAND, -6], giro: 88,
  cuerpo: { altura: 1.6, piel: '#d8a077', pelo: '#3a2a20', chaqueta: '#8a4a3c',
            polera: '#1b2430', pantalon: '#3d4450', zapato: '#201d1b' } });

/* ---- NIVEL 1: paso peatonal con boletería, transversal bajo la línea ----
   Está al nivel del suelo, con los dos extremos abiertos: se cruza de un lado
   a otro de la vía caminando. Y como siempre se inunda, hay agua en el piso. */
var SUB_CZ = 26;            // eje del paso (z)
var YSUB = 0;               // nivel 1 = suelo natural

// La sala cruza a lo largo del eje X (giro 90°), bajo el viaducto.
// 'hueco' abre el cielo donde sube la escalera (coords locales de la forma).
OBJ.push({ forma: 'boleteria', color: '#c9beac', pos: [XDECK, YSUB, SUB_CZ], giro: 90,
           dim: [11, 30], abierto: true,
           hueco: { x: 1.8, z: -4.85, ancho: 6.8, largo: 5 },
           ficha: 'boleteria', altoFicha: 3.4, nombre: 'Boletería',
           piso: { ancho: 30, largo: 11, alto: 0.15, color: '#b0a898' },
           choca: [
             { dx: -5.5, dz: 0, ancho: 0.4, largo: 30, alto: 3, base: 0 },
             { dx: 5.5, dz: 0, ancho: 0.4, largo: 30, alto: 3, base: 0 }
           ] });

// ESCALERA PRINCIPAL: nace en el paso, atraviesa el hueco del cielo y llega al andén
OBJ.push({ forma: 'escaleraBaranda', color: '#c4cace', pos: [XA, 0.15, 27.6], giro: 0,
           escalones: [{ dx: 0, dz: 3, ancho: 3.2, largo: 8,
                         alto: YAND - 0.15, base: 0, pasos: 20, color: '#d8c23a' }] });

// Torniquetes cruzando el paso, antes de la escalera
[-2, -0.4, 1.2].forEach(function (d) {
  OBJ.push({ forma: 'torniquete', color: '#dcdfe2', pos: [30, 0.15, SUB_CZ + d], giro: 90 });
});

// AGUA en el piso: la estación siempre se inunda
OBJ.push({ forma: 'agua', color: '#4a7a8a', pos: [37, 0.16, SUB_CZ - 2], dim: [8, 7],
           nombre: 'Siempre se inunda', ficha: 'agua', altoFicha: 1.5 });
OBJ.push({ forma: 'agua', color: '#4a7a8a', pos: [45, 0.16, SUB_CZ + 2], dim: [7, 6] });
OBJ.push({ forma: 'agua', color: '#4a7a8a', pos: [27, 0.16, SUB_CZ + 1], dim: [5, 5] });

// Gente en el paso
OBJ.push({ forma: 'persona', pos: [33, 0.15, SUB_CZ - 3], giro: 180,
  cuerpo: { altura: 1.66, piel: '#c88d6b', pelo: '#241b16', chaqueta: '#3f5d6b',
            polera: '#e8e2d4', pantalon: '#2b2f36', zapato: '#1a1917' } });
OBJ.push({ forma: 'persona', pos: [47, 0.15, SUB_CZ + 3], giro: 70,
  cuerpo: { altura: 1.62, piel: '#b57a56', pelo: '#1e1814', chaqueta: '#8a4a3c',
            polera: '#20242a', pantalon: '#3d4450', zapato: '#201d1b' } });

// Factores de escala del vagón: 15% más ancho (X), 40% más largo (Z).
// Se aplican a la cáscara (esc), a la colisión, al piso, a las puertas y a los
// pasajeros para que todo quede coherente.
var AW = 1.15, AL = 1.4;

// Paredes del carro: tres tramos por costado, con los vanos de puerta libres
var MUROS_VAGON = [];
[-1.42 * AW, 1.42 * AW].forEach(function (x) {
  [[-6.6, -4.4], [-2.6, 2.6], [4.4, 6.6]].forEach(function (t) {
    MUROS_VAGON.push({ dx: x, dz: ((t[0] + t[1]) / 2) * AL, ancho: 0.24,
                       largo: (t[1] - t[0]) * AL, base: 1, alto: 2.4 });
  });
});
[-7.8 * AL, 7.8 * AL].forEach(function (z) {
  MUROS_VAGON.push({ dx: 0, dz: z, ancho: 2.9 * AW, largo: 0.24, base: 1, alto: 2.4 });
});

// El tren detenido en el andén: se puede entrar, con puertas automáticas
var CARROS = [
  { id: 't1', z: 7.9 },
  { id: 't2', z: -7.9 },
  { id: 't3', z: 23.7, ficha: 'interior' }
];
CARROS.forEach(function (cr) {
  var o = { forma: 'vagonAbierto', id: cr.id, color: '#eef1f3', pos: [XV1, YA + 0.05, cr.z * AL],
            esc: [AW, 1, AL],
            piso: { ancho: 2.66 * AW, largo: 15.2 * AL, alto: 1.1, color: '#c9ced3' },
            choca: MUROS_VAGON };
  if (cr.ficha) { o.ficha = cr.ficha; o.altoFicha = 5; }
  OBJ.push(o);

  // registrar las puertas de ambos costados de este carro
  ['I', 'D'].forEach(function (lado) {
    MUNDO.puerta({
      hojas: [null, null], _lado: lado, _id: cr.id,
      x: XV1 + (lado === 'I' ? -1.42 : 1.42) * AW, z: cr.z * AL,
      radio: 3.2, abre: 0.82 * AL, eje: 'z'
    });
  });
});

// La cabina de control, al frente del primer carro
OBJ.push({ forma: 'cabina', color: '#eef1f3', pos: [XV1, YA + 0.05, 16.5 * AL],
           esc: [AW, 1, 1],
           piso: { ancho: 2.7 * AW, largo: 2.4, alto: 1.1, color: '#c9ced3' },
           ficha: 'cabina', altoFicha: 4.4 });
OBJ.push({ forma: 'persona', pos: [XV1, YA + 1.15, 15.9 * AL], giro: 0,
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
        OBJ.push({ forma: 'pasajeroSentado', pos: [XV1 + x * AW, YA + 1.1, (cr.z + z) * AL], giro: x < 0 ? 90 : -90,
          cuerpo: { altura: 1.68, piel: rnd(PIELES), pelo: rnd(PELOS),
                    chaqueta: rnd(ROPAS), polera: rnd(ROPAS), pantalon: '#2b2f36', zapato: '#1a1917' } });
      }
    });
  });
  // de pie: agarrados de la barra central
  var nDePie = 1 + Math.floor(Math.random() * 3);
  for (var k = 0; k < nDePie; k++) {
    var zx = (cr.z + (Math.random() * 8 - 4)) * AL;
    OBJ.push({ forma: 'persona', pos: [XV1 + (Math.random() > 0.5 ? 0.5 : -0.5) * AW, YA + 1.1, zx],
      giro: Math.random() * 360,
      cuerpo: { altura: 1.6 + Math.random() * 0.2, piel: rnd(PIELES), pelo: rnd(PELOS),
                chaqueta: rnd(ROPAS), polera: rnd(ROPAS), pantalon: '#2b2f36', zapato: '#1a1917',
                mochila: Math.random() > 0.6 } });
  }
});

/* ------------------------------------------------------------ ANIMACIONES */
MUNDO.animar(function (t) {
  var g = MUNDO.grupos['tren'];
  if (!g) return;
  var CICLO = 26;                      // segundos entre paso y paso
  var f = (t % CICLO) / CICLO;
  // cruza de largo por la vía exterior, sin detenerse
  g.position.z = (f < 0.42) ? 200 - (f / 0.42) * 400 : 220;
});

/* ------------------------------------------------------------------ MUNDO */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS['villa-alemana'] = {

  titulo: 'Villa Alemana: la estación',
  semilla: 33471,
  materia: 'Mundo urbano',
  resumen: 'La estación de Villa Alemana con sus trenes. Base para reconstruir la ciudad con orden.',

  clima: { inicial: 'despejado', real: true, auto: false, fallback: { lat: -33.04, lon: -71.37 } },

  sonido: {
    fuentes: [
      // zumbido de la estación / rieles
      { pos: [39, 5.6, 6], filtro: 'lowpass', freq: 280, q: 0.7, cat: 'ambiente', vol: 0.24, refDist: 6, maxDist: 36 }
    ]
  },

  cielo: '#a8c4d4',
  luz: { cielo: '#dce8ee', suelo: '#8a8270', ambiente: 0.9, sol: '#fff2d8', intensidad: 0.8, posicion: '-16 24 12' },

  ancho: 120,
  anchoVida: 56,
  inicio: '22 1.7 26',

  vistas: {
    paso:   { etiqueta: 'Paso bajo la línea', pos: '24 1.7 26',   pitch: 0,  yaw: 90 },
    anden:  { etiqueta: 'En el andén',        pos: '34.5 7.3 14', pitch: -3, yaw: 178 },
    vagon:  { etiqueta: 'Dentro del vagón',   pos: '39.5 7.4 4',  pitch: 0,  yaw: 180 },
    control:{ etiqueta: 'Sala de control',    pos: '22 1.7 6',    pitch: 0,  yaw: 90 }
  },

  objetos: OBJ,

  franjas: [
    {
      id: 'explanada', nombre: 'Explanada de la estación', rango: 'Punto de partida',
      z: [60, -30], y: 0, color: '#9a9282', superficie: 'baldosa',
      texto: 'La estación de Villa Alemana con sus dos vías: un tren detenido en el andén al que puedes subir, y otro que cruza sin parar. Desde aquí reconstruiremos la ciudad, esta vez con orden.',
      vida: ['Nivel 1: el paso peatonal con la boletería, bajo la línea', 'Nivel 2: el andén y las vías, sobre el viaducto', 'Sube por la escalera del paso y recorre el tren por dentro']
    }
  ],

  fichas: [
    {
      id: 'estacion', nombre: 'Estación de Villa Alemana', rango: 'Metro de Valparaíso',
      texto: 'La estación tiene dos vías: la del andén, donde el tren se detiene y suben los pasajeros, y la exterior, por donde pasan los trenes que no paran aquí. El servicio es hoy el Metro Regional de Valparaíso (Merval), heredero del ferrocarril que dio origen a la ciudad.',
      vida: ['Dos vías: una de andén y una de paso', 'Andén con acceso, torniquetes y sala de control', 'El tren detenido se puede recorrer por dentro'],
      reto: 'Cuenta cuánta gente cabe en un carro y estima cuántos autos reemplaza un tren lleno.'
    },
    {
      id: 'boleteria', nombre: 'Boletería subterránea', rango: 'Bajo el nivel de calle',
      texto: 'Esta estación tiene una particularidad: la boletería y los torniquetes no están a nivel de calle, sino en un subterráneo. Se baja por una escalera desde un lado, se pasa por los torniquetes, y se sube por otra escalera para salir por el lado opuesto. El paso subterráneo conecta ambos costados de la vía.',
      vida: ['Escalera de bajada desde el nivel de calle', 'Boletería y torniquetes en el subsuelo', 'Escalera de subida al otro lado para salir'],
      reto: 'Un paso bajo nivel conecta los dos lados de la vía sin cruzarla. ¿Qué ventajas de seguridad tiene frente a un cruce a nivel?'
    },
    {
      id: 'agua', nombre: 'La inundación de siempre', rango: 'Un clásico local',
      texto: 'El piso del subterráneo tiene agua acumulada. En Villa Alemana es casi una tradición: cada vez que llueve fuerte, la estación se inunda y el agua baja por las escaleras hasta la boletería. Un recordatorio, con humor, de que la infraestructura y el clima no siempre se llevan bien.',
      reto: 'El agua baja al punto más bajo por gravedad, y el subterráneo lo es. ¿Qué soluciones de drenaje o bombeo se te ocurren para una estación bajo el nivel de calle?'
    },
    {
      id: 'interior', nombre: 'Dentro del carro', rango: 'Sube y camina por el pasillo',
      texto: 'Los asientos van en pares a cada lado con un pasillo al centro, y hay barras y montantes junto a las puertas para quien viaja de pie. Cada centímetro está pensado para mover mucha gente en poco espacio.',
      vida: ['Un carro transporta del orden de cien a doscientas personas', 'Las puertas anchas y el piso a nivel del andén aceleran la subida', 'La superficie de calle que ocuparían esos pasajeros en auto es decenas de veces mayor'],
      reto: 'Cuenta los asientos de este carro y estima cuánta gente cabe de pie.'
    },
    {
      id: 'cabina', nombre: 'La cabina de control', rango: 'El puesto del conductor',
      texto: 'Desde aquí se conduce el tren: la palanca de tracción regula la velocidad, las pantallas muestran las señales de la vía y el parabrisas da la vista al frente.',
      reto: 'El conductor ve una señal amarilla, que significa "prepárate a detenerte en la próxima". ¿Por qué el sistema avisa con anticipación en vez de una roja de golpe?'
    },
    {
      id: 'control', nombre: 'La sala de control', rango: 'El cerebro del servicio',
      texto: 'Desde una sala como esta se regula la circulación: dónde está cada tren, qué señal está en rojo, qué andén está ocupado. Un sistema ferroviario no funciona por los trenes, funciona por la coordinación entre ellos.',
      reto: 'Si dos trenes van con diez minutos de retraso, ¿conviene apurar al primero o retener al segundo?'
    }
  ]
};
