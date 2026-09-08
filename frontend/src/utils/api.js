import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Base server URL (without /api) - used to load uploaded design images
export const SERVER_URL = API_BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the logged in user's token to every request automatically
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('boutiqUser');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
