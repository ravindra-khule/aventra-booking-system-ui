/**
 * Availability Overview Component
 * Shows tour availability and capacity information
 */

import React, { useMemo } from 'react';
import { TourAvailability } from '../types/calendar.types';
import { Tour } from '../../tours/types/tour.types';
import { Booking } from '../types/booking.types';
import { calculateTourAvailability, formatDateToString } from '../services/calendar.utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import styles from './AvailabilityOverview.module.css';

interface AvailabilityOverviewProps {
  tours: Tour[];
  bookings: Booking[];
  selectedDate?: Date;
}

export const AvailabilityOverview: React.FC<AvailabilityOverviewProps> = ({
  tours,
  bookings,
  selectedDate = new Date(),
}) => {
  const dateString = formatDateToString(selectedDate);

  const tourAvailabilities = useMemo(() => {
    return tours.map(tour => calculateTourAvailability(tour.id, dateString, tour, bookings));
  }, [tours, bookings, dateString]);

  const highOccupancy = tourAvailabilities.filter(a => a.occupancyPercentage >= 80);
  const mediumOccupancy = tourAvailabilities.filter(a => a.occupancyPercentage >= 50 && a.occupancyPercentage < 80);
  const lowOccupancy = tourAvailabilities.filter(a => a.occupancyPercentage < 50);

  const getTrendIcon = (occupancy: number) => {
    return occupancy >= 80 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return '#ef4444'; // Red - High occupancy
    if (occupancy >= 50) return '#f59e0b'; // Amber - Medium occupancy
    return '#10b981'; // Green - Low occupancy (good availability)
  };

  return (
    <div className={styles.availabilityContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tour Availability</h3>
        <p className={styles.subtitle}>for {selectedDate.toLocaleDateString()}</p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>High Availability</div>
          <div className={styles.cardValue}>{lowOccupancy.length}</div>
          <div className={styles.cardIcon} style={{ color: '#10b981' }}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Medium Availability</div>
          <div className={styles.cardValue}>{mediumOccupancy.length}</div>
          <div className={styles.cardIcon} style={{ color: '#f59e0b' }}>
            <TrendingDown size={20} />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Low Availability</div>
          <div className={styles.cardValue}>{highOccupancy.length}</div>
          <div className={styles.cardIcon} style={{ color: '#ef4444' }}>
            <TrendingDown size={20} />
          </div>
        </div>
      </div>

      {/* Detailed List */}
      <div className={styles.detailedList}>
        <h4 className={styles.listTitle}>Capacity Details</h4>
        {tourAvailabilities.length === 0 ? (
          <p className={styles.noData}>No tours available</p>
        ) : (
          tourAvailabilities.map(availability => (
            <div key={availability.tourId} className={styles.availabilityItem}>
              <div className={styles.itemHeader}>
                <span className={styles.tourName}>{availability.tourTitle}</span>
                <span className={styles.occupancyBadge}>
                  {getTrendIcon(availability.occupancyPercentage)}
                  {availability.occupancyPercentage.toFixed(0)}%
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${availability.occupancyPercentage}%`,
                    backgroundColor: getOccupancyColor(availability.occupancyPercentage),
                  }}
                ></div>
              </div>
              <div className={styles.itemDetails}>
                <span>
                  {availability.bookedSlots} / {availability.maxCapacity} booked
                </span>
                <span>
                  {availability.availableSlots} available
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
