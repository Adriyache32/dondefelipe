/* =============================================================================
   MODELOS 3D INSTANCIADOS (motor v11)
   -----------------------------------------------------------------------------
   Un modelo .glb (árbol, roca, arbusto…) se carga UNA vez y se dibuja cientos
   de veces con InstancedMesh: una llamada de dibujo por parte del modelo y por
   celda del mapa, sin importar cuántos ejemplares haya.

   Cómo lo usa un mundo:
     modelos: {
       quillay: { url: 'modelos/quillay.glb', lejos: 'modelos/quillay-lejos.glb',   // versión simplificada
                  escala: [1.7, 2.4],
                  viento: { Follaje: 0.05, Ramas: 0.015 },   // vaivén por parte (en la GPU)
                  tinte:  { Follaje: 0.10 } }                // variación de color por ejemplar
     },
     ... especies: [{ modelo: 'quillay', n: 30, choca: { r: 0.35, alto: 5 } }]

   Diseño (pensado para crecer):
   - Celdas: los ejemplares se agrupan por celdas de CELDA metros. Cada celda es
     una malla instanciada con su propia esfera envolvente → la cámara descarta
     sola lo que no ve (frustum culling) y lo lejano se apaga por distancia.
   - Viento en la GPU: el vaivén lo calcula el shader con la altura del vértice;
     la CPU no toca las matrices en cada cuadro (el motor antiguo sí lo hacía).
   - Nivel de detalle (LOD) por ejemplar: cerca se dibuja el modelo completo y,
     pasada la distancia MUNDO.calidad.lod, la versión simplificada (def.lejos,
     mismas partes con menos triángulos). Más allá de la distancia de dibujo, nada.
     Las versiones simplificadas se generan con meshoptimizer (ver modelos/LEEME.md).
   - Calidad: MUNDO.calidad (baja / media / alta) regula densidad y distancia de
     dibujo; se elige en el menú y se guarda en el navegador.
   - Partes por nombre: cada malla del .glb (Tronco, Ramas, Follaje) es una parte;
     el viento y el tinte se aplican por nombre, así un mismo sistema sirve para
     cualquier modelo que exportes con nombres claros.
   ============================================================================= */
