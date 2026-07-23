/* =============================================================================
   COLEGIO SAN AGUSTÍN — Configuración para MUNDO.js
   -----------------------------------------------------------------------------
   Basado en las zonas de las imágenes:
   - Recepción / Entrada principal con insignia y cuadro.
   - Pasillo acristalado / Conexión.
   - Sala de clases con estudiantes / mobiliario.
   - Multicancha deportiva azul con reja, arcos y torre/capilla de fondo.
   ============================================================================= */

var COLEGIO_SAN_AGUSTIN = {
  titulo: 'Colegio San Agustín',
  cielo: '#8eb3cc',
  niebla: { color: '#b2c8d6', cerca: 40, lejos: 110 },
  luz: {
    cielo: '#dcebf2',
    suelo: '#706550',
    ambiente: 0.88,
    sol: '#fff4db',
    intensidad: 0.8,
    posicion: '-15 28 20'
  },
  inicio: '0 3.2 28',
  ancho: 110,
  anchoVida: 80,

  /* ----------------------------------------------------------- Vistas rápidas */
  vistas: {
    recepcion: { etiqueta: 'Recepción', pos: '0 3.2 24', pitch: -5, yaw: 0 },
    pasillo:   { etiqueta: 'Pasillo Acristalado', pos: '0 3.2 6', pitch: 0, yaw: 0 },
    multicancha: { etiqueta: 'Multicancha', pos: '18 3.2 -14', pitch: -10, yaw: -30 },
    sala:       { etiqueta: 'Sala de Clases', pos: '-18 3.2 -14', pitch: -5, yaw: 30 }
  },

  /* ------------------------------------------------------------- Franjas (Suelo) */
  franjas: [
    {
      id: 'recepcion_franja',
      nombre: 'Entrada y Recepción',
      y: 0,
      z: [32, 18],
      color: '#d6d0c4',
      superficie: 'baldosa'
    },
    {
      id: 'pasillo_franja',
      nombre: 'Pasillo Principal',
      y: 0,
      z: [18, -2],
      color: '#2b2d30',
      superficie: 'asfalto',
      hueco: 6
    },
    {
      id: 'patios_franja',
      nombre: 'Zona de Aulas y Multicancha',
      y: 0,
      z: [-2, -32],
      color: '#28416d', // Tono azul deportivo de la cancha
      superficie: 'asfalto'
    }
  ],

  /* ----------------------------------------------------------------- Objetos */
  objetos: [
    /* === RECEPCIÓN (Basado en la foto de la entrada) === */
    {
      forma: 'caja',
      color: '#e8e4dc', // Pared trasera recepción
      pos: [0, 1.5, 20],
      giro: 0,
      cuerpo: { x: 12, y: 3, z: 0.2 }
    },
    {
      forma: 'caja',
      color: '#b8860b', // Mostrador / Contador de madera
      pos: [0, 0.6, 22],
      giro: 0,
      piso: { ancho: 8, largo: 1.2, alto: 1.1, color: '#c49a45' },
      ficha: 'ficha_recepcion',
      nombre: 'Recepción Colegio'
    },

    /* === PASILLO ACRISTALADO (Foto del corredor con ventanas) === */
    // Ventanales laterales esquematizados con la forma "vidrio"
    { forma: 'caja', color: '#ffffff', pos: [-6, 1.6, 8], giro: 0, acabado: 'vidrio' },
    { forma: 'caja', color: '#ffffff', pos: [6, 1.6, 8], giro: 0, acabado: 'vidrio' },

    /* === MULTICANCHA DEPORTIVA (Foto de la cancha azul) === */
    {
      forma: 'caja',
      color: '#1a5fb4', // Suelo azul cancha
      pos: [18, 0.05, -16],
      giro: 0,
      piso: { ancho: 22, largo: 28, alto: 0.1, color: '#1a5fb4' },
      nombre: 'Multicancha'
    },
    {
      forma: 'caja',
      color: '#26a269', // Borde verde de la cancha
      pos: [30, 0.05, -16],
      giro: 0,
      piso: { ancho: 2, largo: 28, alto: 0.1, color: '#26a269' }
    },
    // Estructura del tablero de básquetbol / Arco
    {
      forma: 'poste',
      color: '#ffffff',
      pos: [18, 0, -28],
      giro: 0,
      esc: [0.15, 3.5, 0.15]
    },
    {
      forma: 'caja',
      color: '#ffffff',
      pos: [18, 3.2, -27.8],
      giro: 0,
      esc: [1.8, 1.05, 0.1]
    },

    /* === CAPILLA / TORRE ROJA (De fondo tras la cancha) === */
    {
      forma: 'cono',
      color: '#a51d2d', // Campanario / Techo rojo
      pos: [22, 10, -36],
      giro: 0,
      esc: [3.5, 7, 3.5],
      nombre: 'Capilla'
    },

    /* === SALA DE CLASES (Foto del grupo de alumnos) === */
    {
      forma: 'caja',
      color: '#deddda', // Muros del aula
      pos: [-18, 1.8, -16],
      giro: 0,
      piso: { ancho: 14, largo: 18, alto: 0.1, color: '#77767b' },
      nombre: 'Sala de Clases'
    },

    /* === PERSONAJES / ESTUDIANTES === */
    {
      forma: 'persona',
      pos: [-16, 0, -14],
      giro: 45,
      dialogo: 'dialogo_alumnos',
      cuerpo: {
        piel: '#d08c62',
        pelo: '#1a1a1a',
        chaqueta: '#24272e', // Polerón oscuro
        pantalon: '#1b1d22',
        altura: 1.68
      }
    },
    {
      forma: 'persona',
      pos: [-14, 0, -12],
      giro: -30,
      cuerpo: {
        piel: '#e0a882',
        pelo: '#4a2e18',
        chaqueta: '#24272e',
        pantalon: '#215d9c', // Jeans
        altura: 1.72
      }
    },
    {
      forma: 'persona',
      pos: [2, 0, 21], // Recepcionista
      giro: 180,
      cuerpo: {
        piel: '#c88d6b',
        pelo: '#332211',
        chaqueta: '#8b0000',
        pantalon: '#15171b',
        altura: 1.65
      },
      dialogo: 'dialogo_recepcion'
    }
  ],

  /* -------------------------------------------------- Fichas Informativas */
  fichas: [
    {
      id: 'ficha_recepcion',
      nombre: 'Recepción San Agustín',
      rango: 'Edificio Principal',
      texto: 'Punto de acceso e información del establecimiento.',
      detalle: [
        'Cuenta con atención a apoderados y la insignia institucional destacada en el hall.',
        'Conecta directamente con el pasillo acristalado de distribución.'
      ]
    },
    {
      id: 'recepcion_franja',
      nombre: 'Hall de Entrada',
      texto: 'Zona de acceso pavimentada con baldosas claras.'
    },
    {
      id: 'pasillo_franja',
      nombre: 'Pasillo Acristalado',
      texto: 'Corredor techado con amplios ventanales que protegen del clima y conectan los pabellones.'
    },
    {
      id: 'patios_franja',
      nombre: 'Patio de Aulas y Deportes',
      texto: 'Zona abierta que alberga la multicancha azul y los pabellones de clases.'
    }
  ],

  /* ------------------------------------------------------------- Diálogos */
  dialogos: {
    dialogo_recepcion: {
      nombre: 'Secretaría / Recepción',
      inicio: 'inicio',
      nodos: {
        inicio: {
          texto: '¡Hola! Bienvenid@ al Colegio San Agustín. ¿Qué lugar deseas visitar?',
          opciones: [
            { dice: 'Ver información de la recepción', ficha: 'ficha_recepcion' },
            { dice: 'Ir a las salas de clases', va: 'salas' },
            { dice: 'Gracias, solo estoy explorando', va: null }
          ]
        },
        salas: {
          texto: 'Las salas se encuentran cruzando el pasillo acristalado, hacia el patio principal.',
          opciones: [{ dice: 'Entendido' }]
        }
      }
    },
    dialogo_alumnos: {
      nombre: 'Estudiantes de 4° Medio',
      inicio: 'inicio',
      nodos: {
        inicio: {
          texto: '¡Hola profe! Estamos preparando las actividades del diario mural y organizando la sala.',
          opciones: [{ dice: '¡Excelente trabajo, sigan así!' }]
        }
      }
    }
  }
};