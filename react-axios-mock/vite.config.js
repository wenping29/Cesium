import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), cesium(), tailwindcss()],

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    cssCodeSplit: false,
    target: 'es2020',

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/cesium')) {
            return 'cesium'
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react'
          }
          if (id.includes('node_modules/@mui')) {
            return 'mui'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },

    chunkSizeWarningLimit: 2000,
  },
})
