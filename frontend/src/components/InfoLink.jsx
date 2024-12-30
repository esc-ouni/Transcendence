import React from 'react';
import './InfoLink.css'; // Where we'll put the styling

export default function InfoLink() {
  return (
    <div className="info-container">
      <img
        className="info-icon"
        src="/bottouns/info.png"
        alt="information icon"
        onClick={() => {alert('Dserti 3lya ajmii !')}}
      />
      <span className="info-text">More information</span>
    </div>
  );
}
