/* ═══════════════════════════════════════════════════════════════
   Ludo Chileno · música y efectos de sonido
   · Música: "The Slope of Quiet" (tranquila) y "Sombras de la cordillera"
     (tensión), con fundido cruzado entre ambas.
   · Efectos sintetizados con Web Audio (no pesan nada): dado, premio
     por 6 y ficha capturada.
   Los navegadores no dejan sonar nada hasta el primer clic: la música
   parte sola con la primera interacción.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const yo = document.currentScript;
  const BASE = (yo && yo.src ? yo.src.replace(/[^\/]*$/, '') : '') + 'musica/';
  const VOL_MUSICA = .42, FUNDIDO = 1800;
  const pref = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v === '1'; } catch (e) { return d; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, v ? '1' : '0'); } catch (e) {} };
  let musicaOn = pref('ludo_musica', true), sonidosOn = pref('ludo_sonidos', true);
  let modo = 'tranquila', desbloqueado = false, ctx = null;

  const pistas = {};
  ['tranquila', 'tension'].forEach(n => {
    // sin música activada no se descarga nada; la de tensión se baja recién cuando hace falta
    const a = new Audio(); a.loop = true; a.preload = 'none'; a.volume = 0;
    a.dataset.src = BASE + n + '.mp3';
    if (n === 'tranquila' && musicaOn) { a.src = a.dataset.src; a.preload = 'auto'; }
    pistas[n] = a;
  });
  const fades = {};
  function fundir(a, hasta, ms, alTerminar) {
    clearInterval(fades[a.src]);
    const desde = a.volume, t0 = performance.now();
    fades[a.src] = setInterval(() => {
      const t = Math.min(1, (performance.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, desde + (hasta - desde) * t));
      if (t >= 1) { clearInterval(fades[a.src]); if (alTerminar) alTerminar(); }
    }, 50);
  }
  function aplicarMusica() {
    if (!desbloqueado) return;
    ['tranquila', 'tension'].forEach(n => {
      const a = pistas[n], activa = musicaOn && n === modo;
      if (activa) { if (!a.getAttribute('src')) a.src = a.dataset.src; if (a.paused) { a.play().catch(() => {}); } fundir(a, VOL_MUSICA, FUNDIDO); }
      else if (!a.paused) fundir(a, 0, FUNDIDO, () => { a.pause(); });
    });
  }
  // la música parte con el primer clic o tecla (regla de los navegadores)
  function desbloquear() {
    if (desbloqueado) return;
    desbloqueado = true;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    aplicarMusica();
    ['pointerdown', 'keydown'].forEach(ev => document.removeEventListener(ev, desbloquear, true));
  }
  ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, desbloquear, true));
  // si la pestaña queda oculta, la música se pausa
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Object.values(pistas).forEach(a => a.pause());
    else aplicarMusica();
  });

  /* ── efectos sintetizados ── */
  function listo() { if (!sonidosOn || !ctx) return false; if (ctx.state === 'suspended') ctx.resume(); return true; }
  function ruido(dur) {
    const n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function golpe(t, vol, frec) { // un "toc" del dado contra la mesa
    const s = ctx.createBufferSource(); s.buffer = ruido(.05);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = frec; f.Q.value = 3;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + .05);
    s.connect(f).connect(g).connect(ctx.destination); s.start(t); s.stop(t + .06);
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(frec / 6, t);
    const g2 = ctx.createGain(); g2.gain.setValueAtTime(vol * .5, t); g2.gain.exponentialRampToValueAtTime(.001, t + .07);
    o.connect(g2).connect(ctx.destination); o.start(t); o.stop(t + .08);
  }
  function nota(t, frec, dur, vol, tipo) {
    const o = ctx.createOscillator(); o.type = tipo || 'triangle'; o.frequency.setValueAtTime(frec, t);
    const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .015);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .02);
  }
  // dado: varios golpes que se espacian, como si rodara y se detuviera
  function dado() {
    if (!listo()) return;
    const t = ctx.currentTime;
    let dt = 0;
    for (let k = 0; k < 9; k++) { golpe(t + dt, .5 - k * .04, 1800 + Math.random() * 1400); dt += .045 + k * .018; }
  }
  // premio por 6: arpegio brillante tipo "moneda"
  function seis() {
    if (!listo()) return;
    const t = ctx.currentTime + .02;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, k) => { nota(t + k * .075, f, .35, .22, 'triangle'); nota(t + k * .075, f * 2, .18, .05, 'sine'); });
    nota(t + .4, 1568, .6, .12, 'sine');
  }
  // ficha capturada: caída descendente y un golpe seco
  function captura() {
    if (!listo()) return;
    const t = ctx.currentTime + .02;
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(110, t + .45);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(2400, t); f.frequency.exponentialRampToValueAtTime(300, t + .45);
    const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.22, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
    o.connect(f).connect(g).connect(ctx.destination); o.start(t); o.stop(t + .52);
    golpe(t + .46, .7, 260);
    nota(t + .5, 98, .35, .25, 'sine');
  }

  function setModo(m) { if (m !== 'tension') m = 'tranquila'; if (m === modo) return; modo = m; aplicarMusica(); }
  function botones(bMusica, bSonidos) {
    const pintar = () => {
      if (bMusica) { bMusica.textContent = musicaOn ? '🎵 Música: sí' : '🎵 Música: no'; bMusica.setAttribute('aria-pressed', musicaOn); }
      if (bSonidos) { bSonidos.textContent = sonidosOn ? '🔊 Sonidos: sí' : '🔇 Sonidos: no'; bSonidos.setAttribute('aria-pressed', sonidosOn); }
    };
    if (bMusica) bMusica.addEventListener('click', () => { musicaOn = !musicaOn; guardar('ludo_musica', musicaOn); desbloquear(); aplicarMusica(); pintar(); });
    if (bSonidos) bSonidos.addEventListener('click', () => { sonidosOn = !sonidosOn; guardar('ludo_sonidos', sonidosOn); pintar(); });
    pintar();
  }
  window.Sonido = { dado, seis, captura, setModo, modo: () => modo, botones };
})();
