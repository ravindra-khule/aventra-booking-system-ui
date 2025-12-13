import React, { useState } from 'react';
import { EmailProvider } from '../types/emailSettings';

interface EmailProviderSettingsProps {
  selectedProvider: EmailProvider;
  onProviderChange: (provider: EmailProvider) => void;
}

export const EmailProviderSettings: React.FC<EmailProviderSettingsProps> = ({
  selectedProvider,
  onProviderChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Email Provider Configuration
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
            Select Email Provider
          </label>
          <select
            id="provider"
            value={selectedProvider}
            onChange={(e) => onProviderChange(e.target.value as EmailProvider)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="SMTP">SMTP Server</option>
            <option value="SendGrid">SendGrid</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            {selectedProvider === 'SMTP'
              ? 'Use your own SMTP server to send emails'
              : 'Use SendGrid API for email delivery'}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Changing providers will require updating
            your configuration. Make sure to test your setup before deploying to production.
          </p>
        </div>
      </div>
    </div>
  );
};
