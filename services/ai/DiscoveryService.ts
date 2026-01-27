
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";

export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return generateStructuredAI<any[]>(
    'gemini-3-pro-preview',
    `You are a strategic market miner. Language: ${lang}. Found alpha assets based on deep web research.`,
    `Execute sweep for: ${prompt}`,
    {
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
    },
    [{ googleSearch: {} }],
    signal
  );
};

export const getDropSniperListAI = async (sector: string) => {
  return generateStructuredAI<any[]>(
    'gemini-3-pro-preview',
    "Elite drop-catching intelligence agent.",
    `Hunt for high-authority dropped domains in ${sector}.`,
    {
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
    },
    [{ googleSearch: {} }]
  );
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    "Forensic sniper auditor.",
    `Deep audit for dropping domain: ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING, enum: ['Golden', 'Standard', 'Risky'] },
        historySummary: { type: Type.STRING },
        flipProbability: { type: Type.NUMBER },
        maxBackorderBid: { type: Type.NUMBER },
        trademarkAlert: { type: Type.STRING }
      }
    },
    [{ googleSearch: {} }]
  );
};

export const registrarInquiryAI = async (domainName: string) => {
  return generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Real-time registrar liaison.",
    `Verify real-time status and price for ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        available: { type: Type.BOOLEAN },
        price: { type: Type.NUMBER }
      }
    },
    [{ googleSearch: {} }]
  );
};

export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  return generateStructuredAI<any>(
    'gemini-2.5-flash',
    "Geographic market specialist.",
    `Identify local buyers for ${query} near ${lat}, ${lng}.`,
    {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING },
        sources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { maps: { type: Type.OBJECT, properties: { uri: { type: Type.STRING }, title: { type: Type.STRING } } } } } }
      }
    },
    [{ googleMaps: {} }]
  );
};
