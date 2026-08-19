/**
 * Central Axios instance for all API calls.
 *
 * LOCAL DEV:  VITE_API_BASE_URL is not set → baseURL = '' → Vite proxy handles /api/*
 * PRODUCTION: VITE_API_BASE_URL = https://kumbh-backend-xxxx.onrender.com
 *             → axios prepends the full backend URL to every /api/* request
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
});

// In production, Vite proxy isn't used, so we must manually strip the '/api' prefix 
// from URLs because the FastAPI backend routers don't have '/api' in their prefix.
api.interceptors.request.use(config => {
  if (import.meta.env.VITE_API_BASE_URL && config.url && config.url.startsWith('/api/')) {
    config.url = config.url.replace(/^\/api/, '');
  }
  return config;
});

export default api;
