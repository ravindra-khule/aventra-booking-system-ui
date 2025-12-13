/**
 * Meal Form - Add/edit meals for itinerary days
 */

import React, { useState } from 'react';
import { Meal } from '../../types/itinerary.types';
import { Button } from '../../../../shared/components/ui';
import { Save, X } from 'lucide-react';
import styles from './MealForm.module.css';

interface MealFormProps {
  meal?: Meal;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({
  meal,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Meal>(
    meal || {
      id: Math.random().toString(36).substr(2, 9),
      type: 'breakfast',
      name: '',
      description: '',
      restaurant: '',
      location: '',
      included: true,
      dietaryOptions: []
    }
  );

  const [dietaryInput, setDietaryInput] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter meal name');
      return;
    }
    onSave(formData);
  };

  const addDietaryOption = () => {
    if (dietaryInput.trim()) {
      setFormData(prev => ({
        ...prev,
        dietaryOptions: [...(prev.dietaryOptions || []), dietaryInput.trim()]
      }));
      setDietaryInput('');
    }
  };

  const removeDietaryOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dietaryOptions: (prev.dietaryOptions || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <h4>{meal ? 'Edit Meal' : 'Add Meal'}</h4>
      </div>

      <div className={styles.formContent}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Meal Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className={styles.select}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Meal Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={styles.input}
              placeholder="e.g., Traditional Thai Breakfast"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={styles.textarea}
            rows={2}
            placeholder="Describe the meal"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Restaurant Name (optional)</label>
            <input
              type="text"
              value={formData.restaurant || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, restaurant: e.target.value }))}
              className={styles.input}
              placeholder="Restaurant or venue name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Location (optional)</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={styles.input}
              placeholder="Address or location"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Dietary Options</label>
          <div className={styles.dietaryInput}>
            <input
              type="text"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDietaryOption()}
              className={styles.input}
              placeholder="Add dietary option (e.g., Vegetarian)"
            />
            <button onClick={addDietaryOption} className={styles.addBtn}>+</button>
          </div>
          {formData.dietaryOptions && formData.dietaryOptions.length > 0 && (
            <div className={styles.tagList}>
              {formData.dietaryOptions.map((option, index) => (
                <span key={index} className={styles.tag}>
                  {option}
                  <button onClick={() => removeDietaryOption(index)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.checkbox}>
          <label>
            <input
              type="checkbox"
              checked={formData.included}
              onChange={(e) => setFormData(prev => ({ ...prev, included: e.target.checked }))}
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
          Save Meal
        </Button>
      </div>
    </div>
  );
};
