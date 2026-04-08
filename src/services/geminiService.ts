
/**
 * Isthmic Pro - Sovereign AI Aggregator v7.0 (FINAL)
 * Cleaned, Optimized, and Modularized for Production.
 */

// Core Base
export { safeAICall, generateStructuredAI } from "./ai/base";

// Forensic & OSINT
export { performOsintInvestigationAI, checkTrademarkRiskAI } from "./ai/ForensicService";

// Market & Discovery
export { 
  rigorousDiscoveryAI, 
  getDropSniperListAI, 
  analyzeSnipeOpportunityAI, 
  registrarInquiryAI, 
  findLocalBuyersAI 
} from "./ai/DiscoveryService";

// Analysis & Executive
export { 
  evaluateDomainExpertAI, 
  debateDomainStrategyAI, 
  generateExecutiveReportAI, 
  nexusPrimeIntelligenceAI 
} from "./ai/AnalysisService";

// Liquidation & Scaling
export { 
  optimizeAfternicListingAI, 
  harvestBulkLeadsAI, 
  analyzeMarketPulseAI, 
  generateLeadGenBlueprintAI, 
  generatePersonaPitchAI, 
  getAuctionIntelligenceAI 
} from "./ai/LiquidationService";

// Identity & Proofing
export { generateBrandIdentityAI, generateValueProofAI } from "./ai/ValueService";

import { Type } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

export const getMarketSignalsAI = async (domainPart: string) => {
  const result = await generateStructuredAI(
    'gemini-1.5-flash',
    "Role: Market Signals Analyzer.",
    `Analyze pricing signals for: "${domainPart}"`,
    {
      type: Type.OBJECT,
      properties: {
        signal: { type: Type.STRING },
        momentumScore: { type: Type.NUMBER },
        reasoning: { type: Type.STRING }
      }
    },
    [{ googleSearch: {} }]
  );
  return result.data;
};
