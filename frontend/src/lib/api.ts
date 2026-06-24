import axios from 'axios';

/**
 * Pre-configured axios instance that points to the backend API.
 * In development: http://localhost:5000 (from VITE_API_URL in .env)
 * In production:  https://lumiai-t8tk.onrender.com (from VITE_API_URL in Vercel env vars)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default api;
