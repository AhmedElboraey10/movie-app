import React, { createContext, useContext, useState } from 'react';
import { useWatchlist } from './WatchlistContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { watchlist, setWatchlist, toggleWatchlist, isInWatchlist } =
    useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');

  const isFavorite = (movieId) => {
    return isInWatchlist ? isInWatchlist(movieId) : false;
  };

  return (
    <AppContext.Provider
      value={{
        watchlist,
        wishlist: watchlist, // Safe alias
        setWatchlist,
        toggleWatchlist,
        toggleWishlist: toggleWatchlist, // Safe alias
        isFavorite,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
