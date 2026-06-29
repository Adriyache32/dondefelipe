#!/usr/bin/env python3
"""
Convierte profe-rpg-v4.html en una plantilla Django para profe-rpg-v5.

Uso (desde la carpeta profe-rpg-v5/):
    python convert.py

El script lee ../profe-rpg-v4.html y escribe game/templates/game/index.html
reemplazando Firebase/localStorage/IndexedDB con llamadas a la API Django.
"""
import os
import re

SRC = os.path.join(os.path.dirname(__file__), '..', 'profe-rpg-v4.html')
DST = os.path.join(os.path.dirname(__file__), 'game', 'templates', 'game', 'index.html')

# ─────────────────────────────────────────────
# Bloques de código nuevo que reemplazan secciones del HTML original
# ─────────────────────────────────────────────

DJANGO_HEAD_INJECT = '''\
<meta name="csrf-token" content="{{ csrf_token }}">
<script>
window._DJANGO = {
  playerName: '{{ player_name|escapejs }}',
  playerKey:  '{{ player_key|escapejs }}'
};
</script>'''

# Reemplaza toda la sección Firebase (config + _fbInit + _fbSave)
NEW_FIREBASE_BLOCK = '''\
// ═══ DJANGO API ═══
const _csrf = () => document.cookie.split(';')
  .map(c => c.trim()).find(c => c.startsWith('csrftoken='))?.split('=')[1] || '';

let _playerKey  = window._DJANGO?.playerKey  || '';
let _playerName = window._DJANGO?.playerName || '';

function _apiPost(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': _csrf() },
    body: JSON.stringify(body)
  });
}'''

NEW_REGISTER = '''\
// ── Registro de jugador ──
function registerPlayer(){
  const input = _('reg-name-input'), errEl = _('reg-error');
  const name = input.value.trim();
  if(name.length < 2){ errEl.textContent = '⚠ Mínimo 2 caracteres'; return; }
  if(name.length > 20){ errEl.textContent = '⚠ Máximo 20 caracteres'; return; }
  errEl.textContent = 'Registrando...';
  _apiPost('/api/register/', { name })
    .then(r => r.json())
    .then(d => {
      if(d.error){ errEl.textContent = d.error; return; }
      _playerName = d.name;
      _playerKey  = d.key;
      _('register-screen').style.display = 'none';
      _startGameLoop();
    })
    .catch(() => { errEl.textContent = '❌ Error de conexión'; });
}'''

