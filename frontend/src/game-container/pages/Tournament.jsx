
import React, { useEffect, useState } from 'react';
import './style.css'
import '../help_css/help.css'
import MatchCard from '../components/MatchCard';
import { useNavigate } from 'react-router-dom';
import PingPongBack from "../components/PingPongBack";
import '../help_css/tournament.css'
import HistoryCard from '../components/HistoryCard';
import { Bracket } from 'react-brackets';

function Tournament({ src }) {
  const navigate = useNavigate();

  const storedPlayers = localStorage.getItem('tournamentPlayers');
  const players = storedPlayers ? JSON.parse(storedPlayers) : null;
  const [reload , setReload] = useState(0)
  const [Matches, setMatches] = useState( {
    "Semi_Final_1": { "player1": "PL1", "player2": "PL2", "winner": null, "isReadyP1": false, "isReadyP2": false, "thier_Turn": false },
    "Semi_Final_2": { "player1": "PL3", "player2": "PL4", "winner": null, "isReadyP3": false, "isReadyP4": false, "thier_Turn": false },
    "Final"       : { "player1": null      , "player2": null      , "winner": null, "isReadyF1": false, "isReadyF2": false, "thier_Turn": false }
  })

  // this must be seted somehow base idea will be using local storage
  const [Matches_history, setMatches_history] = useState( {
    "Semi_Final_1": { "player1": "PL1", "player2": "PL2", "Score1": 0, "Score2": 0, "winner": null },
    "Semi_Final_2": { "player1": "PL3", "player2": "PL4", "Score1": 0, "Score2": 0, "winner": null},
    "Final"       : { "player1": null      , "player2": null      , "Score1": 0, "Score2": 0, "winner": null }
  })

  const [rounds, setRounds] = useState([
      {
        title: 'Semi Finals',
        seeds: [
          {
            id: 1,
            date: new Date().toDateString(),
            teams: [
              { name: 'TBD' },
              { name: 'TBD' },
            ],
          },
          {
            id: 2,
            date: new Date().toDateString(),
            teams: [
              { name: 'TBD' },
              { name: 'TBD' },
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
              { name: 'TBD' },
              { name: 'TBD' },
            ],
          },
        ],
      },
    ])
  
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
    // #region Start the match with the given matchId
    console.log(`Starting match: ${matchId}`);
    // localStorage.setItem("localGameType", "tournament");
    localStorage.setItem("matchId", matchId);
    navigate('/Game/Localgame');
  };

  // #region Get our LocalStorage item if it exists
  useEffect(() => {
    // in case where we ? have empty info
    // console.lo
    setReload(reload+1)
    console.log(reload)
    if (!storedPlayers || !players)
    {
        // if we don't have players data, we should go back to the PreTournament page
        navigate("/PreTournament")
    }
    else
    {
      // const 
      const matches = {
        "Semi_Final_1": { "player1": players.p1, "player2": players.p2, "winner": null, "isReadyP1": false, "isReadyP2": false, "thier_Turn": false },
        "Semi_Final_2": { "player1": players.p3, "player2": players.p4, "winner": null, "isReadyP3": false, "isReadyP4": false, "thier_Turn": false },
        "Final"       : { "player1": null      , "player2": null      , "winner": null, "isReadyF1": false, "isReadyF2": false, "thier_Turn": false }
      }

      
      const matches_his =  {
        "Semi_Final_1": { "player1": players.p1, "player2": players.p2, "Score1": 0, "Score2": 0, "winner": null },
        "Semi_Final_2": { "player1": players.p3, "player2": players.p4, "Score1": 0, "Score2": 0, "winner": null},
        "Final"       : { "player1": null      , "player2": null      , "Score1": 0, "Score2": 0, "winner": null }
      }
      const data = localStorage.getItem('Matches_data');
      const history = localStorage.getItem('Matches_history');
      if (data) {
        setMatches(JSON.parse(data));
      }
      else
        localStorage.setItem('Matches_data', JSON.stringify(matches));
      if (history) {
        setMatches_history(JSON.parse(history));
      }
      else
        localStorage.setItem('Matches_history', JSON.stringify(matches_his));
      console.log("hmm ", Matches, Matches_history);

      setRounds([
      {
        title: 'Semi Finals',
        seeds: [
          {
            id: 1,
            date: new Date().toDateString(),
            teams: [
              { name: matches.Semi_Final_1?.player1 || 'TBD' },
              { name: matches.Semi_Final_1?.player2 || 'TBD' },
            ],
          },
          {
            id: 2,
            date: new Date().toDateString(),
            teams: [
              { name: matches.Semi_Final_2?.player1 || 'TBD' },
              { name: matches.Semi_Final_2?.player2 || 'TBD' },
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
              { name: matches.Final?.player1 || 'TBD' },
              { name: matches.Final?.player2 || 'TBD' },
            ],
          },
        ],
      },
      ])

      // this must be seted somehow base idea will be using local storage
      setMatches_history(
        matches_his
      )
      
      setMatches(
        matches
      )
    }
  }, []);

  // #region Update our LocalStorage item whenever it changes
  console.log("hmm ", Matches, Matches_history);

  return (
    <>

      {/* <PingPongBack /> */}

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