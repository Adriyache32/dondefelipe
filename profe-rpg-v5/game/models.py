from django.db import models


class Player(models.Model):
    key = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.key})'


class GameSave(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='save')
    data = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Save de {self.player.name} — {self.updated_at:%Y-%m-%d %H:%M}'


class LeaderboardEntry(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='score')
    level = models.IntegerField(default=1)
    coins = models.IntegerField(default=0)
    xp = models.IntegerField(default=0)
    current_map = models.CharField(max_length=50, default='pasillo')
    last_seen = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-level', '-coins', '-xp']

    def __str__(self):
        return f'{self.player.name} — Lv{self.level}'
