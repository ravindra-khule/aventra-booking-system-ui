import React, { useState } from 'react';
import { Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { PermissionCategoryGroup, Role } from '../../../../types';

interface PermissionManagerTabProps {
  permissionCategories: PermissionCategoryGroup[];
  roles: Role[];
}

export const PermissionManagerTab: React.FC<PermissionManagerTabProps> = ({
  permissionCategories,
  roles,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    permissionCategories.map((c) => c.category)
  );
  const [selectedRole, setSelectedRole] = useState<string>(roles[0]?.id || '');

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const currentRole = roles.find((r) => r.id === selectedRole);

  const getIconColor = (category: string) => {
    const colors: Record<string, string> = {
      bookings: 'bg-blue-100 text-blue-700',
      customers: 'bg-green-100 text-green-700',
      finance: 'bg-purple-100 text-purple-700',
      tours: 'bg-orange-100 text-orange-700',
      marketing: 'bg-pink-100 text-pink-700',
      users: 'bg-indigo-100 text-indigo-700',
      reports: 'bg-cyan-100 text-cyan-700',
      settings: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          View Permissions for Role
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name} ({role.permissions.length} permissions)
            </option>
          ))}
        </select>
      </div>

      {/* Role Info */}
      {currentRole && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{currentRole.name}</h3>
          <p className="text-gray-600 mb-4">{currentRole.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem label="Permissions" value={currentRole.permissions.length} />
            <StatItem label="Users" value={currentRole.userCount} />
            <StatItem label="Type" value={currentRole.isBuiltIn ? 'Built-in' : 'Custom'} />
            <StatItem label="Last Updated" value={new Date(currentRole.updatedAt).toLocaleDateString()} />
          </div>
        </div>
      )}

      {/* Permission Categories */}
      <div className="space-y-3">
        {permissionCategories.map((category) => (
          <div key={category.category} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className={`p-2 rounded-lg ${getIconColor(category.category)}`}>
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{category.label}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {category.features.filter((f) =>
                    currentRole?.permissions.includes(f.feature)
                  ).length}/{category.features.length}
                </span>
                {expandedCategories.includes(category.category) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Permissions List */}
            {expandedCategories.includes(category.category) && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="divide-y divide-gray-200">
                  {category.features.map((feature) => {
                    const isGranted =
                      currentRole?.permissions.includes(feature.feature) || false;
                    return (
                      <div
                        key={feature.id}
                        className="p-4 hover:bg-white transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold text-gray-900">
                                {feature.label}
                              </h5>
                              {isGranted && (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                  Granted
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {feature.description}
                            </p>
                          </div>
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                              isGranted
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isGranted ? '✓' : '✕'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-2">About Permissions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Each role has a specific set of permissions</li>
          <li>• Permissions control what actions users can perform</li>
          <li>• A user can be assigned multiple roles to inherit their combined permissions</li>
          <li>• Built-in roles have protected permission structures</li>
        </ul>
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</p>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);
