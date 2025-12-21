# Roles & Permissions - Visual Architecture

## Component Hierarchy

```
RolesPermissions (Main Page)
│
├── Header with Quick Stats
│   ├── Total Roles Card
│   ├── Built-in Roles Card
│   ├── Custom Roles Card
│   └── Total Permissions Card
│
├── Tab Navigation
│   ├── Role Management Tab
│   ├── Permissions Tab
│   ├── Role Templates Tab
│   └── Audit Logs Tab
│
├── Tab 1: RoleManagementTab
│   ├── Search Input
│   ├── Filter Buttons (All, Built-in, Custom)
│   ├── New Role Button
│   │
│   ├── RoleCard (Repeated)
│   │   ├── Role Info
│   │   ├── Stats (Users, Permissions, Date)
│   │   └── Actions (Edit, Delete, Duplicate)
│   │
│   └── Modals
│       ├── CreateRoleModal
│       │   ├── Name Input
│       │   ├── Description Input
│       │   ├── Parent Role Select
│       │   └── Permission Selector (by category)
│       ├── EditRoleModal (Same as Create)
│       ├── ConfirmDeleteModal
│       │   └── Name Confirmation Input
│       └── DuplicateRoleModal
│           └── New Name Input
│
├── Tab 2: PermissionManagerTab
│   ├── Role Selector Dropdown
│   ├── Role Info Card
│   └── Permission Categories (Expandable)
│       └── Permission Items
│           ├── Permission Name
│           ├── Description
│           └── Grant Status (✓/✕)
│
├── Tab 3: RoleTemplatesTab
│   ├── Info Box
│   ├── Preset Templates Section
│   │   └── TemplateCard (Repeated)
│   │       ├── Template Info
│   │       ├── Permission Count
│   │       └── Select Button
│   ├── Custom Templates Section
│   │   └── TemplateCard (Repeated)
│   └── Modal: TemplateSelectionModal
│       ├── Template Info Display
│       ├── Role Name Input
│       ├── Permissions Preview
│       └── Create Button
│
├── Tab 4: AuditLogsTab
│   ├── Search Input
│   ├── Filter Buttons (by action type)
│   └── Audit Log Items (Expandable)
│       ├── Action Badge
│       ├── Summary Info
│       ├── Metadata
│       └── Expanded Details (on click)
│           ├── Timestamp
│           ├── Target
│           ├── Changed By
│           ├── Affected Users
│           └── Full Details
│
└── Info Cards at Bottom
    ├── About Roles Card
    └── Permission Categories Card
```

---

## Data Flow Diagram

```
RolesPermissions Component
│
├─► useEffect on mount
│   └─► loadData()
│       ├─► RolePermissionService.getRoles()
│       ├─► RolePermissionService.getPermissionsByCategory()
│       └─► RolePermissionService.getAuditLogs()
│
├─► RoleManagementTab
│   ├─► State: selectedRole, activeModal, search, filter
│   │
│   ├─► Handle Create
│   │   └─► CreateRoleModal
│   │       └─► RolePermissionService.createRole()
│   │           └─► onRoleCreated() → loadData()
│   │
│   ├─► Handle Edit
│   │   └─► EditRoleModal
│   │       └─► RolePermissionService.updateRole()
│   │           └─► onRoleUpdated() → loadData()
│   │
│   ├─► Handle Delete
│   │   └─► ConfirmDeleteModal
│   │       └─► RolePermissionService.deleteRole()
│   │           └─► onRoleDeleted() → loadData()
│   │
│   └─► Handle Duplicate
│       └─► DuplicateRoleModal
│           └─► RolePermissionService.duplicateRole()
│               └─► onRoleCreated() → loadData()
│
├─► PermissionManagerTab
│   ├─► State: selectedRole, expandedCategories
│   └─► Display formatted permissions from props
│
├─► RoleTemplatesTab
│   ├─► State: selectedTemplate, loading
│   │
│   ├─► useEffect on mount
│   │   └─► RolePermissionService.getRoleTemplates()
│   │
│   └─► On template select
│       └─► TemplateSelectionModal
│           └─► RolePermissionService.createRole()
│               └─► onTemplateSelected() → loadData()
│
└─► AuditLogsTab
    ├─► State: searchTerm, filterAction, expandedLog
    └─► useMemo to filter logs based on search/filter
```

---

## Permission Hierarchy Example

```
Admin (Parent Role)
├── All Bookings Permissions
├── All Customers Permissions
├── All Finance Permissions
├── All Tours Permissions
├── All Marketing Permissions
├── All Users & Roles Permissions
├── All Reports Permissions
└── All Settings Permissions

Manager (Inherits from Admin, but custom set)
├── Booking: View, Create, Edit, Confirm, Cancel (NOT Delete, NOT Invoice)
├── Customers: View, Create, Edit, Communication, Export (NOT Delete)
├── Finance: View only
├── Tours: View only
├── Marketing: View Analytics only
├── Users: View only
├── Reports: View and Export
└── Settings: None
```

---

## Permission Feature Structure

### Example: Booking Permissions

