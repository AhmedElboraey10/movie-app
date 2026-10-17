import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import WatchlistPage from './pages/WatchlistPage';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultspage';
import { MovieDetails } from './pages/MovieDetails';
import ChatbotPage from './pages/ChatbotPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    return (
        <WatchlistProvider>
            <Router>
                <Header />
                <Routes>
                    <Route index element={<HomePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/watchlist" element={<WatchlistPage />} />
                    <Route path="/assistant" element={<ChatbotPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </WatchlistProvider>
    );
};

export default App;
