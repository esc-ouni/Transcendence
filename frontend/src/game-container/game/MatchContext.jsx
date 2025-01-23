// MatchContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { color } from 'three/webgpu';

// 1) Create the context
const MatchContext = createContext(null);

// 2) Create a provider
export function MatchProvider({ children }) {
  const [matchData, setMatchData] = useState({
    roomName: null,
    myId: null,
    opponentId: null,
    color: ''
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

