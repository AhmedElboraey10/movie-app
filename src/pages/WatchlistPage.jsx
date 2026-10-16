import { useWatchlist } from '../context/WatchlistContext';
import { MovieCard } from '../components/MovieCard';
import { Link } from 'react-router-dom';
import { FaHeartBroken } from 'react-icons/fa';
import './WatchlistPage.css';

function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <h1 className="section-title" style={{ marginBottom: '36px' }}>
        Watch list
      </h1>

      {watchlist.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <FaHeartBroken
            size={140}
            color="#d1d5db"
            style={{ marginBottom: '24px' }}
          />

          <h2
            style={{
              fontSize: '24px',
              fontWeight: '500',
              color: '#000',
              marginBottom: '28px',
            }}
          >
            No Movies in watch list
          </h2>

          <Link
            to="/"
            style={{
              backgroundColor: '#FFE353',
              color: '#000',
              padding: '12px 64px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '15px',
            }}
          >
            Back to home
          </Link>
        </div>
      ) : (
        <div className="watchlist-grid">
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
    </div>
  );
}

export default WatchlistPage;
