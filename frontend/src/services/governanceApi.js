import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPolicies = async () => {
  const response = await api.get('/governance/policies');
  return response.data;
};

export const getPolicy = async (id) => {
  const response = await api.get(`/governance/policies/${id}`);
  return response.data;
};

export const createPolicy = async (payload) => {
  const response = await api.post('/governance/policies', payload);
  return response.data;
};

export const updatePolicy = async (id, payload) => {
  const response = await api.put(`/governance/policies/${id}`, payload);
  return response.data;
};

export const deletePolicy = async (id) => {
  const response = await api.delete(`/governance/policies/${id}`);
  return response.data;
};
