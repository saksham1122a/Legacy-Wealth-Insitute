import axios from 'axios';

const api = axios.create({
  baseURL: 'https://legacy-wealth-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
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

// Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !originalConfig.url.includes('/auth/login') &&
      !originalConfig.url.includes('/auth/refresh')
    ) {
      originalConfig._retry = true;

      try {
        const resp = await api.post('/auth/refresh');

        const newToken = resp.data?.token;

        if (newToken) {
          localStorage.setItem('lw_token', newToken);
          originalConfig.headers.Authorization = `Bearer ${newToken}`;
        }

        return api.request(originalConfig);
      } catch (err) {
        localStorage.removeItem('lw_token');
        localStorage.removeItem('lw_user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;