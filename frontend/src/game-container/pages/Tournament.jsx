
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



  const rounds = [
    {
      title: 'Semi Finals',
      seeds: [
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [
            { name: Matches.Semi_Final_1?.player1 || 'TBD' },
            { name: Matches.Semi_Final_1?.player2 || 'TBD' },
          ],
        },
        {
          id: 2,
          date: new Date().toDateString(),
          teams: [
            { name: Matches.Semi_Final_2?.player1 || 'TBD' },
            { name: Matches.Semi_Final_2?.player2 || 'TBD' },
          ],
        },
      ],
    },
    {
      title: 'Final',
      seeds: [
        {
          id: 3,
          date: new Date().toDateString(),
          teams: [
            { name: Matches.Final?.player1 || 'TBD' },
            { name: Matches.Final?.player2 || 'TBD' },
          ],
        },
      ],
    },
  ];
  
  /////

  return (
    <>
<<<<<<< HEAD
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
=======
      <div className="background-wrapper-r">
        <PingPongBack />
      </div>
      <div className="center width-full">
        <div className="tournament-container width-90">


          <div className='team width-full min-height-40'>
              <div className='ultra-space-between'>
                  <center>
                    <Bracket rounds={rounds} />
                  </center>
              </div>
          </div>



          <div className="team width-full tournament-statics min-height-35">
            {/* For each match, render a card */}
            <div className='Stocker'>
              {
                // #region HistoryCard
              }
              {/* For each match, render a card */}
              <h1 className='White' >MATCHES HISTORY</h1>
              {Matches_history.Semi_Final_1.winner ? <HistoryCard 
                matchId="Semi_Final_1"
                matchData={Matches_history.Semi_Final_1}
                /> :<></>}
              {Matches_history.Semi_Final_2.winner ? <HistoryCard 
                matchId="Semi_Final_2"
                matchData={Matches_history.Semi_Final_2}
                /> :<></>}
              {Matches_history.Final.winner ? <HistoryCard 
                matchId="Final"
                matchData={Matches_history.Final}
                /> :<></>}
            </div>
            <div className="vertical-line"></div>
            {
              // #region  MatchCard 
            }
            <div className='Stocker'>
              <h1 className='White'>MATCHES QUEUE</h1>
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
          </div>
        </div>
>>>>>>> a42b1265... Tournament
      </div>
    </>
  );
}

export default Tournament;
















// {/* semi final 1*/}
//   {/* <div className='Challenger'>
//     <div className='White center-column'>
//       <p>{Matches['Semi_Final_1'].player1}</p>
//       <div className='border-1-white width-full'></div>
//       <p>{Matches['Semi_Final_1'].player2}</p>
//     </div>
//     </div>
//     <div className='Challenger'>
//     <div className='White center-column'>
//     <p>{Matches['Final'].player1 ? Matches['Final'].player1: "..."}</p>
//     <div className='border-1-white width-full'></div>
//     <p>{Matches['Final'].player2 ? Matches['Final'].player2: "..."}</p>
//     <h3 className='yellow'>FINALS <span className='red'>[khaliha Wla lah]</span></h3>
//     </div>
//     </div>
//     <div className='Challenger'>
//     <div className='White center-column'>
//     <p>{Matches['Semi_Final_2'].player1}</p>
//     <div className='border-1-white width-full'></div>
//       <p>{Matches['Semi_Final_2'].player2}</p>
//       </div>
//     </div> */}