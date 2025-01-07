from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/server-endpoint-socket/', consumers.ApiConsumer.as_asgi()),
    re_path(r'ws/ping-pong/room/(?P<room_name>\w+)', consumers.GameRoomConsumer.as_asgi()) #test regex
]