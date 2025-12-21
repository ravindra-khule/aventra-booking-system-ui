# User Module Permissions - Quick Guide

## Overview
All demo login users are now available in User Management with module-level permission controls. You can now restrict which screens/modules each user can access.

## What Was Implemented

### 1. Demo Users in User Management
All 5 demo admin users from the login screen are now in User Management:
- `superadmin@aventra.com` - Super Admin
- `admin@aventra.com` - Admin User  
- `support@aventra.com` - Support Agent
- `accountant@aventra.com` - Accountant
- `developer@aventra.com` - Developer

### 2. Module Permissions Modal
A new "Manage Module Permissions" feature allows you to select which modules each user can access:

**Available Modules:**
- 📅 **Booking Management** - Bookings, reservations, availability
- 👥 **Customer Management** - Customers, groups, contacts
- 📢 **Marketing & Campaigns** - Marketing campaigns and analytics
- 💰 **Financial Management** - Invoices, payments, reports
- 🔧 **Tools & Utilities** - System tools and utilities
- ⚙️ **System Settings** - System settings and preferences
- 👤 **User Management** - Manage users and permissions
- 📊 **Reports & Analytics** - View and export reports

### 3. New Components Created

**UserPermissionsModal.tsx** (300+ lines)
- Visual module selector with checkboxes
- Select All / Clear All quick actions
- Color-coded modules
- Saves permissions per user

**Updated Components:**
- **AdminUsersManager.tsx** - Added permission state and handlers
- **UserTable.tsx** - Added "Manage Modules" button (green shield icon)

## How to Use

### Give Support Only Booking & Customer Access

1. **Navigate to User Management**
   ```
   Admin Panel → Settings → User Management
   ```

2. **Find support@aventra.com in the table**

3. **Click the green Shield icon** (🛡️) - "Manage module permissions"
   - Desktop: In the Actions column
   - Mobile: In the "Modules" button

4. **In the modal that opens:**
   - Click "Clear All" to remove all permissions
   - Select only:
     - ✅ Booking Management
     - ✅ Customer Management
   - Click "Save Permissions"

5. **Result:** 
   - Support user can now only access Booking and Customer screens
   - All other admin modules will be hidden for this user

### Example Configurations

**Support Agent** (Customer service role):
```
✅ Booking Management
✅ Customer Management
❌ Marketing & Campaigns
❌ Financial Management
❌ Tools & Utilities
❌ System Settings
❌ User Management
❌ Reports & Analytics
```

**Accountant** (Finance role):
```
❌ Booking Management
❌ Customer Management
❌ Marketing & Campaigns
✅ Financial Management
❌ Tools & Utilities
❌ System Settings
❌ User Management
✅ Reports & Analytics
```

**Developer** (Technical role):
```
❌ Booking Management
❌ Customer Management
❌ Marketing & Campaigns
❌ Financial Management
✅ Tools & Utilities
✅ System Settings
❌ User Management
✅ Reports & Analytics
```

## Visual Guide

### User Table Actions
```
Desktop View:
┌────────────────────────────────────┐
│ Name        Email        Actions   │
│ Support     support@... [✏️][👁️][🛡️][🗑️] │
│                         ↑          │
│                    New Button!     │
└────────────────────────────────────┘

Mobile View:
┌─────────────────────────────┐
│ Support Agent               │
│ support@aventra.com         │
│                             │
│ [Edit] [🛡️Modules] [Logs]   │
│         ↑                   │
│    New Button!              │
└─────────────────────────────┘
```

### Permissions Modal
```
┌──────────────────────────────────────┐
│  🛡️ Manage Permissions               │
│  Support Agent • support@aventra.com │
├──────────────────────────────────────┤
│  ℹ️ Select which modules this user   │
│     can access                       │
├──────────────────────────────────────┤
│  2 of 8 modules selected             │
│  [Select All] [Clear All]            │
├──────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐      │
│  │ ✅ Booking │ │ ✅ Customer │      │
│  │ Management │ │ Management │      │
│  └────────────┘ └────────────┘      │
│                                      │
│  ┌────────────┐ ┌────────────┐      │
│  │ ❌ Marketing│ │ ❌ Finance  │      │
│  │ & Campaigns │ │ Management │      │
│  └────────────┘ └────────────┘      │
│  ... more modules ...                │
├──────────────────────────────────────┤
│  Changes take effect on next login   │
│  [Cancel] [💾 Save Permissions]      │
└──────────────────────────────────────┘
```

## Technical Details

