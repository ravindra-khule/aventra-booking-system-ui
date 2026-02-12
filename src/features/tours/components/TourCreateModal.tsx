import React from 'react';
import { Tour, TourCategory, TourTag } from '../types/tour.types';
import { TourForm } from './TourForm';

interface TourCreateModalProps {
  isOpen: boolean;
  categories: TourCategory[];
  tags: TourTag[];
  onClose: () => void;
  onSubmit: (tour: Tour) => Promise<void>;
  initialTour?: Tour;
}

export const TourCreateModal: React.FC<TourCreateModalProps> = ({
  isOpen,
  categories,
  tags,
  onClose,
  onSubmit,
  initialTour
}) => {
  if (!isOpen) return null;

  return (
    <TourForm
      initialTour={initialTour}
      categories={categories}
      tags={tags}
      onSubmit={onSubmit}
      onCancel={onClose}
    />
  );
};
