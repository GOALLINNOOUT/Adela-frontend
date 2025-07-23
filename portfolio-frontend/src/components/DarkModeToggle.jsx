import { Fab, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../context/ThemeContext';
import { useState, useRef, useCallback } from 'react';

function DarkModeToggle({ setShowAdmin }) {
  const theme = useTheme();
  const { toggleColorMode, mode } = useThemeContext();
  const [clickCount, setClickCount] = useState(0);
  const timeoutRef = useRef(null);
  
  const handleClick = useCallback(() => {
   
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 10) {
        setShowAdmin(prev => !prev);
        return 0;
      }
      return newCount;
    });

    
    timeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    toggleColorMode();
  }, [toggleColorMode, setShowAdmin]);

  const fabStyle = {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: mode === 'dark' ? '#132f4c' : '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: mode === 'dark' ? '#1976d2' : '#1565c0',
    }
  };

  return (
    <Fab
      sx={fabStyle}
      onClick={handleClick}
      color="primary"
      aria-label="toggle dark mode"
      title='Toggle Dark Mode '
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </Fab>
  );
}

export default DarkModeToggle;
