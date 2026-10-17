import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MovieRating } from './MovieRating';
import { formatDate, getPosterSrc } from './movieCardUtils';

export const HomeMovieCard = ({ movie }) => {
    const { toggleWatchlist, isInWatchlist } = useApp();
    const isFavoriteMovie = isInWatchlist(movie.id);

    return (
        <article className="flex w-full min-w-0 flex-col transition-transform duration-200 hover:-translate-y-1">
            <Link
                to={`/movie/${movie.id}`}
                className="group relative mb-7 block aspect-2/3 w-full cursor-pointer rounded-xl shadow-sm transition duration-300 hover:shadow-lg"
            >
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-gray-200">
                    <img
                        src={getPosterSrc(movie)}
                        loading="lazy"
                        className="block h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <MovieRating movie={movie} />
            </Link>
            <div className="flex w-full min-w-0 flex-col">
                <h3
                    className="mb-1 truncate text-sm font-bold leading-tight text-gray-900"
                    title={movie.title}
                >
                    {movie.title}
                </h3>
                <div className="flex min-h-5 w-full items-center justify-between">
                    <span className="truncate whitespace-nowrap text-xs text-gray-500">
                        {formatDate(movie.release_date)}
                    </span>
                    <button
                        type="button"
                        className="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 leading-none transition-transform duration-150 hover:scale-110"
                        onClick={() => toggleWatchlist(movie)}
                    >
                        <Heart
                            className="size-4.5"
                            fill={isFavoriteMovie ? '#FEE135' : 'none'}
                            stroke={isFavoriteMovie ? '#FEE135' : '#6B7280'}
                            strokeWidth={2}
                        />
                    </button>
                </div>
            </div>
        </article>
    );
};
