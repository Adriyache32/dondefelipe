/* =============================================================================
   MUNDO: celula — el interior de una célula eucarionte, a escala recorrible.
   El recorrido sigue el dogma central como un viaje físico: se entra por la
   membrana, se cruza un poro nuclear, se ve el ADN replicarse y transcribirse,
   y se sale siguiendo al ARNm hasta el ribosoma donde se fabrica la proteína.
   ============================================================================= */
window.MUNDO = window.MUNDO || {};
if (!MUNDO.forma)  MUNDO.forma  = function () {};
if (!MUNDO.animar) MUNDO.animar = function () {};
if (!MUNDO.grupos) MUNDO.grupos = {};
window.MUNDOS = window.MUNDOS || {};

/* ============================ MEMBRANAS ============================ */

// Tramo de membrana plasmática: bicapa de fosfolípidos con sus proteínas.
MUNDO.forma('membrana', function (H, color, b, ob) {
  var L = (ob && ob.largo) ? ob.largo : 12, ALTO = 7;
  // las dos capas de cabezas polares
  H.pieza('caja', color, 'vidrio', b, [0, ALTO/2, -0.7], [0,0,0], [L, ALTO, 0.5], 0);
  H.pieza('caja', color, 'vidrio', b, [0, ALTO/2,  0.7], [0,0,0], [L, ALTO, 0.5], 0);
  // colas hidrofóbicas entre ambas
  for (var i = 0; i < Math.floor(L/1.1); i++) {
    var x = -L/2 + 0.55 + i*1.1;
    for (var k = 0; k < 5; k++) {
      var y = 0.8 + k*1.4;
      H.pieza('esfera', '#e8c96a', 'solido', b, [x, y, -0.7], [0,0,0], [0.3,0.3,0.3], 0);
      H.pieza('esfera', '#e8c96a', 'solido', b, [x, y,  0.7], [0,0,0], [0.3,0.3,0.3], 0);
      H.pieza('caja', '#c9a94a', 'solido', b, [x, y, 0], [0,0,0], [0.12, 0.12, 1.2], 0);
    }
  }
}, 8);

// Proteína de membrana: canal que deja pasar sustancias
MUNDO.forma('canal', function (H, color, b) {
  for (var i = 0; i < 6; i++) {
    var a = i/6*6.2832;
    H.pieza('cilindro', color, 'solido', b, [Math.cos(a)*0.8, 2.2, Math.sin(a)*0.8],
      [0,0,0], [0.45, 4.4, 0.45], 0);
  }
  H.pieza('toro', '#7ac4d8', 'brillo', b, [0, 4.3, 0], [90,0,0], [1.1, 1.1, 1.1], 0.1);
}, 4.6);

// Envoltura nuclear: tramo de la doble membrana, con su poro
MUNDO.forma('envoltura', function (H, color, b, ob) {
  var L = (ob && ob.largo) ? ob.largo : 8, ALTO = 11;
  H.pieza('caja', color, 'domo', b, [0, ALTO/2, -0.9], [0,0,0], [L, ALTO, 0.6], 0);
  H.pieza('caja', color, 'domo', b, [0, ALTO/2,  0.9], [0,0,0], [L, ALTO, 0.6], 0);
  // ribosomas adheridos a la cara externa (la envoltura es RE rugoso continuo)
  for (var i = 0; i < 4; i++)
    H.pieza('esfera', '#8a5a9a', 'solido', b, [-L/2 + 1.5 + i*(L/4), 2 + (i%3)*2.6, 1.5],
      [0,0,0], [0.5, 0.42, 0.5], 0);
}, 11.5);

// Poro nuclear: el portón por donde sale el ARNm
MUNDO.forma('poro', function (H, color, b) {
  H.pieza('toro', color, 'metal', b, [0, 3.2, 0], [90,0,0], [3.4, 3.4, 3.4], 0);
  H.pieza('toro', color, 'metal', b, [0, 3.2, -1.2], [90,0,0], [2.8, 2.8, 2.8], 0);
  H.pieza('toro', color, 'metal', b, [0, 3.2,  1.2], [90,0,0], [2.8, 2.8, 2.8], 0);
  for (var i = 0; i < 8; i++) {
    var a = i/8*6.2832;
    H.pieza('caja', '#9ad8e8', 'brillo', b, [Math.cos(a)*2.4, 3.2, Math.sin(a)*2.4],
      [0, a*57.3, 0], [0.35, 1.6, 0.35], 0.08);
  }
}, 6);

/* ============================ ADN Y NÚCLEO ============================ */

// DOBLE HÉLICE de ADN: dos hebras antiparalelas y los pares de bases.
// Es la pieza central del mundo, así que va con detalle: A-T en un color,
// C-G en otro, para que se pueda contar y comparar.
MUNDO.forma('adn', function (H, color, b, ob) {
  var alt = (ob && ob.alto) ? ob.alto : 14;
  var r = (ob && ob.radio) ? ob.radio : 1.6;
  var pasos = Math.floor(alt * 2.2);
  var vuelta = (ob && ob.vuelta) ? ob.vuelta : 10;   // pares por vuelta
  for (var i = 0; i < pasos; i++) {
    var f = i / pasos, y = f * alt;
    var a = i / vuelta * 6.2832;
    var x1 = Math.cos(a) * r, z1 = Math.sin(a) * r;
    var x2 = Math.cos(a + Math.PI) * r, z2 = Math.sin(a + Math.PI) * r;
    // esqueleto de azúcar-fosfato: las dos hebras
    H.pieza('esfera', color, 'solido', b, [x1, y, z1], [0,0,0], [0.42,0.42,0.42], 0);
    H.pieza('esfera', '#d87a5a', 'solido', b, [x2, y, z2], [0,0,0], [0.42,0.42,0.42], 0);
    // par de bases: dos mitades que se tocan al centro
    var at = (i % 2 === 0);
    var c1 = at ? '#6ac4a8' : '#e8c96a', c2 = at ? '#4a9a86' : '#c9a94a';
    H.pieza('caja', c1, 'solido', b, [x1*0.5, y, z1*0.5], [0, -a*57.3, 0], [r*0.95, 0.2, 0.22], 0);
    H.pieza('caja', c2, 'solido', b, [x2*0.5, y, z2*0.5], [0, -a*57.3, 0], [r*0.95, 0.2, 0.22], 0);
  }
}, 15);

// Nucleosoma: el ADN enrollado en histonas (primer nivel de compactación)
MUNDO.forma('nucleosoma', function (H, color, b) {
  H.pieza('cilindro', color, 'solido', b, [0, 0.9, 0], [0,0,0], [1.1, 1, 1.1], 0);
  for (var i = 0; i < 12; i++) {
    var a = i/12*6.2832;
    H.pieza('esfera', '#5a8ad8', 'solido', b, [Math.cos(a)*1.25, 0.6 + (i%2)*0.7, Math.sin(a)*1.25],
      [0,0,0], [0.28,0.28,0.28], 0);
  }
}, 2);

