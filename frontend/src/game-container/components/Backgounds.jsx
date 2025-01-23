import React from 'react';
import { useLocation } from 'react-router-dom';
import ChessGameBack from '../chess/ChessBack';
import PingPongBack from './PingPongBack';

// import ChessB

function Backgrounds() {
  const location = useLocation();
  
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

  return (
    <>
       {console.log(location.pathname, OnChessRoute, OnPongRoute)}
      {/* <ChessGameBack style={{ display: OnChessRoute ? 'block' : 'none' }} />

      <PingPongBack style={{ display: OnPongRoute ? 'block' : 'none'}} /> */}


    {/* <div style={{ position: 'relative' }}> */}
      {/* Keep them in memory, but hide/unhide */}
      <div className={OnChessRoute ? 'visible' : 'hidden'}>
        <ChessGameBack />
      </div>
      <div className={OnPongRoute ? 'visible' : 'hidden'}>
        <PingPongBack />
      </div>
    {/* </div> */}
    </>
  );
}

export default Backgrounds;
