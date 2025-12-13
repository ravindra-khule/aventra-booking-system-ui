/**
 * Calendar Month View Component
 * Displays bookings in a traditional calendar grid (month view)
 */

import React, { useMemo } from 'react';
import { CalendarEvent, CalendarViewMode } from '../types/calendar.types';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, getShortDayName, getEventsForDate } from '../services/calendar.utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarViews.module.css';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  selectedDate?: Date;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  onEventClick,
  selectedDate,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = useMemo(() => {
    const result = [];
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(null);
    }
    // Days in month
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i);
    }
    return result;
  }, [daysInMonth, firstDayOfMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.monthView}>
      {/* Header */}
      <div className={styles.monthHeader}>
        <button onClick={onPrevMonth} className={styles.navButton}>
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.monthTitle}>
          {getMonthName(month)} {year}
        </h2>
        <button onClick={onNextMonth} className={styles.navButton}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className={styles.weekdayHeader}>
        {weekDays.map(day => (
          <div key={day} className={styles.weekdayCell}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.calendarGrid}>
        {days.map((day, index) => {
          const isCurrentMonth = day !== null;
          const date = isCurrentMonth ? new Date(year, month, day) : null;
          const dayEvents = date ? getEventsForDate(date, events) : [];
          const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();
          const isToday = date && date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`${styles.dayCell} ${isCurrentMonth ? styles.currentMonth : styles.otherMonth} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
              onClick={() => date && onDateClick(date)}
            >
              {day && (
                <>
                  <div className={styles.dayNumber}>{day}</div>
                  <div className={styles.dayEvents}>
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={styles.eventBadge}
                        style={{
                          backgroundColor: event.booking.status === 'CANCELLED' ? '#fee2e2' : event.color,
                          color: event.booking.status === 'CANCELLED' ? '#ef4444' : '#4c1d95',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        title={event.title}
                      >
                        {event.tour.title.substring(0, 10)}...
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className={styles.moreEvents}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


