import React, { createContext, useContext, useState, useEffect } from 'react';

const SpotifyContext = createContext();

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export const PLAYLISTS = [
  {
    id: '4GzvGGsHfbhLab2N4RXlht',
    title: 'Calm Mix (favorite)'
  },
  {
    id: '7hZIabttxmuubhEQ8jlwsK',
    title: 'UK Rap Mix'
  },
  {
    id: '1eglTMP2WZ9Bm01N0Ej5JN',
    title: 'Spirit Mix'
  },
  {
    id: '4Det5w0O27aJ6kkW2d5Fn0',
    title: 'Golden Oldies'
  },
  {
    id: '5FaxSNBgKHyUGz1h6KYEIc',
    title: 'Energy Boost'
  }
];

export const SpotifyProvider = ({ children }) => {
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(PLAYLISTS[0]);

  useEffect(() => {
    const savedVisibility = localStorage.getItem('spotifyPlayerVisible');
    if (savedVisibility !== null) {
      setIsVisible(JSON.parse(savedVisibility));
    }

    const savedPlayerState = localStorage.getItem('spotifyPlayerState');
    if (savedPlayerState !== null) {
      const { mini, playlistId } = JSON.parse(savedPlayerState);
      setIsMiniPlayer(mini);
      if (playlistId) {
        const playlist = PLAYLISTS.find(p => p.id === playlistId) || PLAYLISTS[0];
        setSelectedPlaylist(playlist);
      }
    }
  }, []);

  const handleMinimize = () => {
    setIsMiniPlayer(true);
    savePlayerState(true);
  };

  const handleMaximize = () => {
    setIsMiniPlayer(false);
    savePlayerState(false);
  };

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('spotifyPlayerVisible', JSON.stringify(newVisibility));
  };

  const handlePlaylistChange = (playlist) => {
    setSelectedPlaylist(playlist);
    savePlayerState(isMiniPlayer);
  };

  const savePlayerState = (mini) => {
    localStorage.setItem('spotifyPlayerState', JSON.stringify({
      mini,
      playlistId: selectedPlaylist.id
    }));
  };

  const value = {
    isFullPlayer,
    setIsFullPlayer,
    isMiniPlayer,
    setIsMiniPlayer,
    isVisible,
    setIsVisible,
    handleToggleVisibility,
    selectedPlaylist,
    handlePlaylistChange,
    handleMinimize,
    handleMaximize,
    playlists: PLAYLISTS,
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};

export default SpotifyContext;