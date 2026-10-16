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
    <main className="min-h-screen bg-gray-950 p-5 text-white">
      <h2 className="mb-5 text-xl font-bold">Now Playing Movies</h2>
      <div className="flex flex-wrap gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} mediaType="movie" />
        ))}
      </div>
    </main>
  );
}

export default Home;
