// MatchContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1) Create the context
const MatchContext = createContext(null);

// 2) Create a provider
export function MatchProvider({ children }) {
  const [matchData, setMatchData] = useState({
    roomName: null,
    myId: null,
    opponentId: null,
  });

  return (
    <MatchContext.Provider value={{ matchData, setMatchData }}>
      {children}
    </MatchContext.Provider>
  );
}

// 3) Custom hook for convenience
export function useMatchContext() {
  return useContext(MatchContext);
}





///
// import React, { createContext, useContext } from 'react';
// import { useWebSocket } from './useWebSocket';

// const WebSocketContext = createContext(null);

// export const WebSocketProvider = ({ children, url }) => {
//   const webSocketValue = useWebSocket(url);

//   return (
//     <WebSocketContext.Provider value={webSocketValue}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocketContext = () => {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocketContext must be used within a WebSocketProvider');
//   }
//   return context;
// };