import React, { useState, useEffect } from 'react';
import { SettingsService, SETTINGS_CATEGORIES } from '../../../src/shared/services/settings.service';
import {
  EmailProvider,
  SMTPConfig,
  SendGridConfig,
  SenderDetails,
  EmailSignature,
  EmailTemplate,
  SendingLimits,
  BounceUnsubscribeSettings,
  EmailLog,
} from './types/emailSettings';
import { EmailProviderSettings } from './components/EmailProviderSettings';
import { SMTPConfiguration } from './components/SMTPConfiguration';
import { SendGridConfiguration } from './components/SendGridConfiguration';
import { SenderDetailsComponent } from './components/SenderDetails';
import { EmailSignatureComponent } from './components/EmailSignature';
import { DefaultTemplates } from './components/DefaultTemplates';
import { SendingLimitsComponent } from './components/SendingLimits';
import { BounceUnsubscribeComponent } from './components/BounceUnsubscribe';
import { EmailLogsComponent } from './components/EmailLogs';
import { TestEmail } from './components/TestEmail';

type TabType = 'configuration' | 'templates' | 'limits' | 'logs';

export const EmailSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('configuration');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Email Provider
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider>('SMTP');

  // SMTP Configuration
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: 'smtp.gmail.com',
    port: 587,
    encryption: 'TLS',
    useAuthentication: true,
    username: 'your-email@gmail.com',
    password: '',
  });

  // SendGrid Configuration
  const [sendGridConfig, setSendGridConfig] = useState<SendGridConfig>({
    apiKey: '',
    sandboxMode: false,
  });

  // Sender Details
  const [senderDetails, setSenderDetails] = useState<SenderDetails>({
    fromName: 'Swett Booking System',
    fromEmail: 'noreply@swettbooking.com',
    replyToEmail: 'support@swettbooking.com',
  });

  // Email Signature
  const [emailSignature, setEmailSignature] = useState<EmailSignature>({
    enabled: true,
    content: `Best regards,

Swett Booking System
Adventure Tours & Experiences
support@swettbooking.com
https://swettbooking.com`,
  });

  // Email Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  // Sending Limits
  const [sendingLimits, setSendingLimits] = useState<SendingLimits>({
    maxPerHour: 300,
    maxPerDay: 5000,
    throttlingEnabled: true,
  });

  // Bounce & Unsubscribe
  const [bounceUnsubscribe, setBounceUnsubscribe] = useState<BounceUnsubscribeSettings>({
    bounceHandling: {
      method: 'automatic',
      notifyOnBounce: true,
    },
    unsubscribe: {
      enabled: true,
      customUrl: 'https://swettbooking.com/unsubscribe',
    },
  });

  // Email Logs
  const [logs, setLogs] = useState<EmailLog[]>([]);

  // Load email settings from backend on mount
  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await SettingsService.getByCategory(SETTINGS_CATEGORIES.EMAIL);
      
      if (settings && settings.length > 0) {
        const settingsMap = settings.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, string>);

        // Map backend settings to component state
        setSelectedProvider((settingsMap['service_provider'] as EmailProvider) || 'SMTP');
        setSenderDetails({
          fromName: settingsMap['from_name'] || senderDetails.fromName,
          fromEmail: settingsMap['from_email'] || senderDetails.fromEmail,
          replyToEmail: settingsMap['reply_to_email'] || senderDetails.replyToEmail,
        });

        if (settingsMap['service_provider'] === 'SMTP') {
          setSmtpConfig({
            host: settingsMap['smtp_host'] || smtpConfig.host,
            port: parseInt(settingsMap['smtp_port'] || '587'),
            encryption: 'TLS',
            useAuthentication: true,
            username: settingsMap['smtp_username'] || smtpConfig.username,
            password: settingsMap['smtp_password'] || '',
          });
        } else if (settingsMap['service_provider'] === 'SMTP') {
          setSendGridConfig({
            apiKey: settingsMap['sendgrid_api_key'] || '',
            sandboxMode: false,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
      setSaveError('Failed to load email settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaveError(null);
      
      // Prepare updates
      const updates = [
        { category: SETTINGS_CATEGORIES.EMAIL, key: 'service_provider', value: selectedProvider },
        { category: SETTINGS_CATEGORIES.EMAIL, key: 'from_name', value: senderDetails.fromName },
        { category: SETTINGS_CATEGORIES.EMAIL, key: 'from_email', value: senderDetails.fromEmail },
        { category: SETTINGS_CATEGORIES.EMAIL, key: 'reply_to_email', value: senderDetails.replyToEmail },
      ];

      // Add SMTP settings if selected
      if (selectedProvider === 'SMTP') {
        updates.push(
          { category: SETTINGS_CATEGORIES.EMAIL, key: 'smtp_host', value: smtpConfig.host },
          { category: SETTINGS_CATEGORIES.EMAIL, key: 'smtp_port', value: String(smtpConfig.port) },
          { category: SETTINGS_CATEGORIES.EMAIL, key: 'smtp_username', value: smtpConfig.username },
          { category: SETTINGS_CATEGORIES.EMAIL, key: 'smtp_password', value: smtpConfig.password }
        );
      } else if (selectedProvider === 'SENDGRID') {
        updates.push({ category: SETTINGS_CATEGORIES.EMAIL, key: 'sendgrid_api_key', value: sendGridConfig.apiKey });
      }

      const success = await SettingsService.updateMultiple(updates);

      if (success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setSaveError('Failed to save email settings');
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      setSaveError('An error occurred while saving');
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setTemplates(
      templates.map((t) => (t.id === template.id ? template : t))
    );
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin mx-auto mb-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
              </div>
              <p className="text-gray-600">Loading email settings...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Email Settings</h1>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Changes
            </button>
          </div>
          <p className="text-gray-600">
            Configure email delivery, providers, templates, and notifications for your booking system.
          </p>

          {/* Error Message */}
          {saveError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700">{saveError}</p>
              </div>
            </div>
          )}

          {/* Save Notification */}
          {isSaved && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-900">Changes Saved</h3>
                <p className="text-sm text-green-700">Your email settings have been saved successfully.</p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 border-b border-gray-200">
          <div className="flex flex-wrap">
            {(
              [
                { id: 'configuration', label: 'Configuration', icon: '⚙️' },
                { id: 'templates', label: 'Templates', icon: '📧' },
                { id: 'limits', label: 'Limits & Rules', icon: '⏱️' },
                { id: 'logs', label: 'Activity Logs', icon: '📋' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Configuration Tab */}
          {activeTab === 'configuration' && (
            <div className="space-y-6">
              {/* Provider Selection */}
              <EmailProviderSettings
                selectedProvider={selectedProvider}
                onProviderChange={setSelectedProvider}
              />

              {/* Provider-specific Configuration */}
              {selectedProvider === 'SMTP' ? (
                <SMTPConfiguration config={smtpConfig} onChange={setSmtpConfig} />
              ) : (
                <SendGridConfiguration config={sendGridConfig} onChange={setSendGridConfig} />
              )}

              {/* Sender Details */}
              <SenderDetailsComponent details={senderDetails} onChange={setSenderDetails} />

              {/* Email Signature */}
              <EmailSignatureComponent signature={emailSignature} onChange={setEmailSignature} />

              {/* Test Email */}
              <TestEmail />
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div>
              <DefaultTemplates
                templates={templates}
                onEditTemplate={handleEditTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </div>
          )}

          {/* Limits & Rules Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-6">
              <SendingLimitsComponent limits={sendingLimits} onChange={setSendingLimits} />
              <BounceUnsubscribeComponent
                settings={bounceUnsubscribe}
                onChange={setBounceUnsubscribe}
              />
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div>
              <EmailLogsComponent logs={logs} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Save Changes
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};
