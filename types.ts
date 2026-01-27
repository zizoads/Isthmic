
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

export type SystemStatus = 'nominal' | 'degraded' | 'autonomous_recovery' | 'maintenance';

export interface SystemState {
  status: SystemStatus;
  lastSync: string;
  activeWorkflows: number;
}

export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed' | 'retrying';

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
  agentThoughts?: AgentThought[]; // سجل الحوار بين الوكلاء
  technicalMetrics?: TechnicalMetrics;
  folder?: 'Quick Flip' | 'Long Term' | 'Premium';
  brandAssets?: BrandAssets;
}

export interface BrandAssets {
  logoUrl?: string;
  primaryColor?: string;
  tagline?: string;
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
  systemResilienceStatus: SystemStatus;
}

export interface PlatformStrategy {
  totalBudget: number;
  maxPricePerDomain: number;
  targetTLDs: string[];
  minLiquidityScore: number;
  targetROI: number;
  minHoldingPeriod: number;
  riskTolerance: string;
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
