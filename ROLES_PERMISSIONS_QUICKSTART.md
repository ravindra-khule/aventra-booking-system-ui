# Roles & Permissions - Developer Quick Start

## 📍 Where Everything Is

### Main Component
- **Location**: `/pages/admin/settings/RolesPermissions.tsx`
- **Purpose**: Main dashboard with 4 tabs
- **Entry Point**: Imports all sub-components and manages data flow

### Sub-Components
```
/pages/admin/settings/components/
├── RoleManagementTab.tsx        (Role CRUD)
├── PermissionManagerTab.tsx     (Permission viewer)
├── RoleTemplatesTab.tsx         (Template selector)
├── AuditLogsTab.tsx             (Change history)
└── modals/
    ├── CreateRoleModal.tsx
    ├── EditRoleModal.tsx
    ├── ConfirmDeleteModal.tsx
    ├── DuplicateRoleModal.tsx
    └── TemplateSelectionModal.tsx
```

### Type Definitions
- **Location**: `/src/shared/types/role-permission.types.ts`
- **Exports**: Role, Permission, PermissionFeature, PermissionCategory, etc.
- **Updated Index**: `/src/shared/types/index.ts`

### Service Layer (Mock)
- **Location**: `/src/shared/services/role-permission.service.ts`
- **Methods**: getRoles(), createRole(), updateRole(), deleteRole(), duplicateRole(), getPermissions(), getAuditLogs(), etc.
- **Note**: This is a mock service. Replace with real API calls when backend is ready.

---

## 🚀 Quick Features Overview

### What Users Can Do

#### ✅ Role Management Tab
1. **View all roles** - Search and filter by built-in/custom
2. **Create roles** - Set name, description, select permissions
3. **Edit roles** - Change name, description, permissions (except built-in)
4. **Delete roles** - With confirmation dialog
5. **Duplicate roles** - Clone existing roles with new names

#### ✅ Permissions Tab
1. **View permissions** - By role and category
2. **Understand permissions** - See description and grant status
3. **Count permissions** - Per category per role

#### ✅ Role Templates Tab
1. **Select templates** - Admin, Manager, Support, Finance
2. **Preview permissions** - Before creating role
3. **Create from template** - Quick setup

#### ✅ Audit Logs Tab
1. **View all changes** - Role and permission changes
2. **Search logs** - By user, target, details
3. **Filter by action** - Created, Updated, Deleted, etc.
4. **Expand details** - Click to see full information
5. **See impact** - How many users affected

---

## 🔧 How to Modify Features

### Add a New Permission

1. **Edit** `/src/shared/types/role-permission.types.ts`

```typescript
// Add to enum PermissionFeature
TOUR_SCHEDULE = 'tour.schedule',

// Add to PERMISSIONS array in RolePermissionService
{
  id: 'perm_tour_schedule',
  feature: PermissionFeature.TOUR_SCHEDULE,
  category: PermissionCategory.TOURS,
  action: PermissionAction.EDIT,
  label: 'Schedule Tours',
  description: 'Can create and modify tour schedules'
}
```

2. **Restart dev server** - Changes auto-reflect in UI

---

### Add a New Role Template

1. **Edit** `/src/shared/services/role-permission.service.ts`

```typescript
// Add to ROLE_TEMPLATES array
{
  id: 'template_operator',
  name: 'Tour Operator',
  description: 'Manages tours and schedules',
  icon: 'Calendar',
  permissions: [
    PermissionFeature.TOUR_VIEW,
    PermissionFeature.TOUR_SCHEDULE,
    PermissionFeature.TOUR_PRICING,
    // ... more permissions
  ],
  category: 'preset'
}
```

---

### Customize Role Card Display

**Edit** `/pages/admin/settings/components/RoleManagementTab.tsx`

```typescript
const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete, onDuplicate }) => (
  <div className="border border-gray-200 rounded-lg p-6">
    {/* Add more fields here */}
    <p>Custom Field: {role.someProperty}</p>
  </div>
);
```

---

### Add a New Filter Option

**Edit** `/pages/admin/settings/components/RoleManagementTab.tsx`

```typescript
// Change filter state type
const [filterType, setFilterType] = useState<'all' | 'builtin' | 'custom' | 'active'>('all');

// Add filter logic
const filteredRoles = roles.filter((role) => {
  // ... existing filters
  if (filterType === 'active') return role.userCount > 0;
});

// Add button
<button onClick={() => setFilterType('active')}>
  Active ({roles.filter(r => r.userCount > 0).length})
</button>
```

---

## 🐛 Common Issues & Solutions

### Issue: Modal doesn't open
**Solution**: Check if `activeModal` state is being set correctly
```typescript
setActiveModal('create'); // Make sure it's the right value
```

### Issue: Permissions not showing
**Solution**: Ensure `permissionCategories` data is loaded
```typescript
useEffect(() => {
  loadData(); // Call this on mount
}, [isOpen]);
```

### Issue: Search not working
**Solution**: Check filter logic uses lowercase comparison
```typescript
role.name.toLowerCase().includes(searchTerm.toLowerCase())
```

### Issue: Build errors
**Solution**: Run these checks:
```bash
npm run build          # See what errors exist
npx tsc --noEmit      # Check TypeScript errors
```

---

## 📚 Integration Checklist

### Before Going Live

- [ ] Replace mock `RolePermissionService` with real API calls
- [ ] Update API endpoints in service methods
- [ ] Add authentication/authorization headers
- [ ] Test with real database data
- [ ] Update error messages for real API errors
- [ ] Remove mock data console.logs
- [ ] Add permission checking middleware
- [ ] Test on different browsers
- [ ] Performance test with large datasets
- [ ] Update documentation for new endpoints

