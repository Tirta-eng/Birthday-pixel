import { defineConfig } from 'vite'

export default defineConfig({
  // The 'public' folder is served at root, so:
  // public/assets/music/bgm.mp3 → accessible at /assets/music/bgm.mp3
  publicDir: 'public',

  server: {
    port: 5173,
    open: false,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
