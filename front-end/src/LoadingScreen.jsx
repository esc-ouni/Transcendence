import React from 'react';
import './LoadingScreen.css'; // Where you placed your spinner CSS

const LoadingScreen = ({ show }) => {
  // Conditionally render the loading screen based on `show`
  if (!show) return null;

  return (
    <div id="loading-screen">
      <div id="loading-spinner"></div>
    </div>
  );
};

export default LoadingScreen;
