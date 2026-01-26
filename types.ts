
export enum AgentType {
  DISCOVERY = 'DISCOVERY',
  EVALUATION = 'EVALUATION',
  PURCHASE = 'PURCHASE',
  MESSAGING = 'MESSAGING',
  NEGOTIATION = 'NEGOTIATION',
  FEEDBACK = 'FEEDBACK',
  MASTER_BRAIN = 'MASTER_BRAIN'
}

export interface TechnicalMetrics {
  da?: number; 
  pa?: number; 
  backlinks?: number;
  isBlacklisted?: boolean;
  mxRecordsFound?: boolean;
  historyYears?: number;
  // Added metrics to support AI evaluation logic
  liquidityScore?: number;
  trademarkRisk?: string;
}

export interface PlatformStrategy {
  minProfitMargin: number;
  maxDomainPrice: number;
  dailyMessageLimit: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  autoEvaluate: boolean;
  autoPilotMode: boolean; // جديد: وضع الطيار الآلي
}

export interface Domain {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'purchased' | 'negotiating' | 'sold' | 'watching' | 'processing';
  contentStatus: 'none' | 'parking' | 'active';
  sector?: string;
  probability?: number;
  estimatedProfit?: number;
  potentialClients?: string[];
  linkedinLeads?: { name: string; role: string; profileUrl: string }[];
  lastChecked?: string;
  justification?: string;
  technicalMetrics?: TechnicalMetrics;
  folder?: 'Quick Flip' | 'Long Term' | 'Premium'; // جديد: تصنيف المحفظة
}

export interface ActivityLog {
  id: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

export interface Notification {
  id: string;
  time: string;
  title: string;
  message: string;
  type: 'opportunity' | 'alert' | 'success';
  read: boolean;
}

export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: 'Formal' | 'Creative' | 'Direct';
  status: 'draft' | 'scheduled' | 'sent' | 'replied';
  sentDate?: string;
  content: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  repliesReceived: number;
  avgProfit: number;
  totalSpent: number;
  estimatedPortfolioValue: number;
}
