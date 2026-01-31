
/**
 * Isthmic Pro - Sovereign Type Definitions v14.0
 * التحسين: إضافة أنظمة التدقيق التفاوضي الذكي
 */

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'owner' | 'ai_assistant';
  content: string;
  timestamp: string;
  auditInsight?: MessageAuditInsight;
}

export interface MessageAuditInsight {
  sentimentScore: number; // -1 to 1
  intent: 'lowball' | 'discovery' | 'serious_offer' | 'bluff' | 'urgency';
  psychologicalMarkers: string[];
  redFlags: string[];
  suggestedAction: string;
}

export interface NegotiationThread {
  id: string;
  domainId: string;
  buyerName: string;
  messages: NegotiationMessage[];
  overallStatus: 'active' | 'stalled' | 'closed_won' | 'closed_lost';
  currentLeverage: number; // 0-100
  aiVerdict?: string;
}

// تحديث واجهة الـ Domain لتشمل السجل
export interface Domain {
  id: string;
  workspaceId: string; 
  name: string;
  price: number;
  status: DomainStatus;
  sector?: string;
  probability?: number;
  integrityScore?: number;
  justification?: string;
  brandAssets?: BrandAssets;
  financials?: FinancialMetrics;
  technicalMetrics?: TechnicalMetrics;
  battleCard?: NegotiationBattleCard;
  negotiationThread?: NegotiationThread; // الحقل الجديد
  lastChecked?: string;
  contentStatus?: string;
}

// بقية الأنواع الموجودة مسبقاً...
export interface CodeAuditReport {
  id: string;
  timestamp: string;
  projectName: string;
  overallScore: number; 
  metrics: {
    security: number;
    performance: number;
    readability: number;
    maintainability: number;
    architecture: number;
  };
  findings: AuditFinding[];
  refactorPlan: string;
}

export interface AuditFinding {
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  lineRange?: string;
  suggestion: string;
}

export enum AuditorAgentMode {
  FAST_SCAN = 'FAST_SCAN',
  DEEP_FORENSIC = 'DEEP_FORENSIC',
  SECURITY_FIRST = 'SECURITY_FIRST'
}

export interface SystemHealthStatus {
  database: 'connected' | 'reconnecting' | 'failed';
  aiEngine: 'ready' | 'quota_low' | 'error';
  shieldIntegrity: 'secure' | 'compromised' | 'inactive';
  lastHeartbeat: string;
}

export interface LaunchReadinessCheck {
  id: string;
  category: 'E2E' | 'Recovery' | 'Performance' | 'Documentation';
  status: 'passed' | 'pending' | 'failed';
  metric?: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Executive' | 'Strategist' | 'Analyst';
  subscriptionTier: 'Free' | 'Pro' | 'Sovereign';
  usageStats: { scansThisMonth: number; auditsThisMonth: number; };
  preferences: { emailAlerts: boolean; sniperNotifications: boolean; reportReadiness: boolean; };
  avatar?: string;
  createdAt: string;
  isSyncEnabled?: boolean;
}

export type DomainStatus = 'available' | 'purchased' | 'negotiating' | 'sold' | 'processing' | 'watching';

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

export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  spamScore?: number;
  historicalCategory?: string;
  virusTotalStatus?: 'Clean' | 'Malicious' | 'Suspicious' | 'Untested';
  verificationStatus: 'AI_INFERRED' | 'REGISTRY_VERIFIED' | 'CROSS_REFERENCED';
  trademarkRisk?: string;
  dnaForensics?: string;
  organicTraffic?: number;
  isGscConnected?: boolean;
}

export enum AgentRole {
  ANALYZER = 'ANALYZER',
  EXECUTOR = 'EXECUTOR',
  AUDITOR = 'AUDITOR',
  STRATEGIST = 'STRATEGIST',
  LIQUIDATOR = 'LIQUIDATOR'
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  estimatedPortfolioValue: number;
  systemResilienceStatus?: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  actionLabel?: string;
  actionPayload?: any;
  onAction?: (payload: any) => void;
}

export interface ActiveJob {
  id: string;
  workspaceId: string;
  type: string;
  status: 'running' | 'completed' | 'failed';
  payload: any;
  thoughts: AgentThought[];
  lastUpdate: string;
}

export interface AgentThought {
  role: AgentRole;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved' | 'failed';
}

export interface ServiceIntegration {
  id: string;
  workspaceId: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected';
}

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

export enum AgentType {
  INTELLIGENCE = 'INTELLIGENCE',
  ACQUISITION = 'ACQUISITION',
  OPERATIONS = 'OPERATIONS',
  LIQUIDATION = 'LIQUIDATION',
  MANAGEMENT = 'MANAGEMENT',
  CODE_AUDITOR = 'CODE_AUDITOR'
}

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

export interface ResilienceMetrics {
  pulseLatency: number;
  retryEfficiency: number;
  recoveryIntegrity: number;
  batchProcessTime: number;
  isChaosModeActive: boolean;
}

export interface NegotiationBattleCard {
  buyerMotive: string;
  leveragePoints: string[];
  suggestedCounter: number;
  closingProbability: number;
  sentimentScore: number;
}

export interface IntelligenceReport {
  id: string;
  createdAt: string;
  type: 'EXECUTIVE_SUMMARY' | 'FORENSIC_DOSSIER' | 'MARKET_OUTLOOK';
  status: 'draft' | 'synthesized' | 'archived';
  sections: ReportSection[];
  narrative?: string;
}

export interface ReportSection {
  id: string;
  title: string;
  included: boolean;
  content?: any;
}

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'searching' | 'pending' | 'complete' | 'executing';
}

export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientEmail?: string;
  recipientRole?: string;
  tone: string;
  status: 'draft' | 'sent' | 'failed';
  content: string;
}

export interface LeadProspect {
  companyName: string;
  estimatedValuation?: string;
  currentDomain?: string;
  synergyReason: string;
  decisionMaker: string;
  jobTitle?: string;
  linkedinUrl?: string;
  contactEmail?: string;
}

export interface NexusOpportunity {
  id: string;
  type: string;
  title: string;
  description: string;
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

export interface NodeDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  task: (input: any) => Promise<any>;
}

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  autoPilot: boolean;
  investmentThesis: string;
}
