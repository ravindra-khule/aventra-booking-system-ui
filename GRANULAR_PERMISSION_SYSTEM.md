# Granular Permission System Documentation

## Overview

The Granular Permission System extends the existing Role-Based Access Control (RBAC) to provide fine-grained control over user access to specific modules and features. Administrators can now:

- ✅ Assign specific module access during user creation
- ✅ Update permissions for existing users
- ✅ Grant temporary access for limited time periods
- ✅ Create custom permission combinations
- ✅ Use permission templates for quick setup
- ✅ Audit permission changes

## Architecture

### Permission Hierarchy

```
User Role (SUPER_ADMIN, ADMIN, SUPPORT, etc.)
    ↓
Default Module Permissions (based on role)
    ↓
Custom Module Selection (admin-defined)
    ↓
Temporary Access Grants (time-limited)
    ↓
Action-Level Permissions (VIEW, EDIT, CREATE, DELETE, etc.)
```

### Permission Modules

The system defines **8 core modules**:

| Module | Description | Default Roles |
|--------|-------------|---------------|
| **BOOKING** | Tour bookings, calendar, waitlist | Super Admin, Admin, Support, Accountant |
| **CUSTOMER** | Customer profiles, groups, communications | Super Admin, Admin, Support, Accountant |
| **MARKETING** | Campaigns, promo codes, analytics | Super Admin, Admin |
| **FINANCE** | Invoices, payments, Fortnox | Super Admin, Admin, Accountant |
| **TOOLS** | Itinerary builder, utilities | Super Admin, Admin, Support, Developer |
| **SETTINGS** | System configuration | Super Admin, Developer |
| **USER_MANAGEMENT** | Create/manage users | Super Admin, Admin |
| **REPORTS** | Analytics and reports | Super Admin, Admin, Accountant, Developer |

### Permission Actions

Each module supports specific actions:

| Action | Description | Typical Use |
|--------|-------------|-------------|
| **VIEW** | Read-only access | View data, no modifications |
| **CREATE** | Create new records | Add bookings, customers, etc. |
| **EDIT** | Modify existing records | Update information |
| **DELETE** | Remove records | Delete bookings, cancel items |
| **EXPORT** | Export data | Download reports, CSV exports |
| **IMPORT** | Import data | Bulk customer import |
| **MANAGE** | Full access (all actions) | Complete control |

## Implementation

### File Structure

```
src/shared/
├── types/
│   └── permissions.types.ts          # Type definitions
├── utils/
│   └── permissions.utils.ts          # Helper functions
└── services/
    └── permissionService.ts          # API service (mock)

components/
└── PermissionManager.tsx             # UI component
```

### Type Definitions

```typescript
// Core permission module
enum PermissionModule {
  BOOKING,
  CUSTOMER,
  MARKETING,
  FINANCE,
  TOOLS,
  SETTINGS,
  USER_MANAGEMENT,
  REPORTS,
}

// User permissions structure
interface UserPermissions {
  userId: string;
  roleId: UserRole;
  modules: ModulePermission[];
  customPermissions?: CustomPermission[];
  lastUpdated: Date;
  updatedBy?: string;
}

// Module permission
interface ModulePermission {
  module: PermissionModule;
  actions: PermissionAction[];
  enabled: boolean;
}
```

## Usage Guide

### 1. Creating User with Custom Permissions

**UI Flow:**
1. Navigate to User Management
2. Click "Create New User"
3. Fill in user details (name, email, role)
4. **Permission Manager** section appears
5. Select modules user should access
6. Click "Create User"

**Code Example:**
```typescript
import { PermissionManager } from '../components/PermissionManager';
import { PermissionModule } from '../src/shared/types/permissions.types';

function CreateUserForm() {
  const [selectedModules, setSelectedModules] = useState<PermissionModule[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

  return (
    <form>
      {/* User basic fields */}
      
      <PermissionManager
        selectedRole={userRole}
        selectedModules={selectedModules}
        onModulesChange={setSelectedModules}
        mode="create"
      />
      
      {/* Submit button */}
    </form>
  );
}
```

**API Call:**
```typescript
import { createUserWithPermissions } from '../services/permissionService';

const response = await createUserWithPermissions({
  name: 'John Doe',
  email: 'john@aventra.com',
  password: 'securepass123',
  role: UserRole.ADMIN,
  permissions: {
    modules: [
      PermissionModule.BOOKING,
      PermissionModule.CUSTOMER,
      PermissionModule.TOOLS,
    ],
  },
});
```

