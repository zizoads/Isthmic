

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

export interface AlignmentReport {
  alignmentScore: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  reasoning: string;
  suggestedAdjustment: string;
}

export interface StrategicObjective {
  id: string;
  category: 'LIQUIDITY' | 'ACQUISITION' | 'REVENUE' | 'RISK_MITIGATION';
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: ObjectiveStatus;
  weight: number;
  linkedServices: string[];
  evaluationPrompt: string;
  lastEvaluated: string;
  alignmentHistory: AlignmentReport[];
}

export type ObjectiveStatus = 'TRACKING' | 'ACHIEVED' | 'AT_RISK' | 'DEVIATED';

export interface PerformanceTelemetry {
  apiLatencyHistory: number[];
  avgLatency: number;
  inferenceSuccessRate: number;
  lastPulseTimestamp: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  messagesSent: number;
  openRate: number;
  avgProfit: number;
  estimatedPortfolioValue: number;
  alignmentVelocity: number;
  systemResilienceStatus: 'nominal' | 'syncing' | 'warning' | 'critical';
  telemetry?: PerformanceTelemetry;
  adaptiveThreshold: number; // العتبة الديناميكية الحالية (تتغير بناءً على الذكاء المحيط)
}

export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  spamScore?: number;
  historicalCategory?: string;
  virusTotalStatus?: 'Clean' | 'Malicious' | 'Suspicious' | 'Untested';
  verificationStatus?: 'AI_INFERRED' | 'REGISTRY_VERIFIED' | 'CROSS_REFERENCED';
  dnaForensics?: string;
  isGscConnected?: boolean;
  organicTraffic?: number;
  trademarkRisk?: string;
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
  suggestedAction: string;
  lastUpdate: string;
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
  riskFlags: {
    type: 'FINANCIAL' | 'PSYCHOLOGICAL' | 'TIMING';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    evidence: string;
  }[];
  recommendedActions: {
    action: string;
    confidence: number;
    expectedOutcome: string;
  }[];
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
  overallStatus: 'active' | 'completed' | 'stalled';
  currentLeverage: number;
  currentState?: DealState;
}

// Fix: Add missing NegotiationBattleCard interface used in masterBrainEngine.ts
export interface NegotiationBattleCard {
  buyerMotive: string;
  leveragePoints: string[];
  suggestedCounter: number;
  closingProbability: number;
  sentimentScore: number;
}

// Fix: Add missing NegotiationSnapshot interface used in NegotiationService.ts
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

export interface Domain {
  id: string;
  workspaceId: string;
  name: string;
  price: number;
  status: 'available' | 'processing' | 'purchased' | 'negotiating' | 'sold' | 'watching';
  contentStatus: 'none' | 'draft' | 'published';
  sector?: string;
  justification?: string;
  probability?: number;
  strategicAlignmentScore?: number;
  predictiveViabilityScore?: number; // درجة التنبؤ الاستباقية (Stage 4)
  causalPenaltyReason?: string; // سبب العقوبة السببية المكتشف
  rejectionPatterns?: string[];
  technicalMetrics?: TechnicalMetrics;
  financials?: any;
  agentThoughts?: any;
  negotiationThread?: NegotiationThread;
  brandAssets?: { logoUrl: string; tagline: string; colors: string[]; };
  integrityScore?: number;
  lastChecked?: string;
}

export interface CausalRejectionModel {
  patternId: string;
  reason: string;
  causalLogicChain: string; // تسلسل المنطق السببي (لماذا تم الرفض فعلياً)
  timestamp: string;
  sector: string;
  severityIndex: number; // مدى قوة تأثير هذا النمط (0.1 - 1.0)
}

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  autoPilot: boolean;
  adaptiveThresholdEnabled: boolean; // تفعيل الفلتر الديناميكي
  investmentThesis: string;
  objectives?: StrategicObjective[];
  causalRejectionModels?: CausalRejectionModel[]; // الذاكرة السببية الجديدة
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  actionPayload?: any;
  actionLabel?: string;
  onAction?: (payload?: any) => void;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Executive' | 'Analyst';
  subscriptionTier: 'Free' | 'Pro' | 'Sovereign';
  usageStats: any;
  preferences: any;
  createdAt: string;
  emailConfirmedAt?: string;
  isSyncEnabled?: boolean;
  avatar?: string;
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
  recipientRole: string;
  tone: string;
  status: 'draft' | 'sent';
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

export interface ServiceIntegration {
  id: string;
  workspaceId: string;
  provider: string;
  status: 'connected' | 'disconnected';
  lastUsed?: string;
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

export interface AgentThought {
  role: AgentRole | string;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved' | 'failed';
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

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  description: string;
}

export interface PlanDetails {
  price: number;
  maxScans: number;
  maxAudits: number;
  features: string[];
}

export interface IntelligenceReport {
  id: string;
  createdAt: string;
  status: string;
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  included: boolean;
  content: any;
}

export interface ResilienceMetrics {
  pulseLatency: number;
  syncSuccessRate: number;
  errorRate: number;
}

// Fix: Add missing AutomaticFix interface used in AutopsyService.ts and AutopsyLab.tsx
export interface AutomaticFix {
  id: string;
  description: string;
  patch: string;
  confidence: number;
  before: string;
  after: string;
}

// Fix: Add missing FixImpactReport interface used in AutopsyService.ts
export interface FixImpactReport {
  before: SovereignAutopsyReport['metrics'];
  after: SovereignAutopsyReport['metrics'];
  improvementPercentage: number;
  performanceGain: number;
  readabilityGain: number;
  maintainabilityGain: number;
  isSuccessful: boolean;
}

// Fix: Add missing ProblemPattern interface
export interface ProblemPattern {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: string;
  frequency: number;
  globalRecommendation: string;
}

// Fix: Add missing ProblemCatalog interface used in AutopsyService.ts and AutopsyLab.tsx
export interface ProblemCatalog {
  institutionalHealthIndex: number;
  patterns: ProblemPattern[];
  lastUpdated: string;
  totalFilesAnalyzed: number;
}

// Fix: Add missing ProjectExecutiveSummary interface used in AutopsyService.ts and AutopsyLab.tsx
export interface ProjectExecutiveSummary {
  projectHealthScore: number;
  totalDebtHours: number;
  debtTrend: 'UP' | 'DOWN' | 'STABLE';
  improvedFiles: string[];
  degradedFiles: string[];
  strategicRisk: string;
  faangReadinessIndex: number;
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
  predictiveDebt: {
    forecastedDebt30d: number;
    decayProbability: number;
    nextCriticalFailurePoint: string;
  };
  // Fix: Use AutomaticFix[] instead of any[] to ensure strict typing
  automaticFixes: AutomaticFix[];
  technicalDebt: {
    debtHours: number;
    debtCost: number;
    criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  findings: any[];
  improvementRoadmap: any[];
  // Fix: Use FixImpactReport instead of any to ensure strict typing
  impactReport?: FixImpactReport;
}

export interface LaunchReadinessReport {
  overallReadiness: number;
  authorizedForLaunch: boolean;
  blockers: number;
  ewsStatus: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  components: any[];
}

export interface EWSAlert {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  severity: 'WARNING' | 'CRITICAL';
  metric: string;
}

export type ComponentStatus = 'STABLE' | 'REFINE' | 'CRITICAL' | 'LOCKED';
