
export enum AgentType { 
  INTELLIGENCE = 'INTELLIGENCE', 
  ACQUISITION = 'ACQUISITION', 
  OPERATIONS = 'OPERATIONS', 
  LIQUIDATION = 'LIQUIDATION', 
  MANAGEMENT = 'MANAGEMENT', 
  CODE_AUDITOR = 'CODE_AUDITOR', 
  ADMIN = 'ADMIN',
  ARABIC_LAB = 'ARABIC_LAB'
}

export enum AgentRole {
  ANALYZER = 'ANALYZER',
  EXECUTOR = 'EXECUTOR',
  STRATEGIST = 'STRATEGIST',
  AUDITOR = 'AUDITOR'
}

export enum ServiceType {
  DISCOVERY = 'DISCOVERY',
  NEGOTIATION = 'NEGOTIATION',
  ACQUISITION = 'ACQUISITION',
  LIQUIDATION = 'LIQUIDATION'
}

export enum ObjectiveStatus {
  TRACKING = 'TRACKING',
  ACHIEVED = 'ACHIEVED',
  AT_RISK = 'AT_RISK',
  DEVIATED = 'DEVIATED'
}

/**
 * NegotiationSnapshot: لقطة سريعة لحالة التفاوض لأغراض الرقابة الاستراتيجية
 */
export interface NegotiationSnapshot {
  domainName: string;
  currentState: DealStateEnum;
  messageCount: number;
  leverageScore: number;
  lastBuyerIntent: string;
  riskFlagsCount: number;
  sentiment: number;
  timestamp: string;
}

/**
 * AlignmentReport: مخرجات محرك التقييم الاستراتيجي
 */
export interface AlignmentReport {
  alignmentScore: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  reasoning: string;
  suggestedAdjustment: string;
}

/**
 * StrategicObjective: الهدف الاستراتيجي المهيكل
 */
export interface StrategicObjective {
  id: string;
  category: 'LIQUIDITY' | 'ACQUISITION' | 'REVENUE' | 'RISK_MITIGATION';
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: ObjectiveStatus;
  weight: number;
  linkedServices: ServiceType[];
  evaluationPrompt: string;
  lastEvaluated: string;
  alignmentHistory: AlignmentReport[];
}

export enum DealStateEnum {
  INITIAL = 'INITIAL',
  DISCOVERY = 'DISCOVERY',
  TENSION = 'TENSION',
  AGREEMENT = 'AGREEMENT',
  CLOSING = 'CLOSING',
  STALLED = 'STALLED',
  LOST = 'LOST'
}

export interface DealState {
  currentState: DealStateEnum;
  confidenceScore: number;
  previousState?: DealStateEnum;
  transitionReason: string;
  suggestedAction?: string;
  lastUpdate: string;
}

export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  spamScore?: number;
  historicalCategory?: string;
  virusTotalStatus?: 'Clean' | 'Malicious' | 'Suspicious' | 'Untested';
  verificationStatus?: 'AI_INFERRED' | 'REGISTRY_VERIFIED' | 'CROSS_REFERENCED';
  isGscConnected?: boolean;
  organicTraffic?: number;
  dnaForensics?: string;
  trademarkRisk?: string;
}

export interface Domain {
  id: string;
  workspaceId: string;
  name: string;
  price: number;
  status: 'available' | 'processing' | 'purchased' | 'negotiating' | 'sold' | 'watching';
  contentStatus: 'none' | 'draft' | 'published';
  lastChecked?: string;
  sector?: string;
  justification?: string;
  probability?: number;
  integrityScore?: number;
  technicalMetrics?: TechnicalMetrics;
  brandAssets?: {
    logoUrl: string;
    tagline: string;
    colors: string[];
  };
  financials?: {
    liquidityScore?: number;
    projectedROI?: number;
    targetExitPrice?: number;
  };
  negotiationThread?: NegotiationThread;
  agentThoughts?: AgentThought[];
}

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'searching' | 'pending' | 'complete';
}

export interface OutreachMessage {
  id: string;
  domainId: string;
  recipient: string;
  recipientEmail?: string;
  recipientRole?: string;
  tone: string;
  status: 'draft' | 'sent';
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

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'ai_assistant';
  content: string;
  timestamp: string;
  auditInsight?: MessageAuditInsight;
  faangReport?: FAANGNegotiationReport;
}

export interface NegotiationThread {
  id: string;
  domainId: string;
  buyerName: string;
  messages: NegotiationMessage[];
  overallStatus: 'active' | 'closed' | 'won' | 'lost';
  currentLeverage: number;
  currentState?: DealState;
}

export interface MessageAuditInsight {
  sentimentScore: number;
  intent: 'lowball' | 'discovery' | 'serious_offer' | 'bluff' | 'urgency';
  psychologicalMarkers: string[];
  redFlags: string[];
  suggestedAction: string;
  culturalNuance?: string; 
}

export interface FAANGNegotiationReport {
  executiveSummary: string;
  quantitativeMetrics: {
    buyerWeaknessIndex: number;
    suggestedDiscountRange: number[];
    timePressureFactor: number;
    psychographicScore: number;
    tacticalWeaknessScore: number;
    financialUrgencyScore: number;
  };
  leverageScore: number;
  riskFlags: Array<{
    type: 'FINANCIAL' | 'PSYCHOLOGICAL' | 'TIMING';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    evidence: string;
  }>;
  recommendedActions: Array<{
    action: string;
    confidence: number;
    expectedOutcome: string;
  }>;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  estimatedPortfolioValue: number;
  systemResilienceStatus: 'nominal' | 'syncing' | 'warning' | 'critical';
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

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  autoPilot: boolean;
  investmentThesis: string;
  objectives?: StrategicObjective[]; 
}

