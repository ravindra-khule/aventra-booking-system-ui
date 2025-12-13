/**
 * Early Bird & Last Minute Pricing Component
 */
import React, { useState } from 'react';
import { EarlyBirdLastMinuteRule } from '../../types/pricing.types';
import { Clock, Zap, Check, X } from 'lucide-react';

interface EarlyBirdLastMinuteProps {
  rule: EarlyBirdLastMinuteRule | null;
  onUpdate: (rule: EarlyBirdLastMinuteRule) => void;
}

export const EarlyBirdLastMinute: React.FC<EarlyBirdLastMinuteProps> = ({ rule, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingRule, setEditingRule] = useState<EarlyBirdLastMinuteRule | null>(rule);

  const handleSave = () => {
    if (!editingRule) return;
    onUpdate(editingRule);
    setIsEditing(false);
  };

  const currentRule = editingRule || rule;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Early Bird & Last Minute Pricing</h3>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingRule(rule || {
                id: `ebm_${Date.now()}`,
                earlyBirdEnabled: true,
                earlyBirdDaysBeforeDeparture: 60,
                earlyBirdDiscount: 10,
                lastMinuteEnabled: true,
                lastMinuteDaysBeforeDeparture: 14,
                lastMinuteDiscount: 15,
                tourIds: [],
              });
            }}
            className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Edit Rules
          </button>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing && editingRule && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-6">
          {/* Early Bird Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Early Bird Pricing</h4>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editingRule.earlyBirdEnabled}
                onChange={(e) =>
                  setEditingRule({ ...editingRule, earlyBirdEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable early bird pricing</span>
            </label>

            {editingRule.earlyBirdEnabled && (
              <div className="space-y-3 ml-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days before departure
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingRule.earlyBirdDaysBeforeDeparture}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        earlyBirdDaysBeforeDeparture: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Discount applies to bookings made {editingRule.earlyBirdDaysBeforeDeparture}+ days before
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount percentage
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={editingRule.earlyBirdDiscount}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          earlyBirdDiscount: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-600">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-blue-200" />

          {/* Last Minute Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Last Minute Pricing</h4>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={editingRule.lastMinuteEnabled}
                onChange={(e) =>
                  setEditingRule({ ...editingRule, lastMinuteEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Enable last minute pricing</span>
            </label>

            {editingRule.lastMinuteEnabled && (
              <div className="space-y-3 ml-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days before departure
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingRule.lastMinuteDaysBeforeDeparture}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        lastMinuteDaysBeforeDeparture: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Discount applies to bookings made within {editingRule.lastMinuteDaysBeforeDeparture} days
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount percentage
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={editingRule.lastMinuteDiscount}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          lastMinuteDiscount: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-600">%</span>
                  </div>
                </div>
              </div>
            )}
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
                setEditingRule(rule);
              }}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* View Mode */}
      {!isEditing && currentRule && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Early Bird Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Early Bird</h4>
              {currentRule.earlyBirdEnabled ? (
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Active
                </span>
              ) : (
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  Inactive
                </span>
              )}
            </div>

            {currentRule.earlyBirdEnabled ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Book at least</span>
                  <span className="font-semibold text-gray-900">{currentRule.earlyBirdDaysBeforeDeparture} days before</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Get discount</span>
                  <span className="font-semibold text-green-600">{currentRule.earlyBirdDiscount}%</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Not enabled</p>
            )}
          </div>

          {/* Last Minute Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Last Minute</h4>
              {currentRule.lastMinuteEnabled ? (
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Active
                </span>
              ) : (
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  Inactive
                </span>
              )}
            </div>

            {currentRule.lastMinuteEnabled ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Book within</span>
                  <span className="font-semibold text-gray-900">{currentRule.lastMinuteDaysBeforeDeparture} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Get discount</span>
                  <span className="font-semibold text-orange-600">{currentRule.lastMinuteDiscount}%</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Not enabled</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