NEW_SAVE_SYSTEM = '''\
// ═══ SISTEMA DE GUARDADO (Django API) ═══
const SAVE_KEY = 'profeRpgSave_v4';   // solo para export/import local

function _rehydrateItem(item){
  if(!item) return item;
  if(item.id === 'caramelo' || item.type === 'food')
    item.use = () => { stats.hunger = Math.min(stats.maxHunger, (stats.hunger||100)+50); syncUI(); showDialog('🍬 +50 🍽️ ¡Dulce energía!'); };
  if(item.id === 'linterna')
    item.use = () => showDialog('🔦 Linterna activa.\\nIlumina automáticamente la noche.');
  return item;
}

function saveGameSilent(){
  if(!_playerKey) return false;
  const partyData = PARTY_MEMBERS.map(m => ({ id:m.id, hp:m.hp, found:m.found, inTeam:m.inTeam }));
  const invData   = inventory.map(({ use, ...rest }) => rest);
  const state     = { player, stats, coins, progress, currentMap, equipment, party:partyData, inventory:invData };
  // Respaldo local (por si no hay conexión)
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch(e) {}
  // Guardado en servidor Django
  _apiPost('/api/save/', { state, level:stats.level, coins, xp:stats.xp, map:currentMap })
    .catch(e => console.warn('API save error:', e));
  return true;
}

function saveGame(){
  if(!_playerKey){ showDialog('⚠️ Regístrate primero para guardar.'); return; }
  const ok = saveGameSilent();
  showDialog(ok ? '💾 Partida guardada.' : '❌ Error al guardar.');
}

function _applyGameState(data){
  player = data.player; player.px = player.x*40; player.py = player.y*40;
  stats = data.stats; coins = data.coins; progress = data.progress || {};
  currentMap = data.currentMap;
  equipment = data.equipment || { armor:null, weapon:null, accessory:null };
  if(data.party){ data.party.forEach(sv => { const m = PARTY_MEMBERS.find(p => p.id === sv.id); if(m){ m.hp=sv.hp; m.found=sv.found; m.inTeam=sv.inTeam; } }); }
  inventory = (data.inventory || []).map(_rehydrateItem);
  if(!progress.questLog) progress.questLog = {};
  syncUI(); updateCamera();
}

function loadGame(){
  if(!_playerKey){ showDialog('⚠️ No estás registrado.'); return; }
  fetch('/api/load/')
    .then(r => {
      if(r.status === 404){
        // Intenta respaldo local
        try {
          const s = localStorage.getItem(SAVE_KEY);
          if(s){ _applyGameState(JSON.parse(s)); showDialog('📂 Partida cargada (respaldo local).'); return null; }
        } catch(e) {}
        showDialog('⚠️ No hay partida guardada.', [
          { text:'📥 Importar desde archivo', action:() => _('import-file-input').click() },
          { text:'Cerrar', action:null }
        ]);
        return null;
      }
      return r.json();
    })
    .then(d => {
      if(d && d.state){ _applyGameState(d.state); showDialog('📂 Partida cargada.'); }
    })
    .catch(() => showDialog('❌ Error de conexión al cargar.'));
}

function exportSave(){
  let data = null;
  try { data = localStorage.getItem(SAVE_KEY); } catch(e) {}
  if(!data){ showDialog('⚠️ Guarda la partida primero antes de exportar.'); return; }
  try {
    const blob = new Blob([data], { type:'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'profeRpg_save.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showDialog('📤 Partida exportada como archivo JSON.');
  } catch(e){ showDialog('❌ Error al exportar.'); }
}

function _onImportFile(el){
  const file = el.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      _applyGameState(data);
      saveGameSilent();
      showDialog('📥 Partida importada con éxito.');
    } catch(err){ showDialog('❌ Archivo inválido o corrupto.'); }
  };
  reader.readAsText(file);
  el.value = '';
}'''

NEW_LEADERBOARD_BLOCK = '''\
// ── Leaderboard (Django API) ──
const _MAP_SHORT = {
  pasillo:'Pasillo', patio:'Patio', jardin_eden:'Jardín Edén', segundo_piso:'2do Piso',
  sala_5to:'Sala 5to', sala_6to:'Sala 6to', sala_7mo:'Sala 7mo', sala_8vo:'Sala 8vo',
  biblioteca:'Biblioteca', cancha:'Cancha', villa_alemana:'Villa Alemana',
  centro_villa:'Centro Villa', buin_zoo:'Buin Zoo', reserva:'Reserva', lago:'Lago'
};

function _renderLBRows(rows, list){
  const medals = ['🥇','🥈','🥉'];
  _('lb-count').textContent = rows.length + ' jugadores';
  if(!rows.length){
    list.innerHTML = '<div style="text-align:center;color:#6b7280;padding:16px;font-family:\\'VT323\\',monospace">Sin jugadores aún</div>';
    return;
  }
  list.innerHTML = rows.slice(0,20).map((p, i) => {
    const isMe    = p.isMe || p.key === _playerKey;
    const ago     = p.lastSeen ? Math.round((Date.now() - p.lastSeen) / 60000) : null;
    const agoStr  = ago === null ? '' : ago < 1 ? '🟢 ahora' : ago < 60 ? ago+'m' : ago < 1440 ? Math.floor(ago/60)+'h' : Math.floor(ago/1440)+'d';
    const rank    = i < 3 ? medals[i] : `#${i+1}`;
    const mapName = p.mapLabel || _MAP_SHORT[p.currentMap] || p.currentMap || '?';
    return `<div style="display:flex;align-items:center;gap:8px;background:${isMe?'rgba(253,212,66,.1)':'#1e293b'};border:1px solid ${isMe?'#fcd34d':'#374151'};padding:7px 10px;border-radius:7px">
      <div style="font-size:.9rem;min-width:22px;text-align:center">${rank}</div>
      <div style="flex:1;min-width:0">
        <div style="font-family:\\'VT323\\',monospace;font-size:.92rem;color:${isMe?'#fcd34d':'#f1f5f9'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}${isMe?' ◀':''}</div>
        <div style="font-size:.62rem;color:#6b7280">${mapName} · ${p.xp||0} XP</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:\\'Press Start 2P\\',monospace;font-size:.42rem;color:#a78bfa">Lv${p.level}</div>
        <div style="font-size:.68rem;color:#fcd34d">🪙${p.coins||0}</div>
      </div>
      <div style="font-size:.55rem;color:#4b5563;min-width:30px;text-align:right">${agoStr}</div>
    </div>`;
  }).join('');
}

function openLeaderboard(){
  const panel = _('leaderboard-panel'); panel.style.display = 'block'; STATE = 'dialog';
  const list  = _('lb-list');
  list.innerHTML = '<div style="text-align:center;color:#6b7280;padding:16px;font-family:\\'VT323\\',monospace">Cargando...</div>';
  fetch('/api/leaderboard/')
    .then(r => r.json())
    .then(rows => _renderLBRows(rows, list))
    .catch(() => {
      list.innerHTML = '<div style="text-align:center;color:#f87171;padding:16px;font-family:\\'VT323\\',monospace">❌ Error de conexión</div>';
    });
}

function closeLeaderboard(){
  _('leaderboard-panel').style.display = 'none';
  if(STATE === 'dialog') STATE = 'exploring';
}'''

