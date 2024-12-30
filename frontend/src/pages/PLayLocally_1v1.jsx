import React from "react";
import PlayerCard from "../components/PlayerCard";
import "./GameOptions.css"; // any extra styling
import PingPongBack from "../components/PingPongBack";
import { Frame } from "../components/Frame";
import { Navigate } from "react-router-dom";

export default function PlayLocally_1v1() {
  const handleNameChangePlayer1 = (newName) => {
    console.log("Player 1 name changed to:", newName);
  };

  const handleNameChangePlayer2 = (newName) => {
    console.log("Player 2 name changed to:", newName);
  };

  const handleAvatarClickPlayer1 = () => {
    // e.g. open a modal to pick an avatar
    alert("Change avatar for Player 1");
  };

  const handleAvatarClickPlayer2 = () => {
    // e.g. open a modal to pick an avatar
    alert("Change avatar for Player 2");
  };

  return (
    <>
        <PingPongBack/>
        <div className="game-options-container">
            <h2>GAME OPTIONS</h2>
            <p>Tap on the name or avatar to change it.</p>

            <div className="cards-row">
                <PlayerCard
                playerLabel="PLAYER 1"
                defaultName=""
                defaultAvatar="/bottouns/omar.jpg"
                onNameChange={handleNameChangePlayer1}
                onAvatarClick={handleAvatarClickPlayer1}
                />

                <PlayerCard
                playerLabel="PLAYER 2"
                defaultName=""
                defaultAvatar="/bottouns/le7ya.jpg"
                onNameChange={handleNameChangePlayer2}
                onAvatarClick={handleAvatarClickPlayer2}
                />
            </div>
        </div>
        <div className="yy">
            <Frame
                text="Launch Game"
                default_icon='/bottouns/default_offline.svg'
                hovered_icon='/bottouns/hovered_offline.svg'
                onClick={() => {Navigate('/LocalGame')}}
                // onClick={() => {alert('Hello !')}}
            />
        </div>
    </>
  );
}
