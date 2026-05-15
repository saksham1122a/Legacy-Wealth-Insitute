import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lw_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const originalConfig = err.config;

    // don't try to refresh if the request itself was to refresh or login
    if (status === 401 && originalConfig && !originalConfig._retry && !originalConfig.url.includes('/auth/login') && !originalConfig.url.includes('/auth/refresh')) {
      originalConfig._retry = true;
      return api.post('/auth/refresh')
        .then((resp) => {
          const newToken = resp.data?.token;
          if (newToken) {
            localStorage.setItem('lw_token', newToken);
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
          }
          return api.request(originalConfig);
        })
        .catch(() => {
          localStorage.removeItem('lw_token');
          localStorage.removeItem('lw_user');
          if (window.location.pathname !== '/login') window.location.href = '/login';
          return Promise.reject(err);
        });
    }
    return Promise.reject(err);
  }
);

export default api;
