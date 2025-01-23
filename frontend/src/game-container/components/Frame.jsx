import { useState } from "react";
import React from "react";
import "./style.css";

export const Frame = ({
    text,
    default_icon,
    hovered_icon,
    onClick,
}) => {

    const [isHovered, setIsHovered] = useState(false);
  
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);  

    const rectangleClass = `rectangle ${isHovered ? "hover" : "default"}`;
    const textClass = `START-GAME property-1-${isHovered ? "hover" : "default"}`;
    const iconSrc = isHovered
      ? hovered_icon
      : default_icon;
  
    return (
      <div
        className={`frame`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <div className="group">
          <div className="overlap-group">
            <div className={rectangleClass} />
            <div className={textClass}>{text}</div>
            <img className="artificial" alt="Artificial" src={iconSrc} />
          </div>
        </div>
      </div>
    );
  };