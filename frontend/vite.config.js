import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
      proxy: {
        // In development: proxy /api → local FastAPI backend
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
        // Note: /ollama proxy removed — Ollama replaced by Groq cloud API
      }
    }
  }
})
