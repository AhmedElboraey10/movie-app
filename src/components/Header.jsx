import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { watchlist } = useApp();
  const count = watchlist ? watchlist.length : 0;

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#fee135] px-4 py-3 min-[551px]:px-8 min-[551px]:py-3.5">
      <div>
        <Link to="/" className="text-[1.15rem] font-bold tracking-[-0.2px] text-black">
          Movie App
        </Link>
      </div>
      <div className="flex items-center gap-3.5 min-[551px]:gap-7">
        <Link
          to="/assistant"
          className="inline-flex items-center justify-center text-black"
          aria-label="Open Movie Assistant"
        >
          <img
            src="/bot.png"
            alt="Movie assistant"
            className="block h-7 w-7 shrink-0 object-contain"
          />
        </Link>
        <Link to="/watchlist" className="inline-flex items-center gap-2 text-base font-semibold text-black">
          <svg
            className="h-[22px] w-[22px] shrink-0"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#000000"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="max-[550px]:hidden">watchlist</span>
          {count > 0 && <span className="ml-0.5 rounded border border-black bg-white px-1.5 py-0.5 text-xs font-bold text-black">{count}</span>}
        </Link>
      </div>
    </header>
  );
};