### 2. Updating Existing User Permissions

**Scenario:** Admin user currently has Finance access, needs temporary Tools access

**UI Flow:**
1. Navigate to User Management
2. Click "Edit" on user
3. In **Advanced Options**, click "Grant Temporary Access"
4. Select module: "Tools"
5. Set duration: 24 hours
6. Provide reason: "Emergency system maintenance"
7. Click "Grant Access"

**Code Example:**
```typescript
import { grantTemporaryAccess } from '../services/permissionService';

const response = await grantTemporaryAccess({
  userId: 'user_123',
  module: PermissionModule.TOOLS,
  actions: [PermissionAction.VIEW, PermissionAction.EDIT],
  duration: 24, // hours
  reason: 'Emergency system maintenance',
  grantedBy: 'admin_456', // Current admin user ID
});

// Response includes expiration time
console.log(response.message);
// "Temporary access granted until Dec 22, 2025 10:00 AM"
```

### 3. Checking Permissions in Code

**Check Module Access:**
```typescript
import { hasModuleAccess } from '../utils/permissions.utils';

// Check if user can access booking module
const canAccessBookings = hasModuleAccess(
  userPermissions,
  PermissionModule.BOOKING
);

if (canAccessBookings) {
  // Show booking menu item
}
```

**Check Action Permission:**
```typescript
import { hasActionPermission } from '../utils/permissions.utils';

// Check if user can create bookings
const canCreate = hasActionPermission(
  userPermissions,
  PermissionModule.BOOKING,
  PermissionAction.CREATE
);

if (canCreate.hasPermission) {
  // Show "Create Booking" button
} else {
  console.log(canCreate.reason); // "No permission for CREATE action"
}
```

**Get All Accessible Modules:**
```typescript
import { getAccessibleModules } from '../utils/permissions.utils';

const modules = getAccessibleModules(userPermissions);
// [PermissionModule.BOOKING, PermissionModule.CUSTOMER, PermissionModule.TOOLS]

// Use for navigation menu
modules.forEach(module => {
  const metadata = MODULE_METADATA[module];
  console.log(`${metadata.icon} ${metadata.label}`);
});
```

### 4. Using Permission Templates

**Available Templates:**

1. **Operations Manager**
   - Full access: Booking, Customer, Tools
   - Use for: Day-to-day operations staff

2. **Marketing Specialist**
   - Full access: Marketing
   - View access: Customer, Reports
   - Use for: Marketing team members

3. **Finance Manager**
   - Full access: Finance, Reports
   - View access: Booking
   - Use for: Accounting staff

4. **Read-Only Auditor**
   - View access: All modules
   - Use for: Compliance, auditing

**Apply Template:**
```typescript
import { applyPermissionTemplate } from '../services/permissionService';

const response = await applyPermissionTemplate({
  userId: 'user_123',
  templateId: 'template-1', // Operations Manager
  appliedBy: 'admin_456',
});
```

### 5. Routing and Navigation

**Protected Routes with Module Check:**
```typescript
import { hasModuleAccess } from '../utils/permissions.utils';

const ProtectedRoute = ({ module, children }) => {
  const { user } = useAuth();
  const userPermissions = getUserPermissions(user.id);

  if (!hasModuleAccess(userPermissions, module)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

// Usage
<Route
  path="/admin/marketing"
  element={
    <ProtectedRoute module={PermissionModule.MARKETING}>
      <MarketingDashboard />
    </ProtectedRoute>
  }
/>
```

**Dynamic Navigation Menu:**
```typescript
const NavigationMenu = () => {
  const { user } = useAuth();
  const userPermissions = getUserPermissions(user.id);
  const accessibleModules = getAccessibleModules(userPermissions);

  const menuItems = [
    {
      module: PermissionModule.BOOKING,
      label: 'Bookings',
      path: '/admin/bookings',
      icon: Calendar,
    },
    {
      module: PermissionModule.CUSTOMER,
      label: 'Customers',
      path: '/admin/customers',
      icon: Users,
    },
    // ... more items
  ];

  return (
    <nav>
      {menuItems
        .filter(item => accessibleModules.includes(item.module))
        .map(item => (
          <NavLink key={item.module} to={item.path}>
            <item.icon /> {item.label}
          </NavLink>
        ))}
    </nav>
  );
};
```

## Backend API Specification

### Endpoints

