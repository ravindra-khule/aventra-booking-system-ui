/**
 * Event Detail Modal Component
 * Displays detailed information about a booking event
 */

import React from 'react';
import { CalendarEvent } from '../types/calendar.types';
import { X, Calendar, Users, DollarSign, User, Phone, Mail } from 'lucide-react';
import styles from './EventDetailModal.module.css';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  onReschedule?: (event: CalendarEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onReschedule,
}) => {
  if (!isOpen || !event) return null;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'CONFIRMED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'CANCELLED':
        return '#ef4444';
      case 'COMPLETED':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.modalTitle}>{event.tour.title}</h2>
            <span
              className={styles.statusBadge}
              style={{ backgroundColor: getStatusColor(event.booking.status) }}
            >
              {event.booking.status}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {/* Booking Information */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Booking Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Booking ID</span>
                <span className={styles.value}>{event.booking.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Booking Date</span>
                <span className={styles.value}>{event.booking.bookingDate}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Trip Date</span>
                <span className={styles.value}>{event.booking.tripDate}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Duration</span>
                <span className={styles.value}>{event.tour.durationDays} days</span>
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Customer Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <User size={16} />
                <div>
                  <span className={styles.label}>Name</span>
                  <span className={styles.value}>{event.booking.customerName}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Mail size={16} />
                <div>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{event.booking.payer.email}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Phone size={16} />
                <div>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{event.booking.payer.phone}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Users size={16} />
                <div>
                  <span className={styles.label}>Participants</span>
                  <span className={styles.value}>{event.booking.participants}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Payment Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Total Amount</span>
                <span className={styles.value}>{event.booking.totalAmount}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Paid Amount</span>
                <span className={styles.value}>{event.booking.paidAmount}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Remaining</span>
                <span className={styles.value} style={{ color: '#ef4444' }}>
                  {event.booking.totalAmount - event.booking.paidAmount}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Payment Status</span>
                <span className={styles.value}>{event.booking.paymentStatus}</span>
              </div>
            </div>
          </section>

          {/* Special Requests */}
          {event.booking.specialRequests && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Special Requests</h3>
              <p className={styles.requestText}>{event.booking.specialRequests}</p>
            </section>
          )}

          {/* Tour Details */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Tour Details</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Location</span>
                <span className={styles.value}>{event.tour.location}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Difficulty</span>
                <span className={styles.value}>{event.tour.difficulty}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Price</span>
                <span className={styles.value}>{event.tour.price}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {onReschedule && (
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={() => onReschedule(event)}
            >
              Reschedule
            </button>
          )}
          {onEdit && (
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => onEdit(event)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className={`${styles.button} ${styles.dangerButton}`}
              onClick={() => onDelete(event.id)}
            >
              Cancel Booking
            </button>
          )}
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
