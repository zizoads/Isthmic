
/**
 * ISTHMIC PRO: SOVEREIGN AI GATEWAY (V3)
 * النسخة النهائية المطهرة من الـ Legacy
 */

// Export base utilities for use in other services
export { getAIClient, safeAICall } from "./ai/base";

export { performOsintInvestigationAI, checkTrademarkRiskAI } from "./ai/ForensicService";
export { rigorousDiscoveryAI, getDropSniperListAI, analyzeSnipeOpportunityAI, registrarInquiryAI } from "./ai/DiscoveryService";
export { evaluateDomainExpertAI, debateDomainStrategyAI, generateExecutiveReportAI, nexusPrimeIntelligenceAI } from "./ai/AnalysisService";
export { optimizeAfternicListingAI, harvestBulkLeadsAI, analyzeMarketPulseAI, generateLeadGenBlueprintAI, generatePersonaPitchAI } from "./ai/LiquidationService";
export { generateBrandIdentityAI, generateValueProofAI, generatePromoVideoAI } from "./ai/ValueService";

// Fix for missing members in PortfolioManager and AuctionWatchDashboard
export { getMarketSignalsAI, getAuctionIntelligenceAI } from "./geminiServiceLegacy";

// وظائف البحث الجغرافي تم دمجها هنا لضمان النقاء
import { getAIClient, safeAICall } from "./ai/base";
export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify businesses interested in "${query}" near ${lat}, ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: (lat !== undefined && lng !== undefined) ? { latitude: lat, longitude: lng } : undefined
          }
        }
      }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};
