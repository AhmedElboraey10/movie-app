import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MovieCard } from '../components/MovieCard';
import { getMovieDetails, getMovieRecommendations } from '../services/tmdbService';
import './MovieDetails.css';

export const MovieDetails = () => {
  const { id } = useParams();
  const movieId = id || 550; // Fallback to Fight Club if no param

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleWatchlist, isFavorite } = useApp();
  const fav = movie && isFavorite ? isFavorite(movie.id) : false;
  const fallbackPoster = 'https://placehold.co/500x750/f3f4f6/9ca3af?text=No+Poster';

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [movieData, recsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieRecommendations(movieId).catch(() => ({ results: [] })),
        ]);
        setMovie(movieData);
        setRecommendations(recsData.results || []);
      } catch (err) {
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  const renderStars = (voteAverage) => {
    const ratingOutOfFive = voteAverage ? Math.round(voteAverage / 2) : 4;
    return '★'.repeat(ratingOutOfFive) + '☆'.repeat(5 - ratingOutOfFive);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280' }}>
        <p>Loading movie details from TMDB...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444' }}>
        <h2>Error Loading Movie</h2>
        <p>{error || 'Movie not found.'}</p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            backgroundColor: '#fee135',
            color: '#000',
            fontWeight: '600',
            padding: '10px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          Back to home
        </Link>
      </div>
    );
  }

  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : (movie.poster || fallbackPoster);

  const languages = movie.spoken_languages && movie.spoken_languages.length > 0
    ? movie.spoken_languages.map((lang) => lang.english_name || lang.name).join(', ')
    : 'English';

  const voteCount = movie.vote_count || 9288;

  return (
    <div className="container">
      {/* Movie Details Hero matching Figma Image 5 */}
      <div className="movie-details-hero">
        <div className="movie-details-poster-wrap">
          <img
            src={posterSrc}
            alt={movie.title}
            className="movie-details-poster"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackPoster;
            }}
          />
        </div>

        <div className="movie-details-info">
          <div className="movie-details-header">
            <h1 className="movie-details-title">{movie.title}</h1>
            <button
              type="button"
              className={`heart-toggle-btn ${fav ? 'active' : ''}`}
              style={{ fontSize: '1.75rem' }}
              onClick={() => toggleWatchlist(movie)}
              aria-label={fav ? 'Remove from watchlist' : 'Add to watchlist'}
              title={fav ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {fav ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FEE135">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              )}
            </button>
          </div>

          <span className="movie-details-date">{movie.release_date || 'Sep 25, 2017'}</span>

          {/* Large Stars matching Figma */}
          <div className="star-rating-row">
            <span className="stars">{renderStars(movie.vote_average)}</span>
            <span className="vote-number">{voteCount.toLocaleString()}</span>
          </div>

          <p className="movie-details-overview">
            {movie.overview || 'No overview available for this movie.'}
          </p>

          {/* Genre Pills */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="genre-pills">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-pill">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta: Duration and Languages */}
          <div className="meta-row">
            {movie.runtime > 0 && (
              <span>
                <strong>Duration:</strong> {movie.runtime} Min.
              </span>
            )}
            <span>
              <strong>Languages:</strong> {languages}
            </span>
          </div>

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="production-logos">
              {movie.production_companies.map((comp) =>
                comp.logo_path ? (
                  <img
                    key={comp.id}
                    src={`https://image.tmdb.org/t/p/w200${comp.logo_path}`}
                    alt={comp.name}
                    className="production-logo"
                    title={comp.name}
                  />
                ) : (
                  <span key={comp.id} className="production-text">
                    {comp.name}
                  </span>
                )
              )}
            </div>
          )}

          {/* Official Website Button */}
          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="website-btn"
            >
              Website 🔗
            </a>
          )}
        </div>
      </div>

      {/* Break / Divider between Details Hero and Recommendations */}
      <hr className="details-divider" />

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section>
          <h2 className="section-title">Recommendations</h2>
          <div className="movies-grid">
            {recommendations.slice(0, 6).map((rec) => (
              <MovieCard key={rec.id} movie={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetails;
