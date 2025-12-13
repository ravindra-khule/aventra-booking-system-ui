import React from 'react';
import { BounceUnsubscribeSettings, BounceHandlingMethod } from '../types/emailSettings';

interface BounceUnsubscribeComponentProps {
  settings: BounceUnsubscribeSettings;
  onChange: (settings: BounceUnsubscribeSettings) => void;
}

export const BounceUnsubscribeComponent: React.FC<BounceUnsubscribeComponentProps> = ({
  settings,
  onChange,
}) => {
  const handleBounceChange = (field: string, value: any) => {
    onChange({
      ...settings,
      bounceHandling: {
        ...settings.bounceHandling,
        [field]: value,
      },
    });
  };

  const handleUnsubscribeChange = (field: string, value: any) => {
    onChange({
      ...settings,
      unsubscribe: {
        ...settings.unsubscribe,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Bounce & Unsubscribe Management</h3>

      <div className="space-y-8">
        {/* Bounce Handling Section */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Bounce Handling</h4>

          <div className="space-y-4">
            {/* Bounce Method */}
            <div>
              <label htmlFor="bounce-method" className="block text-sm font-medium text-gray-700 mb-2">
                Bounce Handling Method
              </label>
              <select
                id="bounce-method"
                value={settings.bounceHandling.method}
                onChange={(e) => handleBounceChange('method', e.target.value as BounceHandlingMethod)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="automatic">
                  Automatic - Bounce tracking handled by system
                </option>
                <option value="webhook">
                  Webhook - Receive bounce notifications
                </option>
                <option value="manual">
                  Manual - Review bounces manually
                </option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Choose how to handle hard bounces (permanent delivery failures)
              </p>
            </div>

            {/* Bounce Details by Method */}
            {settings.bounceHandling.method === 'automatic' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Automatic Handling:</span> The system will automatically manage bounce lists and mark invalid emails as undeliverable.
                </p>
              </div>
            )}

            {settings.bounceHandling.method === 'webhook' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Webhook Configuration:</span> Your email provider will send bounce notifications to our system.
                </p>
                <div className="bg-white rounded p-3 font-mono text-xs text-gray-700">
                  https://api.aventrabooking.com/webhooks/email/bounce
                </div>
              </div>
            )}

            {settings.bounceHandling.method === 'manual' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Manual Review:</span> You'll need to regularly check the email logs and remove bounced addresses manually.
                </p>
              </div>
            )}

            {/* Notify on Bounce */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.bounceHandling.notifyOnBounce}
                  onChange={(e) => handleBounceChange('notifyOnBounce', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notify me when emails bounce
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Receive email alerts when bounce rates exceed acceptable thresholds
              </p>
            </div>
          </div>
        </div>

        {/* Unsubscribe Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Unsubscribe Management</h4>

          <div className="space-y-4">
            {/* Enable Unsubscribe */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.unsubscribe.enabled}
                  onChange={(e) => handleUnsubscribeChange('enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Unsubscribe Feature
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Allow recipients to easily unsubscribe from emails
              </p>
            </div>

            {settings.unsubscribe.enabled && (
              <>
                {/* Custom Unsubscribe URL */}
                <div>
                  <label htmlFor="unsubscribe-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Unsubscribe Page URL
                  </label>
                  <input
                    id="unsubscribe-url"
                    type="url"
                    placeholder="https://aventrabooking.com/unsubscribe"
                    value={settings.unsubscribe.customUrl}
                    onChange={(e) => handleUnsubscribeChange('customUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Link where users can manage their subscription preferences
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <span className="font-semibold">Unsubscribe Header:</span> The following header will be added to all emails:
                  </p>
                  <div className="bg-white rounded p-2 font-mono text-xs text-gray-700 overflow-x-auto">
                    List-Unsubscribe: &lt;{'{URL}'}&gt;
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compliance Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Compliance Requirements</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>CAN-SPAM:</strong> Unsubscribe must be easy and honored within 10 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>GDPR:</strong> Users can withdraw consent to marketing emails anytime</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span><strong>DKIM/SPF:</strong> Properly manage bounce addresses for authentication</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
