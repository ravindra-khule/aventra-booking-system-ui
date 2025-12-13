/**
 * Seasonal Pricing Component
 */
import React, { useState } from 'react';
import { SeasonalPeriod } from '../../types/pricing.types';
import { Plus, Edit2, Trash2, Calendar, TrendingUp, X, Check } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils';

interface SeasonalPricingProps {
  periods: SeasonalPeriod[];
  onUpdate: (periods: SeasonalPeriod[]) => void;
}

export const SeasonalPricing: React.FC<SeasonalPricingProps> = ({ periods, onUpdate }) => {
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<SeasonalPeriod | null>(null);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingPeriod({
      id: `sp_${Date.now()}`,
      name: '',
      startDate: '',
      endDate: '',
      priceMultiplier: 1.0,
      color: '#3B82F6',
    });
  };

  const handleSave = () => {
    if (!editingPeriod) return;

    if (isAdding) {
      onUpdate([...periods, editingPeriod]);
      setIsAdding(false);
    } else if (isEditingId) {
      onUpdate(periods.map(p => (p.id === isEditingId ? editingPeriod : p)));
      setIsEditingId(null);
    }

    setEditingPeriod(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(periods.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Seasonal Pricing</h3>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Season
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditingId) && editingPeriod && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Season name (e.g., Summer, Winter)"
            value={editingPeriod.name}
            onChange={(e) => setEditingPeriod({ ...editingPeriod, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={editingPeriod.startDate}
                onChange={(e) => setEditingPeriod({ ...editingPeriod, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={editingPeriod.endDate}
                onChange={(e) => setEditingPeriod({ ...editingPeriod, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Price Multiplier
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3"
                value={editingPeriod.priceMultiplier}
                onChange={(e) =>
                  setEditingPeriod({
                    ...editingPeriod,
                    priceMultiplier: parseFloat(e.target.value),
                  })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                {editingPeriod.priceMultiplier < 1
                  ? `${Math.round((1 - editingPeriod.priceMultiplier) * 100)}% discount`
                  : editingPeriod.priceMultiplier > 1
                    ? `${Math.round((editingPeriod.priceMultiplier - 1) * 100)}% increase`
                    : 'Base price'}
              </span>
            </div>
          </div>

          <textarea
            placeholder="Description (optional)"
            value={editingPeriod.description || ''}
            onChange={(e) => setEditingPeriod({ ...editingPeriod, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setIsEditingId(null);
                setEditingPeriod(null);
              }}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Seasonal Periods List */}
      {periods.length > 0 ? (
        <div className="space-y-2">
          {periods.map((period) => (
            <div
              key={period.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: period.color || '#3B82F6' }}
                  />
                  <h4 className="font-semibold text-gray-900">{period.name}</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 ml-7">
                  <div>
                    <span className="text-xs text-gray-500">From</span>
                    <p className="font-medium text-gray-900">{period.startDate}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">To</span>
                    <p className="font-medium text-gray-900">{period.endDate}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Multiplier</span>
                    <p className="font-medium text-gray-900">{period.priceMultiplier}x</p>
                  </div>
                  {period.description && (
                    <div>
                      <span className="text-xs text-gray-500">Description</span>
                      <p className="font-medium text-gray-900">{period.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => {
                    setIsEditingId(period.id);
                    setEditingPeriod(period);
                  }}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(period.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No seasonal periods configured</p>
          <p className="text-sm text-gray-500">Add your first season to get started</p>
        </div>
      )}
    </div>
  );
};