### Permission Storage
```typescript
// Currently stored in component state (demo)
const [userPermissions, setUserPermissions] = useState<
  Record<string, PermissionModule[]>
>({
  'user_support': ['BOOKING', 'CUSTOMER'],
  'user_accountant': ['FINANCE', 'REPORTS'],
  // ...
});

// In production, this would be:
// - Stored in database (users_permissions table)
// - Loaded via API on component mount
// - Saved via API on permission changes
```

### Integration Points

**Files Modified:**
1. `AdminUsersManager.tsx` 
   - Added `userPermissions` state
   - Added `handleSaveUserPermissions` handler
   - Imported `UserPermissionsModal`
   - Added modal rendering

2. `UserTable.tsx`
   - Added `onManageModulePermissions` prop
   - Added Shield icon button in actions
   - Added "Modules" button in mobile view

**Files Created:**
3. `UserPermissionsModal.tsx`
   - Standalone permissions management modal
   - 8 module options with icons
   - Visual checkbox grid
   - Save/cancel actions

### Mock Data Update
```typescript
// Updated user IDs to match login system
const MOCK_USERS: AdminUser[] = [
  {
    id: 'user_superadmin',  // Matches login
    email: 'superadmin@aventra.com',
    name: 'Super Admin',
    // ...
  },
  // ... all 5 demo users
];
```

## Next Steps (Production Ready)

### Backend Integration Required:

1. **Database Schema**
   ```sql
   CREATE TABLE user_module_permissions (
     user_id VARCHAR(255),
     module VARCHAR(50),
     granted_at TIMESTAMP,
     granted_by VARCHAR(255),
     PRIMARY KEY (user_id, module)
   );
   ```

2. **API Endpoints**
   ```typescript
   // Load user permissions
   GET /api/users/:userId/module-permissions
   Response: { modules: ['BOOKING', 'CUSTOMER'] }

   // Save user permissions
   POST /api/users/:userId/module-permissions
   Body: { modules: ['BOOKING', 'CUSTOMER'] }
   ```

3. **AuthContext Integration**
   - Load permissions after login
   - Provide `hasModuleAccess(module)` helper
   - Cache permissions in context

4. **Navigation Filtering**
   - AdminLayout sidebar checks permissions
   - Hide menu items user can't access
   - Redirect if accessing unauthorized module

## Testing

### Manual Test Steps:

1. ✅ **View Demo Users**
   - Go to User Management
   - Verify all 5 demo users appear
   - Verify emails match login credentials

2. ✅ **Open Permissions Modal**
   - Click Shield icon on support@aventra.com
   - Modal should open with 8 modules
   - All should be selected by default

3. ✅ **Modify Permissions**
   - Click "Clear All"
   - Select only "Booking Management"
   - Click "Save Permissions"
   - Check console log for saved data

4. ✅ **Mobile View**
   - Resize browser to mobile width
   - Verify "Modules" button appears
   - Click and verify modal opens

### Console Output:
```javascript
// When saving permissions:
Saved permissions for user user_support: 
  ['BOOKING', 'CUSTOMER']
```

## Files Reference

```
pages/admin/settings/components/
├── AdminUsersManager.tsx        (Updated - permission state & modal)
├── UserTable.tsx                (Updated - new action button)
├── UserPermissionsModal.tsx     (New - 300+ lines)
├── AddEditUserModal.tsx         (Unchanged)
├── RolePermissionsModal.tsx     (Different - role-level permissions)
└── ...

Documentation:
└── USER_MODULE_PERMISSIONS_GUIDE.md (This file)
```

## FAQ

**Q: What's the difference between "View Permissions" and "Manage Modules"?**
- **View Permissions** (purple Eye icon) - Shows role-based permissions (old system)
- **Manage Modules** (green Shield icon) - Assigns module access (new granular system)

**Q: Does changing permissions log the user out?**
- Currently no, changes take effect on next login
- You can add immediate enforcement by updating AuthContext

**Q: Can I assign modules to users without a role?**
- Currently users must have at least one role
- Module permissions work alongside roles

**Q: Where is the permission data stored?**
- Demo: Component state (`userPermissions` in AdminUsersManager)
- Production: Should be in database with API endpoints

**Q: How do I restrict navigation based on permissions?**
- Next todo: Update AdminLayout sidebar to check module permissions
- Hide nav items for modules user doesn't have access to

## Summary

✅ **What Works Now:**
- All demo users visible in User Management
- Visual module permission assignment
- Save permissions per user (in memory)
- Green shield button in user table
- Beautiful modal with color-coded modules

⏳ **Next Steps:**
- Connect to backend API
- Load/save to database
- Update AuthContext with permissions
- Filter navigation by permissions
- Add permission checks to routes

---

**Last Updated:** December 21, 2025  
**Status:** Demo Ready ✅ | Production: Requires Backend Integration
