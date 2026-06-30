import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, clearAuth, decodeToken } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app load, restore credentials from localStorage
    const savedToken = getToken();
    const savedUser = getUser();

    if (savedToken) {
      setTokenState(savedToken);
      if (savedUser) {
        setUserState(savedUser);
      } else {
        // Fallback: decode token to try to reconstruct minimal state
        const decoded = decodeToken(savedToken);
        if (decoded) {
          const defaultUser = {
            id: decoded.sub || '1',
            email: 'user@example.com',
            name: 'User',
            role: 'user',
          };
          setUserState(defaultUser);
          setUser(defaultUser);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (accessToken, emailInput = '') => {
    setToken(accessToken);
    setTokenState(accessToken);

    const decoded = decodeToken(accessToken);
    const userId = decoded?.sub || '1';

    // Infer name and role from email if backend only provides token
    // Admin check: email contains "admin" (e.g., admin@example.com)
    const normalizedEmail = emailInput || 'user@example.com';
    const computedRole = normalizedEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
    const emailPrefix = normalizedEmail.split('@')[0];
    const computedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    const userObj = {
      id: userId,
      email: normalizedEmail,
      name: computedName,
      role: computedRole,
    };

    setUser(userObj);
    setUserState(userObj);
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  const updateRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setUserState(updatedUser);
    }
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    token,
    user,
    loading,
    isAdmin,
    login,
    logout,
    updateRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
