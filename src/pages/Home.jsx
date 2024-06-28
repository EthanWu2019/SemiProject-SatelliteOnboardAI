import React, { useState } from 'react';
import './Home.css'; // 导入CSS文件
import Header from '../components/Header';
import Nav from '../components/Nav';
import satelliteImage from '../images/satellite.jpg';
import UnityComponent from '../components/UnityComponent';
import NewGlobe from '../components/NewGlobe';
import SpeedControlBar from '../components/SpeedControlBar';

function Home() {
  const [timeScale, setTimeScale] = useState(0.4);

  return (
    <>
      <div className="home-container">
        <div className="Globe-container">
          <NewGlobe timeScale={timeScale} />
        </div>
        <div className="home-overlay">
          <h1>星载智能算法平台</h1>
          <div className="home-sections">
          </div>
        </div>
        <SpeedControlBar
          className="speed-control-bar"
          timeScale={timeScale}
          setTimeScale={setTimeScale}
        />
      </div>
    </>
  );
}

export default Home;
