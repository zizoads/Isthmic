
export interface SystemThought {
  id: string;
  agent: string;
  thought: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'User';
  avatar?: string;
  createdAt: string;
}

// Comment above fix: Added legacy and alias keys to AgentType enum to match component usage
export enum AgentType { 
  ALPHA_MINE = 'ALPHA_MINE',      // التنقيب والبحث عن الفرص (Mining & Discovery)
  BRAND_INTELLIGENCE = 'BRAND_INTELLIGENCE', // توليد الهوية التجارية (AI Branding)
  ADMIN_CONTROL = 'ADMIN_CONTROL', // لوحة التحكم الخاصة بالادمن (Admin Control)
  USER_PROFILE = 'USER_PROFILE', // بروفايل المستخدم (User Profile)
  
  // Legacy Aliases for compatibility
  INTELLIGENCE = 'ALPHA_MINE',
  ACQUISITION = 'ALPHA_MINE',
  ADMIN = 'ADMIN_CONTROL',
  WORKFLOW = 'ALPHA_MINE',
  EXECUTIVE = 'ALPHA_MINE',
  SOVEREIGN_INTELLIGENCE = 'ALPHA_MINE'
}

// Comment above fix: Added PLANNER role to AgentRole enum
export enum AgentRole {
  ANALYZER = 'ANALYZER',
  EXECUTOR = 'EXECUTOR',
  STRATEGIST = 'STRATEGIST',
  AUDITOR = 'AUDITOR',
  PLANNER = 'PLANNER'
}

export interface AgentThought {
  role: AgentRole | string;
  message: string;
  timestamp: string;
  status: 'thinking' | 'resolved';
}

// Comment above fix: Defined TechnicalMetrics interface used for forensic audits
export interface TechnicalMetrics {
  da?: number;
  pa?: number;
  spamScore?: number;
  historicalCategory?: string;
  virusTotalStatus?: 'Clean' | 'Malicious' | 'Suspicious' | 'Untested';
  verificationStatus?: 'AI_INFERRED' | 'REGISTRY_VERIFIED';
  organicTraffic?: number;
  isGscConnected?: boolean;
  dnaForensics?: string;
  trademarkRisk?: string;
}

// Comment above fix: Defined DomainFinancials interface for ROI and liquidity tracking
export interface DomainFinancials {
  liquidityScore?: number;
  projectedROI?: number;
  targetExitPrice?: number;
}

export interface Domain {
  id: string;
  workspaceId: string;
  name: string;
  price: number;
  status: 'available' | 'purchased' | 'negotiating' | 'sold' | 'processing' | 'watching';
  sector?: string;
  justification?: string;
  probability?: number;
  strategicAlignmentScore?: number;
  brandAssets?: {
    logoUrl: string;
    tagline: string;
    colors: string[];
  };
  technicalMetrics?: TechnicalMetrics;
  negotiationThread?: NegotiationThread;
  // Comment above fix: Added missing Domain properties referenced in the app
  integrityScore?: number;
  financials?: DomainFinancials;
  contentStatus?: 'none' | 'draft' | 'published';
  lastChecked?: string;
  agentThoughts?: AgentThought[];
  trafficSignal?: 'none' | 'low' | 'medium' | 'high';
  trafficSource?: string;
}

export interface PlatformStats {
  totalDiscovered: number;
  totalPurchased: number;
  estimatedPortfolioValue: number;
  avgProfit: number;
  openRate: number;
  messagesSent: number;
  alignmentVelocity: number;
  adaptiveThreshold: number;
  telemetry?: {
    avgLatency: number;
    inferenceSuccessRate: number;
    apiLatencyHistory: number[];
  };
}

export interface ActivityLog {
  id: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  // Comment above fix: Added action properties to support interactive notifications
  payload?: any;
  actionLabel?: string;
  onAction?: (payload?: any) => void;
  actionPayload?: any;
}

export interface ServiceIntegration {
  id: string;
  workspaceId: string;
  provider: string;
  status: 'connected' | 'disconnected';
}

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  investmentThesis: string;
  adaptiveThresholdEnabled: boolean;
  causalRejectionModels?: CausalRejectionModel[];
}

// Comment above fix: Defined StrategicObjective for goal-oriented discovery
export interface StrategicObjective {
  id: string;
  category: string;
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

export type ObjectiveStatus = 'TRACKING' | 'AT_RISK' | 'DEVIATED' | 'ACHIEVED';

export interface AlignmentReport {
  alignmentScore: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  reasoning: string;
  suggestedAdjustment: string;
  timestamp?: string;
}

export interface ThinkingStep {
  id: string;
  action: string;
  finding: string;
  status: 'pending' | 'searching' | 'complete';
}

export interface CausalRejectionModel {
  patternId: string;
  reason: string;
  causalLogicChain: string;
  timestamp: string;
  sector: string;
  severityIndex: number;
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

// Comment above fix: Added DealStateEnum for negotiation tracking
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

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'ai_assistant' | 'owner';
  content: string;
  timestamp: string;
  auditInsight?: MessageAuditInsight;
  faangReport?: FAANGNegotiationReport;
}

export interface MessageAuditInsight {
  sentimentScore: number;
  intent: 'lowball' | 'discovery' | 'serious_offer' | 'bluff' | 'urgency' | 'none';
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

export interface NegotiationThread {
  id: string;
  domainId: string;
  buyerName: string;
  messages: NegotiationMessage[];
  overallStatus: 'active' | 'closed' | 'stalled';
  currentLeverage: number;
  currentState?: DealState;
}

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

export interface NexusOpportunity {
  id: string;
  type: string;
  title: string;
  description: string;
}

export interface ActiveJob {
  id: string;
  type: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
}

export interface PlanDetails {
  price: number;
  maxScans: number;
  maxAudits: number;
  features: string[];
}

export interface NodeDefinition {
  id: string;
  labelAr: string;
  labelEn: string;
  task: (input: any) => Promise<any>;
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

export interface DecompositionPlan {
  id: string;
  strategicIntent: string;
  createdAt: string;
  nodes: Array<{
    id: string;
    label: string;
    description: string;
    status: 'pending' | 'completed' | 'failed';
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: any;
}

export interface IntelligenceReport {
  id: string;
  createdAt: string;
  status: 'synthesized' | 'pending';
  sections: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  included: boolean;
  content: any;
}

export interface SwarmMetrics {
  totalConcurrentUsers: number;
  requestsPerSecond: number;
  databaseLatency: number;
  cpuLoad: number;
  memoryUsage: number;
  failureRate: number;
  activeApiTokens: number;
}

export interface StressReport {
  timestamp: string;
  verdict: 'STABLE' | 'DEGRADED' | 'FAILED';
  peakConcurrency: number;
  throughput: string;
  bottleneckDetected: string;
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

export interface ChaosLog {
  timestamp: string;
  vector: string;
  payload: string;
  impact: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'TERMINAL';
}

export type ToolType = 'DOMAIN_CHECK' | 'WHOIS' | 'ANALYTICS' | 'OTHER';

export interface ToolDefinition {
  id: string;
  name: string;
  type: ToolType;
  apiKey: string;
  status: 'active' | 'invalid' | 'verifying';
  lastVerified?: string;
}

export interface ApiKeys {
  gemini?: string;
  domainAvailability?: string;
  whois?: string;
  customTools?: ToolDefinition[];
}
