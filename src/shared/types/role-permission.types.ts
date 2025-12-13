/**
 * Role and Permission Types
 * Defines the structure for roles, permissions, and permission management
 */

// Permission action types
export enum PermissionAction {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  APPROVE = 'approve',
  EXPORT = 'export'
}

// Permission categories
export enum PermissionCategory {
  BOOKINGS = 'bookings',
  CUSTOMERS = 'customers',
  FINANCE = 'finance',
  TOURS = 'tours',
  MARKETING = 'marketing',
  USERS = 'users',
  REPORTS = 'reports',
  SETTINGS = 'settings'
}

// Permission feature areas
export enum PermissionFeature {
  // Bookings
  BOOKING_VIEW = 'booking.view',
  BOOKING_CREATE = 'booking.create',
  BOOKING_EDIT = 'booking.edit',
  BOOKING_DELETE = 'booking.delete',
  BOOKING_CONFIRM = 'booking.confirm',
  BOOKING_CANCEL = 'booking.cancel',
  BOOKING_INVOICE = 'booking.invoice',

  // Customers
  CUSTOMER_VIEW = 'customer.view',
  CUSTOMER_CREATE = 'customer.create',
  CUSTOMER_EDIT = 'customer.edit',
  CUSTOMER_DELETE = 'customer.delete',
  CUSTOMER_EXPORT = 'customer.export',
  CUSTOMER_GROUPS = 'customer.groups',
  CUSTOMER_COMMUNICATION = 'customer.communication',

  // Finance
  FINANCE_VIEW = 'finance.view',
  FINANCE_PAYMENTS = 'finance.payments',
  FINANCE_REFUNDS = 'finance.refunds',
  FINANCE_INVOICES = 'finance.invoices',
  FINANCE_REPORTS = 'finance.reports',
  FINANCE_FORTNOX = 'finance.fortnox',

  // Tours
  TOUR_VIEW = 'tour.view',
  TOUR_CREATE = 'tour.create',
  TOUR_EDIT = 'tour.edit',
  TOUR_DELETE = 'tour.delete',
  TOUR_PRICING = 'tour.pricing',
  TOUR_ADDONS = 'tour.addons',
  TOUR_ITINERARY = 'tour.itinerary',

  // Marketing
  MARKETING_CAMPAIGNS = 'marketing.campaigns',
  MARKETING_EMAIL = 'marketing.email',
  MARKETING_ANALYTICS = 'marketing.analytics',
  MARKETING_PROMO = 'marketing.promo',

  // Users & Roles
  USER_MANAGE = 'user.manage',
  ROLE_MANAGE = 'role.manage',
  PERMISSION_MANAGE = 'permission.manage',

  // Reports
  REPORT_VIEW = 'report.view',
  REPORT_EXPORT = 'report.export',

  // Settings
  SETTINGS_COMPANY = 'settings.company',
  SETTINGS_EMAIL = 'settings.email',
  SETTINGS_SYSTEM = 'settings.system',
  SETTINGS_LOGS = 'settings.logs'
}

// Individual Permission
export interface Permission {
  id: string;
  feature: PermissionFeature;
  category: PermissionCategory;
  action: PermissionAction;
  label: string;
  description: string;
  inherited?: boolean; // Whether this permission is inherited from a parent role
}

// Role interface
export interface Role {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean; // Built-in roles cannot be deleted
  isTemplate: boolean; // Template roles for quick setup
  parentRoleId?: string; // For role inheritance
  permissions: PermissionFeature[]; // Array of permission feature IDs
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  userCount: number; // Number of users with this role
}

// Role Template
export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from lucide-react
  permissions: PermissionFeature[];
  category: 'preset' | 'custom';
}

// User Role Assignment (for many-to-many)
export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
  assignedByName: string;
}

// Permission Audit Log Entry
export interface PermissionAuditLog {
  id: string;
  timestamp: Date;
  action: 'ROLE_CREATED' | 'ROLE_UPDATED' | 'ROLE_DELETED' | 'PERMISSION_GRANTED' | 'PERMISSION_REVOKED' | 'ROLE_ASSIGNED' | 'ROLE_UNASSIGNED';
  targetType: 'role' | 'permission' | 'user';
  targetId: string;
  targetName: string;
  changedBy: string;
  changedByName: string;
  details: string; // Detailed description of the change
  affectedUsers?: number; // Number of users affected by this change
}

// Permission category with features
export interface PermissionCategoryGroup {
  category: PermissionCategory;
  label: string;
  icon: string;
  description: string;
  features: Permission[];
}

// Role Form Data
export interface RoleFormData {
  name: string;
  description: string;
  parentRoleId?: string;
  permissions: PermissionFeature[];
}

// Bulk Permission Update
export interface BulkPermissionUpdate {
  roleId: string;
  permissionsToAdd: PermissionFeature[];
  permissionsToRemove: PermissionFeature[];
}
