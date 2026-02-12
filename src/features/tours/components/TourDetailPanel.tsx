import React, { useState } from 'react';
import { Tour, TourStatus, TourDifficulty, ItineraryDay } from '../types/tour.types';
import { TourStatusBadge } from './TourStatusBadge';
import { 
  X, Edit2, Save, MapPin, Calendar, Users, DollarSign, 
  Star, Tag, Globe, Image as ImageIcon, FileText, Settings as SettingsIcon,
  Plus, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { Button, Badge } from '../../../shared/components/ui';
import { formatCurrency, formatDate } from '../../../shared/utils';

interface TourDetailPanelProps {
  tour: Tour;
  onClose: () => void;
  onUpdate: (tour: Tour) => void;
  categories: Array<{ id: string; name: string; color?: string }>;
  tags: Array<{ id: string; name: string; color?: string }>;
}

type TabType = 'overview' | 'details' | 'itinerary' | 'pricing' | 'media' | 'seo' | 'settings';

export const TourDetailPanel: React.FC<TourDetailPanelProps> = ({ 
  tour, 
  onClose, 
  onUpdate,
  categories,
  tags
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
    { id: 'details', label: 'Details', icon: <Globe className="h-4 w-4" /> },
    { id: 'itinerary', label: 'Itinerary', icon: <Calendar className="h-4 w-4" /> },
    { id: 'pricing', label: 'Pricing', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'media', label: 'Media', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'seo', label: 'SEO', icon: <Star className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-4xl">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="px-6 py-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{tour.title}</h2>
                    <TourStatusBadge status={tour.status} />
                    {tour.isFeatured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-purple-100 text-sm">{tour.location}, {tour.country}</p>
                  <p className="text-purple-200 text-xs mt-1">ID: {tour.id} · Slug: {tour.slug}</p>
                </div>
                <Button onClick={onClose} variant="ghost" className="text-purple-100 hover:text-white !p-2">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleCancel} variant="outline" size="sm" className="!text-white !border-white hover:!bg-purple-800">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} variant="primary" size="sm" icon={<Save className="h-4 w-4" />} className="!bg-white !text-purple-600 hover:!bg-purple-50">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" icon={<Edit2 className="h-4 w-4" />} className="!text-white !border-white hover:!bg-purple-800">
                    Edit Tour
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto px-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-xs text-blue-600 font-medium mb-1">Duration</div>
                      <div className="text-2xl font-bold text-blue-900">{tour.durationDays}</div>
                      <div className="text-xs text-blue-600">days</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-xs text-green-600 font-medium mb-1">Bookings</div>
                      <div className="text-2xl font-bold text-green-900">{tour.totalBookings || 0}</div>
                      <div className="text-xs text-green-600">total</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-xs text-purple-600 font-medium mb-1">Capacity</div>
                      <div className="text-2xl font-bold text-purple-900">{tour.availableSpots}</div>
                      <div className="text-xs text-purple-600">/ {tour.maxCapacity} spots</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="text-xs text-yellow-600 font-medium mb-1">Revenue</div>
                      <div className="text-lg font-bold text-yellow-900">{formatCurrency(tour.revenue || 0)}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-700 text-sm leading-relaxed">{tour.description}</p>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <p className="text-gray-600 text-sm">{tour.shortDescription}</p>
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="flex-1">{highlight}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeFromArray('highlights', idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.title}
                          onChange={e => handleChange('title', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.slug}
                          onChange={e => handleChange('slug', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-600 font-mono text-sm">{formData.slug}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.location}
                          onChange={e => handleChange('location', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.country}
                          onChange={e => handleChange('country', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.country}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.region || ''}
                          onChange={e => handleChange('region', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.region || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      {isEditing ? (
                        <select
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.difficulty}
                          onChange={e => handleChange('difficulty', e.target.value as TourDifficulty)}
                        >
                          {Object.values(TourDifficulty).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900">{formData.difficulty}</p>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => {
                        const isSelected = formData.categories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => isEditing && toggleCategory(cat.id)}
                            disabled={!isEditing}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                            }`}
                            style={isSelected && cat.color ? { backgroundColor: `${cat.color}20`, color: cat.color, borderColor: cat.color } : {}}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => {
                        const isSelected = formData.tags.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => isEditing && toggleTag(tag.id)}
                            disabled={!isEditing}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-100 text-blue-700 border border-blue-500'
                                : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
                            }`}
                            style={isSelected && tag.color ? { backgroundColor: `${tag.color}20`, color: tag.color, borderColor: tag.color } : {}}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Included/Excluded Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Included</label>
                      <ul className="space-y-1">
                        {formData.includedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excluded</label>
                      <ul className="space-y-1">
                        {formData.excludedItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Itinerary editor - Coming soon</p>
                    <p className="text-sm">This will allow you to manage day-by-day itinerary</p>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.price}
                          onChange={e => handleChange('price', Number(e.target.value))}
                        />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(formData.price)}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Price</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.depositPrice}
                          onChange={e => handleChange('depositPrice', Number(e.target.value))}
                        />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(formData.depositPrice)}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.currency}
                          onChange={e => handleChange('currency', e.target.value)}
                        />
                      ) : (
                        <p className="text-xl font-medium text-gray-900">{formData.currency}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Revenue Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Total Revenue:</span>
                        <span className="ml-2 font-bold text-blue-900">{formatCurrency(formData.revenue || 0)}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Total Bookings:</span>
                        <span className="ml-2 font-bold text-blue-900">{formData.totalBookings || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image</label>
                    <img src={formData.imageUrl} alt={formData.title} className="w-full h-64 object-cover rounded-lg" />
                    {isEditing && (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-2"
                        placeholder="Image URL"
                        value={formData.imageUrl}
                        onChange={e => handleChange('imageUrl', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={formData.seoTitle || ''}
                        onChange={e => handleChange('seoTitle', e.target.value)}
                        placeholder="Leave empty to use tour title"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.seoTitle || formData.title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                    {isEditing ? (
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        rows={3}
                        value={formData.seoDescription || ''}
                        onChange={e => handleChange('seoDescription', e.target.value)}
                        placeholder="Leave empty to use short description"
                      />
                    ) : (
                      <p className="text-gray-700">{formData.seoDescription || formData.shortDescription}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    {isEditing ? (
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={formData.status}
                        onChange={e => handleChange('status', e.target.value as TourStatus)}
                      >
                        {Object.values(TourStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <TourStatusBadge status={formData.status} size="lg" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.minCapacity}
                          onChange={e => handleChange('minCapacity', Number(e.target.value))}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.minCapacity}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.maxCapacity}
                          onChange={e => handleChange('maxCapacity', Number(e.target.value))}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.maxCapacity}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Available Spots</label>
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={formData.availableSpots}
                          onChange={e => handleChange('availableSpots', Number(e.target.value))}
                        />
                      ) : (
                        <p className="text-gray-900">{formData.availableSpots}</p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Settings */}
                  <div className="space-y-3 border-t pt-4">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Featured Tour</span>
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={e => handleChange('isFeatured', e.target.checked)}
                        disabled={!isEditing}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Allow Waitlist</span>
                      <input
                        type="checkbox"
                        checked={formData.allowWaitlist}
                        onChange={e => handleChange('allowWaitlist', e.target.checked)}
                        disabled={!isEditing}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Auto Confirm</span>
                      <input
                        type="checkbox"
                        checked={formData.autoConfirm}
                        onChange={e => handleChange('autoConfirm', e.target.checked)}
                        disabled={!isEditing}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Require Approval</span>
                      <input
                        type="checkbox"
                        checked={formData.requireApproval}
                        onChange={e => handleChange('requireApproval', e.target.checked)}
                        disabled={!isEditing}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
