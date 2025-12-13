/**
 * Quick Booking Modal Component
 * Simplified form for creating a new booking quickly
 */

import React, { useState } from 'react';
import { Tour } from '../../tours/types/tour.types';
import { X, Plus } from 'lucide-react';
import styles from './QuickBookingModal.module.css';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tourId: string, customerName: string, customerEmail: string, tripDate: string) => void;
  tours: Tour[];
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tours,
}) => {
  const [tourId, setTourId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tripDate, setTripDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tourId || !customerName || !customerEmail || !tripDate) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit(tourId, customerName, customerEmail, tripDate);
    
    // Reset form
    setTourId('');
    setCustomerName('');
    setCustomerEmail('');
    setTripDate('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Plus size={24} className={styles.icon} />
            <h2 className={styles.title}>Quick Booking</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Tour Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="tour" className={styles.label}>
              Select Tour *
            </label>
            <select
              id="tour"
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              className={styles.input}
              required
            >
              <option value="">-- Choose a tour --</option>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.title} (Capacity: {tour.maxCapacity})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Customer Name *
            </label>
            <input
              id="name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Full name"
              className={styles.input}
              required
            />
          </div>

          {/* Customer Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="email@example.com"
              className={styles.input}
              required
            />
          </div>

          {/* Trip Date */}
          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Trip Date *
            </label>
            <input
              id="date"
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              <Plus size={18} />
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
