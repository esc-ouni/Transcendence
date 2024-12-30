   // src/App.jsx
  //  import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RemoteGame from './game/RemoteScene.jsx';
import WebSocketComponent from './game/Matchmaking.jsx';
import Lobby from './pages/Lobby.jsx';
import PlayLocally_1v1 from './pages/PLayLocally_1v1.jsx';
import LocalGame from './game/LocalScene.jsx';
import Tournament from './pages/Tournament.jsx';
;
  //  import './style.css';

  function App() {
    return (
      <div className="App">
        <Routes>
          <Route path='/' element={<Lobby />}/>
          <Route path='/RemoteGame' element={<RemoteGame />}/>
          <Route path='/Matchmaking' element={<WebSocketComponent />}/>
          <Route path='/PlayLocally_1v1' element={<PlayLocally_1v1 />}/>
          <Route path='/LocalGame' element={<LocalGame />}/>
          <Route path='/Tournament' element={<Tournament />}/>
        </Routes>
      </div>
    );
  }

  export default App;