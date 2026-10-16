const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;

const request = async (path) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }

  return response.json();
};

/**
 * Fetch Now Playing movies from TMDB with pagination support.
 */
export const getNowPlayingMovies = async (page = 1) => {
  return request(`/movie/now_playing?page=${page}`);
};

/**
 * Search movies by keyword from TMDB with pagination support.
 */
export const searchMovies = async (query, page = 1) => {
  return request(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

/**
 * Fetch details for a specific movie from TMDB.
 */
export const getMovieDetails = async (movieId) => {
  return request(`/movie/${movieId}`);
};

/**
 * Fetch recommendations for a specific movie from TMDB.
 */
export const getMovieRecommendations = async (movieId) => {
  return request(`/movie/${movieId}/recommendations`);
};

/**
 * Fetch reviews for a specific movie from TMDB.
 */
export const getMovieReviews = async (movieId) => {
  return request(`/movie/${movieId}/reviews`);
};
