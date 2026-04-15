
export interface SavedDomain {
  name: string;
  trend: string;
  vibe: string;
  savedAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'User';
  avatar?: string;
  createdAt: string;
  apiKeys?: ApiKeys;
  savedDomains?: SavedDomain[];
}

export type ToolType = 'DOMAIN_CHECK' | 'WHOIS' | 'ANALYTICS' | 'OTHER';

export interface ToolDefinition {
  id: string;
  name: string;
  type: ToolType;
  apiKey: string;
  status: 'active' | 'invalid' | 'verifying';
  lastVerified?: string;
}

export interface ApiKeys {
  gemini?: string;
  domainAvailability?: string;
  whois?: string;
  customTools?: ToolDefinition[];
}
