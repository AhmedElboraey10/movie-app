import { useWatchlist } from '../context/WatchlistContext';
import { MovieCard } from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { FaHeartBroken } from 'react-icons/fa';

function WatchlistPage() {
    const { watchlist } = useWatchlist();

    return (
        <main className="mx-auto min-h-[calc(100vh-60px)] w-full max-w-[1200px] px-4 py-5 min-[551px]:px-6 min-[551px]:py-8">
            <h1 className="mb-9 text-2xl font-bold text-gray-900">Watch list</h1>

            {watchlist.length === 0 ? (
                <div className="mt-5 flex flex-col items-center justify-center">
                    <FaHeartBroken size={140} color="#d1d5db" className="mb-6" />

                    <h2 className="mb-7 text-2xl font-medium text-black">
                        No Movies in watch list
                    </h2>

                    <Link
                        to="/"
                        className="rounded-[10px] bg-[#ffe353] px-16 py-3 text-[15px] font-medium text-black"
                    >
                        Back to home
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 min-[769px]:grid-cols-2">
                    {watchlist.map((item) => (
                        <MovieCard
                            key={item.id}
                            movie={item}
                            mediaType={item.media_type}
                            isHorizontal={true}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default WatchlistPage;
