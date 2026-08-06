import React, { useState, useEffect } from 'react';
import { SettingsService, SETTINGS_CATEGORIES, Setting } from '@shared/services/settings.service';
import './SettingsPages.css';

const PaymentDetailsPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stripeMode, setStripeMode] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await SettingsService.getByCategory(SETTINGS_CATEGORIES.PAYMENT);
      setSettings(data);

      const initialEdits: { [key: string]: string } = {};
      data.forEach(setting => {
        initialEdits[setting.key] = setting.value;
      });
      setEditingSettings(initialEdits);

      const mode = data.find(s => s.key === 'stripe_mode')?.value || 'test';
      setStripeMode(mode);
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load payment settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'stripe_mode') {
      setStripeMode(value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editingSettings).map(([key, value]) => ({
        category: SETTINGS_CATEGORIES.PAYMENT,
        key,
        value
      }));

      const success = await SettingsService.updateMultiple(updates);

      if (success) {
        setMessage({ type: 'success', text: 'Payment settings saved successfully' });
        fetchSettings();
      } else {
        setMessage({ type: 'error', text: 'Failed to save payment settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving payment settings' });
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
    const mode = settings.find(s => s.key === 'stripe_mode')?.value || 'test';
    setStripeMode(mode);
  };

  const isModified = () => {
    return settings.some(setting => editingSettings[setting.key] !== setting.value);
  };

  if (loading) {
    return <div className="settings-page loading-page">Loading payment settings...</div>;
  }

  return (
    <div className="settings-page payment-page">
      <div className="settings-header">
        <h1>💳 Payment Details</h1>
        <p>Configure payment gateway and transaction settings</p>
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
            <h2>Basic Payment Settings</h2>
            <div className="form-fields two-column">
              <div className="setting-field">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  value={editingSettings['currency'] || ''}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="setting-input"
                >
                  <option value="SEK">SEK (Swedish Krona)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="NOK">NOK (Norwegian Krone)</option>
                  <option value="DKK">DKK (Danish Krone)</option>
                </select>
              </div>

              <div className="setting-field">
                <label htmlFor="stripe_mode">Stripe Mode</label>
                <select
                  id="stripe_mode"
                  value={stripeMode}
                  onChange={(e) => handleInputChange('stripe_mode', e.target.value)}
                  className="setting-input"
                >
                  <option value="test">Test Mode (Sandbox)</option>
                  <option value="live">Live Mode (Production)</option>
                </select>
                {stripeMode === 'live' && (
                  <small className="field-hint warning">⚠️ LIVE MODE - Real transactions enabled</small>
                )}
              </div>

              <div className="setting-field">
                <label htmlFor="minimum_payment_amount">Minimum Payment Amount</label>
                <input
                  id="minimum_payment_amount"
                  type="number"
                  value={editingSettings['minimum_payment_amount'] || ''}
                  onChange={(e) => handleInputChange('minimum_payment_amount', e.target.value)}
                  placeholder="0"
                  step="0.01"
                  className="setting-input"
                />
              </div>

              <div className="setting-field">
                <label htmlFor="tax_id">Tax ID</label>
                <input
                  id="tax_id"
                  type="text"
                  value={editingSettings['tax_id'] || ''}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  placeholder="SE123456789012"
                  className="setting-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Stripe Configuration</h2>
            <div className="mode-badge">
              <span className={stripeMode === 'live' ? 'live' : 'test'}>
                {stripeMode === 'live' ? '🔴 LIVE' : '🟢 TEST'}
              </span>
            </div>
            <div className="form-fields">
              <div className="setting-field full-width">
                <label htmlFor="stripe_public_key">Stripe Publishable Key</label>
                <input
                  id="stripe_public_key"
                  type="text"
                  value={editingSettings['stripe_public_key'] || ''}
                  onChange={(e) => handleInputChange('stripe_public_key', e.target.value)}
                  placeholder="pk_live_••••••••"
                  className="setting-input"
                />
                <small className="field-hint">Public key for frontend</small>
              </div>

              <div className="setting-field full-width">
                <label htmlFor="stripe_secret_key">Stripe Secret Key</label>
                <input
                  id="stripe_secret_key"
                  type="password"
                  value={editingSettings['stripe_secret_key'] || ''}
                  onChange={(e) => handleInputChange('stripe_secret_key', e.target.value)}
                  placeholder="sk_live_••••••••"
                  className="setting-input"
                />
                <small className="field-hint">🔒 Encrypted - Keep this secret</small>
              </div>

              <div className="setting-field full-width">
                <label htmlFor="stripe_webhook_secret">Stripe Webhook Secret</label>
                <input
                  id="stripe_webhook_secret"
                  type="password"
                  value={editingSettings['stripe_webhook_secret'] || ''}
                  onChange={(e) => handleInputChange('stripe_webhook_secret', e.target.value)}
                  placeholder="whsec_••••••••"
                  className="setting-input"
                />
                <small className="field-hint">🔒 Encrypted - For webhook verification</small>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Transaction Fees</h2>
            <div className="form-fields">
              <div className="setting-field">
                <label htmlFor="transaction_fee_percent">Platform Fee (%)</label>
                <input
                  id="transaction_fee_percent"
                  type="number"
                  value={editingSettings['transaction_fee_percent'] || ''}
                  onChange={(e) => handleInputChange('transaction_fee_percent', e.target.value)}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  max="100"
                  className="setting-input"
                />
                <small className="field-hint">Percentage fee applied to each transaction</small>
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

export default PaymentDetailsPage;
