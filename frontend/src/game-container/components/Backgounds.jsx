import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChessGameBack from '../chess/ChessBack';
import PingPongBack from './PingPongBack';
import ModelPreview from './ModelPreview';
import '../pages/MainGamePage.css'

// import ChessB

function Backgrounds() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const OnChessRoute = [
    '/Chess_Lobby',
    '/ChessPreLocal',
    '/ChessPreRemote',
    '/ChessWinner'
  ].includes(location.pathname)

  const OnPongRoute = [
    '/',
    '/PingPong_Lobby',
    '/Tournament',
    '/PlayLocally_1v1',
    '/PreMultiplayer',
    '/PreTournament',
    '/PreRemote',
    '/Winner'
  ].includes(location.pathname)

  const show = location.pathname === '/';
  
  // If not on "/", hide everything (but keep mounted)
  // if (!show) {
  //   return null;
  // }
  return (
    <>
       {console.log(location.pathname, OnChessRoute, OnPongRoute)}
      {/* <ChessGameBack style={{ display: OnChessRoute ? 'block' : 'none' }} />

      <PingPongBack style={{ display: OnPongRoute ? 'block' : 'none'}} /> */}

      <div className={OnChessRoute ? "visible" : "hidden"}>
        <ChessGameBack />
      </div>
      <div className={OnPongRoute ? "visible" : "hidden"}>
        <PingPongBack />
      </div>

  
      <div className={show ? "teams-container visible" : "hidden"} >
        <div className="team" onClick={() => {navigate('/Chess_Lobby')}}>
            <ModelPreview modelPath="/chess-assets/models/horse_statue_01_2k.gltf/horse_statue_01_2k.gltf" Scale={10} />
        </div>
        <div className="team" onClick={() => {navigate('/PingPong_Lobby')}}>
            <ModelPreview modelPath="/chess-assets/models/yellow_onion_2k.gltf/yellow_onion_2k.gltf" Scale={25} />
        </div>
      </div>

    </>
  );
}

export default Backgrounds;



