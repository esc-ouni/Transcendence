
// export default Winner;

import React from "react";
import "./Winner.css";
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

const Winner = () => {
  const navigate = useNavigate();
  const matchId = localStorage.getItem("matchId");
  const matchData = JSON.parse(localStorage.getItem("Matches_data"));
  const winner = matchData[matchId].winner;
  return (
    <>

      {/* <PingPongBack /> */}

      <div className="game-options-container-w">
        <div className="game-options-header-w">
          <h1>Winner</h1>
        </div>
        
        <div className="players-container-w">
          {/* Add your game content here */}
          <div className="flex center-column max-width-full ">
            <img src="bottouns/crown.png" width="50%" height="50%"/>
            <h1 className="yellow">{winner}</h1>
          </div>
        </div>
        <div className="button-container-w">
          <Frame
            text="Main Game Page"
            default_icon='/GamePub/bottouns/default_offline.svg'
            hovered_icon='/GamePub/bottouns/hovered_offline.svg'
            onClick={() => {
              localStorage.removeItem('Matches_data');
              localStorage.removeItem('Matches_history');
              localStorage.removeItem("matchId")
              navigate('/Game/PingPong_Lobby')
            }}
          />
          <Frame
            text="Re-Match"
            default_icon='/GamePub/bottouns/default_offline.svg'
            hovered_icon='/GamePub/bottouns/hovered_offline.svg'
            onClick={() => {
              localStorage.removeItem('Matches_data');
              localStorage.removeItem('Matches_history');
              localStorage.removeItem("matchId")
              navigate('/Game/LocalGame')
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Winner;