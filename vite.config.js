import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/groq-api': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/groq-api/, '/openai/v1'),
          headers: env.GROQ_API_KEY
            ? { Authorization: `Bearer ${env.GROQ_API_KEY}` }
            : {},
        },
      },
    },
  };
});
