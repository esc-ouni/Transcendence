from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path('/ws/game/room1/', consumers.GameConsumer.as_asgi()),
]

