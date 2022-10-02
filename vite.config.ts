import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const PROD = command === "build" 
  
  return {
    plugins: [react()],
    define: {
      PROD
    },
    build: {
      outDir: "./server/dist"
    },
    server: {
      proxy: {
        "/room": "http://localhost:3000/",
        "/ws": {
          target: "ws://localhost:3000/",
          ws: true
        }
      }
    },
  }
})
