import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
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
          backgroundColor: '#ffffff',
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
});
