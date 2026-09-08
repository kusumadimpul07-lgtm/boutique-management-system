import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Base server URL (without /api) - used to load uploaded design images
export const SERVER_URL = API_BASE_URL.replace('/api', '');

// A separate Axios instance from utils/api.js so the Customer Portal always
// sends the customer's own token, never the staff/owner one.
const customerApi = axios.create({
  baseURL: API_BASE_URL,
});

customerApi.interceptors.request.use((config) => {
  const stored = localStorage.getItem('boutiqCustomer');
  if (stored) {
    const customer = JSON.parse(stored);
    if (customer && customer.token) {
      config.headers.Authorization = `Bearer ${customer.token}`;
    }
  }
  return config;
});

export default customerApi;
