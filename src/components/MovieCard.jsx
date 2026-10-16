import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const MovieCard = ({ movie, isHorizontal }) => {
  const { toggleWatchlist, isFavorite } = useApp();
  const fav = isFavorite ? isFavorite(movie.id) : false;
  const fallbackPoster =
    'https://placehold.co/300x450/e5e7eb/6b7280?text=No+Poster';

  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster || fallbackPoster;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formattedDate = formatDate(movie.release_date || movie.releaseDate);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleWatchlist) {
      toggleWatchlist(movie);
    }
  };

  
  if (isHorizontal) {
    return (
      <div
        style={{
          display: 'flex',
          backgroundColor: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          height: '220px',
        }}
      >
        <Link to={`/movie/${movie.id}`} style={{ width: '160px', flexShrink: 0 }}>
          <img
            src={posterSrc}
            alt={movie.title || 'Movie Poster'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackPoster;
            }}
          />
        </Link>

        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: '#111' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                {movie.title}
              </h3>
            </Link>

            <button
              type="button"
              onClick={handleHeartClick}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? '#FEE135' : '#D1D5DB'}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          <span style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
            {formattedDate}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ color: '#111', fontSize: '15px' }}>★ ★ ★ ★ ☆</span>
            <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
              {movie.vote_count || '9288'}
            </span>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: '#374151',
              margin: 0,
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.overview || 'No description available for this movie.'}
          </p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="poster-link">
        <div className="poster-container">
          <img
            src={posterSrc}
            alt={movie.title || 'Movie Poster'}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackPoster;
            }}
          />
          <button
            type="button"
            className="more-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            •••
          </button>
        </div>
      </Link>

      <div className="card-info">
        <Link to={`/movie/${movie.id}`} className="movie-title-link">
          <h3 className="movie-title" title={movie.title}>
            {movie.title}
          </h3>
        </Link>
        <div className="card-bottom-row">
          <span className="release-date">{formattedDate}</span>
          <button
            type="button"
            className={`heart-toggle-btn ${fav ? 'active' : ''}`}
            onClick={handleHeartClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? '#FEE135' : 'none'} stroke={fav ? '#FEE135' : '#6B7280'} strokeWidth="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};