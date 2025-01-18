
// export default Winner;

import React from "react";
import "./ChessWinner.css";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";
import ChessGameBack from "./ChessBack";

const ChessWinner = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="background-wrapper-w"> */}
        <ChessGameBack/>
      {/* </div> */}
      <div className="game-options-container-w">
        <div className="game-options-header-w">
          <h1>Winner</h1>
        </div>
        
        <div className="players-container-w">
          {/* Add your game content here */}
          {/* <div className="flex center-column max-width-full ">
            <img src="bottouns/crown.png" width="50%" height="50%"/>
            <h1 className="yellow">{winner}</h1>
          </div> */}
        </div>
        <div className="button-container-w">
          <Frame
            text="Main Game Page"
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
            onClick={() => {
            //   localStorage.removeItem('Matches_data');
            //   localStorage.removeItem('Matches_history');
            //   localStorage.removeItem("matchId")
              navigate('/Chess_Lobby')
            }}
          />
          {/* <Frame
            text="Re-Match"
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
            onClick={() => {
              localStorage.removeItem('Matches_data');
              localStorage.removeItem('Matches_history');
              localStorage.removeItem("matchId")
              navigate('/LocalGame')
            }}
          /> */}
        </div>
      </div>
    </>
  );
};

export default ChessWinner;