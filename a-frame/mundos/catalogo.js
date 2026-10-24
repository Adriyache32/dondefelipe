/* =============================================================================
   Catálogo de los mundos 3D. La galería (index.html) lee SOLO este archivo:
   así no tiene que descargar todos los mundos (varios cientos de KB) para
   mostrar las tarjetas.

   oculto: true = guardado (no aparece en la galería, pero el archivo sigue y se abre
   con mundo.html#<id>). Para volver a mostrarlo, borra «oculto: true».

   Para agregar un mundo:
     1. Crea mundos/<id>.js registrando MUNDOS['<id>'] = { ... } (como los demás).
     2. Agrégalo aquí, en el grupo que corresponda.
     3. Se abre con mundo.html#<id>.
   ============================================================================= */
window.CATALOGO_MUNDOS = [
  { grupo: 'Ecosistemas de Chile', mundos: [
    { id: 'costa', oculto: true,  glifo: '🌊', color: '#2f89a8', titulo: 'Zonación del intermareal', materia: 'Biología · Ecosistemas',
      resumen: 'La costa rocosa de Chile central con la marea subiendo y bajando sobre cada franja, del bosque esclerófilo al huiro.' },
    { id: 'bosque', glifo: '🌿', color: '#4a7c53', titulo: 'Bosque esclerófilo · luz, agua y comunidad', materia: 'Biología · U3 Ecosistemas',
      resumen: 'Bosque de la Cordillera de la Costa, Región de Valparaíso. Palmar, quebrada de umbría y ladera de solana: la luz cambia al caminar.' },
    { id: 'andes', oculto: true,  glifo: '🏔️', color: '#8a94a6', titulo: 'Gradiente altitudinal andino', materia: 'Biología · Ciencias para la Ciudadanía',
      resumen: 'Del valle a la nieve permanente. La superficie que se mueve no es la marea: es el techo de nubes de la inversión térmica.' }
  ] },
  { grupo: 'Biología celular', mundos: [
    { id: 'celula', oculto: true, glifo: '🧬', color: '#5a9ec4', titulo: 'Dentro de una célula eucarionte', materia: 'Biología · 1° Medio y Ciencias para la Ciudadanía',
      resumen: 'Se entra por la membrana, se cruza un poro nuclear y se ve el ADN replicarse y transcribirse; después se sigue al ARNm hasta el ribosoma.' }
  ] },
  { grupo: 'Sistema Solar', mundos: [
    { id: 'mercurio', glifo: '🪐', color: '#b07850', titulo: 'Mercurio · la superficie', materia: 'Física · Astronomía',
      resumen: 'El planeta más cercano al Sol. Gravedad real ajustable para sentir cómo saltaría un humano en Mercurio.' },
    { id: 'venus', oculto: true,    glifo: '🌋', color: '#cf7f34', titulo: 'Venus · el planeta invernadero', materia: 'Física · Química · Geología',
      resumen: 'Superficie volcánica bajo una atmósfera densa de CO₂: por qué Venus es el planeta más caliente del Sistema Solar.' }
  ] },
  { grupo: 'Ciudad', mundos: [
    { id: 'villa-alemana', oculto: true, glifo: '🚉', color: '#c98a3c', titulo: 'Villa Alemana: la estación', materia: 'Mundo urbano',
      resumen: 'La estación de Villa Alemana con sus trenes. Base para reconstruir la ciudad con orden.' }
  ] }
];
