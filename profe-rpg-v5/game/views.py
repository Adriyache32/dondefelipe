import json
import uuid
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import Player, GameSave, LeaderboardEntry

MAP_LABELS = {
    'pasillo': 'Pasillo', 'patio': 'Patio', 'jardin_eden': 'Jardín Edén',
    'segundo_piso': '2do Piso', 'sala_5to': 'Sala 5to', 'sala_6to': 'Sala 6to',
    'sala_7mo': 'Sala 7mo', 'sala_8vo': 'Sala 8vo', 'biblioteca': 'Biblioteca',
    'cancha': 'Cancha', 'villa_alemana': 'Villa Alemana', 'centro_villa': 'Centro Villa',
    'buin_zoo': 'Buin Zoo', 'reserva': 'Reserva', 'lago': 'Lago',
}


def _get_session_player(request):
    key = request.session.get('player_key')
    name = request.session.get('player_name')
    return key, name


@ensure_csrf_cookie
def index(request):
    key, name = _get_session_player(request)
    return render(request, 'game/index.html', {
        'player_name': name or '',
        'player_key': key or '',
    })


@require_POST
def register(request):
    data = json.loads(request.body)
    name = data.get('name', '').strip()

    if len(name) < 2:
        return JsonResponse({'error': '⚠ Mínimo 2 caracteres'}, status=400)
    if len(name) > 20:
        return JsonResponse({'error': '⚠ Máximo 20 caracteres'}, status=400)

    if not request.session.get('player_key'):
        sanitized = ''.join(c if c.isalnum() else '_' for c in name.lower())[:14]
        request.session['player_key'] = f"{sanitized}_{uuid.uuid4().hex[:4]}"

    key = request.session['player_key']
    request.session['player_name'] = name

    player, _ = Player.objects.get_or_create(key=key, defaults={'name': name})
    if player.name != name:
        player.name = name
        player.save()

    return JsonResponse({'name': name, 'key': key})


def me(request):
    key, name = _get_session_player(request)
    if key and name:
        return JsonResponse({'name': name, 'key': key})
    return JsonResponse({'error': 'Sin sesión'}, status=401)


@require_POST
def save(request):
    key, _ = _get_session_player(request)
    if not key:
        return JsonResponse({'error': 'No registrado'}, status=401)

    data = json.loads(request.body)
    state = data.get('state')
    if not state:
        return JsonResponse({'error': 'Sin datos'}, status=400)

    player = Player.objects.filter(key=key).first()
    if not player:
        return JsonResponse({'error': 'Jugador no encontrado'}, status=404)

    GameSave.objects.update_or_create(player=player, defaults={'data': state})

    LeaderboardEntry.objects.update_or_create(
        player=player,
        defaults={
            'level': data.get('level', 1),
            'coins': data.get('coins', 0),
            'xp': data.get('xp', 0),
            'current_map': data.get('map', 'pasillo'),
        }
    )

    return JsonResponse({'ok': True})


def load(request):
    key, _ = _get_session_player(request)
    if not key:
        return JsonResponse({'error': 'No registrado'}, status=401)

    player = Player.objects.filter(key=key).first()
    if not player:
        return JsonResponse({'error': 'Jugador no encontrado'}, status=404)

    game_save = GameSave.objects.filter(player=player).first()
    if not game_save:
        return JsonResponse({'error': 'Sin partida guardada'}, status=404)

    return JsonResponse({
        'state': game_save.data,
        'updated_at': game_save.updated_at.isoformat(),
    })


def leaderboard(request):
    key, _ = _get_session_player(request)
    entries = (
        LeaderboardEntry.objects
        .select_related('player')
        .order_by('-level', '-coins', '-xp')[:20]
    )

    import time
    rows = [
        {
            'key': e.player.key,
            'name': e.player.name,
            'level': e.level,
            'coins': e.coins,
            'xp': e.xp,
            'currentMap': e.current_map,
            'mapLabel': MAP_LABELS.get(e.current_map, e.current_map),
            'lastSeen': int(e.last_seen.timestamp() * 1000),
            'isMe': e.player.key == key,
        }
        for e in entries
    ]

    return JsonResponse(rows, safe=False)