// Cromosoma condensado: la forma en X de la metafase, con su centrómero
MUNDO.forma('cromosoma', function (H, color, b, ob) {
  var alt = (ob && ob.alto) ? ob.alto : 9;
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(function (q) {
    H.pieza('cilindro', color, 'solido', b,
      [q[0]*alt*0.16, alt*0.5 + q[1]*alt*0.26, 0],
      [0, 0, q[0]*q[1]*14], [alt*0.09, alt*0.52, alt*0.09], 0);
  });
  H.pieza('esfera', '#e8e2d0', 'solido', b, [0, alt*0.5, 0], [0,0,0],
    [alt*0.12, alt*0.1, alt*0.12], 0);
}, 10);

// Cromatina laxa: el estado en que el ADN sí se puede leer
MUNDO.forma('cromatina', function (H, color, b) {
  var n = 16, x = 0, y = 1, z = 0;
  for (var i = 0; i < n; i++) {
    x += (Math.random()-0.5)*2.6; y += Math.random()*0.9; z += (Math.random()-0.5)*2.6;
    H.pieza('esfera', color, 'solido', b, [x, y, z], [0,0,0], [0.55,0.5,0.55], 0);
    H.pieza('esfera', '#9ab4e8', 'solido', b, [x*0.94, y-0.3, z*0.94], [0,0,0], [0.22,0.22,0.22], 0);
  }
}, 6);

// HORQUILLA DE REPLICACIÓN: la hebra madre se abre y se copian las dos hijas
MUNDO.forma('horquilla', function (H, color, b) {
  // hebra madre, todavía cerrada
  for (var i = 0; i < 14; i++) {
    var a = i/9*6.2832, y = i*0.55;
    H.pieza('esfera', color, 'solido', b, [Math.cos(a)*1.4, y, Math.sin(a)*1.4 - 7], [0,0,0], [0.4,0.4,0.4], 0);
    H.pieza('esfera', '#d87a5a', 'solido', b, [Math.cos(a+3.14)*1.4, y, Math.sin(a+3.14)*1.4 - 7], [0,0,0], [0.4,0.4,0.4], 0);
    H.pieza('caja', '#6ac4a8', 'solido', b, [0, y, -7], [0, -a*57.3, 0], [2.6, 0.18, 0.2], 0);
  }
  // helicasa: la enzima que separa las hebras
  H.pieza('cono', '#e86a4a', 'brillo', b, [0, 4, -0.4], [-90,0,0], [2.2, 3, 2.2], 0.1);
  // las dos hebras hijas, ya separadas y abriéndose en Y
  [-1, 1].forEach(function (s) {
    for (var j = 0; j < 12; j++) {
      var yy = 1 + j*0.62, off = 1.2 + j*0.42;
      H.pieza('esfera', color, 'solido', b, [s*off, yy, 3 + j*0.5], [0,0,0], [0.38,0.38,0.38], 0);
      H.pieza('esfera', '#8ad8c4', 'solido', b, [s*(off-0.9), yy, 3 + j*0.5], [0,0,0], [0.3,0.3,0.3], 0);
    }
    // ADN polimerasa avanzando por cada hebra
    H.pieza('esfera', '#4a7ad8', 'brillo', b, [s*3.4, 5.4, 7.5], [0,0,0], [1.5, 1.3, 1.5], 0.1);
  });
}, 10);

// TRANSCRIPCIÓN: la ARN polimerasa lee el ADN y va soltando el ARNm
MUNDO.forma('transcripcion', function (H, color, b) {
  // molde de ADN, horizontal
  for (var i = 0; i < 22; i++) {
    var a = i/9*6.2832, z = -11 + i;
    H.pieza('esfera', color, 'solido', b, [Math.cos(a)*1.3, 3 + Math.sin(a)*1.3, z], [0,0,0], [0.36,0.36,0.36], 0);
    H.pieza('esfera', '#d87a5a', 'solido', b, [Math.cos(a+3.14)*1.3, 3 + Math.sin(a+3.14)*1.3, z], [0,0,0], [0.36,0.36,0.36], 0);
  }
  // la enzima, como una abrazadera sobre el molde
  H.pieza('esfera', '#7a4ad8', 'brillo', b, [0, 3.2, 1], [0,0,0], [2.8, 2.6, 2.8], 0.12);
  H.pieza('toro', '#9a7ae8', 'metal', b, [0, 3.2, 1], [0,90,0], [3.2, 3.2, 3.2], 0);
  // ARNm recién sintetizado, saliendo en hebra simple
  for (var j = 0; j < 16; j++)
    H.pieza('esfera', '#e8a63a', 'brillo', b,
      [Math.sin(j*0.7)*1.6, 3.4 + j*0.42, 2.4 + j*0.7], [0,0,0], [0.34,0.34,0.34], 0.08);
}, 9);

// Nucleolo: la fábrica de ribosomas dentro del núcleo
MUNDO.forma('nucleolo', function (H, color, b, ob) {
  var R = (ob && ob.radio) ? ob.radio : 5;
  H.pieza('esfera', color, 'solido', b, [0, R, 0], [0,0,0], [R, R*0.92, R], 0);
  for (var i = 0; i < 26; i++) {
    var a = Math.random()*6.2832, e = Math.random()*3.14;
    H.pieza('esfera', '#c98a5a', 'solido', b,
      [Math.sin(e)*Math.cos(a)*R*0.9, R + Math.cos(e)*R*0.85, Math.sin(e)*Math.sin(a)*R*0.9],
      [0,0,0], [0.7,0.7,0.7], 0);
  }
}, 11);

// ARNm suelto, viajando por el citoplasma
MUNDO.forma('arnm', function (H, color, b, ob) {
  var n = (ob && ob.largo) ? ob.largo : 14;
  for (var i = 0; i < n; i++)
    H.pieza('esfera', color, 'brillo', b,
      [Math.sin(i*0.6)*1.2, 1 + Math.cos(i*0.4)*0.5, i*0.8], [0,0,0], [0.32,0.32,0.32], 0.07);
}, 3);

/* ============================ ORGANELOS ============================ */

// Ribosoma: subunidad mayor y menor, con el ARNm pasando entre ambas
MUNDO.forma('ribosoma', function (H, color, b, ob) {
  var e = (ob && ob.esc) ? ob.esc : 1;
  H.pieza('esfera', color, 'solido', b, [0, 1.7*e, 0], [0,0,0], [2*e, 1.5*e, 2*e], 0);
  H.pieza('esfera', '#a87ac8', 'solido', b, [0, 3.1*e, 0], [0,0,0], [1.4*e, 1*e, 1.4*e], 0);
  H.pieza('caja', '#e8a63a', 'brillo', b, [0, 2.5*e, 0], [0,0,0], [5*e, 0.2*e, 0.3*e], 0.06);
}, 4);

