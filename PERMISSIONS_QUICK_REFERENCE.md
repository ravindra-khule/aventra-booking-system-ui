# Granular Permission System - Quick Reference

## Quick Start

### 1. Import Required Types & Functions

```typescript
// Types
import {
  PermissionModule,
  PermissionAction,
  UserPermissions,
} from './src/shared/types/permissions.types';

// Utilities
import {
  hasModuleAccess,
  hasActionPermission,
  getAccessibleModules,
} from './src/shared/utils/permissions.utils';

// Component
import { PermissionManager } from './components/PermissionManager';

// API Service
import {
  createUserWithPermissions,
  updateUserPermissions,
  grantTemporaryAccess,
} from './src/shared/services/permissionService';
```

### 2. Create User with Custom Permissions

```typescript
// In your user creation form
const [selectedModules, setSelectedModules] = useState<PermissionModule[]>([
  PermissionModule.BOOKING,
  PermissionModule.CUSTOMER,
]);

// Render permission manager
<PermissionManager
  selectedRole={UserRole.ADMIN}
  selectedModules={selectedModules}
  onModulesChange={setSelectedModules}
  mode="create"
/>

// Submit
await createUserWithPermissions({
  name: "John Doe",
  email: "john@example.com",
  password: "password",
  role: UserRole.ADMIN,
  permissions: { modules: selectedModules },
});
```

### 3. Update Existing User Permissions

```typescript
await updateUserPermissions({
  userId: "user_123",
  permissions: {
    modules: [
      PermissionModule.BOOKING,
      PermissionModule.FINANCE,
      PermissionModule.TOOLS,
    ],
  },
  updatedBy: "admin_456",
});
```

### 4. Grant Temporary Access

```typescript
await grantTemporaryAccess({
  userId: "user_123",
  module: PermissionModule.FINANCE,
  actions: [PermissionAction.VIEW, PermissionAction.EXPORT],
  duration: 24, // hours
  reason: "Quarterly financial review",
  grantedBy: "admin_456",
});
```

### 5. Check Permissions

```typescript
// Check module access
const canAccessBookings = hasModuleAccess(
  userPermissions,
  PermissionModule.BOOKING
);

// Check specific action
const canCreate = hasActionPermission(
  userPermissions,
  PermissionModule.BOOKING,
  PermissionAction.CREATE
);

if (canCreate.hasPermission) {
  // Show create button
}
```

### 6. Protected Routes

```typescript
<Route
  path="/admin/marketing"
  element={
    <ProtectedModuleRoute module={PermissionModule.MARKETING}>
      <MarketingDashboard />
    </ProtectedModuleRoute>
  }
/>
```

## Permission Modules

| Module | Code | Icon | Default For |
|--------|------|------|-------------|
| Booking | `PermissionModule.BOOKING` | 📅 | Super Admin, Admin, Support, Accountant |
| Customer | `PermissionModule.CUSTOMER` | 👥 | Super Admin, Admin, Support, Accountant |
| Marketing | `PermissionModule.MARKETING` | 📢 | Super Admin, Admin |
| Finance | `PermissionModule.FINANCE` | 💰 | Super Admin, Admin, Accountant |
| Tools | `PermissionModule.TOOLS` | 🔧 | Super Admin, Admin, Support, Developer |
| Settings | `PermissionModule.SETTINGS` | ⚙️ | Super Admin, Developer |
| User Management | `PermissionModule.USER_MANAGEMENT` | 👤 | Super Admin, Admin |
| Reports | `PermissionModule.REPORTS` | 📊 | Super Admin, Admin, Accountant, Developer |

## Permission Actions

| Action | Code | Description |
|--------|------|-------------|
| View | `PermissionAction.VIEW` | Read-only access |
| Create | `PermissionAction.CREATE` | Add new records |
| Edit | `PermissionAction.EDIT` | Modify records |
| Delete | `PermissionAction.DELETE` | Remove records |
| Export | `PermissionAction.EXPORT` | Download data |
| Import | `PermissionAction.IMPORT` | Upload data |
| Manage | `PermissionAction.MANAGE` | Full access (all actions) |

## Common Patterns

### Pattern 1: Role-Based Default + Customization

```typescript
// Start with role defaults
const defaultModules = DEFAULT_ROLE_PERMISSIONS[UserRole.ADMIN];

// Customize
const customModules = [
  ...defaultModules,
  PermissionModule.TOOLS, // Add extra module
].filter(m => m !== PermissionModule.SETTINGS); // Remove one
```

### Pattern 2: Temporary Escalation

```typescript
// Grant temporary admin access
await grantTemporaryAccess({
  userId: supportUserId,
  module: PermissionModule.USER_MANAGEMENT,
  actions: [PermissionAction.VIEW, PermissionAction.CREATE],
  duration: 4, // 4 hours
  reason: "Handle urgent user creation request",
  grantedBy: currentAdminId,
});
```

### Pattern 3: Conditional UI Rendering

