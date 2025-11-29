import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const BookingCalendar: React.FC = () => {
  return (
    <ComingSoon
      title="Booking Calendar"
      description="Visual calendar view of all bookings with drag-and-drop scheduling capabilities."
      features={[
        'Monthly/weekly/daily calendar views',
        'Color-coded bookings by tour type',
        'Drag and drop to reschedule bookings',
        'Quick booking creation from calendar',
        'Availability overview per tour',
        'Filter by tour, status, or customer',
        'Export calendar to PDF or iCal format',
        'Sync with Google Calendar/Outlook',
      ]}
    />
  );
};
