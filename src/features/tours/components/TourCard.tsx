import React from 'react';
import { Tour } from '../types/tour.types';
import { TourStatusBadge } from './TourStatusBadge';
import { MapPin, Calendar, Users, Star, Copy, Edit2, Trash2, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../shared/utils';

interface TourCardProps {
  tour: Tour;
  onView: (tour: Tour) => void;
  onEdit: (tour: Tour) => void;
  onDuplicate: (tour: Tour) => void;
  onDelete: (tour: Tour) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ 
  tour, 
  onView, 
  onEdit, 
  onDuplicate, 
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={tour.imageUrl} 
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <TourStatusBadge status={tour.status} />
        </div>
        {tour.isFeatured && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {tour.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {tour.shortDescription}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {tour.location}, {tour.country}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {tour.durationDays} days · {tour.difficulty}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3 w-3 mr-1" />
            {tour.availableSpots} / {tour.maxCapacity} spots
          </div>
        </div>

        {/* Stats */}
        {tour.totalBookings && tour.totalBookings > 0 && (
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 border-t pt-3">
            <div>
              <span className="font-medium text-gray-900">{tour.totalBookings}</span> bookings
            </div>
            {tour.averageRating && (
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
                <span className="font-medium text-gray-900">{tour.averageRating}</span>
                <span className="ml-1">({tour.reviewCount})</span>
              </div>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-between mb-4 border-t pt-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(tour.price)}
            </span>
            <span className="text-xs text-gray-500 ml-1">/ person</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onView(tour)}
            className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(tour)}
            className="flex items-center justify-center px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
            title="Edit Tour"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDuplicate(tour)}
            className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
            title="Duplicate Tour"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(tour)}
            className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            title="Delete Tour"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
