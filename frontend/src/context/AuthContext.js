import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, setCurrentUser as setMockUser, logout as mockLogout } from '../mockData';

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
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setMockUser(userData);
  };

  const logout = () => {
    setUser(null);
    mockLogout();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isTeacher: user?.userType === 'teacher',
    isStudent: user?.userType === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};