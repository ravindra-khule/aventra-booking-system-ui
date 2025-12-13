/**
 * Transportation Form - Add/edit transportation segments
 */

import React, { useState } from 'react';
import { Transportation } from '../../types/itinerary.types';
import { Button } from '../../../../shared/components/ui';
import { Save, X } from 'lucide-react';
import styles from './TransportationForm.module.css';

interface TransportationFormProps {
  transport?: Transportation;
  onSave: (transport: Transportation) => void;
  onCancel: () => void;
}

export const TransportationForm: React.FC<TransportationFormProps> = ({
  transport,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Transportation>(
    transport || {
      id: Math.random().toString(36).substr(2, 9),
      type: 'bus',
      description: '',
      departureLocation: '',
      arrivalLocation: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      distance: '',
      provider: '',
      bookingReference: '',
      notes: '',
      includedInPrice: true
    }
  );

  const handleSave = () => {
    if (!formData.description.trim() || !formData.departureLocation.trim() || !formData.arrivalLocation.trim()) {
      alert('Please fill in description, departure, and arrival locations');
      return;
    }
    onSave(formData);
  };

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <h4>{transport ? 'Edit Transportation' : 'Add Transportation'}</h4>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className={styles.select}
            >
              <option value="flight">Flight</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="car">Car</option>
              <option value="boat">Boat</option>
              <option value="cable_car">Cable Car</option>
              <option value="hiking">Hiking</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Provider (optional)</label>
            <input
              type="text"
              value={formData.provider || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              className={styles.input}
              placeholder="e.g., Thai Airways, Greyhound"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Description *</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={styles.input}
            placeholder="Describe the transportation (e.g., Scenic flight to Chiang Rai)"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Departure Location *</label>
            <input
              type="text"
              value={formData.departureLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, departureLocation: e.target.value }))}
              className={styles.input}
              placeholder="Starting point"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Arrival Location *</label>
            <input
              type="text"
              value={formData.arrivalLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, arrivalLocation: e.target.value }))}
              className={styles.input}
              placeholder="Destination"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Departure Time (optional)</label>
            <input
              type="time"
              value={formData.departureTime || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Arrival Time (optional)</label>
            <input
              type="time"
              value={formData.arrivalTime || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Duration (optional)</label>
            <input
              type="text"
              value={formData.duration || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className={styles.input}
              placeholder="e.g., 2 hours 30 minutes"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Distance (optional)</label>
            <input
              type="text"
              value={formData.distance || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
              className={styles.input}
              placeholder="e.g., 250 km"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Booking Reference (optional)</label>
            <input
              type="text"
              value={formData.bookingReference || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bookingReference: e.target.value }))}
              className={styles.input}
              placeholder="Confirmation or reference number"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Notes (optional)</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className={styles.textarea}
            rows={2}
            placeholder="Special instructions or important notes"
          />
        </div>

        <div className={styles.checkbox}>
          <label>
            <input
              type="checkbox"
              checked={formData.includedInPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, includedInPrice: e.target.checked }))}
            />
            <span>Included in tour price</span>
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <Button onClick={onCancel} variant="ghost" icon={<X className="h-4 w-4" />}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary" icon={<Save className="h-4 w-4" />}>
          Save Transportation
        </Button>
      </div>
    </div>
  );
};
