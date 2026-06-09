import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Use 'smooth' for animated scroll
    });
  }, [pathname]); 

  return null; 
}

export default ScrollToTop;