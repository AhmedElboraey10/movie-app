import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, '');

    return {
        plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
        server: {
            proxy: {
                '/api/groq': {
                    target: 'https://api.groq.com',
                    changeOrigin: true,
                    rewrite: () => '/openai/v1/chat/completions',
                    headers: env.GROQ_API_KEY
                        ? { Authorization: `Bearer ${env.GROQ_API_KEY}` }
                        : {},
                },
                '/tmdb-api': {
                    target: 'https://api.themoviedb.org/3',
                    changeOrigin: true,
                    rewrite: (path) => {
                        const url = new URL(path, 'http://localhost');
                        const resource = url.searchParams.get('resource');
                        const movieId = url.searchParams.get('movieId');
                        let endpoint;

                        if (resource === 'now-playing') {
                            endpoint = '/movie/now_playing';
                        } else if (resource === 'search') {
                            endpoint = '/search/movie';
                        } else if (resource === 'details' && /^\d+$/.test(movieId || '')) {
                            endpoint = `/movie/${movieId}`;
                        } else if (
                            resource === 'recommendations' &&
                            /^\d+$/.test(movieId || '')
                        ) {
                            endpoint = `/movie/${movieId}/recommendations`;
                        } else {
                            return '/invalid-request';
                        }

                        url.searchParams.delete('resource');
                        url.searchParams.delete('movieId');
                        const query = url.searchParams.toString();
                        return `${endpoint}${query ? `?${query}` : ''}`;
                    },
                    headers: env.TMDB_API_READ_ACCESS_TOKEN
                        ? { Authorization: `Bearer ${env.TMDB_API_READ_ACCESS_TOKEN}` }
                        : {},
                },
            },
        },
    };
});
