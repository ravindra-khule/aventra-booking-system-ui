/**
 * Granular Permission System
 * 
 * This module defines the granular permission system that allows fine-grained
 * access control beyond role-based permissions. Admins can assign specific
 * module access to individual users.
 */

import { UserRole } from './common.types';

/**
 * Core Permission Modules
 * These represent the main sections/features of the admin dashboard
 */
export enum PermissionModule {
  // Booking Management
  BOOKING = 'BOOKING',
  
  // Customer Management
  CUSTOMER = 'CUSTOMER',
  
  // Marketing & Campaigns
  MARKETING = 'MARKETING',
  
  // Finance & Accounting
  FINANCE = 'FINANCE',
  
  // System Tools & Utilities
  TOOLS = 'TOOLS',
  
  // Settings & Configuration
  SETTINGS = 'SETTINGS',
  
  // User Management
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  
  // Reports & Analytics
  REPORTS = 'REPORTS',
}

/**
 * Granular Permissions within each module
 * Defines specific actions users can perform
 */
export enum PermissionAction {
  VIEW = 'VIEW',           // Can view/read data
  CREATE = 'CREATE',       // Can create new records
  EDIT = 'EDIT',          // Can edit existing records
  DELETE = 'DELETE',      // Can delete records
  EXPORT = 'EXPORT',      // Can export data
  IMPORT = 'IMPORT',      // Can import data
  MANAGE = 'MANAGE',      // Full management access (all actions)
}

/**
 * Module Permission Configuration
 * Defines what actions are available for a specific module
 */
export interface ModulePermission {
  module: PermissionModule;
  actions: PermissionAction[];
  enabled: boolean;
}

/**
 * User Permission Profile
 * Complete permission configuration for a user
 */
export interface UserPermissions {
  userId: string;
  roleId: UserRole;
  
  // Module-level permissions
  modules: ModulePermission[];
  
  // Custom permissions (override defaults)
  customPermissions?: {
    module: PermissionModule;
    actions: PermissionAction[];
    expiresAt?: Date; // Optional expiration for temporary access
    grantedBy?: string; // User ID who granted this permission
    grantedAt?: Date;
    reason?: string; // Why this permission was granted
  }[];
  
  // Metadata
  lastUpdated: Date;
  updatedBy?: string; // User ID who last updated permissions
}

/**
 * Permission Template
 * Predefined permission sets that can be quickly assigned
 */
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  modules: ModulePermission[];
  isDefault?: boolean; // Default template for a role
  roleId?: UserRole; // Associated role if any
}

/**
 * Default Permission Templates for Each Role
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionModule[]> = {
  [UserRole.SUPER_ADMIN]: [
    PermissionModule.BOOKING,
    PermissionModule.CUSTOMER,
    PermissionModule.MARKETING,
    PermissionModule.FINANCE,
    PermissionModule.TOOLS,
    PermissionModule.SETTINGS,
    PermissionModule.USER_MANAGEMENT,
    PermissionModule.REPORTS,
  ],
  
  [UserRole.ADMIN]: [
    PermissionModule.BOOKING,
    PermissionModule.CUSTOMER,
    PermissionModule.MARKETING,
    PermissionModule.FINANCE,
    PermissionModule.TOOLS,
    PermissionModule.USER_MANAGEMENT,
    PermissionModule.REPORTS,
  ],
  
  [UserRole.SUPPORT]: [
    PermissionModule.BOOKING,
    PermissionModule.CUSTOMER,
    PermissionModule.TOOLS,
  ],
  
  [UserRole.ACCOUNTANT]: [
    PermissionModule.FINANCE,
    PermissionModule.BOOKING,
    PermissionModule.CUSTOMER,
    PermissionModule.REPORTS,
  ],
  
  [UserRole.DEVELOPER]: [
    PermissionModule.TOOLS,
    PermissionModule.SETTINGS,
    PermissionModule.REPORTS,
  ],
  
  [UserRole.CUSTOMER]: [],
  [UserRole.GUEST]: [],
};

/**
 * Module Information
 * Metadata about each permission module
 */
export interface ModuleInfo {
  module: PermissionModule;
  label: string;
  description: string;
  icon: string; // Icon name from lucide-react
  color: string; // Tailwind color class
  availableActions: PermissionAction[];
}

/**
 * Module Metadata Configuration
 */
