/* =============================================================================
   MUNDO.js — motor de mundos 3D por franjas
   -----------------------------------------------------------------------------
   Este archivo no sabe nada de costas, mareas ni choritos. Sabe dibujar
   franjas de terreno pobladas de organismos, con texturas procedurales,
   instanciación, viento, una superficie que sube y baja, fichas y navegación.

   El contenido vive en mundos/<id>.js. Ver LEEME.md.
   ============================================================================= */
(function (global) {
'use strict';

var MUNDO = {
  version: 7,
  formas: {},
  clima: { viento: 1 },
  datos: null
};

/* ---------------------------------------------------------------- utilidades */
var azar = function (a, b) { return a + Math.random() * (b - a); };
var rad = function (g) { return g * Math.PI / 180; };

function nuevo(tag, attrs) {
  var el = document.createElement(tag);
  for (var k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

/* ---------------------------------------------------------------- texturas
   Todo se dibuja en un canvas al cargar: sin archivos, sin CDN, sin peso.
   De un mismo mapa de altura salen el color y el normal map, por eso el
   relieve calza exacto con las manchas del color.                            */
var MOVIL_TEX = !!(AFRAME.utils.device && AFRAME.utils.device.isMobile &&
                   AFRAME.utils.device.isMobile());
var TAM_TEX = MOVIL_TEX ? 256 : 512;   // el doble de resolución que antes
var CACHE_TEX = {};

function lienzoAltura(estilo, tam) {
  var c = document.createElement('canvas');
  c.width = c.height = tam;
  var g = c.getContext('2d');
  g.fillStyle = '#808080';
  g.fillRect(0, 0, tam, tam);

  function manchas(cant, radio, fuerza) {
    for (var i = 0; i < cant; i++) {
      var x = Math.random() * tam, y = Math.random() * tam, r = radio * azar(0.6, 1.4);
      var claro = Math.random() > 0.5;
      var gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, claro ? 'rgba(255,255,255,' + fuerza + ')'
                               : 'rgba(0,0,0,' + fuerza + ')');
      gr.addColorStop(1, 'rgba(128,128,128,0)');
      g.fillStyle = gr;
      g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
    }
  }

  // grietas finas, para la roca
  function vetas(cant, t) {
    g.strokeStyle = 'rgba(0,0,0,0.22)';
    for (var i = 0; i < cant; i++) {
      var x = Math.random() * t, y = Math.random() * t;
      g.lineWidth = azar(0.5, 1.6);
      g.beginPath(); g.moveTo(x, y);
      for (var j = 0; j < 5; j++) { x += azar(-t * 0.06, t * 0.06); y += azar(-t * 0.06, t * 0.06); g.lineTo(x, y); }
      g.stroke();
    }
  }
  // ondulaciones suaves, para la arena
  function ondas(t, fuerza) {
    var img = g.getImageData(0, 0, t, t);
    for (var y = 0; y < t; y++) {
      var d = Math.sin(y / t * 6.2832 * 7) * 255 * fuerza;
      for (var x = 0; x < t; x++) {
        var i = (y * t + x) * 4;
        img.data[i] = Math.max(0, Math.min(255, img.data[i] + d));
        img.data[i + 1] = img.data[i]; img.data[i + 2] = img.data[i];
      }
    }
    g.putImageData(img, 0, 0);
  }

  if (estilo === 'baldosa') {
    // cuadrícula de baldosas: las juntas se convierten en surcos del normal map
    var paso = tam / 4;
    manchas(10, tam * 0.30, 0.10);
    g.strokeStyle = 'rgba(0,0,0,0.55)';
    g.lineWidth = Math.max(1.5, tam / 64);
    for (var q = 0; q <= 4; q++) {
      g.beginPath(); g.moveTo(q * paso, 0); g.lineTo(q * paso, tam); g.stroke();
      g.beginPath(); g.moveTo(0, q * paso); g.lineTo(tam, q * paso); g.stroke();
    }
    manchas(160, tam * 0.012, 0.18);
    return c;
  }
  if (estilo === 'asfalto') { manchas(10, tam * 0.3, 0.14); manchas(900, tam * 0.014, 0.4); return c; }
  if (estilo === 'pasto')   { manchas(14, tam * 0.22, 0.16); manchas(1800, tam * 0.010, 0.5); return c; }
  // Más octavas = más niveles de detalle, de la mancha grande al poro
  if (estilo === 'roca') {
    manchas(14, tam * 0.34, 0.30); manchas(40, tam * 0.15, 0.26);
    manchas(120, tam * 0.06, 0.24); manchas(420, tam * 0.022, 0.28);
    manchas(1400, tam * 0.007, 0.26); vetas(26, tam);
  } else if (estilo === 'arena') {
    manchas(8, tam * 0.34, 0.09); manchas(70, tam * 0.07, 0.07);
    manchas(4200, tam * 0.006, 0.42); ondas(tam, 0.06);
  } else if (estilo === 'nieve') {
    manchas(10, tam * 0.38, 0.07); manchas(300, tam * 0.05, 0.06);
    manchas(1600, tam * 0.008, 0.10);
  } else {
    manchas(12, tam * 0.28, 0.22); manchas(90, tam * 0.06, 0.26);
    manchas(360, tam * 0.02, 0.26); manchas(1500, tam * 0.007, 0.24);
  }
  return c;
}

function lienzoOlas(tam) {
  var c = document.createElement('canvas');
  c.width = c.height = tam;
  var g = c.getContext('2d');
  var img = g.createImageData(tam, tam);
  for (var y = 0; y < tam; y++) {
    for (var x = 0; x < tam; x++) {
      var u = x / tam * 6.2832, v = y / tam * 6.2832;
      var h = 128 + 45 * Math.sin(u * 3 + v * 1.2)
                  + 34 * Math.sin(u * 1.4 - v * 4)
                  + 20 * Math.sin((u + v) * 6);
      var i = (y * tam + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = h;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function normalDesde(altura, fuerza) {
  var tam = altura.width;
  var src = altura.getContext('2d').getImageData(0, 0, tam, tam).data;
  var out = document.createElement('canvas');
  out.width = out.height = tam;
  var ctx = out.getContext('2d');
  var img = ctx.createImageData(tam, tam);
  function h(x, y) {
    x = (x + tam) % tam; y = (y + tam) % tam;
    return src[(y * tam + x) * 4] / 255;
  }
  for (var y = 0; y < tam; y++) {
    for (var x = 0; x < tam; x++) {
      var nx = (h(x - 1, y) - h(x + 1, y)) * fuerza;
      var ny = (h(x, y - 1) - h(x, y + 1)) * fuerza;
      var l = Math.sqrt(nx * nx + ny * ny + 1) || 1;
      var i = (y * tam + x) * 4;
      img.data[i]     = (nx / l * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny / l * 0.5 + 0.5) * 255;
      img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

var ANISO = 0;
function anisotropia() {
  if (ANISO) return ANISO;
  var esc = document.querySelector('a-scene');
  var r = esc && esc.renderer;
  ANISO = (r && r.capabilities && r.capabilities.getMaxAnisotropy) ?
          Math.min(8, r.capabilities.getMaxAnisotropy()) : 1;
  return ANISO;
}

function aTextura(canvas, reps, esColor) {
  var t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(reps, reps);
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.anisotropy = anisotropia();   // nitidez en ángulos rasantes: el suelo deja de verse borroso a lo lejos
  if (esColor && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function superficie(base, estilo, reps) {
  var clave = base + '|' + estilo + '|' + reps;
  if (CACHE_TEX[clave]) return CACHE_TEX[clave];
  var altura = lienzoAltura(estilo, TAM_TEX);
  var col = document.createElement('canvas');
  col.width = col.height = TAM_TEX;
  var g = col.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, TAM_TEX, TAM_TEX);
  g.globalAlpha = 0.55;
  g.globalCompositeOperation = 'overlay';
  g.drawImage(altura, 0, 0);
  var fuerza = { arena: 3.5, baldosa: 7, asfalto: 4, pasto: 4, nieve: 2.5 }[estilo] || 7;
  var res = {
    mapa: aTextura(col, reps, true),
    normal: aTextura(normalDesde(altura, fuerza), reps, false),
    rugosidad: aTextura(altura, reps, false)   // lo alto brilla distinto que lo hundido
  };
  CACHE_TEX[clave] = res;
  return res;
}

var TEX_HOJAS = null;
function texturaHojas() {
  if (TEX_HOJAS) return TEX_HOJAS;
  var t = 128;
  var c = document.createElement('canvas');
  c.width = c.height = t;
  var g = c.getContext('2d');
  g.clearRect(0, 0, t, t);
  for (var i = 0; i < 320; i++) {
    g.save();
    g.translate(Math.random() * t, Math.random() * t);
    g.rotate(Math.random() * 6.2832);
    var luz = Math.floor(azar(150, 255));
    g.fillStyle = 'rgb(' + luz + ',' + luz + ',' + luz + ')';
    g.beginPath();
    g.ellipse(0, 0, azar(4, 9), azar(2, 4.5), 0, 0, 6.2832);
    g.fill();
    g.restore();
  }
  TEX_HOJAS = new THREE.CanvasTexture(c);
  TEX_HOJAS.wrapS = TEX_HOJAS.wrapT = THREE.RepeatWrapping;
  TEX_HOJAS.repeat.set(3, 3);
  if (THREE.SRGBColorSpace) TEX_HOJAS.colorSpace = THREE.SRGBColorSpace;
  return TEX_HOJAS;
}

/* ---------------------------------------------------------------- geometrías */
var GEOS = {};
function geo(clave) {
  if (GEOS[clave]) return GEOS[clave];
  var g;
  switch (clave) {
    case 'esfera':   g = new THREE.SphereGeometry(1, 8, 6); break;
    case 'esferaB':  g = new THREE.SphereGeometry(1, 6, 5); break;
    case 'cilindro': g = new THREE.CylinderGeometry(1, 1, 1, 7); break;
    case 'cono':     g = new THREE.ConeGeometry(1, 1, 7); break;
    case 'conoB':    g = new THREE.ConeGeometry(1, 1, 4); break;
    case 'tronco':   g = new THREE.CylinderGeometry(0.75, 1, 1, 6); break;
    case 'campana':  g = new THREE.CylinderGeometry(0.55, 1, 1, 7); break;
    case 'plano':    g = new THREE.PlaneGeometry(1, 1); break;
    case 'hoja':     g = new THREE.PlaneGeometry(1, 1); g.translate(0, 0.5, 0); break;
    case 'poste':    g = new THREE.CylinderGeometry(1, 1, 1, 8); g.translate(0, 0.5, 0); break;
    case 'circulo':  g = new THREE.CircleGeometry(1, 8); break;
    case 'toro':     g = new THREE.TorusGeometry(1, 0.28, 6, 10); break;
    default:         g = new THREE.BoxGeometry(1, 1, 1);
  }
  GEOS[clave] = g;
  return g;
}

/* ---------------------------------------------------------------- instancias */
var LOTES = {};
var _p = new THREE.Vector3(), _e = new THREE.Euler(),
    _q = new THREE.Quaternion(), _s = new THREE.Vector3(),
    _m = new THREE.Matrix4();

/* pieza(forma, color, acabado, base, offset, rotación°, escala, viento) */
var giroActual = 0;    // grados en Y aplicados a toda la figura
var grupoActual = null; // si tiene nombre, las piezas van a un grupo que puede moverse
MUNDO.grupos = {};

function pieza(forma, color, acabado, b, off, rot, esc, viento) {
  var clave = (grupoActual || '') + '|' + forma + '|' + color + '|' + acabado;
  var lote = LOTES[clave];
  if (!lote) lote = LOTES[clave] = { forma: forma, color: color, acabado: acabado,
                                     grupo: grupoActual, datos: [], viento: false };
  if (viento) lote.viento = true;
  var ox = off[0], oz = off[2];
  if (giroActual) {
    var co = Math.cos(rad(giroActual)), si = Math.sin(rad(giroActual));
    ox = off[0] * co + off[2] * si;
    oz = -off[0] * si + off[2] * co;
  }
  lote.datos.push({
    x: b[0] + ox, y: b[1] + off[1], z: b[2] + oz,
    rx: rot[0], ry: rot[1] + giroActual, rz: rot[2],
    sx: esc[0], sy: esc[1], sz: esc[2],
    v: viento || 0, fase: Math.random() * 6.2832
  });
}

function materialDe(color, acabado) {
  if (acabado === 'follaje') {
    return new THREE.MeshStandardMaterial({
      color: color, map: texturaHojas(), alphaTest: 0.45, roughness: 1, metalness: 0 });
  }
  if (acabado === 'lamina') {
    return new THREE.MeshStandardMaterial({
      color: color, side: THREE.DoubleSide, roughness: 0.95, metalness: 0 });
  }
  if (acabado === 'vidrio') {
    return new THREE.MeshStandardMaterial({
      color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.32,
      roughness: 0.08, metalness: 0.2 });
  }
  if (acabado === 'brillo') {   // no le afecta la luz: letreros, luminarias
    return new THREE.MeshBasicMaterial({ color: color });
  }
  if (acabado === 'metal') {
    return new THREE.MeshStandardMaterial({
      color: color, roughness: 0.32, metalness: 0.75 });
  }
  return new THREE.MeshStandardMaterial({ color: color, roughness: 0.9, metalness: 0 });
}

var vivos = [];   // lotes que mueve el viento

function volcarLotes(padre) {
  var raiz = new THREE.Group();
  padre.add(raiz);
  Object.keys(LOTES).forEach(function (clave) {
    var lote = LOTES[clave];
    var n = lote.datos.length;
    if (!n) return;
    var malla = new THREE.InstancedMesh(geo(lote.forma), materialDe(lote.color, lote.acabado), n);
    malla.frustumCulled = false;
    for (var i = 0; i < n; i++) {
      var d = lote.datos[i];
      _p.set(d.x, d.y, d.z);
      _e.set(rad(d.rx), rad(d.ry), rad(d.rz));
      _q.setFromEuler(_e);
      _s.set(d.sx, d.sy, d.sz);
      malla.setMatrixAt(i, _m.compose(_p, _q, _s));
    }
    malla.instanceMatrix.needsUpdate = true;
    var destino = raiz;
    if (lote.grupo) {
      if (!MUNDO.grupos[lote.grupo]) {
        MUNDO.grupos[lote.grupo] = new THREE.Group();
        raiz.add(MUNDO.grupos[lote.grupo]);
      }
      destino = MUNDO.grupos[lote.grupo];
    }
    destino.add(malla);
    if (lote.viento) vivos.push({ malla: malla, datos: lote.datos });
  });
}

/* ---------------------------------------------------------------- viento */
MUNDO.animaciones = [];
MUNDO.animar = function (fn) { MUNDO.animaciones.push(fn); };

var tViento = 0, ultimoV = performance.now(), _mv = new THREE.Matrix4();
function soplar(ahora) {
  requestAnimationFrame(soplar);
  var dt = Math.min(60, ahora - ultimoV);
  ultimoV = ahora;
  tViento += dt / 1000;
  var t = tViento;
  for (var a = 0; a < MUNDO.animaciones.length; a++) {
    try { MUNDO.animaciones[a](t, dt); } catch (e) { /* una animación rota no frena el resto */ }
  }
  if (!vivos.length || !MUNDO.clima.viento) return;
  for (var k = 0; k < vivos.length; k++) {
    var datos = vivos[k].datos, malla = vivos[k].malla;
    for (var i = 0; i < datos.length; i++) {
      var d = datos[i];
      var rafaga = 0.6 + 0.4 * Math.sin(t * 0.45 + d.x * 0.06);
      var a = d.v * MUNDO.clima.viento * rafaga;
      _p.set(d.x + Math.sin(t * 1.5 + d.fase) * a,
             d.y + Math.sin(t * 2.3 + d.fase) * a * 0.25,
             d.z + Math.cos(t * 1.2 + d.fase) * a * 0.6);
      _e.set(rad(d.rx), rad(d.ry), rad(d.rz + Math.sin(t * 1.5 + d.fase) * a * 12));
      _q.setFromEuler(_e);
      _s.set(d.sx, d.sy, d.sz);
      malla.setMatrixAt(i, _mv.compose(_p, _q, _s));
    }
    malla.instanceMatrix.needsUpdate = true;
  }
}
requestAnimationFrame(soplar);

/* ---------------------------------------------------------------- componentes */
AFRAME.registerComponent('mirar-camara', {
  init: function () { this.v = new THREE.Vector3(); },
  tick: function () {
    var cam = this.el.sceneEl.camera;
    if (!cam) return;
    cam.getWorldPosition(this.v);
    this.v.y = this.el.object3D.position.y;
    this.el.object3D.lookAt(this.v);
  }
});

AFRAME.registerComponent('caminar', {
  schema: { dir: { default: 0 }, vel: { default: 4.2 } },
  init: function () { this.d = new THREE.Vector3(); },
  tick: function (t, dt) {
    if (!this.data.dir || !dt) return;
    var cam = this.el.sceneEl.camera;
    if (!cam) return;
    cam.getWorldDirection(this.d);
    this.d.y = 0;
    if (this.d.lengthSq() < 0.0001) return;
    this.d.normalize();
    var p = this.el.object3D.position;
    var lim = MUNDO.limites;
    p.addScaledVector(this.d, this.data.dir * this.data.vel * dt / 1000);
    p.x = THREE.MathUtils.clamp(p.x, -lim.x, lim.x);
    p.z = THREE.MathUtils.clamp(p.z, lim.zMin, lim.zMax);
  }
});

AFRAME.registerComponent('piso-adherido', {
  schema: { altura: { default: 1.65 } },
  init: function () {
    this.ray = new THREE.Raycaster();
    this.abajo = new THREE.Vector3(0, -1, 0);
    this.origen = new THREE.Vector3();
    this.mallas = [];
    this.acum = 0;
  },
  tick: function (t, dt) {
    this.acum += dt;
    if (this.acum < 90) return;
    this.acum = 0;
    if (this.mallas.length === 0) {
      this.mallas = Array.prototype.slice.call(document.querySelectorAll('.suelo'))
        .map(function (e) { return e.getObject3D('mesh'); })
        .filter(function (m) { return !!m; });
      if (this.mallas.length === 0) return;
    }
    var p = this.el.object3D.position;
    this.origen.set(p.x, p.y + 14, p.z);
    this.ray.set(this.origen, this.abajo);
    var golpes = this.ray.intersectObjects(this.mallas, false);
    if (golpes.length) p.y += (golpes[0].point.y + this.data.altura - p.y) * 0.4;
  }
});

/* Superficie que sube y baja: marea, línea de nieve, napa freática… */
AFRAME.registerComponent('nivel', {
  schema: {
    modo: { default: 'ciclo' }, alto: { default: 2 }, bajo: { default: 0 },
    periodo: { default: 30000 }, nombre: { default: 'Nivel' }, unidad: { default: 'm' }
  },
  init: function () { this.t = 0; this.acum = 0; },
  tick: function (time, dt) {
    if (!dt) return;
    var d = this.data, destino;
    if (d.modo === 'alta') destino = d.alto;
    else if (d.modo === 'baja') destino = d.bajo;
    else {
      this.t += dt;
      var f = (Math.sin(2 * Math.PI * this.t / d.periodo - Math.PI / 2) + 1) / 2;
      destino = d.bajo + (d.alto - d.bajo) * f;
    }
    var p = this.el.object3D.position;
    p.y += (destino - p.y) * Math.min(1, dt / 400);
    this.acum += dt;
    if (this.acum > 120) {
      this.acum = 0;
      var v = p.y - (d.alto + d.bajo) / 2;
      var caja = document.getElementById('nivel-lectura');
      if (caja) {
        caja.textContent = d.nombre + ': ' + (v >= 0 ? '+' : '\u2212') +
          Math.abs(v).toFixed(2).replace('.', ',') + ' ' + d.unidad;
      }
    }
  }
});

AFRAME.registerComponent('oleaje', {
  schema: { vel: { default: 0.02 }, relieve: { default: 0.55 } },
  init: function () { this.listo = false; },
  tick: function (t, dt) {
    if (!dt) return;
    if (!this.listo) {
      var m = this.el.getObject3D('mesh');
      if (!m || !m.material) return;
      this.mat = m.material;
      this.mat.normalMap = aTextura(normalDesde(lienzoOlas(TAM_TEX), 4), 9, false);
      this.mat.normalScale.set(this.data.relieve, this.data.relieve);
      this.mat.needsUpdate = true;
      this.listo = true;
    }
    var n = this.mat.normalMap;
    n.offset.x += this.data.vel * dt / 1000;
    n.offset.y += this.data.vel * 0.55 * dt / 1000;
  }
});

/* ---------------------------------------------------------------- formas
   Un mundo nuevo puede registrar las suyas con MUNDO.forma(nombre, fn, alto). */
var ALTO_NOMBRE = {};
MUNDO.forma = function (nombre, fn, altoEtiqueta) {
  MUNDO.formas[nombre] = fn;
  ALTO_NOMBRE[nombre] = altoEtiqueta || 1;
};

var H = { pieza: pieza, azar: azar };

var ARBOLES = {
  quillay: { alto: [5, 7.6],   copa: [1.8, 2.6], aplana: 0.85, copas: 3, tronco: '#4d3b2a' },
  peumo:   { alto: [3.8, 6],   copa: [2.0, 2.8], aplana: 1.05, copas: 3, tronco: '#463527' },
  litre:   { alto: [2.6, 4.2], copa: [1.4, 2.2], aplana: 0.9,  copas: 2, tronco: '#52402d' },
  espino:  { alto: [2.8, 4.6], copa: [2.2, 3.2], aplana: 0.4,  copas: 2, tronco: '#463c2c' }
};
Object.keys(ARBOLES).forEach(function (tipo) {
  MUNDO.forma(tipo, function (H, color, b) {
    var a = ARBOLES[tipo];
    var alt = H.azar(a.alto[0], a.alto[1]), gr = alt * 0.05;
    H.pieza('tronco', a.tronco, 'solido', b, [0, alt / 2, 0], [0, 0, 0], [gr, alt, gr], 0);
    for (var i = 0; i < a.copas; i++) {
      var r = H.azar(a.copa[0], a.copa[1]) * (i ? 0.78 : 1);
      H.pieza('esfera', color, 'follaje', b,
        [H.azar(-r * 0.5, r * 0.5), alt + H.azar(-0.25, r * 0.5), H.azar(-r * 0.5, r * 0.5)],
        [0, H.azar(0, 360), 0], [r, r * a.aplana, r], 0.09);
    }
  }, { quillay: 8.6, peumo: 7.2, litre: 5, espino: 5.2 }[tipo]);
});

MUNDO.forma('columna', function (H, color, b) {          // quisco, cardón
  var alt = H.azar(2, 4);
  H.pieza('cilindro', color, 'solido', b, [0, alt / 2, 0], [0, 0, 0], [0.26, alt, 0.26], 0);
  if (Math.random() > 0.4) {
    var br = alt * 0.45;
    H.pieza('cilindro', color, 'solido', b, [0.42, alt * 0.62, 0], [0, 0, 0], [0.19, br, 0.19], 0);
  }
}, 4.4);

MUNDO.forma('roseta', function (H, color, b) {           // chagual, puya
  var r = H.azar(1, 1.6);
  for (var i = 0; i < 11; i++) {
    H.pieza('conoB', color, 'solido', b, [0, r * 0.35, 0],
      [H.azar(35, 70), i * 33 + H.azar(-8, 8), 0], [0.11, r, 0.11], 0.02);
  }
  if (Math.random() > 0.5) {
    var t = H.azar(1.8, 2.8);
    H.pieza('cilindro', '#6d7a4a', 'solido', b, [0, t / 2 + r * 0.3, 0], [0, 0, 0], [0.09, t, 0.09], 0.04);
  }
}, 3.4);

MUNDO.forma('cojin', function (H, color, b) {            // llareta, doca
  var r = H.azar(0.7, 1.4);
  H.pieza('esferaB', color, 'solido', b, [0, r * 0.1, 0], [0, 0, 0], [r, r * 0.35, r], 0);
}, 1.2);

MUNDO.forma('flor', function (H, color, b) {
  var r = H.azar(0.7, 1.4);
  H.pieza('esferaB', color, 'solido', b, [0, r * 0.1, 0], [0, 0, 0], [r, r * 0.16, r], 0);
  for (var i = 0; i < 3; i++) {
    H.pieza('circulo', '#c2478c', 'lamina', b,
      [H.azar(-r * 0.7, r * 0.7), r * 0.2, H.azar(-r * 0.7, r * 0.7)], [-90, 0, 0], [0.11, 0.11, 0.11], 0);
  }
}, 1.2);

MUNDO.forma('pasto', function (H, color, b) {
  var h = H.azar(0.4, 0.8);
  for (var i = 0; i < 5; i++) {
    H.pieza('plano', color, 'lamina', b,
      [H.azar(-0.12, 0.12), h / 2, H.azar(-0.12, 0.12)],
      [0, H.azar(0, 360), H.azar(-20, 20)], [0.07, h, 1], 0.06);
  }
}, 1.1);

MUNDO.forma('campana', function (H, color, b) {          // picoroco
  var t = H.azar(0.11, 0.2);
  H.pieza('campana', color, 'solido', b, [0, t * 0.7, 0], [0, 0, 0], [t, t * 1.4, t], 0);
}, 0.9);

MUNDO.forma('valva', function (H, color, b) {            // chorito, mejillón
  var t = H.azar(0.08, 0.13);
  H.pieza('esfera', color, 'solido', b, [0, t * 0.5, 0], [0, H.azar(0, 360), 0], [t, t * 0.75, t * 1.8], 0);
}, 0.9);

MUNDO.forma('capuchon', function (H, color, b) {         // lapa
  var t = H.azar(0.1, 0.16);
  H.pieza('cono', color, 'solido', b, [0, t * 0.3, 0], [0, 0, 0], [t, t * 0.6, t], 0);
}, 0.9);

MUNDO.forma('caracol', function (H, color, b) {
  var t = H.azar(0.05, 0.08);
  H.pieza('esferaB', color, 'solido', b, [0, t, 0], [0, 0, 0], [t, t * 1.3, t], 0);
}, 0.6);

MUNDO.forma('costra', function (H, color, b) {           // liquen, alfombra
  var t = H.azar(0.3, 0.7);
  H.pieza('circulo', color, 'lamina', b, [0, 0.02, 0], [-90, 0, H.azar(0, 360)], [t, t, t], 0);
}, 0.6);

MUNDO.forma('anemona', function (H, color, b) {
  var t = H.azar(0.11, 0.17);
  H.pieza('cilindro', color, 'solido', b, [0, t * 0.6, 0], [0, 0, 0], [t * 0.7, t * 1.2, t * 0.7], 0);
  H.pieza('toro', '#d4737a', 'solido', b, [0, t * 1.2, 0], [-90, 0, 0], [t, t, t], 0.02);
}, 1.1);

MUNDO.forma('saco', function (H, color, b) {             // piure
  var t = H.azar(0.14, 0.21);
  H.pieza('esfera', color, 'solido', b, [0, t * 0.6, 0], [0, 0, 0], [t, t * 0.8, t], 0);
  H.pieza('cilindro', '#c25a3c', 'solido', b, [t * 0.3, t * 1.2, 0], [0, 0, 0], [t * 0.22, t * 0.5, t * 0.22], 0);
}, 1.1);

MUNDO.forma('lamina', function (H, color, b) {           // alga
  var h = H.azar(0.35, 0.7);
  H.pieza('plano', color, 'lamina', b, [0, h / 2, 0],
    [0, H.azar(0, 360), H.azar(-14, 14)], [0.2, h, 1], 0.05);
}, 1.2);

MUNDO.forma('fronda', function (H, color, b) {           // huiro
  var h = H.azar(1.8, 4);
  H.pieza('cilindro', '#4a3a18', 'solido', b, [0, h / 2, 0], [0, 0, 0], [0.06, h, 0.06], 0.03);
  for (var i = 0; i < 4; i++) {
    H.pieza('plano', color, 'lamina', b, [0, h * H.azar(0.5, 0.98), 0],
      [H.azar(-25, 25), H.azar(0, 360), H.azar(-30, 30)],
      [H.azar(0.5, 0.95), H.azar(1, 1.8), 1], 0.16);
  }
}, 4.2);

MUNDO.forma('erizo', function (H, color, b) {
  var t = H.azar(0.14, 0.21);
  H.pieza('esfera', color, 'solido', b, [0, t, 0], [0, 0, 0], [t, t, t], 0);
  for (var i = 0; i < 10; i++) {
    H.pieza('conoB', '#5d1f1f', 'solido', b, [0, t, 0],
      [H.azar(-80, 80), H.azar(0, 360), H.azar(-80, 80)], [t * 0.1, t * 0.9, t * 0.1], 0);
  }
}, 1.1);

MUNDO.forma('concha', function (H, color, b) {
  var t = H.azar(0.06, 0.1);
  H.pieza('cono', color, 'solido', b, [0, t * 0.2, 0],
    [H.azar(-20, 20), H.azar(0, 360), H.azar(-20, 20)], [t, t * 0.4, t], 0);
}, 0.6);

MUNDO.forma('roca', function (H, color, b) {
  var t = H.azar(0.3, 1.1);
  H.pieza('esferaB', color, 'solido', b, [0, t * 0.3, 0],
    [H.azar(0, 40), H.azar(0, 360), H.azar(0, 40)], [t, t * 0.7, t * H.azar(0.7, 1.3)], 0);
}, 1.6);


/* ---------------------------------------------------------------- personas
   Figura humana genérica con rostro. La ropa, el tono de piel y la estatura
   vienen del mundo, en el campo "cuerpo" del objeto:
     { forma:'persona', pos:[…], cuerpo:{ piel, pelo, chaqueta, polera, pantalon, zapato, altura } }
   -------------------------------------------------------------------------- */
MUNDO.forma('persona', function (H, color, b, ob) {
  var c = (ob && ob.cuerpo) || {};
  var piel     = c.piel     || '#c88d6b';
  var pelo     = c.pelo     || '#241b16';
  var chaqueta = c.chaqueta || color || '#5b3a26';
  var polera   = c.polera   || '#1b2430';
  var pantalon = c.pantalon || '#15171b';
  var zapato   = c.zapato   || '#0d0e10';
  var ojo      = c.ojo      || '#2a2320';
  var boca     = c.boca     || '#8c5a50';
  var k = (c.altura || 1.75) / 1.75;   // todo escala con la estatura

  function P(g, col, off, rot, esc) {
    H.pieza(g, col, 'solido', b,
      [off[0] * k, off[1] * k, off[2] * k], rot,
      [esc[0] * k, esc[1] * k, esc[2] * k], 0);
  }

  // piernas y zapatos
  [-0.15, 0.15].forEach(function (x) {
    P('caja', pantalon, [x, 0.44, 0], [0, 0, 0], [0.23, 0.88, 0.25]);
    P('caja', zapato,   [x, 0.05, 0.06], [0, 0, 0], [0.25, 0.11, 0.4]);
  });

  // torso: polera al centro, chaqueta abierta a los lados y espalda
  P('caja', polera,   [0, 1.16, 0.02],  [0, 0, 0], [0.36, 0.64, 0.24]);
  P('caja', chaqueta, [-0.21, 1.16, 0.01], [0, 0, 0], [0.21, 0.68, 0.31]);
  P('caja', chaqueta, [0.21, 1.16, 0.01],  [0, 0, 0], [0.21, 0.68, 0.31]);
  P('caja', chaqueta, [0, 1.16, -0.14], [0, 0, 0], [0.58, 0.68, 0.1]);
  P('caja', chaqueta, [0, 1.52, 0],     [0, 0, 0], [0.36, 0.16, 0.31]);

  // brazos
  P('caja', chaqueta, [-0.37, 1.12, 0], [0, 0, 9],  [0.18, 0.68, 0.21]);
  P('caja', chaqueta, [0.37, 1.12, 0],  [0, 0, -9], [0.18, 0.68, 0.21]);

  // cabeza
  P('caja',   piel, [0, 1.64, 0],  [0, 0, 0], [0.15, 0.13, 0.15]);
  P('esfera', piel, [0, 1.83, 0],  [0, 0, 0], [0.155, 0.185, 0.155]);

  // ---- rostro ----
  [-0.058, 0.058].forEach(function (x) {
    P('esferaB', '#f0ece6', [x, 1.856, 0.125], [0, 0, 0], [0.037, 0.027, 0.022]); // ojo
    P('esferaB', ojo,       [x, 1.853, 0.138], [0, 0, 0], [0.019, 0.019, 0.016]); // pupila
    P('caja',    pelo,      [x, 1.906, 0.129], [0, 0, x > 0 ? -7 : 7], [0.066, 0.015, 0.022]); // ceja
    P('esferaB', piel,      [x * 2.62, 1.828, 0.008], [0, 0, 0], [0.022, 0.036, 0.024]); // oreja
  });
  P('caja',    piel, [0, 1.816, 0.138], [0, 0, 0], [0.032, 0.05, 0.038]);  // nariz
  P('caja',    boca, [0, 1.757, 0.132], [0, 0, 0], [0.072, 0.015, 0.024]); // boca
  P('caja',    piel, [0, 1.735, 0.126], [0, 0, 0], [0.09, 0.03, 0.03]);    // mentón

  // pelo: casquete y flequillo
  P('esfera', pelo, [0, 1.9, -0.012], [0, 0, 0], [0.164, 0.128, 0.169]);
  P('caja',   pelo, [0, 1.918, 0.108], [10, 0, 0], [0.22, 0.05, 0.12]);
}, 2.5);

/* ---------------------------------------------------------------- interfaz */
function rotulo(texto) {
  var e = nuevo('a-entity', { 'class': 'etiqueta', 'mirar-camara': '' });
  var w = Math.max(1.4, texto.length * 0.3);
  e.appendChild(nuevo('a-plane', {
    width: w, height: 0.6, position: '0 0 -0.02',
    material: 'color:#12211f; opacity:0.6; transparent:true; shader:flat' }));
  e.appendChild(nuevo('a-text', {
    value: texto, align: 'center', width: w * 1.9, color: '#f6f1e6', material: 'shader:flat' }));
  return e;
}

function mostrarFicha(d) {
  var cuerpo = document.getElementById('ficha-cuerpo');
  cuerpo.innerHTML =
    '<h2>' + d.nombre + '</h2>' +
    (d.rango ? '<div class="rango">' + d.rango + '</div>' : '') +
    '<p>' + d.texto + '</p>' +
    (d.detalle ? d.detalle.map(function (q) { return '<p>' + q + '</p>'; }).join('') : '') +
    (d.vida ? '<ul class="lista">' + d.vida.map(function (v) { return '<li>' + v + '</li>'; }).join('') + '</ul>' : '') +
    (d.reto ? '<div class="reto"><b>Para observar</b>' + d.reto + '</div>' : '');
  document.getElementById('ficha').classList.add('visible');
}
MUNDO.ficha = mostrarFicha;

/* ---------------------------------------------------------------- diagnóstico */
MUNDO.paso = 'sin empezar';
function marcar(p) { MUNDO.paso = p; }

function fallo(err) {
  var d = document.getElementById('fallo');
  if (!d) {
    d = document.createElement('div');
    d.id = 'fallo';
    d.style.cssText = 'position:fixed;z-index:999;left:0;right:0;top:0;max-height:60vh;' +
      'overflow:auto;padding:12px 14px;background:#7d2a2a;color:#fff;' +
      'font:12px/1.45 monospace;white-space:pre-wrap;user-select:text;';
    document.body.appendChild(d);
  }
  d.textContent =
    'FALLÓ EN: ' + MUNDO.paso + '\n\n' +
    (err && err.message ? err.message : String(err)) + '\n\n' +
    (err && err.stack ? err.stack : '');
  console.error(err);
}
MUNDO.fallo = fallo;


/* ---------------------------------------------------------------- diálogos
   Los personajes hablan, pero el texto lo pone cada mundo en su campo
   "dialogos". El motor solo sabe recorrer nodos y dibujar el panel.        */
var panelD = null;

function estilosDialogo() {
  if (document.getElementById('estilo-dialogo')) return;
  var st = document.createElement('style');
  st.id = 'estilo-dialogo';
  st.textContent =
    '#dialogo{position:fixed;z-index:11;left:50%;bottom:74px;transform:translateX(-50%) translateY(140%);' +
      'width:min(560px,calc(100vw - 24px));background:#f2ece0;color:#12211f;border-radius:3px;' +
      'border-left:5px solid #6b4a1f;padding:14px 16px 12px;box-shadow:0 10px 34px rgba(0,0,0,.4);' +
      'transition:transform .3s cubic-bezier(.2,.7,.3,1);}' +
    '#dialogo.visible{transform:translateX(-50%);}' +
    '#dialogo .quien{font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:#6b4a1f;' +
      'font-weight:700;margin-bottom:5px;}' +
    '#dialogo .dice{margin:0 0 12px;font-size:14.5px;line-height:1.55;}' +
    '#dialogo .ops{display:flex;flex-wrap:wrap;gap:7px;}' +
    '#dialogo .ops button{font:inherit;font-size:13px;font-weight:600;color:#12211f;' +
      'background:#e2d8c2;border:1px solid #c9bda0;border-radius:2px;padding:8px 12px;cursor:pointer;}' +
    '#dialogo .ops button:hover{background:#d3c5a6;}';
  document.head.appendChild(st);
}

function crearPanelDialogo() {
  estilosDialogo();
  panelD = document.createElement('div');
  panelD.id = 'dialogo';
  panelD.innerHTML = '<div class="quien"></div><p class="dice"></p><div class="ops"></div>';
  document.body.appendChild(panelD);
}

MUNDO.callar = function () { if (panelD) panelD.classList.remove('visible'); };

MUNDO.hablar = function (idDialogo, idNodo) {
  var D = (MUNDO.datos && MUNDO.datos.dialogos) ? MUNDO.datos.dialogos[idDialogo] : null;
  if (!D) { console.warn('No existe el diálogo: ' + idDialogo); return; }
  var nodo = D.nodos[idNodo || D.inicio];
  if (!nodo) { MUNDO.callar(); return; }
  if (!panelD) crearPanelDialogo();

  panelD.querySelector('.quien').textContent = D.nombre || '';
  panelD.querySelector('.dice').innerHTML = nodo.texto;

  var ops = panelD.querySelector('.ops');
  ops.innerHTML = '';
  var lista = nodo.opciones || [{ dice: 'Cerrar' }];
  lista.forEach(function (op) {
    var b = document.createElement('button');
    b.textContent = op.dice;
    b.onclick = function () {
      if (op.ficha) {
        var fichas = MUNDO.fichasIndice || {};
        if (fichas[op.ficha]) mostrarFicha(fichas[op.ficha]);
      }
      if (op.va) MUNDO.hablar(idDialogo, op.va);
      else if (!op.ficha) MUNDO.callar();
    };
    ops.appendChild(b);
  });
  panelD.classList.add('visible');
};

/* ---------------------------------------------------------------- arranque */
MUNDO.iniciar = function (M) {
  try { arranque(M); } catch (err) { fallo(err); }
};

function arranque(M) {
  marcar('leyendo los datos del mundo');
  MUNDO.datos = M;
  var escena = document.getElementById('escena');
  var movil = !!(AFRAME.utils.device && AFRAME.utils.device.isMobile && AFRAME.utils.device.isMobile());
  var carga = M.carga != null ? M.carga : (movil ? 0.7 : 1);
  var ancho = M.ancho || 110;
  var anchoVida = M.anchoVida || (ancho - 36);

  document.title = M.titulo;
  document.getElementById('titulo').textContent = M.titulo;

  // Límites de desplazamiento a partir de las franjas
  var zMin = Infinity, zMax = -Infinity;
  M.franjas.forEach(function (f) {
    zMin = Math.min(zMin, f.z[0], f.z[1]);
    zMax = Math.max(zMax, f.z[0], f.z[1]);
  });
  MUNDO.limites = { x: ancho / 2 - 3, zMin: zMin + 3, zMax: zMax - 2 };

  marcar('creando cielo y luces');
  // Cielo, niebla y luces
  escena.setAttribute('background', 'color:' + (M.cielo || '#8fabb9'));
  if (M.niebla) {
    escena.setAttribute('fog', 'type:linear; color:' + M.niebla.color +
      '; near:' + M.niebla.cerca + '; far:' + M.niebla.lejos);
  }
  escena.appendChild(nuevo('a-sky', { color: M.cielo || '#9db8c4' }));
  var luz = M.luz || {};
  escena.appendChild(nuevo('a-light', {
    type: 'hemisphere', color: luz.cielo || '#cfe3ea',
    groundColor: luz.suelo || '#8a7c5c', intensity: luz.ambiente || 0.85 }));
  escena.appendChild(nuevo('a-light', {
    type: 'directional', color: luz.sol || '#fff0d4',
    intensity: luz.intensidad || 0.7, position: luz.posicion || '-18 22 14' }));

  marcar('creando el observador');
  // Observador
  var jugador = nuevo('a-entity', {
    id: 'jugador', position: (M.inicio || '0 3.2 26'), caminar: '', 'piso-adherido': '' });
  var camara = nuevo('a-entity', {
    id: 'camara', camera: 'active: true', 'look-controls': 'pointerLockEnabled:false' });
  camara.appendChild(nuevo('a-entity', {
    cursor: 'fuse:true; fuseTimeout:900', raycaster: 'objects:.punto; far:60',
    position: '0 0 -1', geometry: 'primitive:ring; radiusInner:0.008; radiusOuter:0.012',
    material: 'color:#f2ece0; shader:flat; opacity:0.55' }));
  jugador.appendChild(camara);
  escena.appendChild(jugador);
  escena.appendChild(nuevo('a-entity', {
    cursor: 'rayOrigin:mouse', raycaster: 'objects:.punto, .suelo; far:120' }));

  var marca = nuevo('a-ring', {
    id: 'marca', 'radius-inner': 0.35, 'radius-outer': 0.5, rotation: '-90 0 0',
    material: 'color:#f0c060; shader:flat; opacity:0', position: '0 -99 0' });
  escena.appendChild(marca);

  var terreno = nuevo('a-entity', { id: 'terreno' });
  escena.appendChild(terreno);

  marcar('construyendo las franjas');
  M.franjas.forEach(function (f) {
    marcar('franja: ' + f.id);
    var z0 = f.z[0], z1 = f.z[1];
    var largo = z0 - z1, centroZ = (z0 + z1) / 2, alto = 9;

    var terraza = nuevo('a-box', {
      'class': 'suelo', width: ancho, depth: largo, height: alto,
      position: '0 ' + (f.y - alto / 2) + ' ' + centroZ,
      material: 'color:' + f.color + '; roughness:0.95' });
    (function (t, f) {
      t.addEventListener('loaded', function () {
        var malla = t.getObject3D('mesh');
        if (!malla) return;
        var estilo = f.superficie || 'roca';
        var reps = { arena: 26, pasto: 30, baldosa: 6, asfalto: 20 }[estilo] || 16;
        var piel = superficie(f.color, estilo, reps);
        malla.material.map = piel.mapa;
        malla.material.normalMap = piel.normal;
        malla.material.roughnessMap = piel.rugosidad;
        var k = estilo === 'arena' ? 0.7 : 1.1;
        malla.material.normalScale.set(k, k);
        malla.material.roughness = estilo === 'roca' ? 0.85 : 1;
        malla.material.needsUpdate = true;
      });
    })(terraza, f);
    terreno.appendChild(terraza);

    (f.especies || []).forEach(function (sp) {
      marcar('franja ' + f.id + ', especie: ' + sp.forma);
      var fn = MUNDO.formas[sp.forma];
      if (!fn) { console.warn('Forma desconocida: ' + sp.forma); return; }
      var cant = Math.max(3, Math.round(sp.n * carga));
      var hueco = sp.hueco != null ? sp.hueco : (f.hueco || 0);
      for (var i = 0; i < cant; i++) {
        var bx = azar(-anchoVida / 2, anchoVida / 2);
        // hueco: pasillo central despejado
        if (hueco) bx = (bx < 0 ? -1 : 1) * (hueco + Math.abs(bx) * (anchoVida / 2 - hueco) / (anchoVida / 2));
        var b = [bx, f.y, azar(z1 + 0.5, z0 - 0.5)];
        giroActual = 0;
        fn(H, sp.color, b);
        if (i === 0 && sp.nombre) {
          var et = rotulo(sp.nombre);
          et.setAttribute('position',
            b[0] + ' ' + (f.y + (sp.alto || ALTO_NOMBRE[sp.forma] || 1)) + ' ' + b[2]);
          terreno.appendChild(et);
        }
      }
    });

    var rz = nuevo('a-entity', {
      position: (anchoVida / 2 + 4) + ' ' + (f.y + 3) + ' ' + centroZ, 'mirar-camara': '' });
    rz.appendChild(nuevo('a-text', {
      value: f.nombre.toUpperCase(), align: 'center', width: 22,
      color: '#f6f1e6', material: 'shader:flat' }));
    terreno.appendChild(rz);

    var punto = nuevo('a-sphere', {
      'class': 'punto', radius: 0.5,
      position: (-anchoVida / 2 - 4) + ' ' + (f.y + 2.2) + ' ' + centroZ,
      material: 'color:#f0c060; shader:flat; opacity:0.95',
      animation: 'property:scale; to:1.35 1.35 1.35; dir:alternate; loop:true; dur:1100; easing:easeInOutSine' });
    punto.dataset.ficha = f.id;
    terreno.appendChild(punto);
  });

  marcar('colocando los objetos');
  // Objetos con posición propia: faroles, bancas, edificios…
  (M.objetos || []).forEach(function (ob) {
    marcar('objeto: ' + ob.forma);
    var fn = MUNDO.formas[ob.forma];
    if (!fn) { console.warn('Forma desconocida: ' + ob.forma); return; }
    giroActual = ob.giro || 0;
    grupoActual = ob.grupo || null;
    fn(H, ob.color, ob.pos, ob);
    giroActual = 0;
    grupoActual = null;
    // superficie pisable: andenes, pisos de vehículos, plataformas
    if (ob.piso) {
      var pz = ob.piso, esp = 0.3;
      terreno.appendChild(nuevo('a-box', {
        'class': 'suelo',
        width: pz.ancho, depth: pz.largo, height: esp,
        position: ob.pos[0] + ' ' + (ob.pos[1] + pz.alto - esp / 2) + ' ' + ob.pos[2],
        rotation: '0 ' + (ob.giro || 0) + ' 0',
        material: 'color:' + (pz.color || '#b9b3a6') + '; roughness:0.9'
      }));
    }
    if (ob.ficha || ob.dialogo) {
      var pt = nuevo('a-sphere', {
        'class': 'punto', radius: 0.42,
        position: ob.pos[0] + ' ' + (ob.pos[1] + (ob.altoFicha || 2.4)) + ' ' + ob.pos[2],
        material: 'color:#f0c060; shader:flat; opacity:0.95',
        animation: 'property:scale; to:1.35 1.35 1.35; dir:alternate; loop:true; dur:1100; easing:easeInOutSine' });
      if (ob.dialogo) pt.dataset.dialogo = ob.dialogo;
      else pt.dataset.ficha = ob.ficha;
      terreno.appendChild(pt);
    }
    if (ob.nombre) {
      var et = rotulo(ob.nombre);
      et.setAttribute('position',
        ob.pos[0] + ' ' + (ob.pos[1] + (ob.alto || ALTO_NOMBRE[ob.forma] || 2)) + ' ' + ob.pos[2]);
      terreno.appendChild(et);
    }
  });

  // Fondo bajo la última franja
  if (M.fondo) {
    terreno.appendChild(nuevo('a-box', {
      'class': 'suelo', width: ancho * 1.8, depth: 90, height: 9,
      position: '0 ' + M.fondo.y + ' ' + M.fondo.z,
      material: 'color:' + M.fondo.color + '; roughness:1' }));
  }

  // Cuerpos en el cielo (luna, sol…) con ficha propia
  (M.cielos || []).forEach(function (c) {
    var s = nuevo('a-sphere', {
      'class': 'punto', radius: c.radio || 1.5, position: c.posicion,
      material: 'color:' + c.color + '; shader:flat' });
    s.dataset.ficha = c.id;
    escena.appendChild(s);
  });

  marcar('creando la superficie móvil');
  // Superficie móvil
  if (M.nivel) {
    var N = M.nivel;
    var cont = nuevo('a-entity', {
      id: 'nivel', position: '0 ' + N.bajo + ' 0',
      nivel: 'alto:' + N.alto + '; bajo:' + N.bajo + '; periodo:' + (N.periodo || 30000) +
             '; nombre:' + N.nombre + '; unidad:' + (N.unidad || 'm') });
    var sup = nuevo('a-plane', {
      rotation: '-90 0 0', width: ancho * 1.8, height: 220, position: '0 0 ' + (N.centroZ || -90),
      material: 'color:' + N.color + '; opacity:' + (N.opacidad || 0.72) +
                '; transparent:true; roughness:' + (N.aspereza || 0.25) });
    if (N.oleaje) sup.setAttribute('oleaje', '');
    cont.appendChild(sup);
    if (N.brillo !== false) {
      cont.appendChild(nuevo('a-plane', {
        rotation: '-90 0 0', width: ancho * 1.8, height: 220,
        position: '0 0.06 ' + (N.centroZ || -90),
        material: 'color:#bcd7dd; opacity:0.15; transparent:true' }));
    }
    escena.appendChild(cont);
  }

  marcar('volcando las instancias a la GPU');
  if (terreno.object3D) {
    volcarLotes(terreno.object3D);
  } else {
    terreno.addEventListener('loaded', function () { volcarLotes(terreno.object3D); });
  }
  marcar('armando la interfaz');
  construirUI(M);
  marcar('listo');
  var lotes = Object.keys(LOTES).length, piezas = 0;
  Object.keys(LOTES).forEach(function (k) { piezas += LOTES[k].datos.length; });
  MUNDO.informe = M.franjas.length + ' franjas · ' + lotes + ' llamadas de dibujo · ' + piezas + ' piezas';
  console.log('MUNDO listo: ' + MUNDO.informe);
};

/* ---------------------------------------------------------------- UI y eventos */
function construirUI(M) {
  var ctrl = document.getElementById('controles');
  var fichas = {};
  M.franjas.forEach(function (f) { fichas[f.id] = f; });
  (M.fichas || []).forEach(function (f) { fichas[f.id] = f; });
  MUNDO.fichasIndice = fichas;

  // Botones del nivel
  if (M.nivel && M.nivel.modos) {
    M.nivel.modos.forEach(function (m, i) {
      var b = nuevo('button', { 'data-modo': m.id, 'aria-pressed': i === 0 ? 'true' : 'false' });
      b.textContent = m.etiqueta;
      b.onclick = function () {
        ctrl.querySelectorAll('[data-modo]').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        document.getElementById('nivel').setAttribute('nivel', 'modo', m.id);
      };
      ctrl.appendChild(b);
    });
  }

  var bn = nuevo('button', { id: 'nombres', 'aria-pressed': 'true' });
  bn.textContent = 'Nombres';
  bn.onclick = function () {
    var ver = bn.getAttribute('aria-pressed') !== 'true';
    bn.setAttribute('aria-pressed', ver ? 'true' : 'false');
    document.querySelectorAll('.etiqueta').forEach(function (e) { e.setAttribute('visible', ver); });
  };
  ctrl.appendChild(bn);

  var jugador = document.getElementById('jugador');
  [['\u25BC Atr\u00E1s', -1], ['\u25B2 Caminar', 1]].forEach(function (par) {
    var b = nuevo('button', { 'class': 'mover' });
    b.textContent = par[0];
    ['pointerdown', 'touchstart'].forEach(function (ev) {
      b.addEventListener(ev, function (e) { e.preventDefault(); jugador.setAttribute('caminar', 'dir', par[1]); }, { passive: false });
    });
    ['pointerup', 'pointerleave', 'pointercancel', 'touchend', 'touchcancel'].forEach(function (ev) {
      b.addEventListener(ev, function () { jugador.setAttribute('caminar', 'dir', 0); });
    });
    ctrl.appendChild(b);
  });

  if (M.vistas) {
    var sel = nuevo('select', { id: 'vistas' });
    sel.appendChild(nuevo('option', { value: '' }));
    sel.firstChild.textContent = 'Ir a\u2026';
    Object.keys(M.vistas).forEach(function (k) {
      var o = nuevo('option', { value: k });
      o.textContent = M.vistas[k].etiqueta;
      sel.appendChild(o);
    });
    sel.onchange = function () {
      var v = M.vistas[sel.value];
      if (!v) return;
      jugador.setAttribute('position', v.pos);
      var lc = document.getElementById('camara').components['look-controls'];
      if (lc) {
        lc.pitchObject.rotation.x = rad(v.pitch || 0);
        lc.yawObject.rotation.y = rad(v.yaw || 0);
      }
      sel.value = '';
    };
    ctrl.appendChild(sel);
  }

  // Teclado
  var TECLAS = { w: 1, W: 1, ArrowUp: 1, s: -1, S: -1, ArrowDown: -1 };
  window.addEventListener('keydown', function (e) { if (TECLAS[e.key]) jugador.setAttribute('caminar', 'dir', TECLAS[e.key]); });
  window.addEventListener('keyup', function (e) { if (TECLAS[e.key]) jugador.setAttribute('caminar', 'dir', 0); });

  // Toque vs arrastre
  var arrastro = false, px = 0, py = 0;
  var escena = document.getElementById('escena');
  escena.addEventListener('pointerdown', function (e) { arrastro = false; px = e.clientX; py = e.clientY; });
  escena.addEventListener('pointerup', function (e) { arrastro = Math.hypot(e.clientX - px, e.clientY - py) > 12; });

  var marca = document.getElementById('marca');
  marca.setAttribute('animation__desvanece',
    'property: material.opacity; to: 0; dur: 700; startEvents: aterriza; easing: easeOutQuad');

  escena.addEventListener('click', function (ev) {
    if (arrastro) return;
    var el = (ev.detail && ev.detail.intersectedEl) ? ev.detail.intersectedEl : ev.target;
    if (!el) return;
    var hab = el.dataset ? el.dataset.dialogo : null;
    if (hab) { MUNDO.hablar(hab); return; }
    var id = el.dataset ? el.dataset.ficha : null;
    if (id && fichas[id]) { mostrarFicha(fichas[id]); return; }
    if (el.classList && el.classList.contains('suelo') && ev.detail && ev.detail.intersection) {
      var p = ev.detail.intersection.point, lim = MUNDO.limites;
      var actual = jugador.getAttribute('position');
      jugador.setAttribute('position', {
        x: THREE.MathUtils.clamp(p.x, -lim.x, lim.x),
        y: actual.y,
        z: THREE.MathUtils.clamp(p.z, lim.zMin, lim.zMax) });
      marca.setAttribute('position', p.x + ' ' + (p.y + 0.05) + ' ' + p.z);
      marca.setAttribute('material', 'opacity', 0.9);
      marca.emit('aterriza');
      document.getElementById('pista').classList.add('oculta');
    }
  });

  document.getElementById('cerrar').onclick = function () {
    document.getElementById('ficha').classList.remove('visible');
  };
  crearPanelDialogo();
  setTimeout(function () { document.getElementById('pista').classList.add('oculta'); }, 9000);
}

global.MUNDO = MUNDO;
})(window);
