/**
 * RBAC Service - Role-Based Access Control
 */

export interface Role {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  user_count: number;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export const RBACService = {
  /**
   * Get all roles with their permissions
   */
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/rbac-roles-list.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching roles:', data.error);
        return [];
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  /**
   * Get user's roles
   */
  getUserRoles: async (userId: number): Promise<Role[]> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/rbac-user-roles.php?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching user roles:', data.error);
        return [];
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  },

  /**
   * Assign role to user
   */
  assignRoleToUser: async (userId: number, roleId: number): Promise<boolean> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/rbac-user-roles.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          role_id: roleId
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error assigning role:', data.error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      return false;
    }
  },

  /**
   * Check if user has a specific permission
   */
  checkPermission: async (userId: number, permission: string): Promise<boolean> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(
        `${API_URL}/api/rbac-check-permission.php?user_id=${userId}&permission=${encodeURIComponent(permission)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error checking permission:', data.error);
        return false;
      }
      
      return data.has_permission || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  },

  /**
   * Check multiple permissions (requires at least one)
   */
  checkAnyPermission: async (userId: number, permissions: string[]): Promise<boolean> => {
    try {
      const results = await Promise.all(
        permissions.map(perm => RBACService.checkPermission(userId, perm))
      );
      return results.some(result => result === true);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  },

  /**
   * Check all permissions (requires all of them)
   */
  checkAllPermissions: async (userId: number, permissions: string[]): Promise<boolean> => {
    try {
      const results = await Promise.all(
        permissions.map(perm => RBACService.checkPermission(userId, perm))
      );
      return results.every(result => result === true);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }
};

// Common permission constants for easier access
export const PERMISSIONS = {
  // Booking
  BOOKING_VIEW: 'booking.view',
  BOOKING_CREATE: 'booking.create',
  BOOKING_UPDATE: 'booking.update',
  BOOKING_DELETE: 'booking.delete',
  BOOKING_CANCEL: 'booking.cancel',
  BOOKING_EXPORT: 'booking.export',

  // Customer
  CUSTOMER_VIEW: 'customer.view',
  CUSTOMER_CREATE: 'customer.create',
  CUSTOMER_UPDATE: 'customer.update',
  CUSTOMER_DELETE: 'customer.delete',
  CUSTOMER_EXPORT: 'customer.export',
  CUSTOMER_EMAIL: 'customer.email',

  // Tour
  TOUR_VIEW: 'tour.view',
  TOUR_CREATE: 'tour.create',
  TOUR_UPDATE: 'tour.update',
  TOUR_DELETE: 'tour.delete',
  TOUR_AVAILABILITY: 'tour.availability',

  // Payment
  PAYMENT_VIEW: 'payment.view',
  PAYMENT_PROCESS: 'payment.process',
  PAYMENT_REFUND: 'payment.refund',
  PAYMENT_EXPORT: 'payment.export',

  // Promo
  PROMO_VIEW: 'promo.view',
  PROMO_CREATE: 'promo.create',
  PROMO_UPDATE: 'promo.update',
  PROMO_DELETE: 'promo.delete',

  // Report
  REPORT_VIEW: 'report.view',
  REPORT_EXPORT: 'report.export',
  REPORT_CREATE: 'report.create',
  REPORT_SCHEDULE: 'report.schedule',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',
  SETTINGS_EMAIL: 'settings.email',
  SETTINGS_INTEGRATIONS: 'settings.integrations',
  SETTINGS_PAYMENT: 'settings.payment',

  // User
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_ROLES: 'user.roles',
  USER_PERMISSIONS: 'user.permissions',

  // System
  SYSTEM_LOGS: 'system.logs',
  SYSTEM_AUDIT: 'system.audit',
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_INTEGRATIONS: 'system.integrations'
} as const;

// Role names for easy reference
export const ROLE_NAMES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SUPPORT_AGENT: 'Support Agent',
  ACCOUNTANT: 'Accountant',
  TOUR_OPERATOR: 'Tour Operator'
} as const;
