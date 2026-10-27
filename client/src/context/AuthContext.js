import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('hotelpro_token');
    const savedUser = localStorage.getItem('hotelpro_user');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('hotelpro_user');
        localStorage.removeItem('hotelpro_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token, user: userData } = res.data;
      localStorage.setItem('hotelpro_token', token);
      localStorage.setItem('hotelpro_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token, user: newUser } = res.data;
      localStorage.setItem('hotelpro_token', token);
      localStorage.setItem('hotelpro_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('hotelpro_token');
    localStorage.removeItem('hotelpro_user');
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';
  const isStaff = user && (user.role === 'staff' || user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isStaff,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
