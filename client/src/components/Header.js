import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav container"> 
        <Link to="/" className="logo">
          <img src="/logo.png" className="logo-img" />
        </Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
          ☰
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
        <div className="mobile-nav-links">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;