# Admin User Management Module

## Overview

The Admin User Management module provides a comprehensive frontend-only UI for managing admin users, roles, permissions, security settings, and activity monitoring in the Aventra Booking System.

**Route:** `/admin/settings/users`

## Features

### 1. **Admin User Accounts Table**
- Displays all admin users with the following information:
  - Profile Image
  - Name
  - Email
  - Assigned Roles
  - Account Status (Active/Inactive/Pending)
  - Last Login Time (with relative time display)
  - 2FA Status (toggle button)
  - Quick Action Buttons

**Features:**
- Search by name or email
- Filter by role and status
- Pagination (10 users per page)
- Mobile-responsive card layout
- Expandable rows for additional info (IP, Device, Browser)

### 2. **Create & Manage Admin Users**

#### Add New User Modal
- Profile photo upload with preview
- Full name (required)
- Email address (required)
- Phone number (optional)
- Multi-select role assignment
- Account status toggle (Active/Inactive/Pending)
- Temporary password generation
- Force password reset on first login checkbox

#### Edit User Modal
- Same fields as Add New User
- Email field is disabled for existing users
- Password section is hidden (requires separate password reset)

### 3. **Roles & Permissions Assignment**

#### Multi-Select Dropdown
- Shows all available roles:
  - Super Admin
  - Admin
  - Manager
  - Support
- Visual badges showing selected roles

#### View Role Permissions Modal
- Expandable permission categories
- Read-only permission list grouped by module
- Shows permissions for all assigned roles
- Permission categories include:
  - User Management
  - Bookings
  - Customers
  - Tours
  - Marketing
  - Reports
  - Settings

### 4. **User Activity Logs & Audit Trail**

#### Activity Logs Modal
- Timeline-style activity display
- Shows:
  - Timestamp (relative and absolute)
  - Action type with visual icon
  - Module/category
  - IP address
  - Detailed description

**Action Types:**
- Login / Logout
- Create/Edit/Delete User
- Change Password
- Enable/Disable 2FA
- Update Role

**Filters:**
- Action type filter
- Date range filter (7 days, 30 days, 90 days, all time)

### 5. **Two-Factor Authentication (2FA)**

**Features:**
- Toggle button in user table row
- Visual indicator (locked/unlocked icon)
- Status color coding:
  - Green = Enabled
  - Gray = Disabled
- Support for:
  - Reset 2FA Setup
  - Disable/Enable 2FA per user

### 6. **Password Policies**

#### Collapsible Panel with:
- **Minimum Length:** Slider (8-20 characters, default: 12)
- **Expiration Rule:** Slider (0-365 days, default: 90)
- **Character Requirements:**
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)

**Features:**
- Real-time policy strength indicator
- Visual feedback with color-coded strength levels:
  - Weak (red)
  - Moderate (yellow)
  - Strong (green)
  - Very Strong (dark green)
- Save and Reset options
- NIST guidelines information box

### 7. **User Status Management**

**Status Options:**
- **Active:** User has full access to the system
- **Inactive:** User cannot log in or access the system
- **Pending:** Awaiting invitation acceptance or account activation

**Bulk Status Update:**
- Quick toggle in table
- Bulk action via Bulk Actions modal

### 8. **Last Login Tracking**

**Displayed Information:**
- Last login timestamp (relative: "2h ago", "Yesterday", etc.)
- Browser information (e.g., "Chrome 131")
- IP address (e.g., "192.168.1.100")
- Device information (e.g., "MacBook Pro", "iPhone 14")
- Location (if available)

### 9. **Session Management**

#### Active Sessions Modal
- Lists all active sessions for a user
- Displays:
  - Device type and browser
  - IP address
  - Login time
  - Last activity (relative time)
  - Location
- Current session badge
- Individual session termination button
- "Terminate All Sessions" button for bulk logout

### 10. **User Invitation System**

#### Invite New Admin User Modal
- Email address input (required)
- Multi-select role assignment
- Automatic email sending
- Invitation status tracking:
  - Pending (awaiting response)
  - Accepted (invitation accepted)
  - Expired (invitation link expired)

**After Invitation:**
- "Invitation Sent" success notification
- Invitation badge displayed in user table
- Pending status until user accepts

