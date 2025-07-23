import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2000,
    host: true, 
    strictPort: true, 
    proxy: {
      '/api': {
        target: 'https://portfolio-backend-ckqx.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src' 
    }
  },
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.jpeg']
});