#### 1. Create User with Permissions
```
POST /api/users/with-permissions
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@aventra.com",
  "password": "hashedpassword",
  "role": "ADMIN",
  "permissions": {
    "modules": ["BOOKING", "CUSTOMER", "TOOLS"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@aventra.com",
    "role": "ADMIN",
    "permissions": {
      "userId": "user_123",
      "roleId": "ADMIN",
      "modules": [
        {
          "module": "BOOKING",
          "actions": ["VIEW", "EDIT", "CREATE"],
          "enabled": true
        }
      ],
      "lastUpdated": "2025-12-21T10:00:00Z"
    }
  },
  "message": "User created successfully"
}
```

#### 2. Update User Permissions
```
PATCH /api/users/{userId}/permissions
```

**Request:**
```json
{
  "userId": "user_123",
  "permissions": {
    "modules": ["BOOKING", "CUSTOMER", "FINANCE"],
    "customPermissions": [
      {
        "module": "TOOLS",
        "actions": ["VIEW"],
        "expiresAt": "2025-12-22T10:00:00Z",
        "reason": "Temporary maintenance access"
      }
    ]
  },
  "updatedBy": "admin_456"
}
```

#### 3. Grant Temporary Access
```
POST /api/users/{userId}/temporary-access
```

**Request:**
```json
{
  "userId": "user_123",
  "module": "FINANCE",
  "actions": ["VIEW", "EXPORT"],
  "duration": 48,
  "reason": "Year-end audit support",
  "grantedBy": "admin_456"
}
```

#### 4. Revoke Access
```
DELETE /api/users/{userId}/permissions/{module}
```

#### 5. Get User Permissions
```
GET /api/users/{userId}/permissions
```

#### 6. Get Permission Templates
```
GET /api/permissions/templates
```

#### 7. Check Permission
```
POST /api/permissions/check
```

**Request:**
```json
{
  "userId": "user_123",
  "module": "BOOKING",
  "action": "CREATE"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "hasPermission": true,
    "expiresAt": null
  }
}
```

### Database Schema

**users_permissions table:**
```sql
CREATE TABLE users_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role_id VARCHAR(50),
  modules JSONB,
  custom_permissions JSONB,
  last_updated TIMESTAMP,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**permission_audit_log table:**
```sql
CREATE TABLE permission_audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50),
  module VARCHAR(50),
  permissions JSONB,
  performed_by UUID REFERENCES users(id),
  performed_at TIMESTAMP,
  expires_at TIMESTAMP NULL,
  reason TEXT NULL
);
```

## Use Cases

### Use Case 1: Custom Admin with Limited Access

**Scenario:** Create an admin who can only manage bookings and customers, not finance or marketing.

**Solution:**
```typescript
// During user creation
const permissions = {
  modules: [
    PermissionModule.BOOKING,
    PermissionModule.CUSTOMER,
    PermissionModule.TOOLS,
  ],
};

await createUserWithPermissions({
  role: UserRole.ADMIN,
  permissions,
  // ... other fields
});
```

**Result:** User has admin role but only sees Booking, Customer, and Tools in navigation.

### Use Case 2: Temporary Finance Access for Support

**Scenario:** Support staff needs to check invoice for customer issue, but shouldn't have permanent finance access.

**Solution:**
```typescript
await grantTemporaryAccess({
  userId: supportUserId,
  module: PermissionModule.FINANCE,
  actions: [PermissionAction.VIEW], // Read-only
  duration: 2, // 2 hours
  reason: 'Customer complaint about invoice #12345',
  grantedBy: adminUserId,
});
```

**Result:** Support can view invoices for 2 hours, then access automatically expires.

### Use Case 3: Marketing Campaign Manager

**Scenario:** Hire a marketing specialist who only needs marketing and customer view access.

**Solution:**
```typescript
const permissions = {
  modules: [
    PermissionModule.MARKETING,
    PermissionModule.CUSTOMER, // View only for targeting
    PermissionModule.REPORTS, // View campaign performance
  ],
};
```

### Use Case 4: Seasonal Finance Helper

**Scenario:** During tax season, need temporary accountant with limited access.

**Solution:**
1. Create user with Accountant role
2. Assign only Finance and Reports modules
3. Add custom permission with expiration:

```typescript
customPermissions: [{
  module: PermissionModule.FINANCE,
  actions: [PermissionAction.VIEW, PermissionAction.EXPORT],
  expiresAt: '2025-04-30T23:59:59Z', // End of tax season
  reason: 'Seasonal tax preparation assistance',
}]
```

## Security Considerations

### 1. Permission Validation
Always validate permissions server-side:
```typescript
// Backend middleware
async function checkPermission(req, res, next) {
  const { userId, module, action } = req;
  const permissions = await getUserPermissions(userId);
  
  const result = hasActionPermission(permissions, module, action);
  
  if (!result.hasPermission) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  next();
}
```

### 2. Audit Logging
All permission changes are logged:
```typescript
{
  userId: 'user_123',
  action: 'GRANTED',
  module: 'FINANCE',
  performedBy: 'admin_456',
  performedAt: '2025-12-21T10:00:00Z',
  reason: 'Temporary access for audit',
  expiresAt: '2025-12-23T10:00:00Z',
}
```

### 3. Automatic Cleanup
Expired permissions are automatically filtered:
```typescript
import { cleanupExpiredPermissions } from '../utils/permissions.utils';

