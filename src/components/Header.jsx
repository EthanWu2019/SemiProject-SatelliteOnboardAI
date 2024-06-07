import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="h1">
        <Link to="/" className="link">极光计算机</Link>
      </h1>
    </header>
  );
}

export default Header;
