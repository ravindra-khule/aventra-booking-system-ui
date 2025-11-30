# User Management - Quick Reference Guide

## 🚀 Quick Start

### Accessing User Management
Navigate to: **Settings > User Management** or directly to `http://localhost:3001/#/admin/settings/users`

## 📊 Dashboard Overview

### Statistics Cards
- **Total Users**: All users in the system
- **Active**: Users with active status
- **Inactive**: Temporarily disabled users
- **Suspended**: Users under review

### User Table Columns
| Column | Description |
|--------|-------------|
| User | Avatar, name, and email |
| Role | User's role (Admin, Support, Accountant) |
| Status | Current status with icon |
| Last Login | Last login timestamp |
| 2FA | Two-factor authentication status |
| Actions | Quick action buttons |

## 🔧 Operations

### 1. Add User
**Button**: Blue "Add User" button (top right)

**Fields**:
- Full Name* (required)
- Email Address* (required)
- Phone Number (optional)
- Role* (Admin/Support/Accountant)
- Status* (Active/Inactive/Pending)
- Two-Factor Authentication (checkbox)
- Notes (optional)

**Role Descriptions**:
- **Admin**: Full system access
- **Support**: Booking and customer management
- **Accountant**: Financial operations only

### 2. Invite User
**Button**: Green "Invite User" button (top right)

**Process**:
1. Enter email address
2. Select role
3. Add personal message (optional)
4. Preview invitation
5. Send

**Details**:
- Invitation expires in 7 days
- User receives setup instructions via email
- Can track pending invitations

### 3. Edit User
**Action**: Click edit icon (pencil) in user row

**Editable Fields**:
- Name, email, phone
- Role and status
- 2FA settings
- Notes

**View Only**:
- User ID
- Created date
- Last login

### 4. View User Details
**Action**: Click eye icon in user row

**Tabs**:
- **Profile Details**:
  - Contact information
  - Role & permissions
  - Account metadata
  - Notes

- **Activity Log**:
  - Recent actions
  - Login history
  - IP addresses
  - Timestamps

### 5. Delete User
**Action**: Click trash icon in user row

**Warning**: 
- Requires confirmation
- Action cannot be undone
- Logged in activity history

## 🔍 Filtering & Search

### Search
Type in search box to filter by:
- User name
- Email address

### Filters
- **Role Filter**: All Roles / Admin / Support / Accountant
- **Status Filter**: All Status / Active / Inactive / Suspended / Pending

### Reset Filters
- Clear search box
- Set dropdowns to "All"

## 🔐 Security Features

### User Status
- **Active**: ✅ Full access granted
- **Inactive**: ⭕ Temporarily disabled
- **Suspended**: ⚠️ Under review
- **Pending**: ⏱️ Awaiting activation

### Two-Factor Authentication
- **Enabled**: 🛡️ Green shield icon
- **Disabled**: 🛡️ Gray shield icon
- Toggle in Edit User modal
- User sets up on next login

## 📝 Activity Tracking

All actions are automatically logged:
- User login/logout
- Profile updates
- Status changes
- Created/deleted users
- Viewed bookings/customers

**View Activity**:
1. Click eye icon on user
2. Switch to "Activity Log" tab
3. See chronological history

**Activity Details**:
- Action type with emoji icon
- Description
- Timestamp (relative)
- IP address
- User agent (browser)

## 🎨 Visual Indicators

### Role Colors
- **Admin**: 🟣 Purple
- **Support**: 🔵 Blue
- **Accountant**: 🟢 Green

### Status Colors
- **Active**: 🟢 Green
- **Inactive**: ⚪ Gray
- **Suspended**: 🔴 Red
- **Pending**: 🟡 Yellow

## ⚡ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close modal | ESC |
| Search focus | / |
| Save form | Enter (in modals) |

## 🔔 Notifications

Success messages for:
- ✅ User created
- ✅ User updated
- ✅ Invitation sent
- ✅ User deleted

Error messages for:
- ❌ Invalid email format
- ❌ Required fields missing
- ❌ Operation failed

## 📱 Mobile Support

- Responsive table layout
- Touch-optimized buttons
- Swipe-friendly modals
- Adaptive grid system

## 🎯 Best Practices

### Creating Users
1. Use company email addresses
2. Assign appropriate role
3. Enable 2FA for admins
4. Add notes for context

### Managing Access
1. Review inactive users regularly
2. Use suspend for temporary issues
3. Delete only when necessary
4. Track user activities

### Invitations
1. Double-check email addresses
2. Add personal welcome message
3. Follow up on pending invitations
4. Resend if expired

## 🔄 Workflow Examples

### Onboarding New Employee
1. Click "Invite User"
2. Enter work email
3. Select appropriate role
4. Add welcome message
5. Send invitation
6. New user sets up account
7. Verify 2FA is enabled

### Offboarding Employee
1. Find user in list
2. Click edit icon
3. Change status to "Inactive"
4. Add note: "Last day: [date]"
5. Save changes
6. Later: Delete user if needed

### Security Review
1. Filter by Admin role
2. Check 2FA status
3. Review last login dates
4. Check activity logs
5. Update access as needed

## 🆘 Troubleshooting

### Can't find user?
- Check search term
- Reset filters to "All"
- Verify status filter

### Invitation not received?
- Check spam folder
- Verify email address
- Resend invitation
- Check expiration date

### Changes not saving?
- Check required fields
- Verify email format
- Check error messages
- Try refreshing page

## 📞 Support

For technical issues:
- Check browser console
- Verify network connection
- Contact system administrator
- Review activity logs

---

**Last Updated**: December 30, 2024
**Version**: 1.0.0
**Status**: ✅ Production Ready
