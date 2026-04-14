import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const authToken = data.token || data.access_token;

    if (!authToken) {
      throw new Error('Login response did not include an auth token.');
    }

    setToken(authToken);
    localStorage.setItem('token', authToken);

    const userData = data.user || await authService.getCurrentUser();
    setUser(userData);
    return userData;
  };

  const signup = async (fullName, email, password) => {
    // 1. Create account
    await authService.signup(fullName, email, password);
    // 2. Automatically log them in after
    return await login(email, password);
  };
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
