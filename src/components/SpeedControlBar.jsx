import React, { useState } from 'react';
import './SpeedControlBar.css';

const SpeedControlBar = ({ timeScale, setTimeScale }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`speed-control-bar ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="control-label">时间流速</div>
      {isHovered && (
        <div className="control">
          <label>{timeScale}</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
          />
        </div>
      )}
    </div>
  );
};

export default SpeedControlBar;
