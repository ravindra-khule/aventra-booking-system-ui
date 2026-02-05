import React, { useState, useEffect } from 'react';
import { Tour, TourStatus, TourDifficulty, TourCategory, TourTag } from '../types/tour.types';
import { Button } from '../../../shared/components/ui';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import './TourForm.css';

interface TourFormProps {
  initialTour?: Tour;
  categories: TourCategory[];
  tags: TourTag[];
  onSubmit: (tour: Tour) => Promise<void>;
  onCancel: () => void;
}

export const TourForm: React.FC<TourFormProps> = ({
  initialTour,
  categories,
  tags,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Tour>>(
    initialTour || {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      status: TourStatus.DRAFT,
      price: 0,
      depositPrice: 0,
      currency: 'SEK',
      durationDays: 0,
      difficulty: TourDifficulty.MEDIUM,
      location: '',
      country: '',
      region: '',
      maxCapacity: 0,
      minCapacity: 0,
      availableSpots: 0,
      nextDate: '',
      imageUrl: '',
      images: [],
      categories: [],
      tags: [],
      highlights: [],
      itinerary: [],
      includedItems: [],
      excludedItems: [],
      requirements: [],
      translations: [],
      defaultLanguage: 'sv',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      isFeatured: false,
      allowWaitlist: true,
      autoConfirm: false,
      requireApproval: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'pricing' | 'settings'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    // Auto-generate slug from title
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddIncluded = () => {
    if (newIncluded.trim()) {
      setFormData(prev => ({
        ...prev,
        includedItems: [...(prev.includedItems || []), newIncluded.trim()]
      }));
      setNewIncluded('');
    }
  };

  const handleRemoveIncluded = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includedItems: prev.includedItems?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddExcluded = () => {
    if (newExcluded.trim()) {
      setFormData(prev => ({
        ...prev,
        excludedItems: [...(prev.excludedItems || []), newExcluded.trim()]
      }));
      setNewExcluded('');
    }
  };

  const handleRemoveExcluded = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludedItems: prev.excludedItems?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories?.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...(prev.categories || []), categoryId]
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...(prev.tags || []), tagId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData as Tour);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tour-form-wrapper">
      <div className="tour-form-container">
        {/* Header */}
        <div className="tour-form-header">
          <h2>{initialTour ? 'Edit Tour' : 'Create New Tour'}</h2>
          <button onClick={onCancel} className="close-btn">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="tour-form-tabs">
          <button
            onClick={() => setActiveTab('basic')}
            className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          >
            Content & Details
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
          >
            Pricing & Capacity
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          >
            Settings
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tour-form">
          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label>Tour Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Bestig Kilimanjaro"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="Auto-generated from title"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Short Description *</label>
                  <textarea
                    value={formData.shortDescription || ''}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Brief summary (1-2 sentences)"
                    rows={2}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Description *</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed tour description"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Primary Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  {formData.imageUrl && (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Kilimanjaro"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="e.g., Tanzania"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Region</label>
                    <input
                      type="text"
                      value={formData.region || ''}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      placeholder="e.g., East Africa"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (Days) *</label>
                    <input
                      type="number"
                      value={formData.durationDays || 0}
                      onChange={(e) => handleInputChange('durationDays', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Difficulty *</label>
                    <select
                      value={formData.difficulty || TourDifficulty.MEDIUM}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    >
                      <option value={TourDifficulty.EASY}>Easy</option>
                      <option value={TourDifficulty.MEDIUM}>Medium</option>
                      <option value={TourDifficulty.HARD}>Hard</option>
                      <option value={TourDifficulty.EXTREME}>Extreme</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status || TourStatus.DRAFT}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value={TourStatus.DRAFT}>Draft</option>
                      <option value={TourStatus.ACTIVE}>Active</option>
                      <option value={TourStatus.INACTIVE}>Inactive</option>
                      <option value={TourStatus.ARCHIVED}>Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Categories & Tags */}
              <div className="form-section">
                <h3>Categories</h3>
                <div className="checkbox-group">
                  {categories.map(cat => (
                    <label key={cat.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.categories?.includes(cat.id) || false}
                        onChange={() => handleCategoryToggle(cat.id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Tags</h3>
                <div className="checkbox-group">
                  {tags.map(tag => (
                    <label key={tag.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.tags?.includes(tag.id) || false}
                        onChange={() => handleTagToggle(tag.id)}
                      />
                      <span>{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT & DETAILS TAB */}
          {activeTab === 'content' && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Highlights</h3>
                <div className="list-input">
                  <div className="input-group">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add a highlight..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="add-btn"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="list-items">
                    {(formData.highlights || []).map((highlight, idx) => (
                      <div key={idx} className="list-item">
                        <span>{highlight}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="delete-btn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Included Items</h3>
                <div className="list-input">
                  <div className="input-group">
                    <input
                      type="text"
                      value={newIncluded}
                      onChange={(e) => setNewIncluded(e.target.value)}
                      placeholder="Add included item..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncluded())}
                    />
                    <button
                      type="button"
                      onClick={handleAddIncluded}
                      className="add-btn"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="list-items">
                    {(formData.includedItems || []).map((item, idx) => (
                      <div key={idx} className="list-item">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIncluded(idx)}
                          className="delete-btn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Excluded Items</h3>
                <div className="list-input">
                  <div className="input-group">
                    <input
                      type="text"
                      value={newExcluded}
                      onChange={(e) => setNewExcluded(e.target.value)}
                      placeholder="Add excluded item..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExcluded())}
                    />
                    <button
                      type="button"
                      onClick={handleAddExcluded}
                      className="add-btn"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="list-items">
                    {(formData.excludedItems || []).map((item, idx) => (
                      <div key={idx} className="list-item">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExcluded(idx)}
                          className="delete-btn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Requirements</h3>
                <div className="list-input">
                  <div className="input-group">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add requirement..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    />
                    <button
                      type="button"
                      onClick={handleAddRequirement}
                      className="add-btn"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="list-items">
                    {(formData.requirements || []).map((req, idx) => (
                      <div key={idx} className="list-item">
                        <span>{req}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(idx)}
                          className="delete-btn"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>SEO</h3>
                <div className="form-group">
                  <label>SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="Page title for search engines"
                  />
                </div>
                <div className="form-group">
                  <label>SEO Description</label>
                  <textarea
                    value={formData.seoDescription || ''}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="Meta description (160 chars)"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRICING & CAPACITY TAB */}
          {activeTab === 'pricing' && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Pricing</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Price per Person (SEK) *</label>
                    <input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Deposit Price (SEK) *</label>
                    <input
                      type="number"
                      value={formData.depositPrice || 0}
                      onChange={(e) => handleInputChange('depositPrice', parseInt(e.target.value))}
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={formData.currency || 'SEK'}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="SEK">SEK</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Capacity</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Max Capacity *</label>
                    <input
                      type="number"
                      value={formData.maxCapacity || 0}
                      onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Min Capacity *</label>
                    <input
                      type="number"
                      value={formData.minCapacity || 0}
                      onChange={(e) => handleInputChange('minCapacity', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Available Spots *</label>
                    <input
                      type="number"
                      value={formData.availableSpots || 0}
                      onChange={(e) => handleInputChange('availableSpots', parseInt(e.target.value))}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Next Departure Date *</label>
                  <input
                    type="date"
                    value={formData.nextDate || ''}
                    onChange={(e) => handleInputChange('nextDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="form-section">
                <h3>Tour Settings</h3>

                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    />
                    <span>Featured Tour</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.allowWaitlist || false}
                      onChange={(e) => handleInputChange('allowWaitlist', e.target.checked)}
                    />
                    <span>Allow Waitlist</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.autoConfirm || false}
                      onChange={(e) => handleInputChange('autoConfirm', e.target.checked)}
                    />
                    <span>Auto-Confirm Bookings</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.requireApproval || false}
                      onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                    />
                    <span>Require Approval</span>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Default Language</h3>
                <select
                  value={formData.defaultLanguage || 'sv'}
                  onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                >
                  <option value="sv">Swedish (Svenska)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="tour-form-footer">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (initialTour ? 'Update Tour' : 'Create Tour')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
