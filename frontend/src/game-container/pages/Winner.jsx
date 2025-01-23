
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

      {/* <PingPongBack /> */}

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
<<<<<<< HEAD
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
<<<<<<< HEAD
            onClick={() => navigate('/')}
=======
=======
            default_icon='/GamePub/bottouns/default_offline.svg'
            hovered_icon='/GamePub/bottouns/hovered_offline.svg'
>>>>>>> 2d1b639c... INTEGRATION
            onClick={() => {
              localStorage.removeItem('Matches_data');
              localStorage.removeItem('Matches_history');
              localStorage.removeItem("matchId")
              navigate('/Game/PingPong_Lobby')
            }}
>>>>>>> c61dcb11... PAGES
          />
          <Frame
            text="Re-Match"
<<<<<<< HEAD
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
<<<<<<< HEAD
            onClick={() => navigate('/LocalGame')}
=======
=======
            default_icon='/GamePub/bottouns/default_offline.svg'
            hovered_icon='/GamePub/bottouns/hovered_offline.svg'
>>>>>>> 2d1b639c... INTEGRATION
            onClick={() => {
              localStorage.removeItem('Matches_data');
              localStorage.removeItem('Matches_history');
              localStorage.removeItem("matchId")
              navigate('/Game/LocalGame')
            }}
>>>>>>> 888d8b37... INTEGRATION
          />
        </div>
      </div>
    </>
  );
};

export default Winner;