/**
 * Calendar Utility Functions
 */

import { CalendarEvent, CalendarViewMode, TourColorMapping, TourAvailability } from '../types/calendar.types';
import { Booking, BookingStatus } from '../types/booking.types';
import { Tour } from '../../tours/types/tour.types';

/**
 * Generate tour color mappings
 */
export const generateTourColors = (tours: Tour[]): TourColorMapping[] => {
  const colorPalette = [
    { color: '#3b82f6', background: '#dbeafe' }, // Blue
    { color: '#ef4444', background: '#fee2e2' }, // Red
    { color: '#10b981', background: '#d1fae5' }, // Green
    { color: '#f59e0b', background: '#fef3c7' }, // Amber
    { color: '#8b5cf6', background: '#ede9fe' }, // Purple
    { color: '#ec4899', background: '#fce7f3' }, // Pink
    { color: '#14b8a6', background: '#ccfbf1' }, // Teal
    { color: '#f97316', background: '#ffedd5' }, // Orange
  ];

  return tours.map((tour, index) => ({
    tourId: tour.id,
    tourTitle: tour.title,
    color: colorPalette[index % colorPalette.length].color,
    backgroundColor: colorPalette[index % colorPalette.length].background,
  }));
};

/**
 * Convert bookings to calendar events
 */
export const bookingsToCalendarEvents = (
  bookings: Booking[],
  tours: Map<string, Tour>,
  colorMappings: TourColorMapping[]
): CalendarEvent[] => {
  return bookings.map(booking => {
    const tour = tours.get(booking.tourId);
    const colorMapping = colorMappings.find(cm => cm.tourId === booking.tourId);

    return {
      id: booking.id,
      booking,
      tour: tour!,
      startDate: new Date(booking.tripDate),
      endDate: new Date(new Date(booking.tripDate).getTime() + (tour?.durationDays || 1) * 24 * 60 * 60 * 1000),
      title: `${booking.tourTitle} (${booking.participants} ${booking.participants === 1 ? 'person' : 'people'})`,
      color: colorMapping?.color || '#3b82f6',
      status: booking.status,
      isSelected: false,
    };
  });
};

/**
 * Get days in month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get first day of month (0 = Sunday, 6 = Saturday)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * Get week number
 */
export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Get date range for week
 */
export const getWeekDateRange = (date: Date): { start: Date; end: Date } => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const start = new Date(d.setDate(diff));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Parse date string to Date object
 */
export const parseStringToDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Check if dates overlap
 */
export const datesOverlap = (
  startDate1: Date,
  endDate1: Date,
  startDate2: Date,
  endDate2: Date
): boolean => {
  return startDate1 <= endDate2 && startDate2 <= endDate1;
};

/**
 * Get events for a specific date
 */
export const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
  const dateString = formatDateToString(date);
  return events.filter(event => {
    const eventStart = formatDateToString(event.startDate);
    const eventEnd = formatDateToString(event.endDate);
    return dateString >= eventStart && dateString <= eventEnd;
  });
};

/**
 * Get events for a date range
 */
export const getEventsForDateRange = (
  startDate: Date,
  endDate: Date,
  events: CalendarEvent[]
): CalendarEvent[] => {
  return events.filter(event =>
    datesOverlap(startDate, endDate, event.startDate, event.endDate)
  );
};

/**
 * Calculate tour availability for a date
 */
export const calculateTourAvailability = (
  tourId: string,
  date: string,
  tour: Tour,
  bookings: Booking[]
): TourAvailability => {
  const tourBookings = bookings.filter(
    b => b.tourId === tourId && b.tripDate === date && b.status !== BookingStatus.CANCELLED
  );

  const bookedSlots = tourBookings.reduce((sum, b) => sum + b.participants, 0);
  const availableSlots = tour.maxCapacity - bookedSlots;
  const occupancyPercentage = (bookedSlots / tour.maxCapacity) * 100;

  return {
    tourId,
    tourTitle: tour.title,
    date,
    maxCapacity: tour.maxCapacity,
    bookedSlots,
    availableSlots,
    occupancyPercentage,
  };
};

/**
 * Get status color
 */
export const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return '#10b981'; // Green
    case BookingStatus.PENDING:
      return '#f59e0b'; // Amber
    case BookingStatus.CANCELLED:
      return '#ef4444'; // Red
    case BookingStatus.COMPLETED:
      return '#3b82f6'; // Blue
    default:
      return '#6b7280'; // Gray
  }
};

/**
 * Get status background color
 */
export const getStatusBackgroundColor = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return '#d1fae5'; // Light green
    case BookingStatus.PENDING:
      return '#fef3c7'; // Light amber
    case BookingStatus.CANCELLED:
      return '#fee2e2'; // Light red
    case BookingStatus.COMPLETED:
      return '#dbeafe'; // Light blue
    default:
      return '#f3f4f6'; // Light gray
  }
};

/**
 * Format time for display
 */
export const formatTime = (hour: number, minute: number = 0): string => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

/**
 * Get month name
 */
export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

/**
 * Get day name
 */
export const getDayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};

/**
 * Get short day name
 */
export const getShortDayName = (dayIndex: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
};
