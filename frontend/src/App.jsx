   // src/App.jsx
  //  import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RemoteGame from './game-container/game/RemoteScene.jsx';
// import WebSocketComponent from './game-container/game/Matchmaking.jsx';
import Lobby from './game-container/pages/Lobby.jsx';
import PlayLocally_1v1 from './game-container/pages/PLayLocally_1v1.jsx';
import LocalGame from './game-container/game/LocalScene.jsx';
import Tournament from './game-container/pages/Tournament.jsx';
import PreTournament from './game-container/pages/PreTournament.jsx';
import Winner from './game-container/pages/Winner.jsx';
import PreRemote from './game-container/pages/PreRemote.jsx';
import { MatchProvider } from './game-container/game/MatchContext.jsx';
import PreMultiplayerGame from './game-container/pages/PreMultiplayerGame.jsx';
import MultiplayerGame from './game-container/game/Multiplayer.jsx';
import ChessLobby from './game-container/chess/LobbyChess.jsx';
import LocalChessGame from './game-container/chess/LocalSceneChess.jsx';
import ChessGameBack from './game-container/chess/ChessBack.jsx';
import ChessPreRemote from './game-container/chess/remote/ChessPreRemote.jsx';
import ChessRemoteGame from './game-container/chess/remote/ChessRemoteScene.jsx';

  function App() {
    return (
      <div className="App">
        <MatchProvider>
          <Routes>
            <Route path='/' element={<Lobby />}/>
            <Route path='/RemoteGame' element={<RemoteGame />}/>
            {/* <Route path='/Matchmaking' element={<WebSocketComponent />}/> */}
            <Route path='/PlayLocally_1v1' element={<PlayLocally_1v1 />}/>
            <Route path='/LocalGame' element={<LocalGame />}/>
            <Route path='/Tournament' element={<Tournament />}/>
            <Route path='/PreMultiplayer' element={<PreMultiplayerGame />}/>
            <Route path='/Multiplayer' element={<MultiplayerGame />}/>
            <Route path='/PreTournament' element={<PreTournament />}/>
            <Route path='/PreRemote' element={<PreRemote />}/>
            <Route path='/Winner' element={<Winner />}/>


            <Route path='/Chess_Lobby' element={<ChessLobby />}/>
            <Route path='/ChessLocally' element={<LocalChessGame />}/>
            <Route path='/ChessPreRemote' element={<ChessPreRemote />}/>
            <Route path='/ChessRemoteGame' element={<ChessRemoteGame />}/>



          </Routes>
        </MatchProvider>
      </div>
    );
  }

  export default App;

