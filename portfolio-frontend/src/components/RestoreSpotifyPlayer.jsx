import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useSpotify } from '../context/SpotifyContext';

const RestoreSpotifyPlayer = () => {
  const { isVisible, handleToggleVisibility, isFullPlayer } = useSpotify();

  const handleClick = () => {
    handleToggleVisibility();
    setTimeout(() => {
      const playerElement = document.querySelector('.spotify-player');
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  if (isVisible) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Show Music Player">
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'background.paper',
            },
          }}
        >
          <HeadphonesIcon color="primary" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RestoreSpotifyPlayer;