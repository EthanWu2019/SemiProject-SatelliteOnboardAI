import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function FunctionalSystem() {
  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.content}>
        <h2 style={styles.heading}>功能系统</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <Link to="/test-eval-system" style={styles.link}>测试评估系统</Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/parallel-twin-system" style={styles.link}>平行孪生系统</Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/algorithm-dev-system" style={styles.link}>算法研发系统</Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/data-vis-system" style={styles.link}>数据可视化系统</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginLeft: '220px',
    padding: '20px',
    position: 'relative',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  content: {
    marginTop: '60px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '15px 0',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: '500',
    padding: '15px 25px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    transition: 'all 0.3s ease',
  },
  linkHover: {
    backgroundColor: '#007bff',
    color: '#ffffff',
  }
};

export default FunctionalSystem;