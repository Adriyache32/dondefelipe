/* ═══════════════════════════════════════════════════════════════
   El Mundo de Felipe · df.js — cuentas, progreso y datos (Firebase)
   ───────────────────────────────────────────────────────────────
   Se agrega a cualquier página (ajusta la ruta relativa):
     <script src="../firebase/df.js"></script>

   Qué hace solo, en cada página:
     · Muestra una vez el aviso de privacidad (qué datos se guardan).
     · Mantiene la sesión entre páginas y la cierra tras unas horas
       sin uso (computadores compartidos).
     · Actualiza el botón de cuenta (#df-cuenta) con el nombre.
     · Cuenta la visita de forma anónima.

   Para las páginas:
     DF.ofrecer({ tipo:'puntaje', juego:'odisea', titulo:'Odisea', puntaje: 1234 })
     DF.ofrecer({ tipo:'resultado', sim:'sismos', titulo:'Sismos', datos:{…}, texto:'8 de 10' })
     DF.guardarProgreso('quimica-es', { … })   ·   DF.leerProgreso('quimica-es')

   Si Firebase no está configurado, todo falla en silencio y la
   página sigue funcionando igual que antes.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.DF) return;

  var VER = '10.12.2';
  var yo = document.currentScript;
  var BASE = (yo && yo.src) ? yo.src.replace(/[^\/]*$/, '') : 'firebase/';
  var SIN_VISITA = !!(yo && yo.hasAttribute('data-sin-visita'));
  var SIN_AVISO = !!(yo && yo.hasAttribute('data-sin-aviso'));
  var K_AVISO = 'df_aviso_v1', K_ACT = 'df_ultima_actividad';

  function cargarScript(src) {
    return new Promise(function (ok, mal) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = function () { mal(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }
  function cfg() { return window.DF_CONFIG || {}; }
  function configurado() {
    var f = cfg().firebase;
    return !!(f && f.apiKey && f.projectId && !/PEGA_AQUI/.test(f.apiKey + f.projectId));
  }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function idSeguro(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'sin-nombre';
  }
  function hoyChile() {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    } catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  function limpio(o) { try { return JSON.parse(JSON.stringify(o || {})); } catch (e) { return {}; } }
  function nombreCorto(nombre, email) {
    var p = String(nombre || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return String(email || 'Anónimo').split('@')[0];
    if (p.length === 1) return p[0];
    var ap = p.length >= 3 ? p[p.length - 2] : p[p.length - 1];
    return p[0] + ' ' + ap.charAt(0).toUpperCase() + '.';
  }
  function rutaRaiz() { return BASE.replace(/firebase\/$/, ''); }
  function edadMinima() { return +cfg().edadMinimaSinApoderado || 14; }

  /* ---------- arranque de Firebase (perezoso) ---------- */
  var _fb = null, usuario = null, perfil = null, oyentes = [];
  function avisar() {
    pintarBotonCuenta();
    oyentes.forEach(function (cb) { try { cb(usuario); } catch (e) {} });
  }
  function listo() {
    if (_fb) return _fb;
    _fb = (window.DF_CONFIG ? Promise.resolve() : cargarScript(BASE + 'config.js')).then(function () {
      if (!configurado()) throw new Error('Firebase todavía no está configurado (firebase/config.js).');
      var CDN = cfg().cdn || ('https://www.gstatic.com/firebasejs/' + VER + '/');
      return Promise.all([
        import(CDN + 'firebase-app.js'),
        import(CDN + 'firebase-auth.js'),
        import(CDN + 'firebase-firestore.js')
      ]);
    }).then(function (mods) {
      var A0 = mods[0], A = mods[1], F = mods[2], C = cfg();
      var app = A0.getApps().length ? A0.getApp() : A0.initializeApp(C.firebase);
      var auth = A.getAuth(app);
      var db = F.getFirestore(app);
      if (C.emulador) {
        try { A.connectAuthEmulator(auth, C.emulador.auth, { disableWarnings: true }); } catch (e) {}
        try { var h = C.emulador.firestore.split(':'); F.connectFirestoreEmulator(db, h[0], +h[1]); } catch (e) {}
      }
      var fb = { app: app, auth: auth, db: db, A: A, F: F };
      // La sesión se mantiene entre páginas y pestañas, pero se cierra sola
      // tras unas horas sin uso (ver cerrarSesionTrasHoras en config.js).
      return A.setPersistence(auth, A.browserLocalPersistence).catch(function () {}).then(function () {
        return new Promise(function (ok) {
          var primera = true;
          A.onAuthStateChanged(auth, function (u) {
            if (primera && u && sesionVencida()) {
              primera = false;
              A.signOut(auth).then(function () { usuario = null; perfil = null; avisar(); ok(fb); });
              return;
            }
            usuario = u || null; perfil = null;
            if (u) marcarActividad();
            avisar();
            if (primera) { primera = false; ok(fb); }
          });
        });
      });
    });
    _fb.catch(function (e) { console.info('[DF] ' + e.message); });
    return _fb;
  }
  function horasSesion() { var h = cfg().cerrarSesionTrasHoras; return h === 0 ? 0 : (+h || 3); }
  function sesionVencida() {
    var h = horasSesion(); if (!h) return false;
    var t = +ls(K_ACT) || 0;
    return !t || (Date.now() - t) > h * 3600e3;
  }
  function marcarActividad() { ls(K_ACT, String(Date.now())); }
  ['click', 'keydown', 'touchstart'].forEach(function (ev) {
    var ultimo = 0;
    window.addEventListener(ev, function () { if (usuario && Date.now() - ultimo > 60e3) { ultimo = Date.now(); marcarActividad(); } }, { passive: true, capture: true });
  });

  function esProfe(u) {
    u = u || usuario;
    var lista = (cfg().profes || []).map(function (x) { return String(x).toLowerCase(); });
    return !!(u && u.email && lista.indexOf(u.email.toLowerCase()) >= 0);
  }
  function dominioOk(u) {
    var d = String(cfg().dominioColegio || '').toLowerCase().replace(/^@/, '');
    if (!d || esProfe(u)) return true;
    return !!(u && u.email && u.email.toLowerCase().slice(-(d.length + 1)) === '@' + d);
  }

  /* ---------- sesión ---------- */
  function entrar() {
    return listo().then(function (fb) {
      var p = new fb.A.GoogleAuthProvider();
      var d = String(cfg().dominioColegio || '').replace(/^@/, '');
      var params = { prompt: 'select_account' };
      if (d) params.hd = d;
      p.setCustomParameters(params);
      return fb.A.signInWithPopup(fb.auth, p).then(function (r) {
        if (!dominioOk(r.user)) {
          return fb.A.signOut(fb.auth).then(function () {
            throw new Error('Usa tu cuenta Google del colegio (@' + d + ').');
          });
        }
        usuario = r.user; marcarActividad();
        return r.user;
      });
    }).catch(function (e) {
      if (/popup-blocked/.test(e.code || '')) throw new Error('El navegador bloqueó la ventana de Google. Permite ventanas emergentes e intenta de nuevo.');
      if (/popup-closed|cancelled-popup/.test(e.code || '')) { var x = new Error(''); x.cancelado = true; throw x; }
      throw e;
    });
  }
  function salir() {
    return listo().then(function (fb) { perfil = null; ls(K_ACT, null); return fb.A.signOut(fb.auth); });
  }

  /* ---------- perfil: nombre, correo, edad (y curso si se pide) ---------- */
  function leerPerfil() {
    if (!usuario) return Promise.resolve(null);
    if (perfil && perfil.uid === usuario.uid) return Promise.resolve(perfil);
    return listo().then(function (fb) {
      return fb.F.getDoc(fb.F.doc(fb.db, 'alumnos', usuario.uid)).then(function (s) {
        var d = s.exists() ? s.data() : {};
        perfil = { uid: usuario.uid, existe: s.exists(), nombre: d.nombre || usuario.displayName || '', email: usuario.email || '',
          edad: d.edad || null, curso: d.curso || '', apoderado: !!d.apoderado };
        return perfil;
      });
    });
  }
  function perfilCompleto(pf) {
    if (!pf || !pf.existe || !pf.edad) return false;
    if (cfg().pedirCurso && !pf.curso) return false;
    if (pf.edad < edadMinima() && !pf.apoderado) return false;
    return true;
  }
  function guardarPerfil(datos) {
    return listo().then(function (fb) {
      if (!usuario) throw new Error('Primero entra con tu cuenta.');
      var edad = Math.round(+datos.edad || 0);
      if (!(edad >= 5 && edad <= 99)) throw new Error('Escribe una edad válida.');
      if (edad < edadMinima() && !datos.apoderado) throw new Error('Necesitas que tu apoderado/a esté de acuerdo.');
      var doc = {
        nombre: usuario.displayName || '',
        email: usuario.email || '',
        edad: edad,
        curso: cfg().pedirCurso ? String(datos.curso || '').slice(0, 40) : '',
        apoderado: edad < edadMinima() ? true : false,
        actualizado: fb.F.serverTimestamp()
      };
      return fb.F.setDoc(fb.F.doc(fb.db, 'alumnos', usuario.uid), doc).then(function () {
        perfil = { uid: usuario.uid, existe: true, nombre: doc.nombre, email: doc.email, edad: edad, curso: doc.curso, apoderado: doc.apoderado };
        pintarBotonCuenta();
        return perfil;
      });
    });
  }

  /* ---------- puntajes de juegos ---------- */
  function guardarPuntaje(juego, puntaje, extra) {
    juego = idSeguro(juego);
    puntaje = Math.max(0, Math.round(Number(puntaje) || 0));
    return listo().then(function (fb) {
      if (!usuario) throw new Error('Primero entra con tu cuenta.');
      return leerPerfil().then(function (pf) {
        var F = fb.F, base = {
          juego: juego, uid: usuario.uid,
          nombre: nombreCorto(usuario.displayName, usuario.email),
          curso: (pf && pf.curso) || '',
          puntaje: puntaje, fecha: F.serverTimestamp()
        };
        var reg = Object.assign({ email: usuario.email || '', extra: limpio(extra) }, base);
        return F.addDoc(F.collection(fb.db, 'puntajes'), reg).then(function () {
          var ref = F.doc(fb.db, 'rankings', juego, 'mejores', usuario.uid);
          return F.runTransaction(fb.db, function (tx) {
            return tx.get(ref).then(function (s) {
              var antes = s.exists() ? (s.data().puntaje || 0) : -1;
              if (puntaje > antes) { tx.set(ref, base); return { mejor: puntaje, record: true }; }
              return { mejor: antes, record: false };
            });
          });
        });
      });
    });
  }
  function top(juego, n) {
    return listo().then(function (fb) {
      var F = fb.F;
      var q = F.query(F.collection(fb.db, 'rankings', idSeguro(juego), 'mejores'), F.orderBy('puntaje', 'desc'), F.limit(n || 10));
      return F.getDocs(q).then(function (s) { return s.docs.map(function (d) { return d.data(); }); });
    });
  }

  /* ---------- resultados de simuladores ---------- */
  function guardarResultado(sim, datos) {
    return listo().then(function (fb) {
      if (!usuario) throw new Error('Primero entra con tu cuenta.');
      return leerPerfil().then(function (pf) {
        var F = fb.F;
        return F.addDoc(F.collection(fb.db, 'resultados'), {
          sim: idSeguro(sim), uid: usuario.uid,
          nombre: usuario.displayName || '', email: usuario.email || '',
          curso: (pf && pf.curso) || '',
          datos: limpio(datos), fecha: F.serverTimestamp()
        });
      });
    });
  }

  /* ---------- progreso (avance en planes, juegos, etc.) ---------- */
  function refProgreso(fb, clave) { return fb.F.doc(fb.db, 'progreso', usuario.uid, 'items', idSeguro(clave)); }
  function guardarProgreso(clave, datos) {
    return listo().then(function (fb) {
      if (!usuario) throw new Error('Primero entra con tu cuenta.');
      return fb.F.setDoc(refProgreso(fb, clave), { datos: limpio(datos), actualizado: fb.F.serverTimestamp() });
    });
  }
  function leerProgreso(clave) {
    return listo().then(function (fb) {
      if (!usuario) return null;
      return fb.F.getDoc(refProgreso(fb, clave)).then(function (s) { return s.exists() ? (s.data().datos || null) : null; });
    });
  }

  /* ---------- mis datos: ver, descargar, borrar ---------- */
  function misDatos() {
    return listo().then(function (fb) {
      if (!usuario) throw new Error('Primero entra con tu cuenta.');
      var F = fb.F, uid = usuario.uid;
      var mios = function (col) { return F.getDocs(F.query(F.collection(fb.db, col), F.where('uid', '==', uid))); };
      return Promise.all([
        leerPerfil(),
        mios('puntajes'), mios('resultados'),
        F.getDocs(F.collection(fb.db, 'progreso', uid, 'items'))
      ]).then(function (r) {
        var lista = function (s) { return s.docs.map(function (d) { return Object.assign({ _id: d.id }, d.data()); }); };
        return { perfil: r[0], puntajes: lista(r[1]), resultados: lista(r[2]), progreso: lista(r[3]) };
      });
    });
  }
  function borrarMisDatos() {
    return listo().then(function (fb) {
      if (!usuario) throw new Error('Primero entra con tu cuenta.');
      var F = fb.F, uid = usuario.uid, db = fb.db;
      return misDatos().then(function (d) {
        var juegos = {}; d.puntajes.forEach(function (p) { juegos[p.juego] = 1; });
        var borrar = [];
        d.puntajes.forEach(function (p) { borrar.push(F.deleteDoc(F.doc(db, 'puntajes', p._id))); });
        d.resultados.forEach(function (p) { borrar.push(F.deleteDoc(F.doc(db, 'resultados', p._id))); });
        d.progreso.forEach(function (p) { borrar.push(F.deleteDoc(F.doc(db, 'progreso', uid, 'items', p._id))); });
        Object.keys(juegos).forEach(function (j) { borrar.push(F.deleteDoc(F.doc(db, 'rankings', j, 'mejores', uid))); });
        borrar.push(F.deleteDoc(F.doc(db, 'alumnos', uid)));
        return Promise.all(borrar);
      }).then(function () {
        perfil = null;
        // Borra también la cuenta de acceso; si Google pide volver a entrar, igual cerramos la sesión.
        return fb.A.deleteUser(usuario).catch(function () { return fb.A.signOut(fb.auth); });
      }).then(function () { ls(K_ACT, null); });
    });
  }

  /* ---------- visitas (anónimas) ---------- */
  function paginaActual() {
    var p = location.pathname || '/';
    if (/\.github\.io$/i.test(location.hostname)) p = p.replace(/^\/[^\/]+/, '');   // quita /dondefelipe
    if (/\/$/.test(p)) p += 'index.html';
    return p.replace(/^\/+/, '');
  }
  function visita(pagina) {
    if (cfg().contarVisitas === false) return Promise.resolve();
    pagina = String(pagina || paginaActual());
    var id = pagina.replace(/\//g, '~').slice(0, 120) || 'index.html';
    try {
      var k = 'df_v_' + id;
      if (sessionStorage.getItem(k)) return Promise.resolve();
      sessionStorage.setItem(k, '1');
    } catch (e) {}
    return listo().then(function (fb) {
      var F = fb.F, inc = function () { return { n: F.increment(1), ultima: F.serverTimestamp() }; };
      var w = [F.setDoc(F.doc(fb.db, 'visitas', id), inc(), { merge: true })];
      // Las secciones internas del inicio (index.html#cursos) no suman al total del día.
      if (pagina.indexOf('#') < 0) w.push(F.setDoc(F.doc(fb.db, 'visitas_dias', hoyChile()), inc(), { merge: true }));
      return Promise.all(w);
    }).catch(function (e) { console.info('[DF] visita no registrada: ' + e.message); });
  }

  /* ---------- estilos de las piezas que inserta df.js ---------- */
  var CSS = '' +
    '.dfc,.dfa{font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#f3f1ff}' +
    '.dfc{position:fixed;right:16px;bottom:16px;z-index:2147483000;width:min(350px,calc(100vw - 32px));' +
    'background:#14121f;border:1px solid rgba(255,255,255,.14);border-radius:16px;' +
    'box-shadow:0 18px 50px rgba(0,0,0,.45);padding:16px 16px 14px;transform:translateY(20px);opacity:0;transition:.25s ease}' +
    '.dfc.in,.dfa.in{transform:none;opacity:1}' +
    '.dfc h4{margin:0 26px 6px 0;font-size:15px;font-weight:700;color:#fff}' +
    '.dfc p{margin:0 0 10px;color:#c9c5e6}' +
    '.dfc b.n{color:#c8f55a}' +
    '.dfc .x{position:absolute;top:8px;right:10px;background:none;border:0;color:#9d98c2;font-size:20px;cursor:pointer;line-height:1}' +
    '.dfc .fila,.dfa .fila{display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
    '.dfc button.b,.dfa button.b,.dfa a.b{border:0;border-radius:10px;padding:9px 14px;font:600 14px system-ui,sans-serif;cursor:pointer;text-decoration:none;display:inline-block}' +
    '.dfc .p,.dfa .p{background:#c8f55a;color:#14121f}' +
    '.dfc .s,.dfa .s{background:rgba(255,255,255,.08);color:#f3f1ff}' +
    '.dfc input[type=number],.dfc select{width:90px;padding:8px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:#1f1c30;color:#fff;font:14px system-ui,sans-serif}' +
    '.dfc select{width:auto;flex:1}' +
    '.dfc label.ap{display:flex;gap:8px;align-items:flex-start;margin:8px 0 10px;font-size:13px;color:#e3defc}' +
    '.dfc .legal{font-size:12px;color:#9d98c2;margin:10px 0}' +
    '.dfc .legal a,.dfc .pie a{color:#c8f55a}' +
    '.dfc .ok{color:#c8f55a;font-weight:700}' +
    '.dfc .err{color:#ff8a80}' +
    '.dfc .pie{margin-top:10px;font-size:12px;color:#9d98c2}' +
    '.dfc .pie button{background:none;border:0;color:#9d98c2;text-decoration:underline;cursor:pointer;font:inherit;padding:0}' +
    '.dfa{position:fixed;left:50%;bottom:16px;z-index:2147482999;width:min(720px,calc(100vw - 24px));transform:translate(-50%,20px);opacity:0;transition:.3s ease;' +
    'background:#12101c;border:1px solid rgba(255,255,255,.14);border-left:4px solid #22e3ff;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.5);padding:14px 16px}' +
    '.dfa.in{transform:translate(-50%,0)}' +
    '.dfa b.t{display:block;font-size:15px;color:#fff;margin-bottom:4px}' +
    '.dfa p{margin:0 0 10px;color:#cfcae8}' +
    '.dfa ul{margin:0 0 10px;padding-left:18px;color:#cfcae8}' +
    '.dfa li b{color:#fff}';
  var cssPuesto = false;
  function ponerCSS() { if (cssPuesto) return; var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); cssPuesto = true; }

  /* ---------- aviso de privacidad (una vez por navegador) ---------- */
  function mostrarAviso(forzar) {
    if (!forzar && (SIN_AVISO || cfg().aviso === false || ls(K_AVISO))) return;
    if (document.querySelector('.dfa')) return;
    ponerCSS();
    var a = document.createElement('div');
    a.className = 'dfa'; a.setAttribute('role', 'dialog'); a.setAttribute('aria-label', 'Aviso de privacidad');
    a.innerHTML = '<b class="t">🔒 Tus datos en El Mundo de Felipe</b>' +
      '<p>Puedes usar el sitio sin cuenta. Si entras con Google para guardar tu progreso, guardamos <b>solo lo mínimo</b>:</p>' +
      '<ul><li><b>Nombre</b> y <b>correo</b> (los de tu cuenta Google)</li><li><b>Edad</b> (la escribes tú)</li>' +
      '<li>Tus puntajes, resultados y avances en el sitio</li></ul>' +
      '<p>Solo el profe los ve. No se venden ni se comparten, y puedes borrarlos cuando quieras desde <b>Mi cuenta</b>. Las visitas se cuentan sin saber quién eres.</p>' +
      '<div class="fila"><button class="b p" type="button" data-a="ok">Entendido</button><a class="b s" href="' + rutaRaiz() + 'cuenta.html#privacidad">Más detalles</a></div>';
    document.body.appendChild(a);
    requestAnimationFrame(function () { a.classList.add('in'); });
    a.querySelector('[data-a="ok"]').addEventListener('click', function () {
      ls(K_AVISO, String(Date.now()));
      a.classList.remove('in'); setTimeout(function () { a.remove(); }, 300);
    });
  }

  /* ---------- botón de cuenta (#df-cuenta en el menú) ---------- */
  function pintarBotonCuenta() {
    var els = document.querySelectorAll('#df-cuenta, [data-df-cuenta]');
    els.forEach(function (el) {
      var t = el.querySelector('span') || el;
      t.textContent = usuario ? (String(usuario.displayName || usuario.email || 'Mi cuenta').split(/\s+/)[0]) : 'Entrar';
      el.title = usuario ? ('Sesión iniciada: ' + (usuario.email || '')) : 'Entrar para guardar tu progreso';
    });
  }
  // La portada vuelve a dibujar el menú: revisar el botón de vez en cuando.
  setInterval(function () {
    var el = document.querySelector('#df-cuenta, [data-df-cuenta]');
    if (el && !el.getAttribute('data-df-ok')) { el.setAttribute('data-df-ok', '1'); pintarBotonCuenta(); }
  }, 1500);

  /* ---------- formulario de perfil (edad + aviso), reutilizable ---------- */
  function htmlPerfil(err) {
    var C = cfg();
    var cursos = C.pedirCurso ? '<p style="margin:8px 0 4px">¿Curso?</p><div class="fila"><select data-f="curso"><option value="">Elige tu curso…</option>' +
      (C.cursos || []).map(function (c) { return '<option>' + esc(c) + '</option>'; }).join('') + '</select></div>' : '';
    return '<h4>Un último paso</h4>' +
      '<p>Hola, ' + esc(String(usuario.displayName || usuario.email || '').split(/[\s@]+/)[0]) + '. ¿Cuántos años tienes?</p>' +
      '<div class="fila"><input type="number" min="5" max="99" inputmode="numeric" data-f="edad" aria-label="Edad"> años</div>' + cursos +
      '<label class="ap" data-f="apbox" hidden><input type="checkbox" data-f="apoderado"> <span>Mi apoderado/a sabe que uso esta cuenta en El Mundo de Felipe y está de acuerdo.</span></label>' +
      '<p class="legal">Al continuar aceptas que guardemos tu <b>nombre, correo y edad</b>, junto con tu progreso, para tu aprendizaje. Solo el profe los ve. <a href="' + rutaRaiz() + 'cuenta.html#privacidad" target="_blank" rel="noopener">Más detalles</a></p>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<div class="fila"><button class="b p" type="button" data-a="okperfil">Acepto y continúo</button></div>';
  }
  function engancharPerfil(t) {
    var edad = t.querySelector('[data-f="edad"]'), box = t.querySelector('[data-f="apbox"]');
    if (!edad) return;
    edad.addEventListener('input', function () { box.hidden = !(+edad.value > 0 && +edad.value < edadMinima()); });
    setTimeout(function () { edad.focus(); }, 50);
  }
  function leerFormPerfil(t) {
    var q = function (f) { return t.querySelector('[data-f="' + f + '"]'); };
    return { edad: q('edad') && q('edad').value, curso: q('curso') && q('curso').value, apoderado: q('apoderado') && q('apoderado').checked };
  }

  /* ---------- tarjeta flotante "guardar" ---------- */
  var tarjeta = null, noGracias = false;
  function cerrarTarjeta() {
    if (!tarjeta) return;
    var t = tarjeta; tarjeta = null; t.classList.remove('in');
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
  }

  function ofrecer(op) {
    if (!configurado() && window.DF_CONFIG) return Promise.resolve(null);
    // Si el estudiante ya dijo "No, gracias" en esta página, no insistir.
    if (noGracias && !usuario && !op.insistir) return Promise.resolve(null);
    return listo().then(function () {
      ponerCSS();
      cerrarTarjeta();
      var t = document.createElement('div');
      t.className = 'dfc'; t.setAttribute('role', 'dialog'); t.setAttribute('aria-live', 'polite');
      (op.contenedor || document.body).appendChild(t);
      if (op.contenedor) { t.style.position = 'static'; t.style.width = 'auto'; t.style.margin = '12px 0'; }
      tarjeta = t;
      requestAnimationFrame(function () { t.classList.add('in'); });
      var esPuntaje = op.tipo !== 'resultado';
      var nombreCosa = esPuntaje ? 'puntaje' : 'resultado';
      var resumen = esPuntaje ? ('<b class="n">' + esc(Math.round(op.puntaje || 0)) + ' pts</b>') : ('<b class="n">' + esc(op.texto || 'tu resultado') + '</b>');
      var titulo = esc(op.titulo || (esPuntaje ? op.juego : op.sim) || '');

      function pinta(cuerpo, conPie) {
        var pie = '';
        if (conPie && usuario) {
          pie = '<div class="pie">' + esc(usuario.email) + ' · <button type="button" data-a="salir">no soy yo</button>' +
            (esPuntaje ? ' · <a href="' + rutaRaiz() + 'rankings.html#' + esc(idSeguro(op.juego)) + '" target="_blank" rel="noopener">ver ranking</a>' : '') + '</div>';
        }
        t.innerHTML = '<button class="x" type="button" data-a="cerrar" aria-label="Cerrar">×</button>' + cuerpo + pie;
      }
      function pasoLogin(msgErr) {
        pinta('<h4>' + titulo + '</h4><p>¿Guardar tu ' + nombreCosa + ' (' + resumen + ') ' + (esPuntaje ? 'en el ranking del colegio' : 'para el profe') + '?</p>' +
          (msgErr ? '<p class="err">' + esc(msgErr) + '</p>' : '') +
          '<div class="fila"><button class="b p" type="button" data-a="entrar">Entrar con Google</button>' +
          '<button class="b s" type="button" data-a="cerrar">No, gracias</button></div>', false);
      }
      function pasoPerfil(err) { pinta(htmlPerfil(err), true); engancharPerfil(t); }
      function guardar() {
        pinta('<h4>' + titulo + '</h4><p>Guardando…</p>', true);
        var pr = esPuntaje ? guardarPuntaje(op.juego, op.puntaje, op.extra) : guardarResultado(op.sim, op.datos);
        return pr.then(function (r) {
          var msg = esPuntaje
            ? (r.record ? '<p class="ok">✓ ¡Nuevo récord personal guardado!</p>' : '<p class="ok">✓ Puntaje guardado.</p><p>Tu mejor marca sigue siendo <b class="n">' + esc(r.mejor) + ' pts</b>.</p>')
            : '<p class="ok">✓ Resultado guardado. El profe lo puede ver.</p>';
          pinta('<h4>' + titulo + '</h4>' + msg, true);
          if (op.alGuardar) try { op.alGuardar(r); } catch (e) {}
          setTimeout(function () { if (tarjeta === t) cerrarTarjeta(); }, 9000);
          return r;
        }).catch(function (e) {
          pinta('<h4>' + titulo + '</h4><p class="err">No se pudo guardar: ' + esc(e.message) + '</p>' +
            '<div class="fila"><button class="b p" type="button" data-a="reintentar">Reintentar</button></div>', true);
        });
      }
      function seguir() {
        if (!usuario) { pasoLogin(); return; }
        leerPerfil().then(function (pf) { if (!perfilCompleto(pf)) pasoPerfil(); else guardar(); })
          .catch(function (e) { pasoLogin(e.message); });
      }

      t.addEventListener('click', function (ev) {
        var a = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-a');
        if (a === 'cerrar') { if (!usuario) noGracias = true; cerrarTarjeta(); }
        else if (a === 'entrar') entrar().then(seguir).catch(function (e) { pasoLogin(e.cancelado ? '' : e.message); });
        else if (a === 'salir') salir().then(function () { pasoLogin(); });
        else if (a === 'okperfil') guardarPerfil(leerFormPerfil(t)).then(guardar).catch(function (e) { pasoPerfil(e.message); });
        else if (a === 'reintentar') guardar();
      });
      seguir();
      return true;
    }).catch(function () { return null; });
  }

  window.DF = {
    version: VER,
    listo: listo,
    configurado: function () { return listo().then(function () { return true; }, function () { return false; }); },
    usuario: function () { return usuario; },
    alCambiarUsuario: function (cb) { oyentes.push(cb); if (_fb) _fb.then(function () { cb(usuario); }, function () {}); },
    esProfe: esProfe,
    entrar: entrar,
    salir: salir,
    perfil: leerPerfil,
    perfilCompleto: perfilCompleto,
    guardarPerfil: guardarPerfil,
    guardarPuntaje: guardarPuntaje,
    guardarResultado: guardarResultado,
    guardarProgreso: guardarProgreso,
    leerProgreso: leerProgreso,
    misDatos: misDatos,
    borrarMisDatos: borrarMisDatos,
    top: top,
    visita: visita,
    ofrecer: ofrecer,
    mostrarAviso: mostrarAviso,
    edadMinima: edadMinima,
    idSeguro: idSeguro,
    nombreCorto: nombreCorto,
    hoy: hoyChile
  };

  // Arranque en cada página: sesión, botón de cuenta, aviso y visita.
  function arrancar() {
    listo().then(function () {
      mostrarAviso();
      if (!SIN_VISITA) setTimeout(function () { visita(); }, 800);
    }, function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
