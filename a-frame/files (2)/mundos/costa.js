/* =============================================================================
   MUNDO: costa — zonación del intermareal de Chile central
   Solo datos. Toda la maquinaria vive en mundo.js.
   ============================================================================= */
window.MUNDOS = window.MUNDOS || {};
window.MUNDOS.costa = {

  titulo: 'Zonación del intermareal',
  materia: 'Biología · Ecosistemas',
  resumen: 'La costa rocosa de Chile central con la marea subiendo y bajando sobre cada franja, del bosque esclerófilo al huiro.',
  cielo: '#9db8c4',
  niebla: { color: '#a8bcc4', cerca: 55, lejos: 200 },
  luz: { cielo: '#cfe3ea', suelo: '#8a7c5c', ambiente: 0.85, sol: '#fff0d4', intensidad: 0.7 },

  ancho: 110,
  anchoVida: 74,
  inicio: '0 3.2 26',

  vistas: {
    bosque:   { etiqueta: 'El bosque esclerófilo', pos: '0 6 30',   pitch: -4,  yaw: 180 },
    perfil:   { etiqueta: 'Vista de perfil',       pos: '46 13 -6', pitch: -17, yaw: 90 },
    orilla:   { etiqueta: 'Desde la orilla',       pos: '0 3.2 26', pitch: -6,  yaw: 0 },
    bajoagua: { etiqueta: 'Bajo el agua',          pos: '0 0 -28',  pitch: 4,   yaw: 0 }
  },

  // La superficie que sube y baja. Acá es el mar; en otro mundo puede ser
  // la línea de nieve o la napa freática.
  nivel: {
    nombre: 'Nivel del mar', unidad: 'm',
    alto: 1.75, bajo: 0.15, periodo: 30000,
    color: '#1c5f78', opacidad: 0.74, aspereza: 0.25, oleaje: true, centroZ: -90,
    modos: [
      { id: 'ciclo', etiqueta: 'Ciclo de marea' },
      { id: 'alta',  etiqueta: 'Pleamar' },
      { id: 'baja',  etiqueta: 'Bajamar' }
    ]
  },

  fondo: { y: -5.3, z: -103, color: '#3b4238' },

  cielos: [
    { id: 'luna', posicion: '-22 24 -42', radio: 1.5, color: '#efe6d0' }
  ],

  franjas: [
    {
      id: 'bosque', nombre: 'Matorral y bosque esclerófilo',
      rango: 'Ladera costera, sobre la duna',
      z: [62, 34], y: 4.4, color: '#8b7c55', superficie: 'tierra',
      texto: 'La vegetación que resiste el verano seco de Chile central. Esclerófilo significa "de hoja dura": hojas gruesas, rígidas y con cutícula cerosa que pierden muy poca agua. Esta ladera además recibe camanchaca, la neblina costera que aporta humedad en meses sin lluvia.',
      vida: [
        'Quillay (<i>Quillaja saponaria</i>), corteza con saponinas',
        'Peumo (<i>Cryptocarya alba</i>) y litre (<i>Lithraea caustica</i>)',
        'Espino (<i>Vachellia caven</i>), indicador de suelo degradado',
        'Quisco (<i>Echinopsis chiloensis</i>) y chagual (<i>Puya chilensis</i>) en lo más seco'
      ],
      reto: 'Toma una hoja de peumo y una de la duna. ¿Qué tienen en común las plantas que viven donde el agua escasea, aunque sean de familias distintas?',
      especies: [
        { forma: 'quillay',  n: 46, color: '#6f8256', nombre: 'Quillay' },
        { forma: 'peumo',    n: 42, color: '#3f5c34', nombre: 'Peumo' },
        { forma: 'litre',    n: 48, color: '#5c7040', nombre: 'Litre' },
        { forma: 'espino',   n: 34, color: '#818c5e', nombre: 'Espino' },
        { forma: 'columna',  n: 30, color: '#55703f', nombre: 'Quisco' },
        { forma: 'roseta',   n: 26, color: '#7d8b6a', nombre: 'Chagual' }
      ]
    },
    {
      id: 'duna', nombre: 'Duna y playa de arena', rango: 'Sobre la línea de pleamar',
      z: [34, 12], y: 2.6, color: '#e0cfa5', superficie: 'arena',
      texto: 'Sustrato móvil: la arena se reordena con cada temporal, así que casi nada logra fijarse a ella. Los que viven aquí lo hacen enterrados, y suben o bajan dentro de la arena siguiendo el vaivén del agua.',
      vida: [
        'Doca (<i>Carpobrotus aequilaterus</i>), que fija la arena de la duna',
        'Pulga de mar (<i>Orchestoidea tuberculata</i>), activa de noche',
        'Macha y taquilla, enterradas en la zona de lavado',
        'Gaviotas y pilpilenes alimentándose en la marca de marea'
      ],
      reto: 'La arena guarda una línea de restos: algas, conchas, plumas. ¿Qué momento de la marea registra esa línea y por qué queda justo ahí?',
      especies: [
        { forma: 'flor',   n: 40, color: '#4f7a4a', nombre: 'Doca' },
        { forma: 'pasto',  n: 90, color: '#8d9a5b', nombre: 'Pasto de duna' },
        { forma: 'concha', n: 70, color: '#efe4cf', nombre: 'Conchas de macha' }
      ]
    },
    {
      id: 'supra', nombre: 'Supralitoral', rango: 'Zona de salpicadura · casi nunca sumergida',
      z: [12, 4], y: 2.0, color: '#6f6a5c', superficie: 'roca',
      texto: 'La marea no la cubre: solo la alcanza el rocío de las olas. Es el ambiente más extremo del intermareal, porque suma desecación, sol directo y cambios bruscos de salinidad cuando el agua se evapora en las grietas.',
      vida: [
        'Líquenes negros costeros, capaces de perder casi toda su agua',
        'Caracolitos <i>Echinolittorina peruviana</i>, sellados a la roca con mucus',
        'Chitones pequeños refugiados en grietas húmedas'
      ],
      reto: 'Aquí viven muy pocas especies, pero en gran número. ¿Qué limita quién puede vivir acá: la competencia o el ambiente físico?',
      especies: [
        { forma: 'caracol', n: 90, color: '#3b3730', nombre: 'Litorina' },
        { forma: 'costra',  n: 40, color: '#2f2b26', nombre: 'Liquen negro' }
      ]
    },
    {
      id: 'meso-sup', nombre: 'Mesolitoral superior', rango: 'Cubierta solo en pleamar',
      z: [4, -5], y: 1.45, color: '#635f55', superficie: 'roca',
      texto: 'Queda expuesta al aire varias horas al día. El picoroco chico cierra sus placas al quedar seco y guarda agua adentro: esa solución le permite dominar la franja donde pocos resisten.',
      vida: [
        'Picoroco chico (<i>Jehlius cirratus</i>), en densas costras blancas',
        'Litorinas que pastorean la película de microalgas',
        'Algas verdes efímeras después de las lluvias'
      ],
      reto: 'Los picorocos forman una banda con un borde superior muy nítido. ¿Qué determina ese límite de arriba y qué determina el de abajo? No son la misma causa.',
      especies: [
        { forma: 'campana', n: 320, color: '#d8d2c4', nombre: 'Picoroco chico' },
        { forma: 'caracol', n: 60,  color: '#4a443b', nombre: 'Litorina' }
      ]
    },
    {
      id: 'meso-med', nombre: 'Mesolitoral medio', rango: 'Alterna aire y agua dos veces al día',
      z: [-5, -14], y: 0.9, color: '#585448', superficie: 'roca',
      texto: 'La franja del chorito maico. Este mejillón pequeño tapiza la roca y forma una matriz donde se refugian decenas de especies: es un organismo ingeniero, construye hábitat para otros. Aquí la competencia por espacio es la fuerza que manda.',
      vida: [
        'Chorito maico (<i>Perumytilus purpuratus</i>), cinturón continuo',
        'Lapas (<i>Fissurella</i>) y chitones que raspan algas',
        'Sol de mar (<i>Heliaster helianthus</i>), depredador que sube con la marea'
      ],
      reto: 'Si raspáramos todo el chorito de un cuadrado de 50 cm, ¿qué esperarías encontrar ahí un año después? Escribe tu predicción antes de abrir la zona siguiente.',
      especies: [
        { forma: 'valva',     n: 700, color: '#3a2f3d', nombre: 'Chorito maico' },
        { forma: 'capuchon',  n: 70,  color: '#b8a884', nombre: 'Lapa' }
      ]
    },
    {
      id: 'meso-inf', nombre: 'Mesolitoral inferior', rango: 'Descubierta solo en bajamares de sicigia',
      z: [-14, -23], y: 0.35, color: '#4e4b42', superficie: 'roca',
      texto: 'Pasa casi todo el tiempo bajo el agua, así que el estrés físico deja de mandar y toman el control la depredación y la competencia. Es la franja con mayor diversidad de todo el intermareal.',
      vida: [
        'Piure (<i>Pyura chilensis</i>), filtrador que forma manchones',
        'Loco (<i>Concholepas concholepas</i>), depredador de choritos',
        'Anémonas, algas rojas y pozas de marea'
      ],
      reto: 'Compara el número de especies de esta zona con el del supralitoral. ¿Cómo explicarías la diferencia usando las palabras <i>estrés</i> y <i>competencia</i>?',
      especies: [
        { forma: 'anemona', n: 60,  color: '#a8474f', nombre: 'Anémona' },
        { forma: 'saco',    n: 80,  color: '#6d3b2a', nombre: 'Piure' },
        { forma: 'lamina',  n: 110, color: '#7d2f3a', nombre: 'Alga roja' }
      ]
    },
    {
      id: 'infra', nombre: 'Infralitoral', rango: 'Siempre sumergida',
      z: [-23, -58], y: -0.8, color: '#42402e', superficie: 'roca',
      texto: 'Bajo el nivel de la bajamar más extrema empieza el bosque de huiro. Estas algas gigantes se anclan a la roca con un disco y sostienen una comunidad completa: son el equivalente submarino de un bosque templado.',
      vida: [
        'Huiro negro (<i>Lessonia</i>) y huiro flotador (<i>Macrocystis</i>)',
        'Erizo rojo (<i>Loxechinus albus</i>), que pastorea las algas',
        'Jaibas, peces de roca y estrellas de mar'
      ],
      reto: 'Si la población de erizos creciera sin control, ¿qué pasaría con el bosque de huiro y con las especies que dependen de él?',
      especies: [
        { forma: 'fronda', n: 80, color: '#5c4520', nombre: 'Huiro' },
        { forma: 'erizo',  n: 45, color: '#7d2a2a', nombre: 'Erizo rojo' }
      ]
    }
  ],

  // Fichas que no son franjas (cuerpos del cielo, carteles, etc.)
  fichas: [
    {
      id: 'luna', nombre: '¿Por qué sube y baja el mar?',
      rango: 'Luna, Sol y rotación de la Tierra',
      texto: 'La Luna atrae con más fuerza el lado de la Tierra que la mira y con menos el lado opuesto: esa diferencia deforma la capa de agua en dos abultamientos. La Tierra gira bajo ellos, y por eso en la mayoría de nuestras costas pasan dos pleamares y dos bajamares cada 24 h 50 min.',
      vida: [
        '<b>Sicigia:</b> Luna nueva o llena, Sol y Luna alineados, mareas de mayor amplitud',
        '<b>Cuadratura:</b> Luna en cuarto, fuerzas en ángulo, mareas de menor amplitud',
        'La forma de la bahía amplifica o amortigua la amplitud local'
      ],
      reto: 'En la costa de Valparaíso la amplitud típica va de 1 a 1,8 m. ¿En qué fase lunar irías a la orilla si quisieras observar la parte más profunda del intermareal?'
    }
  ]
};
