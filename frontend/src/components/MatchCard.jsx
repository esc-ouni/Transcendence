
import React from 'react';
import './MatchCard.css';

function MatchCard({
  matchId,
  matchData: { player1, player2, isReadyP1, isReadyP2 },
  onReady,  
  onStartMatch
}) {
  const bothReady = isReadyP1 && isReadyP2;

  const handleReady = (playerKey) => {
    onReady(matchId, playerKey);
  };

  return (
    <div className="match-card">
      <div className="players-info">

        <div className="player-block">
          <div className="player-name">{player1}</div>
          <button 
            className={isReadyP1 ? 'ready-button' : 'join-button'}
            onClick={() => handleReady('player1')}
          >
            {isReadyP1 ? 'Ready' : 'Join'}
          </button>
        </div>

        <div className="vs">VS</div>

        <div className="player-block">
          <button 
            className={isReadyP2 ? 'ready-button' : 'join-button'}
            onClick={() => handleReady('player2')}
          >
            {isReadyP2 ? 'Ready' : 'Join'}
          </button>
          <div className="player-name">{player2}</div>
        </div>
      </div>

      {bothReady && (
        <button
          className="start-match-button"
          onClick={() => onStartMatch(matchId)}
        >
          Start Match
        </button>
      )}
    </div>
  );
}

export default MatchCard;

