// // import React from "react";
// import "./PreRemote.css"; // any extra styling
// import PingPongBack from "../components/PingPongBack";
// import { Frame } from "../components/Frame";
// import { useNavigate } from "react-router-dom";

// import React from 'react';

// const PreRemote = () => {
//   const navigate = useNavigate();

//   return (
//     <>

//       <div className="background-wrapper-r">
//         <PingPongBack />
//       </div>
//       <div className="game-options-container-r">
//         <div className="game-options-header-r">
//           <h1>GAME OPTIONS</h1>
//           <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
//         </div>
//       <center>
//           <div className="players-container-r">
//             <div className="buttona-r">
//               <Frame
//                   text="Find An Opponent"
//                   default_icon='/bottouns/default_offline.svg'
//                   hovered_icon='/bottouns/hovered_offline.svg'
//                   onClick={() => {navigate('/Matchmaking')}}
//               />
//             </div>
//           </div>
//       </center>
//       </div>
//     </>
//   );
// };



// export default PreRemote;


import React, { useState, useEffect } from 'react';
import "./PreRemote.css";
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";
import { useMatchContext } from '../game/MatchContext'; // Assuming you have this context

const PreRemote = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [matchSocket, setMatchSocket] = useState(null);
  const { setMatchData } = useMatchContext();

  const startMatchmaking = () => {
    setIsSearching(true);
    
    // Create WebSocket connection
    // const socket = new WebSocket('ws://localhost:8000/ws/server-endpoint-socket/');
    const socket = new WebSocket('ws://10.13.9.18:8000/ws/server-endpoint-socket/');
    
    socket.onopen = () => {
      console.log("Matchmaking WebSocket Connected");
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data['type'] === 'match_found') {
        console.log("=> Match Found:");
        console.log("   => room_name   :", data['room_name']);
        console.log("   => my_id    :", data['my_id']);
        console.log("   => opponent_id :", data['opponent_id']);
        
        // Update match context
        setMatchData({
          roomName: data['room_name'],
          myId: data['my_id'],
          opponentId: data['opponent_id'],
        });
        
        // Close the socket and navigate to RemoteGame
        socket.close();
        setIsSearching(false);
        navigate('/RemoteGame');
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
      <div className="background-wrapper-r">
        <PingPongBack />
      </div>
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
                  default_icon='/bottouns/default_offline.svg'
                  hovered_icon='/bottouns/hovered_offline.svg'
                  onClick={startMatchmaking}
                />
              ) : (
                <Frame
                  text="Searching... (Cancel)"
                  default_icon='/bottouns/default_offline.svg'
                  hovered_icon='/bottouns/hovered_offline.svg'
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

export default PreRemote;