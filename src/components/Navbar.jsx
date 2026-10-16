import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { FaHeart } from 'react-icons/fa';

function Navbar() {
  const { count } = useWatchlist();

  return (
    <nav className="flex items-center justify-between bg-yellow-300 px-6 py-4 text-black">
      <Link to="/" className="text-base font-bold text-black">
        Movie App
      </Link>
      
      <Link to="/watchlist" className="flex items-center gap-1.5 text-[15px] text-black">
        <FaHeart size={18} color="#000" />
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
