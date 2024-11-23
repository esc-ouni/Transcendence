import React, { useState, useEffect } from 'react';

const WebSocketComponent = () => {
const [messages, setMessages] = useState([]);
const [connectionStatus, setConnectionStatus] = useState("Disconnected");
const [inputMessage, setInputMessage] = useState("");
const [read_socket, setSocket] = useState(null);

useEffect(() => {
  const socket = new WebSocket('ws://localhost:8000/ws/server-endpoint-socket/');

  // Handle connection open
  socket.onopen = () => {
    console.log("==> Fen ajmi !");
    setConnectionStatus("Connected");
    setSocket(socket);
  };

  // Handle messages received
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("==> Aralya :", data);
    setMessages((prev) => [...prev, data]);
  };

  // Handle errors
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Handle connection close
  socket.onclose = () => {
    console.log("==> Thla ajmi !");
    setConnectionStatus("Disconnected");
  };

  // Cleanup on unmount
  return () => {
    socket.close();
  };
}, []);

const sendMessage = () => {
  if (read_socket && read_socket.readyState === WebSocket.OPEN) {
    const messageData = {
      type: 'user_message',
      message: inputMessage,
    };

    read_socket.send(JSON.stringify(messageData));
    console.log("==> hak ajmi :", messageData);
    // Clear the input message
    setInputMessage('');
  } else {
    console.log("WebSocket is not open");
    alert("Socket not ready!");
  }
};

return (
  <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h1>WebSocket Client</h1>
    <p>Status: <strong>{connectionStatus}</strong></p>

    <div>
      <h3>Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>

    <div>
      <h3>Send a Message</h3>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);
};

export default WebSocketComponent;