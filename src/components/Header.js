/*This is Header.js*/
import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="logo">FitTrack</h1>
      <div className="header-buttons">
        <button>Login</button>
        <button>Account Settings</button>
      </div>
    </header>
  );
}

export default Header;
