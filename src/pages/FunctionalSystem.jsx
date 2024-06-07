import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function FunctionalSystem () {
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>功能系统</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ padding: '10px' }}>
            <Link to="/test-eval-system" style={{ color: 'black', textDecoration: 'none' }}>测试评估系统</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/parallel-twin-system" style={{ color: 'black', textDecoration: 'none' }}>平行孪生系统</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/algorithm-dev-system" style={{ color: 'black', textDecoration: 'none' }}>算法研发系统</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/data-vis-system" style={{ color: 'black', textDecoration: 'none' }}>数据可视化系统</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FunctionalSystem;
