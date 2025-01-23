// import React from "react";
import "./GameOptions.css"; // any extra styling
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

import React, { useState } from 'react';
import PlayerInput from '../components/PlayerInput';

const PlayLocally_1v1 = () => {
  const [player1Name, setPlayer1Name] = useState('Haskitwy');
  const [player2Name, setPlayer2Name] = useState('Haskitwy');
  const navigate = useNavigate();

  return (
    <>

      {/* <PingPongBack /> */}

      <div className="game-options-container">
        <div className="game-options-header">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
        
        <div className="players-container">
          <PlayerInput
            playerId={1}
            initialName={player1Name}
            avatarSrc="/bottouns/omar.jpg"
            onNameChange={setPlayer1Name}
            position='left'
            />
          
          <PlayerInput
            playerId={2}
            initialName={player2Name}
            avatarSrc="/bottouns/le7ya.jpg"
            onNameChange={setPlayer2Name}
            position='right'
            />
        </div>

        <div className="buttona">
            <Frame
                text="Launch Game"
                default_icon='/bottouns/default_offline.svg'
                hovered_icon='/bottouns/hovered_offline.svg'
                onClick={() => {navigate('/LocalGame')}}
            />
        </div>

      </div>
    </>
  );
};



export default PlayLocally_1v1;