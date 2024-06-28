import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

function ParallelTwinSystem() {
  return (
    <div style={styles.container}>
      <BackButton />
      <div style={styles.content}>
        <h2 style={styles.heading}>平行孪生系统</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <Link to="/target-detection" style={styles.link}>目标检测模块</Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/cloud-detection" style={styles.link}>云层判别模块</Link>
          </li>
          <li style={styles.listItem}>
            <Link to="/image-compression" style={styles.link}>图像压缩模块</Link>
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

export default ParallelTwinSystem;