import { useEffect, useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { getNowPlayingMovies } from '../services/tmdbService';

function Home() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    getNowPlayingMovies()
      .then((data) => setMovies(data.results || []))
      .catch((error) => console.error('Failed to fetch now playing movies:', error));
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Now Playing Movies</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} mediaType="movie" />
        ))}
      </div>
    </div>
  );
}

export default Home;
