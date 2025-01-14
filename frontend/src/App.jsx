   // src/App.jsx
  //  import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RemoteGame from './game/RemoteScene.jsx';
// import WebSocketComponent from './game/Matchmaking.jsx';
import Lobby from './pages/Lobby.jsx';
import PlayLocally_1v1 from './pages/PLayLocally_1v1.jsx';
import LocalGame from './game/LocalScene.jsx';
import Tournament from './pages/Tournament.jsx';
import PreTournament from './pages/PreTournament.jsx';
import Winner from './pages/Winner.jsx';
import PreRemote from './pages/PreRemote.jsx';
import { MatchProvider } from './game/MatchContext.jsx';
import PreMultiplayerGame from './pages/PreMultiplayerGame.jsx';
import MultiplayerGame from './game/Multiplayer.jsx';
import ChessLobby from './chess/LobbyChess.jsx';
import LocalChessGame from './chess/LocalSceneChess.jsx';
import ChessGameBack from './chess/ChessBack.jsx';
import ChessPreRemote from './chess/remote/ChessPreRemote.jsx';
import ChessRemoteGame from './chess/remote/ChessRemoteScene.jsx';

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
            <Route path='/ChessRemote' element={<ChessRemoteGame />}/>



          </Routes>
        </MatchProvider>
      </div>
    );
  }

  export default App;

