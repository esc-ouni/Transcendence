
import React from 'react';
import './HistoryCard.css';
function HistoryCard({
  matchId,
  matchData: { player1, player2, Score1, Score2 },
}) {

  return (
    // <div className="match-card background-transparent green-boundary fit-content flex-center">
    //   <div className="players-info ">

    //     <div className="player-block gap-1">
    //       <div className="player-name dark-chocolate up-down-1-border round-10 padding-x-1 font_1">{player1 ? player1: "..."}</div>
    //     </div>

    //     <div className="score-display">{Score1+" - "+Score2}</div>

    //     <div className="player-block gap-1">
    //       <div className="player-name dark-chocolate up-down-1-border round-10 padding-x-1 font_1">{player2 ? player2: "..."}</div>
    //     </div>
    //   </div>
    // </div>
    <></>
  );
}

export default HistoryCard;

