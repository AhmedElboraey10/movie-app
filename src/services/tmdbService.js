import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;
const tmdbClient = axios.create({
    baseURL: BASE_URL,
    headers: { accept: 'application/json' },
});

const request = async (path, params = {}) => {
    if (!READ_ACCESS_TOKEN) {
        throw new Error(
            'TMDB access token is missing. Set VITE_TMDB_API_READ_ACCESS_TOKEN in .env.local and restart Vite.',
        );
    }

    try {
        const { data } = await tmdbClient.get(path, {
            params,
            headers: { Authorization: `Bearer ${READ_ACCESS_TOKEN}` },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const reason = error.response?.data?.status_message || error.message;
            const statusText = status ? ` (${status})` : '';

            throw new Error(`TMDB request failed${statusText}: ${reason}`, { cause: error });
        }

        throw error;
    }
};

/**
 * Fetch Now Playing movies from TMDB with pagination support.
 */
export const getNowPlayingMovies = async (page = 1) => {
    return request('/movie/now_playing', { page });
};

/**
 * Search movies by keyword from TMDB with pagination support.
 */
export const searchMovies = async (query, page = 1) => {
    return request('/search/movie', { query, page });
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
