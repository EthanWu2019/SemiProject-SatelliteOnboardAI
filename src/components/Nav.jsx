import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; // 导入CSS文件


function Nav() {
  return (
    <nav className="nav">
      <ul className="nav-ul">
        <li className="nav-li">
          <Link to="/product-intro" className="nav-link">产品介绍</Link>
        </li>
        <li className="nav-li">
          <Link to="/workflow" className="nav-link">工作流程</Link>
        </li>
        <li className="nav-li">
          <Link to="/functional-system" className="nav-link">功能系统</Link>
        </li>
        <li className="nav-li">
          <Link to="/other" className="nav-link">其他信息</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;