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

/* ---------------------------------------------------------------- MUNDO */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS.bosque = {

  titulo: 'Bosque nativo · cambio climático',
  materia: 'Biología · U3 Ecosistemas',
  resumen: 'Bosque de la Cordillera de la Costa. Una guía de trabajo por estaciones sobre las consecuencias del cambio climático en la naturaleza y las personas.',

  cielo: '#a9c4d4',
  niebla: { color: '#bcd0d8', cerca: 40, lejos: 150 },
  luz: { cielo: '#dcecf0', suelo: '#5a5238', ambiente: 0.9, sol: '#fff2d8', intensidad: 0.85, posicion: '-16 24 12' },

  clima: { inicial: 'despejado', real: true, auto: false, fallback: { lat: -33.05, lon: -71.5 } },

  // Sonido: ambiente de viento (global) + fuentes posicionales
  sonido: {
    fuentes: [
      // arroyo en el fondo de la quebrada (agua corriente)
      { pos: [-18, 0, 8], filtro: 'bandpass', freq: 1600, q: 0.7, vol: 0.3, refDist: 5, maxDist: 26 },
      // canto de aves en el sotobosque húmedo
      { pos: [-10, 3, 14], filtro: 'bandpass', freq: 3200, q: 3, vol: 0.12, refDist: 4, maxDist: 18 },
      // viento seco silbando en la ladera
      { pos: [18, 2, -10], filtro: 'lowpass', freq: 600, q: 0.5, vol: 0.16, refDist: 6, maxDist: 30 }
    ]
  },

  ancho: 120,
  anchoVida: 96,
  inicio: '0 1.7 40',

  vistas: {
    inicio:  { etiqueta: 'Inicio del sendero',  pos: '0 1.7 40',   pitch: -2, yaw: 0 },
    quebrada:{ etiqueta: 'La quebrada húmeda',  pos: '-22 1.7 -6', pitch: 0,  yaw: -30 },
    ladera:  { etiqueta: 'La ladera seca',      pos: '24 1.7 0',   pitch: 2,  yaw: 40 },
    comunidad:{ etiqueta: 'La comunidad',       pos: '10 1.7 -34', pitch: 0,  yaw: 160 }
  },

  franjas: [
    {
      id: 'sendero', nombre: 'Sendero de entrada', rango: 'Bienvenida a la guía',
      z: [46, 28], y: 0, color: '#7a6f4e', superficie: 'tierra',
      texto: 'Estás en el bosque nativo de la Cordillera de la Costa. Este recorrido es una guía de trabajo: en cada estación marcada hay algo que observar, dibujar o responder en tu cuaderno. El hilo de todo el recorrido es una pregunta: ¿qué le está pasando a este bosque, y a la gente que vive de él, con el cambio climático?',
      vida: ['Sigue las estaciones numeradas', 'Ten tu cuaderno a mano', 'Cada color de recuadro es un tipo de tarea distinta'],
      especies: [
        { forma: 'helecho', n: 30, color: '#3f6b34' },
        { forma: 'boldo', n: 8, color: '#6f8a5c', nombre: 'Boldo', choca: { r: 0.3, alto: 4 } }
      ]
    },
    {
      id: 'quebrada', nombre: 'Quebrada húmeda', rango: 'El bosque que depende del agua',
      z: [28, 2], y: -0.3, color: '#4e5230', superficie: 'tierra',
      texto: 'En el fondo de la quebrada el aire es húmedo y sombrío. Aquí crecen los árboles que necesitan más agua: bellotos, boldos grandes, y un sotobosque lleno de helechos. Esta franja es la primera en sufrir cuando llueve menos.',
      vida: ['Belloto del norte, especie amenazada de quebradas húmedas', 'Boldo (<i>Peumus boldus</i>), aromático y medicinal', 'Helechos, que solo viven donde hay humedad constante'],
      especies: [
        { forma: 'belloto', n: 22, color: '#3f6b3a', nombre: 'Belloto', choca: { r: 0.4, alto: 7 } },
        { forma: 'boldo', n: 20, color: '#5f7d4c', nombre: 'Boldo', choca: { r: 0.32, alto: 4 } },
        { forma: 'helecho', n: 90, color: '#3a6330' }
      ]
    },
    {
      id: 'ladera', nombre: 'Ladera de solana', rango: 'Donde el sol pega fuerte',
      z: [2, -22], y: 0.2, color: '#8a7c55', superficie: 'tierra',
      texto: 'La ladera que mira al norte recibe sol todo el día. Aquí dominan las especies duras que resisten la sequía: litre, quillay, peumo. Pero incluso ellas empiezan a mostrar árboles secos: con años de menos lluvia, el límite del bosque retrocede ladera abajo.',
      vida: ['Litre (<i>Lithraea caustica</i>), resistente y de hoja dura', 'Quillay (<i>Quillaja saponaria</i>), de corteza con saponina', 'Peumo (<i>Cryptocarya alba</i>), de fruto rojo comestible', 'Árboles secos en pie: la marca del estrés hídrico'],
      especies: [
        { forma: 'litreN', n: 34, color: '#5c7040', nombre: 'Litre', choca: { r: 0.3, alto: 3.5 } },
        { forma: 'quillay', n: 26, color: '#6f8256', nombre: 'Quillay', choca: { r: 0.34, alto: 5 } },
        { forma: 'peumo', n: 24, color: '#3f5c34', nombre: 'Peumo', choca: { r: 0.3, alto: 5 } },
        { forma: 'seco', n: 22, color: '#9a8f7a', nombre: 'Árbol seco', choca: { r: 0.2, alto: 3 } }
      ]
    },
    {
      id: 'comunidad', nombre: 'La comunidad humana', rango: 'Quienes viven del bosque',
      z: [-22, -44], y: 0, color: '#7d6f4c', superficie: 'tierra',
      texto: 'Al borde del bosque vive gente que depende de él: agua de vertiente, leña, recolección de frutos y hierbas, apicultura. El cambio climático no es solo un problema de los árboles: cuando la vertiente baja su caudal o el bosque retrocede, son estas familias las que lo sienten primero.',
      vida: ['Pozos y vertientes que dependen de la recarga del bosque', 'Recolección de boldo, peumo y miel', 'La sequía prolongada obliga a comprar agua en camiones aljibe'],
      especies: [
        { forma: 'seco', n: 10, color: '#9a8f7a' },
        { forma: 'litreN', n: 8, color: '#5c7040' }
      ]
    }
  ],

  // AVES NATIVAS del bosque esclerófilo de Chile central
  aves: [
    { nombre: 'Chincol',    n: 4, tam: 0.8, color: '#7a6248', pecho: '#b8a888', ala: '#5a4632',
      altura: [3, 7], radio: [6, 12], vel: 0.3 },
    { nombre: 'Fío-fío',    n: 3, tam: 0.75, color: '#6a7258', pecho: '#c8c4a0', ala: '#4e5240',
      altura: [4, 9], radio: [8, 14], vel: 0.35 },
    { nombre: 'Tenca',      n: 3, tam: 1.0, color: '#9a8f7a', pecho: '#d8d0bc', ala: '#6a5f4c',
      altura: [3, 8], radio: [10, 16], vel: 0.28 },
    { nombre: 'Tórtola',    n: 4, tam: 1.05, color: '#a89684', pecho: '#c4b0a0', ala: '#7a6858',
      altura: [2, 6], radio: [6, 12], vel: 0.22, planea: 1 },
    { nombre: 'Golondrina', n: 6, tam: 0.7, color: '#2a3548', pecho: '#e4e0d4', ala: '#1e2838',
      altura: [8, 16], radio: [14, 24], vel: 0.55, planea: 1 },
    { nombre: 'Zorzal',     n: 2, tam: 1.0, color: '#4a4038', pecho: '#c88a4a', ala: '#38302a',
      altura: [3, 7], radio: [8, 14], vel: 0.26 }
  ],

  objetos: [
    // ---------- ESTACIÓN 1 ----------
    { forma: 'estacion', color: '#2f6b45', pos: [4, 0, 34], giroCartel: -20,
      nombre: 'Estación 1', ficha: 'e1', altoFicha: 3.6 },
    // ---------- ESTACIÓN 2 ----------
    { forma: 'estacion', color: '#2f6b45', pos: [-14, -0.3, 14],
      nombre: 'Estación 2', ficha: 'e2', altoFicha: 3.6 },
    // ---------- ESTACIÓN 3 ----------
    { forma: 'estacion', color: '#8a6a2c', pos: [16, 0.2, -8],
      nombre: 'Estación 3', ficha: 'e3', altoFicha: 3.6 },
    // ---------- ESTACIÓN 4 ----------
    { forma: 'estacion', color: '#8a6a2c', pos: [6, 0.2, -18],
      nombre: 'Estación 4', ficha: 'e4', altoFicha: 3.6 },
    // ---------- ESTACIÓN 5 ----------
    { forma: 'estacion', color: '#5a4a8a', pos: [12, 0, -32],
      nombre: 'Estación 5', ficha: 'e5', altoFicha: 3.6 },
    // ESTACIÓN 6: las aves
    { forma: 'estacion', color: '#2f6b45', pos: [-10, -0.3, 6],
      nombre: 'Estación 6', ficha: 'e6', altoFicha: 3.6 },
    // casa de la comunidad
    { forma: 'casa', color: '#c9bfa6', pos: [-6, 0, -36], giro: 20,
      nombre: 'Casa rural', choca: [{ dx: 0, dz: 0, ancho: 4.5, largo: 4, alto: 2.6 }] }
  ],

  fichas: [
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
