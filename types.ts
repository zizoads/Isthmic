
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Executive' | 'Strategist' | 'Analyst';
  subscriptionTier: 'Free' | 'Pro' | 'Sovereign';
  usageStats: {
    scansThisMonth: number;
    auditsThisMonth: number;
  };
  avatar?: string;
  createdAt: string;
  lastSync?: string;
  isSyncEnabled: boolean;
  googleId?: string;
}

export interface PlatformMonetizationSettings {
  isMonetizationActive: boolean;
  currency: string;
  plans: {
    Free: PlanDetails;
    Pro: PlanDetails;
    Sovereign: PlanDetails;
  };
}

export interface PlanDetails {
  price: number;
  maxScans: number;
  maxAudits: number;
  features: string[];
}

export enum AgentType {
  INTELLIGENCE = 'INTELLIGENCE',
  ACQUISITION = 'ACQUISITION',
  OPERATIONS = 'OPERATIONS',
  LIQUIDATION = 'LIQUIDATION',
  MANAGEMENT = 'MANAGEMENT',
  ADMIN_PANEL = 'ADMIN_PANEL'
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

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'pending' | 'searching' | 'complete';
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
  financials?: any;
  technicalMetrics?: TechnicalMetrics;
  battleCard?: NegotiationBattleCard;
  lastChecked?: string;
  agentThoughts?: AgentThought[];
}

export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  spamScore?: number;
  backlinks?: string | number;
  securityRating?: string;
  isBlacklisted?: boolean;
  whoisPrivacy?: boolean;
  mxRecordsFound?: boolean;
  historyYears?: number;
  dnaForensics?: string;
  trademarkRisk?: string;
  liquidityScore?: number;
}

export interface NegotiationBattleCard {
  buyerMotive: string;
  leveragePoints: string[];
  suggestedCounter: number;
  closingProbability: number;
  sentimentScore: number;
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
  description: string;
  estimatedValue?: string;
  aiDeduction?: string;
  probability?: number;
  marketGapScore?: number;
}

export interface AutonomousAction {
  id: string;
  type: 'PURCHASE' | 'NEGOTIATION' | 'LIQUIDATION' | 'ANALYSIS';
  domainName: string;
  description: string;
  timestamp: string;
  impactScore: number;
  status: 'completed' | 'failed';
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

export interface NodeDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  task: (input: any) => Promise<any>;
}

export interface WorkflowState {
  id: string;
  nameAr: string;
  nameEn: string;
  nodes: WorkflowNode[];
  progress: number;
  isComplete: boolean;
}
