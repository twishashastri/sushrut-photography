import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [menuOpen]);

  // Close menu on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.svg" className="logo-img" alt="Sushrut Shastri Photography" />
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
          <Link to="/events" className={isActive('/events')}>Events</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>
        </div>
        
        {/* Hamburger Button - Only visible when menu is closed */}
        {!menuOpen && (
          <button 
            className="mobile-menu-btn" 
            onClick={toggleMenu}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {/* Close Button - Inside the menu, top right */}
        <button 
          className="close-btn" 
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ✕
        </button>
        <div className="mobile-nav-links">
          <Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link>
          <Link to="/gallery" className={isActive('/gallery')} onClick={closeMenu}>Gallery</Link>
          <Link to="/events" className={isActive('/events')} onClick={closeMenu}>Events</Link>
          <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>Contact</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;