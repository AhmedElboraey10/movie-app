import axios from 'axios';

const tmdbClient = axios.create({
    baseURL: import.meta.env.DEV ? '/tmdb-api' : '/api/tmdb/movies',
});

const request = async (resource, params = {}) => {
    try {
        const { data } = await tmdbClient.get('', {
            params: { resource, ...params },
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
    return request('now-playing', { page });
};

export const searchMovies = (query, page = 1) => {
    return request('search', { query, page });
};

export const getMovieDetails = (movieId) => {
    return request('details', { movieId });
};

export const getMovieRecommendations = (movieId) => {
    return request('recommendations', { movieId });
};
