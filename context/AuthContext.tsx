import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage keys
const USER_STORAGE_KEY = 'aventra_auth_user';

// Demo user data for each role
const getDemoUserData = (email: string, role: UserRole): User => {
  const roleNames: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.ADMIN]: 'Admin User',
    [UserRole.SUPPORT]: 'Support Agent',
    [UserRole.ACCOUNTANT]: 'Accountant',
    [UserRole.DEVELOPER]: 'Developer',
    [UserRole.CUSTOMER]: 'Guest User',
    [UserRole.GUEST]: 'Guest',
  };

  return {
    id: `demo_${role}_${Date.now()}`,
    name: roleNames[role] || email.split('@')[0],
    email: email,
    role: role,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    lastLogin: new Date(),
    twoFactorEnabled: false,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
  };
};

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
    const restoredUser = restoreUserFromStorage();
    if (restoredUser) {
      setUser(restoredUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole, password?: string) => {
    try {
      // For demo purposes, we accept any password or no password
      // In production, this would validate with backend
      const userData = getDemoUserData(email, role);
      setUser(userData);
      // Persist to localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    // Clear from localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
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