const getEndpoint = (path) => {
    if (path.length === 2 && path[0] === 'movie' && path[1] === 'now_playing') {
        return '/movie/now_playing';
    }

    if (path.length === 2 && path[0] === 'search' && path[1] === 'movie') {
        return '/search/movie';
    }

    if (path.length === 2 && path[0] === 'movie' && /^\d+$/.test(path[1])) {
        return `/movie/${path[1]}`;
    }

    if (
        path.length === 3 &&
        path[0] === 'movie' &&
        /^\d+$/.test(path[1]) &&
        path[2] === 'recommendations'
    ) {
        return `/movie/${path[1]}/recommendations`;
    }

    return null;
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

    const queryParams = req.query || {};
    const routePath = Array.isArray(queryParams.path)
        ? queryParams.path
        : typeof queryParams.path === 'string'
          ? queryParams.path.split('/').filter(Boolean)
          : [];
    const endpoint = getEndpoint(routePath);
    if (!endpoint) {
        return res.status(404).json({ error: 'TMDB endpoint not found.' });
    }

    const params = new URLSearchParams();
    if (queryParams.page !== undefined) {
        if (typeof queryParams.page !== 'string') {
            return res.status(400).json({ error: 'Invalid page number.' });
        }
        const page = Number(queryParams.page);
        if (!Number.isInteger(page) || page < 1 || page > 500) {
            return res.status(400).json({ error: 'Invalid page number.' });
        }
        params.set('page', String(page));
    }

    if (queryParams.query !== undefined) {
        if (typeof queryParams.query !== 'string' || queryParams.query.length > 100) {
            return res.status(400).json({ error: 'Invalid search query.' });
        }
        params.set('query', queryParams.query);
    }

    if (endpoint === '/search/movie' && !params.get('query')?.trim()) {
        return res.status(400).json({ error: 'A search query is required.' });
    }

    const query = params.size > 0 ? `?${params.toString()}` : '';
    let upstream;
    try {
        upstream = await fetch(`https://api.themoviedb.org/3${endpoint}${query}`, {
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
