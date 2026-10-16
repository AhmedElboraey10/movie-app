import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MovieCard } from '../components/MovieCard';
import { getMovieDetails, getMovieRecommendations } from '../services/tmdbService';

export const MovieDetails = () => {
    const { id } = useParams();
    const movieId = id || 550; // Fallback to Fight Club if no param

    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { toggleWatchlist, isFavorite } = useApp();
    const fav = movie && isFavorite ? isFavorite(movie.id) : false;
    const fallbackPoster = 'https://placehold.co/500x750/f3f4f6/9ca3af?text=No+Poster';

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const [movieData, recsData] = await Promise.all([
                    getMovieDetails(movieId),
                    getMovieRecommendations(movieId).catch(() => ({ results: [] })),
                ]);
                setMovie(movieData);
                setRecommendations(recsData.results || []);
            } catch (err) {
                setError(err.message || 'Failed to load movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [movieId]);

    const renderStars = (voteAverage) => {
        const ratingOutOfFive = voteAverage ? Math.round(voteAverage / 2) : 4;
        return '★'.repeat(ratingOutOfFive) + '☆'.repeat(5 - ratingOutOfFive);
    };

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center text-gray-500">
                <p>Loading movie details from TMDB...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center text-red-500">
                <h2>Error Loading Movie</h2>
                <p>{error || 'Movie not found.'}</p>
                <Link
                    to="/"
                    className="mt-5 inline-block rounded-lg bg-[#fee135] px-6 py-2.5 font-semibold text-black"
                >
                    Back to home
                </Link>
            </div>
        );
    }

    const posterSrc = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : movie.poster || fallbackPoster;

    const languages =
        movie.spoken_languages && movie.spoken_languages.length > 0
            ? movie.spoken_languages.map((lang) => lang.english_name || lang.name).join(', ')
            : 'English';

    const voteCount = movie.vote_count || 9288;

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-10">
            {/* Movie Details Hero matching Figma Image 5 */}
            <div className="mb-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
                <div className="w-60 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.12)] lg:w-80">
                    <img
                        src={posterSrc}
                        alt={movie.title}
                        className="block h-auto w-full"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackPoster;
                        }}
                    />
                </div>

                <div className="flex flex-1 flex-col">
                    <div className="mb-1 flex items-start justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            {movie.title}
                        </h1>
                        <button
                            type="button"
                            className="inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-1 text-3xl transition-transform hover:scale-110"
                            onClick={() => toggleWatchlist(movie)}
                            aria-label={fav ? 'Remove from watchlist' : 'Add to watchlist'}
                            title={fav ? 'Remove from watchlist' : 'Add to watchlist'}
                        >
                            <Heart
                                className="size-6"
                                fill={fav ? '#FEE135' : 'none'}
                                stroke={fav ? '#FEE135' : '#111827'}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    <span className="mb-3 text-sm text-gray-500">
                        {movie.release_date || 'Sep 25, 2017'}
                    </span>

                    {/* Large Stars matching Figma */}
                    <div className="mb-4 flex items-center gap-2.5">
                        <span className="text-2xl leading-none tracking-widest text-gray-900">
                            {renderStars(movie.vote_average)}
                        </span>
                        <span className="text-base font-medium text-gray-500">
                            {voteCount.toLocaleString()}
                        </span>
                    </div>

                    <p className="mb-6 text-base leading-relaxed text-gray-700">
                        {movie.overview || 'No overview available for this movie.'}
                    </p>

                    {/* Genre Pills */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-3">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="rounded-full bg-[#fee135] px-5 py-1.5 text-sm font-semibold text-black"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Meta: Duration and Languages */}
                    <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-gray-900">
                        {movie.runtime > 0 && (
                            <span>
                                <strong>Duration:</strong> {movie.runtime} Min.
                            </span>
                        )}
                        <span>
                            <strong>Languages:</strong> {languages}
                        </span>
                    </div>

                    {/* Production Companies */}
                    {movie.production_companies && movie.production_companies.length > 0 && (
                        <div className="mb-6 flex flex-wrap items-center gap-4">
                            {movie.production_companies.map((comp) =>
                                comp.logo_path ? (
                                    <img
                                        key={comp.id}
                                        src={`https://image.tmdb.org/t/p/w200${comp.logo_path}`}
                                        alt={comp.name}
                                        className="max-h-8 max-w-30 object-contain"
                                        title={comp.name}
                                    />
                                ) : (
                                    <span
                                        key={comp.id}
                                        className="border border-black px-2.5 py-1 text-base font-bold tracking-wide text-black"
                                    >
                                        {comp.name}
                                    </span>
                                ),
                            )}
                        </div>
                    )}

                    {/* Official Website Button */}
                    {movie.homepage && (
                        <a
                            href={movie.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50"
                        >
                            Website 🔗
                        </a>
                    )}
                </div>
            </div>

            {/* Break / Divider between Details Hero and Recommendations */}
            <hr className="my-10 h-px w-full border-0 bg-gray-200 sm:mt-12" />

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <section>
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Recommendations</h2>
                    <div className="mb-10 grid w-full grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 sm:gap-x-4 sm:gap-y-6">
                        {recommendations.slice(0, 6).map((rec) => (
                            <MovieCard key={rec.id} movie={rec} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
};

export default MovieDetails;
