import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), cesium(), tailwindcss()],
  server: {
    proxy: {
      '/tianditu': {
        target: 'https://t0.tianditu.gov.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tianditu/, ''),
        secure: false,
      },
      '/amap': {
        target: 'https://webrd01.is.autonavi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/amap/, ''),
        secure: false,
      }
    }
  }
})
