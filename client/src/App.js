import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      
      <header style={{ 
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.medium,
      }}>
        <div className="container">
          <h1 style={{ color: theme.colors.white }}>
            Sushrut Shastri Photography
          </h1>
        </div>
      </header>

      <main>
        <section style={{ 
          padding: `${theme.spacing.xlarge} 0`,
        }}>
          <div className="container">
            <h2>Capturing Moments That Matter</h2>
            <p>Professional photography portfolio coming soon.</p>
          </div>
        </section>
      </main>

      <footer style={{ 
        backgroundColor: theme.colors.primaryDark,
        color: theme.colors.white,
        padding: theme.spacing.large,
      }}>
        <div className="container">
          <p style={{ color: theme.colors.white }}>
            © 2026 Sushrut Shastri Photography
          </p>
        </div>
      </footer>
    </ThemeProvider>
  );
}

export default App;