/**
 * Permission Utilities
 * 
 * Helper functions for checking and managing user permissions
 */

import {
  PermissionModule,
  PermissionAction,
  UserPermissions,
  ModulePermission,
  PermissionCheckResult,
  DEFAULT_ROLE_PERMISSIONS,
} from '../types/permissions.types';
import { UserRole } from '../types/common.types';

/**
 * Check if user has access to a specific module
 */
export const hasModuleAccess = (
  userPermissions: UserPermissions,
  module: PermissionModule
): boolean => {
  // Check in standard module permissions
  const modulePermission = userPermissions.modules.find(m => m.module === module);
  if (modulePermission?.enabled) {
    return true;
  }

  // Check in custom permissions (including temporary)
  const customPermission = userPermissions.customPermissions?.find(
    cp => cp.module === module
  );
  
  if (customPermission) {
    // Check if permission hasn't expired
    if (customPermission.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(customPermission.expiresAt);
      return expiresAt > now;
    }
    return true;
  }

  return false;
};

/**
 * Check if user has specific action permission for a module
 */
export const hasActionPermission = (
  userPermissions: UserPermissions,
  module: PermissionModule,
  action: PermissionAction
): PermissionCheckResult => {
  // First check if user has module access
  if (!hasModuleAccess(userPermissions, module)) {
    return {
      hasPermission: false,
      reason: 'No access to this module',
    };
  }

  // Check in standard module permissions
  const modulePermission = userPermissions.modules.find(m => m.module === module);
  if (modulePermission?.enabled) {
    // Check if action is allowed
    const hasAction = modulePermission.actions.includes(action) ||
                      modulePermission.actions.includes(PermissionAction.MANAGE);
    
    if (hasAction) {
      return { hasPermission: true };
    }
  }

  // Check in custom permissions
  const customPermission = userPermissions.customPermissions?.find(
    cp => cp.module === module
  );

  if (customPermission) {
    // Check expiration
    if (customPermission.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(customPermission.expiresAt);
      
      if (expiresAt <= now) {
        return {
          hasPermission: false,
          reason: 'Temporary permission has expired',
        };
      }
    }

    // Check if action is allowed
    const hasAction = customPermission.actions.includes(action) ||
                      customPermission.actions.includes(PermissionAction.MANAGE);
    
    if (hasAction) {
      return {
        hasPermission: true,
        expiresAt: customPermission.expiresAt,
      };
    }
  }

  return {
    hasPermission: false,
    reason: `No permission for ${action} action`,
  };
};

/**
 * Check if user can perform multiple actions on a module
 */
export const hasAllActions = (
  userPermissions: UserPermissions,
  module: PermissionModule,
  actions: PermissionAction[]
): boolean => {
  return actions.every(action => 
    hasActionPermission(userPermissions, module, action).hasPermission
  );
};

/**
 * Check if user can perform any of the specified actions on a module
 */
export const hasAnyAction = (
  userPermissions: UserPermissions,
  module: PermissionModule,
  actions: PermissionAction[]
): boolean => {
  return actions.some(action => 
    hasActionPermission(userPermissions, module, action).hasPermission
  );
};

/**
 * Get all modules a user has access to
 */
export const getAccessibleModules = (
  userPermissions: UserPermissions
): PermissionModule[] => {
  const modules = new Set<PermissionModule>();

  // Add from standard permissions
  userPermissions.modules.forEach(m => {
    if (m.enabled) {
      modules.add(m.module);
    }
  });

  // Add from custom permissions (check expiration)
  const now = new Date();
  userPermissions.customPermissions?.forEach(cp => {
    if (!cp.expiresAt || new Date(cp.expiresAt) > now) {
      modules.add(cp.module);
    }
  });

  return Array.from(modules);
};

/**
 * Get actions available for a module
 */
export const getAvailableActions = (
  userPermissions: UserPermissions,
  module: PermissionModule
): PermissionAction[] => {
  const actions = new Set<PermissionAction>();

  // Get from standard permissions
  const modulePermission = userPermissions.modules.find(m => m.module === module);
  if (modulePermission?.enabled) {
    modulePermission.actions.forEach(action => actions.add(action));
  }

  // Get from custom permissions
  const customPermission = userPermissions.customPermissions?.find(
    cp => cp.module === module
  );
  
  if (customPermission) {
    // Check expiration
    if (!customPermission.expiresAt || new Date(customPermission.expiresAt) > new Date()) {
      customPermission.actions.forEach(action => actions.add(action));
    }
  }

  return Array.from(actions);
};

/**
 * Check if user has any admin-level module access
 */
export const hasAnyAdminAccess = (userPermissions: UserPermissions): boolean => {
  const adminModules = [
    PermissionModule.USER_MANAGEMENT,
    PermissionModule.SETTINGS,
    PermissionModule.TOOLS,
  ];

  return adminModules.some(module => hasModuleAccess(userPermissions, module));
};

/**
 * Create default permissions for a role
 */
export const createDefaultPermissions = (
  userId: string,
  role: UserRole
): UserPermissions => {
  const defaultModules = DEFAULT_ROLE_PERMISSIONS[role] || [];

  const modules: ModulePermission[] = defaultModules.map(module => ({
    module,
    actions: [PermissionAction.VIEW, PermissionAction.EDIT, PermissionAction.CREATE],
    enabled: true,
  }));

  return {
    userId,
    roleId: role,
    modules,
    customPermissions: [],
    lastUpdated: new Date(),
  };
};

