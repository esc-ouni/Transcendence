from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
import json

Gconnected_users = []

class ApiConsumer(WebsocketConsumer):
    connected_users = 0
    my_id = 0

    def connect(self):
        self.accept()
        ApiConsumer.connected_users += 1
        self.my_id = ApiConsumer.connected_users

        Gconnected_users.append((self.my_id, self))

        # print("=>", f"Client {self.my_id} Connected !. (Total users {len(Gconnected_users)})")
        # print("=>", Gconnected_users)

        self.send(json.dumps({
            'type': 'connection_established',
            'my_id': self.my_id,
            'message': f'ki rak b9it assadi9, nta hwa {self.my_id} '
        }))

        if (len(Gconnected_users) == 2):
            # notify the two players
            # room_name = str(uuid.uuid4())[:8]  # create a short random room name
            room_name = 'Bit_N3as'

            p1_id, p1_consumer = Gconnected_users[0]
            p2_id, p2_consumer = Gconnected_users[1]

            p1_consumer.send(json.dumps({
                'type': 'match_found',
                'my_id': p1_id,
                'room_name': room_name,
                'opponent_id': p2_id,
            }))

            p2_consumer.send(json.dumps({
                'type': 'match_found',
                'my_id': p2_id,
                'room_name': room_name,
                'opponent_id': p1_id,
            }))

            Gconnected_users.clear()

    def receive(self, text_data):
        data = json.loads(text_data)

        if (data['type'] == "Websocket_message"):
            # print("=>", f"Client {self.my_id}  :", data['message'])

            response = {
                'type': 'server_response',
                'message': f"<Server received ur message : {data['message']}>"
            }
            self.send(json.dumps(response))

    def disconnect(self, close_code):
        # print("=>", f"Client {self.my_id}  DisConnected !")
        # ApiConsumer.connected_users -= 1
        # Gconnected_users.remove(self.my_id)
        for i, (cid, instance) in enumerate(Gconnected_users):
            if cid == self.my_id:
                Gconnected_users.pop(i)
                break


class GameRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        query_string = self.scope["query_string"].decode()  # "user_id=42"
        query_params = dict(qc.split('=') for qc in query_string.split('&'))
        self.user_id = query_params.get('user_id', 'unknown')

        # print("=> This consumer belongs to user_id:", self.user_id)
        # print("  => Url :", self.scope["query_string"].decode(), '\n')

        # if self.scope["user"].is_authenticated:
            # print("=> Authenticated user:", self.scope["user"].username)
        # else:
            # print("=> Anonymous user")

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # print("=>", "Room created :", self.room_name)

        # Create a group name, e.g. "game_room_<room_name>"
        self.room_group_name = f"game_room_{self.room_name}"

        # Join the group (everyone in the same room_name joins this group)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # On disconnect, remove from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive a message from the client
        data = json.loads(text_data)

        # Broadcast it to everyone else in the same group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                # This is the method name that will be called (like a "handler")
                'type': 'broadcast_event',
                'payload': data
            }
        )

    async def broadcast_event(self, event):

        # print(event['payload'].get('my_id'), self.user_id)
        if (str(event['payload'].get('my_id')) == self.user_id):
            return

        # print(type(event['payload'].get('my_id')), type(self.user_id))
        # event['payload'].get('my_id')
        # Forward the broadcasted message to the actual WebSocket
        # so all connected clients in the group see it
        # print("=>", "from the player ", self.user_id, ":")
        # print("=>", "All players gonna recieve : ", event['payload'])
        await self.send(json.dumps(event['payload']))







#FOR CHESS
Chess_Gconnected_users = []

class ApiChessConsumer(WebsocketConsumer):
    connected_users = 0
    my_id = 0

    def connect(self):
        self.accept()
        ApiChessConsumer.connected_users += 1
        self.my_id = ApiChessConsumer.connected_users

        Chess_Gconnected_users.append((self.my_id, self))

        print("=>", f"Client {self.my_id} Connected !. (Total users {len(Chess_Gconnected_users)})")
        # print("=>", Chess_Gconnected_users)

        self.send(json.dumps({
            'type': 'connection_established',
            'my_id': self.my_id,
            'message': f'ki rak b9it assadi9, nta hwa {self.my_id} '
        }))

        if (len(Chess_Gconnected_users) == 2):
            # notify the two players
            # room_name = str(uuid.uuid4())[:8]  # create a short random room name
            print("==> Room Created successfully !")
            room_name = 'Bit_N3as'

            p1_id, p1_consumer = Chess_Gconnected_users[0]
            p2_id, p2_consumer = Chess_Gconnected_users[1]

            p1_consumer.send(json.dumps({
                'type': 'match_found',
                'my_id': p1_id,
                'room_name': room_name,
                'opponent_id': p2_id,
                'color':'white'
            }))

            p2_consumer.send(json.dumps({
                'type': 'match_found',
                'my_id': p2_id,
                'room_name': room_name,
                'opponent_id': p1_id,
                'color':'black'
            }))

            Chess_Gconnected_users.clear()

    def receive(self, text_data):
        data = json.loads(text_data)

        if (data['type'] == "Websocket_message"):
            # print("=>", f"Client {self.my_id}  :", data['message'])

            response = {
                'type': 'server_response',
                'message': f"<Server received ur message : {data['message']}>"
            }
            self.send(json.dumps(response))

    def disconnect(self, close_code):
        # print("=>", f"Client {self.my_id}  DisConnected !")
        # ApiChessConsumer.connected_users -= 1
        # Chess_Gconnected_users.remove(self.my_id)
        for i, (cid, instance) in enumerate(Chess_Gconnected_users):
            if cid == self.my_id:
                Chess_Gconnected_users.pop(i)
                break


class GameChessRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        query_string = self.scope["query_string"].decode()  # "user_id=42"
        query_params = dict(qc.split('=') for qc in query_string.split('&'))
        self.user_id = query_params.get('user_id', 'unknown')

        # print("=> This consumer belongs to user_id:", self.user_id)
        # print("  => Url :", self.scope["query_string"].decode(), '\n')

        # if self.scope["user"].is_authenticated:
            # print("=> Authenticated user:", self.scope["user"].username)
        # else:
            # print("=> Anonymous user")

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        print("==> user", self.user_id, "joins the Room :", self.room_name)

        # Create a group name, e.g. "game_room_<room_name>"
        self.room_group_name = f"game_room_{self.room_name}"

        # Join the group (everyone in the same room_name joins this group)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # On disconnect, remove from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive a message from the client
        data = json.loads(text_data)

        # Broadcast it to everyone else in the same group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                # This is the method name that will be called (like a "handler")
                'type': 'broadcast_event',
                'payload': data
            }
        )

    async def broadcast_event(self, event):

        # print(event['payload'].get('my_id'), self.user_id)
        if (str(event['payload'].get('my_id')) == self.user_id):
            return

        # print(type(event['payload'].get('my_id')), type(self.user_id))
        # event['payload'].get('my_id')
        # Forward the broadcasted message to the actual WebSocket
        # so all connected clients in the group see it
        # print("=>", "from the player ", self.user_id, ":")
        # print("=>", "All players gonna recieve : ", event['payload'])
        await self.send(json.dumps(event['payload']))