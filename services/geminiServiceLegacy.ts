
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./ai/base";
import { PlatformStats } from "../types";

export const findStrategicAcquirersAI = async (domainName: string, sector: string, lang: 'ar' | 'en' = 'ar') => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Identify 5 global corporate entities for ${domainName} in ${sector}. Language: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              synergyReason: { type: Type.STRING },
              buyingPower: { type: Type.STRING, enum: ['High', 'Medium', 'Critical'] },
              headquarters: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft sales pitch for ${domainName} to ${persona} at ${company.companyName}.`,
    });
    return response.text || '';
  });
};

export const getMarketSignalsAI = async (domainPart: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Market trends for "${domainPart}".`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, enum: ['BULLISH', 'NEUTRAL', 'BEARISH'] },
            momentumScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Auction intel for: ${sectors.join(', ')}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hotSectors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, heatScore: { type: Type.NUMBER }, trend: { type: Type.STRING } } } },
            recentSales: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { domain: { type: Type.STRING }, price: { type: Type.NUMBER }, platform: { type: Type.STRING } } } },
            strategicAlerts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sector: { type: Type.STRING }, action: { type: Type.STRING }, reason: { type: Type.STRING } } } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Lead-gen blueprint for ${domainName} in ${sector}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revenueModel: { type: Type.OBJECT, properties: { estimatedCPL: { type: Type.NUMBER } } },
            services: { type: Type.ARRAY, items: { type: Type.STRING } },
            formStructure: { type: Type.OBJECT, properties: { psychologyHook: { type: Type.STRING } } },
            seoJumpstart: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit dropping domain: ${domainName}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ['Golden', 'Standard', 'Risky'] },
            historySummary: { type: Type.STRING },
            flipProbability: { type: Type.NUMBER },
            maxBackorderBid: { type: Type.NUMBER },
            trademarkAlert: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Executive report for stats: ${JSON.stringify(stats)}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            capitalEfficiency: { type: Type.STRING },
            projections: { type: Type.OBJECT, properties: { liquidityTimeline: { type: Type.STRING } } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en') => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Nexus Prime ${mode}. Context: ${context}. Lang: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
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
                  marketGapScore: { type: Type.NUMBER }, 
                  aiDeduction: { type: Type.STRING } 
                } 
              } 
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Local buyers for "${query}" near ${lat}, ${lng}.`,
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
