/**
 * User Permissions Modal
 * 
 * Allows managing module-level permissions for individual users
 * Example: Give support@aventra.com only BOOKING and CUSTOMER access
 */

import React, { useState } from 'react';
import {
  X,
  Shield,
  Calendar,
  Users,
  Megaphone,
  DollarSign,
  Wrench,
  Settings as SettingsIcon,
  UserCog,
  BarChart3,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';
import { AdminUser } from '../types/userManagementTypes';

// Permission modules
export enum PermissionModule {
  BOOKING = 'BOOKING',
  CUSTOMER = 'CUSTOMER',
  MARKETING = 'MARKETING',
  FINANCE = 'FINANCE',
  TOOLS = 'TOOLS',
  SETTINGS = 'SETTINGS',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  REPORTS = 'REPORTS',
}

interface ModuleInfo {
  id: PermissionModule;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface UserPermissionsModalProps {
  user: AdminUser;
  onClose: () => void;
  onSave: (userId: string, modules: PermissionModule[]) => void;
}

export const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  user,
  onClose,
  onSave,
}) => {
  // Initialize with all modules for demo - in production, load from backend
  const [selectedModules, setSelectedModules] = useState<Set<PermissionModule>>(
    new Set(Object.values(PermissionModule))
  );

  const modules: ModuleInfo[] = [
    {
      id: PermissionModule.BOOKING,
      name: 'Booking Management',
      icon: Calendar,
      color: 'blue',
      description: 'Manage bookings, reservations, and availability',
    },
    {
      id: PermissionModule.CUSTOMER,
      name: 'Customer Management',
      icon: Users,
      color: 'green',
      description: 'Manage customers, groups, and contacts',
    },
    {
      id: PermissionModule.MARKETING,
      name: 'Marketing & Campaigns',
      icon: Megaphone,
      color: 'purple',
      description: 'Manage marketing campaigns and analytics',
    },
    {
      id: PermissionModule.FINANCE,
      name: 'Financial Management',
      icon: DollarSign,
      color: 'amber',
      description: 'Manage invoices, payments, and reports',
    },
    {
      id: PermissionModule.TOOLS,
      name: 'Tools & Utilities',
      icon: Wrench,
      color: 'slate',
      description: 'Access system tools and utilities',
    },
    {
      id: PermissionModule.SETTINGS,
      name: 'System Settings',
      icon: SettingsIcon,
      color: 'gray',
      description: 'Configure system settings and preferences',
    },
    {
      id: PermissionModule.USER_MANAGEMENT,
      name: 'User Management',
      icon: UserCog,
      color: 'indigo',
      description: 'Manage users and assign permissions',
    },
    {
      id: PermissionModule.REPORTS,
      name: 'Reports & Analytics',
      icon: BarChart3,
      color: 'pink',
      description: 'View and export reports and analytics',
    },
  ];

  const toggleModule = (module: PermissionModule) => {
    const newModules = new Set(selectedModules);
    if (newModules.has(module)) {
      newModules.delete(module);
    } else {
      newModules.add(module);
    }
    setSelectedModules(newModules);
  };

  const selectAll = () => {
    setSelectedModules(new Set(Object.values(PermissionModule)));
  };

  const clearAll = () => {
    setSelectedModules(new Set());
  };

  const handleSave = () => {
    onSave(user.id, Array.from(selectedModules));
    onClose();
  };

  const getColorClasses = (color: string, selected: boolean) => {
    if (selected) {
      const colors: Record<string, string> = {
        blue: 'bg-blue-50 border-blue-500 text-blue-700',
        green: 'bg-green-50 border-green-500 text-green-700',
        purple: 'bg-purple-50 border-purple-500 text-purple-700',
        amber: 'bg-amber-50 border-amber-500 text-amber-700',
        slate: 'bg-slate-50 border-slate-500 text-slate-700',
        gray: 'bg-gray-50 border-gray-500 text-gray-700',
        indigo: 'bg-indigo-50 border-indigo-500 text-indigo-700',
        pink: 'bg-pink-50 border-pink-500 text-pink-700',
      };
      return colors[color] || 'bg-blue-50 border-blue-500 text-blue-700';
    }
    return 'bg-white border-gray-200 text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Manage Permissions</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-400">•</span>
              <span>{user.email}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">
                Select which modules this user can access
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Example: For support@swett.com, select only "Booking Management" and "Customer
                Management" to give support screen access only.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">
                {selectedModules.size} of {modules.length}
              </span>{' '}
              modules selected
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              const isSelected = selectedModules.has(module.id);

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  className={`relative p-4 border-2 rounded-lg text-left transition ${getColorClasses(
                    module.color,
                    isSelected
                  )}`}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className={`w-6 h-6 rounded-full bg-${module.color}-600 flex items-center justify-center`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? `bg-${module.color}-100` : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? `text-${module.color}-600` : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{module.name}</h3>
                      <p className="text-xs opacity-80 line-clamp-2">{module.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Changes will take effect on next login
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
