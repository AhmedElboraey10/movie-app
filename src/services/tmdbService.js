import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;
const tmdbClient = axios.create({
    baseURL: BASE_URL,
    headers: { accept: 'application/json' },
});

const request = async (path, params = {}) => {
    try {
        const { data } = await tmdbClient.get(path, {
            params,
            headers: { Authorization: `Bearer ${READ_ACCESS_TOKEN}` },
        });
        return data;
    } catch (error) {
        const status = error.response?.status;
        const reason = error.response?.data?.status_message || error.message;
        const statusText = status ? ` (${status})` : '';

        throw new Error(`TMDB request failed${statusText}: ${reason}`, { cause: error });
    }
};

export const getNowPlayingMovies = (page = 1) => {
    return request('/movie/now_playing', { page });
};

export const searchMovies = (query, page = 1) => {
    return request('/search/movie', { query, page });
};

export const getMovieDetails = (movieId) => {
    return request(`/movie/${movieId}`);
};

export const getMovieRecommendations = (movieId) => {
    return request(`/movie/${movieId}/recommendations`);
};
