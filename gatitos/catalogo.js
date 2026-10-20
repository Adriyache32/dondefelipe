/* Catálogo de la tienda de gatitos.
   ¡Ojo! Los precios también están en firebase/firestore.rules (función precioGatito):
   si cambias uno aquí, cámbialo allá y vuelve a publicar las reglas. */
window.RAREZAS = {
  comun:      { nombre: 'Común',      color: '#9aa3b2' },
  pococomun:  { nombre: 'Poco común', color: '#4bd08c' },
  raro:       { nombre: 'Raro',       color: '#22a7ff' },
  epico:      { nombre: 'Épico',      color: '#b26bff' },
  legendario: { nombre: 'Legendario', color: '#ff9f1c' },
  mitico:     { nombre: 'Mítico',     color: '#ff2e7e' }
};
window.GATITOS = [
  { id: 'naranjo',     nombre: 'Michi Naranjo',        precio: 10000,   rareza: 'comun',      txt: 'El clásico. Curioso, glotón y siempre al sol.' },
  { id: 'gris',        nombre: 'Gris Atigrado',        precio: 12000,   rareza: 'comun',      txt: 'Discreto como la niebla de la mañana.' },
  { id: 'dormilon',    nombre: 'Dormilón',             precio: 15000,   rareza: 'comun',      txt: 'Duerme 16 horas al día y no se arrepiente.' },
  { id: 'patitas',     nombre: 'Patitas Arriba',       precio: 18000,   rareza: 'comun',      txt: 'Te muestra la guatita. No caigas: es una trampa.' },
  { id: 'aseo',        nombre: 'Gatito Pulcro',        precio: 25000,   rareza: 'pococomun',  txt: 'Siempre impecable, sobre todo antes de una prueba.' },
  { id: 'blanconegro', nombre: 'Esmoquin',             precio: 30000,   rareza: 'pococomun',  txt: 'Blanco y negro, listo para la gala de fin de año.' },
  { id: 'tricolor',    nombre: 'Tricolor',             precio: 35000,   rareza: 'pococomun',  txt: 'Tres colores, cero dudas sobre quién manda.' },
  { id: 'comelon',     nombre: 'Comelón',              precio: 40000,   rareza: 'pococomun',  txt: 'Su plato nunca está lo bastante lleno.' },
  { id: 'siames',      nombre: 'Siamés',               precio: 60000,   rareza: 'raro',       txt: 'Ojos de cielo y opiniones muy firmes.' },
  { id: 'negro',       nombre: 'Medianoche',           precio: 70000,   rareza: 'raro',       txt: 'Trae buena suerte a quien lo cuida.' },
  { id: 'estirado',    nombre: 'Estiramiento',         precio: 80000,   rareza: 'raro',       txt: 'Experto en elongación antes de Educación Física.' },
  { id: 'jugueton',    nombre: 'Juguetón',             precio: 100000,  rareza: 'raro',       txt: 'Un ovillo de lana y es feliz toda la tarde.' },
  { id: 'caja',        nombre: 'Gato en Caja',         precio: 150000,  rareza: 'epico',      txt: '¿Está dormido o despierto? Abre la caja y descúbrelo.' },
  { id: 'tronco',      nombre: 'Guardián del Bosque',  precio: 200000,  rareza: 'epico',      txt: 'Vigila el bosque nativo desde su tronco de coihue.' },
  { id: 'barril',      nombre: 'Gato del Barril',      precio: 250000,  rareza: 'epico',      txt: 'Viajó de polizón en un barril desde Valparaíso.' },
  { id: 'muro',        nombre: 'Explorador del Muro',  precio: 400000,  rareza: 'legendario', txt: 'Ha recorrido todos los techos de Villa Alemana.' },
  { id: 'fantasma',    nombre: 'Gato Fantasma',        precio: 500000,  rareza: 'legendario', txt: 'Aparece en los pasillos cuando nadie mira.' },
  { id: 'cosmico',     nombre: 'Gato Cósmico',         precio: 750000,  rareza: 'mitico',     txt: 'Lleva una constelación en el pelaje. Vino del observatorio.' },
  { id: 'dorado',      nombre: 'Gato Dorado',          precio: 1000000, rareza: 'mitico',     txt: 'El más valioso del colegio. Muy pocos lo tendrán.' }
];
