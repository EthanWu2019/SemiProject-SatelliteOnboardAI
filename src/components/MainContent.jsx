import React from 'react';
import globeImage from '../assets/globe.jpg'; // Ensure you have the image in the assets folder

function MainContent() {
  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <img src={globeImage} alt="Globe" style={{ width: '100%' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '24px' }}>
        星载智能算法平台
      </div>
    </div>
  );
};

export default MainContent;
