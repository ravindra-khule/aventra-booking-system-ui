import React, { useState } from 'react';
import { SendGridConfig } from '../types/emailSettings';

interface SendGridConfigurationProps {
  config: SendGridConfig;
  onChange: (config: SendGridConfig) => void;
  onValidateApiKey?: () => void;
}

export const SendGridConfiguration: React.FC<SendGridConfigurationProps> = ({
  config,
  onChange,
  onValidateApiKey,
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleValidate = async () => {
    setIsValidating(true);
    // Simulate API validation
    setTimeout(() => {
      if (config.apiKey && config.apiKey.length > 10) {
        setValidationStatus('success');
        onValidateApiKey?.();
      } else {
        setValidationStatus('error');
      }
      setIsValidating(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SendGrid Configuration</h3>

      <div className="space-y-6">
        {/* API Key */}
        <div>
          <label htmlFor="sendgrid-api" className="block text-sm font-medium text-gray-700 mb-2">
            SendGrid API Key *
          </label>
          <div className="relative">
            <input
              id="sendgrid-api"
              type={showApiKey ? 'text' : 'password'}
              placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.apiKey}
              onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Get your API key from SendGrid dashboard → API Keys section
          </p>
        </div>

        {/* Sandbox Mode Toggle */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.sandboxMode}
              onChange={(e) => onChange({ ...config, sandboxMode: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable Sandbox Mode</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            When enabled, emails won't actually be sent - useful for testing. Disable in production.
          </p>
        </div>

        {/* Validation Button */}
        <div>
          <button
            onClick={handleValidate}
            disabled={isValidating || !config.apiKey}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? 'Validating...' : 'Validate API Key'}
          </button>

          {validationStatus === 'success' && (
            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <span className="font-semibold">✓ Success!</span> API key is valid and working.
              </p>
            </div>
          )}

          {validationStatus === 'error' && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <span className="font-semibold">✗ Error:</span> API key is invalid or not found.
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> SendGrid provides excellent deliverability, analytics, and support. API key should have mail.send permission at minimum.
          </p>
        </div>
      </div>
    </div>
  );
};
