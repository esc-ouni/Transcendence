// // import React from "react";
// import "./Winner.css"; // any extra styling
// import PingPongBack from "../components/PingPongBack";
// import { Frame } from "../components/Frame";
// import { useNavigate } from "react-router-dom";

// import React, { useState } from 'react';
// import PlayerInput from '../components/PlayerInput';

// const Winner = () => {
//   const navigate = useNavigate();

//   return (
//     <>

//       <div className="background-wrapper">
//         <PingPongBack />
//       </div>
//       <div className="game-options-container">
//         <div className="game-options-header">
//           <h1>Winner</h1>
//         </div>
        
//         <div className="players-container">
//             {/* L3ibat d l2ibda3 */}
//         </div>

//         <div className="buttona">
//             <Frame
//                 text="Main Game Page"
//                 default_icon='/bottouns/default_offline.svg'
//                 hovered_icon='/bottouns/hovered_offline.svg'
//                 onClick={() => {navigate('/')}}
//             />
//             <Frame
//                 text="ReMatch"
//                 default_icon='/bottouns/default_offline.svg'
//                 hovered_icon='/bottouns/hovered_offline.svg'
//                 onClick={() => {navigate('/LocalGame')}}
//             />

//         </div>

//       </div>
//     </>
//   );
// };



// export default Winner;

import React from "react";
import "./Winner.css";
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

const Winner = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="background-wrapper">
        <PingPongBack />
      </div>
      <div className="game-options-container">
        <div className="game-options-header">
          <h1>Winner</h1>
        </div>
        
        <div className="players-container">
          {/* Add your game content here */}
        </div>

        <div className="button-container">
          <Frame
            text="Main Game Page"
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
            onClick={() => navigate('/')}
          />
          <Frame
            text="Re-Match"
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
            onClick={() => navigate('/LocalGame')}
          />
        </div>
      </div>
    </>
  );
};

export default Winner;