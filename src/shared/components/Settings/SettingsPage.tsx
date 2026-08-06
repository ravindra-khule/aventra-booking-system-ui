import React, { useState, useEffect } from 'react';
import { SettingsService, SETTINGS_CATEGORIES, Setting } from '@shared/services/settings.service';
import './SettingsPage.css';

type CategoryKey = keyof typeof SETTINGS_CATEGORIES;

interface SettingField extends Setting {
  displayName: string;
  inputType: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  encrypted?: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(SETTINGS_CATEGORIES.COMPANY);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch settings on component mount and when category changes
  useEffect(() => {
    fetchSettings(activeCategory);
  }, [activeCategory]);

  const fetchSettings = async (category: string) => {
    setLoading(true);
    try {
      const data = await SettingsService.getByCategory(category);
      setSettings(data);
      
      // Initialize editing state
      const initialEdits: { [key: string]: string } = {};
      data.forEach(setting => {
        initialEdits[setting.key] = setting.value;
      });
      setEditingSettings(initialEdits);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editingSettings).map(([key, value]) => ({
        category: activeCategory,
        key,
        value
      }));

      const success = await SettingsService.updateMultiple(updates);

      if (success) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
        fetchSettings(activeCategory);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const initialEdits: { [key: string]: string } = {};
    settings.forEach(setting => {
      initialEdits[setting.key] = setting.value;
    });
    setEditingSettings(initialEdits);
  };

  const getInputType = (key: string): 'text' | 'email' | 'password' | 'number' = {
    email: 'email',
    phone: 'text',
    'from_email': 'email',
    'reply_to_email': 'email',
    'sendgrid_api_key': 'password',
    'stripe_secret_key': 'password',
    'fortnox_client_id': 'password',
    'fortnox_client_secret': 'password',
    'smtp_password': 'password',
    booking_reminder_days: 'number',
    session_timeout: 'number'
  }[key] || 'text';

  const isModified = () => {
    return settings.some(setting => editingSettings[setting.key] !== setting.value);
  };

  const renderSettingField = (setting: Setting) => {
    const inputType = getInputType(setting.key);
    const value = editingSettings[setting.key] || '';
    const isEncrypted = ['key', 'secret', 'password'].some(term => setting.key.toLowerCase().includes(term));

    return (
      <div key={setting.key} className="setting-field">
        <label htmlFor={setting.key}>
          <div className="field-label">
            <span>{setting.description}</span>
            {isEncrypted && <span className="encrypted-badge">🔒 Encrypted</span>}
          </div>
        </label>
        <input
          id={setting.key}
          type={inputType === 'password' ? 'password' : inputType}
          value={value}
          onChange={(e) => handleInputChange(setting.key, e.target.value)}
          placeholder={`Enter ${setting.description.toLowerCase()}`}
          className="setting-input"
        />
        {setting.type === 'json' && (
          <small className="field-hint">JSON format required</small>
        )}
      </div>
    );
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Application Settings</h1>
        <p>Manage your application configuration and preferences</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button 
            className="close-alert"
            onClick={() => setMessage(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="settings-container">
        {/* Category Tabs */}
        <div className="category-tabs">
          {Object.values(SETTINGS_CATEGORIES).map(category => (
            <button
              key={category}
              className={`tab-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              disabled={saving}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Settings Form */}
        <div className="settings-form">
          {loading ? (
            <div className="loading">Loading settings...</div>
          ) : settings.length === 0 ? (
            <div className="no-settings">No settings available for this category</div>
          ) : (
            <>
              <div className="form-fields">
                {settings.map(renderSettingField)}
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!isModified() || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={!isModified() || saving}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Descriptions */}
      <div className="settings-info">
        <h3>About Settings Categories</h3>
        <dl>
          <dt>{SETTINGS_CATEGORIES.COMPANY}</dt>
          <dd>Basic company information, branding, and contact details</dd>

          <dt>{SETTINGS_CATEGORIES.EMAIL}</dt>
          <dd>Email service configuration (SMTP, SendGrid, Mailgun)</dd>

          <dt>{SETTINGS_CATEGORIES.PAYMENT}</dt>
          <dd>Payment gateway settings (Stripe, currency, payment methods)</dd>

          <dt>{SETTINGS_CATEGORIES.INTEGRATION}</dt>
          <dd>Third-party integrations (Fortnox, APIs, webhooks)</dd>

          <dt>{SETTINGS_CATEGORIES.NOTIFICATION}</dt>
          <dd>Booking confirmations, reminders, and notification preferences</dd>

          <dt>{SETTINGS_CATEGORIES.SYSTEM}</dt>
          <dd>System-wide settings (timezone, language, maintenance mode)</dd>

          <dt>{SETTINGS_CATEGORIES.SECURITY}</dt>
          <dd>Security policies (session timeout, MFA, password requirements)</dd>
        </dl>
      </div>
    </div>
  );
};

export default SettingsPage;
