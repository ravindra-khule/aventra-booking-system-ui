/**
 * Common Types - Shared across all features
 * These are base types used throughout the application
 */

// User roles for access control
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  ACCOUNTANT = 'ACCOUNTANT'
}

// User status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  createdBy?: string;
  notes?: string;
}

// User activity log
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// User invitation
export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
}

// Dashboard statistics interface
export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  pendingInquiries: number;
  occupancyRate: number;
}
