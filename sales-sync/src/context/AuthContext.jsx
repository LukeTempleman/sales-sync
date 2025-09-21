import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
// Keep the import for mock data during transition
import { allUsers, tenants } from '../data';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useRealApi, setUseRealApi] = useState(false); // Toggle between mock and real API

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTenant = localStorage.getItem('tenant');
    const token = localStorage.getItem('accessToken');
    
    if (storedUser && storedTenant) {
      setUser(JSON.parse(storedUser));
      setTenant(JSON.parse(storedTenant));
      
      // If we have a token, we're using the real API
      if (token) {
        setUseRealApi(true);
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, tenantId) => {
    setError(null);
    
    if (useRealApi) {
      try {
        setLoading(true);
        const response = await authAPI.login({ email, password });
        const { user, tenant, tokens } = response.data;
        
        // Save tokens to localStorage
        localStorage.setItem('accessToken', tokens.access_token);
        localStorage.setItem('refreshToken', tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        if (tenant) {
          localStorage.setItem('tenant', JSON.stringify(tenant));
          setTenant(tenant);
        }
        
        setUser(user);
        setLoading(false);
        return { success: true, user, tenant };
      } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        setLoading(false);
        return { success: false, error: error.response?.data?.message || 'Login failed' };
      }
    } else {
      // Mock login for development/testing
      const foundUser = allUsers.find(u => u.email === email && u.tenantId === tenantId);
      
      if (foundUser) {
        const selectedTenant = tenants.find(t => t.id === tenantId);
        
        // Store in state
        setUser(foundUser);
        setTenant(selectedTenant);
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('tenant', JSON.stringify(selectedTenant));
        
        return { success: true, user: foundUser };
      }
      
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Register function
  const register = async (userData) => {
    if (useRealApi) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authAPI.register(userData);
        const { user, tenant, tokens } = response.data;
        
        // Save tokens to localStorage
        localStorage.setItem('accessToken', tokens.access_token);
        localStorage.setItem('refreshToken', tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
        
        if (tenant) {
          localStorage.setItem('tenant', JSON.stringify(tenant));
          setTenant(tenant);
        }
        
        setUser(user);
        setLoading(false);
        return { success: true, user, tenant };
      } catch (error) {
        console.error('Registration error:', error);
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
        setLoading(false);
        return { success: false, error: error.response?.data?.message || 'Registration failed' };
      }
    } else {
      // Mock registration for development/testing
      // In a real app, this would be an API call
      return { success: false, error: 'Registration not implemented in mock mode' };
    }
  };

  // Logout function
  const logout = async () => {
    if (useRealApi) {
      try {
        setLoading(true);
        // Call logout API to invalidate token on server
        await authAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear local storage and state regardless of API success
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tenant');
        
        setUser(null);
        setTenant(null);
        setLoading(false);
      }
    } else {
      // Mock logout
      setUser(null);
      setTenant(null);
      localStorage.removeItem('user');
      localStorage.removeItem('tenant');
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    if (useRealApi) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authAPI.forgotPassword(email);
        setLoading(false);
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error('Forgot password error:', error);
        setError(error.response?.data?.message || 'Failed to send password reset email.');
        setLoading(false);
        return { success: false, error: error.response?.data?.message || 'Failed to send password reset email' };
      }
    } else {
      // Mock forgot password
      return { success: true, message: 'Password reset email sent (mock)' };
    }
  };

  // Reset password function
  const resetPassword = async (token, password) => {
    if (useRealApi) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authAPI.resetPassword(token, password);
        setLoading(false);
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error('Reset password error:', error);
        setError(error.response?.data?.message || 'Failed to reset password.');
        setLoading(false);
        return { success: false, error: error.response?.data?.message || 'Failed to reset password' };
      }
    } else {
      // Mock reset password
      return { success: true, message: 'Password reset successfully (mock)' };
    }
  };

  // Select tenant function (for multi-tenant login flow)
  const selectTenant = (tenantId) => {
    // This function is primarily for the mock flow
    const selectedTenant = tenants.find(t => t.id === tenantId);
    if (selectedTenant) {
      setTenant(selectedTenant);
      return { success: true, tenant: selectedTenant };
    }
    return { success: false, error: 'Invalid tenant' };
  };

  // Toggle between real API and mock data (for development)
  const toggleApiMode = () => {
    setUseRealApi(!useRealApi);
    // Clear auth state when switching modes
    setUser(null);
    setTenant(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
  };

  // Context value
  const value = {
    user,
    tenant,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    selectTenant,
    isAuthenticated: !!user,
    loading,
    error,
    useRealApi,
    toggleApiMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;