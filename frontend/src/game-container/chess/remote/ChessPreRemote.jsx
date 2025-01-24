import React, { useState, useEffect } from 'react';
import "./ChessPreRemote.css";
import { Frame } from "../../components/Frame";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from '../../game/MatchContext';
import ChessGameBack from '../ChessBack';
import { color } from 'three/webgpu';

const ChessPreRemote = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [matchSocket, setMatchSocket] = useState(null);
  const { setMatchData } = useMatchContext();

  const startMatchmaking = () => {
    setIsSearching(true);
    
    // Create WebSocket connection
    // const socket = new WebSocket('ws://localhost:8000/ws/server-endpoint-socket-chess/');
    const socket = new WebSocket('ws://localhost:8000/ws/server-endpoint-socket-chess/');
    // const socket = new WebSocket('ws://10.11.5.2:8000/ws/server-endpoint-socket/');
    
    socket.onopen = () => {
      console.log("Matchmaking WebSocket Connected");
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data['type'] === 'match_found') {
        console.log("=> Match Found:");
        console.log("   => room_name   :", data['room_name']);
        console.log("   => my_id       :", data['my_id']);
        console.log("   => opponent_id :", data['opponent_id']);
        console.log("   => color       :", data['color']);
        
        // Update match context
        setMatchData({
          roomName: data['room_name'],
          myId: data['my_id'],
          opponentId: data['opponent_id'],
          color: data['color']
        });
        
        // Close the socket and navigate to RemoteGame
        socket.close();
        setIsSearching(false);
        navigate('/Game/ChessRemoteGame');
      }
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsSearching(false);
    };
    
    socket.onclose = () => {
      console.log("Matchmaking WebSocket Closed");
    };
    
    setMatchSocket(socket);
  };

  const cancelMatchmaking = () => {
    if (matchSocket) {
      matchSocket.close();
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Cleanup socket on component unmount
    return () => {
      if (matchSocket) {
        matchSocket.close();
      }
    };
  }, [matchSocket]);

  return (
    <>

      {/* <ChessGameBack/> */}

      <div className="game-options-container-r">
        <div className="game-options-header-r">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
        <center>
          <div className="players-container-r">
            <div className="buttona-r">
              {!isSearching ? (
                <Frame
                  text="Find An Opponent"
                  default_icon='/GamePub/bottouns/default_offline.svg'
                  hovered_icon='/GamePub/bottouns/hovered_offline.svg'
                  onClick={startMatchmaking}
                />
              ) : (
                <Frame
                  text="Searching... (Cancel)"
                  default_icon='/GamePub/bottouns/default_offline.svg'
                  hovered_icon='/GamePub/bottouns/hovered_offline.svg'
                  onClick={cancelMatchmaking}
                />
              )}
            </div>
          </div>
        </center>
        
      </div>
    </>
  );
};

export default ChessPreRemote;