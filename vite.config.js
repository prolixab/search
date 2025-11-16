import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/search/', // GitHub Pages project page base path (change if repo name differs)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})

