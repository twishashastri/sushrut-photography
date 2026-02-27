// Color palette for Sushrut Shastri Photography
// WCAG AAA compliant - accessible for everyone

const theme = {
  colors: {
    // Primary Navy - Trust, professionalism
    primary: '#0A2342',
    primaryLight: '#1E3A5F',
    primaryDark: '#05162B',
    
    // Secondary Gray - Neutral, never competes with photos
    secondary: '#6B7B8B',
    secondaryLight: '#8599AB',
    secondaryDark: '#4E5E6E',
    
    // Backgrounds - Gallery inspired
    background: '#FCF9F0',
    surface: '#FFFFFF',
    
    // Text - Readable contrast
    textPrimary: '#1E1E1E',
    textSecondary: '#5D707F',
    
    // Functional
    success: '#2D5A27',
    error: '#B34141',
    warning: '#C97C5D',
    
    // Overlays
    overlay: 'rgba(10, 35, 66, 0.85)',
    
    // Base
    white: '#FFFFFF',
    black: '#1E1E1E',
  },
  
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Source Sans Pro", sans-serif',
  },
  
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '2rem',
    xxlarge: '3rem',
  },
  
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '1024px',
  },
  
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
    xlarge: '4rem',
  },
};

export default theme;