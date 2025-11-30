import React from 'react';
import { TourStatus, TourDifficulty } from '../types/tour.types';
import { Filter, X } from 'lucide-react';

interface TourFiltersProps {
  statusFilter: string;
  difficultyFilter: string;
  categoryFilter: string;
  onStatusChange: (status: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (category: string) => void;
  onClear: () => void;
  categories: Array<{ id: string; name: string }>;
}

export const TourFilters: React.FC<TourFiltersProps> = ({
  statusFilter,
  difficultyFilter,
  categoryFilter,
  onStatusChange,
  onDifficultyChange,
  onCategoryChange,
  onClear,
  categories
}) => {
  const hasFilters = statusFilter !== 'ALL' || difficultyFilter !== 'ALL' || categoryFilter !== 'ALL';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      <select 
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="ALL">All Status</option>
        {Object.values(TourStatus).map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      <select 
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={difficultyFilter}
        onChange={(e) => onDifficultyChange(e.target.value)}
      >
        <option value="ALL">All Difficulty</option>
        {Object.values(TourDifficulty).map(difficulty => (
          <option key={difficulty} value={difficulty}>{difficulty}</option>
        ))}
      </select>

      <select 
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="ALL">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
};
