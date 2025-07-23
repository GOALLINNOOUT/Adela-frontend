import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});


export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) return savedMode;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#1976d2',
                  light: '#42a5f5',             
          dark: '#1565c0',
            },
            secondary: {
              main: '#fff3e0',
              light: '#fff8e8',
              dark: '#ffe0b2',
            },
            background: {
              default: '#fff3e0',
              paper: '#ffffff',
            },
            text: {
              primary: '#1a237e',
              secondary: '#455a64',
            },
          }
            : {
                primary: {
                  main: '#64b5f6',
                  light: '#90caf9',
                  dark: '#1976d2',
                },
                secondary: {
                  main: '#4a148c',
                  light: '#7c43bd',
                  dark: '#12005e',
                },
                background: {
                  default: '#0a1929',
                  paper: '#132f4c',
                },
                text: {
                  primary: '#f5f5f5',
                  secondary: '#b3e5fc',
                },
              }),
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '3rem',
            fontWeight: 600,
            marginBottom: '1rem',
            '@media (min-width:600px)': {
              fontSize: '3.5rem',
            },
            '@media (min-width:900px)': {
              fontSize: '4rem',
            },
          },
          h2: {
            fontSize: '2.4rem',
            fontWeight: 500,
            marginBottom: '0.8rem',
            '@media (min-width:600px)': {
              fontSize: '2.8rem',
            },
          },
          h3: {
            fontSize: '2rem',
            fontWeight: 500,
            marginBottom: '0.6rem',
            '@media (min-width:600px)': {
              fontSize: '2.4rem',
            },
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
