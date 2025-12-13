/**
 * Calendar Filters Component
 * Provides filtering capabilities for bookings
 */

import React, { useState, useCallback } from 'react';
import { CalendarFilters, CalendarViewMode } from '../types/calendar.types';
import { BookingStatus } from '../types/booking.types';
import { Tour } from '../../tours/types/tour.types';
import { X, Filter } from 'lucide-react';
import styles from './CalendarFilters.module.css';

interface FiltersPanelProps {
  tours: Tour[];
  filters: CalendarFilters;
  viewMode: CalendarViewMode;
  onFiltersChange: (filters: CalendarFilters) => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onClearFilters: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  tours,
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTourToggle = useCallback((tourId: string) => {
    const updatedTours = filters.tours.includes(tourId)
      ? filters.tours.filter(id => id !== tourId)
      : [...filters.tours, tourId];
    onFiltersChange({ ...filters, tours: updatedTours });
  }, [filters, onFiltersChange]);

  const handleStatusToggle = useCallback((status: BookingStatus) => {
    const updatedStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: updatedStatuses });
  }, [filters, onFiltersChange]);

  const handleCustomerSearch = useCallback((search: string) => {
    onFiltersChange({ ...filters, customerSearch: search });
  }, [filters, onFiltersChange]);

  const activeFilterCount = 
    filters.tours.length + 
    filters.statuses.length + 
    (filters.customerSearch ? 1 : 0);

  return (
    <div className={styles.filterContainer}>
      <button
        className={styles.filterToggle}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Filter size={18} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className={styles.filterBadge}>{activeFilterCount}</span>
        )}
      </button>

      <div className={`${styles.filterPanel} ${isExpanded ? styles.expanded : ''}`}>
        {/* View Mode Selector */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>View Mode</h4>
          <div className={styles.viewModeButtons}>
            {['month', 'week', 'day'].map(mode => (
              <button
                key={mode}
                className={`${styles.viewModeBtn} ${viewMode === mode ? styles.active : ''}`}
                onClick={() => onViewModeChange(mode as CalendarViewMode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tour Filter */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Tours</h4>
          <div className={styles.filterOptions}>
            {tours.map(tour => (
              <label key={tour.id} className={styles.filterCheckbox}>
                <input
                  type="checkbox"
                  checked={filters.tours.includes(tour.id)}
                  onChange={() => handleTourToggle(tour.id)}
                />
                <span>{tour.title.substring(0, 20)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Status</h4>
          <div className={styles.filterOptions}>
            {Object.values(BookingStatus).map(status => (
              <label key={status} className={styles.filterCheckbox}>
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => handleStatusToggle(status)}
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Search */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Customer</h4>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search customer name..."
            value={filters.customerSearch || ''}
            onChange={(e) => handleCustomerSearch(e.target.value)}
          />
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button className={styles.clearButton} onClick={onClearFilters}>
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
