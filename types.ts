/**
 * Isthmic Pro - Sovereign Type Definitions v17.0
 * المرحلة النهائية: التحضير للإطلاق العالمي
 */

export interface ComponentStatus {
  id: string;
  name: string;
  category: 'CORE' | 'AI_SERVICE' | 'UI_HUB' | 'INFRASTRUCTURE';
  status: 'STABLE' | 'REFINE' | 'CRITICAL' | 'LOCKED';
  phi: number; // Health index
  lastAudit: string;
  risks: string[];
}

export interface LaunchReadinessReport {
  overallReadiness: number; // 0-100%
  authorizedForLaunch: boolean;
  blockers: number;
  components: ComponentStatus[];
  ewsStatus: 'NOMINAL' | 'ALERT' | 'CRITICAL';
}

export interface EWSAlert {
  id: string;
  timestamp: string;
  source: string;
  type: 'LATENCY_SPIKE' | 'ERROR_BURST' | 'AUTH_TURBULENCE';
  severity: 'WARNING' | 'CRITICAL';
  metric: string;
}

// Existing types preserved
export interface CodeMetrics {
  architecturalScore: number;
  codeQualityScore: number;
  performanceScore: number;
  securityScore: number;
  testabilityScore: number;
  maintainabilityScore: number;
  overallHealthIndex: number;
  aiGeneratedCodeIndex: number;
}

export interface ProblemPattern {
  id: string;
  name: string;
  category: 'AI_REPETITION' | 'SOLID_VIOLATION' | 'SECURITY_GAP' | 'PERFORMANCE_JANK';
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  frequency: number;
  globalRecommendation: string;
}

export interface ProblemCatalog {
  lastUpdated: string;
  patterns: ProblemPattern[];
  totalFilesAnalyzed: number;
  institutionalHealthIndex: number;
}

export interface PredictiveDebt {
  forecastedDebt30d: number;
  decayProbability: number;
  nextCriticalFailurePoint?: string;
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
  metrics: CodeMetrics;
  performance: PerformanceMetrics;
  automaticFixes: AutomaticFix[];
  impactReport?: FixImpactReport;
  predictiveDebt?: PredictiveDebt;
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
    patternId?: string;
  }>;
  improvementRoadmap: Array<{
    phase: number;
    priority: string;
    action: string;
    expectedImpact: number;
    estimatedEffort: number;
  }>;
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
  before: CodeMetrics;
  after: CodeMetrics;
  improvementPercentage: number;
  performanceGain: number;
  readabilityGain: number;
  maintainabilityGain: number;
  isSuccessful: boolean;
}

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage?: number;
  apiCallsCount: number;
  tokenConsumption?: number;
}

export interface AutomaticFix {
  id: string;
  description: string;
  patch: string;
  confidence: number;
  before: string;
  after: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Executive' | 'Analyst';
  subscriptionTier: 'Free' | 'Pro' | 'Sovereign';
  usageStats: { scansThisMonth: number; auditsThisMonth: number; };
  preferences?: { emailAlerts: boolean; sniperNotifications: boolean; reportReadiness: boolean; };
  createdAt: string;
  isSyncEnabled: boolean;
  avatar: string;
}

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
  negotiationThread?: NegotiationThread;
  lastChecked?: string;
  contentStatus?: string;
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
  da?: number;pa?: number;spamScore?: number;historicalCategory?: string;
  virusTotalStatus?: 'Clean' | 'Malicious' | 'Suspicious' | 'Untested';
  verificationStatus: 'AI_INFERRED' | 'REGISTRY_VERIFIED' | 'CROSS_REFERENCED';
  trademarkRisk?: string;dnaForensics?: string;organicTraffic?: number;isGscConnected?: boolean;
}

export interface FAANGNegotiationReport {
  executiveSummary: string;
  quantitativeMetrics: {
    buyerWeaknessIndex: number;
    suggestedDiscountRange: [number, number];
    timePressureFactor: number;
    psychographicScore: number;
    tacticalWeaknessScore: number;
    financialUrgencyScore: number;
  };
  leverageScore: number;
  riskFlags: Array<{ type: 'FINANCIAL' | 'PSYCHOLOGICAL' | 'TIMING'; severity: 'LOW' | 'MEDIUM' | 'HIGH'; evidence: string; }>;
  recommendedActions: Array<{ action: string; confidence: number; expectedOutcome: string; }>;
}

export interface NegotiationMessage {
  id: string; sender: 'buyer' | 'owner' | 'ai_assistant'; content: string; timestamp: string;
  auditInsight?: MessageAuditInsight; faangReport?: FAANGNegotiationReport;
}

