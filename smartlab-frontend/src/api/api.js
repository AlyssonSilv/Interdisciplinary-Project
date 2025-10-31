import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT a cada requisição
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Pega o token do localStorage
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token; // Adiciona o token ao cabeçalho
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;