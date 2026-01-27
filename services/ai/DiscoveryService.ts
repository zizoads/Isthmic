
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";

export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Strategic Market Mining: ${prompt}. Lang: ${lang}. Find untapped alpha assets.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              estimatedPrice: { type: Type.NUMBER },
              sector: { type: Type.STRING },
              justification: { type: Type.STRING },
              probability: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const getDropSniperListAI = async (sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Hunt for high-authority dropped domains in ${sector}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              dropDate: { type: Type.STRING },
              estimatedAuthority: { type: Type.NUMBER },
              estimatedValue: { type: Type.NUMBER },
              reasonToSnipe: { type: Type.STRING },
              backorderPlatform: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute deep sniper audit for dropping domain: ${domainName}. Calculate flip probability.`,
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

export const registrarInquiryAI = async (domainName: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Verify real-time status and retail price for ${domainName}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            available: { type: Type.BOOLEAN },
            price: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"available": false, "price": 0}');
  });
};
