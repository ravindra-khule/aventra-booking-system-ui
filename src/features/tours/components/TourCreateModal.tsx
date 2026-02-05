import React from 'react';
import { Tour, TourCategory, TourTag } from '../types/tour.types';
import { TourForm } from './TourForm';

interface TourCreateModalProps {
  isOpen: boolean;
  categories: TourCategory[];
  tags: TourTag[];
  onClose: () => void;
  onSubmit: (tour: Tour) => Promise<void>;
}

export const TourCreateModal: React.FC<TourCreateModalProps> = ({
  isOpen,
  categories,
  tags,
  onClose,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <TourForm
      categories={categories}
      tags={tags}
      onSubmit={onSubmit}
      onCancel={onClose}
    />
  );
};
