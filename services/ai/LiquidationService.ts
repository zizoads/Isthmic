
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { LeadProspect } from "../../types";

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  return generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Registrar metadata optimizer.",
    `Optimize ${domainName} for Afternic in ${sector}.`,
    {
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
  );
};

/**
 * Corporate Prospecting Engine (Enhanced with Apollo/Hunter logic)
 */
export const harvestBulkLeadsAI = async (domainName: string, sector: string): Promise<LeadProspect[]> => {
  return generateStructuredAI<LeadProspect[]>(
    'gemini-3-flash-preview',
    `Corporate prospecting engine. 
     Mission: Identify high-ticket acquirers and their key decision makers.
     Context: Using integrated datasets from LinkedIn/Apollo.`,
    `Harvest 5 key strategic leads for ${domainName} in the ${sector} industry. 
     Include: Decision maker names, job titles, and LinkedIn-ready synergy logic.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          estimatedValuation: { type: Type.STRING },
          currentDomain: { type: Type.STRING },
          synergyReason: { type: Type.STRING },
          decisionMaker: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          linkedinUrl: { type: Type.STRING },
          contactEmail: { type: Type.STRING }
        }
      }
    },
    [{ googleSearch: {} }]
  );
};

export const analyzeMarketPulseAI = async (sector: string, lang: 'ar' | 'en') => {
  return generateStructuredAI<any>(
    'gemini-3-flash-preview',
    `Market momentum analyzer. Language: ${lang}.`,
    `Analyze pulse for ${sector}.`,
    {
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
    },
    [{ googleSearch: {} }]
  );
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Business model architect.",
    `Design blueprint for ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        revenueModel: { type: Type.OBJECT, properties: { estimatedCPL: { type: Type.NUMBER } } },
        services: { type: Type.ARRAY, items: { type: Type.STRING } },
        formStructure: { type: Type.OBJECT, properties: { psychologyHook: { type: Type.STRING } } },
        seoJumpstart: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  );
};

export const generatePersonaPitchAI = async (domainName: string, company: LeadProspect, persona: string) => {
  return generateStructuredAI<string>(
    'gemini-3-flash-preview',
    "High-conversion sales writer.",
    `Draft pitch for ${domainName} targeting ${persona} at ${company.companyName}. 
     Synergy: ${company.synergyReason}. Profile context: ${company.jobTitle}. 
     Format as a short, punchy LinkedIn Message or cold email.`,
    { type: Type.STRING }
  );
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  return generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Auction market intelligence scout.",
    `Analyze auction trends and recent sales for: ${sectors.join(', ')}.`,
    {
      type: Type.OBJECT,
      properties: {
        hotSectors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              heatScore: { type: Type.NUMBER },
              trend: { type: Type.STRING }
            }
          }
        },
        recentSales: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              price: { type: Type.NUMBER },
              platform: { type: Type.STRING }
            }
          }
        },
        strategicAlerts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sector: { type: Type.STRING },
              action: { type: Type.STRING },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    },
    [{ googleSearch: {} }]
  );
};
