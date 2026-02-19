import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextDefinition';
import type { User, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      
      if (token && savedUser) {
        try {
          // Verify token is still valid
          const isValid = await authService.verifyToken(token);
          if (isValid) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token expired, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      
      // Save to localStorage
      localStorage.setItem(TOKEN_KEY, response.tokens.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    authService.logout();
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    try {
      const isValid = await authService.verifyToken(token);
      return isValid;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
