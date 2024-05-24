import React from 'react';
import BackButton from '../components/BackButton';

function CloudDetection () {
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>云层判别模块</h2>
        <p>这里是云层判别模块的内容。</p>
      </div>
    </div>
  );
};

export default CloudDetection;
