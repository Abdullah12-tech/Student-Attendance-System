import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Register/Signup function
  const signup = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authAPI.signup(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await api.put('/auth/profile', userData);
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (passwordData) => {
    setError(null);
    try {
      await authAPI.updatePassword(passwordData);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Password update failed.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    setError(null);
    try {
      await authAPI.forgotPassword({ email });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Request failed.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token, password) => {
    setError(null);
    try {
      await authAPI.resetPassword({ token, password });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Reset failed.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  }, [user]);

  // Check permissions
  const can = useCallback((permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    clearError,
    hasRole,
    can,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
