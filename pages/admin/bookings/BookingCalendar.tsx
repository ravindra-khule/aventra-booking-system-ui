import React, { useState, useEffect } from 'react';
import { BookingCalendar as BookingCalendarComponent } from '../../../src/features/bookings/components';
import { BookingService } from '../../../src/features/bookings/services/booking.service';
import { TourService } from '../../../src/shared/services';
import { Booking } from '../../../src/features/bookings/types/booking.types';
import { Tour } from '../../../src/features/tours/types/tour.types';

export const BookingCalendar: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load bookings and tours on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingsData, toursData] = await Promise.all([
          BookingService.getAll(),
          TourService.getAll(),
        ]);
        setBookings(bookingsData);
        setTours(toursData);
        setError(null);
      } catch (err) {
        setError('Failed to load calendar data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <BookingCalendarComponent
      bookings={bookings}
      tours={tours}
      onQuickBooking={(tourId, tripDate) => {
        console.log('Quick booking:', tourId, tripDate);
        // Implement quick booking logic
      }}
      onEditBooking={(booking) => {
        console.log('Edit booking:', booking.id);
        // Implement edit booking logic
      }}
      onDeleteBooking={(bookingId) => {
        console.log('Delete booking:', bookingId);
        // Implement delete booking logic
      }}
      onRescheduleBooking={(booking, newDate) => {
        console.log('Reschedule booking:', booking.id, newDate);
        // Implement reschedule logic
      }}
    />
  );
};
