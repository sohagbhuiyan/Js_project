
import axios from 'axios';

// Base API URL
export const API_BASE_URL = 'http://75.119.134.82:6161';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
