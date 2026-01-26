
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, PlatformStats } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Nexus Prime v2: The Sovereign Strategic Intelligence
 */
export const nexusPrimeIntelligenceAI = async (mode: string, context: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `SYSTEM: Act as Nexus Prime v2.
    MISSION: High-fidelity autonomous investment synthesis.
    MODE: ${mode}
    CONTEXT: ${context}
    
    INSTRUCTIONS:
    1. Cross-reference disparate data points from search grounding.
    2. Deduce FMV, DA, and SEO history via "Deep DNA Forensics".
    3. Forecast keyword liquidity using temporal signal analysis.
    
    Return JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 15000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysisVerdict: { type: Type.STRING },
          strategicRiskAssessment: { type: Type.STRING },
          opportunities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedValue: { type: Type.STRING },
                probability: { type: Type.NUMBER },
                temporalSignal: { type: Type.STRING },
                marketGapScore: { type: Type.NUMBER },
                aiDeduction: { type: Type.STRING },
                suggestedAction: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const rigorousDiscoveryAI = async (prompt: string, thesis: string = "") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Sniper Discovery: thesis: "${thesis}", prompt: "${prompt}". JSON.`,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json", 
        responseSchema: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              estimatedPrice: { type: Type.NUMBER },
              justification: { type: Type.STRING },
              probability: { type: Type.NUMBER },
              marketData: {
                type: Type.OBJECT,
                properties: {
                  comparableSale: { type: Type.STRING },
                  searchVolume: { type: Type.STRING },
                  historyStatus: { type: Type.STRING }
                }
              },
              verifiedMetrics: {
                type: Type.OBJECT,
                properties: {
                  isAvailable: { type: Type.BOOLEAN },
                  historyClean: { type: Type.BOOLEAN },
                  marketMatch: { type: Type.STRING }
                }
              }
            }
          } 
        } 
      }
    });
    return JSON.parse(response.text || '[]');
  } catch { return []; }
};

export const evaluateDomainExpertAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Forensic audit: "${domainName}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 8000 },
      responseMimeType: "application/json", 
      responseSchema: { 
        type: Type.OBJECT, 
        properties: { 
          sector: { type: Type.STRING }, 
          probability: { type: Type.NUMBER }, 
          justification: { type: Type.STRING }, 
          thinkingPath: { type: Type.STRING },
          technicalMetrics: { 
            type: Type.OBJECT, 
            properties: { 
              liquidityScore: { type: Type.NUMBER },
              da: { type: Type.NUMBER },
              backlinks: { type: Type.NUMBER },
              trademarkRisk: { type: Type.STRING },
              dnaForensics: { type: Type.STRING }
            } 
          } 
        } 
      } 
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Risk audit: "${domainName}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text || "Safe";
};

export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Targeting leads for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Pitch for ${domainName} to ${persona} at ${company.companyName}.`,
  });
  return response.text || "";
};

export const analyzeNegotiationTacticsAI = async (lastReply: string, domain: string, currentAsk: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze: "${lastReply}" for ${domain}.`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const estimateFairMarketValueAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Value estimate for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const auditTechnicalHealthAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Health audit: "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return {}; }
};

export const generateValueProofAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Proof concept: "${domainName}".`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Listing metadata: "${domainName}".`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Market heat: ${sectors.join(',')}.`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `LeadGen plan: "${domainName}".`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return {}; }
};

export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Lead harvest: "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

export const getDropSniperListAI = async (sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Drops in ${sector}.`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

export const analyzeSnipeOpportunityAI = async (domain: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Snipe audit: "${domain}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Memo for: ${JSON.stringify(stats)}.`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};
