import "../pages/GameOptions.css"; // any extra styling
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from 'react';
import PlayerInput from '../components/PlayerInput';
import ChessGameBack from "./ChessBack";

const ChessPreLocal = () => {
  const [player1Name, setPlayer1Name] = useState('Haskitwy');
  const [player2Name, setPlayer2Name] = useState('Haskitwy');
  const navigate = useNavigate();

  useEffect(() => {
    // CLEAR LOCAL SRORAGE
    localStorage.removeItem('Matches_data');
    localStorage.removeItem("matchId")
  }, []);

  return (
    <>

      {/* <ChessGameBack /> */}
      <div className="main-game-page-container">

      <div className="game-options-container">
        <div className="game-options-header">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
        
        <div className="players-container">
          <PlayerInput
            playerId={1}
            initialName={player1Name}
            avatarSrc="/GamePub/bottouns/omar.jpg"
            onNameChange={setPlayer1Name}
            position='left'
            />
          
          <PlayerInput
            playerId={2}
            initialName={player2Name}
            avatarSrc="/GamePub/bottouns/le7ya.jpg"
            onNameChange={setPlayer2Name}
            position='right'
            />
        </div>

        <div className="buttona">
            <Frame
                text="Launch Game"
                default_icon='/GamePub/bottouns/default_offline.svg'
                hovered_icon='/GamePub/bottouns/hovered_offline.svg'
                onClick={() => {
                  let match = {
                    FINALY: {"player1": player1Name, "player2": player2Name, "winner": null, "Score1": 0, "Score2": 0},
                  }
                  localStorage.setItem("Matches_data", JSON.stringify(match))
                  localStorage.setItem("matchId", "FINALY")

                  navigate('/game/ChessLocally')
                }}
            />
        </div>

      </div>
      </div>
    </>
  );
};



export default ChessPreLocal;