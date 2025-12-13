/**
 * Calendar Day View Component
 * Displays detailed view of events for a single day
 */

import React, { useMemo } from 'react';
import { CalendarEvent } from '../types/calendar.types';
import { getEventsForDate, formatDateToString, getMonthName } from '../services/calendar.utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarViews.module.css';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevDay: () => void;
  onNextDay: () => void;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onPrevDay,
  onNextDay,
  onDateClick,
  onEventClick,
}) => {
  const dayEvents = useMemo(() => {
    return getEventsForDate(currentDate, events).sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
  }, [currentDate, events]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={styles.dayView}>
      {/* Header */}
      <div className={styles.dayViewHeader}>
        <button onClick={onPrevDay} className={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <div className={styles.dayViewTitle}>
          <h2>{currentDate.getDate()} {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
          <p className={styles.dayViewSubtitle}>
            {dayEvents.length} {dayEvents.length === 1 ? 'booking' : 'bookings'}
          </p>
        </div>
        <button onClick={onNextDay} className={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Events list */}
      <div className={styles.dayEventsList}>
        {dayEvents.length === 0 ? (
          <div className={styles.noEvents}>
            <p>No bookings for this date</p>
          </div>
        ) : (
          dayEvents.map(event => (
            <div
              key={event.id}
              className={styles.dayEventCard}
              onClick={() => onEventClick(event)}
              style={{
                borderLeftColor: event.color,
                backgroundColor: event.tour.category?.color ? event.tour.category.color + '15' : '#f0f9ff',
              }}
            >
              <div className={styles.eventCardHeader}>
                <h3 className={styles.eventTitle}>{event.tour.title}</h3>
                <span className={styles.eventStatus} style={{ backgroundColor: event.color }}>
                  {event.booking.status}
                </span>
              </div>
              <div className={styles.eventCardDetails}>
                <p><strong>Booking ID:</strong> {event.booking.id}</p>
                <p><strong>Customer:</strong> {event.booking.customerName}</p>
                <p><strong>Participants:</strong> {event.booking.participants}</p>
                <p><strong>Date Range:</strong> {formatDateToString(event.startDate)} to {formatDateToString(event.endDate)}</p>
                <p><strong>Total Amount:</strong> {event.booking.totalAmount} {event.booking.payer.country}</p>
                <p><strong>Payment Status:</strong> {event.booking.paymentStatus}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Time slots for the day */}
      <div className={styles.dayTimeSlots}>
        <h3 className={styles.slotsTitle}>Timeline</h3>
        <div className={styles.timelineContainer}>
          {hours.map(hour => {
            const hourEvents = dayEvents.filter(e => e.startDate.getHours() === hour);
            return (
              <div key={hour} className={styles.timelineSlot}>
                <div className={styles.timeLabel}>{String(hour).padStart(2, '0')}:00</div>
                {hourEvents.length > 0 && (
                  <div className={styles.slotEvents}>
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        className={styles.timelineEvent}
                        style={{ backgroundColor: event.color }}
                        onClick={() => onEventClick(event)}
                      >
                        {event.tour.title.substring(0, 15)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
