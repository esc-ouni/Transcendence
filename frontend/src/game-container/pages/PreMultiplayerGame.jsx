import React, { useState } from 'react';
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";
import PlayerInput from '../components/PlayerInput';
import "./PreMultiplayerGame.css";


const PreMultiplayerGame = () => {
  const [blueTeamPlayers, setBlueTeamPlayers] = useState({
    player1: 'Haskitwy',
    player3: 'Haskitwy'
  });
  const [redTeamPlayers, setRedTeamPlayers] = useState({
    player2: 'Haskitwy',
    player4: 'Haskitwy'
  });
  const navigate = useNavigate();

  return (
    <>

      {/* <PingPongBack /> */}

      <div className="mgame-options-container">
        <div className="mgame-options-header">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
        
        <div className="mteams-container">
          <div className="mteam blue-team">
            <div className="mteam-header">BLUE TEAM</div>
            <div className="mteam-players">
              <PlayerInput
                playerId={1}
                initialName={blueTeamPlayers.player1}
                avatarSrc="/GamePub/bottouns/omar.jpg"
                onNameChange={(name) => setBlueTeamPlayers({...blueTeamPlayers, player1: name})}
                position='left'
              />
              <PlayerInput
                playerId={3}
                initialName={blueTeamPlayers.player3}
                avatarSrc="/GamePub/bottouns/omar.jpg"
                onNameChange={(name) => setBlueTeamPlayers({...blueTeamPlayers, player3: name})}
                position='left'
              />
            </div>
          </div>

          <div className="mteam red-team">
            <div className="mteam-header">RED TEAM</div>
            <div className="mteam-players">
              <PlayerInput
                playerId={2}
                initialName={redTeamPlayers.player2}
                avatarSrc="/GamePub/bottouns/le7ya.jpg"
                onNameChange={(name) => setRedTeamPlayers({...redTeamPlayers, player2: name})}
                position='right'
              />
              <PlayerInput
                playerId={4}
                initialName={redTeamPlayers.player4}
                avatarSrc="/GamePub/bottouns/le7ya.jpg"
                onNameChange={(name) => setRedTeamPlayers({...redTeamPlayers, player4: name})}
                position='right'
              />
            </div>
          </div>
        </div>

        <div className="mbuttona">
          <Frame
            text="Launch The Game"
            default_icon='/GamePub/bottouns/default_offline.svg'
            hovered_icon='/GamePub/bottouns/hovered_offline.svg'
            onClick={() => {navigate('/Game/Multiplayer')}}
          />
        </div>
      </div>
    </>
  );
};

export default PreMultiplayerGame;