export interface MessageAuditInsight {
  sentimentScore: number; intent: 'lowball' | 'discovery' | 'serious_offer' | 'bluff' | 'urgency';
  psychologicalMarkers: string[]; redFlags: string[]; suggestedAction: string;
}

export interface NegotiationThread {
  id: string; domainId: string; buyerName: string; messages: NegotiationMessage[];
  overallStatus: 'active' | 'stalled' | 'closed_won' | 'closed_lost'; currentLeverage: number; aiVerdict?: string;
}

export enum AgentRole { ANALYZER = 'ANALYZER', EXECUTOR = 'EXECUTOR', AUDITOR = 'AUDITOR', STRATEGIST = 'STRATEGIST', LIQUIDATOR = 'LIQUIDATOR' }
export interface PlatformStats { totalDiscovered: number; totalPurchased: number; messagesSent: number; openRate: number; avgProfit: number; estimatedPortfolioValue: number; systemResilienceStatus?: string; }
export interface ActivityLog { id: string; workspaceId: string; time: string; agent: string; message: string; type: 'info' | 'success' | 'warning' | 'critical'; actionLabel?: string; actionPayload?: any; onAction?: (payload: any) => void; }
export interface ActiveJob { id: string; workspaceId: string; type: string; status: 'running' | 'completed' | 'failed'; payload: any; thoughts: AgentThought[]; lastUpdate: string; }
export interface AgentThought { role: AgentRole; message: string; timestamp: string; status: 'thinking' | 'resolved' | 'failed'; }
export interface ServiceIntegration { id: string; workspaceId: string; name: string; provider: string; status: 'connected' | 'disconnected'; }
export interface PlanDetails { price: number; maxScans: number; maxAudits: number; features: string[]; }
export interface PlatformMonetizationSettings { isMonetizationActive: boolean; plans: { Free: PlanDetails; Pro: PlanDetails; Sovereign: PlanDetails; }; }
export enum AgentType { INTELLIGENCE = 'INTELLIGENCE', ACQUISITION = 'ACQUISITION', OPERATIONS = 'OPERATIONS', LIQUIDATION = 'LIQUIDATION', MANAGEMENT = 'MANAGEMENT', CODE_AUDITOR = 'CODE_AUDITOR', ADMIN = 'ADMIN' }
export interface AuditLogEntry { id: string; timestamp: string; actorId: string; actorName: string; actionType: string; description: string; targetIdentity: string; severity: 'info' | 'warning' | 'critical'; }
export interface ResilienceMetrics { pulseLatency: number; retryEfficiency: number; recoveryIntegrity: number; batchProcessTime: number; isChaosModeActive: boolean; }
export interface NegotiationBattleCard { buyerMotive: string; leveragePoints: string[]; suggestedCounter: number; closingProbability: number; sentimentScore: number; }
export interface IntelligenceReport { id: string; createdAt: string; type: 'EXECUTIVE_SUMMARY' | 'FORENSIC_DOSSIER' | 'MARKET_OUTLOOK'; status: 'draft' | 'synthesized' | 'archived'; sections: ReportSection[]; narrative?: string; }
export interface ReportSection { id: string; title: string; included: boolean; content?: any; }
export interface ThinkingStep { id: string; action: string; finding: string; status: 'searching' | 'pending' | 'complete' | 'executing'; }
export interface OutreachMessage { id: string; domainId: string; recipient: string; recipientEmail?: string; recipientRole?: string; tone: string; status: 'draft' | 'sent' | 'failed'; content: string; }
export interface LeadProspect { companyName: string; estimatedValuation?: string; currentDomain?: string; synergyReason: string; decisionMaker: string; jobTitle?: string; linkedinUrl?: string; contactEmail?: string; }
export interface NexusOpportunity { id: string; type: string; title: string; description: string; }
export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed';
export interface WorkflowNode { id: string; labelAr: string; labelEn: string; status: NodeStatus; output?: any; }
export interface WorkflowState { id: string; nameAr: string; nameEn: string; nodes: WorkflowNode[]; progress: number; isComplete: boolean; }
export interface NodeDefinition { id: string; labelAr: string; labelEn: string; task: (input: any) => Promise<any>; }
export interface PlatformStrategy { id: string; totalBudget: number; riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive'; autoPilot: boolean; investmentThesis: string; }
export interface LaunchReadinessCheck { id: string; category: string; status: 'passed' | 'pending' | 'failed'; metric: string; description: string; }