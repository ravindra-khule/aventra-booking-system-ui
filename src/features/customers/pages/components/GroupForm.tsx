import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { CustomerGroup } from '../../types/group.types';
import { CustomerGroupService } from '../../services/group.service';
import { SmartGroupBuilder } from './SmartGroupBuilder';
import styles from '../styles/GroupForm.module.css';

interface GroupFormProps {
  group?: CustomerGroup | null;
  onClose: () => void;
  onSubmit: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  group,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Partial<CustomerGroup>>(
    group || {
      name: '',
      description: '',
      type: 'manual',
      memberIds: [],
      pricingRules: [],
      defaultDiscount: undefined,
      tags: [],
      color: '#3B82F6',
      isActive: true,
    }
  );
  const [selectedTab, setSelectedTab] = useState<
    'basic' | 'members' | 'pricing' | 'smart'
  >('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handleDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    if (name === 'discountType') {
      setFormData((prev) => ({
        ...prev,
        defaultDiscount: {
          ...prev.defaultDiscount,
          type: value as 'percentage' | 'fixed',
        },
      }));
    } else if (name === 'discountValue') {
      setFormData((prev) => ({
        ...prev,
        defaultDiscount: {
          ...prev.defaultDiscount,
          value: parseFloat(value) || 0,
        },
      }));
    }
  };

  const handleSmartRulesChange = (rules: any) => {
    setFormData((prev) => ({
      ...prev,
      smartRules: rules,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name) {
        setError('Group name is required');
        setLoading(false);
        return;
      }

      if (group?.id) {
        await CustomerGroupService.update(group.id, formData);
      } else {
        await CustomerGroupService.create(formData as any);
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save group');
      setLoading(false);
    }
  };

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className={styles['form-overlay']}>
      <div className={styles['form-dialog']}>
        {/* Header */}
        <div className={styles['form-header']}>
          <h2>{group ? 'Edit Group' : 'Create New Group'}</h2>
          <button className={styles['close-btn']} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles['form-tabs']}>
          <button
            className={`${styles.tab} ${selectedTab === 'basic' ? styles.active : ''}`}
            onClick={() => setSelectedTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`${styles.tab} ${selectedTab === 'members' ? styles.active : ''}`}
            onClick={() => setSelectedTab('members')}
          >
            Members
          </button>
          {formData.type === 'smart' && (
            <button
              className={`${styles.tab} ${selectedTab === 'smart' ? styles.active : ''}`}
              onClick={() => setSelectedTab('smart')}
            >
              Smart Rules
            </button>
          )}
          <button
            className={`${styles.tab} ${selectedTab === 'pricing' ? styles.active : ''}`}
            onClick={() => setSelectedTab('pricing')}
          >
            Pricing
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className={styles['form-content']}>
            {/* Basic Info Tab */}
            {selectedTab === 'basic' && (
              <div className={styles['form-section']}>
                <div className={styles['form-group']}>
                  <label htmlFor="name">Group Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., VIP Customers"
                    className={styles['form-input']}
                  />
                </div>

                <div className={styles['form-group']}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Describe this group..."
                    rows={3}
                    className={styles['form-input']}
                  />
                </div>

                <div className={styles['form-row']}>
                  <div className={styles['form-group']}>
                    <label htmlFor="type">Group Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type || 'manual'}
                      onChange={handleInputChange}
                      className={styles['form-input']}
                    >
                      <option value="manual">Manual (Select members)</option>
                      <option value="smart">Smart (Rule-based)</option>
                    </select>
                  </div>

                  <div className={styles['form-group']}>
                    <label>Color</label>
                    <div className={styles['color-picker']}>
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`${styles['color-option']} ${
                            formData.color === color ? styles.selected : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, color }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles['form-group']}>
                  <label>Tags</label>
                  <div className={styles['tag-input']}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag and press Enter"
                      className={styles['form-input']}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className={`${styles.btn} ${styles['btn-secondary']}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className={styles['tags-list']}>
                    {(formData.tags || []).map((tag) => (
                      <div key={tag} className={styles['tag-item']}>
                        <Tag size={14} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className={styles['remove-tag']}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles['form-group']}>
                  <label className={styles['checkbox-label']}>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive ?? true}
                      onChange={handleInputChange}
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {selectedTab === 'members' && (
              <div className={styles['form-section']}>
                {formData.type === 'manual' ? (
                  <div className={styles['info-box']}>
                    <p>
                      Manual groups allow you to select specific customers to
                      include.
                    </p>
                    <p>
                      <em>
                        Member selection UI will be implemented with customer
                        search and multi-select functionality.
                      </em>
                    </p>
                  </div>
                ) : (
                  <div className={styles['info-box']}>
                    <p>
                      Smart groups automatically add customers based on rules
                      defined in the Smart Rules tab.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Smart Rules Tab */}
            {selectedTab === 'smart' && formData.type === 'smart' && (
              <div className={styles['form-section']}>
                <SmartGroupBuilder
                  rules={formData.smartRules || []}
                  onChange={handleSmartRulesChange}
                />
              </div>
            )}

            {/* Pricing Tab */}
            {selectedTab === 'pricing' && (
              <div className={styles['form-section']}>
                <div className={styles['form-group']}>
                  <label>Default Discount</label>
                  <div className={styles['form-row']}>
                    <div className={`${styles['form-group']} ${styles['flex-1']}`}>
                      <label htmlFor="discountType">Type</label>
                      <select
                        id="discountType"
                        name="discountType"
                        value={formData.defaultDiscount?.type || 'percentage'}
                        onChange={handleDiscountChange}
                        className={styles['form-input']}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>

                    <div className={`${styles['form-group']} ${styles['flex-1']}`}>
                      <label htmlFor="discountValue">Value</label>
                      <input
                        type="number"
                        id="discountValue"
                        name="discountValue"
                        value={formData.defaultDiscount?.value || ''}
                        onChange={handleDiscountChange}
                        placeholder="0"
                        min="0"
                        className={styles['form-input']}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles['info-box']}>
                  <p>
                    This is the default discount applied to all bookings for
                    members of this group.
                  </p>
                  <p>
                    <em>
                      Tour-specific pricing rules can be added on the management
                      page.
                    </em>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className={styles['error-message']}>{error}</div>}

          {/* Footer */}
          <div className={styles['form-footer']}>
            <button type="button" onClick={onClose} className={`${styles.btn} ${styles['btn-secondary']}`}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${styles.btn} ${styles['btn-primary']}`}
            >
              {loading ? 'Saving...' : 'Save Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
