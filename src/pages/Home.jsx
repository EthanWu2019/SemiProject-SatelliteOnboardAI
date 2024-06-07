import React from 'react';
import globeImage from '../assets/globe.jpg'; // 确保你有这张图片在assets文件夹中
import './Home.css'; // 导入CSS文件

function Home() {
  return (
    <div className="home-container">
      <img src={globeImage} alt="Globe" className="home-image" />
      <div className="home-overlay">
        <h1>星载智能算法平台</h1>
        <p>推动未来科技，智能连接世界</p>
        <div className="home-sections">
          <div className="home-section">
            <h2>核心功能</h2>
            <ul>
              <li>测试评估系统</li>
              <li>平行孪生系统</li>
              <li>算法研发系统</li>
              <li>数据可视化系统</li>
            </ul>
          </div>
          <div className="home-section">
            <h2>平台优势</h2>
            <ul>
              <li>高效计算</li>
              <li>实时数据处理</li>
              <li>灵活扩展</li>
              <li>可靠安全</li>
            </ul>
          </div>
          <div className="home-section">
            <h2>联系我们</h2>
            <p>如有任何问题，欢迎联系我们：</p>
            <ul>
              <li>电话：400-123-4567</li>
              <li>邮箱：support@auroratech.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
