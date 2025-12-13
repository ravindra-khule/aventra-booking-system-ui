import React from 'react';
import { BusinessRegistration } from '../types/companyInfo';
import { FileText } from 'lucide-react';

interface BusinessRegistrationProps {
  data: BusinessRegistration;
  onChange: (data: BusinessRegistration) => void;
}

export const BusinessRegistrationSection: React.FC<BusinessRegistrationProps> = ({
  data,
  onChange,
}) => {
  const handleRegistrationNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      businessRegistrationNumber: e.target.value,
    });
  };

  const handleVatTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      vatTaxId: e.target.value,
    });
  };

  const handleAdditionalIdsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...data,
      additionalStatutoryIds: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <FileText size={20} className="text-blue-500" />
        Business Registration Details
      </h3>

      {/* Business Registration Number */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Registration Number *
        </label>
        <input
          type="text"
          value={data.businessRegistrationNumber}
          onChange={handleRegistrationNumberChange}
          placeholder="e.g., BR-123456789"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Official business registration or incorporation number
        </p>
      </div>

      {/* VAT / Tax ID */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          VAT / Tax ID *
        </label>
        <input
          type="text"
          value={data.vatTaxId}
          onChange={handleVatTaxIdChange}
          placeholder="e.g., VAT-987654321"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Value Added Tax or Tax Identification Number
        </p>
      </div>

      {/* Additional Statutory IDs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Statutory IDs (Optional)
        </label>
        <textarea
          value={data.additionalStatutoryIds || ''}
          onChange={handleAdditionalIdsChange}
          placeholder="e.g., PAN: XXXX-XXXX-XXXX, GST: XXXXX&#10;One per line"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Any additional legal or tax identification numbers (optional)
        </p>
      </div>
    </div>
  );
};
