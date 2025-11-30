/**
 * EmailTemplateForm - Create and edit email templates
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Globe } from 'lucide-react';
import {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateStatus,
  TemplateLanguage,
  TemplateContent
} from '../types/email.types';
import { EmailEditor } from './EmailEditor';
import { emailTemplateService } from '../services/email.service';

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onClose: () => void;
  onSave: () => void;
}

export const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  template,
  onClose,
  onSave
}) => {
  const isEditMode = !!template;
  
  // Form state
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [category, setCategory] = useState<EmailTemplateCategory>(
    template?.category || EmailTemplateCategory.CUSTOM
  );
  const [status, setStatus] = useState<EmailTemplateStatus>(
    template?.status || EmailTemplateStatus.DRAFT
  );
  const [tags, setTags] = useState<string[]>(template?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // Multi-language content
  const [activeLanguage, setActiveLanguage] = useState<TemplateLanguage>('en');
  const [contentEN, setContentEN] = useState<TemplateContent>({
    language: 'en',
    subject: template?.content.find(c => c.language === 'en')?.subject || '',
    preheader: template?.content.find(c => c.language === 'en')?.preheader || '',
    htmlContent: template?.content.find(c => c.language === 'en')?.htmlContent || ''
  });
  const [contentSV, setContentSV] = useState<TemplateContent>({
    language: 'sv',
    subject: template?.content.find(c => c.language === 'sv')?.subject || '',
    preheader: template?.content.find(c => c.language === 'sv')?.preheader || '',
    htmlContent: template?.content.find(c => c.language === 'sv')?.htmlContent || ''
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const activeContent = activeLanguage === 'en' ? contentEN : contentSV;
  const setActiveContent = activeLanguage === 'en' ? setContentEN : setContentSV;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push('Template name is required');
    }

    if (!contentEN.subject.trim() && !contentSV.subject.trim()) {
      newErrors.push('At least one language must have a subject');
    }

    if (!contentEN.htmlContent.trim() && !contentSV.htmlContent.trim()) {
      newErrors.push('At least one language must have content');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors([]);

    try {
      // Prepare content array (only include languages with content)
      const content: TemplateContent[] = [];
      
      if (contentEN.subject.trim() && contentEN.htmlContent.trim()) {
        content.push(contentEN);
      }
      
      if (contentSV.subject.trim() && contentSV.htmlContent.trim()) {
        content.push(contentSV);
      }

      if (isEditMode && template) {
        // Update existing template
        await emailTemplateService.updateTemplate(template.id, {
          name,
          description,
          category,
          status,
          content,
          tags,
          lastModifiedBy: 'admin' // In production, get from auth context
        });
      } else {
        // Create new template
        await emailTemplateService.createTemplate({
          name,
          description,
          category,
          status,
          content,
          isDefault: false,
          tags,
          createdBy: 'admin' // In production, get from auth context
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors([error instanceof Error ? error.message : 'Failed to save template']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Template' : 'Create New Template'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode
                ? 'Update your email template settings and content'
                : 'Create a new email template for automated communications'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-900 mb-1">
                      Please fix the following errors:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Booking Confirmation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EmailTemplateCategory)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Object.values(EmailTemplateCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmailTemplateStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(EmailTemplateStatus).map((stat) => (
                    <option key={stat} value={stat}>
                      {stat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of this email template"
              />
            </div>

            {/* Language Tabs */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">
                  Email Content (Multi-language)
                </label>
              </div>

              <div className="flex gap-2 border-b border-gray-200 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveLanguage('en')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeLanguage === 'en'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLanguage('sv')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeLanguage === 'sv'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🇸🇪 Swedish
                </button>
              </div>

              {/* Content for Active Language */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    value={activeContent.subject}
                    onChange={(e) =>
                      setActiveContent({ ...activeContent, subject: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Subject line for the email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preheader (Optional)
                  </label>
                  <input
                    type="text"
                    value={activeContent.preheader || ''}
                    onChange={(e) =>
                      setActiveContent({ ...activeContent, preheader: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Preview text that appears after subject in inbox"
                  />
                </div>

                <EmailEditor
                  value={activeContent.htmlContent}
                  onChange={(value) =>
                    setActiveContent({ ...activeContent, htmlContent: value })
                  }
                  label="Email Content *"
                  placeholder={`Start typing your ${activeLanguage === 'en' ? 'English' : 'Swedish'} email content...`}
                  height="500px"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            * Required fields. At least one language must have subject and content.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditMode ? 'Update Template' : 'Create Template'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