### 11. **Bulk User Operations**

#### Bulk Actions Modal
Applies to selected users with:

**Available Actions:**
- **Activate:** Set selected users to active status
- **Deactivate:** Set selected users to inactive status
- **Assign Role:** Add a specific role to all selected users
- **Delete:** Permanently remove selected users

**Features:**
- Multi-select checkboxes in table header and rows
- Selection counter with "Select All" toggle
- Confirmation modal with action summary
- Danger warnings for destructive actions
- Success feedback

## Component Structure

```
AdminUsersManager/
├── AdminUsersManager.tsx (main container)
├── UserTable.tsx
├── AddEditUserModal.tsx
├── RolePermissionsModal.tsx
├── ActivityLogsModal.tsx
├── SessionManagementModal.tsx
├── UserInvitationModal.tsx
├── BulkActionsModal.tsx
├── PasswordPoliciesPanel.tsx
└── UserStatusIndicator.tsx

Types:
├── types/userManagementTypes.ts
```

## Data Types

```typescript
type UserRole = 'Super Admin' | 'Admin' | 'Manager' | 'Support';
type UserStatus = 'active' | 'inactive' | 'pending';
type InvitationStatus = 'pending' | 'accepted' | 'expired';
type ActionType = 'login' | 'create_user' | 'edit_user' | 'delete_user' | 'change_password' | 'enable_2fa' | 'disable_2fa' | 'update_role' | 'logout';

interface AdminUser {
  id: string;
  profileImage?: string;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  lastLogin: Date | null;
  lastLoginBrowser?: string;
  lastLoginIP?: string;
  lastLoginDevice?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  forcePasswordReset?: boolean;
}
```

## Usage Example

The module is automatically available at the route `/admin/settings/users`. Simply navigate to this route and the `AdminUsersManager` component will render.

```tsx
// In App.tsx (already configured)
<Route path="/admin/settings/users" element={
  <ProtectedRoute requiredRole={UserRole.ADMIN}>
    <AdminLayout><UserManagement /></AdminLayout>
  </ProtectedRoute>
} />
```

## Design Patterns

### Responsive Design
- **Desktop:** Full table view with all features
- **Tablet:** Optimized table layout
- **Mobile:** Card-based layout with essential actions

### User Experience
- Inline actions (edit, delete, view permissions)
- Confirmation modals for destructive actions
- Real-time updates with state management
- Smooth animations and transitions
- Loading states for async operations
- Visual feedback (success/error notifications)

### Styling
- Uses Tailwind CSS utility classes
- Consistent color scheme:
  - Blue: Primary actions
  - Green: Success/Active status
  - Red: Destructive actions/Warnings
  - Yellow: Pending status/Warnings
  - Gray: Inactive/Disabled

### Icons
- Uses `lucide-react` for consistent iconography:
  - Users, Shield, Lock/Unlock
  - Edit, Trash, Eye, Filter
  - Clock, MapPin, Smartphone
  - CheckCircle, AlertCircle

## Mock Data

The module includes mock data for:
- 5 sample admin users with varying roles and statuses
- 8 activity log entries per user
- 3 active sessions per user
- 4 role definitions with 10-15 permissions each
- Default password policies

Replace this with real API calls when integrating with backend.

## Future Enhancements

1. **Backend Integration**
   - API calls for CRUD operations
   - Real-time activity logging
   - Actual email invitation system

2. **Advanced Features**
   - Custom role creation
   - Granular permission management
   - Advanced filtering and search
   - Export user data to CSV
   - Two-factor authentication setup flow

3. **Security**
   - IP whitelisting
   - Login attempt tracking
   - Suspicious activity alerts
   - Account lockout policies

4. **Internationalization**
   - Multi-language support
   - Localized date/time formatting
   - Localized role names

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (responsive)

## Dependencies

- React 19.2.0+
- React Router DOM 7.9.6+
- Lucide React 0.555.0+
- Tailwind CSS 3.x+

## Notes

- All state management is client-side only
- No backend API integration (frontend UI only)
- Mock data resets on page refresh
- Suitable for prototyping and UI/UX development
- Ready for backend integration when API endpoints are available
