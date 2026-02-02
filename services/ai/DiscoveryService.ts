
import { Type, GoogleGenAI } from "@google/genai";
import { generateStructuredAI } from "./base";
import { StrategicObjective, CausalRejectionModel } from "../../types";
import { OrchestrationService } from "./OrchestrationService";

export const rigorousDiscoveryAI = async (
  prompt: string, 
  lang: 'ar' | 'en' = 'ar', 
  signal?: AbortSignal,
  objectives: StrategicObjective[] = [],
  causalModels: CausalRejectionModel[] = [] // استخدام الذاكرة السببية
) => {
  const strategicContext = OrchestrationService.injectStrategicContext(objectives);
  
  // دمج المنطق السببي في التعليمات العليا
  const causalContext = causalModels.length > 0 
    ? `\nCAUSAL INTELLIGENCE (LEARNED FROM PREVIOUS REJECTIONS):\n${causalModels.map(m => `- Logic: ${m.causalLogicChain} (Impact: ${m.severityIndex})`).join('\n')}`
    : "";

  return generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
    `Strategic Market Miner (Sovereign Core). 
     Your task: Find high-potential domains based on market gaps. 
     MANDATORY COMPLIANCE:
     ${strategicContext}
     ${causalContext}
     
     Scoring: Assign strategicAlignmentScore (0-100) based on Objectives synergy.
     Language: ${lang}`,
    `Execute deep acquisition sweep for: ${prompt}.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          estimatedPrice: { type: Type.NUMBER },
          sector: { type: Type.STRING },
          justification: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          strategicAlignmentScore: { type: Type.NUMBER }
        }
      }
    },
    [{ googleSearch: {} }],
    undefined,
    signal
  );
};

export const getDropSniperListAI = async (
  sector: string, 
  objectives: StrategicObjective[] = []
) => {
  const strategicContext = OrchestrationService.injectStrategicContext(objectives);
  const res = await generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
    `Domain drop scouting agent. Neural Link Active: ${strategicContext}`,
    `Find domains about to drop in ${sector}. Rank by Strategic Alignment.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          estimatedValue: { type: Type.NUMBER },
          dropDate: { type: Type.STRING },
          backorderPlatform: { type: Type.STRING },
          reasonToSnipe: { type: Type.STRING },
          strategicAlignmentScore: { type: Type.NUMBER }
        }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  const res = await generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Expert drop analyzer.",
    `Analyze value for ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING, enum: ['Golden', 'Silver', 'Bronze', 'Trash'] },
        flipProbability: { type: Type.NUMBER },
        maxBackorderBid: { type: Type.NUMBER },
        tacticalIntelligence: { type: Type.STRING }
      }
    }
  );
  return res.data;
};

export const registrarInquiryAI = async (domainName: string) => {
  const res = await generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Real-time registrar status scout.",
    `Check availability and price for ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        available: { type: Type.BOOLEAN },
        price: { type: Type.NUMBER }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};

export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const toolConfig = lat && lng ? {
    retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
  } : undefined;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Find potential local buyers for "${query}" near coordinates ${lat || 0}, ${lng || 0}.`,
    config: { tools: [{ googleMaps: {} }], toolConfig }
  });
  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
