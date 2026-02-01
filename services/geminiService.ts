
export { safeAICall } from "./ai/base";
export { performOsintInvestigationAI, checkTrademarkRiskAI } from "./ai/ForensicService";
export { rigorousDiscoveryAI, getDropSniperListAI, analyzeSnipeOpportunityAI, registrarInquiryAI, findLocalBuyersAI } from "./ai/DiscoveryService";
export { evaluateDomainExpertAI, debateDomainStrategyAI, generateExecutiveReportAI, nexusPrimeIntelligenceAI } from "./ai/AnalysisService";
export { optimizeAfternicListingAI, harvestBulkLeadsAI, analyzeMarketPulseAI, generateLeadGenBlueprintAI, generatePersonaPitchAI, getAuctionIntelligenceAI } from "./ai/LiquidationService";
export { generateBrandIdentityAI, generateValueProofAI } from "./ai/ValueService";

// Market Signals functionality migrated from legacy
import { Type } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

export const getMarketSignalsAI = async (domainPart: string) => {
  return generateStructuredAI(
    'gemini-3-flash-preview',
    "Market trend analyzer.",
    `Analyze trends for "${domainPart}"`,
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