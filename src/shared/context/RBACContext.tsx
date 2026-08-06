import React, { createContext, useContext, useEffect, useState } from 'react';
import { RBACService, PERMISSIONS, ROLE_NAMES } from '../services/rbac.service';

interface RBACContextType {
  userId: number | null;
  hasPermission: (permission: string) => Promise<boolean>;
  hasAnyPermission: (permissions: string[]) => Promise<boolean>;
  hasAllPermissions: (permissions: string[]) => Promise<boolean>;
  canView: (resource: string) => Promise<boolean>;
  canCreate: (resource: string) => Promise<boolean>;
  canUpdate: (resource: string) => Promise<boolean>;
  canDelete: (resource: string) => Promise<boolean>;
  isLoading: boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: React.ReactNode;
  userId: number | null;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children, userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      setIsLoading(true);
      return await RBACService.checkPermission(userId, permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    if (!userId) return false;
    try {
      setIsLoading(true);
      return await RBACService.checkAnyPermission(userId, permissions);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasAllPermissions = async (permissions: string[]): Promise<boolean> => {
    if (!userId) return false;
    try {
      setIsLoading(true);
      return await RBACService.checkAllPermissions(userId, permissions);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper methods for common patterns
  const canView = async (resource: string): Promise<boolean> => {
    return hasPermission(`${resource}.view`);
  };

  const canCreate = async (resource: string): Promise<boolean> => {
    return hasPermission(`${resource}.create`);
  };

  const canUpdate = async (resource: string): Promise<boolean> => {
    return hasPermission(`${resource}.update`);
  };

  const canDelete = async (resource: string): Promise<boolean> => {
    return hasPermission(`${resource}.delete`);
  };

  const value: RBACContextType = {
    userId,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    isLoading
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};

// Hook to use RBAC context
export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider');
  }
  return context;
};

// Higher-order component for protecting components
export const withPermission = (
  Component: React.FC<any>,
  permission: string | string[],
  requireAll: boolean = false
) => {
  return (props: any) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useRBAC();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      const checkAccess = async () => {
        if (Array.isArray(permission)) {
          const hasAccess = requireAll
            ? await hasAllPermissions(permission)
            : await hasAnyPermission(permission);
          setAllowed(hasAccess);
        } else {
          const hasAccess = await hasPermission(permission);
          setAllowed(hasAccess);
        }
      };

      checkAccess();
    }, [permission, requireAll, hasPermission, hasAnyPermission, hasAllPermissions]);

    if (isLoading) {
      return <div className="p-4 text-center">Loading...</div>;
    }

    if (!allowed) {
      return (
        <div className="p-4 text-center text-red-600">
          Access Denied: You don't have permission to access this resource.
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// Component for conditional rendering based on permissions
export const PermissionGate: React.FC<{
  permission: string | string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ permission, requireAll = false, children, fallback = null }) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useRBAC();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (Array.isArray(permission)) {
        const hasAccess = requireAll
          ? await hasAllPermissions(permission)
          : await hasAnyPermission(permission);
        setAllowed(hasAccess);
      } else {
        const hasAccess = await hasPermission(permission);
        setAllowed(hasAccess);
      }
    };

    checkAccess();
  }, [permission, requireAll, hasPermission, hasAnyPermission, hasAllPermissions]);

  if (isLoading) {
    return null;
  }

  return allowed ? <>{children}</> : <>{fallback}</>;
};
