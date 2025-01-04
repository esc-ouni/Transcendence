// import React from "react";
import "./PreRemote"; // any extra styling
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

import React, { useState } from 'react';
import PlayerInput from '../components/PlayerInput';

const PreTournament = () => {
  const [player1Name, setPlayer1Name] = useState('Haskitwy');
  const [player2Name, setPlayer2Name] = useState('Haskitwy');
  const navigate = useNavigate();

  return (
    <>

      <div className="background-wrapper">
        <PingPongBack />
      </div>
      <div className="game-options-container">
        <div className="game-options-header">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
        
        <div className="players-container">
            <div>
                <PlayerInput
                    playerId={1}
                    initialName={player1Name}
                    avatarSrc="/bottouns/omar.jpg"
                    onNameChange={setPlayer1Name}
                    position='left'
                    />
                
                <PlayerInput
                    playerId={3}
                    initialName={player1Name}
                    avatarSrc="/bottouns/omar.jpg"
                    onNameChange={setPlayer1Name}
                    position='left'
                    />
            </div>
            <div>
                <PlayerInput
                    playerId={2}
                    initialName={player2Name}
                    avatarSrc="/bottouns/le7ya.jpg"
                    onNameChange={setPlayer2Name}
                    position='right'
                    />
                
                <PlayerInput
                    playerId={4}
                    initialName={player2Name}
                    avatarSrc="/bottouns/le7ya.jpg"
                    onNameChange={setPlayer2Name}
                    position='right'
                    />
                </div>
            </div>

        <div className="buttona">
            <Frame
                text="Launch The Game"
                default_icon='/bottouns/default_offline.svg'
                hovered_icon='/bottouns/hovered_offline.svg'
                onClick={() => {navigate('/LocalGame')}}
            />
        </div>

      </div>
    </>
  );
};



export default PreTournament;