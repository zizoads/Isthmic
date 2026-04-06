
import { AgentThought } from './agents';
import { NegotiationThread } from './negotiation';

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
  integrityScore?: number;
  financials?: DomainFinancials;
  contentStatus?: 'none' | 'draft' | 'published';
  lastChecked?: string;
  agentThoughts?: AgentThought[];
  trafficSignal?: 'none' | 'low' | 'medium' | 'high';
  trafficSource?: string;
}
