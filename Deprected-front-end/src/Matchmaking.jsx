import React, { useState } from 'react';
import axios from 'axios';

function Matchmaking() {
    const [roomName, setRoomName] = useState('');
    const [alias, setAlias] = useState('');
    const [waiting, setWaiting] = useState(false);

    const handleMatchmaking = async () => {
        try {
            const response = await axios.post('http://localhost:8000/matchmaking/', { alias });
            if (response.data.room_name) {
                setRoomName(response.data.room_name);
                establishWebSocketConnection(roomName);
            } else {
                setWaiting(true);
            }
        } catch (error) {
            console.error("Error during matchmaking:", error);
        }
    };

    const establishWebSocketConnection = (room_name) => {
        console.log("Front-End room name:", room_name)
        const socket = new WebSocket('ws://localhost:8000/ws/game/room1/');
        socket.onopen = function() {
            console.log("Player:", alias, "Socket Connected (ws)!");
        };
        socket.onerror = function(error) {
            console.error("WebSocket Error: ", error);
        };
        socket.onclose = function(event) {
            console.log("WebSocket Closed: ", event);
        };
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log("Message received:", data.message);
        };
    };

    return (
        <div>
            <input 
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter your alias"
            />
            <button onClick={handleMatchmaking}>Play Now</button>
            {waiting && <p>Waiting for another player...</p>}
        </div>
    );
}

export default Matchmaking;
