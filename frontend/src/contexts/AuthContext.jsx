"use client"
import { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../app/services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    // Fix: Add check for window object to handle server-side rendering
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          // Handle invalid stored JSON
          console.error("Failed to parse stored user data:", error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    }
  }, []);

  const register = async (userData) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await registerUser(userData);
      
      // Store the access_token instead of token
      if (response.access_token) {
        const userInfo = { name: userData.name, email: userData.email };
        
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        setToken(response.access_token);
        setUser(userInfo);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      setAuthError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await loginUser(credentials);
      
      // Store the access_token instead of token
      if (response.access_token) {
        const userInfo = { email: credentials.email };
        
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        setToken(response.access_token);
        setUser(userInfo);
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      setAuthError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue = {
    user,
    token,
    isAuthenticated,
    isLoading,
    authError,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};