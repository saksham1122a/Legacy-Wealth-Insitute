import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lw_token');
    const cached = localStorage.getItem('lw_user');
    if (token && cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        localStorage.clear();
      }
      // Verify with server
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem('lw_user', JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem('lw_token');
          localStorage.removeItem('lw_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('lw_token', data.token);
    localStorage.setItem('lw_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('lw_token', data.token);
    localStorage.setItem('lw_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lw_token');
    localStorage.removeItem('lw_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
