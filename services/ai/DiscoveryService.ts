
import { Type, GoogleGenAI } from "@google/genai";
import { generateStructuredAI } from "./base";
import { StrategicObjective, RejectionPattern } from "../../types";
import { OrchestrationService } from "./OrchestrationService";

export const rigorousDiscoveryAI = async (
  prompt: string, 
  lang: 'ar' | 'en' = 'ar', 
  signal?: AbortSignal,
  objectives: StrategicObjective[] = [],
  rejectionPatterns: RejectionPattern[] = [] // حقن ذاكرة الرفض
) => {
  // 1. بناء السياق الاستراتيجي العصبي
  const strategicContext = OrchestrationService.injectStrategicContext(objectives);
  
  // 2. دمج ذاكرة الرفض في التعليمات العليا لمنع تكرار الأخطاء
  const rejectionContext = rejectionPatterns.length > 0 
    ? `\nLEARNED NEGATIVE PATTERNS (CRITICAL - DO NOT REPEAT):\n${rejectionPatterns.map(p => `- Rejected: ${p.reason} (Sector: ${p.sector})`).join('\n')}`
    : "";

  return generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
    `Strategic Market Miner (Sovereign Core). 
     Your task: Find high-potential domains based on market gaps. 
     MANDATORY COMPLIANCE:
     ${strategicContext}
     ${rejectionContext}
     
     Scoring: Assign strategicAlignmentScore (0-100) based on how well the asset fits the provided Objectives.
     Language: ${lang}`,
    `Execute deep acquisition sweep for: ${prompt}. Evaluate synergy with objectives.`,
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
          strategicAlignmentScore: { type: Type.NUMBER, description: "Alignment with Commander Intent (0-100)" }
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
    `Find domains about to drop in the ${sector} industry. Rank by Strategic Alignment.`,
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
    contents: `Find potential local buyers for "${query}" near coordinates ${lat || 0}, ${lng || 0}. Identify real businesses that could benefit from this domain.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig
    }
  });

  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
