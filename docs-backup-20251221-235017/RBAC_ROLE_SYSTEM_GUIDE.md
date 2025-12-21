# Enhanced Role-Based Access Control (RBAC) System

## Overview

The Aventra Booking System now supports a comprehensive 5-tier role hierarchy designed for enterprise SaaS deployment. This system provides granular permission control while maintaining a clear hierarchical structure.

---

## Role Hierarchy

### 1. **Super Admin** 🔴 (Level 100)
**Purpose:** System Owner - The highest level of access  
**Use Case:** Given to the customer who purchases the booking system as a service  
**Icon:** Crown 👑 | **Color:** Purple

#### Capabilities:
- ✅ **Full System Access** - Complete control over all features
- ✅ **User Management** - Can create all role types (Admin, Support, Accountant, Developer)
- ✅ **Role Assignment** - Can assign any role to any user
- ✅ **System Configuration** - Complete settings and configuration access
- ✅ **Financial Operations** - Full financial management
- ✅ **Technical Access** - System logs and developer tools
- ✅ **Delete Permissions** - Can delete any resource

#### Restrictions:
- ❌ None - Has all permissions

---

### 2. **Admin** 🔵 (Level 80)
**Purpose:** Administrative Management  
**Use Case:** Created by Super Admin to manage day-to-day operations  
**Icon:** Shield 🛡️ | **Color:** Blue

#### Capabilities:
- ✅ **User Management** - Can create Support and Accountant users (NOT other Admins)
- ✅ **Bookings** - Full CRUD operations
- ✅ **Customers** - Full CRUD operations
- ✅ **Tours** - Full CRUD operations including pricing
- ✅ **Marketing** - Full campaign and email management
- ✅ **Financial Access** - View and create invoices, process payments
- ✅ **Reports** - View and export all reports
- ✅ **Company Settings** - Edit company information and email templates
- ✅ **System Monitoring** - View system logs and health

#### Restrictions:
- ❌ Cannot create other Admin or Super Admin users
- ❌ Cannot process refunds (requires Super Admin or Accountant)
- ❌ Cannot delete users
- ❌ Cannot access system configuration settings
- ❌ Cannot access developer tools or error logs
- ❌ Cannot manage integrations

---

### 3. **Support** 🟢 (Level 50)
**Purpose:** Customer Support Operations  
**Use Case:** Handle customer inquiries, bookings, and content updates  
**Icon:** Headphones 🎧 | **Color:** Green

#### Capabilities:
- ✅ **Bookings** - View, create, edit, and cancel
- ✅ **Customers** - View, create, edit (no delete)
- ✅ **Customer Communication** - Send emails and messages
- ✅ **Tours** - View and update content/itineraries
- ✅ **Export Data** - Export customer lists
- ✅ **Basic Reports** - View operational reports

#### Restrictions:
- ❌ Cannot access financial data (except invoice status)
- ❌ Cannot manage pricing
- ❌ Cannot create tours
- ❌ Cannot delete any records
- ❌ Cannot access user management
- ❌ Cannot access system settings
- ❌ Cannot send marketing campaigns
- ❌ No access to logs or system health

---

### 4. **Accountant** 🟡 (Level 60)
**Purpose:** Financial Operations  
**Use Case:** Handle all financial operations, invoicing, and reporting  
**Icon:** Calculator 💰 | **Color:** Amber

#### Capabilities:
- ✅ **Financial Management** - Full access to all finance operations
- ✅ **Invoices** - Create, edit, delete invoices
- ✅ **Payments** - Process payments and refunds
- ✅ **Fortnox Integration** - Manage accounting integration
- ✅ **Financial Reports** - View, export, and create custom financial reports
- ✅ **Pricing Management** - Set and update tour pricing
- ✅ **Customer Data** - View and export for financial purposes
- ✅ **Bookings** - View booking data
- ✅ **Marketing Analytics** - View ROI and campaign performance

#### Restrictions:
- ❌ Cannot manage bookings (create, edit, cancel)
- ❌ Cannot manage customers (except view/export)
- ❌ Cannot create or edit tours
- ❌ Cannot access user management
- ❌ Cannot send marketing campaigns
- ❌ No access to system logs or settings

