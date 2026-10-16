import { useState } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import { AppContext } from './appContextValue';

export const AppProvider = ({ children }) => {
    const { watchlist, setWatchlist, toggleWatchlist, isInWatchlist } = useWatchlist();
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
