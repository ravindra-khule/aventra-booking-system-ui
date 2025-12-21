# User Management - Developer Guide

## Architecture Overview

### Component Structure
```
UserManagement (Main Container)
├── AddUserModal (Create)
├── EditUserModal (Update)
├── InviteUserModal (Invite)
└── UserDetailsModal (Read + Activity)
    ├── Profile Details Tab
    └── Activity Log Tab
```

### Data Flow
```
Component → Service → Mock Data (Backend Ready)
Component ← Service ← Mock Data
```

## 🔧 Service Layer

### UserService API Reference

#### Get Operations
```typescript
// Get all users with optional filters
UserService.getUsers({
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}): Promise<User[]>

// Get single user
UserService.getUserById(id: string): Promise<User | null>

// Get user statistics
UserService.getUserStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: Record<UserRole, number>;
}>

// Get user activities
UserService.getUserActivities(
  userId: string, 
  limit?: number
): Promise<UserActivity[]>

// Get pending invitations
UserService.getPendingInvitations(): Promise<UserInvitation[]>
```

#### Create/Update Operations
```typescript
// Create new user
UserService.createUser(
  userData: Omit<User, 'id' | 'createdAt'>
): Promise<User>

// Update user
UserService.updateUser(
  id: string, 
  updates: Partial<User>
): Promise<User>

// Update status only
UserService.updateUserStatus(
  id: string, 
  status: UserStatus
): Promise<User>

// Toggle 2FA
UserService.toggleTwoFactor(
  id: string, 
  enabled: boolean
): Promise<User>

// Invite user
UserService.inviteUser(
  email: string, 
  role: UserRole, 
  invitedBy: string
): Promise<UserInvitation>
```

#### Delete Operations
```typescript
// Delete user
UserService.deleteUser(id: string): Promise<void>
```

#### Security Operations
```typescript
// Reset password
UserService.resetPassword(userId: string): Promise<void>
```

## 📦 Type Definitions

### Core Types
```typescript
// User Status
enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

// User Role (extends existing)
enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  ACCOUNTANT = 'ACCOUNTANT'
}

// Extended User Interface
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  createdBy?: string;
  notes?: string;
}

// Activity Log
interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// Invitation
interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
}
```

## 🔌 Backend Integration Guide

### Replace Mock Service

Current implementation uses mock data. To integrate with real backend:

#### 1. Update `user.service.ts`
```typescript
import axios from 'axios';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000/api';

export const UserService = {
  getUsers: async (filters?) => {
    const response = await axios.get(`${API_BASE}/users`, { params: filters });
    return response.data;
  },
  
  // ... implement other methods
};
```

#### 2. Expected API Endpoints
```
GET    /api/users              - List users
GET    /api/users/:id          - Get user details
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
GET    /api/users/:id/activity - Get user activities
POST   /api/users/invite       - Send invitation
GET    /api/users/invitations  - List invitations
PUT    /api/users/:id/status   - Update status
PUT    /api/users/:id/2fa      - Toggle 2FA
POST   /api/users/:id/reset    - Reset password
GET    /api/users/stats        - Get statistics
```

#### 3. Request/Response Examples

**Create User**
```typescript
// Request
POST /api/users
{
  "name": "John Doe",
  "email": "john@aventra.com",
  "role": "SUPPORT",
  "status": "ACTIVE",
  "phone": "+46 70 123 4567",
  "twoFactorEnabled": false,
  "notes": "New support team member"
}

// Response
{
  "id": "u_123",
  "name": "John Doe",
  "email": "john@aventra.com",
  "role": "SUPPORT",
  "status": "ACTIVE",
  "phone": "+46 70 123 4567",
  "createdAt": "2024-12-30T10:00:00Z",
  "twoFactorEnabled": false,
  "notes": "New support team member"
}
```

**Get Users with Filters**
```typescript
// Request
GET /api/users?role=ADMIN&status=ACTIVE&search=john

// Response
{
  "users": [
    { /* user object */ },
    { /* user object */ }
  ],
  "total": 2,
  "page": 1,
  "limit": 50
}
```

## 🎨 Styling Guide

### Color Scheme
```css
/* Role Colors */
.role-admin: bg-purple-100 text-purple-800
.role-support: bg-blue-100 text-blue-800
.role-accountant: bg-green-100 text-green-800

/* Status Colors */
.status-active: bg-green-100 text-green-800
.status-inactive: bg-gray-100 text-gray-800
.status-suspended: bg-red-100 text-red-800
.status-pending: bg-yellow-100 text-yellow-800

/* Primary Actions */
.btn-primary: bg-blue-600 hover:bg-blue-700
.btn-success: bg-green-600 hover:bg-green-700
.btn-danger: bg-red-600 hover:bg-red-700
```

### Responsive Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

## 🧪 Testing Guide

### Unit Tests
```typescript
// Example: Testing UserService
describe('UserService', () => {
  test('getUsers returns all users', async () => {
    const users = await UserService.getUsers();
    expect(users).toHaveLength(5);
  });

  test('getUsers filters by role', async () => {
    const admins = await UserService.getUsers({ role: UserRole.ADMIN });
    expect(admins.every(u => u.role === UserRole.ADMIN)).toBe(true);
  });

  test('createUser adds new user', async () => {
    const newUser = await UserService.createUser({
      name: 'Test User',
      email: 'test@aventra.com',
      role: UserRole.SUPPORT,
      status: UserStatus.ACTIVE,
      twoFactorEnabled: false
    });
    expect(newUser.id).toBeDefined();
  });
});
```

