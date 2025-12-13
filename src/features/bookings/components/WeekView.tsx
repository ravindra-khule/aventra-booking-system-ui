/**
 * Calendar Week View Component
 * Displays bookings in a week grid view
 */

import React, { useMemo } from 'react';
import { CalendarEvent } from '../types/calendar.types';
import { getWeekDateRange, getShortDayName, getEventsForDate, formatDateToString } from '../services/calendar.utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarViews.module.css';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  selectedDate?: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onPrevWeek,
  onNextWeek,
  onDateClick,
  onEventClick,
  selectedDate,
}) => {
  const { start, end } = getWeekDateRange(currentDate);

  const weekDays = useMemo(() => {
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [start, end]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={styles.weekView}>
      {/* Header */}
      <div className={styles.weekHeader}>
        <button onClick={onPrevWeek} className={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.weekTitle}>
          Week of {start.toLocaleDateString()} - {end.toLocaleDateString()}
        </h2>
        <button onClick={onNextWeek} className={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className={styles.weekDayHeaders}>
        <div className={styles.timeColumn}></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`${styles.dayHeader} ${selectedDate?.toDateString() === day.toDateString() ? styles.selected : ''}`}
            onClick={() => onDateClick(day)}
          >
            <div className={styles.dayName}>{getShortDayName(day.getDay())}</div>
            <div className={styles.dayDate}>{day.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className={styles.timeGrid}>
        <div className={styles.timeLabelColumn}>
          {hours.map(hour => (
            <div key={hour} className={styles.timeLabel}>
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className={styles.dayColumn}>
            {hours.map(hour => {
              const slotDate = new Date(day);
              slotDate.setHours(hour, 0, 0, 0);
              const dayEvents = getEventsForDate(day, events);

              return (
                <div
                  key={`${dayIndex}-${hour}`}
                  className={styles.timeSlot}
                  onClick={() => onDateClick(day)}
                >
                  {/* Render events for this hour */}
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={styles.weekEvent}
                      style={{
                        backgroundColor: event.color,
                        borderLeftColor: event.color,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      title={event.title}
                    >
                      <div className={styles.eventTitle}>{event.tour.title}</div>
                      <div className={styles.eventDetails}>
                        {event.booking.customerName} ({event.booking.participants})
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
