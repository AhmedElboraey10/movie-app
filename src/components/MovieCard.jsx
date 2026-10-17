import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { formatDate } from '../utils/formatDate';
import { getPosterSrc } from '../utils/getPosterSrc';

export const MovieCard = ({ movie }) => {
    const { toggleWatchlist, isInWatchlist } = useWatchlist();
    const isFavoriteMovie = isInWatchlist(movie.id);
    const rating = Math.round(movie.vote_average * 10);
    const ratingColor =
        rating < 40 ? '#ef4444' :
            rating < 60 ? '#f97316' :
                rating < 75 ? '#eab308' : '#00dc89';

    return (
        <article className="flex w-full min-w-0 flex-col transition-transform duration-200 hover:-translate-y-1">
            <Link
                to={`/movie/${movie.id}`}
                className="group relative mb-7 block aspect-2/3 w-full cursor-pointer rounded-xl shadow-sm transition duration-300 hover:shadow-lg"
            >
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-gray-200">
                    <img
                        src={getPosterSrc(movie)}
                        className="block h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                {movie.vote_count > 0 && (
                    <span
                        className="absolute -bottom-5 left-3 z-20 grid size-10 place-items-center rounded-full p-0.75 shadow-lg"
                        style={{
                            background: `conic-gradient(${ratingColor} ${rating}%, #3f4b53 0)`,
                        }}
                    >
                        <span className="grid size-full place-items-center rounded-full bg-[#101820] text-[10px] font-extrabold leading-none text-white">
                            {rating}%
                        </span>
                    </span>
                )}
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
