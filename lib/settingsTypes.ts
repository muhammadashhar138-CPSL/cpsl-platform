export interface Notifications {
  emailAlerts: boolean;
  smsAlerts: boolean;
  incidentNotifications: boolean;
}

export interface Integration {
  configured: boolean;
  apiKey?: string;
  webhook?: string;
  lastSync?: string;
}

export interface Integrations {
  slack?: Integration;
  teams?: Integration;
  webhooks?: Integration;
  [key: string]: Integration | undefined;
}

export interface Settings {
  siteName: string;
  siteType: string;
  contactEmail: string;
  subscriptionLevel: 'free' | 'pro' | 'enterprise';
  notifications: Notifications;
  dataRetention: number; // days
  twoFactorEnabled: boolean;
  integrations: Integrations;
  userId?: string;
  updatedAt?: string;
}
