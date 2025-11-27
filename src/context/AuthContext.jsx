import React, { createContext, useState } from 'react';

const AuthContext = createContext(null);

// Initialize user from localStorage outside component
const getInitialUser = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  // Use lazy initialization - function runs only once on mount
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log(setLoading)
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

