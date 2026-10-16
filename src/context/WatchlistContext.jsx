import { createContext, useState, useContext, useEffect } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (item, mediaType = 'movie') => {
    const itemWithMedia = { ...item, media_type: item.media_type || mediaType };

    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, itemWithMedia];
    });
  };

  const isInWatchlist = (id) => watchlist.some((item) => item.id === id);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        setWatchlist,
        toggleWatchlist,
        isInWatchlist,
        count: watchlist.length,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
