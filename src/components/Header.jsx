import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { watchlist } = useApp();
  const count = watchlist ? watchlist.length : 0;

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">Movie App</Link>
      </div>
      <div className="header-right">
        <Link
          to="/assistant"
          className="assistant-link"
          aria-label="Open Movie Assistant"
        >
          <img
            src="/bot.png"
            alt="Movie assistant"
            className="assistant-header-icon"
          />
        </Link>
        <Link to="/watchlist" className="watchlist-link">
          <svg
            className="watchlist-header-heart"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#000000"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>watchlist</span>
          {count > 0 && <span className="badge">{count}</span>}
        </Link>
      </div>
    </header>
  );
};
