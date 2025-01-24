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
import ChessPreRemote from './game-container/chess/remote/ChessPreRemote.jsx';
import ChessRemoteGame from './game-container/chess/remote/ChessRemoteScene.jsx';
import MainGamePage from './game-container/pages/MainGamePage.jsx';
import ChessPreLocal from './game-container/chess/ChessPreLocal.jsx';
import ChessWinner from './game-container/chess/ChessWinner.jsx';
import Backgrounds from './game-container/components/Backgounds.jsx';

  function App() {
    return (
      <div className="App">
        <Backgrounds/>

        <MatchProvider>
          <Routes>
            <Route path='/game' element={<MainGamePage />}/>

            <Route path='/game/PingPong_Lobby' element={<Lobby />}/>
            <Route path='/game/RemoteGame' element={<RemoteGame />}/>
            <Route path='/game/PlayLocally_1v1' element={<PlayLocally_1v1 />}/>
            <Route path='/game/LocalGame' element={<LocalGame />}/>
            <Route path='/game/Tournament' element={<Tournament />}/>
            <Route path='/game/PreMultiplayer' element={<PreMultiplayerGame />}/>
            <Route path='/game/Multiplayer' element={<MultiplayerGame />}/>
            <Route path='/game/PreTournament' element={<PreTournament />}/>
            <Route path='/game/PreRemote' element={<PreRemote />}/>
            <Route path='/game/Winner' element={<Winner />}/>


            <Route path='/game/Chess_Lobby' element={<ChessLobby />}/>
            <Route path='/game/ChessLocally' element={<LocalChessGame />}/>
            <Route path='/game/ChessPreLocal' element={<ChessPreLocal />}/>
            <Route path='/game/ChessPreRemote' element={<ChessPreRemote />}/>
            <Route path='/game/ChessRemoteGame' element={<ChessRemoteGame />}/>
            <Route path='/game/ChessWinner' element={<ChessWinner />}/>
          </Routes>
        </MatchProvider>
      </div>
    );
  }

  export default App;

