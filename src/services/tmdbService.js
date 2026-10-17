import axios from 'axios';

const tmdbClient = axios.create({ baseURL: '/api/tmdb' });

const request = async (path, params = {}) => {
    try {
        const { data } = await tmdbClient.get(path, { params });
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
