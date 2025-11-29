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

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

// Dashboard statistics interface
export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  pendingInquiries: number;
  occupancyRate: number;
}
