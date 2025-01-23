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
            <Route path='/Game' element={<MainGamePage />}/>

            <Route path='/Game/PingPong_Lobby' element={<Lobby />}/>
            <Route path='/Game/RemoteGame' element={<RemoteGame />}/>
            <Route path='/Game/PlayLocally_1v1' element={<PlayLocally_1v1 />}/>
            <Route path='/Game/LocalGame' element={<LocalGame />}/>
            <Route path='/Game/Tournament' element={<Tournament />}/>
            <Route path='/Game/PreMultiplayer' element={<PreMultiplayerGame />}/>
            <Route path='/Game/Multiplayer' element={<MultiplayerGame />}/>
            <Route path='/Game/PreTournament' element={<PreTournament />}/>
            <Route path='/Game/PreRemote' element={<PreRemote />}/>
            <Route path='/Game/Winner' element={<Winner />}/>


            <Route path='/Game/Chess_Lobby' element={<ChessLobby />}/>
            <Route path='/Game/ChessLocally' element={<LocalChessGame />}/>
            <Route path='/Game/ChessPreLocal' element={<ChessPreLocal />}/>
            <Route path='/Game/ChessPreRemote' element={<ChessPreRemote />}/>
            <Route path='/Game/ChessRemoteGame' element={<ChessRemoteGame />}/>
            <Route path='/Game/ChessWinner' element={<ChessWinner />}/>
          </Routes>
        </MatchProvider>
      </div>
    );
  }

  export default App;

