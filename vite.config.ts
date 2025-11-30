import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __VITE_API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
  },
  server: {
    port: 3001,
    strictPort: false,
    host: true,
    hmr: {
      port: 3001,
      overlay: true,
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    outDir: 'public/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html'),
    },
  },
  publicDir: 'public/dist',
  optimizeDeps: {
    include: ['react', 'react-dom', '@reduxjs/toolkit', 'redux-saga'],
  },
})