/**
 * Merge custom permissions with standard permissions
 */
export const mergePermissions = (
  standardPermissions: ModulePermission[],
  customPermissions: UserPermissions['customPermissions'] = []
): ModulePermission[] => {
  const merged = new Map<PermissionModule, ModulePermission>();

  // Add standard permissions
  standardPermissions.forEach(perm => {
    merged.set(perm.module, { ...perm });
  });

  // Merge custom permissions (if not expired)
  const now = new Date();
  customPermissions.forEach(custom => {
    if (!custom.expiresAt || new Date(custom.expiresAt) > now) {
      const existing = merged.get(custom.module);
      
      if (existing) {
        // Merge actions
        const allActions = new Set([...existing.actions, ...custom.actions]);
        existing.actions = Array.from(allActions);
      } else {
        // Add new module permission
        merged.set(custom.module, {
          module: custom.module,
          actions: custom.actions,
          enabled: true,
        });
      }
    }
  });

  return Array.from(merged.values());
};

/**
 * Get expiring permissions (within next 24 hours)
 */
export const getExpiringPermissions = (
  userPermissions: UserPermissions
): UserPermissions['customPermissions'] => {
  if (!userPermissions.customPermissions) return [];

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return userPermissions.customPermissions.filter(cp => {
    if (!cp.expiresAt) return false;
    const expiresAt = new Date(cp.expiresAt);
    return expiresAt > now && expiresAt <= tomorrow;
  });
};

/**
 * Get expired permissions
 */
export const getExpiredPermissions = (
  userPermissions: UserPermissions
): UserPermissions['customPermissions'] => {
  if (!userPermissions.customPermissions) return [];

  const now = new Date();

  return userPermissions.customPermissions.filter(cp => {
    if (!cp.expiresAt) return false;
    return new Date(cp.expiresAt) <= now;
  });
};

/**
 * Clean up expired permissions
 */
export const cleanupExpiredPermissions = (
  userPermissions: UserPermissions
): UserPermissions => {
  const now = new Date();

  return {
    ...userPermissions,
    customPermissions: userPermissions.customPermissions?.filter(cp => {
      if (!cp.expiresAt) return true;
      return new Date(cp.expiresAt) > now;
    }),
  };
};

/**
 * Validate permission configuration
 */
export const validatePermissions = (
  permissions: Partial<UserPermissions>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!permissions.roleId) {
    errors.push('Role is required');
  }

  if (!permissions.modules || permissions.modules.length === 0) {
    errors.push('At least one module permission is required');
  }

  // Check for duplicate modules
  if (permissions.modules) {
    const modules = permissions.modules.map(m => m.module);
    const uniqueModules = new Set(modules);
    if (modules.length !== uniqueModules.size) {
      errors.push('Duplicate module permissions found');
    }
  }

  // Validate custom permissions
  if (permissions.customPermissions) {
    permissions.customPermissions.forEach((cp, index) => {
      if (!cp.module) {
        errors.push(`Custom permission ${index + 1}: Module is required`);
      }
      if (!cp.actions || cp.actions.length === 0) {
        errors.push(`Custom permission ${index + 1}: At least one action is required`);
      }
      if (cp.expiresAt && new Date(cp.expiresAt) <= new Date()) {
        errors.push(`Custom permission ${index + 1}: Expiration date must be in the future`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Format permission for display
 */
export const formatPermission = (
  module: PermissionModule,
  actions: PermissionAction[]
): string => {
  if (actions.includes(PermissionAction.MANAGE)) {
    return 'Full Access';
  }

  const actionNames = actions.map(a => {
    switch (a) {
      case PermissionAction.VIEW: return 'View';
      case PermissionAction.CREATE: return 'Create';
      case PermissionAction.EDIT: return 'Edit';
      case PermissionAction.DELETE: return 'Delete';
      case PermissionAction.EXPORT: return 'Export';
      case PermissionAction.IMPORT: return 'Import';
      default: return a;
    }
  });

  return actionNames.join(', ');
};

/**
 * Calculate permission difference between two permission sets
 */
export const getPermissionDiff = (
  oldPermissions: UserPermissions,
  newPermissions: UserPermissions
): {
  added: PermissionModule[];
  removed: PermissionModule[];
  modified: PermissionModule[];
} => {
  const oldModules = new Set(
    oldPermissions.modules.filter(m => m.enabled).map(m => m.module)
  );
  const newModules = new Set(
    newPermissions.modules.filter(m => m.enabled).map(m => m.module)
  );

  const added: PermissionModule[] = [];
  const removed: PermissionModule[] = [];
  const modified: PermissionModule[] = [];

  // Find added modules
  newModules.forEach(module => {
    if (!oldModules.has(module)) {
      added.push(module);
    }
  });

  // Find removed modules
  oldModules.forEach(module => {
    if (!newModules.has(module)) {
      removed.push(module);
    }
  });

  // Find modified modules (both in old and new but with different actions)
  oldModules.forEach(module => {
    if (newModules.has(module)) {
      const oldPerm = oldPermissions.modules.find(m => m.module === module);
      const newPerm = newPermissions.modules.find(m => m.module === module);
      
      if (oldPerm && newPerm) {
        const oldActions = new Set(oldPerm.actions);
        const newActions = new Set(newPerm.actions);
        
        if (oldActions.size !== newActions.size ||
            ![...oldActions].every(a => newActions.has(a))) {
          modified.push(module);
        }
      }
    }
  });

  return { added, removed, modified };
};
