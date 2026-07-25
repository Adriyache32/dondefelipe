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

/* ---------------------------------------------------------------- MUNDO */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS.mercurio = {

  titulo: 'Mercurio · la superficie',
  materia: 'Física · Astronomía · Sistema Solar',
  resumen: 'El planeta más cercano al Sol. Gravedad real ajustable para sentir cómo saltaría un humano en Mercurio.',

  // Cielo negro: Mercurio casi no tiene atmósfera
  cielo: '#050608',
  luz: { cielo: '#141820', suelo: '#2e2820', ambiente: 0.22,
         sol: '#fff8ec', intensidad: 2.9, posicion: '55 24 -30' },

  ancho: 120,
  anchoVida: 100,
  inicio: '0 2 30',

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
    sol:     { etiqueta: 'Mirar al Sol',       pos: '0 2 10',   pitch: 8,  yaw: 150 }
  },

  // El Sol, enorme y brillante desde acá (Mercurio está muy cerca)
  cielos: [
    { id: 'sol', posicion: '60 34 -60', radio: 7, color: '#fff4d8' }
  ],

  franjas: [
    {
      id: 'regolito', nombre: 'Llanura de regolito', rango: 'Superficie de Mercurio',
      z: [60, -60], y: 0, color: '#8a827a', superficie: 'roca',
      texto: 'Estás parado sobre el regolito de Mercurio: polvo y roca triturada por miles de millones de años de impactos. Sin atmósfera que los frene, cada meteorito llega directo a la superficie, y por eso Mercurio está tan lleno de cráteres como la Luna.',
      detalle: [
        'Mercurio es el planeta más pequeño y el más cercano al Sol. Un año dura apenas 88 días terrestres, pero rota tan lento que un día solar completo dura 176 días: aquí el Sol saldría, cruzaría el cielo y se pondría a lo largo de dos años mercurianos.',
        'La falta de atmósfera hace que la temperatura oscile como en ningún otro planeta: puede pasar de unos 430 °C bajo el Sol a unos 180 grados bajo cero en la sombra. No hay aire que reparta el calor.',
        'La gravedad en la superficie es de 3,70 m/s², un 38% de la terrestre. Con el selector de gravedad puedes sentir la diferencia: en Mercurio saltas mucho más alto y caes más lento que en la Tierra, porque tu masa es la misma pero el planeta tira de ti con menos fuerza.'
      ],
      reto: 'Salta en la Tierra, cambia a la gravedad de Mercurio y vuelve a saltar. Tu cuerpo pesa menos aquí, ¿pero tu masa cambió? ¿Qué es distinto entre peso y masa?',
      especies: [
        { forma: 'penasco', n: 90, color: '#7d756c', nombre: 'Roca', choca: { r: 0.5, alto: 1 } },
        { forma: 'penasco', n: 60, color: '#948b80' },
        { forma: 'penasco', n: 40, color: '#6e675f' },
        { forma: 'crater',  n: 18, color: '#6e675f' }
      ]
    }
  ],

  objetos: [
    // Cuenca Caloris: una de las mayores del sistema solar (~1550 km real)
    { forma: 'crater', color: '#6e675f', pos: [-30, 0.05, -30], radio: 16,
      nombre: 'Cuenca Caloris', ficha: 'caloris', altoFicha: 4 },
    { forma: 'picoCentral', color: '#7d756c', pos: [-30, 0.05, -30] },
    // Cráter Kuiper: joven, con rayos brillantes
    { forma: 'rayos', color: '#d8d2c4', pos: [24, 0.05, -14], rayos: 10,
      nombre: 'Cráter Kuiper', ficha: 'kuiper', altoFicha: 2.5 },
    { forma: 'crater', color: '#6e675f', pos: [24, 0.05, -14], radio: 4 },
    // Escarpe de Discovery: un gran acantilado de contracción del planeta
    { forma: 'escarpe', color: '#847b70', pos: [40, 0.05, 10], giro: 20,
      largo: 44, alto: 5, nombre: 'Escarpe Discovery', ficha: 'escarpe', altoFicha: 6 },
    // Región polar en sombra permanente, con hielo
    { forma: 'crater', color: '#5a5650', pos: [-40, 0.05, 30], radio: 7,
      nombre: 'Cráter polar con hielo', ficha: 'hielo', altoFicha: 3 },
    // Estación de estudio con el panel de gravedad
    { forma: 'hito', color: '#c4342e', pos: [3, 0.05, 22],
      nombre: 'Estación de estudio', ficha: 'gravedad', altoFicha: 3.6 }
  ],

  fichas: [
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
