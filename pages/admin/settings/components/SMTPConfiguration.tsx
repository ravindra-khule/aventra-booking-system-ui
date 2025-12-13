import React, { useState } from 'react';
import { SMTPConfig, EncryptionType } from '../types/emailSettings';

interface SMTPConfigurationProps {
  config: SMTPConfig;
  onChange: (config: SMTPConfig) => void;
}

export const SMTPConfiguration: React.FC<SMTPConfigurationProps> = ({ config, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof SMTPConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Configuration</h3>

      <div className="space-y-6">
        {/* SMTP Host */}
        <div>
          <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host *
          </label>
          <input
            id="smtp-host"
            type="text"
            placeholder="e.g., smtp.gmail.com"
            value={config.host}
            onChange={(e) => handleChange('host', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            The server address for sending emails (e.g., smtp.gmail.com, smtp.office365.com)
          </p>
        </div>

        {/* Port */}
        <div>
          <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-700 mb-2">
            Port *
          </label>
          <input
            id="smtp-port"
            type="number"
            min="1"
            max="65535"
            value={config.port}
            onChange={(e) => handleChange('port', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Common ports: 25 (plain), 465 (SSL), 587 (TLS)
          </p>
        </div>

        {/* Encryption */}
        <div>
          <label htmlFor="encryption" className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Type *
          </label>
          <select
            id="encryption"
            value={config.encryption}
            onChange={(e) => handleChange('encryption', e.target.value as EncryptionType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="None">None</option>
            <option value="SSL">SSL</option>
            <option value="TLS">TLS</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Recommended: TLS for port 587, SSL for port 465
          </p>
        </div>

        {/* Use Authentication Toggle */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config.useAuthentication}
              onChange={(e) => handleChange('useAuthentication', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Require Authentication</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Most SMTP servers require authentication. Enable this option if your server needs credentials.
          </p>
        </div>

        {/* Username & Password - Show if authentication enabled */}
        {config.useAuthentication && (
          <>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                id="username"
                type="text"
                placeholder="your@example.com or username"
                value={config.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter SMTP password"
                  value={config.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
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
                Store this securely. Never share your password.
              </p>
            </div>
          </>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Tip:</span> For Gmail, use an App Password instead of your regular password. Enable "Less secure app access" if required.
          </p>
        </div>
      </div>
    </div>
  );
};
