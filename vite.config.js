import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This repository is deployed as the GitHub user site: huudangg0204.github.io.
  base: '/',
})
