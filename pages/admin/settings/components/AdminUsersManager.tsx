import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Edit2,
  Trash2,
  MoreVertical,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminUser, UserStatus, UserRole, UserFilterOptions, PaginationState } from '../types/userManagementTypes';
import { UserTable } from './UserTable';
import { AddEditUserModal } from './AddEditUserModal';
import { RolePermissionsModal } from './RolePermissionsModal';
import { ActivityLogsModal } from './ActivityLogsModal';
import { SessionManagementModal } from './SessionManagementModal';
import { UserInvitationModal } from './UserInvitationModal';
import { BulkActionsModal } from './BulkActionsModal';
import { PasswordPoliciesPanel } from './PasswordPoliciesPanel';
import { UserStatusIndicator } from './UserStatusIndicator';
import { UserPermissionsModal, PermissionModule } from './UserPermissionsModal';

// Mock data - includes all demo login users from DemoLoginModal
const MOCK_USERS: AdminUser[] = [
  {
    id: 'user_superadmin',
    name: 'Super Admin',
    email: 'superadmin@aventra.com',
    phone: '+46 70 100 0001',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SUPER_ADMIN',
    roles: ['Super Admin'],
    status: 'active',
    lastLogin: new Date('2025-12-21T14:30:00'),
    lastLoginBrowser: 'Chrome 131',
    lastLoginIP: '192.168.1.100',
    lastLoginDevice: 'MacBook Pro',
    twoFactorEnabled: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-12-21'),
  },
  {
    id: 'user_admin',
    name: 'Admin User',
    email: 'admin@aventra.com',
    phone: '+46 70 100 0002',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ADMIN',
    roles: ['Admin'],
    status: 'active',
    lastLogin: new Date('2025-12-21T09:15:00'),
    lastLoginBrowser: 'Firefox 120',
    lastLoginIP: '192.168.1.101',
    lastLoginDevice: 'Windows PC',
    twoFactorEnabled: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-12-21'),
  },
  {
    id: 'user_support',
    name: 'Support Agent',
    email: 'support@aventra.com',
    phone: '+46 70 100 0003',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SUPPORT',
    roles: ['Support'],
    status: 'active',
    lastLogin: new Date('2025-12-21T10:45:00'),
    lastLoginBrowser: 'Safari 17',
    lastLoginIP: '192.168.1.102',
    lastLoginDevice: 'iPhone 14',
    twoFactorEnabled: false,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2025-12-21'),
  },
  {
    id: 'user_accountant',
    name: 'Accountant',
    email: 'accountant@aventra.com',
    phone: '+46 70 100 0004',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ACCOUNTANT',
    roles: ['Accountant'],
    status: 'active',
    lastLogin: new Date('2025-12-20T15:20:00'),
    lastLoginBrowser: 'Chrome 131',
    lastLoginIP: '192.168.1.103',
    lastLoginDevice: 'MacBook Air',
    twoFactorEnabled: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: 'user_developer',
    name: 'Developer',
    email: 'developer@aventra.com',
    phone: '+46 70 100 0005',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DEVELOPER',
    roles: ['Developer'],
    status: 'active',
    lastLogin: new Date('2025-12-20T18:30:00'),
    lastLoginBrowser: 'Chrome 131',
    lastLoginIP: '192.168.1.104',
    lastLoginDevice: 'Ubuntu Desktop',
    twoFactorEnabled: true,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2025-12-20'),
  },
];

const ROWS_PER_PAGE = 10;

