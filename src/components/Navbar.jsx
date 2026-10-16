import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { FaHeart } from 'react-icons/fa';

function Navbar() {
  const { count } = useWatchlist();

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 24px', 
      backgroundColor: '#facc15', 
      color: '#000' 
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold', fontSize: '16px' }}>
        Movie App
      </Link>
      
      <Link to="/watchlist" style={{ textDecoration: 'none', color: '#000', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}>
        <FaHeart size={18} color="#000" />
        <span>watchlist</span>
        {count > 0 && (
          <span style={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>
            {count}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;