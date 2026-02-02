
import { Type, GoogleGenAI } from "@google/genai";
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

// Fix: findLocalBuyersAI rewritten to follow Google Gemini Maps Grounding guidelines:
// 1. Use Gemini 2.5 series model as required for maps grounding functionality.
// 2. Do NOT set responseMimeType or responseSchema when using the googleMaps tool.
// 3. Extract place URLs and metadata from groundingChunks to display sources in the UI.
export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  // Fix: Initialize GoogleGenAI with process.env.API_KEY directly right before making the call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const toolConfig = lat && lng ? {
    retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
  } : undefined;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Maps grounding is only supported in Gemini 2.5 series models.
    contents: `Find potential local buyers for "${query}" near coordinates ${lat || 0}, ${lng || 0}. Identify real businesses that could benefit from this domain.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig
    }
  });

  // Fix: Return structured data including grounding chunks for URLs.
  return {
    text: response.text || "",
    // Must extract sources from groundingMetadata.groundingChunks to list URLs in the web app.
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
