import { defineConfig, loadEnv } from 'vite';
import type { Plugin, ViteDevServer } from 'vite';
import process from 'process';
import { spawn } from 'child_process';
import { sveltekit } from '@sveltejs/kit/vite';

type ViteEnv = {
  VITE_RUN_LOCAL_ON_START: string;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_') as ViteEnv;
  return {
    plugins: [sveltekit(), runLocalOnServerStart(env)],

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

/* eslint-disable no-console */
function runLocalOnServerStart(env: ViteEnv): Plugin {
  return {
    name: 'run-local-on-start',
    configureServer(server: ViteDevServer): void {
      server.httpServer?.once('listening', () => {
        const shouldRunLocal = env.VITE_RUN_LOCAL_ON_START === 'true';

        if (!shouldRunLocal) {
          console.log('Skipping "bun run local" as RUN_LOCAL_ON_START is not set to true');
          return;
        }

        console.log('Vite server started! Running "bun run local"...');

        const bunProcess = spawn('bun', ['run', 'local'], {
          stdio: 'inherit',
        });

        bunProcess.on('error', (error) => {
          console.error(`Error executing bun: ${error.message}`);
        });

        bunProcess.on('close', (code) => {
          if (code !== 0) console.error(`bun run local process exited with code ${code}`);
        });
      });
    },
  };
}
