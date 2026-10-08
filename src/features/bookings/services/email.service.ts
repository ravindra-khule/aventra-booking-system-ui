/**
 * Email Service
 * Handles sending reminder emails for payments, confirmations, etc.
 */

import { Booking, PaymentStatus } from '../../../../types';

export interface EmailPayload {
  to: string;
  subject: string;
  templateName: string;
  data: Record<string, any>;
  scheduledFor?: Date; // Optional: schedule email for later
}

export interface RemainingPaymentReminderData {
  bookingId: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  tourName: string;
  tripDate: string;
  remainingAmount: number;
  currency: string;
  paymentDueDate: string;
  bookingDetailsUrl: string;
  paymentLink?: string;
}

class EmailServiceClass {
  private apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:3001';

  /**
   * Send remaining payment reminder email
   * Called after guest makes partial (advance) payment
   */
  async sendRemainingPaymentReminder(booking: Booking): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!booking.payer) {
        return { success: false, error: 'Payer information missing' };
      }

      // Calculate days until trip
      const tripDate = new Date(booking.tripDate || booking.bookingDate);
      const today = new Date();
      const daysUntilTrip = Math.ceil((tripDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Payment should be due 30 days before trip
      const paymentDueDate = new Date(tripDate);
      paymentDueDate.setDate(paymentDueDate.getDate() - 30);
      const formattedDueDate = this.formatDate(paymentDueDate);

      const remainingAmount = booking.totalAmount - booking.paidAmount;

      const emailData: RemainingPaymentReminderData = {
        bookingId: booking.id,
        bookingReference: booking.id,
        guestName: `${booking.payer.firstName} ${booking.payer.lastName}`,
        guestEmail: booking.payer.email,
        tourName: booking.tourTitle || 'Your Upcoming Adventure',
        tripDate: this.formatDate(new Date(booking.tripDate || booking.bookingDate)),
        remainingAmount,
        currency: 'SEK',
        paymentDueDate: formattedDueDate,
        bookingDetailsUrl: `${window.location.origin}/#/my-bookings`,
        paymentLink: `${window.location.origin}/#/my-bookings?pay=${booking.id}`,
      };

      // Call backend API to send email
      const response = await this.sendEmail({
        to: booking.payer.email,
        subject: `Reminder: Complete Your Payment for ${emailData.tourName}`,
        templateName: 'remaining-payment-reminder',
        data: emailData,
      });

      console.log('[EmailService] Remaining payment reminder sent:', response);
      return response;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send reminder email';
      console.error('[EmailService] Error sending remaining payment reminder:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Send payment confirmation email
   * Called after guest completes payment
   */
  async sendPaymentConfirmation(
    booking: Booking,
    transactionId: string,
    amount: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!booking.payer) {
        return { success: false, error: 'Payer information missing' };
      }

      const emailData = {
        bookingId: booking.id,
        bookingReference: booking.id,
        guestName: `${booking.payer.firstName} ${booking.payer.lastName}`,
        guestEmail: booking.payer.email,
        tourName: booking.tourTitle || 'Your Upcoming Adventure',
        amount,
        currency: 'SEK',
        transactionId,
        paymentDate: this.formatDate(new Date()),
        bookingDetailsUrl: `${window.location.origin}/#/my-bookings`,
      };

      const response = await this.sendEmail({
        to: booking.payer.email,
        subject: 'Payment Confirmation - Thank You!',
        templateName: 'payment-confirmation',
        data: emailData,
      });

      console.log('[EmailService] Payment confirmation sent:', response);
      return response;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send confirmation email';
      console.error('[EmailService] Error sending payment confirmation:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Send booking confirmation email
   * Called after initial booking is created
   */
  async sendBookingConfirmation(booking: Booking): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!booking.payer) {
        return { success: false, error: 'Payer information missing' };
      }

      const emailData = {
        bookingId: booking.id,
        bookingReference: booking.id,
        guestName: `${booking.payer.firstName} ${booking.payer.lastName}`,
        guestEmail: booking.payer.email,
        tourName: booking.tourTitle || 'Your Upcoming Adventure',
        tripDate: this.formatDate(new Date(booking.tripDate || booking.bookingDate)),
        totalAmount: booking.totalAmount,
        paidAmount: booking.paidAmount,
        remainingAmount: booking.totalAmount - booking.paidAmount,
        currency: 'SEK',
        bookingDetailsUrl: `${window.location.origin}/#/my-bookings`,
        numberOfTravelers: booking.travelers?.length || 1,
      };

      const response = await this.sendEmail({
        to: booking.payer.email,
        subject: 'Booking Confirmed - Your Adventure Awaits!',
        templateName: 'booking-confirmation',
        data: emailData,
      });

      console.log('[EmailService] Booking confirmation sent:', response);
      return response;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send confirmation email';
      console.error('[EmailService] Error sending booking confirmation:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Map legacy template names to booking lifecycle events
   */
  private templateToEvent(templateName: string): string | null {
    const map: Record<string, string> = {
      'booking-confirmation': 'booking_approved',
      'payment-confirmation': 'payment_success',
      'payment-received': 'payment_success',
      'remaining-payment-reminder': 'payment_reminder',
      'payment-reminder': 'payment_reminder',
      'payment-failed': 'payment_failed',
      'payment-refunded': 'payment_refunded',
      'booking-cancelled': 'booking_cancelled_user',
      'booking-rescheduled': 'booking_rescheduled',
      'booking-completed': 'booking_completed',
    };
    return map[templateName] ?? null;
  }

  /**
   * Generic email sending method
   * Routes through bookings-notify.php so lifecycle emails reach
   * customer + client + admin per the notification settings.
   */
  private async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const bookingId = payload.data?.bookingId ?? payload.data?.booking_id;
      const event = this.templateToEvent(payload.templateName);

      // Lifecycle event with a booking -> notifications endpoint (multi-recipient)
      if (event && bookingId) {
        const response = await fetch(`${this.apiBaseUrl}/api/bookings-notify.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
          },
          body: JSON.stringify({
            bookingId,
            event,
            data: payload.data,
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
          throw new Error(data.error || `Notify API error: ${response.status}`);
        }

        return {
          success: true,
          messageId: `notify-${event}-${bookingId}-${Date.now()}`,
        };
      }

      // Fallback: direct single-recipient send
      const response = await fetch(`${this.apiBaseUrl}/api/emails/send.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Email API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.messageId,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error sending email';
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Schedule an email to be sent at a specific time
   * Used for payment reminders scheduled before trip date
   */
  async scheduleReminderEmail(
    booking: Booking,
    reminderDaysBeforeTrip: number = 30
  ): Promise<{ success: boolean; scheduledFor?: Date; error?: string }> {
    try {
      const tripDate = new Date(booking.tripDate || booking.bookingDate);
      const scheduledFor = new Date(tripDate);
      scheduledFor.setDate(scheduledFor.getDate() - reminderDaysBeforeTrip);

      // Don't schedule if the date is in the past
      if (scheduledFor < new Date()) {
        console.log('[EmailService] Scheduled date is in the past, sending immediately');
        const result = await this.sendRemainingPaymentReminder(booking);
        return { success: result.success, error: result.error };
      }

      // In dev mode
      if (import.meta.env.DEV) {
        console.log('[EmailService] DEV MODE - Would schedule reminder email for:', scheduledFor);
        return { success: true, scheduledFor };
      }

      // In production, call backend to schedule email
      const endpoint = `${this.apiBaseUrl}/api/emails/schedule-reminder`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.getAuthToken() && { Authorization: `Bearer ${this.getAuthToken()}` }),
        },
        body: JSON.stringify({
          bookingId: booking.id,
          scheduledFor,
          reminderType: 'remaining-payment',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Schedule API error: ${response.status}`);
      }

      return { success: true, scheduledFor };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to schedule reminder';
      console.error('[EmailService] Error scheduling reminder:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Format date to readable string
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get auth token from local storage or auth context
   */
  private getAuthToken(): string | null {
    try {
      // Try to get from localStorage first
      const authData = localStorage.getItem('authToken');
      if (authData) return authData;

      // You could also check your auth context here
      return null;
    } catch (error) {
      return null;
    }
  }
}

export const EmailService = new EmailServiceClass();
