import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

function Navbar() {
    const { count } = useWatchlist();

    return (
        <nav className="flex items-center justify-between bg-yellow-300 px-6 py-4 text-black">
            <Link to="/" className="text-base font-bold text-black">
                Movie App
            </Link>

            <Link to="/watchlist" className="flex items-center gap-1.5 text-base text-black">
                <Heart size={18} fill="currentColor" aria-hidden="true" />
                <span>watchlist</span>
                {count > 0 && (
                    <span className="rounded-full bg-black px-1.5 py-0.5 text-xs text-white">
                        {count}
                    </span>
                )}
            </Link>
        </nav>
    );
}

export default Navbar;
