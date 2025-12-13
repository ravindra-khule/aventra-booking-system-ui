import React from 'react';
import { CompanyIdentity as CompanyIdentityType, LogoUploadModal } from '../types/companyInfo';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CompanyIdentityProps {
  data: CompanyIdentityType;
  onChange: (data: CompanyIdentityType) => void;
  onLogoModalOpen: () => void;
}

export const CompanyIdentity: React.FC<CompanyIdentityProps> = ({
  data,
  onChange,
  onLogoModalOpen,
}) => {
  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      companyName: e.target.value,
    });
  };

  const handleRemoveLogo = () => {
    onChange({
      ...data,
      logo: null,
      logoFileName: undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Identity</h3>

      {/* Company Name */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={data.companyName}
          onChange={handleCompanyNameChange}
          placeholder="Enter your company name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <p className="text-xs text-gray-500 mt-1">
          This is the primary name displayed across the platform
        </p>
      </div>

      {/* Logo Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Company Logo
        </label>

        {data.logo ? (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={data.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Current Logo:</strong> {data.logoFileName || 'logo.png'}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Recommended size: 200x200px or larger (square format)
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onLogoModalOpen}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <Upload size={16} />
                    Replace Logo
                  </button>
                  <button
                    onClick={handleRemoveLogo}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium border border-red-200"
                  >
                    <X size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={onLogoModalOpen}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <ImageIcon size={40} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">Upload Company Logo</p>
            <p className="text-xs text-gray-500 mb-4">
              PNG, JPG, or SVG up to 5MB
            </p>
            <button
              onClick={onLogoModalOpen}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
            >
              Choose File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
