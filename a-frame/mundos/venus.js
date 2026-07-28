/* =============================================================================
   MUNDO: venus — superficie, atmósfera y geología del planeta invernadero
   Versión basal para pruebas con MUNDO.js v28.
   ============================================================================= */

window.MUNDO = window.MUNDO || {};
if (!MUNDO.forma)  MUNDO.forma  = function () {};
if (!MUNDO.animar) MUNDO.animar = function () {};
if (!MUNDO.grupos) MUNDO.grupos = {};

window.MUNDOS = window.MUNDOS || {};


/* ============================================================================
   FORMAS PROPIAS DE VENUS
   ============================================================================ */


/* ---------------------------------------------------------------------------
   ROCA VOLCÁNICA
   --------------------------------------------------------------------------- */

MUNDO.forma('venusRoca', function (H, color, b) {

  var t = H.azar(0.35, 1.4);

  H.pieza(
    'esferaB',
    color,
    'solido',
    b,
    [0, t * 0.35, 0],
    [
      H.azar(0, 35),
      H.azar(0, 360),
      H.azar(0, 35)
    ],
    [
      t,
      t * H.azar(0.45, 0.75),
      t * H.azar(0.7, 1.25)
    ],
    0
  );

}, 1.6);


/* ---------------------------------------------------------------------------
   VOLCÁN EN ESCUDO
   Venus posee enormes estructuras volcánicas.
   --------------------------------------------------------------------------- */

MUNDO.forma('venusVolcan', function (H, color, b, ob) {

  var r = (ob && ob.radio) ? ob.radio : H.azar(6, 11);
  var h = (ob && ob.alto) ? ob.alto : r * 0.28;

  // Edificio volcánico
  H.pieza(
    'cono',
    color,
    'solido',
    b,
    [0, h / 2, 0],
    [0, 0, 0],
    [r, h, r],
    0
  );

  // Cráter superior
  H.pieza(
    'cilindro',
    '#4a2518',
    'solido',
    b,
    [0, h + 0.02, 0],
    [0, 0, 0],
    [r * 0.16, 0.10, r * 0.16],
    0
  );

}, 5);


/* ---------------------------------------------------------------------------
   DOMO PANCAKE
   Domos volcánicos anchos y relativamente planos.
   --------------------------------------------------------------------------- */

MUNDO.forma('venusDomo', function (H, color, b, ob) {

  var r = (ob && ob.radio) ? ob.radio : H.azar(2.5, 4.5);

  H.pieza(
    'cilindro',
    color,
    'solido',
    b,
    [0, 0.45, 0],
    [0, 0, 0],
    [r, 0.9, r],
    0
  );

  H.pieza(
    'esferaB',
    '#9b5530',
    'solido',
    b,
    [0, 0.85, 0],
    [0, 0, 0],
    [r * 0.82, 0.32, r * 0.82],
    0
  );

}, 2);


/* ---------------------------------------------------------------------------
   TESSERA
   Terreno deformado característico de Venus.
   --------------------------------------------------------------------------- */

MUNDO.forma('venusTessera', function (H, color, b) {

  var n = 6;

  for (var i = 0; i < n; i++) {

    H.pieza(
      'caja',
      color,
      'solido',
      b,
      [
        H.azar(-3, 3),
        H.azar(0.25, 0.65),
        H.azar(-3, 3)
      ],
      [
        H.azar(-10, 10),
        H.azar(0, 180),
        H.azar(-8, 8)
      ],
      [
        H.azar(2.5, 5),
        H.azar(0.4, 1.2),
        H.azar(0.5, 1.1)
      ],
      0
    );

  }

}, 3);


/* ---------------------------------------------------------------------------
   CRÁTER
   --------------------------------------------------------------------------- */

MUNDO.forma('venusCrater', function (H, color, b, ob) {

  var r = (ob && ob.radio) ? ob.radio : H.azar(2, 4);
  var n = 14;

  for (var i = 0; i < n; i++) {

    var a = i / n * 6.2832;

    H.pieza(
      'esferaB',
      color,
      'solido',
      b,
      [
        Math.cos(a) * r,
        0.22,
        Math.sin(a) * r
      ],
      [
        0,
        a * 57.3,
        H.azar(-10, 10)
      ],
      [
        r * 0.28,
        0.45,
        r * 0.28
      ],
      0
    );

  }

  H.pieza(
    'circulo',
    '#6d3522',
    'lamina',
    b,
    [0, 0.03, 0],
    [-90, 0, 0],
    [r * 0.82, r * 0.82, 1],
    0
  );

}, 2);


/* ---------------------------------------------------------------------------
   SONDA VENERA
   Representación simplificada.
   --------------------------------------------------------------------------- */

