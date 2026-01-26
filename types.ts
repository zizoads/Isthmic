
export enum AgentType {
  DISCOVERY = 'DISCOVERY',
  EVALUATION = 'EVALUATION',
  PURCHASE = 'PURCHASE',
  MESSAGING = 'MESSAGING',
  NEGOTIATION = 'NEGOTIATION',
  FEEDBACK = 'FEEDBACK',
  MASTER_BRAIN = 'MASTER_BRAIN',
  NEXUS_PRIME = 'NEXUS_PRIME'
}

export interface ServiceIntegration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'simulated' | 'recovering';
  apiKey?: string;
  provider: string;
  impactArea: string;
  lastError?: string;
}

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'complete' | 'searching' | 'pending' | 'failed_recovery';
}

export interface NexusOpportunity {
  id: string;
  title: string;
  type: 'Arbitrage' | 'Temporal' | 'Forensic' | 'Strategic';
  description: string;
  estimatedValue: string;
  probability: number;
  aiDeduction: string;
  suggestedAction: string;
}

export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent';
  content: string;
}

export interface Domain {
  id: string;
  name: string;
  price: number;
  acquisitionCost?: number;
  acquisitionDate?: string;
  status: 'available' | 'purchased' | 'negotiating' | 'sold' | 'watching' | 'processing';
  contentStatus: 'none' | 'parking' | 'active';
  sector?: string;
  probability?: number;
  estimatedProfit?: number;
  potentialClients?: string[];
  lastChecked?: string;
  justification?: string;
  thinkingPath?: string;
  isSimulatedData?: boolean;
  technicalMetrics?: TechnicalMetrics;
  folder?: 'Quick Flip' | 'Long Term' | 'Premium';
  workflow?: any;
}

export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  backlinks?: number;
  isBlacklisted?: boolean;
  mxRecordsFound?: boolean;
  historyYears?: number;
  liquidityScore?: number;
  trademarkRisk?: string;
  sourceCitations?: string[];
  comparableSales?: {domain: string, price: number, date: string}[];
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
  dataIntegrity?: number; 
  systemResilienceStatus: 'nominal' | 'degraded' | 'autonomous_recovery';
}

export interface PlatformStrategy {
  totalBudget: number;
  maxPricePerDomain: number;
  targetTLDs: string[];
  minLiquidityScore: number;
  targetROI: number;
  minHoldingPeriod: number;
  riskTolerance: string;
  autoEvaluate: boolean;
  autoPilotMode: boolean;
  investmentThesis: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical' | 'ai_thought';
}
