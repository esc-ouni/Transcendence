// import React from "react";
import "./PreRemote"; // any extra styling
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

import React, { useState } from 'react';
import PlayerInput from '../components/PlayerInput';

const PreTournament = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player3Name, setPlayer3Name] = useState('');
  const [player4Name, setPlayer4Name] = useState('');
  const navigate = useNavigate();


  const handleLaunch = () => {
    // For demonstration, let's assume you actually have 4 distinct names:
    // player1Name, player2Name, player3Name, player4Name.
    // In your code snippet, you showed just two states, but let's generalize:
    // localStorage can store an object of all 4 players.
    const playersData = {
      p1: player1Name,
      p2: player2Name,
      p3: player3Name,
      p4: player4Name,
    };

<<<<<<< HEAD
    localStorage.setItem('tournamentPlayers', JSON.stringify(playersData));

    navigate('/Tournament');
=======
      navigate('/Game/Tournament');
    }
>>>>>>> 888d8b37... INTEGRATION
  };

  return (
    <>

      {/* <PingPongBack /> */}

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
                    playerId={2}
                    initialName={player2Name}
                    avatarSrc="/bottouns/omar.jpg"
                    onNameChange={setPlayer2Name}
                    position='left'
                    />
            </div>
            <div>
                <PlayerInput
                    playerId={3}
                    initialName={player3Name}
                    avatarSrc="/bottouns/le7ya.jpg"
                    onNameChange={setPlayer3Name}
                    position='right'
                    />
                
                <PlayerInput
                    playerId={4}
                    initialName={player4Name}
                    avatarSrc="/bottouns/le7ya.jpg"
                    onNameChange={setPlayer4Name}
                    position='right'
                    />
                </div>
            </div>

        <div className="buttona">
            <Frame
                text="Launch The Game"
                default_icon='/bottouns/default_offline.svg'
                hovered_icon='/bottouns/hovered_offline.svg'
                onClick={handleLaunch}
            />
        </div>

      </div>
    </>
  );
};



export default PreTournament;