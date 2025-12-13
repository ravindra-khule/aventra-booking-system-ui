import React, { useState } from 'react';

export const TestEmail: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendTest = async () => {
    if (!isValidEmail(testEmail)) {
      setSendStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    setSendStatus('idle');
    setErrorMessage('');

    // Simulate sending test email
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setSendStatus('success');
        setTestEmail('');
      } else {
        setSendStatus('error');
        setErrorMessage('Failed to send test email. Please check your configuration and try again.');
      }
      setIsSending(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSending && isValidEmail(testEmail)) {
      handleSendTest();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Email Configuration</h3>

      <div className="max-w-md space-y-4">
        <p className="text-sm text-gray-600">
          Send a test email to verify your configuration is working correctly.
        </p>

        {/* Input */}
        <div>
          <label htmlFor="test-email" className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address *
          </label>
          <input
            id="test-email"
            type="email"
            placeholder="your@email.com"
            value={testEmail}
            onChange={(e) => {
              setTestEmail(e.target.value);
              setSendStatus('idle');
              setErrorMessage('');
            }}
            onKeyPress={handleKeyPress}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              testEmail && !isValidEmail(testEmail)
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {testEmail && !isValidEmail(testEmail) && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendTest}
          disabled={isSending || !testEmail || !isValidEmail(testEmail)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Sending...
            </span>
          ) : (
            'Send Test Email'
          )}
        </button>

        {/* Success Message */}
        {sendStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <span className="font-semibold">✓ Success!</span> Test email sent successfully. Check your inbox.
            </p>
          </div>
        )}

        {/* Error Message */}
        {sendStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">✗ Error:</span> {errorMessage}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> The test email will use your current configuration settings including sender details, signature, and provider credentials.
          </p>
        </div>
      </div>
    </div>
  );
};
