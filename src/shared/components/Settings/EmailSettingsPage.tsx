import React, { useState, useEffect } from 'react';
import { SettingsService, SETTINGS_CATEGORIES, Setting } from '@shared/services/settings.service';
import './SettingsPages.css';

const EmailSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeService, setActiveService] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await SettingsService.getByCategory(SETTINGS_CATEGORIES.EMAIL);
      setSettings(data);

      const initialEdits: { [key: string]: string } = {};
      data.forEach(setting => {
        initialEdits[setting.key] = setting.value;
      });
      setEditingSettings(initialEdits);

      const service = data.find(s => s.key === 'service_provider')?.value || 'smtp';
      setActiveService(service);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load email settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'service_provider') {
      setActiveService(value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editingSettings).map(([key, value]) => ({
        category: SETTINGS_CATEGORIES.EMAIL,
        key,
        value
      }));

      const success = await SettingsService.updateMultiple(updates);

      if (success) {
        setMessage({ type: 'success', text: 'Email settings saved successfully' });
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: 'Failed to save email settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving email settings' });
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
    const service = settings.find(s => s.key === 'service_provider')?.value || 'smtp';
    setActiveService(service);
  };

  const isModified = () => {
    return settings.some(setting => editingSettings[setting.key] !== setting.value);
  };

  if (loading) {
    return <div className="settings-page loading-page">Loading email settings...</div>;
  }

  return (
    <div className="settings-page email-page">
      <div className="settings-header">
        <h1>📧 Email Settings</h1>
        <p>Configure email service and notification settings</p>
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

      <div className="settings-container single-page-container">
        <div className="settings-form">
          <div className="form-section">
            <h2>Sender Information</h2>
            <div className="form-fields two-column">
              <div className="setting-field">
                <label htmlFor="from_email">From Email Address</label>
                <input
                  id="from_email"
                  type="email"
                  value={editingSettings['from_email'] || ''}
                  onChange={(e) => handleInputChange('from_email', e.target.value)}
                  placeholder="noreply@example.com"
                  className="setting-input"
                />
              </div>

              <div className="setting-field">
                <label htmlFor="from_name">From Name</label>
                <input
                  id="from_name"
                  type="text"
                  value={editingSettings['from_name'] || ''}
                  onChange={(e) => handleInputChange('from_name', e.target.value)}
                  placeholder="Aventra Tours"
                  className="setting-input"
                />
              </div>

              <div className="setting-field full-width">
                <label htmlFor="reply_to_email">Reply-To Email Address</label>
                <input
                  id="reply_to_email"
                  type="email"
                  value={editingSettings['reply_to_email'] || ''}
                  onChange={(e) => handleInputChange('reply_to_email', e.target.value)}
                  placeholder="support@example.com"
                  className="setting-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Email Service Provider</h2>
            <div className="form-fields">
              <div className="setting-field full-width">
                <label htmlFor="service_provider">Service Provider</label>
                <select
                  id="service_provider"
                  value={activeService}
                  onChange={(e) => handleInputChange('service_provider', e.target.value)}
                  className="setting-input"
                >
                  <option value="smtp">SMTP Server</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                </select>
              </div>
            </div>
          </div>

          {activeService === 'smtp' && (
            <div className="form-section">
              <h3>SMTP Configuration</h3>
              <div className="form-fields two-column">
                <div className="setting-field">
                  <label htmlFor="smtp_host">SMTP Host</label>
                  <input
                    id="smtp_host"
                    type="text"
                    value={editingSettings['smtp_host'] || ''}
                    onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="setting-input"
                  />
                </div>

                <div className="setting-field">
                  <label htmlFor="smtp_port">SMTP Port</label>
                  <input
                    id="smtp_port"
                    type="text"
                    value={editingSettings['smtp_port'] || ''}
                    onChange={(e) => handleInputChange('smtp_port', e.target.value)}
                    placeholder="587"
                    className="setting-input"
                  />
                </div>

                <div className="setting-field">
                  <label htmlFor="smtp_username">SMTP Username</label>
                  <input
                    id="smtp_username"
                    type="text"
                    value={editingSettings['smtp_username'] || ''}
                    onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="setting-input"
                  />
                </div>

                <div className="setting-field">
                  <label htmlFor="smtp_password">SMTP Password</label>
                  <input
                    id="smtp_password"
                    type="password"
                    value={editingSettings['smtp_password'] || ''}
                    onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                    placeholder="••••••••"
                    className="setting-input"
                  />
                  <small className="field-hint">🔒 Encrypted</small>
                </div>
              </div>
            </div>
          )}

          {activeService === 'sendgrid' && (
            <div className="form-section">
              <h3>SendGrid Configuration</h3>
              <div className="form-fields">
                <div className="setting-field full-width">
                  <label htmlFor="sendgrid_api_key">SendGrid API Key</label>
                  <input
                    id="sendgrid_api_key"
                    type="password"
                    value={editingSettings['sendgrid_api_key'] || ''}
                    onChange={(e) => handleInputChange('sendgrid_api_key', e.target.value)}
                    placeholder="SG.••••••••"
                    className="setting-input"
                  />
                  <small className="field-hint">🔒 Encrypted - Get from SendGrid dashboard</small>
                </div>
              </div>
            </div>
          )}

          {activeService === 'mailgun' && (
            <div className="form-section">
              <h3>Mailgun Configuration</h3>
              <div className="form-fields two-column">
                <div className="setting-field">
                  <label htmlFor="mailgun_domain">Mailgun Domain</label>
                  <input
                    id="mailgun_domain"
                    type="text"
                    value={editingSettings['mailgun_domain'] || ''}
                    onChange={(e) => handleInputChange('mailgun_domain', e.target.value)}
                    placeholder="mg.example.com"
                    className="setting-input"
                  />
                </div>

                <div className="setting-field">
                  <label htmlFor="mailgun_api_key">Mailgun API Key</label>
                  <input
                    id="mailgun_api_key"
                    type="password"
                    value={editingSettings['mailgun_api_key'] || ''}
                    onChange={(e) => handleInputChange('mailgun_api_key', e.target.value)}
                    placeholder="key-••••••••"
                    className="setting-input"
                  />
                  <small className="field-hint">🔒 Encrypted</small>
                </div>
              </div>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default EmailSettingsPage;
