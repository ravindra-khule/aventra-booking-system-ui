/**
 * Quick Booking Modal Component
 * Simplified form for creating a new booking quickly
 */

import React, { useState } from 'react';
import { Tour } from '../../tours/types/tour.types';
import { X, Plus } from 'lucide-react';
import {
  isValidEmail,
  isValidName,
  isValidISODate,
  isDateTodayOrFuture,
  isRequired,
} from '../../../shared/utils/validation.utils';
import styles from './QuickBookingModal.module.css';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tourId: string, customerName: string, customerEmail: string, tripDate: string) => void;
  tours: Tour[];
}

type QuickBookingField = 'tourId' | 'customerName' | 'customerEmail' | 'tripDate';
type QuickBookingErrors = Partial<Record<QuickBookingField, string>>;

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
  const [errors, setErrors] = useState<QuickBookingErrors>({});

  const clearError = (field: QuickBookingField) => {
    if (!errors[field]) return;
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const next: QuickBookingErrors = {};

    if (!isRequired(tourId)) {
      next.tourId = 'Please select a tour';
    }
    if (!isRequired(customerName)) {
      next.customerName = 'Customer name is required';
    } else if (!isValidName(customerName)) {
      next.customerName = 'Enter a valid name';
    }
    if (!isRequired(customerEmail)) {
      next.customerEmail = 'Email is required';
    } else if (!isValidEmail(customerEmail.trim())) {
      next.customerEmail = 'Enter a valid email address';
    }
    if (!isRequired(tripDate)) {
      next.tripDate = 'Trip date is required';
    } else if (!isValidISODate(tripDate)) {
      next.tripDate = 'Enter a valid date';
    } else if (!isDateTodayOrFuture(tripDate)) {
      next.tripDate = 'Trip date cannot be in the past';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(tourId, customerName.trim(), customerEmail.trim(), tripDate);

    // Reset form
    setTourId('');
    setCustomerName('');
    setCustomerEmail('');
    setTripDate('');
    setErrors({});
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
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Tour Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="tour" className={styles.label}>
              Select Tour *
            </label>
            <select
              id="tour"
              value={tourId}
              onChange={(e) => { setTourId(e.target.value); clearError('tourId'); }}
              className={`${styles.input} ${errors.tourId ? styles.inputError : ''}`}
              required
            >
              <option value="">-- Choose a tour --</option>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.title} (Capacity: {tour.maxCapacity})
                </option>
              ))}
            </select>
            {errors.tourId && <p className={styles.errorText}>{errors.tourId}</p>}
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
              onChange={(e) => { setCustomerName(e.target.value); clearError('customerName'); }}
              placeholder="Full name"
              className={`${styles.input} ${errors.customerName ? styles.inputError : ''}`}
              required
            />
            {errors.customerName && <p className={styles.errorText}>{errors.customerName}</p>}
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
              onChange={(e) => { setCustomerEmail(e.target.value); clearError('customerEmail'); }}
              placeholder="email@example.com"
              className={`${styles.input} ${errors.customerEmail ? styles.inputError : ''}`}
              required
            />
            {errors.customerEmail && <p className={styles.errorText}>{errors.customerEmail}</p>}
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
              onChange={(e) => { setTripDate(e.target.value); clearError('tripDate'); }}
              className={`${styles.input} ${errors.tripDate ? styles.inputError : ''}`}
              required
            />
            {errors.tripDate && <p className={styles.errorText}>{errors.tripDate}</p>}
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
