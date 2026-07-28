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
MUNDO.forma('habitat', function (H, color, b, ob) {
  var R = 16;      // radio interior amplio
  var ALTO = 5;    // altura del muro
  var pref = (ob && ob.id) ? ob.id : 'base';

  // piso metálico
  H.pieza('cilindro', '#3f4348', 'metal', b, [0, 0.3, 0], [0,0,0], [R+1, 0.6, R+1], 0);
  H.pieza('cilindro', '#565b60', 'metal', b, [0, 0.62, 0], [0,0,0], [R, 0.08, R], 0);
  // líneas del piso (rejilla técnica)
  for (var k = 0; k < 6; k++) {
    H.pieza('caja', '#484d52', 'metal', b, [0, 0.67, -R + k*(2*R/6)], [0,0,0], [2*R, 0.02, 0.1], 0);
    H.pieza('caja', '#484d52', 'metal', b, [-R + k*(2*R/6), 0.67, 0], [0,0,0], [0.1, 0.02, 2*R], 0);
  }

  // MURO CILÍNDRICO OPACO: segmentos de caja alrededor, dejando un vano para la
  // puerta. Más segmentos y paneles más anchos (solape) = muro sin costuras.
  var seg = 40;
  var anchoPanel = 2*Math.PI*R/seg + 1.0;   // +1.0 de solape: sin huecos entre paneles
  for (var i = 0; i < seg; i++) {
    var a = i / seg * 6.2832;
    // hueco para la puerta: saltar los segmentos frontales (cerca de a=PI/2, +z)
    var ang = a;
    var frente = Math.abs(ang - Math.PI/2) < 0.18;   // vano ajustado al frente (+z)
    if (frente) continue;
    var x = Math.cos(a) * R, z = Math.sin(a) * R;
    H.pieza('caja', color, 'solido', b, [x, ALTO/2 + 0.6, z], [0, a*57.3 + 90, 0],
      [anchoPanel, ALTO, 0.4], 0);
    // franja de color inferior
    H.pieza('caja', '#3f5568', 'solido', b, [x, 1.1, z], [0, a*57.3 + 90, 0],
      [anchoPanel, 0.5, 0.42], 0);
    // ventanilla ocasional (opaca oscura, no atraviesa)
    if (i % 5 === 0) H.pieza('caja', '#243541', 'solido', b, [x, 3.4, z], [0, a*57.3 + 90, 0],
      [1.1, 1, 0.44], 0);
  }

  // TECHO HERMÉTICO: media esfera de DOBLE CARA (se ve desde dentro y desde
  // fuera; con 'solido' el techo desaparecía visto desde el interior, sobre
  // todo en el vacío sin niebla que lo disimulara).
  H.pieza('esfera', color, 'domo', b, [0, ALTO + 0.6, 0], [0,0,0], [R+0.4, R*0.6, R+0.4], 0);
  // anillo de unión muro-techo
  H.pieza('cilindro', '#6a7078', 'solido', b, [0, ALTO + 0.6, 0], [0,0,0], [R+0.45, 0.5, R+0.45], 0);
  // costillas estructurales sobre la cúpula (decorativas, por fuera)
  var gaj = 10;
  for (var g = 0; g < gaj; g++) {
    var ga = g / gaj * 6.2832;
    H.pieza('caja', '#565b60', 'metal', b, [Math.cos(ga)*R*0.5, ALTO + 1.6, Math.sin(ga)*R*0.5],
      [0, ga*57.3, 24], [0.3, 0.2, R+0.5], 0);
  }
  H.pieza('cilindro', '#6a7078', 'solido', b, [0, ALTO + 3.2, 0], [0,0,0], [R*0.3, 0.5, R*0.3], 0);

  // MARCO Y PUERTA al frente (+z), con dos hojas correderas
  var zPuerta = R;
  H.pieza('caja', '#8a9098', 'metal', b, [-2.2, ALTO/2, zPuerta], [0,0,0], [0.4, ALTO, 0.6], 0);
  H.pieza('caja', '#8a9098', 'metal', b, [2.2, ALTO/2, zPuerta], [0,0,0], [0.4, ALTO, 0.6], 0);
  H.pieza('caja', '#8a9098', 'metal', b, [0, ALTO - 0.3, zPuerta], [0,0,0], [4.8, 0.6, 0.6], 0);
  H.pieza('caja', '#c8443a', 'brillo', b, [0, ALTO - 0.3, zPuerta + 0.31], [0,0,0], [1.4, 0.3, 0.02], 0);
  // dos hojas (subgrupos posicionables por el motor)
  _hojaBase(H, b, [-1, ALTO/2 - 0.3, zPuerta], pref + '_pA', '#b8bcc0');
  _hojaBase(H, b, [1, ALTO/2 - 0.3, zPuerta], pref + '_pB', '#b8bcc0');

  // iluminación interior
  for (var li = 0; li < 4; li++) {
    var la = li / 4 * 6.2832;
    H.pieza('esferaB', '#fff6e0', 'brillo', b, [Math.cos(la)*R*0.6, ALTO, Math.sin(la)*R*0.6], [0,0,0], [0.4, 0.4, 0.4], 0);
  }
  H.pieza('esferaB', '#fff6e0', 'brillo', b, [0, ALTO + 1.6, 0], [0,0,0], [0.6, 0.6, 0.6], 0);
}, 6);

