
import React, { useState } from 'react';
import './style.css'
import MatchCard from '../components/MatchCard';
import { useNavigate } from 'react-router-dom';


function Tournament({ src }) {
  const navigate = useNavigate();

  const storedPlayers = localStorage.getItem('tournamentPlayers');
  const players = storedPlayers ? JSON.parse(storedPlayers) : null;
  
  const [Matches, setMatches] = useState(
    {
      "Semi_Final_1": { "player1": players.p1, "player2": players.p2, "winner": null, "isReadyP1": false, "isReadyP2": false, "thier_Turn": true },
      "Semi_Final_2": { "player1": players.p3, "player2": players.p3, "winner": null, "isReadyP3": false, "isReadyP4": false, "thier_Turn": false },
      "Final"       : { "player1": null      , "player2": null      , "winner": null, "isReadyF1": false, "isReadyF2": false, "thier_Turn": false }
    })

  const handleReady = (matchId, whichPlayer) => {
    setMatches((prev) => {
      const newMatch = { ...prev[matchId] };
      if (whichPlayer === 'player1') {
        newMatch.isReadyP1 = !newMatch.isReadyP1;
      } else {
        newMatch.isReadyP2 = !newMatch.isReadyP2;
      }
      return {
        ...prev,
        [matchId]: newMatch,
      };
    });
  };

  const handleStartMatch = (matchId) => {
    console.log(`Starting match: ${matchId}`);
    navigate('/Localgame');
  };

  

  localStorage.setItem('Matches_data', JSON.stringify(Matches));


  return (
    <>
      <div className="tournament-container">
        {/* For each match, render a card */}
        <MatchCard 
          matchId="Semi_Final_1"
          matchData={Matches.Semi_Final_1}
          onReady={handleReady}
          onStartMatch={handleStartMatch}
        />
        <MatchCard 
          matchId="Semi_Final_2"
          matchData={Matches.Semi_Final_2}
          onReady={handleReady}
          onStartMatch={handleStartMatch}
        />
        <MatchCard 
          matchId="Final"
          matchData={Matches.Final}
          onReady={handleReady}
          onStartMatch={handleStartMatch}
        />
      </div>
    </>
  );
}

export default Tournament;


