// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 5173, open: true, proxy: { '/api': 'http://localhost:3001' } },
  plugins: [react()]
});
