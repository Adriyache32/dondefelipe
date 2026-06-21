from django.contrib import admin
from .models import Player, GameSave, LeaderboardEntry


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'key', 'created_at')
    search_fields = ('name', 'key')


@admin.register(GameSave)
class GameSaveAdmin(admin.ModelAdmin):
    list_display = ('player', 'updated_at')
    readonly_fields = ('updated_at',)


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ('player', 'level', 'coins', 'xp', 'current_map', 'last_seen')
    ordering = ('-level', '-coins', '-xp')
