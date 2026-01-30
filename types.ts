
/**
 * Isthmic Pro - Sovereign Type Definitions v11.5
 * التنظيم المعياري للأصول والذكاء الاصطناعي والهوية
 */

// --- USER & AUTH ---
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Executive' | 'Strategist' | 'Analyst';
  subscriptionTier: 'Free' | 'Pro' | 'Sovereign';
  usageStats: UsageStats;
  preferences: UserPreferences;
  avatar?: string;
  createdAt: string;
  isSyncEnabled: boolean;
}

export interface UsageStats {
  scansThisMonth: number;
  auditsThisMonth: number;
}

export interface UserPreferences {
  emailAlerts: boolean;
  sniperNotifications: boolean;
  reportReadiness: boolean;
}

// --- CORE ASSETS ---
export interface Domain {
  id: string;
  workspaceId: string; 
  name: string;
  price: number;
  status: DomainStatus;
  contentStatus: 'none' | 'parking' | 'active';
  sector?: string;
  probability?: number;
  integrityScore?: number;
  justification?: string;
  brandAssets?: BrandAssets;
  financials?: FinancialMetrics;
  technicalMetrics?: TechnicalMetrics;
  battleCard?: NegotiationBattleCard;
  lastChecked?: string;
  agentThoughts?: AgentThought[];
}

export type DomainStatus = 'available' | 'purchased' | 'negotiating' | 'sold' | 'watching' | 'processing';

export interface BrandAssets {
  tagline?: string;
  logoUrl?: string;
  colors?: string[];
}

export interface FinancialMetrics {
  targetExitPrice?: number;
  liquidityScore?: number;
  projectedROI?: number;
  netProfit?: number;
}

// Added missing fields to TechnicalMetrics
export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  mozDa?: number;
  ahrefsRank?: number;
  spamScore?: number;
  backlinks?: number;
  historicalCategory?: string;
  virusTotalStatus?: 'Clean' | 'Malicious' | 'Suspicious' | 'Untested';
  verificationStatus: 'AI_INFERRED' | 'REGISTRY_VERIFIED' | 'CROSS_REFERENCED';
  trademarkRisk?: string;
  organicTraffic?: number;
  isGscConnected?: boolean;
  whoisPrivacy?: boolean;
  dnaForensics?: string;
}

// --- AGENT LOGIC ---
export enum AgentRole {
  ANALYZER = 'ANALYZER',
  EXECUTOR = 'EXECUTOR',
  AUDITOR = 'AUDITOR',
  STRATEGIST = 'STRATEGIST',
  LIQUIDATOR = 'LIQUIDATOR'
}

// Added AgentType used in App.tsx
export enum AgentType {
  INTELLIGENCE = 'INTELLIGENCE',
  ACQUISITION = 'ACQUISITION',
  OPERATIONS = 'OPERATIONS',
  LIQUIDATION = 'LIQUIDATION',
  MANAGEMENT = 'MANAGEMENT',
  ADMIN_PANEL = 'ADMIN_PANEL'
}

export interface AgentThought {
  role: AgentRole;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved' | 'rejected' | 'action_taken';
}

// Added ThinkingStep used in EvaluationDashboard
export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'pending' | 'searching' | 'complete';
}

// Added OutreachMessage and LeadProspect
export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientEmail: string;
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent' | 'failed';
  content: string;
}

export interface LeadProspect {
  companyName: string;
  estimatedValuation: string;
  currentDomain: string;
  synergyReason: string;
  decisionMaker: string;
  jobTitle: string;
  linkedinUrl: string;
  contactEmail: string;
}

// --- SYSTEM & WORKFLOW ---

// Added ActivityLog used in MasterBrainDashboard
export interface ActivityLog {
  id: string;
  workspaceId: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

// Added Workflow types
export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed';

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
  nodes: {
    id: string;
    labelAr: string;
    labelEn: string;
    status: NodeStatus;
    output?: any;
  }[];
  progress: number;
  isComplete: boolean;
}

export interface ActiveJob {
  id: string;
  workspaceId: string;
  type: 'SOVEREIGN_LOOP' | 'FORENSIC_SWEEP' | 'MARKET_SYNC';
  status: 'running' | 'paused' | 'failed' | 'completed';
  payload: any;
  thoughts: AgentThought[];
  lastUpdate: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  estimatedPortfolioValue: number;
  systemResilienceStatus: 'nominal' | 'degraded' | 'critical';
}

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  autoPilot: boolean;
  investmentThesis: string;
}

export interface NegotiationBattleCard {
  buyerMotive: string;
  leveragePoints: string[];
  suggestedCounter: number;
  closingProbability: number;
  sentimentScore: number;
}

export interface ServiceIntegration {
  id: string;
  workspaceId: string;
  provider: 'google' | 'wayback' | 'virustotal' | 'registrar_api' | 'drop_api' | 'market_api' | 'gsc' | 'hunter';
  status: 'connected' | 'disconnected';
  apiKey?: string;
}

// Added NexusOpportunity used in NexusPrimeDashboard
export interface NexusOpportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  estimatedValue: string;
  aiDeduction: string;
  probability: number;
  marketGapScore: number;
}

// Added AutonomousAction used in services/masterBrainEngine.ts
export interface AutonomousAction {
  type: 'ACQUISITION' | 'LIQUIDATION' | 'ANALYSIS';
  description: string;
  timestamp: string;
}

// Added Audit types
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actionType: string;
  description: string;
  targetIdentity: string;
  severity: 'info' | 'warning' | 'critical';
}

// Added Monetization types
export interface PlanDetails {
  price: number;
  maxScans: number;
  maxAudits: number;
  features: string[];
}

export interface PlatformMonetizationSettings {
  isMonetizationActive: boolean;
  plans: {
    Free: PlanDetails;
    Pro: PlanDetails;
    Sovereign: PlanDetails;
  };
}
