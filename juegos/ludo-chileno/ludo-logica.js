/* ═══════════════════════════════════════════════════════════════
   Ludo Chileno · lógica del juego (sin dibujo)
   Se usa en el navegador (window.LudoLogica) y en Node (require),
   así se puede probar con miles de partidas simuladas.

   Posición de cada ficha (p), contada desde la salida de su equipo:
     -1      en la base (casa)
     0..50   en la pista común (52 casillas en total)
     51..55  en su pasillo de color
     56      en la meta (centro)
   ═══════════════════════════════════════════════════════════════ */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.LudoLogica = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PISTA = 52, ULTIMA = 50, META = 56, FICHAS = 4;
  const INICIO = [0, 13, 26, 39];                       // casilla de salida de cada equipo
  const SEGURAS = new Set([0, 8, 13, 21, 26, 34, 39, 47]); // salidas + estrellas
  const EQUIPOS = [
    { id: 'condor',    nombre: 'Cóndores azules',   color: '#1f5fbf' },
    { id: 'araucaria', nombre: 'Araucarias verdes', color: '#2e8b57' },
    { id: 'montana',   nombre: 'Montañas blancas',  color: '#eef2f7' },
    { id: 'flor',      nombre: 'Flores moradas',    color: '#7b3fa0' }
  ];
  const REGLAS_BASE = {
    salida: '6',          // '6' = solo con 6 · '1y6' = con 1 o con 6
    tresSeis: true,       // tres 6 seguidos: pierdes el turno
    barreras: false,      // dos fichas propias juntas bloquean el paso
    capturaExtra: true,   // capturar da otro lanzamiento
    metaExtra: true,      // llegar a la meta da otro lanzamiento
    terminarPrimero: true, // la partida termina cuando gana el primero
    fichas: 4             // fichas por equipo (2 = partida rápida)
  };

  const casillaPista = (eq, p) => (INICIO[eq] + p) % PISTA;
  const esSegura = idx => SEGURAS.has(idx);

  function crearEstado(equiposActivos, reglas) {
    const r = Object.assign({}, REGLAS_BASE, reglas || {});
    const eqs = equiposActivos.slice().sort((a, b) => a - b);
    if (eqs.length < 2 || eqs.length > 4) throw new Error('Se necesitan entre 2 y 4 equipos');
    const fichas = {};
    const stats = {};
    const n = Math.max(1, Math.min(4, r.fichas | 0 || 4));
    eqs.forEach(e => { fichas[e] = new Array(n).fill(-1); stats[e] = { capturas: 0, capturado: 0, seises: 0, turnos: 0, metas: 0 }; });
    return { reglas: r, equipos: eqs, fichas, stats, turno: eqs[0], seisSeguidos: 0, dado: null,
             ganadores: [], fin: false, turnosTotales: 0 };
  }

  // Fichas de todos los equipos en una casilla de la pista
  function ocupantes(est, idx) {
    const l = [];
    est.equipos.forEach(e => est.fichas[e].forEach((p, f) => {
      if (p >= 0 && p <= ULTIMA && casillaPista(e, p) === idx) l.push({ eq: e, f });
    }));
    return l;
  }
  // ¿Hay una barrera de otro equipo en esa casilla?
  function barreraRival(est, eq, idx) {
    if (!est.reglas.barreras) return false;
    const cuenta = {};
    ocupantes(est, idx).forEach(o => { if (o.eq !== eq) cuenta[o.eq] = (cuenta[o.eq] || 0) + 1; });
    return Object.values(cuenta).some(n => n >= 2);
  }
  const puedeSalir = (dado, r) => dado === 6 || (r.salida === '1y6' && dado === 1);

  // Movimientos legales del equipo con un valor de dado
  function movimientos(est, eq, dado) {
    const r = est.reglas, res = [];
    est.fichas[eq].forEach((p, f) => {
      if (p === META) return;
      let desde = p, hasta;
      if (p === -1) {
        if (!puedeSalir(dado, r)) return;
        hasta = 0;
        if (barreraRival(est, eq, INICIO[eq])) return;
      } else {
        hasta = p + dado;
        if (hasta > META) return;                       // a la meta se llega con el número exacto
        for (let s = 1; s <= dado; s++) {               // ¿hay barreras en el camino?
          const q = p + s; if (q > ULTIMA) break;
          if (barreraRival(est, eq, casillaPista(eq, q))) return;
        }
      }
      const captura = [];
      if (hasta <= ULTIMA) {
        const idx = casillaPista(eq, hasta);
        if (!esSegura(idx)) ocupantes(est, idx).forEach(o => { if (o.eq !== eq) captura.push(o); });
      }
      res.push({ eq, f, desde, hasta, captura, sale: p === -1, meta: hasta === META,
                 entraPasillo: desde <= ULTIMA && hasta > ULTIMA });
    });
    // dos fichas en la base dan el mismo movimiento: dejar solo una opción de "salir"
    const vistos = new Set();
    return res.filter(m => { const k = m.desde === -1 ? 'base' : 'f' + m.f; if (k === 'base' && vistos.has(k)) return false; vistos.add(k); return true; });
  }

  // Lanzar el dado: devuelve qué pasa con ese número
  function lanzar(est, dado) {
    if (est.fin) throw new Error('La partida terminó');
    const eq = est.turno;
    est.dado = dado;
    est.stats[eq].turnos++; est.turnosTotales++;
    if (dado === 6) { est.seisSeguidos++; est.stats[eq].seises++; }
    if (dado === 6 && est.reglas.tresSeis && est.seisSeguidos >= 3) {
      pasarTurno(est);
      return { tipo: 'tresSeis', movs: [] };
    }
    const movs = movimientos(est, eq, dado);
    if (!movs.length) {
      if (dado === 6) return { tipo: 'sinMovimientoRepite', movs };   // con 6 vuelves a lanzar
      pasarTurno(est);
      return { tipo: 'sinMovimiento', movs };
    }
    return { tipo: 'elegir', movs };
  }

  // Ejecutar un movimiento. capturar=false: se mueve pero no captura (p.ej. pregunta PAES fallada)
  function jugar(est, mov, capturar) {
    if (capturar === undefined) capturar = true;
    const eq = mov.eq, r = est.reglas;
    est.fichas[eq][mov.f] = mov.hasta;
    const capturadas = [];
    if (capturar && mov.captura.length) {
      mov.captura.forEach(o => {
        if (est.fichas[o.eq][o.f] >= 0 && est.fichas[o.eq][o.f] <= ULTIMA) {
          est.fichas[o.eq][o.f] = -1; est.stats[o.eq].capturado++; est.stats[eq].capturas++; capturadas.push(o);
        }
      });
    }
    if (mov.meta) est.stats[eq].metas++;
    let gano = false;
    if (est.fichas[eq].every(p => p === META) && est.ganadores.indexOf(eq) < 0) {
      est.ganadores.push(eq); gano = true;
      const quedan = est.equipos.filter(e => est.ganadores.indexOf(e) < 0);
      if (r.terminarPrimero || quedan.length <= 1) {
        if (!r.terminarPrimero && quedan.length === 1) est.ganadores.push(quedan[0]);
        est.fin = true;
        return { capturadas, extra: false, gano, fin: true };
      }
    }
    const extra = !gano && (est.dado === 6 || (capturadas.length && r.capturaExtra) || (mov.meta && r.metaExtra));
    if (extra) { if (est.dado !== 6) est.seisSeguidos = 0; }
    else pasarTurno(est);
    return { capturadas, extra, gano, fin: false };
  }

  function pasarTurno(est) {
    est.seisSeguidos = 0;
    const activos = est.equipos.filter(e => est.ganadores.indexOf(e) < 0);
    if (!activos.length) return;
    let i = est.equipos.indexOf(est.turno);
    for (let k = 0; k < est.equipos.length; k++) {
      i = (i + 1) % est.equipos.length;
      if (est.ganadores.indexOf(est.equipos[i]) < 0) { est.turno = est.equipos[i]; return; }
    }
  }

  // ¿Puede un rival alcanzar esa casilla de la pista con un solo dado?
  function peligro(est, eq, idx) {
    if (esSegura(idx)) return 0;
    let n = 0;
    est.equipos.forEach(e => {
      if (e === eq) return;
      est.fichas[e].forEach(p => {
        if (p < 0 || p > ULTIMA) return;
        const d = (idx - casillaPista(e, p) + PISTA) % PISTA;
        if (d >= 1 && d <= 6 && p + d <= ULTIMA) n++;
      });
    });
    return n;
  }

  // Computador: 'facil' elige al azar; 'normal' evalúa cada jugada
  function elegirIA(est, movs, nivel, azar) {
    azar = azar || Math.random;
    if (nivel === 'facil') return movs[Math.floor(azar() * movs.length)];
    let mejor = null, mejorPuntos = -Infinity;
    movs.forEach(m => {
      let s = 0;
      if (m.meta) s += 1000;
      if (m.captura.length) s += 600 + m.captura.reduce((a, o) => a + Math.max(0, est.fichas[o.eq][o.f]) * 6, 0);
      if (m.sale) s += 350;
      if (m.entraPasillo) s += 260;
      if (m.hasta <= ULTIMA) {
        const idx = casillaPista(m.eq, m.hasta);
        if (esSegura(idx)) s += 180;
        s -= peligro(est, m.eq, idx) * 260;
      }
      if (m.desde >= 0 && m.desde <= ULTIMA) {
        const riesgoAntes = peligro(est, m.eq, casillaPista(m.eq, m.desde));
        if (riesgoAntes) s += 150 * riesgoAntes + m.desde * 2;   // escapar de un peligro vale más si la ficha va lejos
      }
      s += (m.hasta - Math.max(0, m.desde)) * 3 + m.hasta * .6 + azar() * 25;
      if (s > mejorPuntos) { mejorPuntos = s; mejor = m; }
    });
    return mejor;
  }

  return { PISTA, ULTIMA, META, FICHAS, INICIO, SEGURAS, EQUIPOS, REGLAS_BASE,
           casillaPista, esSegura, crearEstado, ocupantes, movimientos, lanzar, jugar, pasarTurno, peligro, elegirIA };
});
