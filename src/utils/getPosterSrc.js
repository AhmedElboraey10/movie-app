const fallbackPoster = 'https://placehold.co/300x450/e5e7eb/6b7280?text=No+Poster';

export const getPosterSrc = (movie) =>
    movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : fallbackPoster;
