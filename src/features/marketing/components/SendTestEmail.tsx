/**
 * SendTestEmail - Send test emails to verify template
 */

import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import { EmailTemplate, TemplateLanguage } from '../types/email.types';
import { emailTemplateService } from '../services/email.service';
import { SAMPLE_TEMPLATE_DATA } from '../constants/email.constants';

interface SendTestEmailProps {
  template: EmailTemplate;
  onClose: () => void;
}

export const SendTestEmail: React.FC<SendTestEmailProps> = ({ template, onClose }) => {
  const [email, setEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<TemplateLanguage>('en');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setResult({
        type: 'error',
        message: 'Please enter an email address'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setResult({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await emailTemplateService.sendTestEmail({
        templateId: template.id,
        language: selectedLanguage,
        recipientEmail: email,
        testData: SAMPLE_TEMPLATE_DATA
      });

      if (response.success) {
        setResult({
          type: 'success',
          message: `Test email sent successfully to ${email}`
        });
        // Clear email after 3 seconds
        setTimeout(() => {
          setEmail('');
          setResult(null);
        }, 3000);
      } else {
        setResult({
          type: 'error',
          message: response.error || 'Failed to send test email'
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send test email'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send Test Email</h2>
              <p className="text-sm text-gray-600 mt-1">
                {template.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-6 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4" />
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as TemplateLanguage)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {template.content.map((content) => (
                <option key={content.language} value={content.language}>
                  {content.language === 'en' ? '🇬🇧 English' : '🇸🇪 Swedish'} - {content.subject}
                </option>
              ))}
            </select>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
              required
              disabled={sending}
            />
            <p className="mt-2 text-xs text-gray-500">
              The test email will be sent with sample data for all placeholders
            </p>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm ${
                    result.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {result.message}
                </p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              What happens when I send a test email?
            </h4>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>The email will be sent to the address you specify</li>
              <li>All placeholders will be replaced with sample data</li>
              <li>You can check how the email looks in your inbox</li>
              <li>This will not count towards usage statistics</li>
            </ul>
          </div>

          {/* Sample Data Preview */}
          <details className="text-sm">
            <summary className="font-medium text-gray-700 cursor-pointer hover:text-gray-900">
              View sample data that will be used
            </summary>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
              <dl className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <dt className="font-medium text-gray-700">Customer Name:</dt>
                  <dd className="text-gray-600">John Doe</dd>
                  
                  <dt className="font-medium text-gray-700">Booking ID:</dt>
                  <dd className="text-gray-600">BK-2025-001</dd>
                  
                  <dt className="font-medium text-gray-700">Tour Name:</dt>
                  <dd className="text-gray-600">Arctic Aurora Adventure</dd>
                  
                  <dt className="font-medium text-gray-700">Tour Date:</dt>
                  <dd className="text-gray-600">2025-12-15</dd>
                  
                  <dt className="font-medium text-gray-700">Total Amount:</dt>
                  <dd className="text-gray-600">15,000 SEK</dd>
                </div>
              </dl>
            </div>
          </details>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={sending}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !email}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Test Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
