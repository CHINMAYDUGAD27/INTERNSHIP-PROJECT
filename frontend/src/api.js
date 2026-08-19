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

export default api;
