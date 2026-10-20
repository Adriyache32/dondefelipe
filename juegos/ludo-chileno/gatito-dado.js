/* ═══════════════════════════════════════════════════════════════
   Gatito que persigue el dado (compartido por Ludo Chileno y Ruta PAES)
   Uso:  await GatitoDado.lanzar(contenedor, numeroFinal, {rapido:false})
   El contenedor debe tener position:relative (el tablero).
   Los cuadros de animación están en la carpeta gatito/ junto a este archivo.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const yo = document.currentScript;
  const BASE = (yo && yo.src ? yo.src.replace(/[^\/]*$/, '') : '') + 'gatito/';
  const CUADROS = ['corre1','corre2','corre3','corre4','corre5','salta2','salta3','salta4','salta5','sentado','mira','feliz','duerme-caja'];
  const ALTO = {corre1:98,corre2:94,corre3:102,corre4:93,corre5:104,salta2:115,salta3:80,salta4:90,salta5:91,sentado:110,mira:114};
  const img = {};
  CUADROS.forEach(n => { const i = new Image(); i.src = BASE + n + '.webp'; img[n] = i; });
  const CARAS = '⚀⚁⚂⚃⚄⚅';
  const K = 'gatito_on';
  let activo = true;
  try { activo = localStorage.getItem(K) !== '0'; } catch (e) {}
  const sinMovimiento = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  (function css() {
    const s = document.createElement('style');
    s.textContent = `
      .gd-capa{position:absolute;inset:0;pointer-events:none;z-index:6;overflow:hidden;transition:opacity .3s}
      .gd-dado{position:absolute;left:0;top:0;width:56px;height:56px;border-radius:12px;background:#fff;border:3px solid #1d2a20;
        box-shadow:0 5px 0 #1d2a20,0 12px 18px rgba(0,0,0,.3);display:grid;place-items:center;font-size:46px;line-height:1;color:#1d2a20;will-change:transform}
      .gd-sombra{position:absolute;left:0;top:0;width:54px;height:12px;border-radius:50%;background:rgba(0,0,0,.28);will-change:transform}
      .gd-gato{position:absolute;left:0;top:0;will-change:transform;filter:drop-shadow(0 6px 6px rgba(0,0,0,.25))}
      .gd-numero{position:absolute;font:800 22px 'Baloo 2',sans-serif;color:#1d2a20;background:#fff8e3;border:2px solid #f2b632;border-radius:999px;padding:0 10px;transform:translate(-50%,-100%);animation:gd-pop .3s cubic-bezier(.3,1.6,.5,1)}
      @keyframes gd-pop{from{transform:translate(-50%,-100%) scale(.3);opacity:0}}
      @media (max-width:560px){.gd-dado{width:42px;height:42px;font-size:34px;border-radius:9px}}`;
    document.head.appendChild(s);
  })();

  const espera = ms => new Promise(r => setTimeout(r, ms));
  const suave = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function lanzar(cont, final, op) {
    // como máximo espera 2,5 s; si algo falla, el juego sigue
    return Promise.race([lanzarReal(cont, final, op).catch(e => console.warn('[gatito]', e)), espera(2500)]);
  }
  async function lanzarReal(cont, final, op) {
    op = op || {};
    if (!activo || !cont || sinMovimiento() || !img.corre1.complete || !img.corre1.naturalWidth) return;
    const W = cont.clientWidth, H = cont.clientHeight;
    if (W < 200 || H < 150) return;
    const dur = op.rapido ? 650 : 1150, quieto = op.rapido ? 250 : 650;
    const capa = document.createElement('div'); capa.className = 'gd-capa';
    const sombra = document.createElement('div'); sombra.className = 'gd-sombra';
    const dado = document.createElement('div'); dado.className = 'gd-dado';
    const gato = document.createElement('img'); gato.className = 'gd-gato'; gato.alt = '';
    capa.append(sombra, dado, gato); cont.appendChild(capa);
    const tamDado = dado.offsetWidth || 56;
    const k = Math.max(.55, Math.min(1.25, H / 560));            // escala del gato según el tablero
    const suelo = H * (op.suelo || .8), x0 = W * .06, x1 = W * .64;
    let cara = 0, ultCara = 0;
    const t0 = performance.now();
    await new Promise(fin => {
      function paso() {
        try {
        const ahora = performance.now(), dt = Math.max(0, ahora - t0);
        const t = Math.min(1, dt / dur), e = suave(t);
        // el dado rebota cada vez más bajo y gira
        const dx = x0 + (x1 - x0) * e;
        const rebote = Math.abs(Math.sin(t * Math.PI * 3.2)) * (1 - t) * H * .2;
        const dy = suelo - tamDado - rebote;
        dado.style.transform = `translate(${dx}px,${dy}px) rotate(${(1 - e) * 720}deg)`;
        sombra.style.transform = `translate(${dx + 1}px,${suelo - 6}px) scale(${1 - rebote / (H * .3)})`;
        if (t < .86 && ahora - ultCara > 75) { cara = Math.floor(Math.random() * 6); ultCara = ahora; dado.textContent = CARAS[cara]; }
        if (t >= .86) dado.textContent = CARAS[final - 1];
        // el gato corre detrás y al final salta hacia el dado
        let n, gx, gy = 0;
        if (t < .7) {
          n = 'corre' + (1 + Math.floor(dt / 70) % 5);
          gx = dx - (150 + 40 * Math.sin(t * 6)) * k;
        } else {
          const s = (t - .7) / .3;
          n = s < .3 ? 'salta2' : s < .65 ? 'salta3' : s < .9 ? 'salta4' : 'salta5';
          gx = dx - (150 * (1 - s) + 95 * s) * k;
          gy = Math.sin(s * Math.PI) * H * .12;
        }
        const alto = (ALTO[n] || 100) * k;
        if (gato.dataset.n !== n && img[n]) { gato.src = img[n].src; gato.dataset.n = n; }
        gato.style.height = alto + 'px';
        gato.style.transform = `translate(${gx}px,${suelo - alto + 4 - gy}px)`;
        if (t < 1) requestAnimationFrame(paso); else fin();
        } catch (err) { console.warn('[gatito]', err); fin(); }
      }
      requestAnimationFrame(paso);
    });
    // se sienta junto al dado y mira el resultado
    const dx = x1;
    const n = final === 6 ? 'mira' : 'sentado', alto = ALTO[n] * k;
    gato.src = img[n].src; gato.style.height = alto + 'px';
    gato.style.transform = `translate(${dx - 92 * k}px,${suelo - alto + 4}px)`;
    dado.style.transform = `translate(${dx}px,${suelo - tamDado}px) rotate(0deg)`;
    const num = document.createElement('div'); num.className = 'gd-numero'; num.textContent = final;
    num.style.left = (dx + tamDado / 2) + 'px'; num.style.top = (suelo - tamDado - 8) + 'px';
    capa.appendChild(num);
    // el juego sigue mientras el gato se queda mirando un momento
    setTimeout(() => { capa.style.opacity = '0'; setTimeout(() => capa.remove(), 320); }, quieto);
  }

  function setActivo(v) { activo = !!v; try { localStorage.setItem(K, activo ? '1' : '0'); } catch (e) {} }
  // botón para encender o apagar el gatito
  function boton(el) {
    if (!el) return;
    const pintar = () => { el.textContent = activo ? '🐱 Gatito: sí' : '🐱 Gatito: no'; el.setAttribute('aria-pressed', activo); };
    el.addEventListener('click', () => { setActivo(!activo); pintar(); });
    pintar();
  }
  window.GatitoDado = { lanzar, setActivo, activo: () => activo, boton, imagen: n => BASE + n + '.webp' };
})();
