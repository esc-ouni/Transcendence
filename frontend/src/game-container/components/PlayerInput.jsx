// // components/PlayerInput.jsx
import React, { useState } from 'react';
import './PlayerInput.css';

const PlayerInput = ({ 
    playerId = 1,
    playerName = "",
    avatarSrc = "/path/to/avatar.png",
    position = "left",
    onNameChange
                      }) => {
  const [name, setName] = useState(playerName);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    onNameChange(newName);
  };

  return (
    <div className={`player-panel ${position}`}>
      <div className="player-label">PLAYER {playerId}</div>
         <input
           type="text"
           value={name}
           onChange={handleNameChange}
           className="player-name-input"
           placeholder="Enter name"
           />

      {/* Avatar */}
      <div className="avatar-container">
        <img 
          className="player-avatar" 
          src={avatarSrc} 
          alt={`Player ${playerId} avatar`} 
        />
      </div>
    </div>
  );
};

export default PlayerInput;

