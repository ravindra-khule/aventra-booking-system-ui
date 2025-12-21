import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, role: UserRole, password?: string) => {
    try {
      // For demo purposes, we accept any password or no password
      // In production, this would validate with backend
      const userData = getDemoUserData(email, role);
      setUser(userData);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === UserRole.SUPER_ADMIN || 
                  user?.role === UserRole.ADMIN || 
                  user?.role === UserRole.SUPPORT ||
                  user?.role === UserRole.ACCOUNTANT ||
                  user?.role === UserRole.DEVELOPER;

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