MUNDO.forma('venera', function (H, color, b) {

  // Cuerpo
  H.pieza(
    'cilindro',
    color,
    'metal',
    b,
    [0, 0.55, 0],
    [0, 0, 0],
    [0.85, 1.1, 0.85],
    0
  );

  // Parte superior
  H.pieza(
    'esferaB',
    '#c8b38a',
    'metal',
    b,
    [0, 1.25, 0],
    [0, 0, 0],
    [0.65, 0.45, 0.65],
    0
  );

  // Base
  H.pieza(
    'cilindro',
    '#51453b',
    'metal',
    b,
    [0, 0.08, 0],
    [0, 0, 0],
    [1.2, 0.16, 1.2],
    0
  );

  // Antena
  H.pieza(
    'poste',
    '#d6c49b',
    'metal',
    b,
    [0, 1.35, 0],
    [0, 0, 0],
    [0.05, 0.7, 0.05],
    0
  );

}, 2.4);


/* ---------------------------------------------------------------------------
   ESTACIÓN / HITO CIENTÍFICO
   --------------------------------------------------------------------------- */

MUNDO.forma('venusHito', function (H, color, b) {

  H.pieza(
    'poste',
    '#4b4038',
    'metal',
    b,
    [0, 0, 0],
    [0, 0, 0],
    [0.08, 3, 0.08],
    0
  );

  H.pieza(
    'caja',
    color,
    'solido',
    b,
    [0.65, 2.55, 0],
    [0, 0, 0],
    [1.35, 0.75, 0.08],
    0
  );

}, 3.4);


/* ============================================================================
   CONFIGURACIÓN DEL MUNDO
   ============================================================================ */



/* ---------------------------------------------------------------------------
   BASE AURELIA — el gran habitáculo presurizado
   Inspirada en el "Hab" de The Martian: cúpula grande, esclusa, túnel e
   invernadero. Pero en Venus no puede ser una carpa inflable: a 92 bar y 460 °C
   el casco tiene que ser un recipiente a presión con nervaduras, como un
   batiscafo. Esa diferencia es justamente el contenido de la ficha.
   --------------------------------------------------------------------------- */