```
Category: BOOKINGS
├── booking.view         → Can see bookings
├── booking.create       → Can create new bookings
├── booking.edit         → Can modify bookings
├── booking.delete       → Can delete bookings
├── booking.confirm      → Can confirm/approve
├── booking.cancel       → Can cancel bookings
└── booking.invoice      → Can generate invoices
```

### All 8 Categories

```
1. BOOKINGS (7 features)
2. CUSTOMERS (7 features)
3. FINANCE (6 features)
4. TOURS (7 features)
5. MARKETING (4 features)
6. USERS (3 features - user.manage, role.manage, permission.manage)
7. REPORTS (2 features)
8. SETTINGS (4 features)
```

---

## State Management Pattern

### RolesPermissions (Top-level)
```typescript
const [activeTab, setActiveTab] = useState<TabType>('roles');
const [roles, setRoles] = useState<Role[]>([]);
const [permissions, setPermissions] = useState<PermissionCategoryGroup[]>([]);
const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### RoleManagementTab (Tab-level)
```typescript
const [selectedRole, setSelectedRole] = useState<Role | null>(null);
const [activeModal, setActiveModal] = useState<ModalType>(null);
const [searchTerm, setSearchTerm] = useState('');
const [filterBuiltIn, setFilterBuiltIn] = useState<'all'|'builtin'|'custom'>('all');
```

### CreateRoleModal (Modal-level)
```typescript
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [permissions, setPermissions] = useState<PermissionFeature[]>([]);
const [parentRoleId, setParentRoleId] = useState<string>('');
const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
```

---

## Key Features by Component

| Component | Key Features |
|-----------|--------------|
| **RolesPermissions** | Tab switching, data loading, error handling, quick stats |
| **RoleManagementTab** | Search, filter, CRUD operations, role cards |
| **CreateRoleModal** | Form validation, permission selection, category expansion |
| **EditRoleModal** | Same as Create, but pre-filled with existing data |
| **ConfirmDeleteModal** | Safety confirmation, name matching |
| **DuplicateRoleModal** | Simple name input, instant duplication |
| **PermissionManagerTab** | Read-only permission display, role comparison |
| **RoleTemplatesTab** | Template browsing, quick role creation |
| **TemplateSelectionModal** | Template preview, customization, bulk creation |
| **AuditLogsTab** | Search, filter, expandable log items, timeline |

---

## Modal Triggers

```
New Role Button → CreateRoleModal
Edit Role → EditRoleModal
Delete Role → ConfirmDeleteModal
Duplicate Role → DuplicateRoleModal
Select Template → TemplateSelectionModal
```

---

## Data Transformations

### Raw Permission List → Categorized
```typescript
PERMISSIONS[] 
  → groupBy(category) 
  → PermissionCategoryGroup[]
```

### All Logs → Filtered Logs
```typescript
auditLogs[]
  → filter by searchTerm
  → filter by action type
  → filtered logs[]
```

### Role Array → Filter Options
```typescript
roles[] 
  → filter by builtin/custom
  → filter by search term
  → displayed roles[]
```

---

## Error Handling Patterns

```typescript
try {
  setLoading(true);
  // Operation
  setError(null);
} catch (err) {
  setError('User-friendly message');
  console.error('Dev details', err);
} finally {
  setLoading(false);
}
```

---

## Validation Patterns

```typescript
const validateForm = (): boolean => {
  const errors: Record<string, string> = {};
  
  if (!field.trim()) {
    errors.field = 'Required message';
  }
  if (field.length < 2) {
    errors.field = 'Min length message';
  }
  
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

## Color Coding System

### Badges & Status
- **Blue**: Info, Built-in, Updates
- **Green**: Success, View permissions, Created
- **Red**: Danger, Deleted, Revoked
- **Purple**: Primary action, Custom, Assigned
- **Yellow**: Warning, Revoked, Caution
- **Indigo**: Users & Roles
- **Orange**: Delete action, Finance
- **Gray**: Settings, Neutral

### Action Buttons
- **Primary (Purple)**: Main action (Create, Save, Duplicate)
- **Secondary (Gray)**: Cancel, Go back
- **Danger (Red)**: Delete
- **Info (Blue)**: Edit, View details

---

## Responsive Breakpoints

```typescript
// Mobile First Approach
sm: 640px   // Tablets
md: 768px   // Small laptops
lg: 1024px  // Desktops
xl: 1280px  // Large screens

Examples:
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
hidden lg:block (Desktop only)
w-full md:w-1/2   (Full on mobile, half on desktop)
```

---

## Loading States

```
isLoading: true
├─ Skeleton screens
├─ Disabled buttons
└─ Spinner animations

isLoading: false
├─ Content display
├─ Enabled buttons
└─ Interactive elements
```

---

## Summary

This architecture provides:
- ✅ **Scalability**: Easy to add features
- ✅ **Maintainability**: Clear structure
- ✅ **Performance**: Optimized rendering
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **User Experience**: Responsive, intuitive
- ✅ **Accessibility**: Semantic HTML, ARIA-ready
