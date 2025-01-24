
import React from 'react';
import './MatchCard.css';
import '../help_css/help.css';
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
    <div className="match-card background-transparent green-boundary fit-content flex-center">
      <div className="players-info ">

        <div className="player-block gap-1">
          <div className="player-name dark-chocolate up-down-1-border round-10 padding-x-1 font_1">{player1 ? player1: "..."}</div>
          <button 
            className={isReadyP1 ? ' ready-button navy-blue round-25' : 'join-button round-25'}
            onClick={() => handleReady('player1')}
          >
            {isReadyP1 ? 'Ready' : 'Join'}
          </button>
        </div>

        <div className="vs">VS</div>

        <div className="player-block gap-1">
          <button 
            className={isReadyP2 ? ' ready-button navy-blue round-25 ' : 'join-button round-25'}
            onClick={() => handleReady('player2')}
          >
            {isReadyP2 ? 'Ready' : 'Join'}
          </button>
          <div className="player-name dark-chocolate up-down-1-border round-10 padding-x-1 font_1">{player2 ? player2: "..."}</div>
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

