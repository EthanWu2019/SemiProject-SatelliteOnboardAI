import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function Admin_Dashboard() {
  return (
    <div style={{ marginLeft: '220px', padding: '20px', position: 'relative' }}>
      <BackButton />
      <div style={{ marginTop: '60px' }}>
        <h2>管理员管理界面</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ padding: '10px' }}>
            <Link to="/user-management" style={{ color: 'black', textDecoration: 'none' }}>用户管理</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/system-settings" style={{ color: 'black', textDecoration: 'none' }}>系统设置</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/logs" style={{ color: 'black', textDecoration: 'none' }}>日志查看</Link>
          </li>
          <li style={{ padding: '10px' }}>
            <Link to="/reports" style={{ color: 'black', textDecoration: 'none' }}>报告生成</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Admin_Dashboard;
