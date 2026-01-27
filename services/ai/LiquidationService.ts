
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Optimize registrar metadata for ${domainName} in ${sector}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pricingStrategy: {
              type: Type.OBJECT,
              properties: {
                suggestedBuyNow: { type: Type.NUMBER },
                floorPrice: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              }
            },
            categories: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            searchSnippet: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform high-stakes corporate prospecting for ${domainName} in ${sector}. Identify top-tier acquirers.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              estimatedValuation: { type: Type.STRING },
              currentDomain: { type: Type.STRING },
              synergyReason: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Design a high-yield lead generation engine blueprint for ${domainName}.`,
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

export const analyzeMarketPulseAI = async (sector: string, lang: 'ar' | 'en') => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze live market pulse for ${sector}. Lang: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['BULLISH', 'NEUTRAL', 'BEARISH'] },
            heatScore: { type: Type.NUMBER },
            strategicAdvice: { type: Type.STRING },
            recentComps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { domain: { type: Type.STRING }, price: { type: Type.NUMBER } }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a high-conversion sales pitch for ${domainName} to ${persona} at ${company.companyName}. Synergy: ${company.synergyReason}.`,
    });
    return response.text || '';
  });
};
