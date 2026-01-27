
export enum AgentType {
  INTELLIGENCE = 'INTELLIGENCE',
  ACQUISITION = 'ACQUISITION',
  OPERATIONS = 'OPERATIONS',
  LIQUIDATION = 'LIQUIDATION',
  MANAGEMENT = 'MANAGEMENT'
}

export interface NexusOpportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  estimatedValue: string;
  probability: number;
  aiDeduction: string;
  suggestedAction: string;
  temporalSignal?: 'Rising' | 'Explosive' | 'Stable';
  marketGapScore?: number;
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
  brandAssets?: {
    logoUrl?: string;
    primaryColor?: string;
    tagline?: string;
  };
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
  dnaForensics?: string;
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

export interface ServiceIntegration {
  id: string;
  name: string;
  provider: string;
  status: 'simulated' | 'connected';
  impactArea: string;
}

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'pending' | 'searching' | 'complete';
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

export interface EvaluationResult {
  sector: string;
  probability: number;
  justification: string;
  valuationContext: string;
  technicalMetrics?: Partial<TechnicalMetrics>;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  agent: string;
}
