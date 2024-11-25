from channels.generic.websocket import WebsocketConsumer
import json


class ApiConsumer(WebsocketConsumer):
    connected_users = 0
    my_id = 0

    def connect(self):
        self.accept()
        ApiConsumer.connected_users += 1
        self.my_id = ApiConsumer.connected_users
        print("=>", f"Client {self.my_id} Connected !")

        self.send(json.dumps({
            'type': 'connection_established',
            'message': f'ki rak b9it assadi9, nta hwa {self.my_id} '
        }))

    def receive(self, text_data):
        data = json.loads(text_data)

        if (data['type'] == "Websocket_message"):
            print("=>", f"Client {self.my_id}  :", data['message'])

            response = {
                'type': 'server_response',
                'message': f"<Server received ur message : {data['message']}>"
            }
            self.send(json.dumps(response))

    def disconnect(self, close_code):
        print("=>", f"Client {self.my_id}  DisConnected !")
        ApiConsumer.connected_users -= 1