import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  define: {'global': {}},
  plugins: [tailwindcss(), react()],
 server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '/app': {
        target: 'http://localhost:3000',
        ws: true
      },
      '/topic': {
        target: 'http://localhost:3000',
        ws: true
      }
    }
  }
})
