
from django.urls import path
from . import views

urlpatterns = [
    path('matchmaking/', views.matchmaking, name='matchmaking'),
]
