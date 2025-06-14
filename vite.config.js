import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: '.',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  optimizeDeps: {
    exclude: ['pg', 'pg-native', 'pg-connection-string', 'pg-cloudflare', 'cloudflare:sockets'],
    include: ['vue', 'axios'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    rollupOptions: {
      external: ['pg', 'pg-native', 'pg-connection-string', 'pg-cloudflare', 'cloudflare:sockets']
    }
  },
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
