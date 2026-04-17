/**
 * Settings Service - Application Settings & Configuration Management
 */

export interface Setting {
  id: number;
  category: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'email' | 'url';
  description: string;
  is_public: boolean;
  updated_at: string;
}

export interface SettingsByCategory {
  [category: string]: {
    [key: string]: string;
  };
}

// In-memory cache for settings
let settingsCache: Setting[] = [];
let groupedCache: SettingsByCategory = {};
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const SettingsService = {
  /**
   * Get all settings
   */
  getAll: async (useCache = true): Promise<Setting[]> => {
    try {
      // Check cache
      if (useCache && settingsCache.length > 0 && Date.now() < cacheExpiry) {
        return settingsCache;
      }

      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/settings-list.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching settings:', data.error);
        return settingsCache; // Return cached version if available
      }
      
      // Update cache
      settingsCache = data.data || [];
      groupedCache = data.grouped || {};
      cacheExpiry = Date.now() + CACHE_DURATION;
      
      return settingsCache;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return settingsCache;
    }
  },

  /**
   * Get settings for a specific category
   */
  getByCategory: async (category: string): Promise<Setting[]> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/settings-list.php?category=${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error(`Error fetching ${category} settings:`, data.error);
        return [];
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching settings:', error);
      return [];
    }
  },

  /**
   * Get a single setting
   */
  get: async (category: string, key: string): Promise<string | null> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(
        `${API_URL}/api/settings-get.php?category=${encodeURIComponent(category)}&key=${encodeURIComponent(key)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching setting:', data.error);
        return null;
      }
      
      return data.data?.value || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      return null;
    }
  },

  /**
   * Update a setting
   */
  update: async (category: string, key: string, value: string | boolean | number): Promise<boolean> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/api/settings-update.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category,
          key,
          value: String(value)
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        console.error('API returned error status:', response.status, response.statusText);
        return false;
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error updating setting:', { category, key, error: data.error });
        return false;
      }
      
      // Invalidate cache
      cacheExpiry = 0;
      
      return true;
    } catch (error) {
      console.error('Error updating setting:', { category, key, error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  },

  /**
   * Update multiple settings at once
   */
  updateMultiple: async (updates: Array<{category: string, key: string, value: string | boolean | number}>): Promise<boolean> => {
    try {
      console.log('Updating multiple settings:', updates);
      const results = await Promise.all(
        updates.map(({ category, key, value }) => SettingsService.update(category, key, value))
      );
      const success = results.every(result => result === true);
      if (!success) {
        console.error('Some settings failed to update:', { updates, results });
      }
      return success;
    } catch (error) {
      console.error('Error updating multiple settings:', error);
      return false;
    }
  },

  /**
   * Get grouped settings (by category)
   */
  getGrouped: async (useCache = true): Promise<SettingsByCategory> => {
    try {
      // Check cache
      if (useCache && Object.keys(groupedCache).length > 0 && Date.now() < cacheExpiry) {
        return groupedCache;
      }

      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/settings-list.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Error fetching settings:', data.error);
        return groupedCache;
      }
      
      // Update cache
      groupedCache = data.grouped || {};
      cacheExpiry = Date.now() + CACHE_DURATION;
      
      return groupedCache;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return groupedCache;
    }
  },

  /**
   * Clear settings cache
   */
  clearCache: () => {
    settingsCache = [];
    groupedCache = {};
    cacheExpiry = 0;
  }
};

// Settings categories
export const SETTINGS_CATEGORIES = {
  COMPANY: 'Company',
  EMAIL: 'Email',
  PAYMENT: 'Payment',
  INTEGRATION: 'Integration',
  NOTIFICATION: 'Notification',
  SYSTEM: 'System',
  SECURITY: 'Security'
} as const;

// Common settings keys for easy access
export const SETTINGS_KEYS = {
  // Company
  COMPANY_NAME: 'name',
  COMPANY_EMAIL: 'email',
  COMPANY_PHONE: 'phone',
  COMPANY_WEBSITE: 'website',
  COMPANY_VAT: 'vat_number',
  COMPANY_LOGO: 'logo_url',

  // Email
  EMAIL_FROM: 'from_email',
  EMAIL_FROM_NAME: 'from_name',
  EMAIL_REPLY_TO: 'reply_to_email',
  EMAIL_SERVICE: 'service_provider',
  EMAIL_SENDGRID_KEY: 'sendgrid_api_key',
  EMAIL_SMTP_HOST: 'smtp_host',

  // Payment
  PAYMENT_CURRENCY: 'currency',
  PAYMENT_STRIPE_PUBLIC: 'stripe_public_key',
  PAYMENT_STRIPE_SECRET: 'stripe_secret_key',
  PAYMENT_STRIPE_MODE: 'stripe_mode',

  // Integrations
  INTEGRATION_FORTNOX_ENABLED: 'fortnox_enabled',
  INTEGRATION_FORTNOX_CLIENT_ID: 'fortnox_client_id',

  // Notifications
  NOTIFICATION_BOOKING_ENABLED: 'booking_confirmation_enabled',
  NOTIFICATION_BOOKING_REMINDER_DAYS: 'booking_reminder_days',

  // System
  SYSTEM_TIMEZONE: 'timezone',
  SYSTEM_LANGUAGE: 'language',
  SYSTEM_MAINTENANCE: 'maintenance_mode',

  // Security
  SECURITY_SESSION_TIMEOUT: 'session_timeout',
  SECURITY_MFA_ENABLED: 'mfa_enabled'
} as const;
