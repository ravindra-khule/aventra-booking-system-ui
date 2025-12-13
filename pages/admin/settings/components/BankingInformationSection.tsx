import React from 'react';
import { BankingInformation } from '../types/companyInfo';
import { DollarSign } from 'lucide-react';

interface BankingInformationProps {
  data: BankingInformation;
  onChange: (data: BankingInformation) => void;
}

export const BankingInformationSection: React.FC<BankingInformationProps> = ({
  data,
  onChange,
}) => {
  const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      bankName: e.target.value,
    });
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      accountNumber: e.target.value,
    });
  };

  const handleIfscSwiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      ifscSwift: e.target.value,
    });
  };

  const handleBranchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      branchName: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <DollarSign size={20} className="text-green-500" />
        Banking Information
      </h3>

      {/* Bank Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bank Name *
        </label>
        <input
          type="text"
          value={data.bankName}
          onChange={handleBankNameChange}
          placeholder="e.g., National Bank of XYZ"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Account Number */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Number *
        </label>
        <input
          type="text"
          value={data.accountNumber}
          onChange={handleAccountNumberChange}
          placeholder="e.g., 1234567890123456"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          Keep this secure and only share with authorized personnel
        </p>
      </div>

      {/* IFSC / SWIFT */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IFSC / SWIFT Code *
        </label>
        <input
          type="text"
          value={data.ifscSwift}
          onChange={handleIfscSwiftChange}
          placeholder="e.g., IDFCINTERNA or SWIFT: DEUTDEFF"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          IFSC for India, SWIFT for international transfers
        </p>
      </div>

      {/* Branch Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Branch Name *
        </label>
        <input
          type="text"
          value={data.branchName}
          onChange={handleBranchNameChange}
          placeholder="e.g., New York Main Branch"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>
    </div>
  );
};