export interface ServiceIntegration {
  id: string;
  workspaceId: string;
  name: string;
  provider: 'google' | 'wayback' | 'virustotal' | 'registrar_api' | 'drop_api' | 'market_api' | 'gsc' | 'hunter';
  status: 'connected' | 'disconnected';
  key?: string;
}

export interface NexusOpportunity {
  id: string;
  type: string;
  title: string;
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Executive' | 'Analyst';
  subscriptionTier: 'Free' | 'Pro' | 'Sovereign';
  usageStats: {
    scansThisMonth: number;
    auditsThisMonth: number;
  };
  preferences: {
    emailAlerts: boolean;
    sniperNotifications: boolean;
    reportReadiness: boolean;
    tourCompleted?: boolean;
  };
  createdAt: string;
  emailConfirmedAt?: string;
  isSyncEnabled: boolean;
  avatar: string;
}

export interface ActiveJob {
  id: string;
  workspaceId: string;
  type: 'SOVEREIGN_LOOP' | 'BATCH_AUDIT';
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

export interface WorkflowState {
  id: string;
  nameAr: string;
  nameEn: string;
  nodes: Array<{
    id: string;
    labelAr: string;
    labelEn: string;
    status: NodeStatus;
    output?: any;
  }>;
  progress: number;
  isComplete: boolean;
}

export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface NodeDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  task: (input: any) => Promise<any>;
}

export interface PlanDetails {
  price: number;
  maxScans: number;
  maxAudits: number;
  features: string[];
}

export interface PlatformMonetizationSettings {
  isMonetizationActive: boolean;
  plans: Record<string, PlanDetails>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ReportSection {
  id: string;
  title: string;
  included: boolean;
  content: any;
}

export interface IntelligenceReport {
  id: string;
  createdAt: string;
  status: 'draft' | 'synthesized' | 'archived';
  sections: ReportSection[];
}

export interface NegotiationBattleCard {
  buyerMotive: string;
  leveragePoints: string[];
  suggestedCounter: number;
  closingProbability: number;
  sentimentScore: number;
}

export interface ResilienceMetrics {
  latency: number;
  uptime: number;
  errorRate: number;
}

export interface SovereignAutopsyReport {
  id: string;
  contentHash: string;
  specimen: {
    name: string;
    filePath: string;
    linesOfCode: number;
    aiGeneratedEstimate: number;
    lastModified: string;
  };
  metrics: {
    architecturalScore: number;
    codeQualityScore: number;
    performanceScore: number;
    securityScore: number;
    testabilityScore: number;
    maintainabilityScore: number;
    overallHealthIndex: number;
    aiGeneratedCodeIndex: number;
  };
  performance: {
    executionTime: number;
    apiCallsCount: number;
    tokenConsumption: number;
  };
  predictiveDebt?: {
    forecastedDebt30d: number;
    decayProbability: number;
    nextCriticalFailurePoint: string;
  };
  automaticFixes: AutomaticFix[];
  technicalDebt: {
    debtHours: number;
    debtCost: number;
    criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  findings: Array<{
    category: string;
    severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
    description: string;
    recommendation: string;
    fixExample: string;
    origin: 'AI_PATTERNS' | 'HUMAN_ERROR' | 'ARCHITECTURAL_FLAW';
    patternId: string;
  }>;
  improvementRoadmap: Array<{
    phase: number;
    priority: string;
    action: string;
    expectedImpact: number;
    estimatedEffort: number;
  }>;
  impactReport?: FixImpactReport;
}

export interface AutomaticFix {
  id: string;
  description: string;
  patch: string;
  confidence: number;
  before: string;
  after: string;
}

export interface ProjectExecutiveSummary {
  projectHealthScore: number;
  totalDebtHours: number;
  debtTrend: 'UP' | 'DOWN' | 'STABLE';
  improvedFiles: string[];
  degradedFiles: string[];
  strategicRisk: string;
  faangReadinessIndex: number;
}

export interface FixImpactReport {
  before: any;
  after: any;
  improvementPercentage: number;
  performanceGain: number;
  readabilityGain: number;
  maintainabilityGain: number;
  isSuccessful: boolean;
}

export interface ProblemCatalog {
  institutionalHealthIndex: number;
  patterns: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    severity: string;
    frequency: number;
    globalRecommendation: string;
  }>;
  lastUpdated: string;
  totalFilesAnalyzed: number;
}

export interface LaunchReadinessReport {
  overallReadiness: number;
  authorizedForLaunch: boolean;
  blockers: number;
  ewsStatus: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  components: ComponentStatus[];
}

export interface ComponentStatus {
  id: string;
  name: string;
  category: 'CORE' | 'AI_SERVICE' | 'UI_HUB' | 'INFRASTRUCTURE';
  status: 'STABLE' | 'REFINE' | 'CRITICAL' | 'LOCKED';
  phi: number;
  lastAudit: string;
  risks: string[];
}

export interface EWSAlert {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  severity: 'WARNING' | 'CRITICAL';
  metric: string;
}
