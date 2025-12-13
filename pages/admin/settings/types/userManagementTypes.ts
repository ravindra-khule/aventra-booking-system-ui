/**
 * Admin User Management Types
 * Defines all types for the user management module
 */

export type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'Support';
export type UserStatus = 'active' | 'inactive' | 'pending';
export type InvitationStatus = 'pending' | 'accepted' | 'expired';
export type ActionType = 'login' | 'create_user' | 'edit_user' | 'delete_user' | 'change_password' | 'enable_2fa' | 'disable_2fa' | 'update_role' | 'logout';

export interface AdminUser {
  id: string;
  profileImage?: string;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  lastLogin: Date | null;
  lastLoginBrowser?: string;
  lastLoginIP?: string;
  lastLoginDevice?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  forcePasswordReset?: boolean;
}

export interface UserInvitation {
  id: string;
  email: string;
  roles: UserRole[];
  status: InvitationStatus;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  timestamp: Date;
  action: ActionType;
  module: string;
  ipAddress: string;
  details?: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  device: string;
  ipAddress: string;
  loginTime: Date;
  lastActivity: Date;
  location?: string;
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays: number;
}

export interface CreateUserFormData {
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  profileImage?: File;
  temporaryPassword: string;
  forcePasswordReset: boolean;
}

export interface BulkActionPayload {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'assignRole';
  roleToAssign?: UserRole;
}

export interface UserFilterOptions {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
