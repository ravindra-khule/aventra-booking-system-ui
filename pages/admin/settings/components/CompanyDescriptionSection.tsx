import React from 'react';
import { CompanyDescription } from '../types/companyInfo';
import { FileText } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface CompanyDescriptionProps {
  data: CompanyDescription;
  onChange: (data: CompanyDescription) => void;
}

export const CompanyDescriptionSection: React.FC<CompanyDescriptionProps> = ({
  data,
  onChange,
}) => {
  const handleAboutTextChange = (aboutText: string) => {
    onChange({
      ...data,
      aboutText,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <FileText size={20} className="text-blue-500" />
        Company Description
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Write a compelling description about your company. This text will be used across the platform.
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-3">
        About Text
      </label>

      <RichTextEditor
        value={data.aboutText}
        onChange={handleAboutTextChange}
        placeholder="Tell us about your company, your mission, values, and what makes you unique..."
        rows={8}
      />

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          <strong>📝 Content Guidelines:</strong>
          <br />
          • Keep it concise and engaging
          <br />
          • Highlight unique selling points
          <br />
          • Use clear, professional language
          <br />
          • Include company values or mission
          <br />• Optimal length: 200-500 words
        </p>
      </div>
    </div>
  );
};
