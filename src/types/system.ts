
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

export interface CausalRejectionModel {
  patternId: string;
  reason: string;
  causalLogicChain: string;
  timestamp: string;
  sector: string;
  severityIndex: number;
}

export interface PlatformStrategy {
  id: string;
  totalBudget: number;
  investmentThesis: string;
  adaptiveThresholdEnabled: boolean;
  causalRejectionModels?: CausalRejectionModel[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: any;
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
