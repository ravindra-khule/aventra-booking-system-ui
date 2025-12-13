import React, { useState } from 'react';
import { EmailTemplate } from '../types/emailSettings';

interface EditTemplateModalProps {
  isOpen: boolean;
  template: EmailTemplate;
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
}

export const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  isOpen,
  template,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(template);
  const [charCount, setCharCount] = useState(template.body.length);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'body') {
      setCharCount(value.length);
    }
  };

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Email Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Template Name */}
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-2">
              Template Name *
            </label>
            <input
              id="template-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="template-subject" className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject *
            </label>
            <input
              id="template-subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Use {"{'{VARIABLE}'}"}  for dynamic content
            </p>
          </div>

          {/* Template Body */}
          <div>
            <label htmlFor="template-body" className="block text-sm font-medium text-gray-700 mb-2">
              Email Body *
            </label>

            {/* Toolbar */}
            <div className="bg-gray-100 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => handleChange('body', formData.body + '{{CUSTOMER_NAME}}')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {"{'{CUSTOMER_NAME}'}"}
              </button>
              <button
                type="button"
                onClick={() => handleChange('body', formData.body + '{{BOOKING_ID}}')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {"{'{BOOKING_ID}'}"}
              </button>
              <button
                type="button"
                onClick={() => handleChange('body', formData.body + '{{BOOKING_DATE}}')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {"{'{BOOKING_DATE}'}"}
              </button>
              <button
                type="button"
                onClick={() => handleChange('body', formData.body + '{{TOUR_NAME}}')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {"{'{TOUR_NAME}'}"}
              </button>
              <button
                type="button"
                onClick={() => handleChange('body', formData.body + '{{TOTAL_AMOUNT}}')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                {"{'{TOTAL_AMOUNT}'}"}
              </button>
            </div>

            <textarea
              id="template-body"
              value={formData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="Enter your email template content here..."
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />

            <p className="mt-2 text-sm text-gray-500">
              Characters: {charCount}
            </p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-2">
                <strong>Subject:</strong> {formData.subject}
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-white border border-gray-200 rounded p-3">
                {formData.body}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};
