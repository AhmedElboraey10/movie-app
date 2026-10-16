import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard';
import { getNowPlayingMovies } from '../services/tmdbService';

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [term, setTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNowPlayingMovies(currentPage);
        setMovies(data.results || []);
        if (data.total_pages) {
          setTotalPages(Math.min(data.total_pages, 500));
        }
      } catch (err) {
        setError(err.message || 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?query=${encodeURIComponent(term.trim())}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to our movie app</h1>
        <p>Millions of movies, TV shows and people to discover. Explore now.</p>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search and explore...."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Now Playing Grid */}
      <h2 className="section-title">Now Playing</h2>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <p>Loading movies...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              type="button"
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <span style={{ padding: '0 4px', color: '#6b7280' }}>....</span>
            <button
              type="button"
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};
