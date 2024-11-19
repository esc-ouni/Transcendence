import React, { useState } from 'react';
import axios from 'axios';

function Matchmaking() {
    const [roomName, setRoomName] = useState('');
    const [alias, setAlias] = useState('');
    const [waiting, setWaiting] = useState(false);

    const handleMatchmaking = async () => {
        try {
            const response = await axios.post('http://localhost:8000/matchmaking/', { alias });
            if (response.data.room_name) {
                setRoomName(response.data.room_name);
                establishWebSocketConnection(roomName);
            } else {
                setWaiting(true);
            }
        } catch (error) {
            console.error("Error during matchmaking:", error);
        }
    };

    const establishWebSocketConnection = (room_name) => {
        console.log("Front-End room name:", room_name)
        const socket = new WebSocket('ws://localhost:8000/ws/game/room1/');
        socket.onopen = function() {
            console.log("Player:", alias, "Socket Connected (ws)!");
        };
        socket.onerror = function(error) {
            console.error("WebSocket Error: ", error);
        };
        socket.onclose = function(event) {
            console.log("WebSocket Closed: ", event);
        };
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log("Message received:", data.message);
        };
    };

    return (
        <div>
            <input 
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter your alias"
            />
            <button onClick={handleMatchmaking}>Play Now</button>
            {waiting && <p>Waiting for another player...</p>}
        </div>
    );
}

export default Matchmaking;




// LOADIN CSS
// /* HTML: <div class="loader"></div> */
// .loader {
//     width: fit-content;
//     font-weight: bold;
//     font-family: monospace;
//     font-size: 30px;
//     background: radial-gradient(circle closest-side,#000 94%,#0000) right/calc(200% - 1em) 100%;
//     animation: l24 1s infinite alternate linear;
//   }
//   .loader::before {
//     content: "Loading...";
//     line-height: 1em;
//     color: #0000;
//     background: inherit;
//     background-image: radial-gradient(circle closest-side,#fff 94%,#000);
//     -webkit-background-clip:text;
//             background-clip:text;
//   }
  
//   @keyframes l24{
//     100%{background-position: left}
//   }


// P2
// /* HTML: <div class="loader"></div> */
// .loader {
//     --s: 25px;
    
//     --_d: calc(0.353*var(--s));
//     width: calc(var(--s) + var(--_d));
//     aspect-ratio: 1;
//     display: grid;
//   }
//   .loader:before,
//   .loader:after {
//     content:"";
//     clip-path:polygon(var(--_d) 0,100% 0,100% calc(100% - var(--_d)),calc(100% - var(--_d)) 100%,0 100%,0 var(--_d));
//     background:
//       conic-gradient(from -90deg at var(--s) var(--_d),
//        #fff 135deg,#666 0 270deg,#aaa 0);
//     animation: l4 1.2s infinite;
//   }
//   .loader:before {
//     z-index: 1;
//     margin-bottom: calc(var(--_d)/-2 - 1px);
//   }
//   .loader:after {
//     margin-top: calc(var(--_d)/-2 - 1px);
//     animation-delay: 0.6s
//   }
//   @keyframes l4{
//     0%     {transform: translate(0)}
//     16.67% {transform: translate(-10px)}
//     33.33% {transform: translate(10px)}
//     50%,
//     100%   {transform: translate(0)}
//   }

// P3
// /* HTML: <div class="loader"></div> */
// .loader {
//     width: 20px;
//     aspect-ratio: 1;
//     border-radius: 50%;
//     background: #000;
//     box-shadow: 0 0 0 0 #0004;
//     animation: l2 1.5s infinite linear;
//     position: relative;
//   }
//   .loader:before,
//   .loader:after {
//     content: "";
//     position: absolute;
//     inset: 0;
//     border-radius: inherit;
//     box-shadow: 0 0 0 0 #0004;
//     animation: inherit;
//     animation-delay: -0.5s;
//   }
//   .loader:after {
//     animation-delay: -1s;
//   }
//   @keyframes l2 {
//       100% {box-shadow: 0 0 0 40px #0000}
//   }


// P4
// /* HTML: <div class="loader"></div> */
// .loader {
//     width: 50px;
//     aspect-ratio: 1;
//     display: grid;
//   }
//   .loader:before,
//   .loader:after {
//     content: "";
//     grid-area: 1/1;
//     margin: 0 0 15px 15px;
//     --c:#0000 calc(100%/3),#046D8B 0 calc(2*100%/3),#0000 0;
//     --c1:linear-gradient(90deg,var(--c));
//     --c2:linear-gradient( 0deg,var(--c));
//     background: var(--c1),var(--c2),var(--c1),var(--c2);
//     background-size: 300% 4px,4px 300%;
//     background-repeat: no-repeat;
//     animation: l12 1s infinite linear;
//   }
//   .loader:after {
//     margin: 15px 15px 0 0;
//     transform: scale(-1,-1);
//   }
//   @keyframes l12 {
//     0%   {background-position: 50%  0,100% 100%,0    100%,0 0}
//     25%  {background-position: 0    0,100% 50% ,0    100%,0 0}
//     50%  {background-position: 0    0,100% 0   ,50%  100%,0 0}
//     75%  {background-position: 0    0,100% 0   ,100% 100%,0 50%}
//    75.01%{background-position: 100% 0,100% 0   ,100% 100%,0 50%}
//     100% {background-position: 50%  0,100% 0   ,100% 100%,0 100%}
//   }