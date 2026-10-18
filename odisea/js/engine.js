/* ============================================================
   ODISEA CÓSMICA · engine.js
   MOTOR — estado, bucle, física, colisiones, input, podio.
   Orquesta Config + Worlds + Audio + Graphics.
   ============================================================ */
window.OC = window.OC || {};
OC.Engine = (function () {
  const C = OC.Config, SAGAS = OC.Sagas, A = OC.Audio, G = OC.Graphics;
  // La saga activa define los mundos y las preguntas. Se fija en el menú.
  let PLANETAS = SAGAS[0].worlds, PREGUNTAS = SAGAS[0].preguntas;
  const SUPERFICIE = ['mercurio', 'venus', 'litosfera', 'ecosistema'];

  let W = 0, H = 0, cv = null, stageEl = null;
  let last = performance.now();

  const state = {
    scene: 'menu', saga: SAGAS[0], sagaIndex: 0, level: 0, score: 0, lives: C.lives.start, nombre: '', curso: '',
    ship: { x: 0, y: 0, w: C.ship.w, h: C.ship.h, speed: 5, cd: 0, tilt: 0 },
    bullets: [], enemies: [], powerups: [], particles: [], stars: [], bossShots: [],
    boss: null, bossPending: false, bossT: 0, charge: 0, beam: 0, beamAcc: 0, blasts: [], readyShown: false, levelT: 0, marks: {}, phaseLabel: '', destroyed: 0, spawnT: 0, spawnQueue: [], pending: false,
    qDeck: [], lastQ: null, checkpoint: null, paused: false, briefFinal: false,
    speedBuff: 0, powerBuff: 0, storm: 0, eventT: 0, nextEvent: 9000, msgKilledBy: '', groundY: 0,
    temp: 0, tempActive: false, tempRate: 0, coolT: 0, tempWarned: false, currentQ: null, final: false,
    coins: 0, upgrades: { armadura: 0, armamento: 0, cadencia: 0, rayo_especial: 0, refrigeracion: 0 }, shield: 0, shieldMax: 0, invuln: 0
  };
  const keys = { left: false, right: false, fire: false };
  const $ = id => document.getElementById(id);
  const worldNow = () => PLANETAS[Math.min(state.level, PLANETAS.length - 1)];
  const groundFor = p => SUPERFICIE.includes(p.scene) ? H * 0.84 : H + 40;
  const envNow = () => ({ groundY: state.groundY, H: H, fondo: worldNow().fondo || worldNow().scene });

  /* -------- PODIO -------- */
  function loadLB() { try { return JSON.parse(localStorage.getItem('odisea_lb') || '[]'); } catch (e) { return (window.__lb || []); } }
  function saveLB(a) { try { localStorage.setItem('odisea_lb', JSON.stringify(a)); } catch (e) { window.__lb = a; } }
  async function pushToSheet(row) {
    if (!C.sheetEndpoint) return;
    try { await fetch(C.sheetEndpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(row) }); } catch (e) {}
  }
  function fetchLeaderboard() {
    return new Promise(res => {
      if (!C.sheetEndpoint) { res(null); return; }
      const cb = '__lb_' + Date.now() + Math.floor(Math.random() * 9999);
      const s = document.createElement('script'); let done = false;
      const clean = () => { try { delete window[cb]; } catch (_) { window[cb] = undefined; } if (s.parentNode) s.parentNode.removeChild(s); };
      const finish = v => { if (done) return; done = true; clearTimeout(t); clean(); res(v); };
      const t = setTimeout(() => finish(null), C.podium.fetchTimeoutMs);
      window[cb] = data => finish((data && data.top) ? data.top : null);
      s.onerror = () => finish(null);
      s.src = C.sheetEndpoint + (C.sheetEndpoint.indexOf('?') >= 0 ? '&' : '?') + 'action=top&limit=' + C.podium.topN + '&callback=' + cb + '&t=' + Date.now();
      document.body.appendChild(s);
    });
  }
  async function registrarPuntaje() {
    // Ranking del colegio en Firebase (firebase/df.js). Si el sitio no lo carga, no hace nada.
    try {
      if (window.DF && state.score > 0) {
        const p0 = PLANETAS[Math.min(state.level, PLANETAS.length - 1)] || {};
        DF.ofrecer({
          tipo: 'puntaje', juego: 'odisea', titulo: 'Odisea' + (state.saga && state.saga.titulo ? ' · ' + state.saga.titulo : ''),
          puntaje: state.score,
          extra: { saga: state.sagaIndex, mision: p0.num, planeta: p0.nombre, victoria: state.scene === 'victoria' }
        });
      }
    } catch (e) {}
    if (!C.podium.enabled) return;
    const p = PLANETAS[Math.min(state.level, PLANETAS.length - 1)];
    const row = { nombre: state.nombre || 'Anónimo', curso: state.curso || '', mision: p.num, planeta: p.nombre, puntaje: state.score, fecha: new Date().toISOString().slice(0, 10) };
    const lb = loadLB(); lb.push(row); lb.sort((a, b) => b.puntaje - a.puntaje); saveLB(lb.slice(0, C.podium.localMax));
    await pushToSheet(row);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  async function renderPodio(elId, incluirActual) {
    const el = $(elId); if (!el || !C.podium.enabled) return;
    el.innerHTML = '<div class="podio-empty">Consultando el podio…</div>';
    let lb = await fetchLeaderboard(); const online = !!lb; if (!lb) lb = loadLB();
    lb = lb.slice().sort((a, b) => b.puntaje - a.puntaje);
    const med = ['🥇', '🥈', '🥉', '4', '5']; let html = '';
    const top = lb.slice(0, C.podium.topN);
    if (top.length === 0) html = '<div class="podio-empty">Aún no hay puntajes registrados.</div>';
    top.forEach((r, i) => {
      const me = (r.nombre === state.nombre && Number(r.puntaje) === state.score);
      html += `<div class="podio-row ${me ? 'me' : ''}"><span class="nm"><span class="med">${med[i] || (i + 1)}</span>${escapeHtml(r.nombre)}${r.curso ? ' · ' + escapeHtml(r.curso) : ''}</span><span class="sc">${r.puntaje}</span></div>`;
    });
    if (incluirActual) html += `<div class="podio-row me"><span class="nm"><span class="med">▸</span>${escapeHtml(state.nombre || 'TÚ')} (en curso)</span><span class="sc">${state.score}</span></div>`;
    html += `<div class="podio-empty" style="margin-top:6px;opacity:.7">${online ? '🌐 Podio del curso' : '💾 Podio local (sin conexión al Sheet)'}</div>`;
    el.innerHTML = html;
  }

  /* -------- PANTALLAS -------- */
  const screens = ['menu', 'nombre', 'intro', 'briefing', 'tienda', 'levelup', 'q-screen', 'gameover', 'victoria'];
  function show(id) {
    screens.forEach(s => { const el = $(s); if (el) el.classList.toggle('on', s === id); });
    $('hud').style.display = (state.scene === 'playing') ? 'flex' : 'none';
    $('hint').style.display = (state.scene === 'playing' && !isTouch) ? 'block' : 'none';
    $('btn-mute').style.display = $('btn-pause').style.display = (state.scene === 'playing') ? 'flex' : 'none';
    if (state.scene !== 'playing' && state.paused) { state.paused = false; $('pausa').classList.remove('on'); $('btn-pause').textContent = '⏸'; }
    $('buffs').style.display = (state.scene === 'playing') ? 'block' : 'none';
    $('touch').classList.toggle('on', state.scene === 'playing' && isTouch);
    if (state.scene !== 'playing') clearPad();
  }

  /* -------- HUD -------- */
  function drawHUD() {
    const p = PLANETAS[state.level];
    $('hud-mision').textContent = state.final ? 'EXAMEN FINAL' : ('MISIÓN ' + p.num + ' · ' + p.nombre.toUpperCase());
    $('hud-puntos').textContent = 'PTS ' + state.score;
    $('hud-vidas').textContent = (state.lives > 0 ? ('♥ '.repeat(state.lives)).trim() : '—');
    let bh = '<span class="b-coin">🪙 ' + state.coins + '</span>';
    if (state.shieldMax > 0) bh += '<span class="b-shield">🛡️ ' + state.shield + '</span>';
    if (state.speedBuff > 0) bh += '<span class="b-vel">⚡ VEL ' + Math.ceil(state.speedBuff / 1000) + '</span>';
    if (state.powerBuff > 0) bh += '<span class="b-pow">✦ PODER ' + Math.ceil(state.powerBuff / 1000) + '</span>';
    $('buffs').innerHTML = bh;
  }

  /* -------- ESTRELLAS -------- */
  function initStars() { state.stars = []; for (let i = 0; i < C.stars.count; i++) state.stars.push({ x: Math.random(), y: Math.random(), s: Math.random() * 1.6 + 0.4, v: 0.15 + Math.random() * 0.5 }); }
  function baseSpeed() { return C.ship.baseSpeed + state.level * C.ship.speedPerLevel; }

  /* -------- MENÚ DE SAGAS -------- */
  function buildMenu() {
    const cont = $('saga-cards'); if (!cont) return;
    cont.innerHTML = '';
    SAGAS.forEach((s, i) => {
      const card = document.createElement('button');
      card.className = 'saga-card';
      card.style.setProperty('--acc', s.color);
      card.innerHTML = '<span class="ic">' + (s.icono || '★') + '</span><span class="ti">' + escapeHtml(s.titulo) + '</span><span class="su">' + escapeHtml(s.subtitulo) + '</span>';
      card.onclick = () => { A.unlock(); selectSaga(i); };
      cont.appendChild(card);
    });
  }
  function resetRun() {
    state.level = 0; state.score = 0; state.lives = C.lives.start;
    state.coins = 0; state.upgrades = { armadura: 0, armamento: 0, cadencia: 0, rayo_especial: 0, refrigeracion: 0 };
    state.shield = 0; state.shieldMax = 0; state.final = false; state.msgKilledBy = ''; state.invuln = 0;
    state.charge = 0; state.beam = 0; state.blasts = []; state.readyShown = false;
    state.qDeck = []; state.lastQ = null; state.checkpoint = null; state.briefFinal = false; state.paused = false; state.spawnQueue = [];
  }
  function selectSaga(i) {
    state.sagaIndex = i; state.saga = SAGAS[i];
    PLANETAS = state.saga.worlds; PREGUNTAS = state.saga.preguntas;
    resetRun();
    if (!C.podium.enabled) { showIntro(); return; }   // sin podio no hace falta el nombre
    state.scene = 'nombre'; show('nombre'); setTimeout(() => $('in-nombre').focus(), 50);
  }
  function showIntro() {
    const s = state.saga;
    $('intro-sello').textContent = s.intro.sello;
    $('intro-titulo').textContent = s.titulo;
    $('intro-sub').textContent = 'de ' + s.intro.narrador;
    $('intro-texto').textContent = s.intro.texto;
    $('intro-firma').textContent = '— ' + s.intro.narrador;
    state.scene = 'intro'; show('intro');
  }

  /* -------- CHECKPOINT: reintentar sin perder toda la saga -------- */
  function snapshot(final) {
    state.checkpoint = { level: state.level, score: state.score, coins: state.coins, upgrades: Object.assign({}, state.upgrades), final: !!final };
  }
  function retry() {
    const cp = state.checkpoint;
    if (C.retry === 'saga' || !cp) { resetRun(); startBriefing(); return; }
    state.level = cp.level; state.score = cp.score; state.coins = cp.coins; state.upgrades = Object.assign({}, cp.upgrades);
    state.lives = C.lives.start; state.shield = 0; state.shieldMax = 0; state.msgKilledBy = ''; state.invuln = 0; state.final = false;
    if (cp.final) startFinalBriefing(); else startBriefing();
  }

  /* -------- BRIEFINGS (papiro antes de cada misión y del examen final) -------- */
  function controles() { return isTouch ? '◀ ▶ mover · FUEGO disparar · RAYO cuando la barra esté llena · dispara a las minas 💥 desde lejos' : '◂ ▸ mover · ESPACIO disparar · B rayo especial (barra llena) · P pausa · dispara a las minas 💥 desde lejos'; }
  function fillBriefing(sello, titulo, sub, texto, jefe, ctrl) {
    $('brief-sello').textContent = sello; $('brief-titulo').textContent = titulo; $('brief-sub').textContent = sub;
    $('brief-texto').textContent = texto; $('brief-boss').textContent = jefe; $('brief-ctrl').textContent = ctrl;
  }
  function startBriefing() {
    const p = PLANETAS[state.level]; state.briefFinal = false; state.final = false;
    fillBriefing(p.autor.sello, 'Misión ' + p.num + ' · ' + p.nombre, p.sub, p.contexto, '⚠ Guardián de la misión: ' + p.boss.nombre + (p.boss.aviso ? ' — ' + p.boss.aviso : ''),
      p.cooling ? '🌡 En esta misión sube la temperatura: recoge ❄ para enfriar · ' + controles() : controles());
    state.scene = 'briefing'; show('briefing'); A.stopAmbient();
  }
  function startFinalBriefing() {
    const fb = state.saga.finalBoss; state.briefFinal = true; state.level = PLANETAS.length - 1; state.final = false;
    fillBriefing(fb.autor.sello, 'Examen final', fb.sub, fb.contexto, '⚠ Guardián final: ' + fb.nombre, controles());
    state.scene = 'briefing'; show('briefing'); A.stopAmbient();
  }

  /* -------- JEFE FINAL DE SAGA (El gran Profesor Felipe) -------- */
  function startFinalBoss() {
    const s = state.saga, last = PLANETAS[PLANETAS.length - 1]; resizeNow(); snapshot(true);
    state.scene = 'playing'; state.final = true; state.briefFinal = false;
    state.bullets = []; state.enemies = []; state.powerups = []; state.particles = []; state.bossShots = []; state.spawnQueue = []; state.blasts = []; state.beam = 0;
    state.bossPending = false; state.destroyed = 0; state.spawnT = 0; state.pending = false;
    state.speedBuff = 0; state.powerBuff = 0; state.storm = 0; state.tempActive = false; state.msgKilledBy = ''; state.invuln = 0;
    state.ship.speed = baseSpeed();
    state.shieldMax = state.upgrades.armadura; state.shield = state.shieldMax;
    state.groundY = groundFor(last);
    state.ship.x = W / 2 - state.ship.w / 2; state.ship.tilt = 0;
    state.ship.y = Math.min(H - state.ship.h - 14, state.groundY - state.ship.h - 6);
    initStars();
    const fb = s.finalBoss, hp = fb.hp || C.finalBoss.hpDefault;
    state.boss = { name: fb.nombre, color: fb.color, x: W / 2 - C.finalBoss.w / 2, y: H * C.boss.yFactor, w: C.finalBoss.w, h: C.finalBoss.h, hp: hp, maxhp: hp, vx: C.finalBoss.moveVx, cd: 400, t: 0, look: fb.look, shot: fb.shot, final: true, burst: 0 };
    drawHUD(); show('playing'); A.ambient(last); A.boss(); announce('★ EXAMEN FINAL: ' + fb.nombre, '#ffd76b');
  }

  /* -------- INICIO DE MISIÓN -------- */
  function startLevel() {
    const p = PLANETAS[state.level]; resizeNow(); snapshot(false);
    state.scene = 'playing'; state.briefFinal = false;
    state.bullets = []; state.enemies = []; state.powerups = []; state.particles = []; state.bossShots = []; state.spawnQueue = [];
    state.boss = null; state.bossPending = false; state.destroyed = 0; state.spawnT = 0; state.pending = false;
    state.levelT = 0; state.marks = {}; state.phaseLabel = ''; state.blasts = []; state.beam = 0;
    state.speedBuff = 0; state.powerBuff = 0; state.storm = 0; state.eventT = 0;
    state.nextEvent = p.duracion ? p.duracion * 0.34 : C.events.firstMin + Math.random() * C.events.firstRand;
    state.tempActive = !!p.cooling; state.temp = 0; state.tempWarned = false; state.final = false; state.msgKilledBy = ''; state.invuln = 0;
    state.tempRate = C.temperature.rate * (1 - state.upgrades.refrigeracion * 0.2);
    state.coolT = C.temperature.coolFirst;
    state.shieldMax = state.upgrades.armadura; state.shield = state.shieldMax;
    state.ship.speed = baseSpeed();
    state.groundY = groundFor(p);
    state.ship.x = W / 2 - state.ship.w / 2; state.ship.tilt = 0;
    state.ship.y = Math.min(H - state.ship.h - 14, state.groundY - state.ship.h - 6);
    initStars(); drawHUD(); show('playing'); A.ambient(p);
  }

  /* -------- RAMPA DE DIFICULTAD (misiones con temporizador) --------
     Si el mundo define `duracion` (ms), la misión es un viaje: empieza suave y
     la dificultad sube hasta que, al terminar el tiempo, aparece el jefe. */
  function rampa() { const p = PLANETAS[state.level]; return (p && p.duracion && !state.final) ? Math.min(1, state.levelT / p.duracion) : null; }
  function fmtT(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }


  /* -------- FLOTA, MINAS, ONDAS Y RAYO ESPECIAL -------- */
  function avance() {   // misión completada + fracción de la actual (0 a ~N)
    const p = PLANETAS[state.level]; if (!p || state.final) return 0;
    const pr = p.duracion ? Math.min(1, state.levelT / p.duracion) : Math.min(1, state.destroyed / Math.max(1, p.meta || 1));
    return state.level + pr;
  }
  function naveCausa() { const en = state.saga.enemigos || {}; return en.nave || 'una nave enemiga'; }
  function minaCausa() { const en = state.saga.enemigos || {}; return en.mina || 'una mina espacial'; }
  function trySpawnSpecial() {
    const d = avance(), F = C.fleet, S = C.fleetShare;
    if (d < Math.min(C.mine.unlockD, F.caza.unlock)) return false;
    if (Math.random() > Math.min(S.max, S.base + S.perD * d)) return false;
    if (d >= C.mine.unlockD && Math.random() < C.mine.share) { spawnMine(); return true; }
    const opts = Object.keys(F).filter(k => d >= F[k].unlock);
    if (!opts.length) return false;
    let tot = 0; opts.forEach(k => tot += F[k].weight);
    let r = Math.random() * tot, kind = opts[0];
    for (const k of opts) { r -= F[k].weight; if (r <= 0) { kind = k; break; } }
    if (kind === 'dron') { const n = Math.min(5, 3 + Math.floor(d / 3)), x0 = 30 + Math.random() * (W - 60 - n * 34); for (let i = 0; i < n; i++) spawnShip('dron', x0 + i * 34, -30 - i * 26); }
    else spawnShip(kind);
    return true;
  }
  function spawnMine() {
    const M = C.mine;
    state.enemies.push({ x: 24 + Math.random() * (W - 48 - M.size), y: -M.size, w: M.size, h: M.size, vy: M.fall * (0.85 + Math.random() * 0.4), vx: (Math.random() - 0.5) * 0.4, type: 'mine', rot: 0, vr: 0.012, seed: Math.random() * 6.28, hp: 1 });
  }
  function spawnShip(kind, x, y) {
    const F = C.fleet[kind];
    state.enemies.push({ x: x === undefined ? 20 + Math.random() * (W - 40 - F.w) : x, y: y === undefined ? -F.h : y, w: F.w, h: F.h, vy: F.vy * (0.9 + Math.random() * 0.2), vx: 0, type: 'ship', kind, hp: F.hp, rot: 0, vr: 0,
      seed: Math.random() * 6.28, age: 0, shootT: F.shoot ? F.shoot * (0.4 + Math.random() * 0.6) : 0, flash: 0 });
  }
  function enemyShot(kind, x, y, vx, vy, from) {
    const bomb = kind === 'bomba';
    state.bossShots.push({ x: x - (bomb ? 6 : 4), y, w: bomb ? 12 : 8, h: bomb ? 20 : 16, vy, vx, kind, from: from || naveCausa(), rot: 0, vr: 0, sway: 0 });
  }
  function updateShips(dt, k) {
    const sh = state.ship;
    state.enemies.forEach(e => {
      if (e.type === 'ship') {
        e.age += dt; if (e.flash > 0) e.flash -= dt;
        if (e.kind === 'caza') e.x += Math.sin(e.age * 0.003 + e.seed) * 1.3 * k;
        else if (e.kind === 'dron') e.x += Math.sin(e.age * 0.004 + e.seed) * 1.8 * k;
        else if (e.kind === 'interceptor') { const dx = (sh.x + sh.w / 2) - (e.x + e.w / 2); e.vx += Math.max(-0.05, Math.min(0.05, dx * 0.0008)) * k; e.vx = Math.max(-2, Math.min(2, e.vx)); }
        else if (e.kind === 'pesada') e.x += Math.sin(e.age * 0.0014 + e.seed) * 0.6 * k;
        const F = C.fleet[e.kind];
        if (F.shoot && e.y > 10 && e.y < H * 0.58) {
          e.shootT -= dt;
          if (e.shootT <= 0) {
            e.shootT = F.shoot * (0.85 + Math.random() * 0.3); const cx0 = e.x + e.w / 2, by = e.y + e.h * 0.85, sp = 3.0 + Math.min(1.2, avance() * 0.12);
            if (e.kind === 'caza') enemyShot('bala', cx0, by, 0, sp);
            else if (e.kind === 'pesada') { enemyShot('bala', cx0, by, 0, sp); enemyShot('bala', cx0 - 10, by, -0.9, sp * 0.95); enemyShot('bala', cx0 + 10, by, 0.9, sp * 0.95); }
            else if (e.kind === 'bombardeo') enemyShot('bomba', cx0, by, 0, 1.5);
          }
        }
      } else if (e.type === 'mine') { e.age = (e.age || 0) + dt; e.x += Math.sin(e.age * 0.002 + e.seed) * 0.25 * k; }
    });
  }
  function padReady() { if (padEls && padEls.special) padEls.special.classList.toggle('ready', state.charge >= C.special.max && state.beam <= 0); }
  function addCharge(n) {
    if (state.beam > 0 || state.charge >= C.special.max) return;
    state.charge = Math.min(C.special.max, state.charge + n); padReady();
    if (state.charge >= C.special.max && !state.readyShown) { state.readyShown = true; A.ready(); announce(isTouch ? '⚡ ¡RAYO LISTO! Toca RAYO' : '⚡ ¡RAYO LISTO! Pulsa B', '#ffd76b'); }
  }
  function killEnemy(e, viaBlast) {   // destruye (ya sin su vida) y da recompensas
    const mid = { x: e.x + e.w / 2, y: e.y + e.h / 2 };
    if (e.type === 'mine') { detonate(e); return; }
    boom(mid.x, mid.y, e.type === 'meteor' ? '#f2a93b' : (e.type === 'ship' ? '#ff7a3a' : '#ff8bd0'), e.type === 'ship' && e.kind === 'pesada'); A.explosion();
    state.score += e.type === 'ship' ? C.score.enemy * 2 : C.score.enemy; state.coins += e.type === 'ship' ? 2 : C.coins.perEnemy; state.destroyed++;
    addCharge(e.type === 'ship' ? C.special.perShip : C.special.perKill); drawHUD();
  }
  function detonate(m, hostile) {   // mina (o bomba) → onda expansiva
    if (m.boom) return; m.boom = true;
    const x = m.x + m.w / 2, y = m.y + m.h / 2, R = hostile ? 62 : C.mine.blastR;
    state.blasts.push({ x, y, r: 4, max: R, t: 0, dur: C.mine.blastMs, hit: new Set(), hostile: !!hostile });
    boom(x, y, hostile ? '#ff9a3b' : '#ffd76b', true); A.mine(); shake();
    if (!hostile) { state.score += C.score.enemy; state.destroyed++; addCharge(C.special.perMine); drawHUD(); }
  }
  function bossDamage(n) {
    const b = state.boss; if (!b) return false;
    if (b.look === 'alex' && b.phase !== 'respira') { state.particles.push({ x: b.x + b.w / 2, y: b.y + b.h * 0.9, vx: 0, vy: 0, life: 1, color: '#7fd6ff', ring: true, rs: 0.8 }); return false; }
    b.hp -= n; b.flash = 140; state.score += C.score.bossHit; drawHUD();
    if (b.hp <= 0) {
      boom(b.x + b.w / 2, b.y + b.h / 2, b.color, true); boom(b.x + b.w * 0.25, b.y + b.h * 0.5, '#ff7a3a'); boom(b.x + b.w * 0.75, b.y + b.h * 0.4, '#ffd76b');
      const fue = b.final; state.coins += fue ? C.coins.perFinalDefeat : C.coins.perBossDefeat; state.boss = null; state.bossShots = []; state.blasts = []; state.beam = 0;
      if (fue) victoria(); else completeLevel(); return true;
    }
    return false;
  }
  function updateBlasts(dt) {
    const sh = state.ship;
    for (let bi = 0; bi < state.blasts.length; bi++) {
      const bl = state.blasts[bi]; bl.t += dt; const u = Math.min(1, bl.t / bl.dur); bl.r = bl.max * (1 - Math.pow(1 - u, 2.2));
      if (bl.hostile) {
        if (!bl.hit.has('ship') && Math.hypot(sh.x + sh.w / 2 - bl.x, sh.y + sh.h / 2 - bl.y) <= bl.r + 6) { bl.hit.add('ship'); hitShip('una bomba de la flota'); }
        continue;
      }
      state.enemies.forEach(e => {
        if (bl.hit.has(e) || e.dead) return;
        if (Math.hypot(e.x + e.w / 2 - bl.x, e.y + e.h / 2 - bl.y) <= bl.r + e.w / 2) {
          bl.hit.add(e);
          if (e.type === 'ship') { e.hp -= 3; e.flash = 120; if (e.hp <= 0) { e.dead = true; killEnemy(e, true); } }
          else { e.dead = true; killEnemy(e, true); }
        }
      });
      state.enemies = state.enemies.filter(e => !e.dead);
      state.bossShots = state.bossShots.filter(s => Math.hypot(s.x + s.w / 2 - bl.x, s.y + s.h / 2 - bl.y) > bl.r + 8);
      if (state.boss && !bl.hit.has('boss') && Math.hypot(state.boss.x + state.boss.w / 2 - bl.x, state.boss.y + state.boss.h / 2 - bl.y) <= bl.r + state.boss.w / 2) { bl.hit.add('boss'); if (bossDamage(C.mine.boss)) return; }
      if (!bl.hit.has('ship') && Math.hypot(sh.x + sh.w / 2 - bl.x, sh.y + sh.h / 2 - bl.y) <= bl.r * 0.85) { bl.hit.add('ship'); hitShip('la onda de ' + minaCausa()); }
    }
    state.blasts = state.blasts.filter(bl => bl.t < bl.dur + 120);
  }
  function fireSpecial() {
    if (state.scene !== 'playing' || state.paused || state.beam > 0 || state.charge < C.special.max) return;
    state.beam = C.special.durationMs; state.beamAcc = 0; state.charge = 0; state.readyShown = false; padReady(); A.special(); shake();
    announce('⚡ RAYO ESPECIAL', '#ffd76b');
  }
  function updateBeam(dt) {
    const S = C.special, sh = state.ship, cxp = sh.x + sh.w / 2, col = { x: cxp - S.width / 2, y: 0, w: S.width, h: sh.y };
    state.beam -= dt; state.beamAcc += dt;
    state.enemies.forEach(e => {
      if (e.dead || !hit(col, e)) return;
      if (e.type === 'ship') { e.hp -= dt / 140; e.flash = 60; if (e.hp <= 0) { e.dead = true; killEnemy(e); } }
      else { e.dead = true; killEnemy(e); }
    });
    state.enemies = state.enemies.filter(e => !e.dead);
    state.bossShots = state.bossShots.filter(s => !hit(col, s));
    if (state.boss && hit(col, state.boss)) { while (state.beamAcc >= 100 / (S.bossDps / 10)) { state.beamAcc -= 100 / (S.bossDps / 10); if (bossDamage(1)) return; } }
    else if (state.beamAcc > 400) state.beamAcc = 0;
    if (state.beam < 0) state.beam = 0;
  }

  /* -------- SPAWN -------- */
  function spawnEnemy(forceAlien) {
    if (!forceAlien && !state.final && trySpawnSpecial()) return;
    const pr = rampa();
    const meteor = forceAlien ? false : (Math.random() < (pr === null ? C.enemy.alienChance : 0.92 - 0.36 * pr));   // al inicio casi solo meteoritos; luego aparecen más centinelas
    const size = meteor ? 20 + Math.random() * 16 : 22;
    const spd = (pr === null ? (C.enemy.baseFall + state.level * C.enemy.fallPerLevel) : (0.7 + 1.1 * pr)) * (0.7 + Math.random() * 0.6);
    state.enemies.push({ x: 20 + Math.random() * (W - 40 - size), y: -size, w: size, h: size, vy: spd, vx: (Math.random() - 0.5) * 1.2, type: meteor ? 'meteor' : 'alien', rot: 0, vr: (Math.random() - 0.5) * 0.1, seed: Math.random() * 6.28 });
  }
  function spawnWave() {
    const n = C.events.waveCount, gap = W / (n + 1);
    for (let i = 0; i < n; i++) state.enemies.push({ x: gap * (i + 1) - 11, y: -30 - (i % 2) * 22, w: 22, h: 22, vy: 1.1 + state.level * 0.1, vx: 0, type: 'alien', rot: 0, vr: 0, seed: i });
  }
  function spawnPowerup(kind) {
    if (kind === 'vida' && state.lives >= C.lives.max) kind = 'vel';
    state.powerups.push({ x: 20 + Math.random() * (W - 56), y: -24, w: C.powerups.size, h: C.powerups.size, vy: C.powerups.fallSpeed, t: 0, kind });
  }
  function randomPowerupKind() {
    const r = Math.random(), w = C.powerups.weights;
    return r < w.vida ? 'vida' : (r < w.vida + w.vel ? 'vel' : 'pow');
  }

  /* -------- EVENTOS -------- */
  function triggerEvent() {
    const ev = state.saga.eventos || {};
    if (Math.random() < 0.5) { state.storm = C.events.stormMs; announce(ev.tormenta || '☄ TORMENTA DE METEORITOS', '#f2a93b'); }
    else { announce(ev.oleada || '🛸 OLEADA ENEMIGA', '#ff6bd0'); spawnWave(); }
    A.event();
  }
  function announce(t, c) { const b = $('banner'); b.textContent = t; b.style.color = c; b.classList.add('show'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 2400); }

  /* -------- DISPARO / PARTÍCULAS -------- */
  function fire() {
    if (state.ship.cd > 0) return;
    const up = state.upgrades, rapid = state.powerBuff > 0;
    state.ship.cd = Math.max(5, (rapid ? C.ship.fireCdRapid : C.ship.fireCd) - up.cadencia * 2);
    const bx = state.ship.x + state.ship.w / 2 - 2, by = state.ship.y - 6, sp = C.bullet.speed;
    const pierce = up.rayo_especial >= 1;
    const bd = 1 + (up.rayo_especial >= 2 ? 1 : 0);   // daño a jefes
    const triple = rapid || up.armamento >= 2;
    const doble = !triple && up.armamento >= 1;
    const mkB = (x, vx) => ({ x, y: by, w: C.bullet.w + (pierce ? 2 : 0), h: C.bullet.h, vy: sp, vx: vx || 0, pierce, bd });
    if (triple) {
      state.bullets.push(mkB(bx, 0));
      state.bullets.push(mkB(bx - 9, -C.bullet.spreadVx));
      state.bullets.push(mkB(bx + 9, C.bullet.spreadVx));
    } else if (doble) {
      state.bullets.push(mkB(bx - 6, 0));
      state.bullets.push(mkB(bx + 6, 0));
    } else {
      state.bullets.push(mkB(bx, 0));
    }
    A.shoot();
  }
  function boom(x, y, color, big) {
    for (let i = 0; i < (big ? 26 : 12); i++) { const a = Math.random() * 6.28, s = 1 + Math.random() * (big ? 5.5 : 3.5); state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color }); }
    state.particles.push({ x, y, vx: 0, vy: 0, life: 1, color, ring: true, rs: big ? 2.3 : 1 });
  }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function shake() { if (!stageEl.animate) return; stageEl.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 180 }); }
  // Daño a la nave: el escudo (armadura) absorbe impactos antes de perder vida.
  // Daño a la nave: ventana de invulnerabilidad (i-frames) para no encajar
  // varios impactos en un mismo contacto (p. ej. rozar al jefe). El escudo
  // (armadura) absorbe impactos antes de perder vida.
  function hitShip(causa) {
    if (state.invuln > 0) return;
    state.invuln = C.ship.iframesMs;
    if (state.shield > 0) { state.shield--; A.power(); drawHUD(); shake(); boom(state.ship.x + state.ship.w / 2, state.ship.y, '#5bd6ff'); return; }
    loseLife(causa);
  }

  /* -------- JEFE -------- */
  function spawnBoss() {
    const p = PLANETAS[state.level];
    state.enemies = []; state.spawnQueue = [];
    if (p.boss.look === 'alex') { spawnAlex(p); return; }
    state.boss = { name: p.boss.nombre, color: p.boss.color, x: W / 2 - C.boss.w / 2, y: H * C.boss.yFactor, w: C.boss.w, h: C.boss.h, hp: p.boss.hp, maxhp: p.boss.hp, vx: C.boss.vxBase + state.level * C.boss.vxPerLevel, cd: 0, t: 0, look: p.boss.look || 'guardian', deco: p.boss.deco, shot: p.boss.shot || 'bolt' };
    announce('☠ JEFE: ' + p.boss.nombre, '#ff4d57'); A.boss();
  }

  /* -------- PROFESOR ALEX (jefe de la misión 1) --------
     Su poder es hablar. HABLA → lanza rayos y está protegido por sonido (nada lo daña).
     RESPIRA → se queda sin aire: es vulnerable y no ataca. Antes de hablar da un AVISO.
     Mientras menos vida le queda, respira menos y habla más. */
  function spawnAlex(p) {
    const bw = 140, bh = 86;
    state.boss = { name: p.boss.nombre, color: p.boss.color, look: 'alex', x: W / 2 - bw / 2, y: H * (C.boss.yFactor + 0.04), w: bw, h: bh, hp: p.boss.hp, maxhp: p.boss.hp, vx: 0, dir: 1, cd: 0, t: 0,
      phase: 'respira', pt: 2200, talkIdx: 0, pat: 0, shotT: 0, beams: [], flash: 0, puff: 0, said: {} };
    announce('☠ JEFE: ' + p.boss.nombre, '#ff4d57'); A.boss();
  }
  function alexShot(b, vx, vy, bx, by) {
    state.bossShots.push({ x: bx - 4, y: by, w: 8, h: 14, vy, vx, kind: 'nota', sway: Math.random() * 6.28, rot: 0, vr: 0 });
  }
  function updateAlex(dt) {
    const b = state.boss, k = dt / 16.667, hf = b.hp / b.maxhp, sh = state.ship, shx = sh.x + sh.w / 2, shy = sh.y;
    b.t += dt; b.pt -= dt; if (b.flash > 0) b.flash -= dt;
    // movimiento: casi quieto al avisar, tranquilo al respirar, ágil al hablar
    const mult = b.phase === 'habla' ? 1.5 : (b.phase === 'respira' ? 0.45 : 0.1), spd = (C.boss.vxBase + 0.2) * mult;
    b.x += b.dir * spd * k; if (b.x < 8) { b.x = 8; b.dir = 1; } if (b.x > W - b.w - 8) { b.x = W - b.w - 8; b.dir = -1; }
    b.vx = b.dir * spd;
    b.y = H * (C.boss.yFactor + 0.04) + Math.sin(b.t * 0.0034) * (b.phase === 'respira' ? 12 : 6);
    // cambio de fase
    if (b.pt <= 0) {
      if (b.phase === 'respira') { b.phase = 'aviso'; b.pt = 650; A.noteMusical(); }
      else if (b.phase === 'aviso') {
        b.phase = 'habla'; b.pat = b.talkIdx % 3; b.talkIdx++; b.shotT = 0; b.beams = [];
        b.pt = 2600 + 1000 * (1 - hf); if (b.pat === 2) b.pt = Math.max(b.pt, 3100);
        if (b.pat === 2) { b.beams.push({ x: shx, w: 44, t: 0 }); if (hf < 0.5) b.beams.push({ x: shx + (shx < W / 2 ? 130 : -130), w: 44, t: 0 }); }
        if (!b.said.habla) { b.said.habla = 1; announce('🎵 HABLA: protegido, ¡esquiva sus notas!', '#ffd76b'); }
        A.noteMusical();
      } else {
        b.phase = 'respira'; b.pt = 2600 - 900 * (1 - hf); b.beams = [];
        if (!b.said.respira) { b.said.respira = 1; announce('💨 RESPIRA: ¡ahora es vulnerable!', '#7cffb0'); }
      }
    }
    // ataques mientras habla
    if (b.phase === 'habla') {
      b.shotT -= dt;
      const bx = b.x + b.w * 0.55, by = b.y + b.h * 0.72, sp = 3.0 + (1 - hf) * 0.8;
      if (b.shotT <= 0) {
        if (b.pat === 0) {   // notas dirigidas hacia ti
          [-0.22, 0, 0.22].forEach(a => { const ang = Math.atan2(Math.max(60, shy - by), shx - bx) + a; alexShot(b, Math.cos(ang) * sp, Math.max(1.4, Math.sin(ang) * sp), bx, by); });
          b.shotT = hf < 0.5 ? 340 : 460;
        } else if (b.pat === 1) {   // abanico
          for (let i = -2; i <= 2; i++) alexShot(b, i * 1.05, sp * 0.9, bx, by);
          b.shotT = 680 - (1 - hf) * 160;
        } else { alexShot(b, (shx - bx) * 0.004, sp, bx, by); b.shotT = 900; }
        A.noteMusical();
      }
    }
    // rayos de voz: avisan 750 ms y luego queman 900 ms
    b.beams.forEach((bm, i) => {
      bm.t += dt;
      if (bm.t < 750) { const tx = i === 0 ? shx : shx + (shx < W / 2 ? 130 : -130); bm.x += (Math.max(30, Math.min(W - 30, tx)) - bm.x) * Math.min(1, 0.09 * k); }
      else if (bm.t < 1650) { if (hit(sh, { x: bm.x - bm.w / 2, y: b.y + b.h * 0.6, w: bm.w, h: H })) { boom(sh.x + sh.w / 2, sh.y, '#ffd76b'); hitShip('el rayo de voz de ' + b.name); if (state.scene !== 'playing') return; } }
    });
    b.beams = b.beams.filter(bm => bm.t < 1700);
    // humo cuando está herido
    if (hf < 0.66) { b.puff -= dt; if (b.puff <= 0) { b.puff = hf < 0.33 ? 90 : 180; state.particles.push({ x: b.x + b.w * (0.3 + Math.random() * 0.3), y: b.y + b.h * 0.3, vx: (Math.random() - 0.5) * 0.4, vy: -0.9, life: 0.9, color: hf < 0.33 ? '#ff8a3a' : '#9aa0aa' }); } }
    // disparos del jugador: solo dañan mientras RESPIRA
    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const bu = state.bullets[i];
      if (!hit(bu, b)) continue;
      if (b.phase === 'respira') {
        b.hp -= (bu.bd || 1); b.flash = 160; boom(bu.x, bu.y, '#ffb35a'); A.explosion(); state.score += C.score.bossHit; drawHUD();
        if (!bu.pierce) state.bullets.splice(i, 1);
        if (b.hp <= 0) { boom(b.x + b.w / 2, b.y + b.h / 2, b.color, true); boom(b.x + b.w * 0.25, b.y + b.h * 0.5, '#ff7a3a'); boom(b.x + b.w * 0.75, b.y + b.h * 0.4, '#ffd76b'); state.coins += C.coins.perBossDefeat; state.boss = null; state.bossShots = []; completeLevel(); return; }
      } else {   // el escudo de sonido desvía el disparo
        state.particles.push({ x: bu.x, y: b.y + b.h * 0.9, vx: 0, vy: 0, life: 1, color: '#7fd6ff', ring: true, rs: 0.5 });
        state.bullets.splice(i, 1);
      }
    }
    if (hit(sh, b)) hitShip('el choque con ' + b.name);
  }
  function updateBoss(dt) {
    if (state.boss.look === 'alex') { updateAlex(dt); return; }
    const b = state.boss; b.t += dt;
    b.x += b.vx * (dt / 16.667); if (b.x < 8) { b.x = 8; b.vx *= -1; } if (b.x > W - b.w - 8) { b.x = W - b.w - 8; b.vx *= -1; }
    b.y = H * C.boss.yFactor + Math.sin(b.t * (b.final ? 0.0032 : 0.002)) * (b.final ? 26 : 18);
    b.cd -= dt;
    if (b.cd <= 0) {
      const k = b.shot;
      const sz = k === 'roca' ? 16 : (k === 'roca_fuerte' || k === 'magma') ? 20 : (k === 'electron' ? 11 : (k === 'nota' ? 8 : 10));
      const baseSp = C.boss.shotSpeedBase + state.level * C.boss.shotSpeedPerLevel;
      const mk = (cxp, vy, vx) => ({ x: cxp - sz / 2, y: b.y + b.h, w: sz, h: (k === 'nota' ? 14 : sz), vy, vx: vx || 0, kind: k, sway: Math.random() * 6.28, rot: 0, vr: (Math.random() - 0.5) * 0.2 });
      if (b.final) {
        b.cd = C.finalBoss.shotCd;
        const sp = baseSp + 1.4;
        state.bossShots.push(mk(b.x + b.w / 2, sp, 0));
        state.bossShots.push(mk(b.x + b.w * 0.32, sp * 0.95, -1.6));
        state.bossShots.push(mk(b.x + b.w * 0.68, sp * 0.95, 1.6));
        b.burst = (b.burst || 0) + 1;
        if (b.burst % C.finalBoss.spreadEvery === 0) { // andanada más ancha
          state.bossShots.push(mk(b.x + b.w * 0.15, sp * 0.9, -3.0));
          state.bossShots.push(mk(b.x + b.w * 0.85, sp * 0.9, 3.0));
        }
      } else {
        b.cd = C.boss.shotCdBase - state.level * C.boss.shotCdPerLevel;
        state.bossShots.push(mk(b.x + b.w / 2, baseSp, 0));
        if (state.level >= C.boss.tripleFromLevel) {
          state.bossShots.push(mk(b.x + 12, baseSp * 0.9, 0));
          state.bossShots.push(mk(b.x + b.w - 12, baseSp * 0.9, 0));
        }
      }
      if (k === 'nota') A.noteMusical();
      else if (k === 'roca' || k === 'roca_fuerte' || k === 'magma') A.explosion();
      else if (k === 'electron') A.power();
    }
    for (let i = state.bullets.length - 1; i >= 0; i--) {
      if (hit(state.bullets[i], b)) {
        b.hp -= (state.bullets[i].bd || 1); boom(state.bullets[i].x, state.bullets[i].y, b.color); state.bullets.splice(i, 1); A.explosion();
        state.score += C.score.bossHit; drawHUD();
        if (b.hp <= 0) { boom(b.x + b.w / 2, b.y + b.h / 2, b.color, true); const fue = b.final; state.coins += fue ? C.coins.perFinalDefeat : C.coins.perBossDefeat; state.boss = null; state.bossShots = []; if (fue) victoria(); else completeLevel(); return; }
      }
    }
    if (hit(state.ship, b)) hitShip('el choque con ' + b.name);
  }

  /* -------- BUCLE -------- */
  function loop(now) { const dt = Math.min(40, now - last); last = now; if (state.scene === 'playing' && !state.paused) update(dt); render(); requestAnimationFrame(loop); }

  function update(dt) {
    const p = PLANETAS[state.level], sh = state.ship;
    const k = dt / 16.667;   // 1 a 60 Hz; escala todo lo que antes avanzaba "por frame"
    const spd = sh.speed * (state.speedBuff > 0 ? C.buffs.speedMult : 1) * k;
    if (keys.left) sh.x -= spd; if (keys.right) sh.x += spd;
    sh.x = Math.max(6, Math.min(W - sh.w - 6, sh.x));
    sh.tilt += (((keys.left ? -1 : 0) + (keys.right ? 1 : 0)) - sh.tilt) * Math.min(1, 0.22 * k);   // alabeo visual
    if (keys.fire && state.beam <= 0) fire(); if (sh.cd > 0) sh.cd -= k;
    if (state.speedBuff > 0) state.speedBuff -= dt;
    if (state.powerBuff > 0) state.powerBuff -= dt;
    if (state.invuln > 0) state.invuln -= dt;
    if (state.speedBuff > 0 || state.powerBuff > 0) drawHUD();

    state.stars.forEach(s => { s.y += s.v * 0.004 * k; if (s.y > 1) { s.y = 0; s.x = Math.random(); } });

    // TEMPERATURA (Venus)
    if (state.tempActive) {
      const T = C.temperature;
      state.temp += state.tempRate * dt * (state.boss ? T.bossHeatMult : 1);
      state.coolT -= dt;
      if (state.coolT <= 0) { state.coolT = T.coolIntervalMin + Math.random() * T.coolIntervalRand; spawnPowerup('frio'); }
      if (!state.tempWarned && state.temp >= T.warnAt) { state.tempWarned = true; announce('🔥 ¡SOBRECALENTAMIENTO!', '#ff4d57'); A.overheat(); }
      if (state.temp < T.warnResetBelow) state.tempWarned = false;
      if (state.temp >= T.maxTemp) { state.temp = T.maxTemp; state.msgKilledBy = 'el sobrecalentamiento'; gameOver(); return; }
      drawHUD();
    }

    if (!state.boss) {
      const pr = rampa(), calm = pr !== null && state.bossPending;   // en la espera del jefe no entra nada nuevo
      if (pr !== null) {
        state.levelT += dt;
        (p.hitos || []).forEach((h, i) => { if (!state.marks[i] && pr >= h[0]) { state.marks[i] = 1; state.phaseLabel = h[2] || state.phaseLabel; announce(h[1], h[3] || '#ffd76b'); } });
        if (state.levelT >= p.duracion && !state.bossPending) { state.bossPending = true; state.bossT = 3400; state.phaseLabel = '⚠ Alex se acerca'; announce('⚠ Una voz resuena en el vacío…', '#ff4d57'); A.boss(); }
      }
      if (!calm) {
        state.spawnT += dt;
        const rate = pr === null ? Math.max(C.spawn.baseMin, p.baseSpawn - state.level * C.spawn.perLevelReduce) : Math.round(1900 - 1250 * Math.pow(pr, 1.1));
        const dbl = pr === null ? C.spawn.doubleChance + state.level * C.spawn.doubleChancePerLevel : 0.04 + 0.5 * pr;
        if (state.spawnT > rate) { state.spawnT = 0; spawnEnemy(); if (Math.random() < dbl) state.spawnQueue.push(C.spawn.doubleDelay); }
        for (let qi = state.spawnQueue.length - 1; qi >= 0; qi--) { state.spawnQueue[qi] -= dt; if (state.spawnQueue[qi] <= 0) { state.spawnQueue.splice(qi, 1); spawnEnemy(); } }
        if (state.storm > 0) { state.storm -= dt; if (Math.random() < C.events.stormSpawnChance * k) spawnEnemy(false); }
        state.eventT += dt;
        if (state.eventT > state.nextEvent) { state.eventT = 0; state.nextEvent = pr === null ? C.events.nextMin + Math.random() * C.events.nextRand : 12000 - 5500 * pr + Math.random() * 3000; triggerEvent(); }
        if (Math.random() < C.powerups.chance * k && state.powerups.length < C.powerups.maxOnScreen) spawnPowerup(randomPowerupKind());
        if (Math.random() < C.coins.pickupChance * k) spawnPowerup('moneda');
      }
      if (pr === null && state.destroyed >= p.meta && !state.bossPending) { state.bossPending = true; state.bossT = 600; }
      if (state.bossPending) { state.bossT -= dt; if (state.bossT <= 0) { spawnBoss(); return; } }
    }

    state.bullets.forEach(b => { b.y += b.vy * k; b.x += (b.vx || 0) * k; });
    state.bullets = state.bullets.filter(b => b.y + b.h > 0 && b.x > -10 && b.x < W + 10);

    updateShips(dt, k);
    state.enemies.forEach(e => { e.y += e.vy * k; e.x += e.vx * k; e.rot += e.vr * k; if (e.type === 'alien') e.x += Math.sin((e.y + e.seed) * 0.04) * 0.7 * k; if (e.x < 6) { e.x = 6; e.vx = Math.abs(e.vx); } if (e.x > W - e.w - 6) { e.x = W - e.w - 6; e.vx = -Math.abs(e.vx); } });

    state.powerups.forEach(pu => { pu.y += pu.vy * k; pu.t += dt; });
    state.bossShots.forEach(s => {
      s.y += s.vy * k; s.x += (s.vx || 0) * k;
      if (s.kind === 'nota') { s.sway = (s.sway || 0) + 0.12 * k; s.x += Math.sin(s.sway) * 1.5 * k; }
      else if (s.kind === 'roca' || s.kind === 'roca_fuerte') { s.rot = (s.rot || 0) + (s.vr || 0.1) * k; }
      else if (s.kind === 'magma') { s.sway = (s.sway || 0) + 0.08 * k; s.x += Math.sin(s.sway) * 0.8 * k; }
      else if (s.kind === 'bomba' && s.y > Math.min(H * 0.74, state.groundY - 30)) { s.gone = true; detonate({ x: s.x, y: s.y, w: s.w, h: s.h }, true); }
    });
    state.bossShots = state.bossShots.filter(s => !s.gone && s.y < H + 20 && s.x > -20 && s.x < W + 20);
    updateBlasts(dt); if (state.beam > 0) updateBeam(dt);
    if (state.scene !== 'playing') return;

    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const bu = state.bullets[i]; if (!bu) continue;
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        const e = state.enemies[j]; if (e.dead || !hit(bu, e)) continue;
        if (e.type === 'mine') { e.dead = true; detonate(e); }
        else if (e.type === 'ship') {
          e.hp -= 1; e.flash = 90;
          if (e.hp <= 0) { e.dead = true; killEnemy(e); } else { boom(bu.x, bu.y, '#ffb35a'); A.hit && 0; }
        } else { e.dead = true; killEnemy(e); }
        if (!bu.pierce) { state.bullets.splice(i, 1); break; }
      }
    }
    state.enemies = state.enemies.filter(e => !e.dead);
    for (let j = state.powerups.length - 1; j >= 0; j--) {
      if (hit(sh, state.powerups[j])) {
        const kind = state.powerups[j].kind; state.powerups.splice(j, 1);
        if (kind === 'vida') { openQuestion(); return; }
        if (kind === 'vel') { state.speedBuff = C.buffs.speedMs; A.power(); announce('⚡ VELOCIDAD', '#5bd6ff'); }
        if (kind === 'pow') { state.powerBuff = C.buffs.powerMs; A.power(); announce('✦ PODER TRIPLE', '#ff9a3b'); }
        if (kind === 'frio') { const amt = C.temperature.coolAmount + state.upgrades.refrigeracion * 8; state.temp = Math.max(0, state.temp - amt); A.coolant(); announce('❄ REFRIGERANTE −' + amt + '°', '#5bd6ff'); }
        if (kind === 'moneda') { state.coins += C.coins.pickup; A.power(); announce('🪙 +' + C.coins.pickup, '#ffd76b'); }
        drawHUD();
      }
    }
    for (let j = state.enemies.length - 1; j >= 0; j--) {
      if (hit(sh, state.enemies[j])) {
        const e = state.enemies[j]; state.enemies.splice(j, 1); boom(sh.x + sh.w / 2, sh.y, '#7cff6b'); const en = state.saga.enemigos || {};
        if (e.type === 'mine') { detonate(e); hitShip(minaCausa()); return; }
        hitShip(e.type === 'meteor' ? (en.meteoro || 'un meteorito') : e.type === 'ship' ? naveCausa() : (en.alien || 'un enemigo')); return;
      }
    }
    for (let j = state.bossShots.length - 1; j >= 0; j--) {
      if (hit(sh, state.bossShots[j])) { const sj = state.bossShots[j]; state.bossShots.splice(j, 1); boom(sh.x + sh.w / 2, sh.y, '#7cff6b'); hitShip('el ataque de ' + (sj.from || (state.boss ? state.boss.name : 'el guardián'))); return; }
    }
    const gy = state.groundY < H ? state.groundY : H;
    state.enemies = state.enemies.filter(e => e.y < gy + 10);
    state.powerups = state.powerups.filter(pu => pu.y < H + 30);
    state.particles.forEach(pt => { pt.x += pt.vx * k; pt.y += pt.vy * k; if (!pt.ring) pt.vy += 0.05 * k; pt.life -= (pt.ring ? 0.045 : 0.03) * k; });
    state.particles = state.particles.filter(pt => pt.life > 0);

    if (state.boss) updateBoss(dt);
  }

  function loseLife(causa) {
    state.lives--; A.hit(); drawHUD(); shake();
    if (state.lives <= 0) { state.msgKilledBy = state.msgKilledBy || causa; gameOver(); }
  }

  /* -------- PREGUNTA -------- */
  function nextQuestion() {   // mazo barajado: no se repite ninguna hasta agotarlas todas
    if (!state.qDeck.length) {
      state.qDeck = PREGUNTAS.slice();
      for (let i = state.qDeck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = state.qDeck[i]; state.qDeck[i] = state.qDeck[j]; state.qDeck[j] = t; }
      if (state.qDeck.length > 1 && state.qDeck[state.qDeck.length - 1] === state.lastQ) state.qDeck.unshift(state.qDeck.pop());
    }
    state.lastQ = state.qDeck.pop(); return state.lastQ;
  }
  function openQuestion() {
    state.scene = 'question'; state.pending = true;
    const q = nextQuestion(); state.currentQ = q;
    $('q-text').textContent = q.q;
    const cont = $('q-opciones'); cont.innerHTML = ''; const L = ['A', 'B', 'C', 'D'];
    q.o.forEach((opt, idx) => { const b = document.createElement('button'); b.className = 'opcion'; b.innerHTML = '<span class="k">' + L[idx] + '</span>' + opt; b.onclick = () => answer(idx, b); cont.appendChild(b); });
    $('q-feedback').textContent = ''; show('q-screen');
  }
  function answer(idx, btn) {
    if (!state.pending) return; state.pending = false; const q = state.currentQ;
    const ops = [...document.querySelectorAll('#q-opciones .opcion')]; ops.forEach(o => o.style.pointerEvents = 'none');
    const fb = $('q-feedback');
    if (idx === q.c) { btn.classList.add('correcta'); if (state.lives < C.lives.max) { state.lives++; A.life(); } else A.correct(); fb.innerHTML = '✔ ¡Correcto! +1 vida. ' + q.e; }
    else { btn.classList.add('incorrecta'); ops[q.c].classList.add('correcta'); A.wrong(); fb.innerHTML = '✘ No es correcta. ' + q.e; }
    setTimeout(() => { if (state.scene !== 'question') return; state.scene = 'playing'; drawHUD(); show('playing'); }, 2200);
  }

  /* -------- FIN DE MISIÓN / JUEGO -------- */
  function completeLevel() {
    state.scene = 'levelup'; const p = PLANETAS[state.level]; A.stopAmbient();
    const g = state.saga.guia || { nombre: '' }, ultimo = state.level + 1 >= PLANETAS.length;
    $('lu-planeta').textContent = p.nombre + ' explorado · ' + state.score + ' pts';
    $('lu-dato').textContent = '“' + p.dato + '”';
    $('lu-cierre').textContent = '“' + p.cierre + '” — ' + g.nombre;
    $('btn-siguiente').textContent = ultimo ? 'Hacia el examen final ▸' : 'Siguiente destino ▸';
    renderPodio('lu-podio', true); A.levelup(); show('levelup');
  }

  /* -------- TALLER DE MEJORAS (entre niveles) -------- */
  function openShop() { state.scene = 'tienda'; renderShop(); show('tienda'); }
  function costeActual(it) { return it.baseCost + (state.upgrades[it.id] || 0) * it.costStep; }
  function renderShop() {
    $('shop-coins').textContent = state.coins;
    const cont = $('shop-items'); if (!cont) return; cont.innerHTML = '';
    C.shop.forEach(it => {
      const lvl = state.upgrades[it.id] || 0, maxed = lvl >= it.max, cost = costeActual(it);
      const afford = state.coins >= cost && !maxed;
      const card = document.createElement('div'); card.className = 'shop-card' + (maxed ? ' maxed' : '');
      card.innerHTML = '<span class="si">' + it.icon + '</span>'
        + '<span class="sn">' + it.nombre + '</span>'
        + '<span class="sd">' + it.desc + '</span>'
        + '<span class="slv">' + (maxed ? '★ MÁX' : ('Nivel ' + lvl + '/' + it.max)) + '</span>'
        + '<button class="shop-buy' + (afford ? '' : ' off') + '">' + (maxed ? '✓' : (cost + ' 🪙')) + '</button>';
      const btn = card.querySelector('.shop-buy');
      if (afford) btn.onclick = () => { state.coins -= cost; state.upgrades[it.id]++; A.power(); renderShop(); };
      cont.appendChild(card);
    });
  }
  function shopContinuar() { if (state.level + 1 >= PLANETAS.length) startFinalBriefing(); else { state.level++; startBriefing(); } }

  async function gameOver() {
    state.scene = 'gameover'; A.stopAmbient();
    const s = state.saga, donde = state.final ? 'durante el examen final' : 'en ' + PLANETAS[state.level].nombre;
    $('go-msg').textContent = (s.vehiculoFrase || 'Tu vehículo fue destruido') + ' por ' + state.msgKilledBy + ' ' + donde + '.';
    $('go-score').textContent = 'Puntaje final: ' + state.score + ' pts';
    const cp = state.checkpoint;
    $('btn-reintentar').textContent = (C.retry === 'saga' || !cp) ? 'Reintentar saga ▸' : (cp.final ? 'Reintentar examen ▸' : 'Reintentar misión ▸');
    show('gameover');
    await registrarPuntaje();
    setTimeout(() => renderPodio('go-podio', false), C.podium.postDelayMs);
  }
  async function victoria() {
    state.scene = 'victoria'; state.final = false; A.stopAmbient(); await registrarPuntaje();
    const s = state.saga;
    if ($('vic-titulo')) $('vic-titulo').textContent = '¡Examen superado!';
    if ($('vic-sub')) $('vic-sub').textContent = s.titulo;
    if ($('vic-texto')) $('vic-texto').textContent = s.epilogo || ('Cruzaste cada nivel de ' + s.titulo + ' y superaste al guardián final. El conocimiento es, por fin, tuyo.');
    $('vic-score').textContent = 'Puntaje final: ' + state.score + ' pts · ' + PLANETAS.length + ' misiones + examen final';
    show('victoria');
  }
  function filaPlanilla() {
    const p = PLANETAS[Math.min(state.level, PLANETAS.length - 1)];
    return [state.nombre || 'Anónimo', state.curso || '', p.num, p.nombre, state.score, new Date().toISOString().slice(0, 10)].join('\t');
  }
  function copiar(btn) {
    const txt = filaPlanilla();
    const done = () => { const o = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(() => btn.textContent = o, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
    else fallbackCopy(txt, done);
  }
  function fallbackCopy(txt, done) { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t); done(); }

  /* -------- RENDER (orquesta graphics.js) -------- */
  function render() {
    G.clear();
    const p = worldNow(), E = envNow();
    if (state.scene === 'playing' || state.scene === 'question') {
      G.scene(p, state.stars, state.groundY);
      G.powerups(state.powerups);
      G.bullets(state.bullets);
      G.bossShots(state.bossShots);
      if (state.beam > 0) G.beam(state.ship, state.beam / C.special.durationMs, C.special.width);
      G.enemies(state.enemies, { saga: state.saga.id, scene: p.scene, fondo: E.fondo, groundY: state.groundY, H: H, ship: state.ship });
      if (state.boss) G.boss(state.boss, E);
      if (p.duracion && !state.boss && !state.final) G.progress(Math.min(1, state.levelT / p.duracion), Math.max(0, p.duracion - state.levelT), state.phaseLabel, state.bossPending);
      G.blasts(state.blasts);
      G.particles(state.particles);
      if (!(state.invuln > 0 && Math.floor(state.invuln / 80) % 2 === 0))
        G.ship(state.ship, { speed: state.speedBuff > 0, power: state.powerBuff > 0, shield: state.shield > 0 }, state.saga.vehiculo, E);
      if (state.tempActive) { G.thermometer(state.temp); G.heatTint(state.temp); }
      if (state.scene === 'playing') G.charge(state.charge / C.special.max, state.beam > 0, isTouch);
    } else if (state.scene === 'briefing') {
      G.scene(p, state.stars, groundFor(p)); G.dim(0.5);   // el mundo de la misión se asoma tras el papiro
    } else {
      G.clear(); G.starfield(state.stars);
    }
  }

  /* -------- PAUSA Y SONIDO -------- */
  function setPaused(v) {
    if (v && (state.scene !== 'playing' || state.paused)) return;
    if (!v && !state.paused) return;
    state.paused = !!v; $('pausa').classList.toggle('on', state.paused); $('btn-pause').textContent = state.paused ? '▶' : '⏸';
    if (state.paused) { clearPad(); A.stopAmbient(); } else if (state.scene === 'playing') A.ambient(worldNow());
  }
  function toggleMute() {
    const m = A.mute(); $('btn-mute').textContent = m ? '🔇' : '🔊';
    announce(m ? '🔇 Silencio' : '🔊 Sonido', '#5bd6ff');
    if (!m && state.scene === 'playing' && !state.paused) A.ambient(worldNow());
  }

  /* -------- INPUT: teclado -------- */
  function bindKeyboard() {
    window.addEventListener('keydown', e => {
      if (state.scene === 'playing' && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(e.key)) e.preventDefault();
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') { setPaused(!state.paused); return; }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp') keys.fire = true;
      if (e.key === 'm' || e.key === 'M') toggleMute();
      if (e.key === 'b' || e.key === 'B' || e.key === 'ArrowDown') fireSpecial();
    });
    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp') keys.fire = false;
    });
  }

  /* -------- INPUT: táctil (Pointer Events) -------- */
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  let padEls = null;
  const activePtr = new Map();
  function pin(x, y, el) { const r = el.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }
  function zoneAt(x, y) { if (pin(x, y, padEls.special)) return 'special'; if (pin(x, y, padEls.fire)) return 'fire'; if (pin(x, y, padEls.left)) return 'left'; if (pin(x, y, padEls.right)) return 'right'; return null; }
  function applyPad() {
    let L = false, R = false, F = false;
    for (const z of activePtr.values()) { if (z === 'special') { if (!padEls.__sp) { padEls.__sp = true; fireSpecial(); } continue; } if (z === 'left') L = true; else if (z === 'right') R = true; else if (z === 'fire') F = true; }
    keys.left = L; keys.right = R; keys.fire = F;
    if (![...activePtr.values()].includes('special')) padEls.__sp = false;
    padEls.left.classList.toggle('pressed', L); padEls.right.classList.toggle('pressed', R); padEls.fire.classList.toggle('pressed', F);
  }
  function clearPad() {
    activePtr.clear(); keys.left = keys.right = keys.fire = false;
    if (padEls) { padEls.left.classList.remove('pressed'); padEls.right.classList.remove('pressed'); padEls.fire.classList.remove('pressed'); }
  }
  function bindTouch() {
    padEls = { left: $('t-left'), right: $('t-right'), fire: $('t-fire'), special: $('t-special') };
    stageEl.addEventListener('pointerdown', e => { if (state.scene !== 'playing') return; const z = zoneAt(e.clientX, e.clientY); if (z) { e.preventDefault(); activePtr.set(e.pointerId, z); applyPad(); } }, { passive: false });
    stageEl.addEventListener('pointermove', e => { if (!activePtr.has(e.pointerId)) return; e.preventDefault(); activePtr.set(e.pointerId, zoneAt(e.clientX, e.clientY)); applyPad(); }, { passive: false });
    const end = e => { if (activePtr.has(e.pointerId)) { activePtr.delete(e.pointerId); applyPad(); } };
    stageEl.addEventListener('pointerup', end); stageEl.addEventListener('pointercancel', end); stageEl.addEventListener('lostpointercapture', end);
    stageEl.addEventListener('contextmenu', e => { if (state.scene === 'playing') e.preventDefault(); });
    window.addEventListener('blur', clearPad);
  }

  function goMenu() {
    state.level = 0; state.score = 0; state.lives = C.lives.start; state.final = false; state.boss = null; state.bossShots = []; state.enemies = []; state.checkpoint = null;
    state.scene = 'menu'; show('menu');
  }

  /* -------- BOTONES -------- */
  function bindButtons() {
    $('btn-nombre').onclick = () => {
      const n = $('in-nombre').value.trim();
      if (!n) { $('in-nombre').style.borderColor = 'var(--peligro)'; return; }
      state.nombre = n; state.curso = $('in-curso').value.trim();
      showIntro();
    };
    $('in-nombre').addEventListener('keydown', e => { if (e.key === 'Enter') $('btn-nombre').click(); });
    $('btn-intro').onclick = () => { A.unlock(); startBriefing(); };
    $('btn-lanzar').onclick = () => { A.unlock(); if (state.briefFinal) startFinalBoss(); else startLevel(); };
    $('btn-siguiente').onclick = openShop;
    $('btn-tienda').onclick = shopContinuar;
    $('btn-reintentar').onclick = retry;
    $('btn-mute').onclick = () => { A.unlock(); toggleMute(); };
    $('btn-pause').onclick = () => setPaused(!state.paused);
    $('btn-reanudar').onclick = () => setPaused(false);
    $('btn-otravez').onclick = goMenu;
    $('btn-menu-go').onclick = goMenu;
    $('btn-copiar-go').onclick = function () { copiar(this); };
    $('btn-copiar-vic').onclick = function () { copiar(this); };
  }

  /* -------- RESIZE / ARRANQUE -------- */
  function resizeNow() {
    const r = G.resize(); W = r.W; H = r.H;
    if (state.scene === 'playing' || state.scene === 'question') {   // reubica nave y suelo si cambia el tamaño
      state.groundY = groundFor(worldNow());
      state.ship.y = Math.min(H - state.ship.h - 14, state.groundY - state.ship.h - 6);
      state.ship.x = Math.max(6, Math.min(W - state.ship.w - 6, state.ship.x));
    }
  }
  function start() {
    document.body.classList.toggle('sin-podio', !C.podium.enabled);
    cv = $('game'); stageEl = $('stage');
    G.init(cv); resizeNow();
    window.addEventListener('resize', resizeNow);
    document.addEventListener('visibilitychange', () => { if (document.hidden) setPaused(true); });
    initStars(); bindKeyboard(); bindTouch(); bindButtons(); buildMenu();
    state.scene = 'menu'; show('menu');
    requestAnimationFrame(loop);
  }

  return Object.assign({ start }, window.__ODISEA_TEST ? { _t: { state, update, spawnMine, spawnShip, detonate, fireSpecial, trySpawnSpecial, avance, startLevel, spawnBoss, addCharge } } : {});
})();

document.addEventListener('DOMContentLoaded', OC.Engine.start);
