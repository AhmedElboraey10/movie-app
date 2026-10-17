import { createContext, useContext } from 'react';
import { useWatchlist } from './WatchlistContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist();

    return (
        <AppContext.Provider
            value={{
                watchlist,
                toggleWatchlist,
                isInWatchlist,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
