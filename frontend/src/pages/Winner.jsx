
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
      <div className="background-wrapper-w">
        <PingPongBack />
      </div>
      <div className="game-options-container-w">
        <div className="game-options-header-w">
          <h1>Winner</h1>
        </div>
        
        <div className="players-container-w">
          {/* Add your game content here */}
        </div>

        <div className="button-container-w">
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