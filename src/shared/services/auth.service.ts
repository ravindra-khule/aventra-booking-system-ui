/**
 * Auth Service - JWT Authentication and Authorization
 * Handles login, logout, token refresh, and user verification
 * Uses JWT tokens stored in localStorage
 */

import { User, UserRole } from '../types/common.types';

const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const TOKEN_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

/**
 * Auth Service
 * Handles user authentication (mock implementation)
 */
export const AuthService = {
  /**
   * Login with email and password
   * Returns user data and JWT token
   * 
   * @param email - User email address
   * @param password - User password
   * @returns Promise with user info and token
   * @throws Error if login fails
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Auth Login - Attempting login with:', email);
      console.log('Auth Login - API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/api/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Auth Login - Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Auth Login - Response data:', data);

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user in localStorage
      localStorage.setItem(TOKEN_KEY, data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.data));
      
      // Store token expiration time
      if (data.data.expiresIn) {
        const expiresAt = Date.now() + (data.data.expiresIn * 1000);
        localStorage.setItem('token_expires_at', expiresAt.toString());
      }

      console.log('Auth Login - Success:', data.data);
      return data.data;
    } catch (error) {
      console.error('Auth Login - Full error:', error);
      console.error('Auth Login - Error message:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user in localStorage
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));

      return data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Logout user and invalidate token
   * Calls backend to blacklist the JWT token
   * 
   * @returns Promise<void>
   */
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        await fetch(`${API_URL}/api/logout.php`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('token_expires_at');
    }
  },

  /**
   * Get all users (requires JWT token and admin role)
   * 
   * @returns Promise with array of users
   * @throws Error if request fails
   */
  getUsers: async (): Promise<any[]> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(`${API_URL}/api/users.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      return data.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  /**
   * Get current user from localStorage
   * 
   * @returns User object or null if not authenticated
   */
  getCurrentUser: (): AuthResponse | null => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get auth token from localStorage
   * 
   * @returns JWT token or null if not authenticated
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated (has valid token)
   * 
   * @returns boolean - True if token exists
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  },

  /**
   * Verify current token with backend
   * Useful for checking if token is still valid on app load
   * 
   * @returns Promise with user data if token is valid
   * @throws Error if token is invalid or expired
   */
  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/api/auth/me.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        // Token is invalid, clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('token_expires_at');
        throw new Error(data.error || 'Token verification failed');
      }

      // Update user data in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(data.data));

      return data.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  /**
   * Refresh JWT token
   * Issues a new token when the current one is still valid
   * Useful for extending session without requiring re-authentication
   * 
   * @returns Promise with new token
   * @throws Error if refresh fails
   */
  refreshToken: async (): Promise<string> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/api/auth/refresh.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Token refresh failed');
      }

      // Store new token
      const newToken = data.data.token;
      localStorage.setItem(TOKEN_KEY, newToken);

      // Update expiration time
      if (data.data.expiresIn) {
        const expiresAt = Date.now() + (data.data.expiresIn * 1000);
        localStorage.setItem('token_expires_at', expiresAt.toString());
      }

      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  /**
   * Check if token is about to expire and refresh if needed
   * Should be called periodically (e.g., every 30 minutes)
   * 
   * @param warningTimeMs - Time before expiration to start refreshing (default: 1 hour)
   * @returns Promise<boolean> - True if token was refreshed
   */
  checkAndRefreshToken: async (warningTimeMs: number = 60 * 60 * 1000): Promise<boolean> => {
    try {
      const expiresAtStr = localStorage.getItem('token_expires_at');
      if (!expiresAtStr) {
        return false;
      }

      const expiresAt = parseInt(expiresAtStr, 10);
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // If token expires within warning time, refresh it
      if (timeUntilExpiry < warningTimeMs) {
        await AuthService.refreshToken();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token check and refresh error:', error);
      return false;
    }
  },

  /**
   * Get token with Authorization Bearer prefix
   * Useful for fetch requests
   * 
   * @returns string - "Bearer <token>" or empty string if no token
   */
  getAuthHeader: (): string => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? `Bearer ${token}` : '';
  }
};
