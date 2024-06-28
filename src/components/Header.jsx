import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  header: {
    position: 'fixed',
    backgroundColor: '#002244',
    padding: '10px 20px',
    color: 'white',
    height: '60px',
    width: '100%',
    top: '0',
    left: '0',
    zIndex: '1000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  h1: {
    margin: '0',
    fontSize: '24px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    transition: 'all 0.3s ease',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: '40px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    transition: 'all 0.3s ease',
    padding: '5px',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    letterSpacing: '2px',
  },
  navLinkHover: {
    color: '#00ffff',
    textShadow: '0 0 10px #00ffff',
  },
  navLinkBefore: {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '0',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: '-1',
    transition: 'height 0.3s ease',
  },
  navLinkBeforeHover: {
    height: '100%',
  },
  navLinkAfter: {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: '0',
    left: '50%',
    backgroundColor: '#00ffff',
    transition: 'width 0.3s ease, left 0.3s ease',
  },
  navLinkAfterHover: {
    width: '100%',
    left: '0',
  },
};

function Header() {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleSearchClick = () => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.h1}>
        <Link to="/home" style={styles.link}>中科天算智能机</Link>
      </h1>
      <nav style={styles.nav}>
        <Link to="/product-intro" style={styles.navLink}>产品和服务</Link>
        <Link to="/solutions" style={styles.navLink}>解决方案</Link>
        <Link to="/support" style={styles.navLink}>支持</Link>
        <Link to="/learning" style={styles.navLink}>学习</Link>
        <Link to="/other" style={styles.navLink}>了解中科天算智能机</Link>
      </nav>
    </header>
  );
}

export default Header;
