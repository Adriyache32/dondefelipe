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

  objetos: [

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