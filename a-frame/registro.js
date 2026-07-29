/* =============================================================================
   registro.js — recolector de respuestas COMPARTIDO por los mundos 3D y las
   slides. Una sola función de envío, una sola identidad, una sola hoja.

   Uso mínimo en cualquier página (mundo o slide):
     <script src="registro.js"></script>
     ...
     Registro.enviar({ actividad: 'Cráteres', pregunta: '¿Por qué...?', respuesta: texto });

   Si el alumno aún no se identificó, enviar() le pide nombre y curso una vez y
   luego manda. Si no hay red, guarda en cola y reintenta solo.
   ============================================================================= */
(function (global) {
  'use strict';

  var Registro = {};

  // ---- Conexión con la planilla del curso ----
  // URL del Web App de Apps Script (Implementar → Aplicación web → /exec).
  Registro.ENDPOINT = 'https://script.google.com/macros/s/AKfycbyGEAhKghwX4YmGs9s8QibDOfPR2icM4iHYHpvYN2IUwerhxH3i7oy-HRh4-OPAjkQe0w/exec';
  // Debe ser IDÉNTICA a la variable SECRETO de Codigo.gs. Si cambias una,
  // cambia la otra y vuelve a implementar el script (nueva versión).
  Registro.SECRETO  = 'cambia-esta-clave';

  var K_ALUMNO = 'rincon_alumno';   // localStorage: identidad
  var K_COLA   = 'rincon_cola';     // localStorage: envíos pendientes

  /* ---------- identidad ---------- */
  Registro.alumno = function () {
    try { return JSON.parse(localStorage.getItem(K_ALUMNO)) || null; }
    catch (e) { return null; }
  };

  Registro.olvidar = function () { try { localStorage.removeItem(K_ALUMNO); } catch (e) {} };

  // Muestra un formulario simple y devuelve una promesa con {nombre, curso}.
  Registro.identificar = function (forzar) {
    var actual = Registro.alumno();
    if (actual && !forzar) return Promise.resolve(actual);
    return new Promise(function (resolve) {
      var fondo = document.createElement('div');
      fondo.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;' +
        'justify-content:center;background:rgba(8,12,12,.7);backdrop-filter:blur(6px);' +
        'font-family:system-ui,sans-serif;';
      fondo.innerHTML =
        '<div style="background:#f2ece0;color:#12211f;border-radius:12px;padding:22px 24px;' +
        'width:min(340px,calc(100vw - 32px));box-shadow:0 14px 40px rgba(0,0,0,.4);">' +
          '<div style="font-weight:800;font-size:16px;margin-bottom:4px;">Antes de empezar</div>' +
          '<div style="font-size:13px;opacity:.7;margin-bottom:14px;">Para registrar tus respuestas.</div>' +
          '<label style="font-size:12px;font-weight:600;">Nombre y apellido</label>' +
          '<input id="reg-nombre" style="width:100%;margin:4px 0 12px;padding:9px 11px;border:1px solid #c9bda0;' +
          'border-radius:8px;font-size:14px;box-sizing:border-box;">' +
          '<label style="font-size:12px;font-weight:600;">Curso</label>' +
          '<input id="reg-curso" placeholder="ej: 1° Medio B" style="width:100%;margin:4px 0 16px;padding:9px 11px;' +
          'border:1px solid #c9bda0;border-radius:8px;font-size:14px;box-sizing:border-box;">' +
          '<button id="reg-ok" style="width:100%;padding:11px;border:none;border-radius:9px;' +
          'background:#2f6b45;color:#fff;font-weight:700;font-size:14px;cursor:pointer;">Entrar</button>' +
        '</div>';
      document.body.appendChild(fondo);
      var iNombre = fondo.querySelector('#reg-nombre');
      var iCurso  = fondo.querySelector('#reg-curso');
      if (actual) { iNombre.value = actual.nombre || ''; iCurso.value = actual.curso || ''; }
      iNombre.focus();
      fondo.querySelector('#reg-ok').onclick = function () {
        var a = { nombre: (iNombre.value || '').trim() || '(sin nombre)',
                  curso:  (iCurso.value  || '').trim() };
        try { localStorage.setItem(K_ALUMNO, JSON.stringify(a)); } catch (e) {}
        document.body.removeChild(fondo);
        resolve(a);
      };
    });
  };

  /* ---------- envío ---------- */
  function armarFila(datos, a) {
    return {
      secreto:   Registro.SECRETO,
      ts:        new Date().toISOString(),
      nombre:    a.nombre, curso: a.curso,
      origen:    datos.origen || (document.title || location.pathname),
      actividad: datos.actividad || '',
      pregunta:  datos.pregunta  || '',
      respuesta: datos.respuesta || ''
    };
  }

  // POST como text/plain: es "simple request", no dispara preflight de CORS.
  function mandar(fila) {
    return fetch(Registro.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(fila)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return true;
    });
    // Nota: si vas por Apps Script directo, la respuesta puede no ser legible por
    // CORS; lo que importa es que no haya error de red. Si la pasas por tu
    // Cloudflare Worker (con cabeceras CORS), aquí sí puedes leer r.json().
  }

  function encolar(fila) {
    var cola = leerCola(); cola.push(fila);
    try { localStorage.setItem(K_COLA, JSON.stringify(cola)); } catch (e) {}
  }
  function leerCola() {
    try { return JSON.parse(localStorage.getItem(K_COLA)) || []; } catch (e) { return []; }
  }

  // Reintenta enviar todo lo pendiente. Se llama al cargar y cada 20 s.
  Registro.reintentar = function () {
    var cola = leerCola();
    if (!cola.length) return;
    var quedan = [];
    var envios = cola.map(function (fila) {
      return mandar(fila).catch(function () { quedan.push(fila); });
    });
    Promise.all(envios).then(function () {
      try { localStorage.setItem(K_COLA, JSON.stringify(quedan)); } catch (e) {}
    });
  };

  // Envía una respuesta. Identifica al alumno si hace falta. Da feedback visual.
  Registro.enviar = function (datos) {
    return Registro.identificar().then(function (a) {
      var fila = armarFila(datos, a);
      return mandar(fila).then(function () {
        aviso('Respuesta enviada \u2713', true);
        return true;
      }).catch(function () {
        encolar(fila);
        aviso('Sin conexi\u00f3n: se enviar\u00e1 al reconectar', false);
        return false;
      });
    });
  };

  /* ---------- feedback ---------- */
  function aviso(txt, ok) {
    var t = document.createElement('div');
    t.textContent = txt;
    t.style.cssText = 'position:fixed;z-index:9998;left:50%;bottom:130px;transform:translateX(-50%);' +
      'background:' + (ok ? 'rgba(47,107,69,.92)' : 'rgba(150,90,40,.92)') + ';color:#fff;' +
      'font:600 13px/1 system-ui;padding:11px 18px;border-radius:11px;pointer-events:none;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.3);transition:opacity .4s;';
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; }, 2200);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2700);
  }

  // arranque: vaciar cola pendiente y reintentar periódicamente
  if (typeof window !== 'undefined') {
    window.addEventListener('load', Registro.reintentar);
    window.addEventListener('online', Registro.reintentar);
    setInterval(Registro.reintentar, 20000);
  }

  global.Registro = Registro;
})(typeof window !== 'undefined' ? window : this);
