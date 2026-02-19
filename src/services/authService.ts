import type { LoginCredentials, LoginResponse } from '../types/auth';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // For now, simulate API call
    // TODO: Replace with actual API call when backend is ready
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      return {
        user: {
          id: '1',
          username: credentials.username,
        },
        tokens: {
          accessToken: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        },
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async verifyToken(token: string): Promise<boolean> {
    // For now, just check if token exists
    // TODO: Replace with actual token verification
    return token === 'mock-jwt-token';
  }

  logout(): void {
    // TODO: Call logout endpoint if needed
    console.log('Logged out');
  }

  getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