---

### 5. **Developer** ⚫ (Level 90)
**Purpose:** Technical & System Administration  
**Use Case:** Handle technical issues, integrations, debugging, and system monitoring  
**Icon:** Code 💻 | **Color:** Slate

#### Capabilities:
- ✅ **System Logs** - Full access to all system logs
- ✅ **Audit Trail** - Complete audit history
- ✅ **Error Logs** - Access to error and debug logs
- ✅ **Developer Tools** - API access, debugging tools
- ✅ **Integrations** - Manage third-party integrations
- ✅ **System Health** - Monitor performance and uptime
- ✅ **Full Data Access** - View/edit bookings, customers, tours, finance
- ✅ **Settings** - Full system and company settings access
- ✅ **User Activity** - Track and monitor user actions

#### Restrictions:
- ❌ Cannot create, edit, or delete users
- ❌ Cannot assign roles
- ❌ Cannot access user management features

**Note:** Developer has technical "read" access to user data for debugging but cannot modify user accounts.

---

## Permission Matrix

| Feature | Super Admin | Admin | Support | Accountant | Developer |
|---------|-------------|-------|---------|------------|-----------|
| **User Management** |
| Create Users | All Roles | Support, Accountant | ❌ | ❌ | ❌ |
| Edit Users | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Users | ✅ | ✅ | ❌ | ❌ | ✅ (Read Only) |
| Manage Roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Bookings** |
| View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ | ✅ |
| Edit | ✅ | ✅ | ✅ | ❌ | ✅ |
| Delete | ✅ | ✅ | ❌ | ❌ | ✅ |
| Cancel | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Customers** |
| View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ | ✅ |
| Edit | ✅ | ✅ | ✅ | ❌ | ✅ |
| Delete | ✅ | ✅ | ❌ | ❌ | ✅ |
| Export | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tours & Packages** |
| View | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit | ✅ | ✅ | ✅ (Content) | ❌ | ✅ |
| Delete | ✅ | ✅ | ❌ | ❌ | ✅ |
| Manage Pricing | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Finance** |
| View Financials | ✅ | ✅ | ✅ (Limited) | ✅ | ✅ |
| Create Invoices | ✅ | ✅ | ❌ | ✅ | ✅ |
| Edit Invoices | ✅ | ✅ | ❌ | ✅ | ✅ |
| Delete Invoices | ✅ | ❌ | ❌ | ✅ | ✅ |
| Process Payments | ✅ | ✅ | ❌ | ✅ | ✅ |
| Process Refunds | ✅ | ❌ | ❌ | ✅ | ✅ |
| Financial Reports | ✅ | ✅ | ❌ | ✅ | ✅ |
| Fortnox Integration | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Marketing** |
| View Campaigns | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Campaigns | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit Campaigns | ✅ | ✅ | ❌ | ❌ | ✅ |
| Send Emails | ✅ | ✅ | ❌ | ❌ | ✅ |
| View Analytics | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Settings** |
| Company Settings | ✅ | ✅ | ✅ (View) | ✅ (View) | ✅ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ✅ |
| Email Templates | ✅ | ✅ | ✅ (View) | ❌ | ✅ |
| **System & Logs** |
| System Logs | ✅ | ✅ (View) | ❌ | ❌ | ✅ |
| Audit Trail | ✅ | ✅ | ❌ | ❌ | ✅ |
| Error Logs | ✅ | ❌ | ❌ | ❌ | ✅ |
| Developer Tools | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage Integrations | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Reports** |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export Reports | ✅ | ✅ | ❌ | ✅ | ✅ |
| Custom Reports | ✅ | ✅ | ❌ | ✅ | ✅ |

---

## Role Creation Hierarchy

```
Super Admin (Can Create)
    ├── Admin
    ├── Support
    ├── Accountant
    └── Developer

Admin (Can Create)
    ├── Support
    └── Accountant

Support (Cannot Create Users)
Accountant (Cannot Create Users)
Developer (Cannot Create Users)
```

---

## Implementation Files

### Core Configuration
- **`src/shared/types/common.types.ts`** - UserRole enum definition
- **`src/shared/config/rolePermissions.config.ts`** - Complete role permissions mapping
- **`src/shared/utils/rolePermissions.utils.ts`** - Permission utility functions

