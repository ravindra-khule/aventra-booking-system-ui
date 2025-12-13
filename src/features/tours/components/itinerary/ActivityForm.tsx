/**
 * Activity Form - Add/edit activities for itinerary days
 */

import React, { useState } from 'react';
import { Activity, ItineraryDayDetails } from '../../types/itinerary.types';
import { Button } from '../../../../shared/components/ui';
import { Save, X } from 'lucide-react';
import styles from './ActivityForm.module.css';

interface ActivityFormProps {
  day: ItineraryDayDetails;
  activity?: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  day,
  activity,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Activity>(
    activity || {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      type: 'hiking',
      startTime: '09:00',
      endTime: '12:00',
      location: '',
      difficulty: 'moderate',
      physicalLevel: 'moderate',
      guide: '',
      groupSize: undefined,
      costPerPerson: undefined,
      included: true,
      equipment: [],
      notes: '',
      mandatory: false,
      order: 0
    }
  );

  const [equipmentInput, setEquipmentInput] = useState('');

  const handleSave = () => {
    if (!formData.name.trim() || !formData.startTime || !formData.endTime) {
      alert('Please fill in name, start time, and end time');
      return;
    }

    const startTime = parseInt(formData.startTime.replace(':', ''));
    const endTime = parseInt(formData.endTime.replace(':', ''));
    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    onSave(formData);
  };

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...(prev.equipment || []), equipmentInput.trim()]
      }));
      setEquipmentInput('');
    }
  };

  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: (prev.equipment || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <h4>{activity ? 'Edit Activity' : 'Add Activity'}</h4>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label>Activity Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={styles.input}
            placeholder="e.g., Guided Hike to Summit"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={styles.textarea}
            rows={3}
            placeholder="Detailed description of the activity"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className={styles.select}
            >
              <option value="hiking">Hiking</option>
              <option value="sightseeing">Sightseeing</option>
              <option value="cultural">Cultural</option>
              <option value="adventure">Adventure</option>
              <option value="relaxation">Relaxation</option>
              <option value="wildlife">Wildlife</option>
              <option value="water">Water Activity</option>
              <option value="food">Food & Beverage</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className={styles.select}
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="difficult">Difficult</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className={styles.input}
            placeholder="Where will this activity take place?"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Guide Name (optional)</label>
            <input
              type="text"
              value={formData.guide || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, guide: e.target.value }))}
              className={styles.input}
              placeholder="Name of the guide"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Group Size (optional)</label>
            <input
              type="number"
              value={formData.groupSize || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value ? parseInt(e.target.value) : undefined }))}
              className={styles.input}
              placeholder="Max participants"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Cost per Person (optional)</label>
            <input
              type="number"
              step="0.01"
              value={formData.costPerPerson || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, costPerPerson: e.target.value ? parseFloat(e.target.value) : undefined }))}
              className={styles.input}
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Physical Level</label>
            <select
              value={formData.physicalLevel || 'moderate'}
              onChange={(e) => setFormData(prev => ({ ...prev, physicalLevel: e.target.value as any }))}
              className={styles.select}
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Equipment Needed</label>
          <div className={styles.equipmentInput}>
            <input
              type="text"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addEquipment()}
              className={styles.input}
              placeholder="Add equipment (e.g., hiking boots)"
            />
            <button onClick={addEquipment} className={styles.addBtn}>+</button>
          </div>
          {formData.equipment && formData.equipment.length > 0 && (
            <div className={styles.equipmentList}>
              {formData.equipment.map((item, index) => (
                <span key={index} className={styles.equipmentTag}>
                  {item}
                  <button onClick={() => removeEquipment(index)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className={styles.textarea}
            rows={2}
            placeholder="Additional notes or special instructions"
          />
        </div>

        <div className={styles.checkboxes}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.included}
              onChange={(e) => setFormData(prev => ({ ...prev, included: e.target.checked }))}
            />
            <span>Included in tour price</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={formData.mandatory}
              onChange={(e) => setFormData(prev => ({ ...prev, mandatory: e.target.checked }))}
            />
            <span>Mandatory activity</span>
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <Button onClick={onCancel} variant="ghost" icon={<X className="h-4 w-4" />}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary" icon={<Save className="h-4 w-4" />}>
          Save Activity
        </Button>
      </div>
    </div>
  );
};
