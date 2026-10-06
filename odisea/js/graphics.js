/* ============================================================
   ODISEA CÓSMICA · graphics.js
   GRÁFICOS — texturas, polígonos y sprites. Sin lógica de juego.
   El motor (engine.js) decide QUÉ y CUÁNDO; aquí está el CÓMO.
   ============================================================ */
window.OC = window.OC || {};
OC.Graphics = (function () {
  let canvas = null, cx = null, W = 0, H = 0, DPR = 1;

  function lighten(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  /* --- base --- */
  function init(cv) { canvas = cv; cx = cv.getContext('2d'); OC.Sprites.init(cx); }
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height; DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * DPR); canvas.height = Math.floor(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { W, H };
  }
  function clear() { cx.clearRect(0, 0, W, H); cx.fillStyle = '#05060e'; cx.fillRect(0, 0, W, H); }

  function starfield(stars) {
    cx.fillStyle = '#cddaff';
    stars.forEach(s => { cx.globalAlpha = 0.4 + s.s * 0.35; cx.fillRect(s.x * W, s.y * H, s.s, s.s); });
    cx.globalAlpha = 1;
  }

  /* --- escenarios --- */
  function surface(gy, c1, c2, c3) {
    cx.fillStyle = c1; cx.fillRect(0, gy, W, H - gy);
    cx.fillStyle = c2;
    cx.beginPath(); cx.moveTo(0, gy);
    for (let x = 0; x <= W; x += W / 10) cx.lineTo(x, gy - 6 + Math.sin(x * 0.05) * 5);
    cx.lineTo(W, gy + 14); cx.lineTo(0, gy + 14); cx.closePath(); cx.fill();
    cx.fillStyle = c3;
    for (let i = 0; i < 6; i++) { cx.beginPath(); cx.ellipse((i + 0.5) * W / 6, gy + 18 + ((i * 13) % 20), 10, 4, 0, 0, 6.28); cx.fill(); }
  }

  function scene(world, stars, groundY) {
    if (world.scene === 'mercurio') {
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#1a1712'); g.addColorStop(0.6, '#0d0b09'); g.addColorStop(1, '#070605');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      const sx = W * 0.82, sy = H * 0.12, sr = Math.min(W, H) * 0.09;
      const sg = cx.createRadialGradient(sx, sy, 2, sx, sy, sr * 2.4);
      sg.addColorStop(0, '#fff7e0'); sg.addColorStop(0.4, '#ffd27a'); sg.addColorStop(1, 'rgba(255,180,80,0)');
      cx.fillStyle = sg; cx.beginPath(); cx.arc(sx, sy, sr * 2.4, 0, 6.28); cx.fill();
      cx.fillStyle = '#fff3d0'; cx.beginPath(); cx.arc(sx, sy, sr, 0, 6.28); cx.fill();
      cx.fillStyle = '#cbb';
      stars.forEach(s => { if (s.y < 0.7) { cx.globalAlpha = 0.25 + s.s * 0.2; cx.fillRect(s.x * W, s.y * H, s.s, s.s); } });
      cx.globalAlpha = 1;
      surface(groundY, '#8a8375', '#6b6558', '#4a4640');
    } else if (world.scene === 'venus') {
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#e8a24a'); g.addColorStop(0.35, '#c96a2c'); g.addColorStop(0.7, '#7d2f1c'); g.addColorStop(1, '#2a0f0a');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,220,150,0.18)'; cx.beginPath(); cx.arc(W * 0.3, H * 0.16, Math.min(W, H) * 0.16, 0, 6.28); cx.fill();
      cx.fillStyle = 'rgba(60,20,15,0.6)';
      for (const vx of [W * 0.18, W * 0.55, W * 0.8]) { cx.beginPath(); cx.moveTo(vx - 40, groundY); cx.lineTo(vx, groundY - 46); cx.lineTo(vx + 40, groundY); cx.closePath(); cx.fill(); }
      surface(groundY, '#4a221a', '#331410', '#1c0a08');
      cx.strokeStyle = '#ff7b2e'; cx.lineWidth = 2; cx.globalAlpha = 0.85;
      for (let i = 0; i < 5; i++) { const bx = (i + 1) * W / 6; cx.beginPath(); cx.moveTo(bx, groundY + 6); cx.lineTo(bx + 8, H - 24); cx.lineTo(bx - 6, H - 10); cx.stroke(); }
      cx.globalAlpha = 1;
      cx.fillStyle = 'rgba(255,150,60,0.06)'; cx.fillRect(0, 0, W, H);
    } else if (world.scene === 'litosfera' || world.scene === 'astenosfera' || world.scene === 'manto' || world.scene === 'nucleo_ext' || world.scene === 'nucleo_int') {
      subsuelo(world, groundY);
    } else if (world.scene === 'galaxia') {
      nebula(world, stars);
    } else if (world.scene === 'organismo') {
      organico(world, stars);
    } else if (world.scene === 'ecosistema') {
      natura(world, groundY);
    } else {
      cx.fillStyle = '#05060e'; cx.fillRect(0, 0, W, H);
      starfield(stars);
      const pr = Math.min(W, H) * 0.16, px = W * 0.5, py = H * 0.16;
      const g = cx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.1, px, py, pr);
      g.addColorStop(0, lighten(world.color, 40)); g.addColorStop(1, world.color);
      cx.fillStyle = g; cx.beginPath(); cx.arc(px, py, pr, 0, 6.28); cx.fill();
      if (world.nombre === 'Saturno') {
        cx.strokeStyle = 'rgba(232,213,154,.7)'; cx.lineWidth = 3;
        cx.save(); cx.translate(px, py); cx.scale(1, 0.32); cx.beginPath(); cx.arc(0, 0, pr * 1.5, 0, 6.28); cx.stroke(); cx.restore();
      }
    }
  }

  // Subsuelo (Centro de la Tierra): estratos de roca + magma en profundidad
  function subsuelo(world, gy) {
    const magma = world.scene === 'manto' || world.scene === 'astenosfera' || world.scene === 'nucleo_ext' || world.scene === 'nucleo_int';
    const g = cx.createLinearGradient(0, 0, 0, H);
    if (world.scene === 'nucleo_int') { g.addColorStop(0, '#7a2010'); g.addColorStop(0.5, '#e04a1a'); g.addColorStop(1, '#fff0c0'); }
    else if (world.scene === 'nucleo_ext') { g.addColorStop(0, '#6a1810'); g.addColorStop(0.5, '#b83010'); g.addColorStop(1, '#ff7a2a'); }
    else if (world.scene === 'manto') { g.addColorStop(0, '#5a1810'); g.addColorStop(0.55, '#8a1c10'); g.addColorStop(1, '#ff5a2a'); }
    else if (world.scene === 'astenosfera') { g.addColorStop(0, '#3a1c12'); g.addColorStop(0.6, '#7a331a'); g.addColorStop(1, '#d9702e'); }
    else { g.addColorStop(0, '#2a2018'); g.addColorStop(0.7, '#3a2c1e'); g.addColorStop(1, '#4a3826'); }
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    // estratos
    cx.strokeStyle = 'rgba(0,0,0,.18)'; cx.lineWidth = 2;
    for (let i = 1; i < 8; i++) { const yy = H * i / 8; cx.beginPath(); cx.moveTo(0, yy + Math.sin(i) * 6); for (let x = 0; x <= W; x += W / 6) cx.lineTo(x, yy + Math.sin(i + x * 0.02) * 6); cx.stroke(); }
    // vetas de magma
    if (magma) { cx.strokeStyle = 'rgba(255,120,40,.5)'; cx.lineWidth = 2; for (let i = 0; i < 4; i++) { const bx = (i + 1) * W / 5; cx.beginPath(); cx.moveTo(bx, H * 0.4); cx.lineTo(bx + 10, H * 0.7); cx.lineTo(bx - 8, H); cx.stroke(); } }
    if (gy < H) surface(gy, '#5a4632', '#463322', '#2c2016');
  }
  // Galaxia (Viaje Galáctico): espacio profundo + nebulosa tintada
  function nebula(world, stars) {
    cx.fillStyle = '#04040c'; cx.fillRect(0, 0, W, H);
    const nx = W * 0.5, ny = H * 0.35, nr = Math.min(W, H) * 0.5;
    const g = cx.createRadialGradient(nx, ny, 10, nx, ny, nr);
    g.addColorStop(0, world.color); g.addColorStop(0.4, 'rgba(120,90,200,.25)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    cx.globalAlpha = 0.5; cx.fillStyle = g; cx.beginPath(); cx.arc(nx, ny, nr, 0, 6.28); cx.fill(); cx.globalAlpha = 1;
    starfield(stars);
    if (world.scene === 'galaxia' && world.nombre.indexOf('Agujero') === 0) {
      const px = W * 0.5, py = H * 0.16, pr = Math.min(W, H) * 0.11;
      cx.fillStyle = '#000'; cx.beginPath(); cx.arc(px, py, pr, 0, 6.28); cx.fill();
      cx.strokeStyle = 'rgba(255,180,80,.7)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(px, py, pr * 1.25, 0, 6.28); cx.stroke();
    }
  }
  // Organismo (Cuerpo Humano): interior orgánico con "células" flotando
  function organico(world, stars) {
    const g = cx.createLinearGradient(0, 0, 0, H);
    const base = world.color;
    g.addColorStop(0, lighten(base, -60)); g.addColorStop(0.5, lighten(base, -30)); g.addColorStop(1, lighten(base, -80));
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    // paredes/vasos
    cx.strokeStyle = 'rgba(255,255,255,.06)'; cx.lineWidth = 10;
    cx.beginPath(); cx.moveTo(-10, H * 0.2); cx.quadraticCurveTo(W * 0.5, H * 0.35, W + 10, H * 0.15); cx.stroke();
    cx.beginPath(); cx.moveTo(-10, H * 0.8); cx.quadraticCurveTo(W * 0.5, H * 0.65, W + 10, H * 0.85); cx.stroke();
    // células flotando (reutiliza las "estrellas" como partículas)
    stars.forEach(s => { cx.globalAlpha = 0.10 + s.s * 0.06; cx.fillStyle = '#ffd6de'; cx.beginPath(); cx.arc(s.x * W, s.y * H, s.s * 3, 0, 6.28); cx.fill(); });
    cx.globalAlpha = 1;
  }
  // Ecosistema (Ecosistemas): cielo + suelo natural según el mundo
  function natura(world, gy) {
    let cielo1 = '#bfe6ff', cielo2 = '#7fbfe0', suelo = world.color;
    const n = world.nombre;
    if (n.indexOf('Desierto') === 0) { cielo1 = '#ffe0a0'; cielo2 = '#e0a860'; }
    else if (n.indexOf('Humedal') === 0) { cielo1 = '#cfe8f0'; cielo2 = '#9fc8d8'; }
    else if (n.indexOf('Océano') === 0) { cielo1 = '#a8d4ec'; cielo2 = '#5f97c0'; }
    else if (n.indexOf('Altiplano') === 0) { cielo1 = '#8fc4ff'; cielo2 = '#5a86c8'; }
    const g = cx.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, cielo1); g.addColorStop(1, cielo2);
    cx.fillStyle = g; cx.fillRect(0, 0, W, gy);
    // sol
    cx.fillStyle = 'rgba(255,245,200,.7)'; cx.beginPath(); cx.arc(W * 0.78, H * 0.14, Math.min(W, H) * 0.06, 0, 6.28); cx.fill();
    // colinas/relieve de fondo
    cx.fillStyle = lighten(suelo, -20); cx.beginPath(); cx.moveTo(0, gy);
    for (let x = 0; x <= W; x += W / 8) cx.lineTo(x, gy - 30 - Math.sin(x * 0.03) * 18);
    cx.lineTo(W, gy); cx.closePath(); cx.fill();
    // suelo
    surface(gy, suelo, lighten(suelo, -18), lighten(suelo, -34));
  }

  /* --- entidades: el dibujo vive en sprites.js --- */
  function bullets(list)            { OC.Sprites.bullets(list); }
  function bossShots(list)          { OC.Sprites.bossShots(list); }
  function particles(list)          { OC.Sprites.particles(list); }
  function powerups(list)           { OC.Sprites.powerups(list); }
  function enemies(list, theme)     { OC.Sprites.enemies(list, theme); }
  function boss(b)                  { OC.Sprites.boss(b, W, H); }
  function ship(s, buffs, vehiculo) { OC.Sprites.ship(s, buffs, vehiculo); }

  /* --- termómetro y tinte de calor --- */
  function thermometer(temp) {
    const bw = 13, bh = H * 0.34, bx = W - 24, by = H * 0.16, t = Math.min(1, temp / 100);
    const col = t > 0.8 ? '#ff3b3b' : t > 0.55 ? '#ff9a3b' : '#5bd6ff';
    cx.fillStyle = 'rgba(0,0,0,.5)'; cx.fillRect(bx - 4, by - 16, bw + 8, bh + 30);
    cx.fillStyle = '#20242e'; cx.fillRect(bx, by, bw, bh);
    cx.fillStyle = col; cx.fillRect(bx, by + bh * (1 - t), bw, bh * t);
    cx.beginPath(); cx.arc(bx + bw / 2, by + bh + 8, 9, 0, 6.28); cx.fillStyle = col; cx.fill();
    cx.fillStyle = '#dfe6ff'; cx.font = 'bold 10px Courier New'; cx.textAlign = 'center';
    cx.fillText('🌡', bx + bw / 2, by - 6);
    cx.fillText(Math.floor(temp) + '°', bx + bw / 2, by + bh + 26);
  }
  function heatTint(temp) {
    if (temp > 78) { cx.fillStyle = 'rgba(255,40,20,' + Math.min(0.28, (temp - 78) / 22 * 0.28) + ')'; cx.fillRect(0, 0, W, H); }
  }

  return { init, resize, clear, starfield, scene, bullets, bossShots, particles, powerups, enemies, boss, ship, thermometer, heatTint, lighten,
           get W() { return W; }, get H() { return H; } };
})();
