import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '..', '');
    // Use production URL for build, localhost for development
    const API_URL = mode === 'production'
      ? (env.VITE_REACT_APP_API_URL || 'https://booking.prismadot.com/api/public')
      : (env.VITE_REACT_APP_API_URL || 'http://localhost:5500');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.REACT_APP_STRIPE_KEY': JSON.stringify(env.VITE_REACT_APP_STRIPE_KEY),
        'import.meta.env.VITE_REACT_APP_STRIPE_KEY': JSON.stringify(env.VITE_REACT_APP_STRIPE_KEY),
        'import.meta.env.VITE_REACT_APP_API_URL': JSON.stringify(API_URL),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