```typescript
const { user } = useAuth();
const permissions = getUserPermissions(user.id);
const accessibleModules = getAccessibleModules(permissions);

return (
  <nav>
    {accessibleModules.includes(PermissionModule.BOOKING) && (
      <NavItem icon={Calendar} to="/bookings">Bookings</NavItem>
    )}
    {accessibleModules.includes(PermissionModule.FINANCE) && (
      <NavItem icon={DollarSign} to="/finance">Finance</NavItem>
    )}
  </nav>
);
```

### Pattern 4: Action-Based Button Visibility

```typescript
const canCreate = hasActionPermission(
  permissions,
  PermissionModule.CUSTOMER,
  PermissionAction.CREATE
);

const canDelete = hasActionPermission(
  permissions,
  PermissionModule.CUSTOMER,
  PermissionAction.DELETE
);

return (
  <div>
    {canCreate.hasPermission && (
      <button onClick={handleCreate}>Add Customer</button>
    )}
    {canDelete.hasPermission && (
      <button onClick={handleDelete}>Delete</button>
    )}
  </div>
);
```

## API Endpoints Reference

```bash
# Create user with permissions
POST /api/users/with-permissions

# Update permissions
PATCH /api/users/{userId}/permissions

# Grant temporary access
POST /api/users/{userId}/temporary-access

# Revoke access
DELETE /api/users/{userId}/permissions/{module}

# Get user permissions
GET /api/users/{userId}/permissions

# Check permission
POST /api/permissions/check

# Get templates
GET /api/permissions/templates

# Apply template
POST /api/users/{userId}/apply-template
```

## Utility Functions Cheat Sheet

```typescript
// Module access
hasModuleAccess(permissions, module)                    // boolean

// Action permission
hasActionPermission(permissions, module, action)        // { hasPermission, reason?, expiresAt? }

// Multiple checks
hasAllActions(permissions, module, [action1, action2])  // boolean
hasAnyAction(permissions, module, [action1, action2])   // boolean

// Get accessible items
getAccessibleModules(permissions)                       // PermissionModule[]
getAvailableActions(permissions, module)                // PermissionAction[]

// Validation
validatePermissions(permissions)                        // { valid, errors[] }

// Cleanup
cleanupExpiredPermissions(permissions)                  // UserPermissions
getExpiringPermissions(permissions)                     // CustomPermission[]
getExpiredPermissions(permissions)                      // CustomPermission[]

// Defaults
createDefaultPermissions(userId, role)                  // UserPermissions
```

## Example: Complete User Creation Flow

```typescript
import React, { useState } from 'react';
import { PermissionManager } from './components/PermissionManager';
import { createUserWithPermissions } from './services/permissionService';
import { PermissionModule } from './types/permissions.types';
import { UserRole } from './types/common.types';

export function CreateUserPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.ADMIN,
  });
  const [selectedModules, setSelectedModules] = useState<PermissionModule[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createUserWithPermissions({
        ...formData,
        permissions: { modules: selectedModules },
      });

      alert(response.message);
      // Redirect to user list
    } catch (error) {
      alert('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New User</h2>
      
      {/* Basic Info */}
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
      >
        <option value={UserRole.ADMIN}>Admin</option>
        <option value={UserRole.SUPPORT}>Support</option>
        <option value={UserRole.ACCOUNTANT}>Accountant</option>
      </select>

      {/* Permission Management */}
      <PermissionManager
        selectedRole={formData.role}
        selectedModules={selectedModules}
        onModulesChange={setSelectedModules}
        mode="create"
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

## Troubleshooting Quick Fixes

**Permission not working?**
```typescript
// 1. Check if permissions loaded
console.log('Permissions:', userPermissions);

// 2. Check expiration
const expired = getExpiredPermissions(userPermissions);
console.log('Expired:', expired);

// 3. Validate structure
const validation = validatePermissions(userPermissions);
console.log('Valid?:', validation.valid, validation.errors);
```

**Module not showing in menu?**
```typescript
// Check accessible modules
const modules = getAccessibleModules(userPermissions);
console.log('Can access:', modules);

// Check specific module
const hasAccess = hasModuleAccess(userPermissions, PermissionModule.BOOKING);
console.log('Has booking access?:', hasAccess);
```

**Temporary access not working?**
```typescript
// Check custom permissions
console.log('Custom:', userPermissions.customPermissions);

// Check if expired
const now = new Date();
userPermissions.customPermissions?.forEach(cp => {
  console.log(
    `${cp.module}: ${cp.expiresAt ? new Date(cp.expiresAt) > now : 'permanent'}`
  );
});
```

## Files Reference

| File | Purpose | Size |
|------|---------|------|
| `permissions.types.ts` | Type definitions | 400+ lines |
| `permissions.utils.ts` | Helper functions | 400+ lines |
| `permissionService.ts` | API mock service | 300+ lines |
| `PermissionManager.tsx` | UI component | 350+ lines |
| `GRANULAR_PERMISSION_SYSTEM.md` | Full documentation | Comprehensive |

---

**Version**: 1.0.0  
**Last Updated**: December 21, 2025  
**Status**: ✅ Ready to use