export const AdminUsersManager: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<UserFilterOptions>({
    search: '',
    role: 'all',
    status: 'all',
    dateRange: { from: null, to: null },
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: ROWS_PER_PAGE,
    total: users.length,
  });

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showRolePermissionsModal, setShowRolePermissionsModal] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<AdminUser | null>(null);
  const [showActivityLogsModal, setShowActivityLogsModal] = useState(false);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<AdminUser | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedUserForSession, setSelectedUserForSession] = useState<AdminUser | null>(null);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [showPasswordPolicies, setShowPasswordPolicies] = useState(false);
  const [showUserPermissionsModal, setShowUserPermissionsModal] = useState(false);
  const [selectedUserForModulePermissions, setSelectedUserForModulePermissions] = useState<AdminUser | null>(null);
  
  // Store user permissions (in production, this would be in backend)
  const [userPermissions, setUserPermissions] = useState<Record<string, PermissionModule[]>>({});

  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesRole =
        filters.role === 'all' || user.roles.includes(filters.role as UserRole);

      const matchesStatus =
        filters.status === 'all' || user.status === filters.status;

      const matchesDate =
        (!filters.dateRange.from ||
          new Date(user.createdAt) >= filters.dateRange.from) &&
        (!filters.dateRange.to ||
          new Date(user.createdAt) <= filters.dateRange.to);

      return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    return filteredUsers.slice(start, start + pagination.pageSize);
  }, [filteredUsers, pagination.page, pagination.pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pagination.pageSize);

  // Handlers
  const handleAddUser = (formData: any) => {
    const newUser: AdminUser = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUsers([...users, newUser]);
    setShowAddEditModal(false);
  };

  const handleEditUser = (formData: any) => {
    setUsers(
      users.map((u) =>
        u.id === editingUser?.id
          ? { ...u, ...formData, updatedAt: new Date() }
          : u
      )
    );
    setEditingUser(null);
    setShowAddEditModal(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleToggleSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length && selectedUsers.size > 0) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
    }
  };

  const handleBulkAction = (action: any) => {
    const userIds = Array.from(selectedUsers);

    if (action.action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${userIds.length} users?`)) {
        setUsers(users.filter((u) => !userIds.includes(u.id)));
        setSelectedUsers(new Set());
      }
    } else if (action.action === 'activate') {
      setUsers(
        users.map((u) =>
          userIds.includes(u.id) ? { ...u, status: 'active' as UserStatus } : u
        )
      );
      setSelectedUsers(new Set());
    } else if (action.action === 'deactivate') {
      setUsers(
        users.map((u) =>
          userIds.includes(u.id) ? { ...u, status: 'inactive' as UserStatus } : u
        )
      );
      setSelectedUsers(new Set());
    } else if (action.action === 'assignRole') {
      setUsers(
        users.map((u) =>
          userIds.includes(u.id)
            ? { ...u, roles: [...u.roles, action.roleToAssign] }
            : u
        )
      );
      setSelectedUsers(new Set());
    }

    setShowBulkActionsModal(false);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === 'active' ? 'inactive' : 'active',
            }
          : u
      )
    );
  };

  const handleToggle2FA = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, twoFactorEnabled: !u.twoFactorEnabled }
          : u
      )
    );
  };
  
  const handleSaveUserPermissions = (userId: string, modules: PermissionModule[]) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: modules,
    }));
    // In production, this would call an API:
    // await permissionService.updateUserPermissions(userId, modules);
    console.log(`Saved permissions for user ${userId}:`, modules);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin User Management</h1>
        <p className="text-gray-600">Manage admin users, roles, permissions, and security settings.</p>
      </div>

      {/* Top Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => {
              setEditingUser(null);
              setShowAddEditModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add New User
          </button>

          <button
            onClick={() => setShowInvitationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="h-5 w-5" />
            Invite User
          </button>

          <div className="relative">
            <button
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              Filters
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showFiltersDropdown && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-72">
                {/* Role Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={filters.role}
                    onChange={(e) =>
                      setFilters({ ...filters, role: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      role: 'all',
                      status: 'all',
                      dateRange: { from: null, to: null },
                    })
                  }
                  className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowPasswordPolicies(!showPasswordPolicies)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Lock className="h-5 w-5 text-gray-600" />
            Password Policy
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setShowBulkActionsModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Bulk Actions
            </button>
          </div>
        )}
      </div>

      {/* Password Policies Panel */}
      {showPasswordPolicies && <PasswordPoliciesPanel />}

      {/* Users Table */}
      <UserTable
        users={paginatedUsers}
        selectedUsers={selectedUsers}
        onSelectUser={handleToggleSelection}
        onSelectAll={handleSelectAll}
        onEditUser={(user) => {
          setEditingUser(user);
          setShowAddEditModal(true);
        }}
        onDeleteUser={handleDeleteUser}
        onViewPermissions={(user) => {
          setSelectedUserForPermissions(user);
          setShowRolePermissionsModal(true);
        }}
        onViewActivityLogs={(user) => {
          setSelectedUserForLogs(user);
          setShowActivityLogsModal(true);
        }}
        onViewSessions={(user) => {
          setSelectedUserForSession(user);
          setShowSessionModal(true);
        }}
        onToggleStatus={handleToggleStatus}
        onToggle2FA={handleToggle2FA}
        onManageModulePermissions={(user) => {
          setSelectedUserForModulePermissions(user);
          setShowUserPermissionsModal(true);
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
          </span>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination({
                  ...pagination,
                  page: Math.max(1, pagination.page - 1),
                })
              }
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination({ ...pagination, page })}
                className={`px-3 py-2 rounded-lg transition ${
                  pagination.page === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setPagination({
                  ...pagination,
                  page: Math.min(totalPages, pagination.page + 1),
                })
              }
              disabled={pagination.page === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddEditModal && (
        <AddEditUserModal
          user={editingUser}
          onSave={editingUser ? handleEditUser : handleAddUser}
          onClose={() => {
            setShowAddEditModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {showRolePermissionsModal && selectedUserForPermissions && (
        <RolePermissionsModal
          user={selectedUserForPermissions}
          onClose={() => setShowRolePermissionsModal(false)}
        />
      )}

      {showActivityLogsModal && selectedUserForLogs && (
        <ActivityLogsModal
          user={selectedUserForLogs}
          onClose={() => setShowActivityLogsModal(false)}
        />
      )}

      {showSessionModal && selectedUserForSession && (
        <SessionManagementModal
          user={selectedUserForSession}
          onClose={() => setShowSessionModal(false)}
        />
      )}

      {showInvitationModal && (
        <UserInvitationModal
          onSend={(email, roles) => {
            console.log('Invitation sent to:', email, 'with roles:', roles);
            setShowInvitationModal(false);
          }}
          onClose={() => setShowInvitationModal(false)}
        />
      )}

      {showBulkActionsModal && (
        <BulkActionsModal
          selectedCount={selectedUsers.size}
          onAction={handleBulkAction}
          onClose={() => setShowBulkActionsModal(false)}
        />
      )}

      {showUserPermissionsModal && selectedUserForModulePermissions && (
        <UserPermissionsModal
          user={selectedUserForModulePermissions}
          onSave={handleSaveUserPermissions}
          onClose={() => setShowUserPermissionsModal(false)}
        />
      )}
    </div>
  );
};

export default AdminUsersManager;