MUNDO.forma('baseVenus', function (H, color, b) {
  var R = 13, ALTO = 4.6, Y1 = 4.7;   // radio, altura del anillo, entrepiso

  // ---- ANILLO EXTERIOR: casco de acero con nervaduras verticales ----
  var seg = 44;
  var panel = 2 * Math.PI * R / seg + 1.1;
  for (var i = 0; i < seg; i++) {
    var a = i / seg * 6.2832;
    if (Math.abs(a - Math.PI / 2) < 0.17) continue;      // vano de la esclusa
    var x = Math.cos(a) * R, z = Math.sin(a) * R;
    var gy = a * 57.3 + 90;
    H.pieza('caja', color, 'metal', b, [x, ALTO / 2, z], [0, gy, 0], [panel, ALTO, 0.55], 0);
    H.pieza('caja', '#7d8894', 'metal', b, [x, ALTO / 2, z], [0, gy, 0], [0.34, ALTO, 0.75], 0);
    H.pieza('caja', '#57626e', 'metal', b, [x, 0.5, z], [0, gy, 0], [panel, 0.7, 0.62], 0);
    H.pieza('caja', color, 'metal', b, [x, ALTO + 0.6, z], [0, gy, 0], [panel, 1.2, 0.5], 0);
    if (i % 4 === 0)
      H.pieza('caja', '#2a3a44', 'vidrio', b, [x, 2.9, z], [0, gy, 0], [1.5, 1.1, 0.66], 0);
  }
  // cúpula de doble cara (se ve desde dentro y desde fuera)
  H.pieza('esfera', color, 'domo', b, [0, ALTO + 1.1, 0], [0, 0, 0], [R + 0.5, R * 0.62, R + 0.5], 0);
  for (var c = 0; c < 12; c++) {
    var ac = c / 12 * 6.2832;
    H.pieza('caja', '#7d8894', 'metal', b, [Math.cos(ac) * R * 0.52, ALTO + 4.3, Math.sin(ac) * R * 0.52],
      [0, ac * 57.3, 22], [0.3, 0.3, R * 1.05], 0);
  }

  // ---- ENTREPISO (pasarela anular, con el hueco de la escalera) ----
  H.pieza('caja', '#8e99a4', 'metal', b, [0, Y1 - 0.16, -4.5], [0, 0, 0], [24, 0.32, 13], 0);
  H.pieza('caja', '#8e99a4', 'metal', b, [-8, Y1 - 0.16, 4], [0, 0, 0], [8, 0.32, 4], 0);
  for (var r = 0; r < 12; r++)
    H.pieza('caja', '#6d7a86', 'metal', b, [-11.5 + r * 2.1, Y1 + 0.55, 1.9], [0, 0, 0], [0.08, 1.1, 0.08], 0);
  H.pieza('caja', '#6d7a86', 'metal', b, [0, Y1 + 1.1, 1.9], [0, 0, 0], [23, 0.1, 0.1], 0);

  // ---- ESCLUSA de entrada: doble puerta, como corresponde ----
  H.pieza('caja', '#8e99a4', 'metal', b, [0, 1.7, R + 1.6], [0, 0, 0], [5.2, 3.4, 4], 0);
  H.pieza('caja', '#39434d', 'metal', b, [0, 1.5, R + 3.62], [0, 0, 0], [2.2, 3, 0.2], 0);
  H.pieza('caja', '#c8a33a', 'brillo', b, [1.4, 2.4, R + 3.65], [0, 0, 0], [0.22, 0.22, 0.1], 0.2);
  [-2.6, 2.6].forEach(function (dx) {
    H.pieza('cilindro', '#7d8894', 'metal', b, [dx, 1.7, R + 3.4], [0, 0, 0], [0.2, 3.4, 0.2], 0);
  });

  // ---- INVERNADERO: cúpula menor unida por un túnel (la "granja de papas") ----
  var GX = -20;
  H.pieza('caja', '#8e99a4', 'metal', b, [GX / 2 - 5.5, 1.5, 0], [0, 0, 0], [11, 3, 3.4], 0);
  for (var tu = 0; tu < 5; tu++)
    H.pieza('caja', '#7d8894', 'metal', b, [GX / 2 - 9.5 + tu * 2.2, 1.5, 0], [0, 0, 0], [0.26, 3.1, 3.6], 0);
  var R2 = 7.5;
  for (var j = 0; j < 30; j++) {
    var aj = j / 30 * 6.2832;
    if (Math.abs(aj) < 0.28) continue;                    // boca del túnel
    var xj = GX + Math.cos(aj) * R2, zj = Math.sin(aj) * R2;
    H.pieza('caja', '#9aa6b0', 'metal', b, [xj, 1.6, zj], [0, aj * 57.3 + 90, 0],
      [2 * Math.PI * R2 / 30 + 0.9, 3.2, 0.45], 0);
    if (j % 3 === 0)
      H.pieza('caja', '#2f4a44', 'vidrio', b, [xj, 2.1, zj], [0, aj * 57.3 + 90, 0], [1.5, 1.5, 0.55], 0);
  }
  H.pieza('esfera', '#9aa6b0', 'domo', b, [GX, 3.1, 0], [0, 0, 0], [R2 + 0.4, R2 * 0.66, R2 + 0.4], 0);
  // bancales de cultivo bajo lámparas
  [-3.4, 0, 3.4].forEach(function (dz) {
    H.pieza('caja', '#5c4a34', 'solido', b, [GX, 0.45, dz], [0, 0, 0], [9, 0.9, 2], 0);
    H.pieza('caja', '#3f5a2c', 'follaje', b, [GX, 1.0, dz], [0, 0, 0], [8.6, 0.35, 1.7], 0.08);
    H.pieza('caja', '#e8d8a0', 'brillo', b, [GX, 3.3, dz], [0, 0, 0], [8, 0.14, 0.5], 0.15);
  });

  // ---- INTERIOR DE LA CÚPULA MAYOR ----
  // puesto de mando con pantallas
  H.pieza('caja', '#2f363d', 'metal', b, [6, 0.55, -6], [0, -30, 0], [5, 1.1, 1.8], 0);
  [-1.4, 0, 1.4].forEach(function (dx) {
    H.pieza('caja', '#1b6b7a', 'brillo', b, [6 + dx * 0.9, 1.6, -6.6], [0, -30, 0], [1.3, 0.9, 0.08], 0.14);
  });
  // literas
  [[-7, -7], [-7, -3.5]].forEach(function (q) {
    H.pieza('caja', '#8e99a4', 'metal', b, [q[0], 0.5, q[1]], [0, 0, 0], [2.4, 0.25, 1.5], 0);
    H.pieza('caja', '#d8d2c4', 'solido', b, [q[0], 0.68, q[1]], [0, 0, 0], [2.3, 0.2, 1.4], 0);
    H.pieza('caja', '#8e99a4', 'metal', b, [q[0], 1.9, q[1]], [0, 0, 0], [2.4, 0.25, 1.5], 0);
    H.pieza('caja', '#d8d2c4', 'solido', b, [q[0], 2.08, q[1]], [0, 0, 0], [2.3, 0.2, 1.4], 0);
    H.pieza('caja', '#6d7a86', 'metal', b, [q[0] - 1.15, 1.2, q[1]], [0, 0, 0], [0.12, 2.4, 1.5], 0);
  });
  // mesa común
  H.pieza('caja', '#8a8f94', 'metal', b, [0, 0.78, -2], [0, 0, 0], [3.4, 0.12, 2.2], 0);
  [[-1.5,-0.9],[1.5,-0.9],[-1.5,0.9],[1.5,0.9]].forEach(function (q) {
    H.pieza('cilindro', '#6d7a86', 'metal', b, [q[0], 0.39, -2 + q[1]], [0,0,0], [0.09, 0.78, 0.09], 0);
  });
  // procesador de CO2 y reciclador de agua
  H.pieza('cilindro', '#7d8894', 'metal', b, [9, 1.5, 4], [0, 0, 0], [1.5, 3, 1.5], 0);
  H.pieza('cilindro', '#3f7a9a', 'metal', b, [11.2, 1.1, 6], [0, 0, 0], [1, 2.2, 1], 0);
  H.pieza('caja', '#c8a33a', 'brillo', b, [9, 3.15, 4], [0, 0, 0], [0.5, 0.16, 0.5], 0.2);
  // paneles del entrepiso: banco de baterías y taller
  H.pieza('caja', '#2f363d', 'metal', b, [-6, Y1 + 0.6, -7], [0, 0, 0], [5, 1.2, 1.6], 0);
  H.pieza('caja', '#8a8f94', 'metal', b, [5, Y1 + 0.5, -7.5], [0, 0, 0], [4.4, 0.12, 1.6], 0);
}, 20);

