const fallbackPoster = 'https://placehold.co/300x450/e5e7eb/6b7280?text=No+Poster';

export const getPosterSrc = (movie) =>
    movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : fallbackPoster;

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};
