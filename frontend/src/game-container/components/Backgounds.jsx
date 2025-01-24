import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChessGameBack from '../chess/ChessBack';
import PingPongBack from './PingPongBack';
import ModelPreview from './ModelPreview';
import '../pages/MainGamePage.css'
import DefaultBack from './DefaultBack';


function Backgrounds() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const OnChessRoute = [
    '/game/Chess_Lobby',
    '/game/ChessPreLocal',
    '/game/ChessPreRemote',
    '/game/ChessWinner'
  ].includes(location.pathname)

  const OnPongRoute = [
    '/game/PingPong_Lobby',
    '/game/Tournament',
    '/game/PlayLocally_1v1',
    '/game/PreMultiplayer',
    '/game/PreTournament',
    '/game/PreRemote',
    '/game/Winner'
  ].includes(location.pathname)
  

  const show = (location.pathname ===  '/game') || (location.pathname ===  '/game/');
  
  console.log(location.pathname, ", OnPongRoute : ", OnPongRoute, ", OnChessRoute : ", OnChessRoute, ", show : ", show);

  return (
    <>
      <div className={OnChessRoute ? "" : "hidden-v"}>
        <ChessGameBack />
      </div>
      <div className={OnPongRoute ? "" : "hidden-v"}>
        <PingPongBack />
      </div>

      <div className={show ? "" : "hidden-v"}>
        <DefaultBack />
      </div>

  
      <div className={show ? "teams-container" : "hidden-v"} >
        <div className="team" onClick={() => {navigate('/game/Chess_Lobby')}}>
            <ModelPreview modelPath="/GamePub/chess-assets/models/horse_statue_01_2k.gltf/horse_statue_01_2k.gltf" Scale={10} />
        </div>
        <div className="team" onClick={() => {navigate('/game/PingPong_Lobby')}}>
            <ModelPreview modelPath="/GamePub/chess-assets/models/yellow_onion_2k.gltf/yellow_onion_2k.gltf" Scale={25} />
        </div>
      </div>

    </>
  );
}

export default Backgrounds;



