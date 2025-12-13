import React from 'react';
import { SenderDetails } from '../types/emailSettings';

interface SenderDetailsComponentProps {
  details: SenderDetails;
  onChange: (details: SenderDetails) => void;
}

export const SenderDetailsComponent: React.FC<SenderDetailsComponentProps> = ({
  details,
  onChange,
}) => {
  const handleChange = (field: keyof SenderDetails, value: string) => {
    onChange({
      ...details,
      [field]: value,
    });
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sender Details</h3>

      <div className="space-y-6">
        {/* From Name */}
        <div>
          <label htmlFor="from-name" className="block text-sm font-medium text-gray-700 mb-2">
            From Name *
          </label>
          <input
            id="from-name"
            type="text"
            placeholder="e.g., Aventra Booking System"
            value={details.fromName}
            onChange={(e) => handleChange('fromName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            This is how your name appears in the "From" field of emails
          </p>
        </div>

        {/* From Email */}
        <div>
          <label htmlFor="from-email" className="block text-sm font-medium text-gray-700 mb-2">
            From Email Address *
          </label>
          <input
            id="from-email"
            type="email"
            placeholder="noreply@aventrabooking.com"
            value={details.fromEmail}
            onChange={(e) => handleChange('fromEmail', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              details.fromEmail && !isValidEmail(details.fromEmail)
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {details.fromEmail && !isValidEmail(details.fromEmail) && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Must be a verified email address with your email provider
          </p>
        </div>

        {/* Reply-To Email */}
        <div>
          <label htmlFor="reply-to-email" className="block text-sm font-medium text-gray-700 mb-2">
            Reply-To Email Address
          </label>
          <input
            id="reply-to-email"
            type="email"
            placeholder="support@aventrabooking.com"
            value={details.replyToEmail}
            onChange={(e) => handleChange('replyToEmail', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              details.replyToEmail && !isValidEmail(details.replyToEmail)
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {details.replyToEmail && !isValidEmail(details.replyToEmail) && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Where recipients' replies will be sent. Leave empty to use the From email.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Preview:</span>
            <br />
            <span className="font-medium">{details.fromName}</span> {`<${details.fromEmail}>`}
          </p>
        </div>
      </div>
    </div>
  );
};
