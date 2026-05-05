import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { AuthService } from '../src/shared/services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
const USER_STORAGE_KEY = 'aventra_auth_user';
const TOKEN_STORAGE_KEY = 'auth_token';

// Helper function to restore user from localStorage
const restoreUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      const userData = JSON.parse(stored);
      // Restore date objects
      userData.createdAt = new Date(userData.createdAt);
      userData.lastLogin = new Date(userData.lastLogin);
      return userData;
    }
  } catch (error) {
    console.error('Failed to restore user from storage:', error);
  }
  return null;
};

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const restoreAuth = () => {
      try {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        
        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      // Call real backend login API with JWT
      const response = await AuthService.login(email, password);
      
      // Convert response to User object format
      const userData: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as UserRole,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        lastLogin: new Date(),
        twoFactorEnabled: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.role}`,
      };
      
      setUser(userData);
      
      // Token is already stored in localStorage by AuthService
      // But we also store user data for quick access
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to blacklist token
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error", error);
      // Continue with local logout even if API fails
    } finally {
      setUser(null);
      // Clear localStorage
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  const isAdmin = user?.role === UserRole.SUPER_ADMIN || 
                  user?.role === UserRole.ADMIN || 
                  user?.role === UserRole.SUPPORT ||
                  user?.role === UserRole.ACCOUNTANT ||
                  user?.role === UserRole.DEVELOPER;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};