import { useState, useEffect } from 'react';

const WebSocketComponent = () => {
const [connectionStatus, setConnectionStatus] = useState("Disconnected");
const [inputMessage, setInputMessage] = useState("");
const [ready_socket, setSocket] = useState(null);

useEffect(() => {
  const socket = new WebSocket('ws://localhost:8000/ws/server-endpoint-socket/');

  socket.onopen = () => {
    console.log("=> WebSocket Connected", socket);
    setConnectionStatus("Connected");
    setSocket(socket);
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data['type'] === 'server_response')
      console.log("=> Message received:", data['message']);

  };

  socket.onerror = (error) => {
    console.error('=> error:', error);
  };

  socket.onclose = () => {
    console.log("=> WebSocket Disconnected");
    setConnectionStatus("Disconnected");
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
  </div>
);
};

export default WebSocketComponent;