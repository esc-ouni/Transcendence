import React, { useState } from "react";
import "./PlayerCard.css";

export default function PlayerCard({
  playerLabel = "PLAYER 1",
  defaultName = "",
  defaultAvatar = "/bottouns/omar.jpg",
  onNameChange = () => {},
  onAvatarClick = () => {}
}) {
  // State for the player's name
  const [playerName, setPlayerName] = useState(defaultName);

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
    onNameChange(e.target.value);
  };

  return (
    <div className="player-card">
      {/* Label: e.g., "PLAYER 1" */}
      <div className="player-label">{playerLabel}</div>

      {/* Name input */}
      <input
        className="player-name"
        type="text"
        value={playerName}
        onChange={handleNameChange}
        placeholder="Enter your name"
      />

      {/* Avatar */}
      <div className="avatar-wrapper" onClick={onAvatarClick}>
        <img className="avatar-img" src={defaultAvatar} />
      </div>
    </div>
  );
}
