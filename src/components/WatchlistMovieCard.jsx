import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { formatDate } from '../utils/formatDate';
import { getPosterSrc } from '../utils/getPosterSrc';
import { getRatingStars } from '../utils/getRatingStars';

export const WatchlistMovieCard = ({ movie }) => {
    const { toggleWatchlist, isInWatchlist } = useWatchlist();
    const isFavoriteMovie = isInWatchlist(movie.id);

    return (
        <article className="flex h-56 rounded-2xl border border-gray-100 bg-white shadow-md">
            <Link to={`/movie/${movie.id}`} className="relative h-full w-40 shrink-0">
                <div className="absolute inset-0 overflow-hidden rounded-l-2xl">
                    <img src={getPosterSrc(movie)} className="h-full w-full object-cover" />
                </div>
            </Link>
            <div className="flex min-w-0 flex-1 flex-col rounded-r-2xl p-5">
                <div className="mb-1.5 flex items-start justify-between gap-3">
                    <Link to={`/movie/${movie.id}`} className="min-w-0 text-gray-900">
                        <h3 className="truncate text-2xl font-bold">{movie.title}</h3>
                    </Link>
                    <button
                        onClick={() => toggleWatchlist(movie)}
                        className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
                    >
                        <Heart
                            className="size-6"
                            fill={isFavoriteMovie ? '#FEE135' : '#D1D5DB'}
                            stroke={isFavoriteMovie ? '#FEE135' : '#D1D5DB'}
                        />
                    </button>
                </div>
                <span className="mb-2 text-xs text-gray-500">
                    {formatDate(movie.release_date)}
                </span>
                <div className="mb-3 flex items-center gap-1.5">
                    <span className="text-base text-gray-900">
                        {getRatingStars(movie.vote_average)}
                    </span>
                    <span className="text-xs font-medium text-gray-600">{movie.vote_count}</span>
                </div>
                <p className="line-clamp-3 text-sm leading-5 text-gray-700">
                    {movie.overview || 'No description available for this movie.'}
                </p>
            </div>
        </article>
    );
};
