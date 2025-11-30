import React from 'react';
import { TourStatus } from '../types/tour.types';
import { Badge } from '../../../shared/components/ui';

interface TourStatusBadgeProps {
  status: TourStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const TourStatusBadge: React.FC<TourStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getVariant = (status: TourStatus): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    switch(status) {
      case TourStatus.ACTIVE: return 'success';
      case TourStatus.DRAFT: return 'warning';
      case TourStatus.INACTIVE: return 'default';
      case TourStatus.ARCHIVED: return 'danger';
      default: return 'default';
    }
  };

  return (
    <Badge variant={getVariant(status)} size={size}>
      {status}
    </Badge>
  );
};
