import React from 'react';
import { SendingLimits } from '../types/emailSettings';

interface SendingLimitsComponentProps {
  limits: SendingLimits;
  onChange: (limits: SendingLimits) => void;
}

export const SendingLimitsComponent: React.FC<SendingLimitsComponentProps> = ({
  limits,
  onChange,
}) => {
  const handleChange = (field: keyof SendingLimits, value: any) => {
    onChange({
      ...limits,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sending Limits & Throttling</h3>

      <div className="space-y-6">
        {/* Max Per Hour */}
        <div>
          <label htmlFor="max-per-hour" className="block text-sm font-medium text-gray-700 mb-2">
            Max Emails Per Hour
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="max-per-hour"
              type="number"
              min="1"
              max="10000"
              value={limits.maxPerHour}
              onChange={(e) => handleChange('maxPerHour', parseInt(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-600">emails/hour</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Limit the number of emails sent in a 1-hour window. 0 = unlimited
          </p>
        </div>

        {/* Max Per Day */}
        <div>
          <label htmlFor="max-per-day" className="block text-sm font-medium text-gray-700 mb-2">
            Max Emails Per Day
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="max-per-day"
              type="number"
              min="1"
              max="100000"
              value={limits.maxPerDay}
              onChange={(e) => handleChange('maxPerDay', parseInt(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-600">emails/day</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Limit the number of emails sent in a 24-hour period. 0 = unlimited
          </p>
        </div>

        {/* Throttling Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={limits.throttlingEnabled}
              onChange={(e) => handleChange('throttlingEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable Throttling</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Gradually spread out email delivery instead of sending them all at once. Useful for server load management.
          </p>
        </div>

        {/* Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Current Status</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">
                <span className="font-semibold">Per Hour Limit:</span> {limits.maxPerHour === 0 ? 'Unlimited' : limits.maxPerHour}
              </p>
            </div>
            <div>
              <p className="text-blue-700">
                <span className="font-semibold">Per Day Limit:</span> {limits.maxPerDay === 0 ? 'Unlimited' : limits.maxPerDay}
              </p>
            </div>
            <div>
              <p className="text-blue-700">
                <span className="font-semibold">Throttling:</span> {limits.throttlingEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Recommendation:</span> Most email providers allow 300-1000 emails per minute. Setting limits prevents server overload and improves deliverability.
          </p>
        </div>
      </div>
    </div>
  );
};
