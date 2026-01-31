
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";

export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
    `Strategic Market Miner. Task: Find high-potential domains based on current market gaps. Lang: ${lang}`,
    `Execute deep search for: ${prompt}`,
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
    undefined,
    signal
  );
};

export const getDropSniperListAI = async (sector: string) => {
  const res = await generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
    "Domain drop scouting agent.",
    `Find domains about to drop in the ${sector} industry.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          estimatedValue: { type: Type.NUMBER },
          dropDate: { type: Type.STRING },
          backorderPlatform: { type: Type.STRING },
          reasonToSnipe: { type: Type.STRING }
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
  const toolConfig = lat && lng ? {
    retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
  } : undefined;

  const res = await generateStructuredAI<any>(
    'gemini-3-pro-preview', // Maps grounding usually needs pro
    "Geographic Targeter. Find real businesses needing this domain.",
    `Find potential local buyers for "${query}" near coordinates ${lat}, ${lng}.`,
    {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING },
        sources: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              maps: { 
                type: Type.OBJECT, 
                properties: { 
                  uri: { type: Type.STRING }, 
                  title: { type: Type.STRING } 
                } 
              } 
            } 
          } 
        }
      }
    },
    [{ googleMaps: {} }],
    toolConfig
  );
  return res.data;
};
