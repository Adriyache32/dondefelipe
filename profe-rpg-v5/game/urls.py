from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/register/', views.register, name='api-register'),
    path('api/me/', views.me, name='api-me'),
    path('api/save/', views.save, name='api-save'),
    path('api/load/', views.load, name='api-load'),
    path('api/leaderboard/', views.leaderboard, name='api-leaderboard'),
]
