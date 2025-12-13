/**
 * Accommodation Form - Add/edit accommodation for itinerary days
 */

import React, { useState } from 'react';
import { Accommodation } from '../../types/itinerary.types';
import { Button } from '../../../../shared/components/ui';
import { Save, X } from 'lucide-react';
import styles from './AccommodationForm.module.css';

interface AccommodationFormProps {
  accommodation?: Accommodation;
  onSave: (accommodation: Accommodation) => void;
  onCancel: () => void;
}

export const AccommodationForm: React.FC<AccommodationFormProps> = ({
  accommodation,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Accommodation>(
    accommodation || {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      type: 'hotel',
      location: '',
      description: '',
      address: '',
      amenities: [],
      roomType: '',
      checkInTime: '14:00',
      checkOutTime: '11:00'
    }
  );

  const [amenityInput, setAmenityInput] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter accommodation name');
      return;
    }
    onSave(formData);
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <h4>{accommodation ? 'Edit Accommodation' : 'Add Accommodation'}</h4>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={styles.input}
              placeholder="Hotel/Resort/Lodge name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className={styles.select}
            >
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="lodge">Lodge</option>
              <option value="resort">Resort</option>
              <option value="camp">Camp</option>
              <option value="guesthouse">Guesthouse</option>
              <option value="apartment">Apartment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={styles.textarea}
            rows={2}
            placeholder="Describe the accommodation"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className={styles.input}
            placeholder="City or region"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className={styles.input}
            placeholder="Full address"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Check-in Time</label>
            <input
              type="time"
              value={formData.checkInTime || '14:00'}
              onChange={(e) => setFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Check-out Time</label>
            <input
              type="time"
              value={formData.checkOutTime || '11:00'}
              onChange={(e) => setFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Room Type (optional)</label>
          <input
            type="text"
            value={formData.roomType || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
            className={styles.input}
            placeholder="e.g., Double Room, Twin Beds"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Amenities</label>
          <div className={styles.amenityInput}>
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
              className={styles.input}
              placeholder="Add amenity (e.g., WiFi, Pool)"
            />
            <button onClick={addAmenity} className={styles.addBtn}>+</button>
          </div>
          {formData.amenities.length > 0 && (
            <div className={styles.amenityList}>
              {formData.amenities.map((amenity, index) => (
                <span key={index} className={styles.amenityTag}>
                  {amenity}
                  <button onClick={() => removeAmenity(index)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Website (optional)</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className={styles.input}
              placeholder="https://..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Info (optional)</label>
            <input
              type="text"
              value={formData.contactInfo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
              className={styles.input}
              placeholder="Phone or email"
            />
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <Button onClick={onCancel} variant="ghost" icon={<X className="h-4 w-4" />}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary" icon={<Save className="h-4 w-4" />}>
          Save Accommodation
        </Button>
      </div>
    </div>
  );
};
