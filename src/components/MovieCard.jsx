import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
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
    const navigate = useNavigate();
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
            <article className="flex h-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
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
                        <Link to={`/movie/${movie.id}`} className="min-w-0 text-gray-900">
                            <h3 className="truncate text-2xl font-bold">{movie.title}</h3>
                        </Link>
                        <button
                            type="button"
                            onClick={handleHeartClick}
                            aria-label={
                                isFavoriteMovie ? 'Remove from watchlist' : 'Add to watchlist'
                            }
                            className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
                        >
                            <Heart
                                className="size-6"
                                fill={isFavoriteMovie ? '#FEE135' : '#D1D5DB'}
                                stroke={isFavoriteMovie ? '#FEE135' : '#D1D5DB'}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    <span className="mb-2 text-xs text-gray-500">{formattedDate}</span>
                    <div className="mb-3 flex items-center gap-1.5">
                        <span className="text-base text-gray-900">أ¢ع©â€¦أ¢ع©â€¦أ¢ع©â€¦أ¢ع©â€¦أ¢ع©â€¦</span>
                        <span className="text-xs font-medium text-gray-600">
                            {movie.vote_count || '9288'}
                        </span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-5 text-gray-700">
                        {movie.overview || 'No description available for this movie.'}
                    </p>
                </div>
            </article>
        );
    }

    return (
        <article className="flex w-full min-w-0 flex-col transition-transform duration-200 hover:-translate-y-1">
            <div className="group relative mb-2.5 aspect-2/3 w-full cursor-default overflow-hidden rounded-xl bg-gray-200 shadow-sm transition duration-300 hover:shadow-lg">
                <img
                    src={posterSrc}
                    alt={movie.title || 'Movie poster'}
                    loading="lazy"
                    className="absolute inset-0 block h-full w-full cursor-default object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackPoster;
                    }}
                />
                <button
                    type="button"
                    aria-label={`View details for ${movie.title || 'this movie'}`}
                    className="absolute right-2 top-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 bg-white/40 text-xs font-bold leading-none text-white backdrop-blur"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                >
                    {'\u2022\u2022\u2022'}
                </button>
            </div>
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
                        className="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 leading-none transition-transform duration-150 hover:scale-110"
                        onClick={handleHeartClick}
                    >
                        <Heart
                            className="size-4.5"
                            fill={isFavoriteMovie ? '#FEE135' : 'none'}
                            stroke={isFavoriteMovie ? '#FEE135' : '#6B7280'}
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>
        </article>
    );
};
