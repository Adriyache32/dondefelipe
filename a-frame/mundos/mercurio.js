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

/* ---------------------------------------------------------------- MUNDO */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS.mercurio = {

  titulo: 'Mercurio · la superficie',
  materia: 'Física · Astronomía · Sistema Solar',
  resumen: 'El planeta más cercano al Sol. Gravedad real ajustable para sentir cómo saltaría un humano en Mercurio.',

  // Cielo negro: Mercurio casi no tiene atmósfera
  cielo: '#050608',
  luz: { cielo: '#20232a', suelo: '#3a352e', ambiente: 0.35,
         sol: '#fff8ec', intensidad: 2.4, posicion: '40 30 -20' },

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
        { forma: 'crater',  n: 14, color: '#6e675f' }
      ]
    }
  ],

  objetos: [
    { forma: 'crater', color: '#6e675f', pos: [-16, 0.05, -6], radio: 9,
      nombre: 'Cráter de impacto', ficha: 'crater', altoFicha: 3 },
    { forma: 'hito', color: '#c4342e', pos: [3, 0.05, 22],
      nombre: 'Estación de estudio', ficha: 'gravedad', altoFicha: 3.6 }
  ],

  fichas: [
    {
      id: 'crater', nombre: 'Cráteres de impacto', rango: 'La marca de un mundo sin aire',
      texto: 'Los cráteres se forman cuando un meteorito golpea la superficie. En la Tierra la atmósfera quema la mayoría antes de llegar, y la erosión borra las cicatrices con el tiempo. En Mercurio no hay aire ni agua ni viento: los cráteres quedan casi intactos durante miles de millones de años.',
      reto: 'Cuenta los cráteres que ves. Cuantos más hay en una superficie, más antigua es. ¿Por qué la cantidad de cráteres sirve para estimar la edad de un terreno?'
    },
    {
      id: 'gravedad', nombre: 'Peso, masa y gravedad', rango: 'Estación de estudio',
      texto: 'La gravedad de un planeta depende de su masa y su tamaño. Mercurio es pequeño, así que atrae con menos fuerza: 3,70 m/s² contra los 9,81 de la Tierra. Tu masa (la cantidad de materia de tu cuerpo) es la misma en todas partes, pero tu peso (la fuerza con que el planeta te atrae) cambia de un mundo a otro.',
      detalle: [
        'Un cuerpo de 70 kg pesa unos 686 newton en la Tierra y solo unos 259 en Mercurio. Por eso saltarías casi al triple de altura con el mismo esfuerzo.',
        'Usa el selector de gravedad para comparar: Tierra, Mercurio, la Luna y una gravedad casi nula. Fíjate en cuánto tardas en volver a caer en cada una.'
      ],
      reto: 'Con la gravedad de la Luna, ¿saltas más alto o más bajo que en Mercurio? Revisa los números del selector y compruébalo saltando.'
    }
  ]
};
