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
  // Force Vite to pre-bundle these CKEditor deps which sometimes fail to load
  // when the optimize cache is stale (common after installing deps).
  optimizeDeps: {
    include: [
      '@ckeditor/ckeditor5-react',
      '@ckeditor/ckeditor5-build-classic'
    ]
  },
  resolve: {
    alias: {
      '@': '/src' 
    }
  },
  assetsInclude: ['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.jpeg']
});
