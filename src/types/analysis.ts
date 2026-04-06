
export interface AlignmentReport {
  alignmentScore: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  reasoning: string;
  suggestedAdjustment: string;
  timestamp?: string;
}

export interface StrategicObjective {
  id: string;
  category: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: 'TRACKING' | 'AT_RISK' | 'DEVIATED' | 'ACHIEVED';
  weight: number;
  linkedServices: string[];
  evaluationPrompt: string;
  lastEvaluated: string;
  alignmentHistory: AlignmentReport[];
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
  status: 'synthesized' | 'pending';
  sections: ReportSection[];
}

export interface AutomaticFix {
  id: string;
  description: string;
  patch: string;
  confidence: number;
  before: string;
  after: string;
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
  technicalDebt: {
    debtHours: number;
    debtCost: number;
    criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  findings: any[];
  improvementRoadmap: any[];
  impactReport?: FixImpactReport;
  automaticFixes?: AutomaticFix[];
}

export interface ProblemCatalog {
  institutionalHealthIndex: number;
  patterns: any[];
  lastUpdated: string;
  totalFilesAnalyzed: number;
}
