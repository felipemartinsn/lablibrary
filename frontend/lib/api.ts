import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Autenticação fictícia - não redireciona em caso de erro 401
    // Apenas loga o erro para debug
    if (error.response?.status === 401) {
      console.warn('Erro 401 - Autenticação fictícia ativa');
    }
    return Promise.reject(error);
  }
);

export default api;

