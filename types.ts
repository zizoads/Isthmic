

export enum AgentType {
  INTELLIGENCE = 'INTELLIGENCE',
  ACQUISITION = 'ACQUISITION',
  OPERATIONS = 'OPERATIONS',
  LIQUIDATION = 'LIQUIDATION',
  MANAGEMENT = 'MANAGEMENT'
}

export enum AgentRole {
  ANALYZER = 'ANALYZER',
  EXECUTOR = 'EXECUTOR',
  AUDITOR = 'AUDITOR',
  STRATEGIST = 'STRATEGIST',
  LIQUIDATOR = 'LIQUIDATOR'
}

export interface AgentThought {
  role: AgentRole;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved' | 'rejected' | 'action_taken';
  metadata?: any;
}

export interface NegotiationBattleCard {
  buyerMotive: string;
  buyerType: 'Strategic' | 'Speculator' | 'End-User';
  leveragePoints: string[];
  suggestedCounter: number;
  sentimentScore: number; // 0-100
  closingProbability: number;
}

export interface AutonomousAction {
  id: string;
  type: 'PURCHASE' | 'BRANDING' | 'MARKETING' | 'NEGOTIATION' | 'PRICE_SYNC' | 'CLOSE_DEAL';
  domainName: string;
  description: string;
  timestamp: string;
  impactScore: number; // 1-100
  status: 'completed' | 'pending' | 'failed';
}

// Added TechnicalMetrics interface to resolve compilation errors
export interface TechnicalMetrics {
  da: number;
  pa: number;
  spamScore: number;
  backlinks: number;
  backlinkVelocity: number;
  historyYears: number;
  isBlacklisted: boolean;
  trademarkRisk: string;
  liquidityScore: number;
  securityRating?: string;
  whoisPrivacy?: boolean;
  mxRecordsFound?: boolean;
  dnaForensics?: string;
}

// Added DomainFinancials interface to resolve compilation errors
export interface DomainFinancials {
  acquisitionCost: number;
  holdingCostPerYear: number;
  targetExitPrice: number;
  projectedROI: number;
  netProfit: number;
  platformFees: number;
  escrowFees: number;
  liquidityScore: number;
  alphaScore: number;
}

export interface Domain {
  id: string;
  name: string;
  price: number;
  status: 'available' | 'purchased' | 'negotiating' | 'sold' | 'watching' | 'processing';
  contentStatus: 'none' | 'parking' | 'active';
  sector?: string;
  probability?: number;
  justification?: string;
  agentThoughts?: AgentThought[];
  brandAssets?: any;
  financials?: DomainFinancials; // Added financials property
  technicalMetrics?: TechnicalMetrics; // Added technicalMetrics property
  battleCard?: NegotiationBattleCard;
  folder?: string; // Added folder property used in PurchaseDashboard
  lastChecked?: string; // Added lastChecked property used in DiscoveryDashboard
}

// Added NexusOpportunity interface to resolve compilation errors in geminiService.ts and NexusPrimeDashboard.tsx
export interface NexusOpportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  estimatedValue: string;
  probability: number;
  marketGapScore: number;
  aiDeduction: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  estimatedPortfolioValue: number;
  systemResilienceStatus: 'nominal' | 'degraded';
  totalSpent?: number;
  repliesReceived?: number;
}

export interface PlatformStrategy {
  totalBudget: number;
  riskTolerance: string;
  investmentThesis: string;
  autoPilot: boolean;
  autoPilotMode?: boolean;
  maxPricePerDomain?: number;
  targetTLDs?: string[];
  minLiquidityScore?: number;
  targetROI?: number;
  minHoldingPeriod?: number;
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
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  agent: string;
}

export interface ServiceIntegration {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected';
  impactArea: string;
}

// Added NodeStatus type to resolve compilation error in orchestrator.ts
export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface WorkflowNode {
  id: string;
  labelAr: string;
  labelEn: string;
  status: NodeStatus; // Updated to use NodeStatus type
  output?: any;
}

export interface WorkflowState {
  id: string;
  nameAr: string;
  nameEn: string;
  nodes: WorkflowNode[];
  progress: number;
  isComplete: boolean;
}

// Added SystemState interface to resolve compilation error in DomainContext.tsx
export interface SystemState {
  status: 'nominal' | 'degraded';
  lastSync: string;
  activeWorkflows: number;
}

// Added ThinkingStep interface to resolve compilation error in EvaluationDashboard.tsx
export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'searching' | 'pending' | 'complete' | 'executing';
}

// Added OutreachMessage interface to resolve compilation error in MessagingDashboard.tsx
export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent' | 'replied';
  content: string;
}
