import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, X, Eye, EyeOff, Copy, Check } from 'lucide-react';
import {
  StripeSettings,
  StripeAccountType,
  StripeCurrency,
} from './types/stripeSettings';

type TabType = 'keys' | 'account' | 'webhook' | 'currency' | 'status';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'keys', label: 'API Keys', icon: '🔑' },
  { id: 'account', label: 'Account Setup', icon: '⚙️' },
  { id: 'webhook', label: 'Webhooks', icon: '🔔' },
  { id: 'currency', label: 'Currencies', icon: '💱' },
  { id: 'status', label: 'Connection Status', icon: '✅' },
];

const defaultCurrencies: StripeCurrency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', enabled: true },
  { code: 'EUR', name: 'Euro', symbol: '€', enabled: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', enabled: false },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', enabled: true },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', enabled: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', enabled: false },
];

export const StripePaymentSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('keys');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  // Initialize with default data
  const [settings, setSettings] = useState<StripeSettings>({
    accountId: 'acct_1T0dUqFX16jtkrR8',
    businessName: 'Swett Adventures',

    // API Keys - from .env
    testPublishableKey: 'pk_test_51T0dUqFX16jtkrR85dAqv7NjlWqNvh2OSz6g71W7I5HU1Aya8XY0OpWaIAzp3EUi8ej5Qi3nFesDZe19q1yCiSWW006r1pKEp3',
    testSecretKey: '',
    livePublishableKey: '',
    liveSecretKey: '',

    accountType: 'test',

    webhookEndpoint: null,
    webhookSecret: '',

    currencies: defaultCurrencies,
    defaultCurrency: 'USD',

    isEnabled: true,
    lastUpdated: new Date().toISOString(),
    connectionStatus: 'connected',
    connectionError: undefined,
  });

  const handleKeyChange = (
    field: 'testPublishableKey' | 'testSecretKey' | 'livePublishableKey' | 'liveSecretKey',
    value: string
  ) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleToggleSecret = (field: string) => {
    setShowSecrets({
      ...showSecrets,
      [field]: !showSecrets[field],
    });
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus({ ...copyStatus, [field]: true });
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [field]: false });
    }, 2000);
  };

  const handleCurrencyToggle = (code: string) => {
    setSettings({
      ...settings,
      currencies: settings.currencies.map((curr) =>
        curr.code === code ? { ...curr, enabled: !curr.enabled } : curr
      ),
    });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate required fields
      const errors = [];
      if (!settings.testPublishableKey.trim()) errors.push('Test Publishable Key is required');
      if (!settings.businessName.trim()) errors.push('Business Name is required');

      if (errors.length > 0) {
        setSaveStatus('error');
        setSaveMessage(`Please fix: ${errors.join(', ')}`);
        return;
      }

      setSaveStatus('success');
      setSaveMessage('Stripe settings saved successfully!');

      // Log data to console (simulating API call)
      console.log('Stripe Settings:', {
        ...settings,
        testSecretKey: undefined,
        liveSecretKey: undefined,
      });

      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('Failed to save. Please try again.');
    }
  };

  const handleTestConnection = async () => {
    setSaveStatus('saving');
    setSaveMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate testing the connection
      const isValid = settings.testPublishableKey.startsWith('pk_');

      if (isValid) {
        setSaveStatus('success');
        setSaveMessage('✓ Stripe connection test successful!');
        setSettings({
          ...settings,
          connectionStatus: 'connected',
          connectionError: undefined,
        });
      } else {
        setSaveStatus('error');
        setSaveMessage('✗ Invalid Stripe keys. Please check your configuration.');
        setSettings({
          ...settings,
          connectionStatus: 'error',
          connectionError: 'Invalid key format',
        });
      }

      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('Connection test failed. Please try again.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      setSettings({
        accountId: 'acct_1T0dUqFX16jtkrR8',
        businessName: 'Swett Adventures',
        testPublishableKey: 'pk_test_51T0dUqFX16jtkrR85dAqv7NjlWqNvh2OSz6g71W7I5HU1Aya8XY0OpWaIAzp3EUi8ej5Qi3nFesDZe19q1yCiSWW006r1pKEp3',
        testSecretKey: '',
        livePublishableKey: '',
        liveSecretKey: '',
        accountType: 'test',
        webhookEndpoint: null,
        webhookSecret: '',
        currencies: defaultCurrencies,
        defaultCurrency: 'USD',
        isEnabled: true,
        lastUpdated: new Date().toISOString(),
        connectionStatus: 'connected',
        connectionError: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stripe Payment Details</h1>
              <p className="text-gray-600 mt-1">
                Configure and manage your Stripe API keys and payment settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {saveStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            saveStatus === 'success' ? 'bg-green-50 border border-green-200' : 
            saveStatus === 'error' ? 'bg-red-50 border border-red-200' : 
            'bg-blue-50 border border-blue-200'
          }`}>
            {saveStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />}
            {saveStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />}
            {saveStatus === 'saving' && <div className="h-5 w-5 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin mt-0.5 flex-shrink-0" />}
            
            <div>
              <p className={`font-medium ${
                saveStatus === 'success' ? 'text-green-900' : 
                saveStatus === 'error' ? 'text-red-900' : 
                'text-blue-900'
              }`}>
                {saveStatus === 'saving' ? 'Saving...' : saveMessage}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* API Keys Tab */}
            {activeTab === 'keys' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Keep your Secret Keys secure. Never share them or commit them to version control. 
                    For security, secret keys are only displayed once when created.
                  </p>
                </div>

                {/* Business Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your business name"
                  />
                </div>

                {/* Account Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className="flex gap-4">
                    {(['test', 'live'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="accountType"
                          value={type}
                          checked={settings.accountType === type}
                          onChange={(e) => setSettings({ ...settings, accountType: e.target.value as StripeAccountType })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{type} Mode</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Test Keys Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Mode Keys</h3>
                  
                  {/* Test Publishable Key */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Publishable Key</label>
                    <div className="relative">
                      <input
                        type={showSecrets['testPublishable'] ? 'text' : 'password'}
                        value={settings.testPublishableKey}
                        onChange={(e) => handleKeyChange('testPublishableKey', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                        placeholder="pk_test_..."
                      />
                      <button
                        onClick={() => handleToggleSecret('testPublishable')}
                        className="absolute right-12 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['testPublishable'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(settings.testPublishableKey, 'testPublishable')}
                        className="absolute right-2.5 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                      >
                        {copyStatus['testPublishable'] ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Test Secret Key */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Secret Key</label>
                    <div className="relative">
                      <input
                        type={showSecrets['testSecret'] ? 'text' : 'password'}
                        value={settings.testSecretKey}
                        onChange={(e) => handleKeyChange('testSecretKey', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                        placeholder="sk_test_... (keep empty if not needed)"
                      />
                      <button
                        onClick={() => handleToggleSecret('testSecret')}
                        className="absolute right-12 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['testSecret'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(settings.testSecretKey || '', 'testSecret')}
                        className="absolute right-2.5 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                        disabled={!settings.testSecretKey}
                      >
                        {copyStatus['testSecret'] ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Keys Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Mode Keys</h3>
                  <p className="text-sm text-gray-600 mb-4">Only enable live keys when you're ready to process real payments.</p>
                  
                  {/* Live Publishable Key */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live Publishable Key</label>
                    <div className="relative">
                      <input
                        type={showSecrets['livePublishable'] ? 'text' : 'password'}
                        value={settings.livePublishableKey}
                        onChange={(e) => handleKeyChange('livePublishableKey', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                        placeholder="pk_live_... (optional)"
                      />
                      <button
                        onClick={() => handleToggleSecret('livePublishable')}
                        className="absolute right-12 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['livePublishable'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(settings.livePublishableKey, 'livePublishable')}
                        className="absolute right-2.5 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                        disabled={!settings.livePublishableKey}
                      >
                        {copyStatus['livePublishable'] ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Live Secret Key */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Live Secret Key</label>
                    <div className="relative">
                      <input
                        type={showSecrets['liveSecret'] ? 'text' : 'password'}
                        value={settings.liveSecretKey}
                        onChange={(e) => handleKeyChange('liveSecretKey', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                        placeholder="sk_live_... (optional)"
                      />
                      <button
                        onClick={() => handleToggleSecret('liveSecret')}
                        className="absolute right-12 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets['liveSecret'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(settings.liveSecretKey || '', 'liveSecret')}
                        className="absolute right-2.5 top-2.5 p-1.5 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                        disabled={!settings.liveSecretKey}
                      >
                        {copyStatus['liveSecret'] ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Setup Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    These are your Stripe account details. They are read-only and controlled through your Stripe dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                      {settings.accountId}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Mode</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
                        settings.accountType === 'test' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {settings.accountType === 'test' ? 'TEST MODE' : 'LIVE MODE'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {defaultCurrencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.name} ({curr.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
                        settings.isEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {settings.isEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.isEnabled}
                      onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Stripe Payments</span>
                  </label>
                </div>
              </div>
            )}

            {/* Webhook Tab */}
            {activeTab === 'webhook' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Webhooks allow Stripe to send real-time notifications to your system about payment events.
                  </p>
                </div>

                {settings.webhookEndpoint ? (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Endpoint</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint URL</label>
                        <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono text-sm">
                          {settings.webhookEndpoint.url}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Events Subscribed</label>
                        <div className="flex flex-wrap gap-2">
                          {settings.webhookEndpoint.events.map((event) => (
                            <span key={event} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
                              settings.webhookEndpoint.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {settings.webhookEndpoint.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                          <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                            {new Date(settings.webhookEndpoint.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">No webhook endpoint configured yet.</p>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                      Create Webhook Endpoint
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Currency Tab */}
            {activeTab === 'currency' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Enable the currencies your business accepts. The default currency will be used for all transactions unless specified otherwise.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.currencies.map((currency) => (
                    <label
                      key={currency.code}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={currency.enabled}
                        onChange={() => handleCurrencyToggle(currency.code)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{currency.code}</p>
                        <p className="text-sm text-gray-600">{currency.name}</p>
                      </div>
                      <span className="text-lg">{currency.symbol}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Status Tab */}
            {activeTab === 'status' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border-2 ${
                  settings.connectionStatus === 'connected'
                    ? 'bg-green-50 border-green-200'
                    : settings.connectionStatus === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {settings.connectionStatus === 'connected' && (
                      <>
                        <div className="w-4 h-4 rounded-full bg-green-600"></div>
                        <span className="text-lg font-semibold text-green-900">Connected to Stripe</span>
                      </>
                    )}
                    {settings.connectionStatus === 'disconnected' && (
                      <>
                        <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                        <span className="text-lg font-semibold text-gray-900">Not Connected</span>
                      </>
                    )}
                    {settings.connectionStatus === 'error' && (
                      <>
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        <span className="text-lg font-semibold text-red-900">Connection Error</span>
                      </>
                    )}
                  </div>

                  {settings.connectionError && (
                    <p className={`text-sm ${
                      settings.connectionStatus === 'error' 
                        ? 'text-red-700' 
                        : 'text-gray-700'
                    }`}>
                      {settings.connectionError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {new Date(settings.lastUpdated).toLocaleString()}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Mode</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                      {settings.accountType} Mode
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={saveStatus === 'saving'}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
                >
                  Test Stripe Connection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 disabled:bg-gray-400"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