(function () {
  'use strict';
  if (!window.MUNDO) window.MUNDO = {};

  /* ------------------------------------------------------------ calidad */
  var NIVELES = {
    baja:  { densidad: 0.55, distancia: 70,  lod: 22, nombre: 'Baja (equipos lentos)' },
    media: { densidad: 1,    distancia: 120, lod: 36, nombre: 'Media' },
    alta:  { densidad: 1.5,  distancia: 220, lod: 60, nombre: 'Alta (equipos potentes)' }
  };
  function nivelInicial() {
    try { var g = localStorage.getItem('mundo_calidad'); if (NIVELES[g]) return g; } catch (e) {}
    var movil = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
    return movil ? 'baja' : 'media';
  }
  var nivel = nivelInicial();
  MUNDO.calidad = Object.assign({ nivel: nivel }, NIVELES[nivel]);
  MUNDO.niveles = NIVELES;
  MUNDO.setCalidad = function (n) {
    if (!NIVELES[n]) return;
    try { localStorage.setItem('mundo_calidad', n); } catch (e) {}
    location.reload();   // la densidad cambia lo que se siembra: se reconstruye el mundo
  };

  /* ------------------------------------------------------------ carga */
  var CACHE = {};
  // Carga un .glb con el GLTFLoader que trae A-Frame (vía una entidad oculta) y
  // devuelve sus partes: [{ nombre, geometria, material }], en coordenadas del modelo.
  function cargar(url) {
    if (CACHE[url]) return CACHE[url];
    CACHE[url] = new Promise(function (ok, mal) {
      var escena = document.querySelector('a-scene');
      var e = document.createElement('a-entity');
      e.setAttribute('visible', false);
      e.setAttribute('position', '0 -999 0');
      var fin = function () { if (e.parentNode) e.parentNode.removeChild(e); };
      e.addEventListener('model-loaded', function () {
        var raiz = e.getObject3D('mesh'), partes = [];
        raiz.updateMatrixWorld(true);
        var inv = new THREE.Matrix4().copy(raiz.matrixWorld).invert();
        raiz.traverse(function (o) {
          if (!o.isMesh) return;
          var g = o.geometry.clone();
          // la transformación del nodo dentro del .glb queda horneada en la geometría
          g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
          if (!g.attributes.normal) g.computeVertexNormals();
          partes.push({ nombre: o.name || (o.parent && o.parent.name) || 'parte', geometria: g, material: o.material });
        });
        fin();
        partes.length ? ok(partes) : mal(new Error('El modelo no tiene mallas: ' + url));
      });
      e.addEventListener('model-error', function (ev) { fin(); mal(new Error('No se pudo cargar ' + url)); });
      e.setAttribute('gltf-model', 'url(' + url + ')');
      escena.appendChild(e);
    });
    return CACHE[url];
  }

  /* ------------------------------------------------------------ viento (GPU) */
  var uTiempo = { value: 0 };
  function conViento(material, fuerza) {
    var m = material.clone();
    m.onBeforeCompile = function (sh) {
      sh.uniforms.uTiempo = uTiempo;
      sh.vertexShader = 'uniform float uTiempo;\n' + sh.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\n' +
        '#ifdef USE_INSTANCING\n' +
        '  vec3 base_ = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);\n' +
        '#else\n  vec3 base_ = vec3(0.0);\n#endif\n' +
        // más vaivén arriba que abajo; fase distinta por ejemplar; dos ondas para que no sea mecánico
        '  float h_ = max(position.y, 0.0);\n' +
        '  float f_ = ' + fuerza.toFixed(4) + ' * h_ * h_;\n' +
        '  transformed.x += f_ * (sin(uTiempo * 1.3 + base_.x * 0.31 + base_.z * 0.17) + 0.35 * sin(uTiempo * 3.1 + base_.z * 0.9));\n' +
        '  transformed.z += f_ * 0.6 * sin(uTiempo * 1.1 + base_.z * 0.27 + base_.x * 0.13);');
    };
    m.customProgramCacheKey = function () { return 'viento' + fuerza; };
    return m;
  }

  /* ------------------------------------------------------------ celdas y distancia */
  var CELDA = 64;   // metros por celda (por modelo se puede cambiar con def.celda)
  var celdas = [];   // { x, z, mallas: [] }
  var _cam = new THREE.Vector3(), tAcum = 0;
  function actualizar(t, dt) {
    uTiempo.value = t / 1000;
    if (puertas.length) animarPuertas(dt || 16);
    tAcum += dt || 16;
    if (tAcum < 250) return;   // la distancia se revisa 4 veces por segundo, no en cada cuadro
    tAcum = 0;
    var cam = document.querySelector('a-scene') && document.querySelector('a-scene').camera;
    if (!cam) return;
    cam.getWorldPosition(_cam);
    var dMax = MUNDO.calidad.distancia, d2 = dMax * dMax, l2 = MUNDO.calidad.lod * MUNDO.calidad.lod;
    for (var i = 0; i < celdas.length; i++) {
      var c = celdas[i], dx = c.x - _cam.x, dz = c.z - _cam.z;
      var ver = dx * dx + dz * dz < d2 + c.r * c.r;
      if (ver !== c.ver) { c.ver = ver; for (var k = 0; k < c.mallas.length; k++) c.mallas[k].visible = ver; }
      if (ver) repartir(c, l2, d2);
    }
  }
  /* Nivel de detalle POR EJEMPLAR: cerca → modelo completo; lejos → versión
     simplificada; más allá de la distancia de dibujo → no se dibuja. Solo se
     reescriben las matrices si el reparto cambió. */
  function repartir(c, l2, d2) {
    var n = c.es.length, firma = '', cerca = [], lejos = [];
    for (var i = 0; i < n; i++) {
      var e = c.es[i], dx = e.x - _cam.x, dz = e.z - _cam.z, dd = dx * dx + dz * dz;
      if (!c.bajas.length || dd < l2) cerca.push(i); else if (dd < d2) lejos.push(i);
    }
    firma = cerca.join(',') + '|' + lejos.length;
    if (firma === c.firma) return;
    c.firma = firma;
    copiar(c.altas, cerca, c); copiar(c.bajas, lejos, c);
  }
  function copiar(mallas, idx, c) {
    for (var k = 0; k < mallas.length; k++) {
      var m = mallas[k], M = m.instanceMatrix.array, C = m.instanceColor && m.instanceColor.array;
      for (var j = 0; j < idx.length; j++) {
        var i = idx[j];
        for (var q = 0; q < 16; q++) M[j * 16 + q] = c.mat[i * 16 + q];
        if (C && m.userData.col) { C[j * 3] = m.userData.col[i * 3]; C[j * 3 + 1] = m.userData.col[i * 3 + 1]; C[j * 3 + 2] = m.userData.col[i * 3 + 2]; }
      }
      m.count = idx.length;
      m.instanceMatrix.needsUpdate = true;
      if (C) m.instanceColor.needsUpdate = true;
    }
  }
  if (MUNDO.animar) MUNDO.animar(actualizar);

  /* ------------------------------------------------------------ física de construcciones
     def.fisica: JSON que genera modelos/optimizar.mjs con, en coordenadas del modelo:
       cajas   [{dx,dz,ancho,largo,base,alto}]  → colisiones (muros, muebles)
       suelos  [{dx,dz,ancho,largo,alto}]       → superficies pisables (invisibles)
       puertas [{x0,x1,z,base,alto,grosor}]     → puerta doble que se abre al acercarse
     Se aplica a CADA copia con su posición, giro y escala. */
  var puertas = [], _cam2 = new THREE.Vector3();
  function mundoDe(e, dx, dz) {
    var g = (e.giro || 0) * Math.PI / 180, co = Math.cos(g), si = Math.sin(g), s = e.escala || 1;
    return [e.x + (dx * co + dz * si) * s, e.z + (-dx * si + dz * co) * s];
  }
  function aplicarFisica(id, lista, def, raiz) {
    return fetch(def.fisica).then(function (r) { if (!r.ok) throw new Error('sin física: ' + def.fisica); return r.json(); }).then(function (F) {
      var terreno = document.getElementById('terreno') || document.querySelector('a-scene');
      var hojas = [];   // { e, puerta, lado }
      lista.forEach(function (e) {
        var s = e.escala || 1;
        (F.cajas || []).forEach(function (c) {
          var w = mundoDe(e, c.dx, c.dz);
          MUNDO.chocaCaja(w[0], w[1], c.ancho * s, c.largo * s, e.y + (c.base || 0) * s, e.y + c.alto * s, e.giro || 0);
        });
        (F.suelos || []).forEach(function (c) {
          var w = mundoDe(e, c.dx, c.dz), b = document.createElement('a-box');
          b.setAttribute('class', 'suelo'); b.setAttribute('visible', 'false');
          b.setAttribute('width', c.ancho * s); b.setAttribute('depth', c.largo * s); b.setAttribute('height', 0.3);
          b.setAttribute('position', w[0] + ' ' + (e.y + c.alto * s - 0.15) + ' ' + w[1]);
          b.setAttribute('rotation', '0 ' + (e.giro || 0) + ' 0');
          terreno.appendChild(b);
        });
        (F.puertas || []).forEach(function (pu) {
          var cx = (pu.x0 + pu.x1) / 2, w = mundoDe(e, cx, pu.z);
          var choque = MUNDO.chocaCaja(w[0], w[1], (pu.x1 - pu.x0) * s, 0.3 * s, e.y + pu.base * s, e.y + (pu.base + pu.alto) * s, e.giro || 0);
          var p = { e: e, def: pu, x: w[0], z: w[1], ang: 0, meta: 0, choque: choque, y1: choque.y1, i: puertas.length };
          puertas.push(p); hojas.push(p);
        });
      });
      if (!hojas.length) return;
      // dos hojas por puerta, en DOS mallas instanciadas para todas las copias (2 llamadas de dibujo)
      var pu0 = F.puertas[0], ancho = (pu0.x1 - pu0.x0) / 2 - 0.02, alto = pu0.alto - 0.04, gr = pu0.grosor || 0.08;
      var mat = new THREE.MeshStandardMaterial({ color: def.colorPuerta || '#7a4e2e', roughness: 0.8 });
      var geoI = new THREE.BoxGeometry(ancho, alto, gr); geoI.translate(ancho / 2, alto / 2, 0);    // bisagra a la izquierda
      var geoD = new THREE.BoxGeometry(ancho, alto, gr); geoD.translate(-ancho / 2, alto / 2, 0);   // bisagra a la derecha
      var mi = new THREE.InstancedMesh(geoI, mat, hojas.length), md = new THREE.InstancedMesh(geoD, mat, hojas.length);
      mi.name = id + ':puertaI'; md.name = id + ':puertaD';
      mi.instanceMatrix.setUsage(THREE.DynamicDrawUsage); md.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      raiz.add(mi); raiz.add(md);
      hojas.forEach(function (p, k) { p.mi = mi; p.md = md; p.k = k; ponerHojas(p); });
      mi.computeBoundingSphere(); md.computeBoundingSphere();
      mi.boundingSphere.radius += 3; md.boundingSphere.radius += 3;
      MUNDO.refrescarSuelos();
    }).catch(function (e) { console.warn(e.message); });
  }
  var _mb = new THREE.Matrix4(), _mh = new THREE.Matrix4(), _mr = new THREE.Matrix4();
  function ponerHojas(p) {
    var e = p.e, s = e.escala || 1, pu = p.def;
    _p.set(e.x, e.y, e.z); _q.setFromAxisAngle(_ejeY, (e.giro || 0) * Math.PI / 180); _s.set(s, s, s);
    _mb.compose(_p, _q, _s);
    // hoja izquierda: bisagra en x0, abre hacia adentro (+z del modelo) → giro negativo
    _mh.makeTranslation(pu.x0 + 0.01, pu.base, pu.z); _mr.makeRotationY(-p.ang);
    p.mi.setMatrixAt(p.k, _m.multiplyMatrices(_mb, _mh).multiply(_mr));
    _mh.makeTranslation(pu.x1 - 0.01, pu.base, pu.z); _mr.makeRotationY(p.ang);
    p.md.setMatrixAt(p.k, _m.multiplyMatrices(_mb, _mh).multiply(_mr));
    p.mi.instanceMatrix.needsUpdate = true; p.md.instanceMatrix.needsUpdate = true;
  }
  var ABIERTA = 1.75, RADIO = 3.4;   // ~100°, y a cuántos metros se abre
  function animarPuertas(dt) {
    var cam = document.querySelector('a-scene') && document.querySelector('a-scene').camera;
    if (!cam) return;
    cam.getWorldPosition(_cam2);
    for (var i = 0; i < puertas.length; i++) {
      var p = puertas[i]; if (!p.mi) continue;
      var dx = _cam2.x - p.x, dz = _cam2.z - p.z, cerca = dx * dx + dz * dz < RADIO * RADIO * (p.e.escala || 1);
      p.meta = cerca ? ABIERTA : 0;
      if (Math.abs(p.ang - p.meta) < 0.001) continue;
      var paso = dt / 1000 * 2.4;
      p.ang += Math.max(-paso, Math.min(paso, p.meta - p.ang));
      p.choque.y1 = p.ang > 0.5 ? -1e9 : p.y1;   // abierta: se puede pasar; cerrada: bloquea
      ponerHojas(p);
    }
  }

  /* ------------------------------------------------------------ instanciar
     lista: [{ x, y, z, giro (°), escala }]. def: la entrada de M.modelos. */
  var _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(),
      _s = new THREE.Vector3(), _ejeY = new THREE.Vector3(0, 1, 0), _c = new THREE.Color();
  var stats = { modelos: 0, ejemplares: 0, mallas: 0 };
  MUNDO.modelosStats = stats;

  function instanciar(id, lista, def, padre) {
    def = def || {};
    // modelo completo y (si existe) su versión simplificada para lejos
    return Promise.all([cargar(def.url), def.lejos ? cargar(def.lejos).catch(function (e) { console.warn(e.message); return null; }) : null])
    .then(function (r) {
      var partes = r[0], partesL = r[1] || [];
      // agrupar por celda
      var grupos = {}, celdaM = def.celda || CELDA;
      lista.forEach(function (e) {
        var k = Math.floor(e.x / celdaM) + ',' + Math.floor(e.z / celdaM);
        (grupos[k] = grupos[k] || []).push(e);
      });
      // materiales por NOMBRE de parte, compartidos por ambas versiones y todas las celdas
      var mats = {};
      partes.concat(partesL).forEach(function (p) {
        if (mats[p.nombre]) return;
        var f = def.viento && def.viento[p.nombre];
        var m = f ? conViento(p.material, f) : p.material.clone();
        // color por parte (sRGB, como en el resto del mundo): ajusta el modelo a la paleta del bioma
        if (def.colores && def.colores[p.nombre]) m.color = new THREE.Color(def.colores[p.nombre]);
        mats[p.nombre] = m;
      });
      var raiz = new THREE.Group(); raiz.name = 'modelo-' + id;
      Object.keys(grupos).forEach(function (k) {
        var es = grupos[k], n = es.length, cx = 0, cz = 0;
        var celda = { es: es, mallas: [], altas: [], bajas: [], ver: true, r: celdaM, firma: null, mat: new Float32Array(n * 16) };
        es.forEach(function (e, i) {
          cx += e.x; cz += e.z;
          var s = e.escala || 1;
          _p.set(e.x, e.y, e.z); _q.setFromAxisAngle(_ejeY, (e.giro || 0) * Math.PI / 180);
          _s.set(s * (e.ancho || 1), s, s * (e.ancho || 1));
          _m.compose(_p, _q, _s).toArray(celda.mat, i * 16);
        });
        celda.x = cx / n; celda.z = cz / n;
        var hacer = function (p, lista, sufijo) {
          var malla = new THREE.InstancedMesh(p.geometria, mats[p.nombre], n);
          malla.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
          malla.instanceMatrix.array.set(celda.mat);
          var tinte = def.tinte && def.tinte[p.nombre];
          if (tinte) {
            // variación determinista por posición: claro/oscuro y un poco hacia amarillo o azul
            es.forEach(function (e, i) {
              var r1 = Math.sin(e.x * 12.9898 + e.z * 78.233) * 43758.5453; r1 -= Math.floor(r1);
              var r2 = Math.sin(e.x * 39.346 + e.z * 11.135) * 24634.6345; r2 -= Math.floor(r2);
              _c.setRGB(1, 1, 1).offsetHSL((r2 - 0.5) * tinte * 0.5, 0, (r1 - 0.5) * tinte * 2);
              malla.setColorAt(i, _c);
            });
            malla.userData.col = malla.instanceColor.array.slice();   // copia fija por ejemplar
          }
          malla.computeBoundingSphere();          // con TODAS las instancias de la celda
          if (malla.boundingSphere) malla.boundingSphere.radius += 2;   // margen por el viento
          malla.frustumCulled = true;
          malla.name = id + ':' + p.nombre + sufijo + '@' + k;
          raiz.add(malla); celda.mallas.push(malla); lista.push(malla); stats.mallas++;
        };
        partes.forEach(function (p) { hacer(p, celda.altas, ''); });
        partesL.forEach(function (p) { hacer(p, celda.bajas, '~lejos'); });
        celdas.push(celda);
      });
      (padre || document.querySelector('a-scene').object3D).add(raiz);
      if (def.fisica) aplicarFisica(id, lista, def, raiz);
      stats.modelos++; stats.ejemplares += lista.length;
      tAcum = 1e9;   // repartir cerca/lejos en el próximo cuadro
      return raiz;
    });
  }

  MUNDO.modelos = { cargar: cargar, instanciar: instanciar, CELDA: CELDA };
})();