### Backend API Endpoints Needed

```
GET    /api/roles                    # List all roles
POST   /api/roles                    # Create role
GET    /api/roles/:id                # Get single role
PUT    /api/roles/:id                # Update role
DELETE /api/roles/:id                # Delete role
POST   /api/roles/:id/duplicate      # Duplicate role
GET    /api/permissions              # List permissions
GET    /api/permissions/categories   # Grouped permissions
GET    /api/audit-logs               # Audit logs
GET    /api/audit-logs?role=:roleId  # Role-specific logs
POST   /api/users/:userId/roles      # Assign roles
DELETE /api/users/:userId/roles/:roleId # Remove role
```

---

## 🎯 Testing the Features

### Manual Testing Checklist

#### Role Management
- [ ] Create a new role with some permissions
- [ ] Edit the role (change name/description/permissions)
- [ ] Duplicate the role with a new name
- [ ] Try to edit a built-in role (should show warning)
- [ ] Delete a custom role with confirmation
- [ ] Search for roles by name/description
- [ ] Filter by built-in/custom

#### Permissions
- [ ] View permissions for each role
- [ ] Expand/collapse categories
- [ ] See permission grant status (✓/✕)
- [ ] Switch between different roles

#### Templates
- [ ] Select a template
- [ ] See permission preview
- [ ] Create role from template
- [ ] Customize role name before creating

#### Audit Logs
- [ ] See changes appear in real-time
- [ ] Search logs by user name
- [ ] Filter by action type
- [ ] Click to expand full details
- [ ] Refresh logs

#### Forms
- [ ] Try creating role without name (should error)
- [ ] Try selecting 0 permissions (should error)
- [ ] Verify validation messages show
- [ ] Submit form and see loading spinner
- [ ] Confirm modal only works with correct text

---

## 🔐 Security Notes

1. **Built-in roles are protected** - Can't delete, limited editing
2. **Deletion requires confirmation** - Prevents accidental deletes
3. **All changes are logged** - For audit trails
4. **Validation on client and server** - Never trust client validation alone
5. **Permission checks** - Need to implement on backend

### Before Moving to Production

- [ ] Implement backend permission checking
- [ ] Add CSRF token validation
- [ ] Rate limit API endpoints
- [ ] Add request signing
- [ ] Log all changes with admin user ID
- [ ] Set up alerts for suspicious activity
- [ ] Regular audit log reviews

---

## 📊 Monitoring & Debugging

### Console Logs to Check
- Service calls show simulated delays
- Error catches are logged with context
- Component mounts/unmounts visible

### Performance Tips
- Large role lists? Implement pagination
- Many permissions? Use virtual scrolling
- Slow audit logs? Add filtering/pagination
- Use React DevTools to check re-renders

### Browser DevTools
- Check Network tab for API calls
- Use React DevTools to inspect props/state
- Check Console for errors/warnings
- Profile Components for performance

---

## 🚦 Migration Path from Mock to Real API

### Step 1: Update Service Methods
```typescript
// Before (Mock)
static async getRoles(): Promise<Role[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_ROLES]), 300);
  });
}

// After (Real API)
static async getRoles(): Promise<Role[]> {
  const response = await fetch('/api/roles', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

### Step 2: Error Handling
Add try-catch blocks that match your API error format:
```typescript
try {
  // API call
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 403) {
    // Handle forbidden
  } else {
    // Handle general error
  }
}
```

### Step 3: Loading States
Keep existing loading state management - it works with real APIs too!

### Step 4: Testing
Test with real API using Postman/Thunder Client first, then integrate

---

## 📖 Code Examples

### Reading Current State
```typescript
// Get roles from props
const currentRole = roles.find(r => r.id === selectedRoleId);

// Check if user has permission (when integrated with auth)
const canDelete = user?.permissions?.includes(PermissionFeature.ROLE_MANAGE);
```

### Making API Calls
```typescript
const handleCreate = async () => {
  try {
    const newRole = await RolePermissionService.createRole(formData);
    // UI updates automatically via parent callback
    onSuccess();
  } catch (error) {
    setError('Failed to create');
  }
};
```

### Filtering Data
```typescript
const filtered = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(search);
  const matchesFilter = filter === 'all' || item.type === filter;
  return matchesSearch && matchesFilter;
});
```

---

## ❓ FAQ

**Q: Can I change how permissions are organized?**  
A: Yes! Modify `PermissionCategory` enum and `permissionCategories` mapping.

**Q: How do I hide features for non-admin users?**  
A: Add permission checks before rendering components.

**Q: Can I add more role templates?**  
A: Yes! Add to `ROLE_TEMPLATES` array in the service.

**Q: How are user-role assignments handled?**  
A: That's in UserManagement component - this just manages the role definitions.

**Q: What happens if the API is slow?**  
A: Loading states show, then data appears. The UI handles this gracefully.

---

## 🆘 Getting Help

1. **Check the implementation docs** - `ROLES_PERMISSIONS_IMPLEMENTATION.md`
2. **Review the architecture** - `ROLES_PERMISSIONS_ARCHITECTURE.md`
3. **Look at component comments** - Inline documentation in files
4. **Check types** - TypeScript hints are very helpful
5. **Test in browser** - Use React DevTools to inspect state

---

## ✨ Pro Tips

- Use search feature to quickly test filtering
- Duplicate existing roles to test with different names
- Check audit logs to verify all operations
- Use browser DevTools to inspect component state
- Test on mobile to check responsive design
- Try all button combinations to find edge cases

---

**Happy coding!** 🚀
