import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const fallbackPoster = 'https://placehold.co/300x450/e5e7eb/6b7280?text=No+Poster';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

export const MovieCard = ({ movie, isHorizontal }) => {
    const { toggleWatchlist, isFavorite } = useApp();
    const isFavoriteMovie = isFavorite ? isFavorite(movie.id) : false;
    const posterSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : movie.poster || fallbackPoster;
    const formattedDate = formatDate(movie.release_date || movie.releaseDate);

    const handleHeartClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWatchlist?.(movie);
    };

    if (isHorizontal) {
        return (
            <article className="flex h-[220px] overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                <Link to={`/movie/${movie.id}`} className="w-40 shrink-0">
                    <img
                        src={posterSrc}
                        alt={movie.title || 'Movie poster'}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = fallbackPoster;
                        }}
                    />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="mb-1.5 flex items-start justify-between gap-3">
                        <Link to={`/movie/${movie.id}`} className="min-w-0 text-[#111]">
                            <h3 className="truncate text-[22px] font-bold">{movie.title}</h3>
                        </Link>
                        <button
                            type="button"
                            onClick={handleHeartClick}
                            aria-label={
                                isFavoriteMovie ? 'Remove from watchlist' : 'Add to watchlist'
                            }
                            className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
                        >
                            <svg
                                className="h-[22px] w-[22px]"
                                viewBox="0 0 24 24"
                                fill={isFavoriteMovie ? '#FEE135' : '#D1D5DB'}
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                    </div>
                    <span className="mb-2 text-[13px] text-gray-500">{formattedDate}</span>
                    <div className="mb-3 flex items-center gap-1.5">
                        <span className="text-[15px] text-[#111]">★★★★★</span>
                        <span className="text-[13px] font-medium text-gray-600">
                            {movie.vote_count || '9288'}
                        </span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-[1.4] text-gray-700">
                        {movie.overview || 'No description available for this movie.'}
                    </p>
                </div>
            </article>
        );
    }

    return (
        <article className="flex w-full min-w-0 flex-col transition-transform duration-200 hover:-translate-y-1">
            <Link to={`/movie/${movie.id}`} className="block w-full">
                <div className="group relative mb-2.5 aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                    <img
                        src={posterSrc}
                        alt={movie.title || 'Movie poster'}
                        loading="lazy"
                        className="absolute inset-0 block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                        onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = fallbackPoster;
                        }}
                    />
                    <button
                        type="button"
                        aria-label="Movie options"
                        className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-0 bg-white/40 text-[13px] font-bold leading-none text-white backdrop-blur"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                    >
                        •••
                    </button>
                </div>
            </Link>
            <div className="flex w-full min-w-0 flex-col">
                <Link to={`/movie/${movie.id}`} className="block w-full min-w-0 text-inherit">
                    <h3
                        className="mb-1 truncate text-sm font-bold leading-tight text-gray-900 hover:text-black"
                        title={movie.title}
                    >
                        {movie.title}
                    </h3>
                </Link>
                <div className="flex min-h-5 w-full items-center justify-between">
                    <span className="truncate whitespace-nowrap text-xs text-gray-500">
                        {formattedDate}
                    </span>
                    <button
                        type="button"
                        aria-label={isFavoriteMovie ? 'Remove from watchlist' : 'Add to watchlist'}
                        className="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 leading-none transition-transform duration-150 hover:scale-[1.15]"
                        onClick={handleHeartClick}
                    >
                        <svg
                            className="h-[18px] w-[18px]"
                            viewBox="0 0 24 24"
                            fill={isFavoriteMovie ? '#FEE135' : 'none'}
                            stroke={isFavoriteMovie ? '#FEE135' : '#6B7280'}
                            strokeWidth="2"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
};
