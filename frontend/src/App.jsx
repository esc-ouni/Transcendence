   // src/App.jsx
  //  import React from 'react';
   import { Routes, Route } from 'react-router-dom';
   import RemoteGame from './game/RemoteScene.jsx';
   import WebSocketComponent from './game/Matchmaking.jsx';
   import Lobby from './pages/Lobby.jsx';
  //  import './style.css';

   function App() {
     return (
       <div className="App">
          <Routes>
            <Route path='/' element={<Lobby />}/>
            <Route path='/RemoteGame' element={<RemoteGame />}/>
            <Route path='/Matchmaking' element={<WebSocketComponent />}/>
          </Routes>
       </div>
     );
   }

   export default App;