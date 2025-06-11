import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    plugins: [sveltekit(), tailwindcss()],

    server: {
      allowedHosts: ['.invernspirit.com'],
      proxy: {
        '/api': {
          target: 'http://localhost:9000',
          changeOrigin: true,
        },
        '/stock': {
          target: 'http://localhost:8788',
          rewrite: (path): string => path.replace(/^\/stock/, '/private/stock'),
          changeOrigin: true,
        },
      },
    },
  };
});
