import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/" className="logo">Sushrut Shastri</Link>
        
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
          <Link to="/gallery/wedding" onClick={() => setMenuOpen(false)}>Gallery</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;