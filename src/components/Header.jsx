import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const Header = () => {
    const { watchlist } = useWatchlist();
    const count = watchlist.length;

    return (
        <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#fee135] px-4 py-3 sm:px-8 sm:py-3.5">
            <Link to="/" className="text-xl font-bold tracking-tight text-black">
                Movie App
            </Link>
            <div className="flex items-center gap-3.5 sm:gap-7">
                <Link
                    to="/assistant"
                    className="inline-flex items-center justify-center text-black"
                >
                    <img
                        src="/bot.png"
                        className="block h-7 w-7 shrink-0 object-contain"
                    />
                </Link>
                <Link
                    to="/watchlist"
                    className="inline-flex items-center gap-2 text-base font-semibold text-black"
                >
                    <Heart className="size-6 shrink-0 fill-current" />
                    <span className="sm:hidden">watchlist</span>
                    {count > 0 && (
                        <span className="ml-0.5 rounded border border-black bg-white px-1.5 py-0.5 text-xs font-bold text-black">
                            {count}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};
