/**
 * Common Types - Shared across all features
 * These are base types used throughout the application
 */

// User roles for access control
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  ACCOUNTANT = 'ACCOUNTANT',
  DEVELOPER = 'DEVELOPER'
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
  // Extended stats from dashboard-stats.php
  totalTours?: number;
  totalBookings?: number;
  totalUsers?: number;
  totalCustomers?: number;
  monthlyRevenue?: number;
  lastMonthRevenue?: number;
  revenueGrowth?: number;
  pendingBookings?: number;
  confirmedBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  bookingsThisMonth?: number;
  newCustomersThisMonth?: number;
  newCustomersLastMonth?: number;
  pendingPayments?: number;
  unpaidBalance?: number;
  averageBookingValue?: number;
  paymentSuccessRate?: number;
  cancellationRate?: number;
  repeatCustomerRate?: number;
  averageCustomerLTV?: number;
  lowAvailabilityTours?: number;
  statusBreakdown?: Record<string, number>;
  revenueByMonth?: { month: string; revenue: number; bookings: number }[];
  customersByMonth?: { month: string; count: number }[];
  generatedAt?: string;
}
