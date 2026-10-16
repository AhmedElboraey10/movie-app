import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard';
import { searchMovies } from '../services/tmdbService';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setInputVal(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query, currentPage);
        setResults(data.results || []);
        if (data.total_pages) {
          setTotalPages(Math.min(data.total_pages, 500));
        }
      } catch (err) {
        setError(err.message || 'Failed to search movies');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setCurrentPage(1);
      setSearchParams({ query: inputVal.trim() });
    } else {
      navigate('/');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      {/* Standalone Search Bar with generous bottom margin */}
      <form onSubmit={handleSearch} className="search-bar standalone">
        <input
          type="text"
          value={inputVal}
          placeholder="Search and explore...."
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Results Header with Generous Spacing */}
      <div className="search-results-header">
        <h2 className="search-results-title">
          {query ? `Search Results for : ${query}` : 'All Movies'}
        </h2>
        <Link to="/" className="back-home-link-btn">
          ← Back to Home
        </Link>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <p>Searching movies...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#ef4444' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {results.length > 0 ? (
            <>
              <div className="movies-grid">
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {[1, 2, 3, 4, 5].slice(0, Math.min(5, totalPages)).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  {totalPages > 5 && <span style={{ padding: '0 4px', color: '#6b7280' }}>....</span>}
                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            query && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No movies found matching "{query}".</p>
                <Link to="/" style={{ color: '#000', fontWeight: 'bold', textDecoration: 'underline' }}>
                  Return to Now Playing
                </Link>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
