import React from 'react';

const scoreboardStyle = {
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '10px 20px',
  fontSize: '20px',
  borderRadius: '5px',
  fontFamily: 'Arial, sans-serif',
  zIndex: 100
};

export default function Scoreboard({ player1, playerScore, player2, aiScore }) {
  return (
    <div style={scoreboardStyle}>
      {`${player1}: ${playerScore} - ${player2}: ${aiScore}`}
    </div>
  );
}
