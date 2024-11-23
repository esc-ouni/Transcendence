from channels.generic.websocket import WebsocketConsumer
import json

class ApiConsumer(WebsocketConsumer):
  def connect(self):
      self.accept()
      print("==>", "Fen ajmi !")

      self.send(json.dumps({
          'type': 'connection_established',
          'state': 'a3zab',
          'message': 'ki rak b9it assadi9'
      }))
      print("==>", "hak ajmi :")

  def receive(self, text_data):
      print("==>", "Aralya  :", text_data)
      data = json.loads(text_data)
      response = {
          'type': 'server_response',
          'message': f"Received your message: {data.get('message')}"
      }
      self.send(json.dumps(response))

  def disconnect(self, close_code):
      print("==>", "Thla ajmi !")