import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import WatchlistPage from './pages/WatchlistPage';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultspage';
import { MovieDetails } from './pages/MovieDetails';
import ChatbotPage from './pages/ChatbotPage';
import './App.css';

const App = () => {
  return (
    <WatchlistProvider>
      <AppProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/assistant" element={<ChatbotPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
      </AppProvider>
    </WatchlistProvider>
  );
};

export default App;
