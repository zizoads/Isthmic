
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string; // المخزن محلياً للأغراض السيادية
  googleId?: string;
  role: 'Executive' | 'Strategist' | 'Analyst';
  avatar?: string;
  createdAt: string;
  lastSync?: string;
  isSyncEnabled: boolean;
}

export interface WorkspaceState {
  activeProfileId: string | null;
  profiles: UserProfile[];
}

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
}

export interface NegotiationBattleCard {
  buyerMotive: string;
  buyerType: 'Strategic' | 'Speculator' | 'End-User';
  leveragePoints: string[];
  suggestedCounter: number;
  sentimentScore: number;
  closingProbability: number;
}

export interface TechnicalMetrics {
  da: number;
  pa: number;
  spamScore: number;
  backlinks: number;
  trademarkRisk: string;
  liquidityScore: number;
  securityRating?: string;
  mxRecordsFound?: boolean;
  dnaForensics?: string;
  isBlacklisted?: boolean;
  whoisPrivacy?: boolean;
  historyYears?: number;
  scarcityScore?: number;
  marketDemand?: 'Low' | 'Medium' | 'High' | 'Extreme';
}

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
  workspaceId: string;
  name: string;
  price: number;
  status: 'available' | 'purchased' | 'negotiating' | 'sold' | 'watching' | 'processing';
  contentStatus: 'none' | 'parking' | 'active';
  sector?: string;
  probability?: number;
  justification?: string;
  brandAssets?: any;
  financials?: DomainFinancials;
  technicalMetrics?: TechnicalMetrics;
  battleCard?: NegotiationBattleCard;
  lastChecked?: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  estimatedPortfolioValue: number;
  systemResilienceStatus: 'nominal' | 'degraded';
}

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  riskTolerance: string;
  investmentThesis: string;
  autoPilot: boolean;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  codeSnippet?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  agent: string;
}

export interface ServiceIntegration {
  id: string;
  workspaceId: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected';
  impactArea: string;
}

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

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'searching' | 'pending' | 'complete' | 'executing';
}

export interface SystemState {
  status: 'nominal' | 'degraded';
  lastSync: string;
  activeWorkflows: number;
}

export interface AutonomousAction {
  id: string;
  type: 'PURCHASE' | 'NEGOTIATION' | 'LIQUIDATION' | 'ANALYSIS';
  domainName: string;
  description: string;
  timestamp: string;
  impactScore: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent' | 'failed';
  content: string;
}

export interface NexusOpportunity {
  id: string;
  title: string;
  type: string;
  estimatedValue?: string;
  description: string;
  aiDeduction?: string;
  probability?: number;
  marketGapScore?: number;
}

export interface NodeDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  task: (input: any) => Promise<any>;
}