// Una hoja de puerta de la base (panel opaco), en subgrupo posicionable
function _hojaBase(H, b, off, grupo, color) {
  H.pieza('caja', color, 'metal', b, off, [0, 0, 0], [2, 4, 0.18], 0, grupo);
  H.pieza('caja', '#20262b', 'solido', b, [off[0], off[1]+0.4, off[2]], [0,0,0], [1.4, 1, 0.2], 0, grupo);
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

// Muros de colisión del hábitat: anillo de cilindros, con hueco para la puerta.
// (cilindros no necesitan rotación, así siguen la curva del muro sin huecos)
var MUROS_BASE = (function () {
  var R = 16, seg = 44, muros = [];
  for (var i = 0; i < seg; i++) {
    var a = i / seg * 6.2832;
    if (Math.abs(a - Math.PI/2) < 0.18) continue;   // hueco de la puerta (alineado con el muro visual)
    muros.push({ r: 1.3, dx: Math.cos(a) * R, dz: Math.sin(a) * R, alto: 5, base: 0 });
  }
  return muros;
})();

/* Recursos compartidos por TODAS las instancias de roca del generador: una sola
   geometría y un solo material para todos los sectores (se crean una vez). */
var GEO_ROCA = null, MAT_ROCA = null;
function _recursosRoca() {
  if (!GEO_ROCA) {
    GEO_ROCA = new THREE.DodecahedronGeometry(1);
    MAT_ROCA = new THREE.MeshStandardMaterial({ color: '#7d756c', roughness: 0.95, flatShading: true });
  }
}

window.MUNDOS.mercurio = {

  titulo: 'Mercurio · la superficie',
  materia: 'Física · Astronomía · Sistema Solar',
  resumen: 'El planeta más cercano al Sol. Gravedad real ajustable para sentir cómo saltaría un humano en Mercurio.',

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
      var nCrist = 3 + Math.floor(R()*4);
      for (var cc = 0; cc < nCrist; cc++) {
        var chx = cux + (R()-0.5)*12, chz = camz + (R()-0.5)*12;
        var crist = S.nuevo('a-entity', { position: chx + ' ' + (camY+0.6) + ' ' + chz,
          rotation: '0 ' + (R()*360) + ' ' + (R()*20-10) });
        crist.setAttribute('geometry', 'primitive:cone; radiusBottom:0.3; radiusTop:0; height:' + (1+R()*1.5));
        crist.setAttribute('material', 'color:#6ad0e0; shader:flat; emissive:#6ad0e0; emissiveIntensity:0.6; opacity:0.85; transparent:true');
        S.terreno.appendChild(crist);
        // roca rompible con más monedas en la cueva
        if (R() < 0.5) {
          var idc = 'cave' + S.gx + '_' + S.gz + '_' + cc;
          if (!MUNDO.rotos[idc]) {
            var rc = S.nuevo('a-entity', { position: chx + ' ' + (camY+0.6) + ' ' + (chz+1) });
            rc.setAttribute('geometry', 'primitive:dodecahedron; radius:1');
            rc.setAttribute('material', 'color:#4a4038; roughness:0.9; flatShading:true');
            S.terreno.appendChild(rc);
            MUNDO.rocaRompible({ id: idc, x: chx, z: chz+1, golpes: 4, monedas: 3 + Math.floor(R()*4), el: rc });
          }
        }
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
    { x: -24, z: 40, r: 4, factor: 0.3 },
    { x: 30, z: -34, r: 4.5, factor: 0.28 },
    { x: -50, z: -20, r: 4, factor: 0.32 }
  ],

  // PELIGROS de la superficie
  peligros: [
    { x: -8, z: 18, r: 2.2, dano: 100, causa: 'Caíste en una grieta sin fondo' },
    { x: 14, z: 8, r: 2, dano: 100, causa: 'Caíste en una grieta sin fondo' },
    { x: 6, z: -4, ancho: 3, largo: 3, dano: 18, causa: 'Pisaste metal a 400°C' },
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
      piso: { ancho: 32, largo: 32, alto: 0.66, color: '#565b60' },
      choca: MUROS_BASE },
    // grietas peligrosas (visuales, el daño lo dan las zonas de peligro)
    { forma: 'grieta', color: '#08070a', pos: [-8, 0.05, 18], radio: 2.2 },
    { forma: 'grieta', color: '#08070a', pos: [14, 0.05, 8], radio: 2 },
    // placas de metal recalentado
    { forma: 'placaMetal', color: '#7a4a3a', pos: [6, 0.05, -4], lado: 3 },
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
      id: 'base', nombre: 'Base Discovery', rango: 'Hábitat presurizado',
      texto: 'Un hábitat como este es la única forma de sobrevivir en Mercurio: una cúpula sellada que mantiene aire, presión y temperatura estables mientras afuera todo es vacío y radiación. Entra por la esclusa y usa la consola para experimentar con distintas atmósferas artificiales.',
      detalle: [
        'El botón "Atmósfera" cambia el aire de la cúpula. La atmósfera terrestre con ozono es la que respiramos y la que nos protege de la radiación solar. Las demás (rosada, morada, ámbar, verde) son experimentos: cada gas y cada partícula en suspensión daría al cielo un color distinto.',
        'Afuera no hay atmósfera: por eso el cielo es negro incluso de día, no hay sonido, y la temperatura salta de 430°C al Sol a 180 bajo cero en sombra. Dentro de la cúpula, en cambio, se puede vivir.'
      ],
      actividad: 'Entra a la base y prueba las distintas atmósferas. Observa cómo cambia el color del cielo y la luz con cada una.',
      pregunta: [
        '¿Por qué el color del cielo depende de la atmósfera? Piensa en por qué el cielo de la Tierra es azul.',
        '¿Qué hace especial a la atmósfera terrestre frente a las otras, para permitir la vida?'
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
      id: 'cultivo', nombre: 'Cultivo hidropónico', rango: 'Gadget del hábitat',
      texto: 'Plantas creciendo sin tierra, alimentadas por agua con nutrientes y luz artificial rosada. En una base espacial, un cultivo así da alimento, recicla dióxido de carbono y produce oxígeno: un pequeño ecosistema que ayuda a cerrar el ciclo de la vida a bordo.',
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
