
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

export interface NegotiationMessage {
  id: string;
  sender: 'buyer' | 'ai_assistant' | 'owner';
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
