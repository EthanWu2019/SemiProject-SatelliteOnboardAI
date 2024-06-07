import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function DataVisSystem (){
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>数据可视化系统</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ padding: '10px' }}>
            <Link to="/target-detection" style={{ color: 'black', textDecoration: 'none' }}>目标检测模块</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/cloud-detection" style={{ color: 'black', textDecoration: 'none' }}>云层判别模块</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/image-compression" style={{ color: 'black', textDecoration: 'none' }}>图像压缩模块</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataVisSystem;
