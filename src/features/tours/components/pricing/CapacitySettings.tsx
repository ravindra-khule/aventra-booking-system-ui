/**
 * Capacity Settings Component
 */
import React, { useState } from 'react';
import { CapacitySetting } from '../../types/pricing.types';
import { Users, Edit2, Check, X } from 'lucide-react';

interface CapacitySettingsProps {
  setting: CapacitySetting;
  onUpdate: (setting: CapacitySetting) => void;
}

export const CapacitySettings: React.FC<CapacitySettingsProps> = ({ setting, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSetting, setEditingSetting] = useState(setting);

  const handleSave = () => {
    onUpdate(editingSetting);
    setIsEditing(false);
  };

  const capacityUtilization = setting.minCapacity > 0 ? (setting.preferredCapacity || setting.maxCapacity) / setting.maxCapacity : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Capacity Management</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Capacity
              </label>
              <input
                type="number"
                min="1"
                value={editingSetting.minCapacity}
                onChange={(e) =>
                  setEditingSetting({
                    ...editingSetting,
                    minCapacity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum participants to proceed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Capacity
              </label>
              <input
                type="number"
                min="1"
                value={editingSetting.maxCapacity}
                onChange={(e) =>
                  setEditingSetting({
                    ...editingSetting,
                    maxCapacity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum participants allowed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Capacity
              </label>
              <input
                type="number"
                min="1"
                value={editingSetting.preferredCapacity || ''}
                onChange={(e) =>
                  setEditingSetting({
                    ...editingSetting,
                    preferredCapacity: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
              <p className="text-xs text-gray-500 mt-1">Target group size (optional)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blocked Seats
              </label>
              <input
                type="number"
                min="0"
                value={editingSetting.blockedSeats || 0}
                onChange={(e) =>
                  setEditingSetting({
                    ...editingSetting,
                    blockedSeats: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Reserved for staff/guides</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buffer Capacity
              </label>
              <input
                type="number"
                min="0"
                value={editingSetting.bufferCapacity || 0}
                onChange={(e) =>
                  setEditingSetting({
                    ...editingSetting,
                    bufferCapacity: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum capacity to maintain</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-Release Date
              </label>
              <input
                type="date"
                value={editingSetting.autoReleaseDate || ''}
                onChange={(e) =>
                  setEditingSetting({
                    ...editingSetting,
                    autoReleaseDate: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Release unfilled spots (optional)</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-blue-200">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingSetting(setting);
              }}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capacity Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Group Size</h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Minimum</span>
                <span className="text-lg font-semibold text-gray-900">{setting.minCapacity} people</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Maximum</span>
                <span className="text-lg font-semibold text-gray-900">{setting.maxCapacity} people</span>
              </div>
              {setting.preferredCapacity && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Preferred</span>
                  <span className="text-lg font-semibold text-blue-600">{setting.preferredCapacity} people</span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Range Visualization</p>
                <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all"
                    style={{ width: `${(capacityUtilization * 100)}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {Math.round(capacityUtilization * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Additional Settings</h4>

            <div className="space-y-3">
              {setting.blockedSeats && setting.blockedSeats > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Blocked Seats</span>
                  <span className="text-sm font-semibold text-gray-900">{setting.blockedSeats}</span>
                </div>
              )}

              {setting.bufferCapacity && setting.bufferCapacity > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Buffer Capacity</span>
                  <span className="text-sm font-semibold text-gray-900">{setting.bufferCapacity}</span>
                </div>
              )}

              {setting.autoReleaseDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Auto-Release Date</span>
                  <span className="text-sm font-semibold text-gray-900">{setting.autoReleaseDate}</span>
                </div>
              )}

              {!setting.blockedSeats && !setting.bufferCapacity && !setting.autoReleaseDate && (
                <p className="text-sm text-gray-500 py-4">No additional settings configured</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
