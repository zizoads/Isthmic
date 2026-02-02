
/**
 * Isthmic Pro - Sovereign AI Aggregator v6.0
 * PRUNED & MODULARIZED to reduce tech debt and circular dependencies.
 */

// Core AI Base
export { safeAICall, generateStructuredAI } from "./ai/base";

// specialized Forensic Services
export { performOsintInvestigationAI, checkTrademarkRiskAI } from "./ai/ForensicService";

// Market Discovery & Intelligence
export { 
  rigorousDiscoveryAI, 
  getDropSniperListAI, 
  analyzeSnipeOpportunityAI, 
  registrarInquiryAI, 
  findLocalBuyersAI 
} from "./ai/DiscoveryService";

// Deep Analysis & Strategy
export { 
  evaluateDomainExpertAI, 
  debateDomainStrategyAI, 
  generateExecutiveReportAI, 
  nexusPrimeIntelligenceAI 
} from "./ai/AnalysisService";

// Liquidation & Outreach
export { 
  optimizeAfternicListingAI, 
  harvestBulkLeadsAI, 
  analyzeMarketPulseAI, 
  generateLeadGenBlueprintAI, 
  generatePersonaPitchAI, 
  getAuctionIntelligenceAI 
} from "./ai/LiquidationService";

// Value Engineering
export { generateBrandIdentityAI, generateValueProofAI } from "./ai/ValueService";

// Market Signals (Legacy support pruned to direct call)
import { Type } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

export const getMarketSignalsAI = async (domainPart: string) => {
  return generateStructuredAI(
    'gemini-3-flash-preview',
    "Role: Real-time Market Pulse Analyzer. Grounding: ENABLED.",
    `Analyze sector momentum and pricing signals for keyword: "${domainPart}"`,
    {
      type: Type.OBJECT,
      properties: {
        signal: { type: Type.STRING, enum: ['BULLISH', 'NEUTRAL', 'BEARISH'] },
        momentumScore: { type: Type.NUMBER },
        reasoning: { type: Type.STRING }
      }
    },
    [{ googleSearch: {} }]
  );
};
