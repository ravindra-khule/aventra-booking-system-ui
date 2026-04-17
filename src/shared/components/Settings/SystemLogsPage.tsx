import React, { useState, useEffect } from 'react';
import { SettingsService, SETTINGS_CATEGORIES, Setting } from '@shared/services/settings.service';
import './SettingsPages.css';

const SystemLogsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await SettingsService.getByCategory(SETTINGS_CATEGORIES.SYSTEM);
      setSettings(data);

      const initialEdits: { [key: string]: string } = {};
      data.forEach(setting => {
        initialEdits[setting.key] = setting.value;
      });
      setEditingSettings(initialEdits);

      const maintenance = data.find(s => s.key === 'maintenance_mode')?.value === 'true';
      setMaintenanceMode(maintenance);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load system settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    const stringValue = String(value);
    setEditingSettings(prev => ({
      ...prev,
      [key]: stringValue
    }));

    if (key === 'maintenance_mode') {
      setMaintenanceMode(value as boolean);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editingSettings).map(([key, value]) => ({
        category: SETTINGS_CATEGORIES.SYSTEM,
        key,
        value
      }));

      const success = await SettingsService.updateMultiple(updates);

      if (success) {
        setMessage({ type: 'success', text: 'System settings saved successfully' });
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: 'Failed to save system settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving system settings' });
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
    const maintenance = settings.find(s => s.key === 'maintenance_mode')?.value === 'true';
    setMaintenanceMode(maintenance);
  };

  const isModified = () => {
    return settings.some(setting => editingSettings[setting.key] !== setting.value);
  };

  if (loading) {
    return <div className="settings-page loading-page">Loading system settings...</div>;
  }

  return (
    <div className="settings-page system-page">
      <div className="settings-header">
        <h1>⚙️ System Settings</h1>
        <p>Configure system-wide settings and preferences</p>
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
            <h2>Regional Settings</h2>
            <div className="form-fields two-column">
              <div className="setting-field">
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  value={editingSettings['timezone'] || ''}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="setting-input"
                >
                  <option value="UTC">UTC</option>
                  <option value="Europe/Stockholm">Europe/Stockholm (CET/CEST)</option>
                  <option value="Europe/Oslo">Europe/Oslo</option>
                  <option value="Europe/Copenhagen">Europe/Copenhagen</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>

              <div className="setting-field">
                <label htmlFor="language">Default Language</label>
                <select
                  id="language"
                  value={editingSettings['language'] || ''}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="setting-input"
                >
                  <option value="en">English</option>
                  <option value="sv">Swedish (Svenska)</option>
                  <option value="no">Norwegian (Norsk)</option>
                  <option value="da">Danish (Dansk)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="fr">French (Français)</option>
                </select>
              </div>

              <div className="setting-field">
                <label htmlFor="date_format">Date Format</label>
                <select
                  id="date_format"
                  value={editingSettings['date_format'] || ''}
                  onChange={(e) => handleInputChange('date_format', e.target.value)}
                  className="setting-input"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="setting-field">
                <label htmlFor="time_format">Time Format</label>
                <select
                  id="time_format"
                  value={editingSettings['time_format'] || ''}
                  onChange={(e) => handleInputChange('time_format', e.target.value)}
                  className="setting-input"
                >
                  <option value="24h">24-hour (23:59)</option>
                  <option value="12h">12-hour (11:59 PM)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Maintenance Mode</h2>
            <div className="maintenance-section">
              <div className="toggle-field">
                <label htmlFor="maintenance_mode">Enable Maintenance Mode</label>
                <div className="toggle-switch">
                  <input
                    id="maintenance_mode"
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-label">{maintenanceMode ? 'ON' : 'OFF'}</span>
                </div>
              </div>
              {maintenanceMode && (
                <div className="setting-field full-width">
                  <label htmlFor="maintenance_message">Maintenance Message</label>
                  <textarea
                    id="maintenance_message"
                    value={editingSettings['maintenance_message'] || ''}
                    onChange={(e) => handleInputChange('maintenance_message', e.target.value)}
                    placeholder="We are performing scheduled maintenance. Please check back soon."
                    className="setting-input"
                    rows={3}
                  />
                  <small className="field-hint">Message shown to users during maintenance</small>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Backup Settings</h2>
            <div className="form-fields two-column">
              <div className="setting-field">
                <label htmlFor="backup_enabled">Enable Automatic Backups</label>
                <select
                  id="backup_enabled"
                  value={editingSettings['backup_enabled'] || ''}
                  onChange={(e) => handleInputChange('backup_enabled', e.target.value)}
                  className="setting-input"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div className="setting-field">
                <label htmlFor="backup_frequency">Backup Frequency</label>
                <select
                  id="backup_frequency"
                  value={editingSettings['backup_frequency'] || ''}
                  onChange={(e) => handleInputChange('backup_frequency', e.target.value)}
                  className="setting-input"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="setting-field full-width">
                <label htmlFor="audit_log_retention_days">Audit Log Retention (days)</label>
                <input
                  id="audit_log_retention_days"
                  type="number"
                  value={editingSettings['audit_log_retention_days'] || ''}
                  onChange={(e) => handleInputChange('audit_log_retention_days', e.target.value)}
                  placeholder="90"
                  min="0"
                  className="setting-input"
                />
                <small className="field-hint">How long to keep audit logs (0 = indefinite)</small>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default SystemLogsPage;
