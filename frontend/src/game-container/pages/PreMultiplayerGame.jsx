// // import React from "react";
// import "./GameOptions2.css"; // any extra styling
// import PingPongBack from "../components/PingPongBack";
// import { Frame } from "../components/Frame";
// import { useNavigate } from "react-router-dom";

// import React, { useState } from 'react';
// import PlayerInput from '../components/PlayerInput';

// const MultiplayerGame = () => {
//   const [player1Name, setPlayer1Name] = useState('Haskitwy');
//   const [player2Name, setPlayer2Name] = useState('Haskitwy');
//   const navigate = useNavigate();

//   return (
//     <>

//       <div className="background-wrapper">
//         <PingPongBack />
//       </div>
//       <div className="game-options-container">
//         <div className="game-options-header">
//           <h1>GAME OPTIONS</h1>
//           <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
//         </div>
        
//         <div className="players-container">
//           <PlayerInput
//             playerId={1}
//             initialName={player1Name}
//             avatarSrc="/bottouns/omar.jpg"
//             onNameChange={setPlayer1Name}
//             position='left'
//             />
          
//           <PlayerInput
//             playerId={3}
//             initialName={player1Name}
//             avatarSrc="/bottouns/omar.jpg"
//             onNameChange={setPlayer1Name}
//             position='left'
//             />
            
//           <PlayerInput
//             playerId={2}
//             initialName={player2Name}
//             avatarSrc="/bottouns/le7ya.jpg"
//             onNameChange={setPlayer2Name}
//             position='right'
//             />
          
//           <PlayerInput
//             playerId={4}
//             initialName={player2Name}
//             avatarSrc="/bottouns/le7ya.jpg"
//             onNameChange={setPlayer2Name}
//             position='right'
//             />
//         </div>

//         <div className="buttona">
//             <Frame
//                 text="Launch The Game"
//                 default_icon='/bottouns/default_offline.svg'
//                 hovered_icon='/bottouns/hovered_offline.svg'
//                 onClick={() => {navigate('/LocalGame')}}
//             />
//         </div>

//       </div>
//     </>
//   );
// };



// export default MultiplayerGame;



import React, { useState } from 'react';
import "./GameOptions2.css";
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";
import PlayerInput from '../components/PlayerInput';

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
      <div className="background-wrapper">
        <PingPongBack />
      </div>
      <div className="game-options-container">
        <div className="game-options-header">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
        
        <div className="teams-container">
          <div className="team blue-team">
            <div className="team-header">BLUE TEAM</div>
            <div className="team-players">
              <PlayerInput
                playerId={1}
                initialName={blueTeamPlayers.player1}
                avatarSrc="/bottouns/omar.jpg"
                onNameChange={(name) => setBlueTeamPlayers({...blueTeamPlayers, player1: name})}
                position='left'
              />
              <PlayerInput
                playerId={3}
                initialName={blueTeamPlayers.player3}
                avatarSrc="/bottouns/omar.jpg"
                onNameChange={(name) => setBlueTeamPlayers({...blueTeamPlayers, player3: name})}
                position='left'
              />
            </div>
          </div>

          <div className="team red-team">
            <div className="team-header">RED TEAM</div>
            <div className="team-players">
              <PlayerInput
                playerId={2}
                initialName={redTeamPlayers.player2}
                avatarSrc="/bottouns/le7ya.jpg"
                onNameChange={(name) => setRedTeamPlayers({...redTeamPlayers, player2: name})}
                position='right'
              />
              <PlayerInput
                playerId={4}
                initialName={redTeamPlayers.player4}
                avatarSrc="/bottouns/le7ya.jpg"
                onNameChange={(name) => setRedTeamPlayers({...redTeamPlayers, player4: name})}
                position='right'
              />
            </div>
          </div>
        </div>

        <div className="buttona">
          <Frame
            text="Launch The Game"
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
            onClick={() => {navigate('/Multiplayer')}}
          />
        </div>
      </div>
    </>
  );
};

export default PreMultiplayerGame;