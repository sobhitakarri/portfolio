import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: https://sobhitakarri.github.io/portfolio/
  base: '/portfolio/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