// Retículo endoplásmico RUGOSO: cisternas apiladas cubiertas de ribosomas
MUNDO.forma('rer', function (H, color, b, ob) {
  var n = (ob && ob.capas) ? ob.capas : 5, L = (ob && ob.largo) ? ob.largo : 20;
  for (var i = 0; i < n; i++) {
    var y = 1.5 + i*2.6;
    H.pieza('caja', color, 'domo', b, [0, y, Math.sin(i*1.1)*2], [0, Math.sin(i)*8, 0], [L, 0.7, 7], 0);
    for (var k = 0; k < 12; k++) {
      var px = -L/2 + 1 + k*(L/12), pz = Math.sin(i*1.1)*2;
      H.pieza('esfera', '#8a5a9a', 'solido', b, [px, y + 0.6, pz + 3.2], [0,0,0], [0.55,0.5,0.55], 0);
      H.pieza('esfera', '#8a5a9a', 'solido', b, [px, y + 0.6, pz - 3.2], [0,0,0], [0.55,0.5,0.55], 0);
    }
  }
}, 16);

// Retículo endoplásmico LISO: túbulos ramificados, sin ribosomas
MUNDO.forma('rel', function (H, color, b) {
  for (var i = 0; i < 14; i++) {
    var a = i/14*6.2832, r = 5 + Math.sin(i*2)*2.5;
    H.pieza('cilindro', color, 'domo', b,
      [Math.cos(a)*r, 2 + Math.sin(i*1.6)*1.8, Math.sin(a)*r],
      [Math.sin(i)*40, a*57.3, 62], [1.5, 7, 1.5], 0);
  }
}, 8);

// Aparato de Golgi: cisternas apiladas y curvas, con vesículas saliendo
MUNDO.forma('golgi', function (H, color, b) {
  for (var i = 0; i < 6; i++) {
    var w = 16 - i*1.6;
    H.pieza('caja', color, 'domo', b, [0, 2 + i*2.2, 0], [0, 0, 0], [w, 0.8, 8 - i*0.5], 0);
    H.pieza('cilindro', color, 'domo', b, [-w/2, 2 + i*2.2, 0], [90,0,0], [1.2, 7.5 - i*0.5, 1.2], 0);
    H.pieza('cilindro', color, 'domo', b, [ w/2, 2 + i*2.2, 0], [90,0,0], [1.2, 7.5 - i*0.5, 1.2], 0);
  }
  // vesículas de secreción desprendiéndose
  for (var v = 0; v < 7; v++)
    H.pieza('esfera', '#e8b45a', 'brillo', b,
      [8 + v*1.6, 3 + v*1.5, Math.sin(v)*3], [0,0,0], [1.1,1.1,1.1], 0.05);
}, 16);

// Mitocondria: doble membrana y crestas. Se puede entrar (acabado domo).
MUNDO.forma('mitocondria', function (H, color, b, ob) {
  var L = (ob && ob.largo) ? ob.largo : 22, R = (ob && ob.radio) ? ob.radio : 6;
  H.pieza('cilindro', color, 'domo', b, [0, R, 0], [90,0,0], [R, L, R], 0);
  H.pieza('esfera', color, 'domo', b, [0, R, -L/2], [0,0,0], [R, R, R], 0);
  H.pieza('esfera', color, 'domo', b, [0, R,  L/2], [0,0,0], [R, R, R], 0);
  // crestas: los pliegues donde ocurre la cadena respiratoria
  for (var i = 0; i < 11; i++) {
    var z = -L/2 + 2 + i*(L-4)/10;
    H.pieza('caja', '#c96a4a', 'domo', b, [0, R, z], [0, 0, (i%2 ? 16 : -16)], [R*1.5, 0.5, R*1.2], 0);
  }
  // su propio ADN, circular: la herencia bacteriana
  H.pieza('toro', '#6ac4a8', 'brillo', b, [0, R*0.8, 0], [0, 0, 70], [2, 2, 2], 0.08);
}, 13);

// Lisosoma: vesícula con enzimas digestivas
MUNDO.forma('lisosoma', function (H, color, b, ob) {
  var R = (ob && ob.radio) ? ob.radio : 3.5;
  H.pieza('esfera', color, 'domo', b, [0, R, 0], [0,0,0], [R, R, R], 0);
  for (var i = 0; i < 10; i++) {
    var a = Math.random()*6.2832, e = Math.random()*3.14;
    H.pieza('cono', '#e8e2a0', 'brillo', b,
      [Math.sin(e)*Math.cos(a)*R*0.5, R + Math.cos(e)*R*0.5, Math.sin(e)*Math.sin(a)*R*0.5],
      [Math.random()*180, Math.random()*360, 0], [0.5, 0.9, 0.5], 0.08);
  }
}, 8);

// Peroxisoma: más pequeño, con su cristal de catalasa
MUNDO.forma('peroxisoma', function (H, color, b) {
  H.pieza('esfera', color, 'domo', b, [0, 2.4, 0], [0,0,0], [2.4, 2.4, 2.4], 0);
  H.pieza('caja', '#e8e2c0', 'solido', b, [0, 2.4, 0], [24, 32, 12], [1.8, 1.8, 1.8], 0);
}, 5.2);

// Vesícula de transporte
MUNDO.forma('vesicula', function (H, color, b) {
  var r = 0.9 + Math.random()*0.7;
  H.pieza('esfera', color, 'vidrio', b, [0, r, 0], [0,0,0], [r, r, r], 0.05);
}, 2.4);

// Centríolo: los nueve tripletes de microtúbulos
MUNDO.forma('centriolo', function (H, color, b) {
  for (var i = 0; i < 9; i++) {
    var a = i/9*6.2832;
    for (var k = 0; k < 3; k++) {
      var r = 2.2 + k*0.42;
      H.pieza('cilindro', color, 'metal', b,
        [Math.cos(a + k*0.1)*r, 3, Math.sin(a + k*0.1)*r], [0,0,0], [0.34, 6, 0.34], 0);
    }
  }
}, 7);

// Filamento del citoesqueleto: la estructura que sostiene y transporta
MUNDO.forma('filamento', function (H, color, b, ob) {
  var alt = (ob && ob.alto) ? ob.alto : 12;
  H.pieza('cilindro', color, 'metal', b, [0, alt/2, 0], [0,0,0], [0.3, alt, 0.3], 0.05);
  for (var i = 0; i < Math.floor(alt/1.5); i++)
    H.pieza('esfera', color, 'metal', b, [0, 0.7 + i*1.5, 0], [0,0,0], [0.45,0.45,0.45], 0.05);
}, 13);

// Citosol: gránulos sueltos que dan textura al medio
MUNDO.forma('granulo', function (H, color, b) {
  H.pieza('esfera', color, 'brillo', b, [0, 0.4, 0], [0,0,0], [0.35,0.35,0.35], 0.1);
}, 0.9);

