// File: src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // Import from the separate file
import authService from '../services/auth.service';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      await authService.login({ email, password });
      const userData = await authService.getMe();
      setUser(userData.data);
      localStorage.setItem('user', JSON.stringify(userData.data));
      return { success: true };
    } catch (error) {
      let errorMessage = error.response?.data?.error || 'Login failed';
      if (typeof errorMessage === 'string' && errorMessage.includes('Cannot set property query')) {
        errorMessage = 'Unexpected server error. Please try again.';
      }
      if (error.response?.status >= 500) {
        errorMessage = 'Unexpected server error. Please try again.';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await authService.register(userData);
      const userDataResponse = await authService.getMe();
      setUser(userDataResponse.data);
      localStorage.setItem('user', JSON.stringify(userDataResponse.data));
      return { success: true };
    } catch (error) {
      let errorMessage = error.response?.data?.error || 'Registration failed';
      if (typeof errorMessage === 'string' && errorMessage.includes('Cannot set property query')) {
        errorMessage = 'Unexpected server error. Please try again.';
      }
      if (error.response?.status >= 500) {
        errorMessage = 'Unexpected server error. Please try again.';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    setError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isReceptionist: user?.role === 'receptionist',
    isHousekeeping: user?.role === 'housekeeping',
    isGuest: user?.role === 'guest',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Only export the component
export default AuthProvider;
