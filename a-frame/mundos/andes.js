/* =============================================================================
   MUNDO: andes — gradiente altitudinal de los Andes de Chile central
   Existe para demostrar que el motor no sabe nada de costas: acá la superficie
   que sube y baja no es la marea, es la capa de nubes de la inversión térmica.
   Ninguna forma nueva: todas se reutilizan del motor.
   ============================================================================= */
/* Red de seguridad: este archivo puede cargarse con el motor completo, con un
   motor antiguo, o con el maniquí de la portada. Que no reviente en ningún caso. */
window.MUNDO = window.MUNDO || {};
if (!MUNDO.forma)  MUNDO.forma  = function () {};
if (!MUNDO.animar) MUNDO.animar = function () {};
if (!MUNDO.grupos) MUNDO.grupos = {};

window.MUNDOS = window.MUNDOS || {};
window.MUNDOS.andes = {

  titulo: 'Gradiente altitudinal andino',
  clima: { inicial: 'despejado', real: true, auto: false, fallback: { lat: -33.0, lon: -70.3 } },
  materia: 'Biología · Ciencias para la Ciudadanía',
  resumen: 'Del valle a la nieve permanente. Acá la superficie que se mueve no es la marea: es el techo de nubes de la inversión térmica.',
  cielo: '#7fa3c4',
  niebla: { color: '#b9c9d4', cerca: 60, lejos: 220 },
  luz: { cielo: '#dceaf2', suelo: '#8d8060', ambiente: 0.9, sol: '#fff4dc', intensidad: 0.8 },

  ancho: 110,
  anchoVida: 74,
  inicio: '0 3 48',

  vistas: {
    valle:  { etiqueta: 'El valle',            pos: '0 3 48',   pitch: -2,  yaw: 0 },
    perfil: { etiqueta: 'Vista de perfil',     pos: '48 22 0',  pitch: -20, yaw: 90 },
    cumbre: { etiqueta: 'Sobre el mar de nubes', pos: '0 22 -40', pitch: -8, yaw: 0 }
  },

  nivel: {
    nombre: 'Techo de nubes', unidad: 'm',
    alto: 15, bajo: 4.5, periodo: 42000,
    color: '#eef3f6', opacidad: 0.55, aspereza: 1, oleaje: true, brillo: false, centroZ: -20,
    modos: [
      { id: 'ciclo', etiqueta: 'Ciclo diario' },
      { id: 'alta',  etiqueta: 'Nubosidad alta' },
      { id: 'baja',  etiqueta: 'Día despejado' }
    ]
  },

  franjas: [
    {
      id: 'valle', nombre: 'Valle y bosque esclerófilo', rango: '600 – 1.000 m',
      z: [62, 38], y: 1, color: '#8b7c55', superficie: 'tierra',
      texto: 'El piso más cálido y con más agua disponible. Aquí el bosque esclerófilo alcanza su mayor porte, sobre todo en las quebradas de umbría, donde la ladera sombreada retiene humedad todo el verano.',
      vida: ['Quillay y peumo en quebradas húmedas', 'Litre en laderas expuestas', 'Espino donde el suelo está degradado'],
      reto: '¿Por qué el mismo cerro tiene bosque denso en una ladera y espinal en la otra? Piensa en cuántas horas de sol recibe cada una.',
      especies: [
        { forma: 'quillay', n: 40, color: '#6f8256', nombre: 'Quillay', choca: { r: 0.34, alto: 6 } },
        { forma: 'peumo',   n: 34, color: '#3f5c34', nombre: 'Peumo', choca: { r: 0.3, alto: 5 } },
        { forma: 'litre',   n: 40, color: '#5c7040', nombre: 'Litre', choca: { r: 0.24, alto: 3.5 } },
        { forma: 'espino',  n: 30, color: '#818c5e', nombre: 'Espino', choca: { r: 0.24, alto: 3.5 } }
      ]
    },
    {
      id: 'montano', nombre: 'Matorral montano', rango: '1.000 – 1.800 m',
      z: [38, 16], y: 6, color: '#8a7a58', superficie: 'tierra',
      texto: 'Los árboles se achaparran y aparecen las suculentas. Es la franja que más cambia entre día y noche: por las mañanas suele quedar dentro de la capa de nubes, y esa humedad la sostiene.',
      vida: ['Quisco (<i>Echinopsis chiloensis</i>)', 'Chagual (<i>Puya chilensis</i>)', 'Litre achaparrado y arbustos espinosos'],
      reto: 'Sube el techo de nubes con el botón de nubosidad alta. ¿Qué franjas quedan adentro? Esa niebla es agua que la planta puede capturar sin que llueva.',
      especies: [
        { forma: 'columna', n: 44, color: '#55703f', nombre: 'Quisco', choca: { r: 0.3, alto: 3.5 } },
        { forma: 'roseta',  n: 38, color: '#7d8b6a', nombre: 'Chagual' },
        { forma: 'litre',   n: 26, color: '#57683c', nombre: 'Litre achaparrado', choca: { r: 0.24, alto: 3.5 } }
      ]
    },
    {
      id: 'estepa', nombre: 'Estepa altoandina', rango: '1.800 – 2.600 m',
      z: [16, -8], y: 12, color: '#8f8467', superficie: 'tierra',
      texto: 'Se acaban los árboles. El límite arbóreo no lo pone el frío del invierno sino la brevedad del verano: no alcanza a haber temporada suficiente para que un árbol forme madera nueva. Domina el coirón, un pasto duro en matas separadas.',
      vida: ['Coirón (<i>Festuca</i>, <i>Stipa</i>) en matas aisladas', 'Suelo desnudo entre mata y mata', 'Roquerías con líquenes'],
      reto: 'Las matas de coirón crecen separadas y no formando pradera continua. ¿Por qué le conviene a cada mata mantener distancia de la vecina?',
      especies: [
        { forma: 'pasto',  n: 220, color: '#a89a63', nombre: 'Coirón' },
        { forma: 'roca',   n: 40,  color: '#7c7364', nombre: 'Roquerío' },
        { forma: 'costra', n: 40,  color: '#5c6152', nombre: 'Liquen' }
      ]
    },
    {
      id: 'llareta', nombre: 'Llaretas y pedregales', rango: '2.600 – 3.300 m',
      z: [-8, -32], y: 18, color: '#8d8778', superficie: 'roca',
      texto: 'La vida se pega al suelo. La llareta crece como un cojín compacto que atrapa calor y frena el viento: por dentro puede estar varios grados más tibia que el aire. Crece milímetros por año y algunos cojines tienen siglos.',
      vida: ['Llareta (<i>Azorella</i>), cojín compacto y muy longevo', 'Plantas en roseta pegadas a la roca', 'Líquenes sobre pedregal'],
      reto: 'Un cojín de llareta de un metro puede tener más de 200 años. ¿Qué le pasa a esa población si se extrae para leña?',
      especies: [
        { forma: 'cojin',  n: 70, color: '#7f9445', nombre: 'Llareta' },
        { forma: 'roca',   n: 90, color: '#847c6d', nombre: 'Pedregal' },
        { forma: 'costra', n: 50, color: '#6b6f5c', nombre: 'Liquen' }
      ]
    },
    {
      id: 'nieve', nombre: 'Nieve permanente', rango: 'Sobre los 3.300 m',
      z: [-32, -62], y: 24, color: '#dfe7ec', superficie: 'nieve',
      texto: 'Sobre la línea de nieve permanente ya no hay vegetación vascular. Esta franja es la que alimenta los ríos de la zona central: el agua que riega el valle en enero es la nieve que cayó aquí en julio.',
      vida: ['Nieve y hielo permanentes', 'Algas de nieve que la tiñen de rosado en verano', 'Sin plantas con raíz'],
      reto: 'Si la línea de nieve sube 300 m por el calentamiento, ¿qué le ocurre al caudal de los ríos en verano? Piensa en el estanque, no en la lluvia.',
      especies: [
        { forma: 'roca',   n: 40, color: '#c9d4da', nombre: 'Roca expuesta' },
        { forma: 'costra', n: 26, color: '#d8b6bd', nombre: 'Alga de nieve' }
      ]
    }
  ]
};
