import React from 'react';
import { UserStatus } from '../types/userManagementTypes';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface UserStatusIndicatorProps {
  status: UserStatus;
}

export const UserStatusIndicator: React.FC<UserStatusIndicatorProps> = ({
  status,
}) => {
  const statusConfig = {
    active: {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle,
      label: 'Active',
    },
    inactive: {
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      icon: Circle,
      label: 'Inactive',
    },
    pending: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: Clock,
      label: 'Pending',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
    </span>
  );
};
