
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
  AUDITOR = 'AUDITOR'
}

export interface AgentThought {
  role: AgentRole;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved' | 'rejected';
}

// Added missing BrandAssets interface
export interface BrandAssets {
  primaryColor?: string;
  tagline?: string;
  logoUrl?: string;
  promoVideoUrl?: string;
}

// Added missing properties to TechnicalMetrics
export interface TechnicalMetrics {
  da: number;
  pa: number;
  spamScore: number;
  backlinks: number;
  backlinkVelocity: number;
  historyYears: number;
  isBlacklisted: boolean;
  trademarkRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  sourceCitations?: string[];
  securityRating?: string;
  whoisPrivacy?: boolean;
  mxRecordsFound?: boolean;
  dnaForensics?: string;
  liquidityScore?: number;
}

export interface DomainFinancials {
  acquisitionCost: number;
  holdingCostPerYear: number;
  targetExitPrice: number;
  projectedROI: number;
  netProfit: number;
  platformFees: number;
  escrowFees: number;
  liquidityScore: number; // 0-100
  alphaScore: number; // 0-100 (Integrated Opportunity Score)
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
  technicalMetrics?: TechnicalMetrics;
  brandAssets?: BrandAssets;
  financials?: DomainFinancials;
  lastChecked?: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  totalSpent: number;
  estimatedPortfolioValue: number;
  systemResilienceStatus: 'nominal' | 'degraded';
}

export interface PlatformStrategy {
  totalBudget: number;
  riskTolerance: string;
  investmentThesis: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical' | 'ai_thought';
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
  status: 'simulated' | 'connected';
  impactArea: string;
}

// Added NexusOpportunity interface
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

// Added ThinkingStep interface
export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'searching' | 'pending' | 'complete';
}

// Added OutreachMessage interface
export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent';
  content: string;
}

// Added SystemState interface
export interface SystemState {
  status: 'nominal' | 'degraded';
  lastSync: string;
  activeWorkflows: number;
}

// Added Workflow related types
export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface WorkflowNode {
  id: string;
  labelAr: string;
  labelEn: string;
  status: NodeStatus;
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
