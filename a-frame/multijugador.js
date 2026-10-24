/* =============================================================================
   multijugador.js — explorar un mundo 3D junto al curso (opcional).

   Usa la Realtime Database del mismo proyecto (DF.tiempoReal) y el login del
   sitio: sin sesión, el mundo funciona igual que siempre, en solitario.

   Datos: mundos3d/salas/<mundo>/<sala>/jugadores/<uid> = {
     n: nombre corto, c: color, g: gatito favorito, x, y, z: posición, r: giro,
     t: hora del último aviso, e: expresión, et: hora de la expresión }
   - Cada uno escribe solo su avatar (reglas en firebase/database.rules.json).
   - Al cerrar la pestaña o perder internet, el servidor borra el avatar solo.
   - Se envían como máximo 4 avisos por segundo y solo si te moviste
     (más uno cada 10 s para decir «sigo aquí»). Máximo 12 por sala (lo revisa este archivo).
   ============================================================================= */
(function () {
  'use strict';
  var HZ = 4, VIVO_MS = 10000, OLVIDO_MS = 35000, ALTURA_OJOS = 1.65;
  var COLORES = ['#e6b455', '#22e3ff', '#ff2e7e', '#8fb96a', '#a78bfa', '#ff9f1c', '#4bd08c', '#f2efe6'];
  var EXPRESIONES = ['👋 ¡Hola!', '👀 ¡Miren esto!', '🙋 ¡Vengan acá!', '❓ ¿Dónde están?', '👍 ¡Listo!', '😂 Jajaja'];
  var raiz = (document.currentScript && document.currentScript.src || '').replace(/a-frame\/multijugador\.js.*$/, '');

  var MJ = { sala: null, otros: {}, conectado: false };
  var rt = null, refYo = null, desuscribir = [], ultimo = null, ultimoEnvio = 0, intervalo = null, yo = null;

  function idMundo() { return (location.hash || '').replace('#', '').replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 30); }
  function limpiarSala(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function colorDe(uid) { var h = 0; for (var i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0; return COLORES[h % COLORES.length]; }

  /* ---------------------------------------------------------------- interfaz */
  var css = document.createElement('style');
  css.textContent =
    '#mj-btn{pointer-events:auto;color:#f2ece0;font-size:12.5px;font-weight:700;background:rgba(28,42,40,.4);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(242,236,224,.16);padding:7px 13px;border-radius:10px;cursor:pointer}' +
    '#mj-btn.on{background:rgba(47,107,69,.75);border-color:#8fb96a}' +
    '#mj-panel{position:fixed;z-index:30;right:12px;top:calc(56px + env(safe-area-inset-top,0));width:min(300px,calc(100vw - 24px));background:rgba(14,26,30,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#f2ece0;border:1px solid rgba(143,185,106,.35);border-radius:14px;padding:12px 14px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 14px 40px rgba(0,0,0,.45);display:none}' +
    '#mj-panel.ver{display:block}' +
    '#mj-panel h3{margin:0 0 6px;font-size:15px}' +
    '#mj-panel select,#mj-panel input{width:100%;margin:4px 0 8px;padding:8px 10px;border-radius:8px;border:1px solid rgba(242,236,224,.25);background:rgba(255,255,255,.08);color:#f2ece0;font:14px system-ui,sans-serif;box-sizing:border-box}' +
    '#mj-panel option{color:#12211f}' +
    '#mj-panel button.p{width:100%;padding:9px;border:0;border-radius:9px;background:#8fb96a;color:#0e1a1e;font-weight:800;cursor:pointer}' +
    '#mj-panel button.s{background:none;border:1px solid rgba(242,236,224,.3);color:#f2ece0;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:12.5px}' +
    '#mj-panel .lista{margin:6px 0;display:grid;gap:4px;max-height:160px;overflow:auto}' +
    '#mj-panel .lista div{display:flex;gap:8px;align-items:center;font-size:13px}' +
    '#mj-panel .lista i{width:10px;height:10px;border-radius:50%;flex:none}' +
    '#mj-panel .exp{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}' +
    '#mj-panel .exp button{background:rgba(255,255,255,.08);border:1px solid rgba(242,236,224,.2);color:#f2ece0;border-radius:999px;padding:4px 9px;font-size:12.5px;cursor:pointer}' +
    '#mj-panel small{opacity:.75;font-size:12px;display:block}' +
    '#mj-panel .err{color:#ffb3ad}';
  document.head.appendChild(css);

  var btn = document.createElement('button'), panel = document.createElement('div');
  btn.id = 'mj-btn'; btn.title = 'Explorar este mundo junto a tu curso'; btn.textContent = '👥 Con mi curso';
  panel.id = 'mj-panel'; panel.setAttribute('role', 'dialog');
  function montar() {
    var barra = document.getElementById('barra'), volver = document.getElementById('volver');
    if (!barra) return setTimeout(montar, 200);
    barra.insertBefore(btn, volver || null);
    document.body.appendChild(panel);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
  btn.onclick = function () { panel.classList.toggle('ver'); pintar(); };

  function pintar(msg) {
    var u = window.DF && DF.usuario && DF.usuario();
    if (!u) {
      panel.innerHTML = '<h3>👥 Explorar con mi curso</h3><p>Para ver a tus compañeros en el mundo, entra con tu cuenta del sitio.</p><button class="p" id="mj-entrar">Entrar con mi cuenta</button>' + (msg || '');
      document.getElementById('mj-entrar').onclick = function () { DF.entrar().then(function () { pintar(); }).catch(function () {}); };
      return;
    }
    if (!MJ.sala) {
      var cursos = ((window.DF_CONFIG || {}).cursos || []).filter(function (c) { return !/profe/i.test(c); });
      panel.innerHTML = '<h3>👥 Explorar con mi curso</h3><small>Verás a tus compañeros que estén en este mismo mundo y en la misma sala. Máximo 12 por sala.</small>' +
        '<label style="font-size:12px;font-weight:700;display:block;margin-top:8px">Sala</label>' +
        '<select id="mj-curso"><option value="">Elige tu curso…</option>' + cursos.map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '<option value="__otra">Otra sala (con código)</option></select>' +
        '<input id="mj-codigo" placeholder="Código que dio el profe (ej.: A, grupo2)" maxlength="16" style="display:none">' +
        '<button class="p" id="mj-unir">Entrar a la sala</button>' + (msg || '');
      var sel = document.getElementById('mj-curso'), cod = document.getElementById('mj-codigo');
      try { var g = localStorage.getItem('mj_sala'); if (g) { if (cursos.indexOf(g) >= 0) sel.value = g; else { sel.value = '__otra'; cod.style.display = ''; cod.value = g; } } } catch (e) {}
      sel.onchange = function () { cod.style.display = sel.value === '__otra' ? '' : 'none'; };
      document.getElementById('mj-unir').onclick = function () {
        var nombre = sel.value === '__otra' ? cod.value.trim() : sel.value;
        if (!limpiarSala(nombre)) { pintar('<p class="err">Elige tu curso o escribe un código.</p>'); return; }
        try { localStorage.setItem('mj_sala', nombre); } catch (e) {}
        unirse(nombre);
      };
      return;
    }
    var lista = Object.keys(MJ.otros).map(function (k) { return MJ.otros[k]; });
    panel.innerHTML = '<h3>👥 Sala «' + esc(MJ.salaNombre) + '»</h3>' +
      '<small>' + (MJ.conectado ? '🟢 Conectado' : '🟠 Reconectando…') + ' · ' + (lista.length + 1) + ' en el mundo</small>' +
      '<div class="lista"><div><i style="background:' + yo.c + '"></i><b>' + esc(yo.n) + '</b> (tú)</div>' +
      lista.map(function (o) { return '<div><i style="background:' + esc(o.d.c || '#ccc') + '"></i>' + esc(o.d.n) + (o.d.p ? ' · profe' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="exp">' + EXPRESIONES.map(function (e, i) { return '<button data-e="' + i + '">' + esc(e) + '</button>'; }).join('') + '</div>' +
      '<div style="margin-top:10px;display:flex;gap:8px;justify-content:space-between"><button class="s" id="mj-salir">Salir de la sala</button>' + (lista.length ? '<button class="s" id="mj-ir">Ir donde los demás</button>' : '') + '</div>';
    document.getElementById('mj-salir').onclick = salir;
    var ir = document.getElementById('mj-ir'); if (ir) ir.onclick = irAlGrupo;
    panel.querySelectorAll('[data-e]').forEach(function (b) { b.onclick = function () { expresar(EXPRESIONES[+b.dataset.e]); }; });
  }

  /* ---------------------------------------------------------------- conexión */
  function unirse(nombreSala) {
    var u = DF.usuario(), mundo = idMundo(), sala = limpiarSala(nombreSala);
    if (!mundo || !sala) return;
    pintar('<p>Conectando…</p>');
    var favorito = '';
    var leerGato = DF.listo().then(function (fb) {
      return fb.F.getDoc(fb.F.doc(fb.db, 'gatitos', u.uid)).then(function (s) { var d = s.exists() ? s.data() : null; favorito = d && d.favorito && (d.ids || []).indexOf(d.favorito) >= 0 ? d.favorito : ''; });
    }).catch(function () {});
    Promise.all([DF.tiempoReal(), leerGato]).then(function (r) {
      rt = r[0];
      var R = rt.R, base = 'mundos3d/salas/' + mundo + '/' + sala;
      yo = { n: DF.nombreCorto(u.displayName, u.email).slice(0, 40), c: colorDe(u.uid), g: favorito, p: !!DF.esProfe() };
      refYo = R.ref(rt.rtdb, base + '/jugadores/' + u.uid);
      MJ.sala = sala; MJ.salaNombre = nombreSala; MJ.base = base;
      // estado de la conexión: al reconectar, volver a anunciarse y re-armar el borrado automático
      desuscribir.push(R.onValue(R.ref(rt.rtdb, '.info/connected'), function (s) {
        MJ.conectado = !!s.val();
        if (MJ.conectado) { R.onDisconnect(refYo).remove(); enviar(true); }
        pintarSiAbierto(); estadoBoton();
      }));
      var refJug = R.ref(rt.rtdb, base + '/jugadores');
      // Máximo 12 por sala (las reglas de Realtime Database no pueden contar, así que se revisa aquí)
      R.get(refJug).then(function (sn) {
        var v = sn.val() || {}, ahora = Date.now();
        var activos = Object.keys(v).filter(function (k) { return k !== u.uid && v[k] && ahora - (v[k].t || 0) < OLVIDO_MS; });
        if (activos.length >= 12) { salir(); pintar('<p class="err">La sala «' + esc(nombreSala) + '» está llena (12). Prueben con otro código de sala.</p>'); }
      }).catch(function () {});
      desuscribir.push(R.onChildAdded(refJug, recibir));
      desuscribir.push(R.onChildChanged(refJug, recibir));
      desuscribir.push(R.onChildRemoved(refJug, function (s) { quitar(s.key); }));
      enviar(true);
      intervalo = setInterval(function () { enviar(false); limpiarViejos(); }, 1000 / HZ);
      estadoBoton(); pintar();
    }).catch(function (e) {
      MJ.sala = null;
      pintar('<p class="err">No se pudo conectar' + (/permission|denied/i.test(e && e.message) ? ' (el sitio aún no tiene activado el multijugador o la sala está llena).' : ': ' + esc(e && e.message || e)) + '</p>');
    });
  }
  function salir() {
    clearInterval(intervalo); intervalo = null;
    desuscribir.forEach(function (f) { try { f(); } catch (e) {} }); desuscribir = [];
    if (refYo && rt) { try { rt.R.onDisconnect(refYo).cancel(); } catch (e) {} rt.R.remove(refYo).catch(function () {}); }
    Object.keys(MJ.otros).forEach(quitar);
    refYo = null; MJ.sala = null; MJ.conectado = false; ultimo = null;
    estadoBoton(); pintar();
  }
  window.addEventListener('pagehide', function () { if (refYo && rt) rt.R.remove(refYo); });

  function posicionPropia() {
    var j = window.MUNDO && MUNDO.jugador, cam = document.getElementById('camara');
    if (!j || !j.object3D) return null;
    var p = j.object3D.position, r = (j.object3D.rotation.y || 0) + (cam && cam.object3D ? cam.object3D.rotation.y : 0);
    return { x: Math.round(p.x * 100) / 100, y: Math.round(p.y * 100) / 100, z: Math.round(p.z * 100) / 100, r: Math.round(r * 100) / 100 };
  }
  function enviar(forzar) {
    if (!refYo || !rt) return;
    var p = posicionPropia(); if (!p) return;
    var ahora = Date.now();
    var movio = !ultimo || Math.abs(p.x - ultimo.x) > 0.05 || Math.abs(p.y - ultimo.y) > 0.05 || Math.abs(p.z - ultimo.z) > 0.05 || Math.abs(p.r - ultimo.r) > 0.05;
    if (!forzar && !movio && ahora - ultimoEnvio < VIVO_MS) return;
    ultimo = p; ultimoEnvio = ahora;
    var d = { n: yo.n, c: yo.c, g: yo.g, x: p.x, y: p.y, z: p.z, r: p.r, t: rt.R.serverTimestamp() };
    if (yo.p) d.p = true;
    if (yo.e) { d.e = yo.e; d.et = yo.et; }
    rt.R.set(refYo, d).catch(function () {});
  }
  function expresar(txt) {
    if (!yo) return;
    yo.e = txt.slice(0, 40); yo.et = Date.now();
    enviar(true);
    burbuja(null, yo.e);   // también la ves tú
  }
  function irAlGrupo() {
    var l = Object.keys(MJ.otros).map(function (k) { return MJ.otros[k]; }); if (!l.length || !MUNDO.jugador) return;
    var c = l.reduce(function (a, o) { a.x += o.d.x / l.length; a.z += o.d.z / l.length; a.y = Math.max(a.y, o.d.y); return a; }, { x: 0, y: -1e9, z: 0 });
    MUNDO.jugador.object3D.position.set(c.x + 1.5, c.y + 0.5, c.z + 1.5);
  }

  /* ---------------------------------------------------------------- avatares */
  var CARGADOR = null, TEX = {};
  function textura(url) {
    if (TEX[url]) return TEX[url];
    CARGADOR = CARGADOR || new THREE.TextureLoader();
    var t = CARGADOR.load(url, function (tx) { var o = t._obj; if (o) ajustar(o, tx); });
    if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    return (TEX[url] = t);
  }
  function ajustar(o, tx) {
    var img = tx.image; if (!img || !img.width) return;
    var alto = 1.1, ancho = alto * img.width / img.height;
    o.gato.scale.set(ancho, alto, 1); o.gato.position.y = alto / 2;
  }
  function etiqueta(txt, color, fondo) {
    var c = document.createElement('canvas'), g = c.getContext('2d'), f = 'bold 40px system-ui, sans-serif';
    g.font = f; var w = Math.min(900, Math.ceil(g.measureText(txt).width) + 44);
    c.width = w; c.height = 64; g.font = f;
    g.fillStyle = fondo || 'rgba(14,26,30,.78)'; var r = 30;
    g.beginPath(); g.moveTo(r, 2); g.arcTo(w - 2, 2, w - 2, 62, r); g.arcTo(w - 2, 62, 2, 62, r); g.arcTo(2, 62, 2, 2, r); g.arcTo(2, 2, w - 2, 2, r); g.fill();
    g.fillStyle = color || '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, 34);
    var t = new THREE.CanvasTexture(c); if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthWrite: false, transparent: true }));
    s.scale.set(0.42 * w / 64, 0.42, 1); s.renderOrder = 5;
    return s;
  }
  function crearAvatar(uid, d) {
    var escena = document.querySelector('a-scene'); if (!escena || !escena.object3D) return null;
    var grupo = new THREE.Group();
    var url = raiz + (d.g ? 'gatitos/img/' + d.g + '.webp' : 'mercado/sprites/gato-saluda.webp');
    var tx = textura(url);
    var gato = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, alphaTest: 0.1 }));
    gato.scale.set(0.9, 1.1, 1); gato.position.y = 0.55;
    var sombra = new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
    sombra.rotation.x = -Math.PI / 2; sombra.position.y = 0.02;
    var nombre = etiqueta(d.n + (d.p ? ' · profe' : ''), d.c || '#fff');
    nombre.position.y = 1.45;
    grupo.add(sombra); grupo.add(gato); grupo.add(nombre);
    escena.object3D.add(grupo);
    var o = { uid: uid, grupo: grupo, gato: gato, nombre: nombre, d: d, url: url, obj: { x: d.x, y: d.y, z: d.z } };
    tx._obj = o; if (tx.image && tx.image.width) ajustar(o, tx);
    grupo.position.set(d.x, d.y - ALTURA_OJOS, d.z);
    return o;
  }
  function recibir(s) {
    var u = DF.usuario(); if (!u || s.key === u.uid) return;
    var d = s.val(); if (!d || typeof d.x !== 'number') return;
    var o = MJ.otros[s.key];
    if (!o) { o = crearAvatar(s.key, d); if (!o) return; MJ.otros[s.key] = o; pintarSiAbierto(); }
    else if ((d.g || '') !== (o.d.g || '')) { quitar(s.key); o = crearAvatar(s.key, d); MJ.otros[s.key] = o; }
    if (d.e && d.et && d.et !== o.d.et && Date.now() - d.et < 15000) burbuja(o, d.e);
    o.d = d; o.obj = { x: d.x, y: d.y, z: d.z }; o.visto = Date.now();
  }
  function quitar(uid) {
    var o = MJ.otros[uid]; if (!o) return;
    o.grupo.parent && o.grupo.parent.remove(o.grupo);
    [o.nombre, o.burbuja].forEach(function (s) { if (s) { s.material.map && s.material.map.dispose(); s.material.dispose(); } });
    delete MJ.otros[uid]; pintarSiAbierto();
  }
  function limpiarViejos() {
    var ahora = Date.now();
    Object.keys(MJ.otros).forEach(function (k) { var o = MJ.otros[k]; if (ahora - (o.visto || ahora) > OLVIDO_MS) quitar(k); });
  }
  function burbuja(o, txt) {
    if (!o) { aviso(txt); return; }
    if (o.burbuja) { o.grupo.remove(o.burbuja); o.burbuja.material.map.dispose(); o.burbuja.material.dispose(); }
    var b = etiqueta(txt, '#12211f', 'rgba(242,236,224,.95)'); b.position.y = 1.95; o.grupo.add(b); o.burbuja = b; o.burbujaHasta = Date.now() + 4000;
  }
  function aviso(txt) {
    var t = document.createElement('div'); t.textContent = txt;
    t.style.cssText = 'position:fixed;z-index:40;left:50%;bottom:150px;transform:translateX(-50%);background:rgba(242,236,224,.95);color:#12211f;font:700 15px system-ui;padding:9px 16px;border-radius:999px;pointer-events:none';
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2500);
  }
  // movimiento suave: cada cuadro, el avatar se acerca a su última posición conocida
  var tPrev = performance.now();
  function suavizar(tt) {
    requestAnimationFrame(suavizar);
    var ahora = Date.now(), dt = Math.min(1000, (tt || performance.now()) - tPrev); tPrev = tt || performance.now();
    var k0 = 1 - Math.exp(-dt / 90);   // independiente de los cuadros por segundo: llega en ~0,3 s
    for (var k in MJ.otros) {
      var o = MJ.otros[k], g = o.grupo.position, ob = o.obj;
      var dx = ob.x - g.x, dy = (ob.y - ALTURA_OJOS) - g.y, dz = ob.z - g.z;
      if (dx * dx + dz * dz > 400) g.set(ob.x, ob.y - ALTURA_OJOS, ob.z);   // saltos grandes (teletransporte): sin animación
      else { g.x += dx * k0; g.y += dy * k0; g.z += dz * k0; }
      if (o.burbuja && ahora > o.burbujaHasta) { o.grupo.remove(o.burbuja); o.burbuja.material.map.dispose(); o.burbuja.material.dispose(); o.burbuja = null; }
    }
  }
  requestAnimationFrame(suavizar);

  function estadoBoton() {
    var n = Object.keys(MJ.otros).length;
    btn.classList.toggle('on', !!MJ.sala);
    btn.textContent = MJ.sala ? '👥 ' + (n + 1) + (MJ.conectado ? '' : ' …') : '👥 Con mi curso';
  }
  function pintarSiAbierto() { estadoBoton(); if (panel.classList.contains('ver')) pintar(); }

  window.MULTIJUGADOR = MJ;
  MJ.unirse = unirse; MJ.salir = salir; MJ.expresar = expresar;
})();
