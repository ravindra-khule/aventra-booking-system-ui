import React from 'react';
import { ContactInformation } from '../types/companyInfo';
import { MapPin, Phone, Mail } from 'lucide-react';

interface ContactInformationProps {
  data: ContactInformation;
  onChange: (data: ContactInformation) => void;
}

export const ContactInformationSection: React.FC<ContactInformationProps> = ({
  data,
  onChange,
}) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...data,
      address: e.target.value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      phoneNumber: e.target.value,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      emailAddress: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>

      {/* Address */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin size={16} className="text-blue-500" />
          Address *
        </label>
        <textarea
          value={data.address}
          onChange={handleAddressChange}
          placeholder="Enter your full address&#10;Street, City, State, ZIP Code, Country"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Include street address, city, state, and country
        </p>
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Phone size={16} className="text-green-500" />
          Phone Number *
        </label>
        <input
          type="tel"
          value={data.phoneNumber}
          onChange={handlePhoneChange}
          placeholder="+1 (555) 123-4567"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: +country code (area code) number
        </p>
      </div>

      {/* Email Address */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Mail size={16} className="text-purple-500" />
          Email Address *
        </label>
        <input
          type="email"
          value={data.emailAddress}
          onChange={handleEmailChange}
          placeholder="contact@company.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Primary contact email address for inquiries
        </p>
      </div>
    </div>
  );
};