### Component Tests
```typescript
// Example: Testing UserManagement component
describe('UserManagement', () => {
  test('renders user list', async () => {
    render(<UserManagement />);
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  test('opens add modal', () => {
    render(<UserManagement />);
    fireEvent.click(screen.getByText('Add User'));
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });
});
```

## 🔐 Security Considerations

### Authentication
- Integrate with existing AuthContext
- Validate user permissions before operations
- Check role-based access control

### Data Validation
```typescript
// Email validation
const isValidEmail = (email: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone validation (optional)
const isValidPhone = (phone: string) => 
  /^\+?[1-9]\d{1,14}$/.test(phone);
```

### XSS Prevention
- All user input is already escaped by React
- Additional sanitization for notes field recommended

### CSRF Protection
- Implement CSRF tokens for state-changing operations
- Use secure HTTP-only cookies for sessions

## 🚀 Performance Optimization

### Implemented
- Debounced search input
- Lazy loading of activity logs
- Memoized filter functions
- Optimistic UI updates

### Future Improvements
```typescript
// Pagination
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(50);

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

// React Query for caching
import { useQuery } from '@tanstack/react-query';
const { data } = useQuery(['users', filters], 
  () => UserService.getUsers(filters)
);
```

## 📊 State Management

### Current: Local State
```typescript
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
```

### Future: Context API
```typescript
// Create UserContext
const UserContext = createContext<UserContextType>({});

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  // ... methods
  return (
    <UserContext.Provider value={{ users, ... }}>
      {children}
    </UserContext.Provider>
  );
};
```

### Future: Redux/Zustand
```typescript
// Using Zustand
import create from 'zustand';

interface UserStore {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    const users = await UserService.getUsers();
    set({ users, loading: false });
  },
  // ... other methods
}));
```

## 🔄 Activity Logging

### Custom Activity Types
```typescript
enum ActivityAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  INVITE_USER = 'INVITE_USER',
  RESET_PASSWORD = 'RESET_PASSWORD',
  ENABLE_2FA = 'ENABLE_2FA',
  DISABLE_2FA = 'DISABLE_2FA',
  VIEW_BOOKING = 'VIEW_BOOKING',
  CREATE_BOOKING = 'CREATE_BOOKING',
  // Add more as needed
}
```

### Activity Logger Utility
```typescript
class ActivityLogger {
  static async log(
    userId: string,
    action: ActivityAction,
    description: string,
    metadata?: Record<string, any>
  ) {
    await UserService.createActivity({
      userId,
      action,
      description,
      timestamp: new Date(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      metadata
    });
  }

  private static async getClientIP() {
    // Implementation to get client IP
    return '192.168.1.100';
  }
}

// Usage
ActivityLogger.log(
  user.id, 
  ActivityAction.UPDATE_USER, 
  `Updated user ${targetUser.email}`,
  { updatedFields: ['role', 'status'] }
);
```

## 📝 Documentation

### JSDoc Comments
```typescript
/**
 * Gets all users with optional filtering
 * @param filters - Optional filter criteria
 * @param filters.role - Filter by user role
 * @param filters.status - Filter by user status
 * @param filters.search - Search term for name/email
 * @returns Promise resolving to array of users
 * @throws Error if request fails
 * @example
 * const admins = await UserService.getUsers({ role: UserRole.ADMIN });
 */
getUsers: async (filters?: {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}): Promise<User[]>
```

## 🐛 Error Handling

### Service Level
```typescript
export const UserService = {
  getUsers: async (filters?) => {
    try {
      await delay(300);
      // ... logic
      return filtered;
    } catch (error) {
      console.error('Failed to get users:', error);
      throw new Error('Unable to fetch users. Please try again.');
    }
  }
};
```

### Component Level
```typescript
const loadUsers = async () => {
  setLoading(true);
  try {
    const data = await UserService.getUsers(filters);
    setUsers(data);
    setError(null);
  } catch (error) {
    setError(error.message);
    toast.error('Failed to load users');
  } finally {
    setLoading(false);
  }
};
```

## 📦 Dependencies

### Current
- React 18+
- TypeScript 5+
- Lucide React (icons)
- Tailwind CSS (styling)

### Recommended Additions
- React Query - Data fetching & caching
- Zod - Runtime validation
- React Hook Form - Form management
- React Table - Advanced table features
- Date-fns - Date formatting

## 🎯 Feature Roadmap

### Phase 1 (Current) ✅
- Basic CRUD operations
- User listing with filters
- Activity logging
- User invitations

### Phase 2 (Next)
- [ ] Backend integration
- [ ] Real-time updates (WebSocket)
- [ ] Advanced permissions
- [ ] Bulk operations
- [ ] Export/Import users

### Phase 3 (Future)
- [ ] User groups/teams
- [ ] Custom roles
- [ ] Audit trail export
- [ ] Session management
- [ ] Login history charts

## 💡 Tips & Best Practices

1. **Always validate user input** on both client and server
2. **Use TypeScript** strictly - no `any` types
3. **Handle loading states** for better UX
4. **Provide feedback** for all user actions
5. **Keep modals focused** - one purpose per modal
6. **Test edge cases** - empty states, errors, etc.
7. **Document changes** in activity log
8. **Follow accessibility** guidelines (ARIA labels, keyboard nav)

## 🆘 Common Issues

### Issue: State not updating after save
**Solution**: Ensure you're calling `loadUsers()` after mutations

### Issue: Modal not closing
**Solution**: Check `onClose` prop is properly passed and called

### Issue: Filters not working
**Solution**: Verify filter state is passed to `getUsers()`

### Issue: Activity log empty
**Solution**: Ensure `getUserActivities()` is called when tab is active

---

**For Questions**: Contact the development team or create an issue in the repository.
