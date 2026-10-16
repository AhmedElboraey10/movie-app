import { useWatchlist } from '../context/WatchlistContext';
import { MovieCard } from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { HeartCrack } from 'lucide-react';

function WatchlistPage() {
    const { watchlist } = useWatchlist();

    return (
        <main className="mx-auto min-h-[calc(100vh-3.75rem)] w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
            <h1 className="mb-9 text-2xl font-bold text-gray-900">Watch list</h1>

            {watchlist.length === 0 ? (
                <div className="mt-5 flex flex-col items-center justify-center">
                    <HeartCrack size={140} color="#d1d5db" className="mb-6" aria-hidden="true" />

                    <h2 className="mb-7 text-2xl font-medium text-black">
                        No Movies in watch list
                    </h2>

                    <Link
                        to="/"
                        className="rounded-xl bg-[#ffe353] px-16 py-3 text-base font-medium text-black"
                    >
                        Back to home
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {watchlist.map((item) => (
                        <MovieCard
                            key={item.id}
                            movie={item}
                            isHorizontal={true}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default WatchlistPage;
