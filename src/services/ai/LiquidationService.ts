
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { LeadProspect } from "../../types";

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  // Fix: Extract .data for the optimization console to prevent rendering errors
  const result = await generateStructuredAI<any>(
    'gemini-1.5-flash',
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
  return result.data;
};

/**
 * Corporate Prospecting Engine (Enhanced with Apollo/Hunter logic)
 */
export const harvestBulkLeadsAI = async (domainName: string, sector: string): Promise<LeadProspect[]> => {
  // Fix: Extract .data from the response to match Promise<LeadProspect[]> and fix 5-argument error
  const result = await generateStructuredAI<LeadProspect[]>(
    'gemini-1.5-flash',
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
  return result.data;
};

export const analyzeMarketPulseAI = async (sector: string, lang: 'en' = 'en') => {
  // Fix: Return .data for the market momentum chart to receive the structured pulse object
  const result = await generateStructuredAI<any>(
    'gemini-1.5-flash',
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
  return result.data;
};

export const generateLeadGenBlueprintAI = async (domainName: string, _sector: string) => {
  // Fix: Return .data for the value multiplier dashboard to fix data property access errors
  const result = await generateStructuredAI<any>(
    'gemini-1.5-flash',
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
  return result.data;
};

export const generatePersonaPitchAI = async (domainName: string, company: LeadProspect, persona: string): Promise<string> => {
  // Extract .data from the response to match Promise<string>
  const result = await generateStructuredAI<string>(
    'gemini-1.5-flash',
    "High-conversion sales writer.",
    `Draft pitch for ${domainName} targeting ${persona} at ${company.companyName}. 
     Synergy: ${company.synergyReason}. Profile context: ${company.jobTitle}. 
     Format as a short, punchy LinkedIn Message or cold email.`,
    { type: Type.STRING }
  );
  return result.data;
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  // Fix: Return .data for the auction watch dashboard to prevent undefined property errors
  const result = await generateStructuredAI<any>(
    'gemini-1.5-flash',
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
  return result.data;
};
