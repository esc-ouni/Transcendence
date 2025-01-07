import { useState, useEffect } from 'react';

const WebSocketComponent = () => {
const [connectionStatus, setConnectionStatus] = useState("Disconnected");
const [Roomname, setRoomname] = useState("None");
const [inputMessage, setInputMessage] = useState("");
const [inputRMessage, setRInputMessage] = useState("");
const [ready_socket, setSocket] = useState(null);
const [Rroom_socket, setRSocket] = useState(null);
const [my_id, setId] = useState(null);

useEffect(() => {
  const socket = new WebSocket('ws://localhost:8000/ws/server-endpoint-socket/');
  
  socket.onopen = () => {
    console.log("=> WebSocket Connected", socket);
    setConnectionStatus("Connected");
    setSocket(socket);
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data['type'] === 'connection_established'){
      console.log((data['message']));
      setId(data['my_id']);
      console.log(data['my_id']);
    }

    if (data['type'] === 'server_response')
      console.log("=> Message received:", data['message']);
    
    if (data['type'] === 'match_found'){
      console.log("=> Match Infos:");
      console.log("   => room_name   :", data['room_name']);
      console.log("   => my_id       :", data['my_id']);
      console.log("   => opponent_id :", data['opponent_id'],'\n');

      setRoomname(data['room_name']);
      if (!Rroom_socket){

        let room_socket = new WebSocket('ws://localhost:8000/ws/ping-pong/room/bit_n3as/' + '/?user_id=' + data['my_id'])
        // setRSocket(room_socket)
        room_socket.onopen = () => {
          console.log("=> Room WebSocket Connected", room_socket);
          setRSocket(room_socket)
        };
        room_socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
            console.log("=> Type received :", data['type']);
            
            if (data['type'] === 'Game_State')
              console.log("=> The brodcaster :", data['my_id']);
              console.log("   => Says        :", data['message'], '\n');
          }
      }
      
    }
  };

  return () => {
    console.log("=> Closing WebSocket On useEffect return !");
    socket.close();
  };
}, []);

const sendMessage = () => {
  if (ready_socket && ready_socket.readyState === WebSocket.OPEN) {
    const messageData = {
      type: 'Websocket_message',
      message: inputMessage,
    };

    ready_socket.send(JSON.stringify(messageData));

    setInputMessage('');
  } else {
    alert("Socket not ready!");
  }
};

const sendGameState = () => {
  if (Rroom_socket && Rroom_socket.readyState === WebSocket.OPEN) {
    const messageData = {
      type: 'Game_State',
      my_id: my_id,
      message: inputRMessage,
    };

    Rroom_socket.send(JSON.stringify(messageData));

    setRInputMessage('');
  } else {
    alert("Socket not ready!");
  }
};

return (
  <div style={{padding: "20px", 
               fontFamily: "Arial, sans-serif"}}>
    <h1>WebSocket Client</h1>
    <p>Status: <strong>{connectionStatus}</strong></p>

    <div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
    <p>Rom Connected to : <strong>{Roomname}</strong></p>
    <div>
      <input
          type="text"
          value={inputRMessage}
          onChange={(e) => setRInputMessage(e.target.value)}
        />
      <button onClick={sendGameState}>Send Game State</button>
    </div>
  </div>
);
};

export default WebSocketComponent;
