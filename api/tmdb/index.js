const getEndpoint = (query) => {
    switch (query.resource) {
        case 'now-playing':
            return '/movie/now_playing';
        case 'search':
            return '/search/movie';
        case 'details':
            return /^\d+$/.test(query.movieId || '') ? `/movie/${query.movieId}` : null;
        case 'recommendations':
            return /^\d+$/.test(query.movieId || '')
                ? `/movie/${query.movieId}/recommendations`
                : null;
        default:
            return null;
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const token = process.env.TMDB_API_READ_ACCESS_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'TMDB API is not configured.' });
    }

    const query = req.query || {};
    const endpoint = getEndpoint(query);
    if (!endpoint) {
        return res.status(400).json({ error: 'Invalid TMDB request.' });
    }

    const params = new URLSearchParams();
    if (query.page !== undefined) {
        if (typeof query.page !== 'string') {
            return res.status(400).json({ error: 'Invalid page number.' });
        }
        const page = Number(query.page);
        if (!Number.isInteger(page) || page < 1 || page > 500) {
            return res.status(400).json({ error: 'Invalid page number.' });
        }
        params.set('page', String(page));
    }

    if (query.resource === 'search') {
        if (typeof query.query !== 'string' || !query.query.trim() || query.query.length > 100) {
            return res.status(400).json({ error: 'Invalid search query.' });
        }
        params.set('query', query.query);
    }

    const queryString = params.size > 0 ? `?${params.toString()}` : '';
    let upstream;
    try {
        upstream = await fetch(`https://api.themoviedb.org/3${endpoint}${queryString}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        return res.status(502).json({ error: `TMDB request failed: ${error.message}` });
    }

    try {
        const data = await upstream.json();
        return res.status(upstream.status).json(data);
    } catch {
        return res.status(502).json({ error: 'TMDB returned an invalid response.' });
    }
}