window.MUNDOS.venus = {

  titulo: 'Venus · el planeta invernadero',

  materia:
    'Física · Química · Geología · Astronomía',

  resumen:
    'Explora una superficie volcánica bajo una atmósfera densa de CO₂ y descubre por qué Venus es el planeta más caliente del Sistema Solar.',


  /* -------------------------------------------------------------------------
     AMBIENTE
     ------------------------------------------------------------------------- */

  cielo: '#b56a32',

  niebla: {
    color: '#c77b3d',
    cerca: 8,
    lejos: 72
  },

  luz: {

    cielo: '#d69a63',

    suelo: '#5c3022',

    ambiente: 0.72,

    sol: '#ffd29a',

    intensidad: 0.55,

    posicion: '35 28 -40'

  },


  /* -------------------------------------------------------------------------
     DIMENSIONES DEL MUNDO
     ------------------------------------------------------------------------- */

  ancho: 180,

  anchoVida: 150,

  inicio: '0 2.5 42',

  cotaMuerte: -18,

  semilla: 26108,

  guardado: true,


  /* -------------------------------------------------------------------------
     GRAVEDAD

     Venus:
     8,87 m/s²
     aproximadamente 0,90 g terrestre
     ------------------------------------------------------------------------- */

  gravedad: {

    valor: 8.87,

    salto: 4.9,

    opciones: [

      {
        g: 8.87,
        salto: 4.9,
        etiqueta: 'Venus (8,87)'
      },

      {
        g: 9.81,
        salto: 5.2,
        etiqueta: 'Tierra (9,81)'
      },

      {
        g: 3.70,
        salto: 3.2,
        etiqueta: 'Mercurio (3,70)'
      },

      {
        g: 1.62,
        salto: 2.1,
        etiqueta: 'Luna (1,62)'
      }

    ]

  },


  /* -------------------------------------------------------------------------
     PUNTOS DE VISTA
     ------------------------------------------------------------------------- */

  vistas: {

    llegada: {
      etiqueta: 'Llanura venusiana',
      pos: '0 2.5 42',
      pitch: -4,
      yaw: 0
    },

    volcan: {
      etiqueta: 'Volcán en escudo',
      pos: '-34 5 -18',
      pitch: -10,
      yaw: -35
    },

    domos: {
      etiqueta: 'Domos pancake',
      pos: '35 3 4',
      pitch: -7,
      yaw: 35
    },

    tessera: {
      etiqueta: 'Terreno tessera',
      pos: '-45 5 35',
      pitch: -10,
      yaw: -55
    },

    venera: {
      etiqueta: 'Sonda Venera',
      pos: '18 2.5 26',
      pitch: -4,
      yaw: 25
    }

  },


  /* -------------------------------------------------------------------------
     ATMÓSFERAS

     El primer modo representa Venus.
     Los otros son comparaciones pedagógicas.
     ------------------------------------------------------------------------- */

  atmosferas: [

    {

      id: 'venus',

      nombre: 'Venus actual · CO₂ denso',

      cielo: '#b56a32',

      niebla: '#c77b3d',

      near: 8,

      far: 72,

      luz: '#d69a63',

      intensidad: 0.55,

      aire: 1.0,

      subsuelo: 0.35

    },

    {

      id: 'menosCO2',

      nombre: 'Venus hipotético · menos CO₂',

      cielo: '#d49a62',

      niebla: '#ddb27f',

      near: 15,

      far: 105,

      luz: '#efc493',

      intensidad: 0.72,

      aire: 0.65,

      subsuelo: 0.25

    },

    {

      id: 'terrestre',

      nombre: 'Comparación · atmósfera terrestre',

      cielo: '#79acd0',

      niebla: '#c9dfec',

      near: 25,

      far: 150,

      luz: '#dceaf3',

      intensidad: 0.9,

      aire: 0.55,

      subsuelo: 0.12

    }

  ],


  /* -------------------------------------------------------------------------
     PELIGROS
     ------------------------------------------------------------------------- */

  peligros: [

    {

      x: -30,

      z: -18,

      r: 5,

      dano: 22,

      causa:
        'Te acercaste demasiado a una zona volcánica activa'

    },

    {

      x: 42,

      z: -28,

      r: 3,

      dano: 18,

      causa:
        'Atravesaste una fractura con gases y roca extremadamente caliente'

    }

  ],


  /* -------------------------------------------------------------------------
     MUESTRAS CIENTÍFICAS
     ------------------------------------------------------------------------- */

  muestras: [

    {

      id: 'basalto1',

      pos: [-18, 0.05, 8],

      tipo: 'roca',

      color: '#6d3827',

      nombre: 'Basalto venusiano',

      analisis:
        'Roca volcánica. Su composición indica que grandes regiones de Venus fueron cubiertas por lavas. <b>Es una evidencia directa de una historia geológica dominada por el volcanismo.</b>'

    },

    {

      id: 'tessera1',

      pos: [-44, 0.05, 31],

      tipo: 'roca',

      color: '#8c5034',

      nombre: 'Roca de tessera',

      analisis:
        'Roca procedente de un terreno intensamente deformado. Las tesserae están cruzadas por crestas y fracturas y podrían conservar información de etapas antiguas de la corteza venusiana.'

    },

    {

      id: 'azufre1',

      pos: [28, 0.05, -12],

      tipo: 'tierra',

      color: '#c58a35',

      nombre:
        'Depósito rico en compuestos de azufre',

      analisis:
        'La química de Venus está estrechamente ligada al azufre. En la atmósfera, el dióxido de azufre participa en reacciones que contribuyen a formar las nubes de ácido sulfúrico.'

    },

    {

      id: 'sonda1',

      pos: [18, 0.05, 24],

      tipo: 'metal',

      color: '#b8a77f',

      nombre: 'Fragmento de sonda',

      analisis:
        'Material artificial resistente al calor. Las sondas que llegaron a Venus tuvieron que soportar temperaturas cercanas a 465 °C y una presión superficial enorme.'

    }

  ],


  /* -------------------------------------------------------------------------
     FRANJA PRINCIPAL
     ------------------------------------------------------------------------- */

  franjas: [

    {

      id: 'llanura',

      nombre:
        'Llanura volcánica venusiana',

      rango:
        'Superficie de Venus',

      z: [82, -82],

      y: 0,

      color: '#7b4029',

      superficie: 'roca',

      texto:
        'Estás sobre una extensa llanura volcánica de Venus. El paisaje está oculto bajo una atmósfera muy densa, dominada por dióxido de carbono.',

      detalle: [

        'Venus tiene un tamaño parecido al de la Tierra, pero su superficie presenta condiciones radicalmente diferentes: alrededor de 465 °C y una presión cercana a 92 veces la presión atmosférica terrestre al nivel del mar.',

        'Su atmósfera está compuesta principalmente por dióxido de carbono. Las nubes contienen gotas de ácido sulfúrico, aunque estas nubes se encuentran muy por encima de la superficie.',

        'La enorme cantidad de CO₂ produce un efecto invernadero extremo. La energía térmica queda atrapada con gran eficiencia y Venus termina siendo incluso más caliente que Mercurio.',

        'La superficie está dominada por estructuras volcánicas, llanuras de lava, terrenos deformados y cráteres de impacto.'

      ],

      reto:
        'Venus está más lejos del Sol que Mercurio, pero su superficie es más caliente. ¿Qué variable puede explicar esta aparente contradicción?',

      especies: [

        {

          forma: 'venusRoca',

          n: 110,

          color: '#713b29',

          nombre: 'Roca volcánica',

          choca: {
            r: 0.45,
            alto: 1
          }

        },

        {

          forma: 'venusRoca',

          n: 70,

          color: '#925034'

        },

        {

          forma: 'venusRoca',

          n: 45,

          color: '#5f3327'

        }

      ]

    }

  ],


  /* -------------------------------------------------------------------------
     OBJETOS IMPORTANTES
     ------------------------------------------------------------------------- */

  // Luces del interior de la base y del invernadero
  luces: [
    { pos: [0, 4, -2],    color: '#dce8f0', intensidad: 0.7, alcance: 20 },
    { pos: [0, 8.5, -4],  color: '#dce8f0', intensidad: 0.5, alcance: 18 },
    { pos: [-20, 3.4, 0], color: '#ffe8b0', intensidad: 0.9, alcance: 16 },
    { pos: [0, 2.2, 15.6], color: '#c8a33a', intensidad: 0.5, alcance: 7 }
  ],

  objetos: [
    /* ---------- BASE AURELIA: el gran habitáculo ----------
       Dos niveles pisables, escalera, esclusa, túnel e invernadero. El anillo
       de colisión reproduce el casco dejando libre el vano de la esclusa. */
    {
      forma: 'baseVenus', color: '#b9c3cb', pos: [0, 0.05, 0],
      nombre: 'Base Aurelia', ficha: 'base', altoFicha: 13,
      pisos: [
        { dx: 0,  dz: 0,    ancho: 26, largo: 26, alto: 0.15, color: '#8e99a4' },
        { dx: 0,  dz: -4.5, ancho: 24, largo: 13, alto: 4.70, color: '#8e99a4' },
        { dx: -8, dz: 4,    ancho: 8,  largo: 4,  alto: 4.70, color: '#8e99a4' },
        { dx: -20, dz: 0,   ancho: 15, largo: 15, alto: 0.15, color: '#6d6250' },
        { dx: -9.5, dz: 0,  ancho: 11, largo: 3.4, alto: 0.15, color: '#8e99a4' },
        { dx: 0,  dz: 15.6, ancho: 5.2, largo: 4, alto: 0.15, color: '#8e99a4' }
      ],
      escalones: [
        { dx: 8, dz: 6, ancho: 2.6, largo: 9, alto: 4.55, base: 0.15, pasos: 18, color: '#9aa6b0' }
      ],
      choca: [
      { dx: 13.00, dz: 0.00, r: 0.62, base: 0, alto: 5.8 },
      { dx: 12.87, dz: 1.85, r: 0.62, base: 0, alto: 5.8 },
      { dx: 12.47, dz: 3.66, r: 0.62, base: 0, alto: 5.8 },
      { dx: 11.83, dz: 5.40, r: 0.62, base: 0, alto: 5.8 },
      { dx: 10.94, dz: 7.03, r: 0.62, base: 0, alto: 5.8 },
      { dx: 9.82, dz: 8.51, r: 0.62, base: 0, alto: 5.8 },
      { dx: 8.51, dz: 9.82, r: 0.62, base: 0, alto: 5.8 },
      { dx: 7.03, dz: 10.94, r: 0.62, base: 0, alto: 5.8 },
      { dx: 5.40, dz: 11.83, r: 0.62, base: 0, alto: 5.8 },
      { dx: 3.66, dz: 12.47, r: 0.62, base: 0, alto: 5.8 },
      { dx: -3.66, dz: 12.47, r: 0.62, base: 0, alto: 5.8 },
      { dx: -5.40, dz: 11.83, r: 0.62, base: 0, alto: 5.8 },
      { dx: -7.03, dz: 10.94, r: 0.62, base: 0, alto: 5.8 },
      { dx: -8.51, dz: 9.82, r: 0.62, base: 0, alto: 5.8 },
      { dx: -9.82, dz: 8.51, r: 0.62, base: 0, alto: 5.8 },
      { dx: -10.94, dz: 7.03, r: 0.62, base: 0, alto: 5.8 },
      { dx: -11.83, dz: 5.40, r: 0.62, base: 0, alto: 5.8 },
      { dx: -12.47, dz: 3.66, r: 0.62, base: 0, alto: 5.8 },
      { dx: -12.87, dz: 1.85, r: 0.62, base: 0, alto: 5.8 },
      { dx: -13.00, dz: 0.00, r: 0.62, base: 0, alto: 5.8 },
      { dx: -12.87, dz: -1.85, r: 0.62, base: 0, alto: 5.8 },
      { dx: -12.47, dz: -3.66, r: 0.62, base: 0, alto: 5.8 },
      { dx: -11.83, dz: -5.40, r: 0.62, base: 0, alto: 5.8 },
      { dx: -10.94, dz: -7.03, r: 0.62, base: 0, alto: 5.8 },
      { dx: -9.82, dz: -8.51, r: 0.62, base: 0, alto: 5.8 },
      { dx: -8.51, dz: -9.82, r: 0.62, base: 0, alto: 5.8 },
      { dx: -7.03, dz: -10.94, r: 0.62, base: 0, alto: 5.8 },
      { dx: -5.40, dz: -11.83, r: 0.62, base: 0, alto: 5.8 },
      { dx: -3.66, dz: -12.47, r: 0.62, base: 0, alto: 5.8 },
      { dx: -1.85, dz: -12.87, r: 0.62, base: 0, alto: 5.8 },
      { dx: -0.00, dz: -13.00, r: 0.62, base: 0, alto: 5.8 },
      { dx: 1.85, dz: -12.87, r: 0.62, base: 0, alto: 5.8 },
      { dx: 3.66, dz: -12.47, r: 0.62, base: 0, alto: 5.8 },
      { dx: 5.40, dz: -11.83, r: 0.62, base: 0, alto: 5.8 },
      { dx: 7.03, dz: -10.94, r: 0.62, base: 0, alto: 5.8 },
      { dx: 8.51, dz: -9.82, r: 0.62, base: 0, alto: 5.8 },
      { dx: 9.82, dz: -8.51, r: 0.62, base: 0, alto: 5.8 },
      { dx: 10.94, dz: -7.03, r: 0.62, base: 0, alto: 5.8 },
      { dx: 11.83, dz: -5.40, r: 0.62, base: 0, alto: 5.8 },
      { dx: 12.47, dz: -3.66, r: 0.62, base: 0, alto: 5.8 },
      { dx: 12.87, dz: -1.85, r: 0.62, base: 0, alto: 5.8 },
        // esclusa: dos costados y el frente con su puerta
        { dx: -2.6, dz: 15.6, ancho: 0.3, largo: 4, base: 0, alto: 3.4 },
        { dx: 2.6,  dz: 15.6, ancho: 0.3, largo: 4, base: 0, alto: 3.4 },
        // túnel al invernadero: dos paredes laterales
        { dx: -9.5, dz: -1.75, ancho: 11, largo: 0.3, base: 0, alto: 3 },
        { dx: -9.5, dz: 1.75,  ancho: 11, largo: 0.3, base: 0, alto: 3 },
        // baranda del entrepiso
        { dx: 0, dz: 1.9, ancho: 23, largo: 0.12, base: 4.7, alto: 1.1 }
      ]
    },

    {

      forma: 'venusVolcan',

      color: '#6d3524',

      pos: [-32, 0.05, -22],

      radio: 13,

      alto: 4.2,

      nombre: 'Volcán en escudo',

      ficha: 'volcan',

      altoFicha: 5

    },


    {

      forma: 'venusDomo',

      color: '#a45b35',

      pos: [30, 0.05, 2],

      radio: 4.5,

      nombre: 'Domo pancake',

      ficha: 'domo',

      altoFicha: 2.5

    },


    {

      forma: 'venusDomo',

      color: '#94502f',

      pos: [39, 0.05, -3],

      radio: 3.4

    },


    {

      forma: 'venusDomo',

      color: '#aa633b',

      pos: [35, 0.05, 8],

      radio: 2.8

    },


    {

      forma: 'venusTessera',

      color: '#75402f',

      pos: [-43, 0.05, 31],

      nombre: 'Terreno tessera',

      ficha: 'tessera',

      altoFicha: 4

    },


    {

      forma: 'venusCrater',

      color: '#663525',

      pos: [48, 0.05, -30],

      radio: 6,

      nombre: 'Cráter de impacto',

      ficha: 'crater',

      altoFicha: 3

    },


    {

      forma: 'venera',

      color: '#9b8b68',

      pos: [18, 0.05, 24],

      giro: -25,

      nombre: 'Sonda Venera',

      ficha: 'venera',

      altoFicha: 3,

      choca: [
        {
          r: 1.2,
          alto: 2
        }
      ]

    },


    {

      forma: 'venusHito',

      color: '#d19a43',

      pos: [3, 0.05, 31],

      nombre: 'Estación atmosférica',

      ficha: 'atmosfera',

      altoFicha: 3.6

    },


    {

      forma: 'venusHito',

      color: '#c75b3b',

      pos: [-8, 0.05, 31],

      nombre: 'Estación de gravedad',

      ficha: 'gravedad',

      altoFicha: 3.6

    }

  ],


  /* ==========================================================================
     FICHAS PEDAGÓGICAS
     ========================================================================== */

  fichas: [
    {
      id: 'base', nombre: 'Base Aurelia', rango: 'Por qué no puede ser el Hab de The Martian',
      texto: 'En la película The Martian el hábitat es una carpa inflable de lona: en Marte basta con eso, porque la presión exterior es casi nula y el problema es retener el aire de adentro. En Venus ocurre lo contrario y con una violencia enorme. La atmósfera empuja hacia adentro con unas 92 atmósferas, la misma presión que hay a 900 metros bajo el mar, y la temperatura ronda los 460 °C. Un hábitat aquí no se parece a una carpa: se parece a un batiscafo. Por eso esta base es un casco de acero con nervaduras, ventanas pequeñas y gruesas, y una esclusa de doble puerta.',
      vida: ['Casco a presión con nervaduras, no lona inflable', 'La presión empuja hacia ADENTRO, no hacia afuera', 'Ventanas pequeñas: cada abertura debilita el casco', 'Esclusa de doble puerta para no perder la atmósfera interior', 'Invernadero unido por túnel, con luz artificial'],
      reto: 'En Marte el hábitat se infla y la presión interior lo sostiene. En Venus, inflarlo lo aplastaría igual. Explica por qué, usando la diferencia de presión entre el interior y el exterior en cada planeta.',
      actividad: 'Recorre la base y anota tres decisiones de diseño que existen por causa de la presión y tres que existen por causa del calor. Después dibuja cómo sería esta misma base en Marte.'
    },


    /* -----------------------------------------------------------------------
       ATMÓSFERA
       ----------------------------------------------------------------------- */

    {

      id: 'atmosfera',

      nombre:
        'Atmósfera de Venus',

      rango:
        'Química · Física',

      texto:
        'La atmósfera venusiana es extremadamente densa y está formada principalmente por CO₂. Su presión superficial es aproximadamente 92 veces la terrestre.',

      detalle: [

        'El CO₂ constituye cerca del 96,5 % de la atmósfera y el nitrógeno alrededor del 3,5 %.',

        'Las nubes de Venus contienen ácido sulfúrico. Desde la superficie no verías un cielo azul: la luz llega muy dispersada a través de una gruesa cubierta atmosférica.',

        'El efecto invernadero eleva la temperatura superficial a aproximadamente 465 °C.'

      ],

      actividad:
        'Usa el selector de atmósfera y compara Venus actual con el escenario de menos CO₂ y con una atmósfera terrestre.',

      pregunta:
        '¿Qué relación observas entre composición atmosférica, visibilidad y temperatura?'

    },


    /* -----------------------------------------------------------------------
       GRAVEDAD
       ----------------------------------------------------------------------- */

    {

      id: 'gravedad',

      nombre:
        'Venus · datos físicos',

      rango:
        'Física planetaria',

      texto:
        'Venus es casi del tamaño de la Tierra y por eso su gravedad superficial también es parecida.',

      detalle: [

        'Gravedad: 8,87 m/s², aproximadamente el 90 % de la gravedad terrestre.',

        'Diámetro: aproximadamente 12.104 km.',

        'Un año venusiano dura cerca de 225 días terrestres.',

        'Venus gira muy lentamente y en sentido retrógrado respecto de la mayoría de los planetas.'

      ],

      reto:
        'Compara tu salto en Venus y en la Tierra. ¿Por qué la diferencia es mucho menor que entre la Tierra y Mercurio?'

    },


    /* -----------------------------------------------------------------------
       VOLCÁN
       ----------------------------------------------------------------------- */

    {

      id: 'volcan',

      nombre:
        'Volcán en escudo',

      rango:
        'Geología',

      texto:
        'Gran parte de Venus está cubierta por terrenos volcánicos. Los volcanes en escudo se construyen mediante numerosas coladas de lava que se extienden a grandes distancias.',

      detalle: [

        'Venus posee una enorme cantidad de estructuras volcánicas.',

        'Observaciones modernas indican que el planeta probablemente mantiene actividad volcánica reciente o actual.'

      ],

      reto:
        '¿Qué evidencias buscarías para demostrar que un volcán venusiano está activo hoy y no que se apagó hace millones de años?'

    },


    /* -----------------------------------------------------------------------
       DOMOS PANCAKE
       ----------------------------------------------------------------------- */

    {

      id: 'domo',

      nombre:
        'Domo pancake',

      rango:
        'Volcanismo venusiano',

      texto:
        'Estos domos anchos y aplanados son estructuras volcánicas características de Venus. Su forma sugiere la extrusión de lava relativamente viscosa.',

      reto:
        'Compara este domo con un volcán en escudo. ¿Qué diferencia en la lava podría explicar sus formas distintas?'

    },


    /* -----------------------------------------------------------------------
       TESSERA
       ----------------------------------------------------------------------- */

    {

      id: 'tessera',

      nombre:
        'Terreno tessera',

      rango:
        'Corteza deformada',

      texto:
        'Las tesserae son regiones elevadas y muy deformadas donde crestas y fracturas se cruzan en varias direcciones.',

      detalle: [

        'Se consideran algunos de los terrenos geológicamente más complejos de Venus.',

        'Estudiarlas puede ayudar a reconstruir cómo era la corteza antes de los grandes episodios de renovación volcánica.'

      ],

      reto:
        'Una superficie muy deformada registra fuerzas del pasado. ¿Qué procesos internos podrían comprimir, estirar o fracturar una corteza planetaria?'

    },


    /* -----------------------------------------------------------------------
       CRÁTER
       ----------------------------------------------------------------------- */

    {

      id: 'crater',

      nombre:
        'Cráter de impacto',

      rango:
        'Geología comparada',

      texto:
        'Venus tiene cráteres de impacto, pero su atmósfera densa destruye o frena muchos objetos pequeños antes de que alcancen el suelo.',

      reto:
        '¿Por qué Mercurio está mucho más cubierto de pequeños cráteres que Venus? Relaciona tu respuesta con la atmósfera.'

    },


    /* -----------------------------------------------------------------------
       VENERA
       ----------------------------------------------------------------------- */

    {

      id: 'venera',

      nombre:
        'Sonda Venera',

      rango:
        'Exploración espacial',

      texto:
        'Las misiones soviéticas Venera lograron algo extraordinario: atravesar la atmósfera y transmitir información directamente desde la superficie de Venus.',

      detalle: [

        'La electrónica tuvo que soportar una temperatura cercana a 465 °C y una presión comparable a estar a gran profundidad bajo el océano terrestre.',

        'Las sondas sobrevivieron poco tiempo, pero permitieron obtener las primeras imágenes desde la superficie de otro planeta.'

      ],

      pregunta:
        'Si diseñaras una nueva sonda para Venus, ¿qué tres sistemas necesitarías proteger especialmente?'

    }

  ]

};