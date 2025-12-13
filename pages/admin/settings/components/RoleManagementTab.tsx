import React, { useState } from 'react';
import { Trash2, Edit2, Copy, Plus, Users, Calendar, ChevronRight } from 'lucide-react';
import { Role } from '../../../../types';
import { RolePermissionService } from '../../../../src/shared/services/role-permission.service';
import { CreateRoleModal } from './modals/CreateRoleModal';
import { EditRoleModal } from './modals/EditRoleModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import { DuplicateRoleModal } from './modals/DuplicateRoleModal';

interface RoleManagementTabProps {
  roles: Role[];
  onRoleCreated: () => void;
  onRoleUpdated: () => void;
  onRoleDeleted: () => void;
}

type ModalType = 'create' | 'edit' | 'delete' | 'duplicate' | null;

export const RoleManagementTab: React.FC<RoleManagementTabProps> = ({
  roles,
  onRoleCreated,
  onRoleUpdated,
  onRoleDeleted,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuiltIn, setFilterBuiltIn] = useState<'all' | 'builtin' | 'custom'>('all');

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterBuiltIn === 'builtin') return role.isBuiltIn && matchesSearch;
    if (filterBuiltIn === 'custom') return !role.isBuiltIn && matchesSearch;
    return matchesSearch;
  });

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setActiveModal('edit');
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setActiveModal('delete');
  };

  const handleDuplicate = (role: Role) => {
    setSelectedRole(role);
    setActiveModal('duplicate');
  };

  const handleCreateSuccess = () => {
    setActiveModal(null);
    onRoleCreated();
  };

  const handleEditSuccess = () => {
    setActiveModal(null);
    setSelectedRole(null);
    onRoleUpdated();
  };

  const handleDeleteSuccess = () => {
    setActiveModal(null);
    setSelectedRole(null);
    onRoleDeleted();
  };

  const handleDuplicateSuccess = () => {
    setActiveModal(null);
    setSelectedRole(null);
    onRoleCreated();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        {/* Search and Create Button */}
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search roles by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setActiveModal('create')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Role
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterBuiltIn('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterBuiltIn === 'all'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Roles ({roles.length})
          </button>
          <button
            onClick={() => setFilterBuiltIn('builtin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterBuiltIn === 'builtin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Built-in ({roles.filter((r) => r.isBuiltIn).length})
          </button>
          <button
            onClick={() => setFilterBuiltIn('custom')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterBuiltIn === 'custom'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Custom ({roles.filter((r) => !r.isBuiltIn).length})
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first custom role to get started'}
          </p>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'create' && (
        <CreateRoleModal
          isOpen={activeModal === 'create'}
          onClose={() => setActiveModal(null)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {activeModal === 'edit' && selectedRole && (
        <EditRoleModal
          isOpen={activeModal === 'edit'}
          role={selectedRole}
          onClose={() => setActiveModal(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {activeModal === 'delete' && selectedRole && (
        <ConfirmDeleteModal
          isOpen={activeModal === 'delete'}
          role={selectedRole}
          onClose={() => setActiveModal(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {activeModal === 'duplicate' && selectedRole && (
        <DuplicateRoleModal
          isOpen={activeModal === 'duplicate'}
          role={selectedRole}
          onClose={() => setActiveModal(null)}
          onSuccess={handleDuplicateSuccess}
        />
      )}
    </div>
  );
};

// Role Card Component
interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onDuplicate: (role: Role) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete, onDuplicate }) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
          {role.isBuiltIn && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Built-in
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
      </div>
    </div>

    {/* Stats */}
    <div className="flex gap-4 mb-4 py-4 border-t border-b border-gray-100">
      <div className="flex items-center gap-2 text-sm">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">
          {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">{role.permissions.length} permissions</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-gray-600">{new Date(role.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      {!role.isBuiltIn && (
        <>
          <button
            onClick={() => onEdit(role)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(role)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </>
      )}
      <button
        onClick={() => onDuplicate(role)}
        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </button>
    </div>
  </div>
);
