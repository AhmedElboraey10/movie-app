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
                    rewrite: (path) => path.replace(/^\/api\/groq/, '/openai/v1'),
                    headers: env.GROQ_API_KEY
                        ? { Authorization: `Bearer ${env.GROQ_API_KEY}` }
                        : {},
                },
                '/api/tmdb': {
                    target: 'https://api.themoviedb.org/3',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/tmdb/, ''),
                    headers: env.TMDB_API_READ_ACCESS_TOKEN
                        ? { Authorization: `Bearer ${env.TMDB_API_READ_ACCESS_TOKEN}` }
                        : {},
                },
            },
        },
    };
});
