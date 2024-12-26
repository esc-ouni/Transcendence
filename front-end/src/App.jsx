   // src/App.jsx
  //  import React from 'react';
   import { Routes, Route } from 'react-router-dom';
   import ThreeGame from './ThreeScene.jsx';
   import WebSocketComponent from './Matchmaking.jsx';
   import Lobby from './Lobby.jsx';
  //  import './style.css';

   function App() {
     return (
       <div className="App">
          <Routes>
            <Route path='/' element={<Lobby />}/>
            <Route path='/Threegame' element={<ThreeGame />}/>
            <Route path='/Matchmaking' element={<WebSocketComponent />}/>
          </Routes>
       </div>
     );
   }

   export default App;