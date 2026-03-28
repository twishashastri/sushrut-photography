import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>Sushrut Shastri</h3>
            <p>Edmonton-based photographer capturing life's most precious moments with artistry and passion.</p>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Edmonton, Alberta</p>
            <p>sushrutshastriphotography@gmail.com</p>
            <p>(780) 893-5919</p>
          </div>
          <div>
            <h3>Services</h3>
            <p>Wedding Photography</p>
            <p>Portrait Sessions</p>
            <p>Commercial Work</p>
            <p>Family Photography</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {currentYear} Sushrut Shastri Photography. Serving Edmonton & Alberta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;