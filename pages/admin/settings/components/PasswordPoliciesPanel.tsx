import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import { PasswordPolicy } from '../types/userManagementTypes';

const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expirationDays: 90,
};

export const PasswordPoliciesPanel: React.FC = () => {
  const [policy, setPolicy] = useState<PasswordPolicy>(DEFAULT_POLICY);
  const [isExpanded, setIsExpanded] = useState(true);

  const getPasswordStrength = (requirements: PasswordPolicy) => {
    let strength = 0;
    if (requirements.minLength >= 12) strength += 20;
    if (requirements.minLength >= 16) strength += 10;
    if (requirements.requireUppercase) strength += 20;
    if (requirements.requireLowercase) strength += 20;
    if (requirements.requireNumbers) strength += 20;
    if (requirements.requireSpecialChars) strength += 20;
    return Math.min(strength, 100);
  };

  const strengthScore = getPasswordStrength(policy);
  const strengthLabel =
    strengthScore < 40
      ? 'Weak'
      : strengthScore < 70
        ? 'Moderate'
        : strengthScore < 90
          ? 'Strong'
          : 'Very Strong';
  const strengthColor =
    strengthScore < 40
      ? 'text-red-600 bg-red-50'
      : strengthScore < 70
        ? 'text-yellow-600 bg-yellow-50'
        : strengthScore < 90
          ? 'text-green-600 bg-green-50'
          : 'text-green-700 bg-green-50';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition"
      >
        <h2 className="text-lg font-bold text-gray-900">Password Policies</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <>
          <div className="border-t border-gray-100 p-6 space-y-6">
            {/* Strength Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  Overall Policy Strength
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${strengthColor}`}>
                  {strengthLabel}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    strengthScore < 40
                      ? 'bg-red-500'
                      : strengthScore < 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${strengthScore}%` }}
                />
              </div>
            </div>

            {/* Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Minimum Length */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Minimum Length
                  </span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="8"
                    max="20"
                    value={policy.minLength}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        minLength: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">8 characters</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {policy.minLength} characters
                    </span>
                    <span className="text-xs text-gray-600">20 characters</span>
                  </div>
                </div>
              </div>

              {/* Expiration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Password Expiration
                  </span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="365"
                    step="30"
                    value={policy.expirationDays}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        expirationDays: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Never</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {policy.expirationDays === 0
                        ? 'No expiration'
                        : `${policy.expirationDays} days`}
                    </span>
                    <span className="text-xs text-gray-600">1 year</span>
                  </div>
                </div>
              </div>

              {/* Character Requirements */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Uppercase Letters
                  </span>
                  {policy.requireUppercase && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireUppercase}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        requireUppercase: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-green-600"
                  />
                  <span className="text-sm text-gray-600">
                    Require at least one uppercase letter (A-Z)
                  </span>
                </label>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Lowercase Letters
                  </span>
                  {policy.requireLowercase && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireLowercase}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        requireLowercase: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-green-600"
                  />
                  <span className="text-sm text-gray-600">
                    Require at least one lowercase letter (a-z)
                  </span>
                </label>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Numbers
                  </span>
                  {policy.requireNumbers && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireNumbers}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        requireNumbers: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-green-600"
                  />
                  <span className="text-sm text-gray-600">
                    Require at least one number (0-9)
                  </span>
                </label>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Special Characters
                  </span>
                  {policy.requireSpecialChars && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={policy.requireSpecialChars}
                    onChange={(e) =>
                      setPolicy({
                        ...policy,
                        requireSpecialChars: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-green-600"
                  />
                  <span className="text-sm text-gray-600">
                    Require special characters (!@#$%^&*)
                  </span>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Password Policy Information
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                  <li>These policies apply to all new and reset passwords</li>
                  <li>Existing passwords will prompt reset on next login</li>
                  <li>Consider security vs. usability trade-offs</li>
                  <li>Recommend NIST guidelines: 12+ characters, no complexity rules</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                Reset to Default
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Save Policies
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
