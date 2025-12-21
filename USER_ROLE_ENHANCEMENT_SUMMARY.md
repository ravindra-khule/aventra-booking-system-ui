# User Management Role Enhancement - Quick Reference

## Summary of Changes

The user management system has been upgraded from 3 roles to 5 comprehensive roles with a hierarchical permission system.

---

## New Role Structure

### Previous (3 Roles)
- ❌ Admin
- ❌ Support  
- ❌ Accountant

### Updated (5 Roles)
- ✅ **Super Admin** - System owner with full access
- ✅ **Admin** - Can create users (Support & Accountant)
- ✅ **Support** - Customer service operations
- ✅ **Accountant** - Financial operations
- ✅ **Developer** - Technical & system access

---

## Key Features

### 1. Hierarchical Role System
```
Super Admin (Level 100)
    └── Can create: Admin, Support, Accountant, Developer

Admin (Level 80)
    └── Can create: Support, Accountant

Developer (Level 90)
    └── Technical access only, cannot create users

Support (Level 50) & Accountant (Level 60)
    └── Cannot create users
```

### 2. Granular Permissions
Each role has specific permissions across:
- 📋 Bookings Management
- 👥 Customer Management
- 🎯 Tours & Packages
- 💰 Financial Operations
- 📧 Marketing & Campaigns
- 👤 User Management
- ⚙️ System Settings
- 📊 Reports & Analytics
- 🔧 System Logs & Developer Tools

### 3. Role-Based UI
- Color-coded badges for easy identification
- Role descriptions in forms
- Permission viewer for each role
- Restricted role selection based on current user

---

## Files Modified

### Core Types
1. **`src/shared/types/common.types.ts`**
   - Added `SUPER_ADMIN` and `DEVELOPER` to `UserRole` enum

2. **`pages/admin/settings/types/userManagementTypes.ts`**
   - Updated `UserRole` type to include all 5 roles

### Configuration
3. **`src/shared/config/rolePermissions.config.ts`** ⭐ NEW
   - Complete role hierarchy definition
   - Detailed permissions for each role
   - Helper functions for permission checks

4. **`src/shared/utils/rolePermissions.utils.ts`** ⭐ NEW
   - Permission checking utilities
   - Role comparison functions
   - UI helper functions

### UI Components
5. **`pages/admin/settings/AddUserModal.tsx`**
   - All 5 roles in dropdown
   - Role descriptions updated

6. **`pages/admin/settings/EditUserModal.tsx`**
   - All 5 roles in dropdown

7. **`pages/admin/settings/InviteUserModal.tsx`**
   - All 5 roles with descriptions

8. **`pages/admin/settings/components/AddEditUserModal.tsx`**
   - Updated available roles array

9. **`pages/admin/settings/UserManagement.tsx`**
   - Role color mapping for all 5 roles

10. **`pages/admin/settings/components/RolePermissionsModal.tsx`**
    - Complete permission definitions for all roles
    - Removed legacy "Manager" role
    - Added Developer role permissions

11. **`pages/admin/settings/components/AdminUsersManager.tsx`**
    - Mock data updated with all 5 roles
    - Example users for each role type

### Services
12. **`src/shared/services/user.service.ts`**
    - Mock users updated with all 5 roles
    - Example data for testing

---

## Usage Examples

### Check if User Can Create Other Users
```typescript
import { checkPermission } from '@/shared/utils/rolePermissions.utils';
import { UserRole } from '@/shared/types/common.types';

const canCreate = checkPermission(UserRole.ADMIN, 'createUsers');
// Returns: true
```

### Get Available Roles for User
```typescript
import { getAvailableRolesForUser } from '@/shared/utils/rolePermissions.utils';

// Super Admin can create all roles
const roles = getAvailableRolesForUser(UserRole.SUPER_ADMIN);
// Returns: [UserRole.ADMIN, UserRole.SUPPORT, UserRole.ACCOUNTANT, UserRole.DEVELOPER]

// Admin can only create Support and Accountant
const adminRoles = getAvailableRolesForUser(UserRole.ADMIN);
// Returns: [UserRole.SUPPORT, UserRole.ACCOUNTANT]
```

### Check Permission Before Action
```typescript
import { hasPermission } from '@/shared/config/rolePermissions.config';

// Check if Accountant can process refunds
if (hasPermission(UserRole.ACCOUNTANT, 'processRefunds')) {
  // Show refund button
}
```

### Get Role Badge Color
```typescript
import { getRoleBadgeColor } from '@/shared/utils/rolePermissions.utils';

const colorClass = getRoleBadgeColor(UserRole.DEVELOPER);
// Returns: 'bg-slate-100 text-slate-800 border-slate-200'
```

---

## Role Color Scheme

| Role | Color | Hex | Badge Class |
|------|-------|-----|-------------|
| Super Admin | Purple | #9333EA | `bg-purple-100 text-purple-800` |
| Admin | Blue | #2563EB | `bg-blue-100 text-blue-800` |
| Support | Green | #16A34A | `bg-green-100 text-green-800` |
| Accountant | Amber | #D97706 | `bg-amber-100 text-amber-800` |
| Developer | Slate | #475569 | `bg-slate-100 text-slate-800` |

---

## Testing Checklist

### ✅ User Creation
- [ ] Super Admin can create all role types
- [ ] Admin can create Support and Accountant only
- [ ] Support cannot create users
- [ ] Accountant cannot create users
- [ ] Developer cannot create users

### ✅ Permission Checks
- [ ] Super Admin has all permissions
- [ ] Admin cannot delete users
- [ ] Support has limited access
- [ ] Accountant has full financial access
- [ ] Developer has system log access

### ✅ UI Display
- [ ] All 5 roles show in dropdowns
- [ ] Role badges display correct colors
- [ ] Role descriptions are clear
- [ ] Permission modal shows correct permissions for each role

### ✅ Mock Data
- [ ] User service has examples of all roles
- [ ] AdminUsersManager shows all role types
- [ ] No references to old "Manager" role

---

## Migration Guide

### For Existing Installations

1. **Review Current Users**
   - Identify users who should be Super Admin (system owner)
   - Identify users who should be Admin (can create users)
   - Keep Support and Accountant as-is

2. **Update Role Assignments**
   ```typescript
   // Old Admin → Super Admin (if owner)
   // Old Admin → Admin (if manages users)
   // Support → Support (no change)
   // Accountant → Accountant (enhanced permissions)
   ```

3. **Add Developer Role**
   - Create Developer accounts for technical staff
   - They get system logs and debugging access

4. **Test Permission System**
   - Verify each role can access appropriate features
   - Test user creation restrictions
   - Validate permission checks throughout app

---

## Documentation

- **Complete Guide**: `/RBAC_ROLE_SYSTEM_GUIDE.md`
- **Permission Config**: `/src/shared/config/rolePermissions.config.ts`
- **Utilities**: `/src/shared/utils/rolePermissions.utils.ts`

---

## Support

For questions or issues:
1. Check `RBAC_ROLE_SYSTEM_GUIDE.md` for detailed role descriptions
2. Review `rolePermissions.config.ts` for permission definitions
3. Use utility functions in `rolePermissions.utils.ts` for permission checks

---

**Last Updated**: December 21, 2025  
**Version**: 2.0 - Enhanced 5-Role System
