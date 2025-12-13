/**
 * Main Booking Calendar Component
 * Integrates all calendar features
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CalendarViewMode, CalendarFilters, CalendarEvent, ExportFormat } from '../types/calendar.types';
import { Booking, BookingStatus } from '../types/booking.types';
import { Tour } from '../../tours/types/tour.types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { FiltersPanel } from './FiltersPanel';
import { AvailabilityOverview } from './AvailabilityOverview';
import { EventDetailModal } from './EventDetailModal';
import { QuickBookingModal } from './QuickBookingModal';
import {
  generateTourColors,
  bookingsToCalendarEvents,
  getEventsForDateRange,
} from '../services/calendar.utils';
import { exportCalendarEvents } from '../services/calendar-export.service';
import { Download, Plus } from 'lucide-react';
import styles from './BookingCalendar.module.css';

interface BookingCalendarProps {
  bookings: Booking[];
  tours: Tour[];
  onQuickBooking?: (tourId: string, tripDate: string) => void;
  onEditBooking?: (booking: Booking) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onRescheduleBooking?: (booking: Booking, newDate: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  tours,
  onQuickBooking,
  onEditBooking,
  onDeleteBooking,
  onRescheduleBooking,
}) => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>(CalendarViewMode.MONTH);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    tours: [],
    statuses: [],
  });

  // Generate tour colors
  const tourColorMappings = useMemo(() => generateTourColors(tours), [tours]);

  // Create a map of tours for quick lookup
  const toursMap = useMemo(() => {
    const map = new Map<string, Tour>();
    tours.forEach(tour => map.set(tour.id, tour));
    return map;
  }, [tours]);

  // Convert bookings to calendar events
  const allEvents = useMemo(
    () => bookingsToCalendarEvents(bookings, toursMap, tourColorMappings),
    [bookings, toursMap, tourColorMappings]
  );

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Filter by tours
      if (filters.tours.length > 0 && !filters.tours.includes(event.booking.tourId)) {
        return false;
      }
      // Filter by statuses
      if (filters.statuses.length > 0 && !filters.statuses.includes(event.booking.status)) {
        return false;
      }
      // Filter by customer name
      if (
        filters.customerSearch &&
        !event.booking.customerName
          .toLowerCase()
          .includes(filters.customerSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [allEvents, filters]);

  // Navigation handlers
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  }, [currentDate]);

  const handlePrevWeek = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleNextWeek = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handlePrevDay = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleNextDay = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  // Date/Event click handlers
  const handleDateClick = useCallback((date: Date) => {
    setCurrentDate(date);
    if (viewMode === CalendarViewMode.MONTH) {
      setViewMode(CalendarViewMode.DAY);
    }
  }, [viewMode]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  }, []);

  // Export handlers
  const handleExportPDF = useCallback(() => {
    exportCalendarEvents(filteredEvents, ExportFormat.PDF);
  }, [filteredEvents]);

  const handleExportICAL = useCallback(() => {
    exportCalendarEvents(filteredEvents, ExportFormat.ICAL);
  }, [filteredEvents]);

  const handleExportCSV = useCallback(() => {
    exportCalendarEvents(filteredEvents, ExportFormat.CSV);
  }, [filteredEvents]);

  // Clear filters handler
  const handleClearFilters = useCallback(() => {
    setFilters({
      tours: [],
      statuses: [],
    });
  }, []);

  // Render the appropriate calendar view
  const renderCalendarView = () => {
    switch (viewMode) {
      case CalendarViewMode.MONTH:
        return (
          <MonthView
            currentDate={currentDate}
            events={filteredEvents}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            selectedDate={currentDate}
          />
        );
      case CalendarViewMode.WEEK:
        return (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            selectedDate={currentDate}
          />
        );
      case CalendarViewMode.DAY:
        return (
          <DayView
            currentDate={currentDate}
            events={filteredEvents}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Booking Calendar</h1>
          <p className={styles.subtitle}>
            Manage and visualize all tour bookings across different views
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.exportButton} onClick={handleExportPDF}>
            <Download size={18} />
            PDF
          </button>
          <button className={styles.exportButton} onClick={handleExportICAL}>
            <Download size={18} />
            iCal
          </button>
          <button className={styles.exportButton} onClick={handleExportCSV}>
            <Download size={18} />
            CSV
          </button>
          {onQuickBooking && (
            <button className={styles.primaryButton} onClick={() => setShowQuickBooking(true)}>
              <Plus size={18} />
              Quick Booking
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Sidebar - Filters and Availability */}
        <aside className={styles.sidebar}>
          <FiltersPanel
            tours={tours}
            filters={filters}
            viewMode={viewMode}
            onFiltersChange={setFilters}
            onViewModeChange={setViewMode}
            onClearFilters={handleClearFilters}
          />

          <AvailabilityOverview
            tours={tours}
            bookings={bookings}
            selectedDate={currentDate}
          />
        </aside>

        {/* Main Calendar */}
        <main className={styles.mainContent}>
          {renderCalendarView()}
        </main>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onEdit={onEditBooking ? (event) => {
            setShowModal(false);
            onEditBooking(event.booking);
          } : undefined}
          onDelete={onDeleteBooking ? (eventId) => {
            setShowModal(false);
            onDeleteBooking(eventId);
          } : undefined}
          onReschedule={onRescheduleBooking ? (event) => {
            setShowModal(false);
            // This would typically open a reschedule dialog
            console.log('Reschedule:', event.booking.id);
          } : undefined}
        />
      )}

      {/* Quick Booking Modal */}
      <QuickBookingModal
        isOpen={showQuickBooking}
        onClose={() => setShowQuickBooking(false)}
        tours={tours}
        onSubmit={(tourId, customerName, customerEmail, tripDate) => {
          setShowQuickBooking(false);
          if (onQuickBooking) {
            onQuickBooking(tourId, tripDate);
          } else {
            console.log('Quick booking created:', {
              tourId,
              customerName,
              customerEmail,
              tripDate,
            });
          }
        }}
      />
    </div>
  );
};
