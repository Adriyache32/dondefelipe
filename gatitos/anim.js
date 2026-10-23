/* Animaciones de los gatitos que tienen cuadros de movimiento (Ava y Calha).
   Funciona solo: busca en la página las imágenes gatitos/img/<id>.webp de esos gatitos y,
   de vez en cuando (o al pasar el mouse / tocarlas), reproduce una rutina y vuelve a la foto.
   Para agregar otro gatito animado: pon su id en ANIMADOS y usa los mismos cuadros o agrega otros. */
(function () {
  'use strict';
  var ANIMADOS = { ava: 1, calha: 1 };
  var A = {
    caminar:  { n: 4, ms: 130, vueltas: 4 },
    correr:   { n: 5, ms: 85,  vueltas: 4 },
    jugar:    { n: 4, ms: 260, vueltas: 2 },
    sentarse: { n: 3, ms: 320, vueltas: 1 },
    dormir:   { n: 4, ms: 650, vueltas: 1 }
  };
  var RUTINAS = [['caminar'], ['correr'], ['jugar'], ['sentarse', 'dormir'], ['caminar', 'sentarse']];
  var guion = document.currentScript && document.currentScript.src || '';
  var raiz = guion.replace(/gatitos\/anim\.js.*$/, '');
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var precargado = false;

  function idDe(img) {
    var m = (img.dataset.gatoBase || img.getAttribute('src') || '').match(/gatitos\/img\/([a-z0-9_-]+)\.webp/);
    return m && ANIMADOS[m[1]] ? m[1] : null;
  }
  function precargar() {
    if (precargado) return; precargado = true;
    Object.keys(A).forEach(function (a) { for (var i = 1; i <= A[a].n; i++) { var im = new Image(); im.src = raiz + 'gatitos/anim/' + a + '-' + i + '.webp'; } });
  }
  function jugar(img, rutina) {
    if (!img || img._anim || !idDe(img)) return;
    precargar();
    rutina = rutina || RUTINAS[Math.floor(Math.random() * RUTINAS.length)];
    if (!img.dataset.gatoBase) img.dataset.gatoBase = img.getAttribute('src');
    var pasos = [];
    rutina.forEach(function (a) { var d = A[a]; for (var v = 0; v < d.vueltas; v++) for (var i = 1; i <= d.n; i++) pasos.push([a + '-' + i, d.ms]); });
    img._anim = true; var k = 0;
    (function sig() {
      if (k >= pasos.length || !img.isConnected) { img.src = img.dataset.gatoBase; img._anim = false; return; }
      img.src = raiz + 'gatitos/anim/' + pasos[k][0] + '.webp';
      setTimeout(sig, pasos[k++][1]);
    })();
  }
  function visibles() {
    return Array.prototype.filter.call(document.querySelectorAll('img'), function (img) {
      if (img._anim || !idDe(img)) return false;
      var r = img.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
    });
  }
  // Al pasar el mouse o tocar: camina (o corre, si ya lo hizo hace poco).
  function alApuntar(e) {
    var img = e.target && e.target.closest ? e.target.closest('img') : null;
    if (img && idDe(img)) jugar(img, Math.random() < .5 ? ['caminar'] : ['correr']);
  }
  document.addEventListener('mouseover', alApuntar);
  document.addEventListener('touchstart', alApuntar, { passive: true });
  // Solo, cada pocos segundos, uno de los que están en pantalla.
  if (!quieto) setInterval(function () {
    if (document.hidden) return;
    var l = visibles(); if (!l.length) return;
    if (Math.random() < .7) jugar(l[Math.floor(Math.random() * l.length)]);
  }, 4000);
  window.GatoAnim = { jugar: jugar, animados: ANIMADOS };
})();
