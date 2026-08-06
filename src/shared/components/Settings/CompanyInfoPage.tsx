import React, { useState, useEffect } from 'react';
import { SettingsService, SETTINGS_CATEGORIES, Setting } from '@shared/services/settings.service';
import './SettingsPages.css';

const CompanyInfoPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await SettingsService.getByCategory(SETTINGS_CATEGORIES.COMPANY);
      setSettings(data);

      const initialEdits: { [key: string]: string } = {};
      data.forEach(setting => {
        initialEdits[setting.key] = setting.value;
      });
      setEditingSettings(initialEdits);

      // Set logo preview
      const logoUrl = data.find(s => s.key === 'logo_url')?.value;
      if (logoUrl) {
        setLogoPreview(logoUrl);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load company information' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'logo_url') {
      setLogoPreview(value || null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editingSettings).map(([key, value]) => ({
        category: SETTINGS_CATEGORIES.COMPANY,
        key,
        value
      }));

      const success = await SettingsService.updateMultiple(updates);

      if (success) {
        setMessage({ type: 'success', text: 'Company information saved successfully' });
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: 'Failed to save company information' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving company information' });
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
    const logoUrl = settings.find(s => s.key === 'logo_url')?.value;
    setLogoPreview(logoUrl || null);
  };

  const isModified = () => {
    return settings.some(setting => editingSettings[setting.key] !== setting.value);
  };

  if (loading) {
    return <div className="settings-page loading-page">Loading company information...</div>;
  }

  return (
    <div className="settings-page company-page">
      <div className="settings-header">
        <h1>🏢 Company Information</h1>
        <p>Manage your company details and branding</p>
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
            <h2>Basic Information</h2>
            <div className="form-fields two-column">
              <div className="setting-field">
                <label htmlFor="name">Company Name</label>
                <input
                  id="name"
                  type="text"
                  value={editingSettings['name'] || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter company legal name"
                  className="setting-input"
                />
              </div>

              <div className="setting-field">
                <label htmlFor="vat_number">VAT Number</label>
                <input
                  id="vat_number"
                  type="text"
                  value={editingSettings['vat_number'] || ''}
                  onChange={(e) => handleInputChange('vat_number', e.target.value)}
                  placeholder="Enter VAT ID"
                  className="setting-input"
                />
              </div>

              <div className="setting-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={editingSettings['email'] || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter company email"
                  className="setting-input"
                />
              </div>

              <div className="setting-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  value={editingSettings['phone'] || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="setting-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact & Web</h2>
            <div className="form-fields">
              <div className="setting-field full-width">
                <label htmlFor="address">Physical Address</label>
                <textarea
                  id="address"
                  value={editingSettings['address'] || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full street address"
                  className="setting-input"
                  rows={3}
                />
              </div>

              <div className="setting-field">
                <label htmlFor="website">Website URL</label>
                <input
                  id="website"
                  type="url"
                  value={editingSettings['website'] || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="setting-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Branding</h2>
            <div className="logo-section">
              {logoPreview && (
                <div className="logo-preview">
                  <img src={logoPreview} alt="Company Logo" />
                </div>
              )}
              <div className="setting-field full-width">
                <label htmlFor="logo_url">Logo URL</label>
                <input
                  id="logo_url"
                  type="url"
                  value={editingSettings['logo_url'] || ''}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="setting-input"
                />
                <small className="field-hint">PNG or SVG format recommended. Size: 200x50px</small>
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

export default CompanyInfoPage;
