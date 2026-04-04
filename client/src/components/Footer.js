import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>Sushrut Shastri</h3>
            <p>Edmonton-based photographer capturing life's most precious moments with artistry and passion.</p>
            <h3>Follow Me</h3>
            <a 
                href="https://www.instagram.com/sushrutshastriphotography/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#ecdcdcff', margin:'5px' }}
              > 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="26" height="26" fill="currentColor">
                  <path d="M224.1 141c-63.6 0-115 51.4-115 115s51.4 115 115 115 115-51.4 115-115-51.4-115-115-115zm0 190c-41.6 0-75-33.4-75-75s33.4-75 75-75 75 33.4 75 75-33.4 75-75 75zm146.4-194.1c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.7-9.9-67.3-36.1-93.5s-57.8-34.4-93.5-36.1c-36.9-2.1-147.6-2.1-184.5 0-35.7 1.7-67.3 9.9-93.5 36.1S2.3 128.8.6 164.5c-2.1 36.9-2.1 147.6 0 184.5 1.7 35.7 9.9 67.3 36.1 93.5s57.8 34.4 93.5 36.1c36.9 2.1 147.6 2.1 184.5 0 35.7-1.7 67.3-9.9 93.5-36.1s34.4-57.8 36.1-93.5c2.1-36.9 2.1-147.5 0-184.4zm-48.1 224c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.9 9s-103.5 2.6-132.9-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.9s-2.6-103.5 9-132.9c7.8-19.6 22.9-34.7 42.5-42.5 29.4-11.7 99.2-9 132.9-9s103.5-2.6 132.9 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.9s2.7 103.5-9 132.9z"/>
                </svg>
            </a>
            <a 
                href="https://www.facebook.com/people/Sushrut-Shastri-Photography/61580716311894/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#fff' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="26" height="26" fill="currentColor">
                  <path d="M279.14 288l14.22-92.66h-88.91V127.57c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.36 0 225.36 0c-73.22 0-121.14 44.38-121.14 124.72v70.62H22.89V288h81.33v224h100.2V288z"/>
                </svg>
            </a>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Edmonton, Alberta</p>
            <p>sushrutshastriphotography@gmail.com</p>
            <p>(780) 893-5919</p>
          </div>
          <div>
            <h3>Services</h3>
            <p>Wedding Photography  ||  Portrait Sessions </p>
            <p>Commercial Work  ||  Family Photography</p>
          </div>
        </div>
        <div className="copyright">
          <p>© {currentYear} Sushrut Shastri Photography. Serving Edmonton & Alberta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;