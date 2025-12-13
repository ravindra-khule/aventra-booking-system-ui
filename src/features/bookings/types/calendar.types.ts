/**
 * Calendar Types - Calendar-specific interfaces and enums
 */

import { Booking, BookingStatus } from './booking.types';
import { Tour } from '../../tours/types/tour.types';

// Calendar view modes
export enum CalendarViewMode {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day'
}

// Calendar event (booking on calendar)
export interface CalendarEvent {
  id: string;
  booking: Booking;
  tour: Tour;
  startDate: Date;
  endDate: Date;
  title: string;
  color: string;
  status: BookingStatus;
  isSelected?: boolean;
}

// Tour color coding
export interface TourColorMapping {
  tourId: string;
  tourTitle: string;
  color: string;
  backgroundColor: string;
}

// Calendar filters
export interface CalendarFilters {
  tours: string[]; // Tour IDs
  statuses: BookingStatus[];
  startDate?: Date;
  endDate?: Date;
  customerSearch?: string;
}

// Calendar availability
export interface TourAvailability {
  tourId: string;
  tourTitle: string;
  date: string;
  maxCapacity: number;
  bookedSlots: number;
  availableSlots: number;
  occupancyPercentage: number;
}

// Export format options
export enum ExportFormat {
  PDF = 'pdf',
  ICAL = 'ical',
  CSV = 'csv'
}

// Calendar event drag operation
export interface DraggedEvent {
  eventId: string;
  originalStartDate: Date;
  originalEndDate: Date;
  newStartDate: Date;
  newEndDate: Date;
}

// Quick booking creation form
export interface QuickBookingForm {
  tourId: string;
  tripDate: string;
  participants: number;
  customerName: string;
  customerEmail: string;
}

// Calendar configuration
export interface CalendarConfig {
  weekStartDay: 'Monday' | 'Sunday'; // 0 = Sunday, 1 = Monday
  timeZone: string;
  showWeekends: boolean;
  hoursPerDay: number; // For day view
  workingHours?: {
    start: number; // Hour (0-23)
    end: number; // Hour (0-23)
  };
}

// Google Calendar sync config
export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  isConnected: boolean;
}

// Outlook Calendar sync config
export interface OutlookCalendarConfig {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  isConnected: boolean;
}

// Calendar sync status
export interface CalendarSyncStatus {
  google: {
    isConnected: boolean;
    lastSync?: Date;
    nextSync?: Date;
  };
  outlook: {
    isConnected: boolean;
    lastSync?: Date;
    nextSync?: Date;
  };
}
