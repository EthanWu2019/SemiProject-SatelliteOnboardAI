import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={headerStyles.header}>
      <h1 style={headerStyles.h1}>
        <Link to="/" style={headerStyles.link}>极光计算机</Link>
      </h1>
    </header>
  );
};

const headerStyles = {
  header: {
    backgroundColor: '#003366',
    padding: '10px',
    color: 'white',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  h1: {
    margin: 0,
    paddingLeft: '0px', // 确保标题不会与导航栏重叠
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default Header;
