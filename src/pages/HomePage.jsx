import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard';
import { getNowPlayingMovies } from '../services/tmdbService';

export const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [term, setTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const visiblePages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getNowPlayingMovies(currentPage);
                setMovies(data.results);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (term.trim()) {
            navigate(`/search?query=${encodeURIComponent(term.trim())}`);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
            <div className="mb-8 rounded-xl bg-[#f4f5f7] p-6 text-left sm:p-8">
                <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Welcome to our movie app
                </h1>
                <p className="mb-6 text-base text-gray-500">
                    Millions of movies, TV shows and people to discover. Explore now.
                </p>
                <form onSubmit={handleSearch} className="flex w-full flex-col gap-4 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Search and explore...."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-5 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
                    />
                    <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-[#fee135] px-9 py-3 text-base font-semibold text-black transition-colors hover:bg-[#fcd700]"
                    >
                        Search
                    </button>
                </form>
            </div>
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-900">Now Playing</h2>

            {loading && (
                <div className="py-16 text-center text-gray-500">
                    <p>Loading movies...</p>
                </div>
            )}

            {error && (
                <div className="py-16 text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="mb-10 grid w-full grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 sm:gap-x-4 sm:gap-y-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                    <div className="my-8 flex w-full items-center justify-center gap-2">
                        <button
                            type="button"
                            className="flex h-8 min-w-8 items-center justify-center rounded-md border-0 bg-transparent px-1.5 text-sm font-medium text-gray-900 transition-colors hover:not-disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {visiblePages.map((pageNum) => (
                            <button
                                key={pageNum}
                                type="button"
                                className={`flex h-8 min-w-8 items-center justify-center rounded-md border-0 px-1.5 text-sm transition-colors ${currentPage === pageNum ? 'bg-[#fee135] font-bold text-black' : 'bg-transparent font-medium text-gray-900 hover:bg-gray-100'}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}
                        {totalPages > 5 && <span className="px-1 text-gray-500">....</span>}
                        <button
                            type="button"
                            className="flex h-8 min-w-8 items-center justify-center rounded-md border-0 bg-transparent px-1.5 text-sm font-medium text-gray-900 transition-colors hover:not-disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </>
            )}
        </main>
    );
};
