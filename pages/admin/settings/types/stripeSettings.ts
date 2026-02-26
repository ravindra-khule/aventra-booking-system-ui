// Stripe Settings Types and Interfaces

export type StripeAccountType = 'test' | 'live';
export type StripeWebhookEvent = 
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'charge.refunded'
  | 'invoice.created'
  | 'invoice.finalized'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

export interface StripePublishableKey {
  mode: StripeAccountType;
  key: string;
  lastUpdated: string;
  isValid: boolean;
}

export interface StripeSecretKeyInfo {
  mode: StripeAccountType;
  keyPrefix: string; // Only show first 8 characters for security
  lastUpdated: string;
  isValid: boolean;
}

export interface StripeWebhookEndpoint {
  endpointId: string;
  url: string;
  events: StripeWebhookEvent[];
  isActive: boolean;
  version: string;
  createdAt: string;
}

export interface StripeCurrency {
  code: string;
  name: string;
  symbol: string;
  enabled: boolean;
}

export interface StripeSettings {
  accountId: string;
  businessName: string;
  
  // Keys
  testPublishableKey: string;
  testSecretKey?: string; // Only visible when editing, hidden after save
  livePublishableKey: string;
  liveSecretKey?: string; // Only visible when editing, hidden after save
  
  // Account Settings
  accountType: StripeAccountType;
  
  // Webhook
  webhookEndpoint: StripeWebhookEndpoint | null;
  webhookSecret?: string; // Only shown once when created
  
  // Payment Settings
  currencies: StripeCurrency[];
  defaultCurrency: string;
  
  // Security
  isEnabled: boolean;
  lastUpdated: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  connectionError?: string;
}

export interface StripeSettingsState {
  settings: StripeSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface StripeTestResult {
  success: boolean;
  message: string;
  timestamp: string;
  mode: StripeAccountType;
}
