import React, { createContext, useContext, useState, useEffect } from 'react';
import { allUsers, tenants } from '../data';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTenant = localStorage.getItem('tenant');
    
    if (storedUser && storedTenant) {
      setUser(JSON.parse(storedUser));
      setTenant(JSON.parse(storedTenant));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password, tenantId) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just find the user in our mock data
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
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setTenant(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
  };

  // Select tenant function (for multi-tenant login flow)
  const selectTenant = (tenantId) => {
    const selectedTenant = tenants.find(t => t.id === tenantId);
    if (selectedTenant) {
      setTenant(selectedTenant);
      return { success: true, tenant: selectedTenant };
    }
    return { success: false, error: 'Invalid tenant' };
  };

  // Context value
  const value = {
    user,
    tenant,
    login,
    logout,
    selectTenant,
    isAuthenticated: !!user,
    loading
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