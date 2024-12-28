// components/GameHUD.jsx
import React from 'react';

export default function GameHUD() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: '#fff'
      }}
    >
      <p>Score: 100</p>
      <p>Time: 1:23</p>
      {/* etc. */}
    </div>
  );
}