export const MODULE_METADATA: Record<PermissionModule, ModuleInfo> = {
  [PermissionModule.BOOKING]: {
    module: PermissionModule.BOOKING,
    label: 'Booking Management',
    description: 'Manage tour bookings, calendar, waitlist, and availability',
    icon: 'Calendar',
    color: 'blue',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.DELETE,
      PermissionAction.EXPORT,
    ],
  },
  
  [PermissionModule.CUSTOMER]: {
    module: PermissionModule.CUSTOMER,
    label: 'Customer Management',
    description: 'Manage customers, profiles, groups, and communications',
    icon: 'Users',
    color: 'green',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.DELETE,
      PermissionAction.EXPORT,
      PermissionAction.IMPORT,
    ],
  },
  
  [PermissionModule.MARKETING]: {
    module: PermissionModule.MARKETING,
    label: 'Marketing & Campaigns',
    description: 'Manage campaigns, promo codes, email templates, and analytics',
    icon: 'Megaphone',
    color: 'purple',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.DELETE,
      PermissionAction.EXPORT,
    ],
  },
  
  [PermissionModule.FINANCE]: {
    module: PermissionModule.FINANCE,
    label: 'Finance & Accounting',
    description: 'Manage invoices, payments, financial reports, and Fortnox integration',
    icon: 'DollarSign',
    color: 'amber',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.EXPORT,
    ],
  },
  
  [PermissionModule.TOOLS]: {
    module: PermissionModule.TOOLS,
    label: 'Tools & Utilities',
    description: 'Access system tools, itinerary builder, and utility features',
    icon: 'Wrench',
    color: 'slate',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.MANAGE,
    ],
  },
  
  [PermissionModule.SETTINGS]: {
    module: PermissionModule.SETTINGS,
    label: 'Settings & Configuration',
    description: 'Configure system settings, integrations, and preferences',
    icon: 'Settings',
    color: 'gray',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.EDIT,
    ],
  },
  
  [PermissionModule.USER_MANAGEMENT]: {
    module: PermissionModule.USER_MANAGEMENT,
    label: 'User Management',
    description: 'Create and manage user accounts and permissions',
    icon: 'UserCog',
    color: 'indigo',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.CREATE,
      PermissionAction.EDIT,
      PermissionAction.DELETE,
    ],
  },
  
  [PermissionModule.REPORTS]: {
    module: PermissionModule.REPORTS,
    label: 'Reports & Analytics',
    description: 'View reports, analytics, and business intelligence',
    icon: 'BarChart3',
    color: 'teal',
    availableActions: [
      PermissionAction.VIEW,
      PermissionAction.EXPORT,
    ],
  },
};

/**
 * Permission Check Result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string; // Why permission was denied
  expiresAt?: Date; // When temporary permission expires
}

/**
 * API Request/Response Types
 */

// Create User with Permissions
export interface CreateUserWithPermissionsRequest {
  // User basic info
  name: string;
  email: string;
  password: string;
  role: UserRole;
  
  // Permission configuration
  permissions: {
    modules: PermissionModule[];
    customPermissions?: {
      module: PermissionModule;
      actions: PermissionAction[];
      expiresAt?: string; // ISO date string
      reason?: string;
    }[];
  };
}

export interface CreateUserWithPermissionsResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    permissions: UserPermissions;
  };
  message: string;
}

// Update User Permissions
export interface UpdateUserPermissionsRequest {
  userId: string;
  permissions: {
    modules: PermissionModule[];
    customPermissions?: {
      module: PermissionModule;
      actions: PermissionAction[];
      expiresAt?: string; // ISO date string
      reason?: string;
    }[];
  };
  updatedBy: string; // Admin user ID
}

export interface UpdateUserPermissionsResponse {
  success: boolean;
  permissions: UserPermissions;
  message: string;
}

// Get User Permissions
export interface GetUserPermissionsRequest {
  userId: string;
}

export interface GetUserPermissionsResponse {
  success: boolean;
  permissions: UserPermissions;
}

// Check User Permission
export interface CheckUserPermissionRequest {
  userId: string;
  module: PermissionModule;
  action?: PermissionAction;
}

export interface CheckUserPermissionResponse {
  success: boolean;
  result: PermissionCheckResult;
}

// Grant Temporary Access
export interface GrantTemporaryAccessRequest {
  userId: string;
  module: PermissionModule;
  actions: PermissionAction[];
  duration: number; // Duration in hours
  reason: string;
  grantedBy: string; // Admin user ID
}

export interface GrantTemporaryAccessResponse {
  success: boolean;
  permission: UserPermissions['customPermissions'][0];
  message: string;
}

// Revoke Access
export interface RevokeAccessRequest {
  userId: string;
  module: PermissionModule;
  revokedBy: string; // Admin user ID
}

export interface RevokeAccessResponse {
  success: boolean;
  message: string;
}

// Get Permission Templates
export interface GetPermissionTemplatesResponse {
  success: boolean;
  templates: PermissionTemplate[];
}

// Apply Permission Template
export interface ApplyPermissionTemplateRequest {
  userId: string;
  templateId: string;
  appliedBy: string; // Admin user ID
}

export interface ApplyPermissionTemplateResponse {
  success: boolean;
  permissions: UserPermissions;
  message: string;
}

/**
 * Permission Audit Log Entry
 */
export interface PermissionAuditLog {
  id: string;
  userId: string;
  action: 'GRANTED' | 'REVOKED' | 'UPDATED' | 'EXPIRED';
  module: PermissionModule;
  permissions: PermissionAction[];
  performedBy: string; // Admin user ID
  performedAt: Date;
  reason?: string;
  expiresAt?: Date;
}

/**
 * Bulk Permission Update
 */
export interface BulkUpdatePermissionsRequest {
  updates: {
    userId: string;
    modules: PermissionModule[];
  }[];
  updatedBy: string;
}

export interface BulkUpdatePermissionsResponse {
  success: boolean;
  updated: number;
  failed: number;
  errors?: { userId: string; error: string }[];
}