// Run periodically (e.g., daily cron job)
const cleanedPermissions = cleanupExpiredPermissions(userPermissions);
```

### 4. Role Hierarchy
Super Admin always has full access, cannot be restricted:
```typescript
if (user.role === UserRole.SUPER_ADMIN) {
  return { hasPermission: true }; // Bypass all checks
}
```

## Testing

### Unit Tests Example

```typescript
import { hasModuleAccess, hasActionPermission } from '../utils/permissions.utils';

describe('Permission Utilities', () => {
  test('should grant access to enabled module', () => {
    const permissions = {
      modules: [
        { module: PermissionModule.BOOKING, actions: [PermissionAction.VIEW], enabled: true }
      ],
    };
    
    expect(hasModuleAccess(permissions, PermissionModule.BOOKING)).toBe(true);
  });

  test('should deny access to disabled module', () => {
    const permissions = {
      modules: [
        { module: PermissionModule.BOOKING, actions: [PermissionAction.VIEW], enabled: false }
      ],
    };
    
    expect(hasModuleAccess(permissions, PermissionModule.BOOKING)).toBe(false);
  });

  test('should deny expired temporary access', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const permissions = {
      customPermissions: [{
        module: PermissionModule.TOOLS,
        actions: [PermissionAction.VIEW],
        expiresAt: yesterday,
      }],
    };
    
    const result = hasActionPermission(permissions, PermissionModule.TOOLS, PermissionAction.VIEW);
    expect(result.hasPermission).toBe(false);
    expect(result.reason).toContain('expired');
  });
});
```

## Migration from Old System

### Step 1: Add Permission Column
```sql
ALTER TABLE users ADD COLUMN permissions JSONB;
```

### Step 2: Migrate Existing Users
```typescript
// Migration script
async function migrateUserPermissions() {
  const users = await getAllUsers();
  
  for (const user of users) {
    const defaultPermissions = createDefaultPermissions(user.id, user.role);
    await updateUserPermissions(user.id, defaultPermissions);
  }
}
```

### Step 3: Update Frontend
1. Add PermissionManager to user forms
2. Update navigation to use permission checks
3. Update ProtectedRoute to check modules

## Troubleshooting

### Permission Not Working?

**1. Check User Permissions:**
```typescript
const permissions = await getUserPermissions(userId);
console.log('Modules:', permissions.modules);
console.log('Custom:', permissions.customPermissions);
```

**2. Verify Expiration:**
```typescript
const expiring = getExpiringPermissions(permissions);
const expired = getExpiredPermissions(permissions);
console.log('Expiring soon:', expiring);
console.log('Already expired:', expired);
```

**3. Validate Permission Structure:**
```typescript
const validation = validatePermissions(permissions);
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

## Best Practices

1. **✅ Use Default Permissions as Base**: Start with role defaults, customize as needed
2. **✅ Document Custom Permissions**: Always provide reason for non-standard access
3. **✅ Use Temporary Access**: For short-term needs, don't grant permanent access
4. **✅ Regular Audits**: Review permissions quarterly
5. **✅ Principle of Least Privilege**: Grant minimum required access
6. **✅ Centralized Management**: All permission changes through admin UI
7. **❌ Avoid Over-Permissioning**: Don't grant "just in case" access
8. **❌ Don't Skip Audit Logging**: Always log permission changes

## Support

For questions or issues:
1. Check this documentation
2. Review code examples in `/src/shared/utils/permissions.utils.ts`
3. Test with mock API in `/src/shared/services/permissionService.ts`
4. Check audit logs for permission changes

---

**Last Updated**: December 21, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Implementation
