// import React from "react";
import "./PreRemote.css"; // any extra styling
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { useNavigate } from "react-router-dom";

import React from 'react';

const PreRemote = () => {
  const navigate = useNavigate();

  return (
    <>

      <div className="background-wrapper-r">
        <PingPongBack />
      </div>
      <div className="game-options-container-r">
        <div className="game-options-header-r">
          <h1>GAME OPTIONS</h1>
          <p>TAP ON THE NAME OR AVATAR TO CHANGE IT.</p>
        </div>
      <center>
          <div className="players-container-r">
            <div className="buttona-r">
              <Frame
                  text="Find An Opponent"
                  default_icon='/bottouns/default_offline.svg'
                  hovered_icon='/bottouns/hovered_offline.svg'
                  onClick={() => {navigate('/Matchmaking')}}
              />
            </div>
          </div>
      </center>
      </div>
    </>
  );
};



export default PreRemote;