NEW_STARTUP_CHECK = '''\
// Verificar sesión Django
(function(){
  if(window._DJANGO && _playerName && _playerKey){
    _('register-screen').style.display = 'none';
    _startGameLoop();
  }
  // Sin sesión → la pantalla de registro permanece visible
})();'''


# ─────────────────────────────────────────────
# Funciones de reemplazo
# ─────────────────────────────────────────────

def replace_between(html, start_marker, end_marker, replacement, label):
    idx_start = html.find(start_marker)
    if idx_start == -1:
        print(f'  ⚠  No encontrado: {label!r} (inicio)')
        return html
    idx_end = html.find(end_marker, idx_start + len(start_marker))
    if idx_end == -1:
        print(f'  ⚠  No encontrado: {label!r} (fin)')
        return html
    print(f'  ✓  {label}')
    return html[:idx_start] + replacement + html[idx_end + len(end_marker):]


def replace_exact(html, old, new, label):
    if old not in html:
        print(f'  ⚠  No encontrado: {label!r}')
        return html
    print(f'  ✓  {label}')
    return html.replace(old, new, 1)


def main():
    print(f'\nLeyendo {SRC} ...')
    if not os.path.exists(SRC):
        print(f'ERROR: No se encontró {SRC}')
        print('Asegúrate de ejecutar este script desde la carpeta profe-rpg-v5/')
        return

    with open(SRC, encoding='utf-8') as f:
        html = f.read()
    print(f'  {len(html):,} bytes leídos\n')

    print('Aplicando transformaciones:')

    # 1. Eliminar Firebase SDK
    html = replace_exact(
        html,
        '<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>',
        '',
        'Eliminar Firebase app SDK'
    )
    html = replace_exact(
        html,
        '<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>',
        '',
        'Eliminar Firebase database SDK'
    )

    # 2. Inyectar CSRF + datos de sesión Django antes de </head>
    html = replace_exact(html, '</head>', DJANGO_HEAD_INJECT + '\n</head>', 'Inyectar CSRF + sesión Django en <head>')

    # 3. Reemplazar bloque Firebase (config + _fbInit + _fbSave)
    html = replace_between(
        html,
        '// ═══ FIREBASE + MULTIJUGADOR ═══',
        '\n// ── Registro de jugador ──',
        NEW_FIREBASE_BLOCK + '\n\n',
        'Bloque Firebase → Django API'
    )

    # 4. Reemplazar registerPlayer (busca hasta _startGameLoop())
    reg_start = '// ── Registro de jugador ──'
    reg_end   = '\n// ── Leaderboard ──'
    # Handles both original and IndexedDB-modified versions
    if reg_end not in html:
        reg_end = '\n// ── IndexedDB'
    html = replace_between(html, reg_start, reg_end, NEW_REGISTER + '\n\n', 'registerPlayer → Django API')

    # 5. Reemplazar bloque Leaderboard (busca versión original o la modificada con IndexedDB)
    lb_start = '// ── Leaderboard ──'
    # End marker: metro or save system, whichever comes first
    for lb_end in ['\n// ═══ METRO MERVAL ═══', '\n// ═══ SISTEMA DE GUARDADO ═══']:
        if lb_end in html[html.find(lb_start):html.find(lb_start)+50000]:
            break
    html = replace_between(html, lb_start, lb_end, NEW_LEADERBOARD_BLOCK + '\n\n', 'Leaderboard → Django API')

    # 6. Reemplazar bloque IndexedDB (si existe, de la versión v4 modificada)
    idb_marker = '// ── IndexedDB (almacenamiento más confiable en Android Chrome) ──'
    if idb_marker in html:
        html = replace_between(
            html,
            idb_marker,
            '\n// ═══ SISTEMA DE GUARDADO ═══',
            '',
            'Eliminar bloque IndexedDB (reemplazado por API)'
        )

    # 7. Reemplazar sistema de guardado
    html = replace_between(
        html,
        '// ═══ SISTEMA DE GUARDADO ═══',
        '\n// Clear initial static text',
        NEW_SAVE_SYSTEM + '\n\n',
        'Sistema de guardado → Django API'
    )

    # 8. Reemplazar verificación de sesión al inicio
    for startup_marker in [
        '// Verificar si el jugador ya está registrado\n(function(){\n  let key=null',
        '// Verificar si el jugador ya está registrado\n(function(){\n  const key=',
    ]:
        if startup_marker in html:
            idx = html.find(startup_marker)
            # Find the closing })(); of the IIFE
            end_idx = html.find('})();', idx)
            if end_idx != -1:
                html = html[:idx] + NEW_STARTUP_CHECK + html[end_idx + len('})();'):]
                print('  ✓  Verificación de sesión → Django template')
            break
    else:
        print('  ⚠  No encontrada verificación de sesión')

    # 9. Agregar botón exportar si no existe
    if 'onclick="exportSave()"' not in html and 'exportSave' not in html:
        html = replace_exact(
            html,
            'onclick="openLeaderboard()"',
            'onclick="exportSave()" title="Exportar partida" style="font-size:.8rem;padding:2px 6px;background:linear-gradient(180deg,#1d4ed8,#1e3a8a);border-color:#2563eb">📤</button>\n    <button class="btn-ui" onclick="openLeaderboard()"',
            'Agregar botón exportar'
        )

    # 10. Agregar input de importar si no existe
    if 'import-file-input' not in html:
        html = replace_exact(
            html,
            '</div>\n\n\n<!-- compatibility stubs',
            '</div>\n<input type="file" id="import-file-input" accept=".json" style="display:none" onchange="_onImportFile(this)">\n\n\n<!-- compatibility stubs',
            'Agregar input importar archivo'
        )

    os.makedirs(os.path.dirname(DST), exist_ok=True)
    with open(DST, 'w', encoding='utf-8') as f:
        f.write(html)

    size = os.path.getsize(DST)
    print(f'\n✅  Plantilla generada: {DST}')
    print(f'   Tamaño: {size:,} bytes\n')
    print('Próximos pasos:')
    print('  1.  pip install django')
    print('  2.  python manage.py migrate')
    print('  3.  python manage.py createsuperuser  (opcional, para /admin)')
    print('  4.  python manage.py runserver')
    print('  5.  Abre http://127.0.0.1:8000\n')


if __name__ == '__main__':
    main()
