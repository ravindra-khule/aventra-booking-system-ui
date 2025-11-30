import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, role: UserRole) => {
    try {
      const userData = await AuthService.login(email, role);
      // Ensure the user has all required fields for the new User type
      const fullUserData: User = {
        ...userData,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        lastLogin: new Date(),
        twoFactorEnabled: false
      };
      setUser(fullUserData);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPPORT;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin }}>
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