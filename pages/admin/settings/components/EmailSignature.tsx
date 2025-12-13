import React, { useState } from 'react';
import { EmailSignature } from '../types/emailSettings';

interface EmailSignatureComponentProps {
  signature: EmailSignature;
  onChange: (signature: EmailSignature) => void;
}

export const EmailSignatureComponent: React.FC<EmailSignatureComponentProps> = ({
  signature,
  onChange,
}) => {
  const [characterCount, setCharacterCount] = useState(signature.content.length);

  const handleContentChange = (content: string) => {
    setCharacterCount(content.length);
    onChange({
      ...signature,
      content,
    });
  };

  const insertVariable = (variable: string) => {
    const newContent = signature.content + ` {{${variable}}}`;
    handleContentChange(newContent);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Signature</h3>

      <div className="space-y-4">
        {/* Enable Toggle */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={signature.enabled}
              onChange={(e) => onChange({ ...signature, enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable Email Signature</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Add a signature to the end of all outgoing emails
          </p>
        </div>

        {signature.enabled && (
          <>
            {/* Rich Text Editor */}
            <div>
              <label htmlFor="signature-content" className="block text-sm font-medium text-gray-700 mb-2">
                Signature Content
              </label>

              {/* Toolbar */}
              <div className="bg-gray-100 border border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => insertVariable('COMPANY_NAME')}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                  title="Insert company name"
                >
                  Company
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable('COMPANY_ADDRESS')}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                  title="Insert company address"
                >
                  Address
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable('COMPANY_PHONE')}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                  title="Insert company phone"
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable('COMPANY_WEBSITE')}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                  title="Insert company website"
                >
                  Website
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable('CURRENT_YEAR')}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                  title="Insert current year"
                >
                  Year
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="signature-content"
                value={signature.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`Best regards,\n\nAventra Booking System\nCompany Website: https://aventrabooking.com\n\nUse {{VARIABLE}} to add dynamic content.`}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {characterCount} characters | Variables: {"{'{COMPANY_NAME}'}"} {"{'{CURRENT_YEAR}'}"}
                </p>
                <p className="text-sm text-gray-500">
                  {characterCount > 500 && <span className="text-orange-600">Signature is quite long</span>}
                </p>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {signature.content || 'Your signature will appear here...'}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Tip:</span> Use variables like {"{'{COMPANY_NAME}'}"} for dynamic content that updates automatically.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
