import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('aumryx_user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('aumryx_user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData.user);
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isTeacher: user?.user_type === 'teacher',
    isStudent: user?.user_type === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};