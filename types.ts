

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  role: 'Executive' | 'Strategist' | 'Analyst';
  avatar?: string;
  createdAt: string;
  lastSync?: string;
  isSyncEnabled: boolean;
  // Added googleId for social auth support
  googleId?: string;
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

// Added ThinkingStep for Evaluation UI
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

// Added TechnicalMetrics for Forensic scanning
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

// Added NegotiationBattleCard for War Room
export interface NegotiationBattleCard {
  buyerMotive: string;
  leveragePoints: string[];
  suggestedCounter: number;
  closingProbability: number;
  sentimentScore: number;
}

// Added OutreachMessage for Messaging engine
export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent' | 'failed';
  content: string;
}

// Added NexusOpportunity for Nexus Prime radar
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

// Added AutonomousAction for MasterBrain tracking
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