import React from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  Tooltip, 
  ToggleButton, 
  ToggleButtonGroup,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import CloseIcon from '@mui/icons-material/Close';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useSpotify } from '../context/SpotifyContext';

const SpotifyPlaylist = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    isFullPlayer,
    isMiniPlayer,
    isVisible,
    selectedPlaylist,
    handleMinimize,
    handleMaximize,
    handleToggleVisibility,
    handlePlaylistChange,
    playlists
  } = useSpotify();

  if (!isVisible) {
    return null;
  }

  const playerUrl = `https://open.spotify.com/embed/playlist/${selectedPlaylist.id}?utm_source=generator`;

  const PlayerControls = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 0.5, gap: 0.5 }}>
      {isMiniPlayer ? (
        <Tooltip title="Open Full Player">
          <IconButton size="small" onClick={() => {
            handleMaximize();
            setTimeout(() => {
              const playerElement = document.querySelector('.spotify-player');
              if (playerElement) {
                playerElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 300);
          }} sx={{ color: 'text.secondary' }}>
            <OpenInFullIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Minimize Player">
          <IconButton onClick={handleMinimize} sx={{ color: 'text.secondary' }}>
            
            <CloseFullscreenIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Remove Player">
        <IconButton size={isMiniPlayer ? "small" : "medium"} onClick={handleToggleVisibility} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize={isMiniPlayer ? "small" : "medium"} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const PlaylistSelector = () => (
    <>
      <HeadphonesIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        🎵 My Playlist Collection 🎵
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
        Discover the various soundtracks that fuel my coding sessions and creative moments. Select a playlist that matches your mood!
      </Typography>
      
      <ToggleButtonGroup
        value={selectedPlaylist.id}
        exclusive
        onChange={(e, newValue) => {
          if (newValue !== null) {
            const playlist = playlists.find(p => p.id === newValue);
            handlePlaylistChange(playlist);
          }
        }}
        aria-label="playlist selection"
        sx={{
          mb: 4,
          flexWrap: 'wrap',
          justifyContent: 'center',
          '& .MuiToggleButtonGroup-grouped': {
            m: 0.5,
            border: 1,
            '&:not(:first-of-type)': {
              borderRadius: theme.shape.borderRadius,
            },
            '&:first-of-type': {
              borderRadius: theme.shape.borderRadius,
            },
          },
        }}
      >
        {playlists.map((playlist) => (
          <ToggleButton
            key={playlist.id}
            value={playlist.id}
            aria-label={playlist.title}
            sx={{
              px: 2,
              py: 1,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            {playlist.title}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  );
  return (
    <Box
      className="spotify-player"
      sx={{
        ...(isMiniPlayer ? {
          position: 'fixed',
          bottom: 80,
          right: 0,
          width: '300px',
          height: '120px',
          backgroundColor: 'background.paper',
          boxShadow: 3,
          borderTopLeftRadius: '8px',
          zIndex: 1000,
        } : {
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          p: 2,
          position: 'relative',
        }),
        transition: 'all 0.3s ease',
      }}
    >
      {!isMiniPlayer && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
            textAlign: 'center',
          }}
        >
          <PlaylistSelector />
        </Box>
      )}
      
      <PlayerControls />

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: isMiniPlayer ? '80px' : '352px',
          transition: 'height 0.3s ease',
        }}
      >
        <iframe
          key={selectedPlaylist.id}
          style={{
            borderRadius: isMiniPlayer ? '8px' : '12px',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          src={`${playerUrl}${isMiniPlayer ? '&compact=1' : ''}`}
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </Box>
    </Box>
  );
};

export default SpotifyPlaylist;
