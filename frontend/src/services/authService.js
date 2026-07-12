import axios from 'axios';

const TOKEN_STORAGE_KEY = 'ecosphere_access_token';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true
});

export const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

export const storeToken = (token) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post('/auth/create-user', payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await api.put('/auth/change-password', payload);
  return response.data;
};

export default api;
