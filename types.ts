
export enum AgentType {
  DISCOVERY = 'DISCOVERY',
  EVALUATION = 'EVALUATION',
  PURCHASE = 'PURCHASE',
  MESSAGING = 'MESSAGING',
  NEGOTIATION = 'NEGOTIATION',
  FEEDBACK = 'FEEDBACK',
  MASTER_BRAIN = 'MASTER_BRAIN'
}

export interface AgentWorkflowState {
  currentStep: string;
  history: string[];
  contextData: Record<string, any>;
  lastEvent?: string;
}

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'complete' | 'searching' | 'analyzing' | 'failed';
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
  thinkingSteps?: ThinkingStep[];
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
  technicalMetrics?: TechnicalMetrics;
  folder?: 'Quick Flip' | 'Long Term' | 'Premium';
  workflow?: AgentWorkflowState; // إضافة سياق المهمة المستمر
}

export interface ActivityLog {
  id: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical' | 'ai_thought';
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
  unrealizedGains?: number;
}

/**
 * Interface for platform-wide investment strategy settings
 */
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
}

/**
 * Interface for tracking outreach communication with potential buyers
 */
export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent' | 'received' | 'failed';
  content: string;
}
