/**
 * EmailPreview - Preview email templates with sample data
 */

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, X, Globe, RefreshCw } from 'lucide-react';
import { EmailTemplate, TemplateLanguage } from '../types/email.types';
import { SAMPLE_TEMPLATE_DATA, replacePlaceholders } from '../constants/email.constants';
import { emailTemplateService } from '../services/email.service';

interface EmailPreviewProps {
  template: EmailTemplate;
  onClose: () => void;
}

type ViewMode = 'desktop' | 'mobile';

export const EmailPreview: React.FC<EmailPreviewProps> = ({ template, onClose }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [selectedLanguage, setSelectedLanguage] = useState<TemplateLanguage>('en');
  const [previewContent, setPreviewContent] = useState<{
    subject: string;
    htmlContent: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreview();
  }, [template, selectedLanguage]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const preview = await emailTemplateService.previewTemplate(
        template.id,
        selectedLanguage,
        SAMPLE_TEMPLATE_DATA
      );
      
      if (preview) {
        setPreviewContent(preview);
      }
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if template has content for selected language
  const hasLanguage = template.content.some(c => c.language === selectedLanguage);
  
  // Auto-switch to available language if selected language is not available
  useEffect(() => {
    if (!hasLanguage && template.content.length > 0) {
      setSelectedLanguage(template.content[0].language);
    }
  }, [hasLanguage, template]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Preview with sample data</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as TemplateLanguage)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {template.content.map((content) => (
                  <option key={content.language} value={content.language}>
                    {content.language === 'en' ? '🇬🇧 English' : '🇸🇪 Swedish'}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadPreview}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh Preview"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading preview...</p>
              </div>
            </div>
          ) : !previewContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600">No preview available</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className={`bg-white shadow-lg transition-all duration-300 ${
                  viewMode === 'desktop' ? 'w-full max-w-4xl' : 'w-full max-w-md'
                }`}
              >
                {/* Email Header - Subject Line */}
                <div className="border-b border-gray-200 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500 mb-1">Subject:</div>
                  <div className="font-semibold text-gray-900">{previewContent.subject}</div>
                </div>

                {/* Email Body */}
                <div className="p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewContent.htmlContent }}
                  />
                </div>

                {/* Email Footer - Typical email client footer */}
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500 text-center">
                    This is a preview of how your email will appear to recipients
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <div className="text-gray-600">
                <span className="font-medium">Template:</span> {template.name}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Category:</span> {template.category}
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="text-gray-600">
                <span className="font-medium">Version:</span> {template.version}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Status:</span>{' '}
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                    template.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : template.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {template.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This preview uses sample data for placeholders. 
              Actual emails will use real customer and booking information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
