
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { StrategicObjective, CausalRejectionModel } from "../../types";
import { OrchestrationService } from "./OrchestrationService";

export const rigorousDiscoveryAI = async (
  prompt: string, 
  lang: 'en' = 'en', 
  signal?: AbortSignal,
  objectives: StrategicObjective[] = [],
  causalModels: CausalRejectionModel[] = []
) => {
  const strategicContext = OrchestrationService.injectStrategicContext(objectives);
  
  // Integrate causal logic into high-level instructions
  const causalContext = causalModels.length > 0 
    ? `\nCAUSAL INTELLIGENCE (LEARNED FROM PREVIOUS REJECTIONS):\n${causalModels.map(m => `- Logic: ${m.causalLogicChain} (Impact: ${m.severityIndex})`).join('\n')}`
    : "";

  return generateStructuredAI<any[]>(
    'gemini-1.5-flash',
    `Strategic Market Miner (Sovereign Core). 
     Your task: Find high-potential domains based on market gaps. 
     MANDATORY COMPLIANCE:
     ${strategicContext}
     ${causalContext}
     
     CRITICAL PRIORITY & ARCHITECTURAL NUCLEUS (SEMANTIC HAND-REG STRATEGY):
     1. STRICT TLD ENFORCEMENT: Only target ".com" extensions.
     2. COMPOSITION PHILOSOPHY: Focus on "Unconventional Semantic Pairings" (Clear Meaning but non-obvious combinations).
     3. LENGTH CONSTRAINT: Names MUST be short, ideally <= 10 characters (excluding .com).
     4. AVAILABILITY TARGET: Strictly target domains available for hand-registration ($10-$13). Use search tools to verify "The Overlooked Gap".
     5. VALUE PROPOSITION: Identify high-liquidity assets that have been missed by standard registry bots due to their specific semantic niche.
     6. TRAFFIC BONUS: Prioritize domains within this composition strategy that show existing traffic signals (Trust Signal).
     
     Scoring: Assign strategicAlignmentScore (0-100). Add a +25 point bonus for "Unconventional Semantic" .com composition (<= 10 chars) that is verified available for hand-reg.
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
          strategicAlignmentScore: { type: Type.NUMBER },
          trafficSignal: { 
            type: Type.STRING, 
            description: "Estimated traffic level: 'none', 'low', 'medium', 'high'" 
          },
          trafficSource: { 
            type: Type.STRING, 
            description: "Likely source of traffic (e.g., 'Type-in', 'Backlinks', 'Search')" 
          }
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
    'gemini-1.5-flash',
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
    'gemini-1.5-flash',
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
    'gemini-1.5-flash',
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
    'gemini-1.5-flash',
    "Expert local buyer scout.",
    `Find potential local buyers for "${query}" near coordinates ${lat || 0}, ${lng || 0}.`,
    {
      type: Type.OBJECT,
      properties: {
        text: { type: Type.STRING },
        sources: { type: Type.ARRAY, items: { type: Type.OBJECT } }
      }
    },
    [{ googleMaps: {} }],
    { toolConfig }
  );

  return {
    text: res.data.text || "",
    sources: res.grounding || []
  };
};
