import React, { useState, useEffect } from 'react';
import { Settings, Users, Lock, History, Plus, AlertCircle } from 'lucide-react';
import { RolePermissionService } from '../../../src/shared/services/role-permission.service';
import { Role, Permission, PermissionCategoryGroup, PermissionAuditLog } from '../../../types';
import { RoleManagementTab } from './components/RoleManagementTab';
import { PermissionManagerTab } from './components/PermissionManagerTab';
import { RoleTemplatesTab } from './components/RoleTemplatesTab';
import { AuditLogsTab } from './components/AuditLogsTab';

type TabType = 'roles' | 'permissions' | 'templates' | 'audit';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

export const RolesPermissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionCategoryGroup[]>([]);
  const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData, logsData] = await Promise.all([
        RolePermissionService.getRoles(),
        RolePermissionService.getPermissionsByCategory(),
        RolePermissionService.getAuditLogs(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setAuditLogs(logsData);
      setError(null);
    } catch (err) {
      setError('Failed to load roles and permissions data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleCreated = async () => {
    await loadData();
  };

  const handleRoleUpdated = async () => {
    await loadData();
  };

  const handleRoleDeleted = async () => {
    await loadData();
  };

  const tabs: Tab[] = [
    {
      id: 'roles',
      label: 'Role Management',
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 'permissions',
      label: 'Permissions',
      icon: <Lock className="h-5 w-5" />,
    },
    {
      id: 'templates',
      label: 'Role Templates',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: <History className="h-5 w-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
              <p className="text-gray-600 mt-2">
                Define custom roles with granular permission controls for team members
              </p>
            </div>
            {activeTab === 'roles' && (
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus className="h-5 w-5" />
                New Role
              </button>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Roles"
              value={roles.length}
              icon={<Users className="h-6 w-6 text-purple-600" />}
            />
            <StatCard
              label="Built-in Roles"
              value={roles.filter((r) => r.isBuiltIn).length}
              icon={<Lock className="h-6 w-6 text-blue-600" />}
            />
            <StatCard
              label="Custom Roles"
              value={roles.filter((r) => !r.isBuiltIn).length}
              icon={<Settings className="h-6 w-6 text-green-600" />}
            />
            <StatCard
              label="Total Permissions"
              value={permissions.reduce((acc, cat) => acc + cat.features.length, 0)}
              icon={<Lock className="h-6 w-6 text-orange-600" />}
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'roles' && (
              <RoleManagementTab
                roles={roles}
                onRoleCreated={handleRoleCreated}
                onRoleUpdated={handleRoleUpdated}
                onRoleDeleted={handleRoleDeleted}
              />
            )}

            {activeTab === 'permissions' && (
              <PermissionManagerTab
                permissionCategories={permissions}
                roles={roles}
              />
            )}

            {activeTab === 'templates' && (
              <RoleTemplatesTab
                onTemplateSelected={handleRoleCreated}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogsTab
                auditLogs={auditLogs}
                onRefresh={loadData}
              />
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">About Roles</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Roles group permissions together for easier management</li>
              <li>• Assign multiple roles to a single user</li>
              <li>• Use built-in roles or create custom ones</li>
              <li>• Role inheritance enables permission hierarchy</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">Permission Categories</h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li>• Bookings: Create, edit, confirm, cancel bookings</li>
              <li>• Customers: Manage customer data and communications</li>
              <li>• Finance: Handle payments, invoices, and reports</li>
              <li>• Tours: Manage tour inventory and pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="opacity-60">{icon}</div>
    </div>
  </div>
);
