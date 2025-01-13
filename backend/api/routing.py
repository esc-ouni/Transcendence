from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/server-endpoint-socket/', consumers.ApiConsumer.as_asgi()),
    re_path(r'ws/ping-pong/room/(?P<room_name>\w+)', consumers.GameRoomConsumer.as_asgi()), #test regex
    
    re_path(r'ws/server-endpoint-socket-chess/', consumers.ApiChessConsumer.as_asgi()),
    re_path(r'ws/chess/room/(?P<room_name>\w+)', consumers.GameChessRoomConsumer.as_asgi()) #test regex
]