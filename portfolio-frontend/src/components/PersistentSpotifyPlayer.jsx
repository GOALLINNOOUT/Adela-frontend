import React from 'react';
import { useLocation } from 'react-router-dom';
import SpotifyPlaylist from './SpotifyPlaylist';

const PersistentSpotifyPlayer = () => {
  const location = useLocation();
  
  
  const hidePlayerOnRoutes = ['/adels'];
  
  if (hidePlayerOnRoutes.includes(location.pathname)) {
    return null;
  }

  return <SpotifyPlaylist />;
};

export default PersistentSpotifyPlayer;
