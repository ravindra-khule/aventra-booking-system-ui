/**
 * Blackout Dates Component
 */
import React, { useState } from 'react';
import { BlackoutPeriod } from '../../types/pricing.types';
import { Plus, Edit2, Trash2, Calendar, AlertCircle, X, Check } from 'lucide-react';

interface BlackoutDatesProps {
  periods: BlackoutPeriod[];
  onUpdate: (periods: BlackoutPeriod[]) => void;
}

export const BlackoutDates: React.FC<BlackoutDatesProps> = ({ periods, onUpdate }) => {
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<BlackoutPeriod | null>(null);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingPeriod({
      id: `bp_${Date.now()}`,
      name: '',
      startDate: '',
      endDate: '',
      blocksAllTours: false,
      tourIds: [],
      allowManualOverride: true,
    });
  };

  const handleSave = () => {
    if (!editingPeriod || !editingPeriod.name) return;

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

  const getDaysCount = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Blackout Dates</h3>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Blackout
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || isEditingId) && editingPeriod && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Period name (e.g., Maintenance)"
            value={editingPeriod.name}
            onChange={(e) => setEditingPeriod({ ...editingPeriod, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={editingPeriod.startDate}
                onChange={(e) => setEditingPeriod({ ...editingPeriod, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={editingPeriod.endDate}
                onChange={(e) => setEditingPeriod({ ...editingPeriod, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <textarea
            placeholder="Reason (e.g., Maintenance, Holidays)"
            value={editingPeriod.reason || ''}
            onChange={(e) => setEditingPeriod({ ...editingPeriod, reason: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            rows={2}
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingPeriod.blocksAllTours}
                onChange={(e) =>
                  setEditingPeriod({ ...editingPeriod, blocksAllTours: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Blocks all tours</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingPeriod.allowManualOverride}
                onChange={(e) =>
                  setEditingPeriod({ ...editingPeriod, allowManualOverride: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Allow manual override</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

      {/* Blackout Periods List */}
      {periods.length > 0 ? (
        <div className="space-y-2">
          {periods.map((period) => (
            <div
              key={period.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{period.name}</h4>
                  {period.blocksAllTours && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      All Tours
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 ml-11">
                  <div>
                    <span className="text-xs text-gray-500">From</span>
                    <p className="font-medium text-gray-900">{period.startDate}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">To</span>
                    <p className="font-medium text-gray-900">{period.endDate}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Duration</span>
                    <p className="font-medium text-gray-900">
                      {getDaysCount(period.startDate, period.endDate)} days
                    </p>
                  </div>
                  {period.reason && (
                    <div>
                      <span className="text-xs text-gray-500">Reason</span>
                      <p className="font-medium text-gray-900 truncate">{period.reason}</p>
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
          <p className="text-gray-600">No blackout dates configured</p>
          <p className="text-sm text-gray-500">Prevent bookings during maintenance or holidays</p>
        </div>
      )}
    </div>
  );
};
