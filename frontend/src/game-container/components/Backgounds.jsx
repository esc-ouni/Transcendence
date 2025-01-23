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
    '/Game/Chess_Lobby',
    '/Game/ChessPreLocal',
    '/Game/ChessPreRemote',
    '/Game/ChessWinner'
  ].includes(location.pathname)

  const OnPongRoute = [
    '/Game/PingPong_Lobby',
    '/Game/Tournament',
    '/Game/PlayLocally_1v1',
    '/Game/PreMultiplayer',
    '/Game/PreTournament',
    '/Game/PreRemote',
    '/Game/Winner'
  ].includes(location.pathname)
  

  const show = (location.pathname ===  '/Game') || (location.pathname ===  '/Game/');
  

  return (
    <>
      <div className={OnChessRoute ? "visible" : "hidden"}>
        <ChessGameBack />
      </div>
      <div className={OnPongRoute ? "visible" : "hidden"}>
        <PingPongBack />
      </div>

      <div className={show ? "visible" : "hidden"}>
        <DefaultBack />
      </div>

  
      <div className={show ? "visible teams-container" : "hidden"} >
        <div className="team" onClick={() => {navigate('/Game/Chess_Lobby')}}>
            <ModelPreview modelPath="/GamePub/chess-assets/models/horse_statue_01_2k.gltf/horse_statue_01_2k.gltf" Scale={10} />
        </div>
        <div className="team" onClick={() => {navigate('/Game/PingPong_Lobby')}}>
            <ModelPreview modelPath="/GamePub/chess-assets/models/yellow_onion_2k.gltf/yellow_onion_2k.gltf" Scale={25} />
        </div>
      </div>

    </>
  );
}

export default Backgrounds;



