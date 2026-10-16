import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard';
import { searchMovies } from '../services/tmdbService';

export const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('query') || '';
    const [searchDraft, setSearchDraft] = useState({ query, value: query });
    const inputVal = searchDraft.query === query ? searchDraft.value : query;
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const visiblePages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

    useEffect(() => {
        if (!query.trim()) {
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchMovies(query, currentPage);
                setResults(data.results);
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (inputVal.trim()) {
            setCurrentPage(1);
            setSearchParams({ query: inputVal.trim() });
        } else {
            navigate('/');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
            <form onSubmit={handleSearch} className="mb-9 flex w-full flex-col gap-4 sm:flex-row">
                <input
                    type="text"
                    value={inputVal}
                    placeholder="Search and explore...."
                    onChange={(e) => setSearchDraft({ query, value: e.target.value })}
                    className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-5 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
                />
                <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-[#fee135] px-9 py-3 text-base font-semibold text-black transition-colors hover:bg-[#fcd700]"
                >
                    Search
                </button>
            </form>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {query ? `Search Results for : ${query}` : 'All Movies'}
                </h2>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#fee135] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#fcd700]"
                >
                    &larr; Back to Home
                </Link>
            </div>

            {loading && (
                <div className="py-16 text-center text-gray-500">
                    <p>Searching movies...</p>
                </div>
            )}

            {error && (
                <div className="py-16 text-center text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {results.length > 0 ? (
                        <>
                            <div className="mb-10 grid w-full grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 sm:gap-x-4 sm:gap-y-6">
                                {results.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>

                            {totalPages > 1 && (
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
                                    {totalPages > 5 && (
                                        <span className="px-1 text-gray-500">....</span>
                                    )}
                                    <button
                                        type="button"
                                        className="flex h-8 min-w-8 items-center justify-center rounded-md border-0 bg-transparent px-1.5 text-sm font-medium text-gray-900 transition-colors hover:not-disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        query && (
                            <div className="py-16 text-center">
                                <p className="mb-4 text-gray-500">
                                    No movies found matching "{query}".
                                </p>
                                <Link to="/" className="font-bold text-black underline">
                                    Return to Now Playing
                                </Link>
                            </div>
                        )
                    )}
                </>
            )}
        </main>
    );
};