/* ============================================================================
   EL MUNDO
   ============================================================================ */
window.MUNDOS.celula = {

  titulo: 'Dentro de una célula eucarionte',
  materia: 'Biología · 1° Medio y Ciencias para la Ciudadanía',
  resumen: 'Un recorrido a escala por el interior de una célula. Se entra por la membrana, se cruza un poro nuclear y se ve el ADN replicarse y transcribirse; después se sigue al ARNm hasta el ribosoma donde se fabrica la proteína.',

  semilla: 40218,
  cielo: '#1b2a3a',
  niebla: { color: '#24405a', cerca: 40, lejos: 240 },
  luz: { cielo: '#9ad4e8', suelo: '#3a5a70', ambiente: 0.95, sol: '#dcf0ff', intensidad: 0.55,
         posicion: '-20 40 20' },

  ancho: 230,
  anchoVida: 190,
  inicio: '0 1.7 104',
  cotaMuerte: -30,

  vistas: {
    entrada: { etiqueta: 'La membrana',        pos: '0 1.7 104',  pitch: 0,  yaw: 0 },
    citosol: { etiqueta: 'El citoplasma',      pos: '0 1.7 62',   pitch: 0,  yaw: 0 },
    poro:    { etiqueta: 'El poro nuclear',    pos: '0 1.7 34',   pitch: 4,  yaw: 0 },
    adn:     { etiqueta: 'El ADN',             pos: '0 1.7 8',    pitch: 6,  yaw: 0 },
    replica: { etiqueta: 'Replicación',        pos: '-14 1.7 4',  pitch: 6,  yaw: 60 },
    transcri:{ etiqueta: 'Transcripción',      pos: '14 1.7 4',   pitch: 6,  yaw: -60 },
    ribosoma:{ etiqueta: 'Traducción',         pos: '-6 1.7 -46', pitch: 2,  yaw: 180 },
    golgi:   { etiqueta: 'Golgi y secreción',  pos: '24 1.7 -70', pitch: 2,  yaw: 200 },
    mito:    { etiqueta: 'Mitocondria',        pos: '-40 1.7 -66', pitch: 2, yaw: 120 }
  },

  /* La luz cambia entre compartimentos: el núcleo es más tenue y azulado,
     la mitocondria más cálida. Se percibe al cruzar cada membrana. */
  luzZonas: [
    { x: 0, z: 8, r: 26, ambiente: 0.65, intensidad: 0.3, borde: 8 },
    { x: -40, z: -66, r: 14, ambiente: 1.15, intensidad: 0.85, borde: 6 }
  ],

  luces: [
    { pos: [0, 12, 8],    color: '#9ab4e8', intensidad: 0.8, alcance: 40 },
    { pos: [-14, 8, 4],   color: '#7ac4e8', intensidad: 0.7, alcance: 20 },
    { pos: [14, 8, 4],    color: '#c89ae8', intensidad: 0.7, alcance: 20 },
    { pos: [-40, 8, -66], color: '#ffb46a', intensidad: 1.0, alcance: 26 },
    { pos: [24, 10, -70], color: '#ffd89a', intensidad: 0.7, alcance: 24 }
  ],

  franjas: [
    {
      id: 'membrana', nombre: 'Membrana plasmática', rango: 'El límite de la célula',
      z: [118, 84], y: 0, color: '#2e4a5e', superficie: 'tierra',
      texto: 'Estás afuera, frente a la frontera de la célula. La membrana no es una pared: es una bicapa de fosfolípidos, flexible y selectiva, con proteínas incrustadas que dejan pasar unas cosas y otras no. Todo lo que la célula usa y todo lo que desecha cruza por aquí.',
      vida: ['Bicapa de fosfolípidos: cabezas al agua, colas hacia adentro', 'Proteínas de canal y de transporte', 'Selectivamente permeable: decide qué entra y qué sale'],
      reto: 'La membrana deja pasar el oxígeno sin gastar energía, pero necesita bombas para meter potasio. ¿Qué diferencia hay entre esas dos sustancias que explica el trato distinto?',
      especies: [
        { forma: 'granulo', n: 120, color: '#5a8ab4', nombre: 'Medio extracelular' },
        { forma: 'vesicula', n: 20, color: '#7ab4d8', nombre: 'Vesícula' }
      ]
    },
    {
      id: 'citoplasma', nombre: 'Citoplasma y citoesqueleto', rango: 'El medio interno',
      z: [84, 40], y: 0, color: '#33566e', superficie: 'tierra',
      texto: 'Ya estás dentro. El citoplasma no es un caldo quieto: está atravesado por el citoesqueleto, una red de filamentos que da forma a la célula, la sostiene y funciona además como sistema de rieles por donde las vesículas se desplazan de un organelo a otro.',
      vida: ['Citosol: agua, sales, enzimas y metabolitos', 'Microtúbulos y filamentos que dan forma y sostén', 'Rieles de transporte para las vesículas', 'Ribosomas libres fabricando proteínas de uso interno'],
      reto: 'Si el citoesqueleto se desarmara, ¿qué le pasaría a la forma de la célula y al transporte interno? Nombra dos consecuencias distintas.',
      especies: [
        { forma: 'filamento', n: 40, color: '#6a8ea8', nombre: 'Filamento del citoesqueleto', choca: { r: 0.3, alto: 12 } },
        { forma: 'ribosoma', n: 26, color: '#8a5a9a', nombre: 'Ribosoma libre' },
        { forma: 'granulo', n: 160, color: '#4a7a9a', nombre: 'Citosol' },
        { forma: 'vesicula', n: 24, color: '#7ab4d8', nombre: 'Vesícula de transporte' }
      ]
    },
    {
      id: 'nucleo', nombre: 'El núcleo', rango: 'Donde se guarda y se lee el ADN',
      z: [40, -22], y: 0, color: '#3a4a6e', superficie: 'tierra',
      texto: 'Este es el centro de control. El núcleo guarda casi todo el ADN de la célula, separado del citoplasma por una doble membrana. Esa separación es la marca de las células eucariontes y no es un detalle menor: permite que la lectura del ADN y la fabricación de proteínas ocurran en lugares y momentos distintos, y por lo tanto que se puedan regular por separado.',
      vida: ['Doble membrana con poros que controlan el tránsito', 'Cromatina: el ADN enrollado en histonas', 'Nucleolo: la fábrica de ribosomas', 'Aquí ocurren la replicación y la transcripción'],
      reto: 'Las bacterias no tienen núcleo y su ADN está suelto en el citoplasma. ¿Qué ventaja le da a una célula eucarionte tener el ADN encerrado y separado?',
      especies: [
        { forma: 'nucleosoma', n: 40, color: '#7a9ad8', nombre: 'Nucleosoma' },
        { forma: 'granulo', n: 90, color: '#6a7ab4', nombre: 'Nucleoplasma' }
      ]
    },
    {
      id: 'sintesis', nombre: 'Retículo y ribosomas', rango: 'Donde se fabrican las proteínas',
      z: [-22, -58], y: 0, color: '#3e5a64', superficie: 'tierra',
      texto: 'El ARNm que salió del núcleo llega hasta aquí. En los ribosomas se traduce su mensaje a una cadena de aminoácidos: la proteína. Los ribosomas pegados al retículo rugoso fabrican proteínas destinadas a salir de la célula o a integrarse en membranas; los libres, las de uso interno.',
      vida: ['Retículo rugoso: cubierto de ribosomas', 'Retículo liso: fabrica lípidos y desintoxica', 'Los ribosomas leen el ARNm de tres en tres bases'],
      reto: 'Una proteína que la célula va a exportar y otra que usará en su citosol se fabrican en lugares distintos. ¿Por qué le conviene a la célula esa separación?',
      especies: [
        { forma: 'ribosoma', n: 34, color: '#8a5a9a', nombre: 'Ribosoma' },
        { forma: 'arnm', n: 16, color: '#e8a63a', nombre: 'ARN mensajero' },
        { forma: 'granulo', n: 120, color: '#4a7a8a', nombre: 'Citosol' },
        { forma: 'vesicula', n: 20, color: '#8ac4d8', nombre: 'Vesícula' }
      ]
    },
    {
      id: 'destino', nombre: 'Golgi, energía y reciclaje', rango: 'Procesar, exportar, degradar',
      z: [-58, -100], y: 0, color: '#4a5a58', superficie: 'tierra',
      texto: 'Última zona del recorrido. El Golgi recibe las proteínas del retículo, las termina y las empaqueta en vesículas con destino. Las mitocondrias producen la energía que todo esto consume. Y los lisosomas degradan lo que ya no sirve, para reutilizar sus piezas.',
      vida: ['Golgi: modifica, clasifica y despacha', 'Mitocondrias: respiración celular y ATP', 'Lisosomas: digestión y reciclaje', 'Peroxisomas: neutralizan compuestos tóxicos'],
      reto: 'Ordena estos cuatro organelos según el camino de una proteína de exportación: ribosoma, Golgi, membrana, retículo rugoso.',
      especies: [
        { forma: 'vesicula', n: 34, color: '#e8b45a', nombre: 'Vesícula de secreción' },
        { forma: 'peroxisoma', n: 10, color: '#8ac4a8', nombre: 'Peroxisoma' },
        { forma: 'granulo', n: 130, color: '#5a7a70', nombre: 'Citosol' }
      ]
    }
  ],

  objetos: [
    /* ---------- MEMBRANA PLASMÁTICA: el muro de entrada, con su portón ---------- */
    { forma: 'membrana', color: '#7ab4d8', pos: [-30, 0, 92], largo: 44,
      choca: [{ dx: 0, dz: 0, ancho: 44, largo: 2.4, base: 0, alto: 7 }] },
    { forma: 'membrana', color: '#7ab4d8', pos: [30, 0, 92], largo: 44,
      choca: [{ dx: 0, dz: 0, ancho: 44, largo: 2.4, base: 0, alto: 7 }] },
    { forma: 'canal', color: '#4a9ac4', pos: [0, 0, 92],
      nombre: 'Proteína de canal', ficha: 'membrana', altoFicha: 6.5 },
    { forma: 'canal', color: '#4a9ac4', pos: [-14, 0, 92] },
    { forma: 'canal', color: '#4a9ac4', pos: [16, 0, 92] },

    /* ---------- CITOESQUELETO ---------- */
    { forma: 'centriolo', color: '#8aa4c4', pos: [-26, 0, 56],
      nombre: 'Centríolos', ficha: 'centriolo', altoFicha: 8,
      choca: [{ r: 3, alto: 6 }] },
    { forma: 'centriolo', color: '#8aa4c4', pos: [-22, 0, 56], giro: 90 },
    { forma: 'filamento', color: '#7a9ab4', pos: [22, 0, 58], alto: 22,
      nombre: 'Citoesqueleto', ficha: 'citoesqueleto', altoFicha: 12,
      choca: [{ r: 0.4, alto: 22 }] },

    /* ---------- ENVOLTURA NUCLEAR: anillo con un poro transitable ---------- */
    { forma: 'envoltura', color: '#6a8ad8', pos: [-26, 0, 38], largo: 34,
      choca: [{ dx: 0, dz: 0, ancho: 34, largo: 2.6, base: 0, alto: 11 }] },
    { forma: 'envoltura', color: '#6a8ad8', pos: [26, 0, 38], largo: 34,
      choca: [{ dx: 0, dz: 0, ancho: 34, largo: 2.6, base: 0, alto: 11 }] },
    { forma: 'poro', color: '#9ab4e8', pos: [0, 0, 38],
      nombre: 'Poro nuclear', ficha: 'poro', altoFicha: 8 },

    /* ---------- DENTRO DEL NÚCLEO: el ADN y sus procesos ---------- */
    { forma: 'adn', color: '#7ac4e8', pos: [0, 0, 8], alto: 26, radio: 3.2, vuelta: 12,
      nombre: 'ADN · doble hélice', ficha: 'adn', altoFicha: 29,
      choca: [{ r: 3.6, alto: 26 }] },
    { forma: 'nucleolo', color: '#c4926a', pos: [0, 0, -14], radio: 6,
      nombre: 'Nucleolo', ficha: 'nucleolo', altoFicha: 14,
      choca: [{ r: 6, alto: 12 }] },
    { forma: 'horquilla', color: '#7ac4e8', pos: [-16, 0, 6], giro: 24,
      nombre: 'Replicación del ADN', ficha: 'replicacion', altoFicha: 11 },
    { forma: 'transcripcion', color: '#7ac4e8', pos: [16, 0, 6], giro: -24,
      nombre: 'Transcripción', ficha: 'transcripcion', altoFicha: 11 },
    { forma: 'cromosoma', color: '#5a8ad8', pos: [-14, 0, -12], alto: 11,
      nombre: 'Cromosoma condensado', ficha: 'cromosoma', altoFicha: 12,
      choca: [{ r: 1.6, alto: 11 }] },
    { forma: 'cromosoma', color: '#5a8ad8', pos: [-9, 0, -16], alto: 9, giro: 40 },
    { forma: 'cromatina', color: '#7a9ad8', pos: [14, 0, -12],
      nombre: 'Cromatina', ficha: 'cromatina', altoFicha: 9 },
    { forma: 'nucleosoma', color: '#5a8ad8', pos: [10, 0, -8],
      nombre: 'Nucleosoma', ficha: 'nucleosoma', altoFicha: 3.4 },

    /* ---------- SÍNTESIS DE PROTEÍNAS ---------- */
    { forma: 'arnm', color: '#e8a63a', pos: [0, 0, 30], largo: 20,
      nombre: 'ARNm saliendo del núcleo', ficha: 'arnm', altoFicha: 4 },
    { forma: 'rer', color: '#8ab4c4', pos: [-6, 0, -46], capas: 5, largo: 34,
      nombre: 'Retículo endoplásmico rugoso', ficha: 'rer', altoFicha: 17,
      choca: [{ dx: 0, dz: 0, ancho: 34, largo: 8, base: 0, alto: 14 }] },
    { forma: 'ribosoma', color: '#8a5a9a', pos: [12, 0, -36], esc: 2.4,
      nombre: 'Ribosoma · traducción', ficha: 'traduccion', altoFicha: 10,
      choca: [{ r: 3, alto: 8 }] },
    { forma: 'rel', color: '#8ac4b4', pos: [26, 0, -48],
      nombre: 'Retículo endoplásmico liso', ficha: 'rel', altoFicha: 10,
      choca: [{ r: 7, alto: 8 }] },

    /* ---------- DESTINO Y ENERGÍA ---------- */
    { forma: 'golgi', color: '#c4a46a', pos: [24, 0, -70],
      nombre: 'Aparato de Golgi', ficha: 'golgi', altoFicha: 17,
      choca: [{ dx: 0, dz: 0, ancho: 17, largo: 9, base: 0, alto: 15 }] },
    { forma: 'mitocondria', color: '#e8845a', pos: [-40, 0, -66], giro: 30, largo: 26, radio: 7,
      nombre: 'Mitocondria', ficha: 'mitocondria', altoFicha: 16 },
    { forma: 'mitocondria', color: '#e8845a', pos: [-52, 0, -84], giro: -20, largo: 18, radio: 5 },
    { forma: 'lisosoma', color: '#b47ac4', pos: [4, 0, -78], radio: 4.5,
      nombre: 'Lisosoma', ficha: 'lisosoma', altoFicha: 11,
      choca: [{ r: 4.5, alto: 9 }] },
    { forma: 'peroxisoma', color: '#8ac4a8', pos: [-14, 0, -84],
      nombre: 'Peroxisoma', ficha: 'peroxisoma', altoFicha: 6 }
  ],

  fichas: [
    /* ================= ADN Y SUS PROCESOS (el eje del mundo) ================= */
    {
      id: 'adn', nombre: 'El ADN', rango: 'La molécula que guarda la información',
      texto: 'Tienes delante la doble hélice. Dos hebras enrolladas una sobre otra, unidas por pares de bases: la adenina siempre frente a la timina, la citosina siempre frente a la guanina. Esa correspondencia fija —la complementariedad— es la clave de todo: significa que cada hebra contiene la información necesaria para reconstruir la otra. El ADN no es solo un archivo, es un archivo que trae incorporado su propio respaldo.',
      vida: ['Dos hebras antiparalelas, enrolladas en doble hélice', 'A se aparea con T; C se aparea con G', 'El orden de las bases es la información', 'Cada hebra permite reconstruir la contraria'],
      reto: 'Si una hebra dice ATTGCAT, escribe la hebra complementaria. Después explica por qué ese emparejamiento fijo hace posible que el ADN se copie con tan pocos errores.',
      actividad: 'Recorre la hélice y cuenta cuántos pares de bases hay en una vuelta completa. Dibuja un tramo indicando las dos hebras, el esqueleto de azúcar-fosfato y tres pares de bases.'
    },
    {
      id: 'replicacion', nombre: 'Replicación del ADN', rango: 'Cómo se copia la información',
      texto: 'Aquí el ADN se está duplicando. La helicasa —el cono rojo— separa las dos hebras como un cierre que se abre, y sobre cada hebra suelta trabaja una ADN polimerasa que va colocando la base complementaria que corresponde. El resultado son dos moléculas idénticas, y cada una conserva una hebra de la original: por eso se dice que la replicación es semiconservativa. Ocurre antes de cada división celular, porque cada célula hija necesita el juego completo.',
      vida: ['La helicasa abre la doble hélice', 'La ADN polimerasa copia usando cada hebra como molde', 'Semiconservativa: cada copia conserva una hebra original', 'Ocurre antes de la división celular'],
      reto: 'Si la replicación no fuera semiconservativa y se fabricaran dos moléculas totalmente nuevas, ¿qué se perdería? Piensa en cómo se detectan y corrigen los errores.',
      actividad: 'Sigue la horquilla desde donde las hebras están unidas hasta donde ya están separadas. Dibuja el proceso marcando la helicasa, las dos hebras molde y las dos polimerasas.'
    },
    {
      id: 'transcripcion', nombre: 'Transcripción', rango: 'Del ADN al ARN mensajero',
      texto: 'La ARN polimerasa —la abrazadera morada— recorre el ADN y va copiando un gen a una molécula de ARN mensajero. No copia el cromosoma entero: copia solo el tramo que hace falta en ese momento. El ARNm es de una sola hebra, es más corto y no se queda: sale del núcleo por un poro. La diferencia clave con el ADN es que el ARN usa uracilo donde el ADN usa timina.',
      vida: ['La ARN polimerasa lee una sola hebra del ADN', 'Se copia un gen, no el cromosoma completo', 'El ARNm es de hebra simple y sale del núcleo', 'En el ARN, el uracilo (U) reemplaza a la timina (T)'],
      reto: 'Todas tus células tienen el mismo ADN, pero una neurona y una célula de la piel son muy distintas. ¿Cómo lo explica la transcripción? Tu respuesta debe usar la idea de que no todos los genes se transcriben.',
      actividad: 'Si el molde de ADN dice TACGGATCC, escribe el ARNm que se produce. Cuidado con la base que cambia.'
    },
    {
      id: 'traduccion', nombre: 'Traducción', rango: 'Del ARN a la proteína',
      texto: 'El ribosoma es la máquina que lee el ARNm y arma la proteína. Avanza por la hebra de tres en tres bases: cada triplete, llamado codón, indica un aminoácido determinado. Un ARN de transferencia trae ese aminoácido y lo suma a la cadena que crece. Cuando el ribosoma llega a un codón de término, suelta la proteína terminada. Con esto se cierra el recorrido: ADN → ARN → proteína.',
      vida: ['El ribosoma lee el ARNm en tripletes llamados codones', 'Cada codón especifica un aminoácido', 'El ARN de transferencia acarrea los aminoácidos', 'Un codón de término marca el final de la proteína'],
      reto: 'El código genético tiene 64 codones posibles para solo 20 aminoácidos. ¿Qué implica que varios codones distintos signifiquen lo mismo? Relaciónalo con los errores de copia.',
      actividad: 'Cuenta cuántas bases necesitas para codificar una proteína de 100 aminoácidos. Después súmale los tres del codón de término.'
    },
    {
      id: 'cromatina', nombre: 'Cromatina', rango: 'Cómo cabe tanto ADN en tan poco espacio',
      texto: 'Si estiraras todo el ADN de una sola célula tuya, mediría alrededor de dos metros. El núcleo mide unas milésimas de milímetro. La solución es el enrollamiento por niveles: el ADN se enrolla en proteínas llamadas histonas formando nucleosomas, esos nucleosomas se apilan, y así sucesivamente. Pero hay un costo: el ADN muy compactado no se puede leer. Por eso la célula mantiene laxas las zonas de los genes que está usando.',
      vida: ['Unos dos metros de ADN dentro de cada núcleo', 'El ADN se enrolla en histonas formando nucleosomas', 'Compactado no se puede transcribir', 'Las zonas activas se mantienen laxas'],
      reto: 'La compactación resuelve un problema de espacio pero crea uno de acceso. Explica cómo la célula puede resolver los dos a la vez.',
      actividad: 'Compara la cromatina laxa con el cromosoma condensado que está cerca. Dibuja ambos y anota en qué momento de la vida celular aparece cada uno.'
    },
    {
      id: 'nucleosoma', nombre: 'Nucleosoma', rango: 'El primer nivel de enrollamiento',
      texto: 'Un nucleosoma es un tramo de ADN dando algo menos de dos vueltas alrededor de un grupo de ocho histonas. Es la unidad básica del empaquetamiento, y se repite millones de veces a lo largo del cromosoma. Vista al microscopio, la cromatina parece un collar de cuentas: cada cuenta es un nucleosoma y el hilo entre ellas es el ADN que las conecta.',
      vida: ['ADN enrollado sobre ocho histonas', 'Aspecto de collar de cuentas', 'Es el primer nivel de compactación'],
      reto: 'Las histonas tienen carga positiva y el ADN carga negativa. ¿Cómo ayuda eso a que se mantengan unidos?'
    },
    {
      id: 'cromosoma', nombre: 'Cromosoma', rango: 'El ADN en su forma más compacta',
      texto: 'Un cromosoma es el ADN llevado a su máxima compactación. Solo se ve así cuando la célula se va a dividir: en ese momento el material tiene que moverse y repartirse, y compactarlo evita que se enrede o se rompa. La forma de X aparece porque el ADN ya se replicó y las dos copias siguen unidas por el centrómero, esperando separarse hacia cada célula hija. Las células humanas tienen 46 cromosomas.',
      vida: ['Máxima compactación del ADN', 'Solo aparece durante la división celular', 'La X son dos copias unidas por el centrómero', 'La especie humana tiene 46 cromosomas'],
      reto: 'El cromosoma tiene forma de X porque el ADN ya se copió. ¿Qué proceso tuvo que ocurrir antes para que se vea así, y qué pasará inmediatamente después?',
      actividad: 'Dibuja la secuencia: cromatina laxa, ADN replicado, cromosoma en X, separación. Anota qué gana la célula al compactar antes de repartir.'
    },
    {
      id: 'nucleolo', nombre: 'Nucleolo', rango: 'La fábrica de ribosomas',
      texto: 'El nucleolo no es un organelo con membrana: es una región densa del núcleo donde se transcribe el ARN ribosómico y se ensamblan las subunidades de los ribosomas, que después salen por los poros. Su tamaño delata la actividad de la célula: las células que fabrican muchas proteínas tienen nucleolos grandes y bien visibles.',
      vida: ['No tiene membrana propia', 'Aquí se fabrican las subunidades de los ribosomas', 'Salen del núcleo por los poros', 'Un nucleolo grande indica mucha síntesis de proteínas'],
      reto: 'Observas dos células al microscopio: una tiene el nucleolo enorme y la otra apenas se le ve. ¿Qué puedes deducir sobre lo que hace cada una?'
    },
    {
      id: 'poro', nombre: 'El poro nuclear', rango: 'La aduana del núcleo',
      texto: 'Estás cruzando la doble membrana que separa el núcleo del citoplasma. El poro no es un agujero libre: es una estructura de proteínas que controla el tránsito en ambos sentidos. Deja salir el ARNm y las subunidades de los ribosomas, y deja entrar las proteínas que el núcleo necesita, como las polimerasas y las histonas. El ADN, en cambio, nunca sale.',
      vida: ['Estructura proteica que controla el paso', 'Salen el ARNm y las subunidades ribosómicas', 'Entran las polimerasas y las histonas', 'El ADN nunca abandona el núcleo'],
      reto: '¿Por qué le conviene a la célula que el ADN nunca salga del núcleo, y que en cambio salga una copia en ARN? Piensa en el riesgo de dañar el original.',
      actividad: 'Cruza el poro en los dos sentidos. Anota tres cosas que salen y dos que entran, y explica en cada caso por qué.'
    },
    {
      id: 'arnm', nombre: 'El ARN mensajero', rango: 'La copia de trabajo',
      texto: 'Este es el ARNm que acaba de salir del núcleo. Es una copia temporal de un gen, escrita en una sola hebra. Cumple exactamente la función de un mensaje: lleva la instrucción desde donde está guardada hasta donde se ejecuta, y después se degrada. Esa vida corta es una forma de control: la célula puede dejar de producir una proteína simplemente dejando de transcribir su gen.',
      vida: ['Hebra simple, copia temporal de un gen', 'Viaja del núcleo al ribosoma', 'Se degrada después de usarse', 'Su corta vida permite regular la producción'],
      reto: 'Si el ARNm fuera permanente en lugar de degradarse, ¿qué perdería la célula? Relaciónalo con la capacidad de responder a los cambios.'
    },

    /* ================= ORGANELOS ================= */
    {
      id: 'membrana', nombre: 'La membrana plasmática', rango: 'La frontera selectiva',
      texto: 'La membrana está formada por una bicapa de fosfolípidos: cada molécula tiene una cabeza que se lleva bien con el agua y dos colas que la rehúyen. Puestas en agua se ordenan solas, con las colas hacia adentro. Entre ellas flotan proteínas que funcionan como canales, bombas y receptores. La membrana no aísla: filtra, y decide qué entra y qué sale.',
      vida: ['Bicapa de fosfolípidos, que se ordena sola en agua', 'Proteínas de canal, bombas y receptores', 'Permeabilidad selectiva', 'También recibe señales del exterior'],
      reto: 'El agua y el oxígeno cruzan solos; la glucosa y los iones necesitan proteínas. ¿Qué característica de las colas de los fosfolípidos explica esa diferencia?',
      actividad: 'Dibuja un tramo de membrana con sus dos capas y ubica tres proteínas distintas, explicando qué hace cada una.'
    },
    {
      id: 'citoesqueleto', nombre: 'El citoesqueleto', rango: 'Esqueleto y carretera a la vez',
      texto: 'La red de filamentos que atraviesa el citoplasma cumple dos funciones que solemos separar: da forma y sostén a la célula, como un esqueleto, y sirve de vía por donde se desplazan las vesículas y los organelos, como una red de caminos. Además es lo que permite que algunas células cambien de forma y se muevan.',
      vida: ['Microtúbulos, microfilamentos y filamentos intermedios', 'Dan forma y sostén', 'Rieles para el transporte interno', 'Permiten el movimiento y la división celular'],
      reto: 'El citoesqueleto se arma y desarma constantemente. ¿Qué ventaja tiene esa inestabilidad frente a una estructura rígida y permanente?'
    },
    {
      id: 'centriolo', nombre: 'Los centríolos', rango: 'Organizadores de la división',
      texto: 'Los centríolos son dos cilindros perpendiculares formados por nueve tripletes de microtúbulos. Durante la división celular organizan el huso, la estructura de fibras que tira de los cromosomas y los reparte entre las dos células hijas. Si el reparto falla, las células hijas quedan con un número equivocado de cromosomas.',
      vida: ['Nueve tripletes de microtúbulos', 'Se disponen en ángulo recto entre sí', 'Organizan el huso durante la división'],
      reto: 'Si el huso no se formara bien, ¿qué le pasaría a los cromosomas al dividirse la célula? Nombra una consecuencia concreta.'
    },
    {
      id: 'rer', nombre: 'Retículo endoplásmico rugoso', rango: 'Donde se fabrica para exportar',
      texto: 'Es una red de sacos membranosos continuos con la envoltura nuclear, y está cubierto de ribosomas: de ahí el aspecto rugoso. Las proteínas que se sintetizan aquí entran directamente al interior de los sacos y quedan separadas del citosol desde el primer momento. Son las que van a exportarse, integrarse en membranas o trabajar dentro de otros organelos.',
      vida: ['Continuo con la envoltura nuclear', 'Cubierto de ribosomas', 'Fabrica proteínas de exportación y de membrana', 'Las proteínas quedan separadas del citosol desde el inicio'],
      reto: 'Las proteínas del retículo rugoso quedan encerradas apenas se fabrican. ¿Qué ventaja tiene eso para una proteína destinada a salir de la célula?',
      actividad: 'Sigue el camino de una proteína desde este retículo hasta el Golgi. Dibuja las etapas y marca dónde viaja dentro de una vesícula.'
    },
    {
      id: 'rel', nombre: 'Retículo endoplásmico liso', rango: 'Lípidos y desintoxicación',
      texto: 'Sin ribosomas, este retículo hace un trabajo distinto: fabrica lípidos y hormonas esteroidales, almacena calcio y neutraliza sustancias tóxicas. Está especialmente desarrollado en las células del hígado, que es el órgano encargado de procesar medicamentos y alcohol.',
      vida: ['Sin ribosomas: túbulos lisos', 'Fabrica lípidos y hormonas esteroidales', 'Almacena calcio', 'Desintoxica: muy desarrollado en el hígado'],
      reto: 'En personas que consumen alcohol de forma sostenida, el retículo liso del hígado aumenta de tamaño. ¿Qué te dice eso sobre cómo responde una célula a lo que se le exige?'
    },
    {
      id: 'golgi', nombre: 'El aparato de Golgi', rango: 'Terminar, clasificar y despachar',
      texto: 'El Golgi recibe las vesículas del retículo y trabaja como una línea de terminaciones: modifica las proteínas, les agrega azúcares, las clasifica según su destino y las empaqueta en vesículas nuevas con la etiqueta correcta. De un lado entra lo que viene del retículo; del otro salen las vesículas hacia la membrana, hacia los lisosomas o hacia el exterior.',
      vida: ['Cisternas apiladas con dos caras distintas', 'Modifica y agrega azúcares a las proteínas', 'Clasifica según destino', 'Despacha en vesículas etiquetadas'],
      reto: 'Si el Golgi etiquetara mal una enzima digestiva y en vez de mandarla al lisosoma la enviara al citosol, ¿qué ocurriría?',
      actividad: 'Dibuja el Golgi con sus dos caras y tres vesículas saliendo hacia destinos distintos. Rotula cada destino.'
    },
    {
      id: 'mitocondria', nombre: 'La mitocondria', rango: 'Energía y un pasado propio',
      texto: 'Aquí se produce la mayor parte del ATP de la célula. Tiene dos membranas, y la interna se pliega en crestas que multiplican la superficie disponible para la cadena respiratoria: más superficie, más producción. Pero lo más notable es otra cosa: la mitocondria tiene su propio ADN, circular como el de las bacterias, y se divide por su cuenta. La explicación aceptada es que desciende de una bacteria que fue incorporada por otra célula y se quedó a vivir dentro. Es la teoría endosimbiótica.',
      vida: ['Dos membranas; la interna forma crestas', 'Produce la mayor parte del ATP', 'Tiene ADN propio, circular como el bacteriano', 'Se divide por sí misma', 'Teoría endosimbiótica: desciende de una bacteria'],
      reto: 'La mitocondria tiene ADN circular, se divide sola y tiene dos membranas. Explica cómo esos tres hechos apoyan la idea de que alguna vez fue un organismo independiente.',
      actividad: 'Busca su ADN circular dentro de la mitocondria y compáralo con el ADN del núcleo que viste antes. Anota tres diferencias.'
    },
    {
      id: 'lisosoma', nombre: 'El lisosoma', rango: 'Digestión y reciclaje',
      texto: 'El lisosoma es una vesícula cargada de enzimas digestivas capaces de romper casi cualquier molécula. Degrada lo que la célula incorpora y también sus propios organelos gastados, devolviendo las piezas al citosol para volver a usarlas. Que esas enzimas estén encerradas no es un detalle: sueltas en el citosol destruirían la célula.',
      vida: ['Vesícula llena de enzimas digestivas', 'Degrada material externo y organelos gastados', 'Recicla las piezas para reutilizarlas', 'El encierro de las enzimas protege a la célula'],
      reto: 'Las enzimas del lisosoma funcionan mejor en medio ácido, más ácido que el citosol. ¿Cómo funciona eso como una segunda protección, además de la membrana?'
    },
    {
      id: 'peroxisoma', nombre: 'El peroxisoma', rango: 'Neutralizar lo tóxico',
      texto: 'Los peroxisomas realizan reacciones que generan peróxido de hidrógeno, una sustancia que daña a la célula. Por eso contienen catalasa, una enzima que lo descompone inmediatamente en agua y oxígeno. Es un ejemplo claro de cómo la célula resuelve un problema encerrando junto al residuo peligroso el mecanismo que lo neutraliza.',
      vida: ['Degradan ácidos grasos y compuestos tóxicos', 'Producen peróxido de hidrógeno como residuo', 'La catalasa lo transforma en agua y oxígeno'],
      reto: 'La célula fabrica una sustancia peligrosa y guarda en el mismo compartimento la enzima que la destruye. ¿Por qué es mejor eso que evitar producirla?'
    }
  ]
};
