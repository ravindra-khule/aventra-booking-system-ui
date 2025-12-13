// Email Settings Types and Interfaces

export type EmailProvider = 'SMTP' | 'SendGrid';
export type EncryptionType = 'None' | 'SSL' | 'TLS';
export type BounceHandlingMethod = 'automatic' | 'manual' | 'webhook';
export type EmailLogStatus = 'sent' | 'failed' | 'bounced' | 'unsubscribed' | 'pending';

export interface SMTPConfig {
  host: string;
  port: number;
  encryption: EncryptionType;
  useAuthentication: boolean;
  username: string;
  password: string;
}

export interface SendGridConfig {
  apiKey: string;
  sandboxMode: boolean;
}

export interface EmailProviderSettings {
  provider: EmailProvider;
  smtp?: SMTPConfig;
  sendGrid?: SendGridConfig;
}

export interface SenderDetails {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
}

export interface EmailSignature {
  enabled: boolean;
  content: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendingLimits {
  maxPerHour: number;
  maxPerDay: number;
  throttlingEnabled: boolean;
}

export interface BounceUnsubscribeSettings {
  bounceHandling: {
    method: BounceHandlingMethod;
    notifyOnBounce: boolean;
  };
  unsubscribe: {
    enabled: boolean;
    customUrl: string;
  };
}

export interface EmailLog {
  id: string;
  email: string;
  subject: string;
  status: EmailLogStatus;
  sentTime: string;
  provider: EmailProvider;
  errorMessage?: string;
}

export interface EmailSettingsState {
  provider: EmailProviderSettings;
  sender: SenderDetails;
  signature: EmailSignature;
  templates: EmailTemplate[];
  sendingLimits: SendingLimits;
  bounceUnsubscribe: BounceUnsubscribeSettings;
  logs: EmailLog[];
}