### User Management Components
- **`pages/admin/settings/types/userManagementTypes.ts`** - Admin user types
- **`pages/admin/settings/components/AddEditUserModal.tsx`** - User creation/edit form
- **`pages/admin/settings/AddUserModal.tsx`** - Simple user creation
- **`pages/admin/settings/EditUserModal.tsx`** - User editing
- **`pages/admin/settings/InviteUserModal.tsx`** - User invitation
- **`pages/admin/settings/UserManagement.tsx`** - Main user management page
- **`pages/admin/settings/components/RolePermissionsModal.tsx`** - Role permissions viewer

### Service Layer
- **`src/shared/services/user.service.ts`** - User management service with mock data

---

## Usage Examples

### 1. Check Permission
```typescript
import { checkPermission } from '@/shared/utils/rolePermissions.utils';
import { UserRole } from '@/shared/types/common.types';

// Check if user can delete bookings
const canDelete = checkPermission(UserRole.SUPPORT, 'deleteBookings');
// Returns: false
```

### 2. Get Available Roles for User Creation
```typescript
import { getAvailableRolesForUser } from '@/shared/utils/rolePermissions.utils';

// Admin trying to create a user
const availableRoles = getAvailableRolesForUser(UserRole.ADMIN);
// Returns: [UserRole.SUPPORT, UserRole.ACCOUNTANT]
```

### 3. Get Role Display Info
```typescript
import { getRoleDisplayInfo } from '@/shared/utils/rolePermissions.utils';

const roleInfo = getRoleDisplayInfo(UserRole.DEVELOPER);
// Returns: {
//   label: 'Developer',
//   description: 'Technical access - Full system access plus...',
//   color: 'slate',
//   icon: 'Code',
//   level: 90,
//   ...
// }
```

### 4. Check Role Hierarchy
```typescript
import { compareRoles } from '@/shared/utils/rolePermissions.utils';

const result = compareRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN);
// Returns: 1 (Super Admin has higher level)
```

---

## SaaS Deployment Workflow

### Initial Setup (For New Customer)
1. System creates **Super Admin** account for customer
2. Super Admin receives credentials and login instructions
3. Super Admin logs in and completes company setup

### Organization Setup (By Super Admin)
1. Super Admin creates **Admin** users for their organization
2. Super Admin assigns appropriate permissions
3. Super Admin can create **Developer** for technical support

### Day-to-Day Operations (By Admin)
1. Admin creates **Support** staff for customer service
2. Admin creates **Accountant** for financial operations
3. Admin manages bookings, tours, and operations

### Technical Support (By Developer)
1. Developer monitors system health
2. Developer manages integrations
3. Developer debugs issues using logs
4. Developer cannot modify user accounts (security)

---

## Security Considerations

### Role Separation
- **Financial** (Accountant) and **User Management** (Admin) are separated
- **Technical Access** (Developer) cannot manage users
- **Support** has no financial or user management access

### Audit Trail
- All role assignments logged
- All permission changes tracked
- User activity monitored

### Best Practices
1. Assign minimum required permissions
2. Regular review of user roles
3. Enable 2FA for Admin and Super Admin
4. Separate technical and administrative access

---

## UI Color Coding

- 🟣 **Purple** - Super Admin
- 🔵 **Blue** - Admin
- 🟢 **Green** - Support
- 🟡 **Amber** - Accountant
- ⚫ **Slate** - Developer

---

## Migration Notes

If upgrading from the previous 3-role system (Admin, Support, Accountant):

1. Existing **Admin** users → Migrate to **Super Admin** or **Admin** based on needs
2. Existing **Support** users → Remain as **Support** (no changes)
3. Existing **Accountant** users → Remain as **Accountant** (enhanced permissions)
4. Add new **Developer** role for technical staff if needed

---

## Support & Questions

For implementation questions or customization needs, refer to:
- `/src/shared/config/rolePermissions.config.ts` - Full permissions definition
- `/src/shared/utils/rolePermissions.utils.ts` - Helper functions
- This document for role descriptions and use cases
