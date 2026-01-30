
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { PlatformStats } from "../../types";
import { supabase } from "../SupabaseClient";

/**
 * Sovereign Cache Engine
 * Checks if a domain has been audited recently to prevent redundant API calls.
 */
async function checkCache(domainName: string) {
  const { data } = await supabase
    .from('domain_cache')
    .select('*')
    .eq('domain_name', domainName.toLowerCase())
    .single();

  if (data) {
    const cacheDate = new Date(data.created_at);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Cache is valid for 7 days
    if (diffDays <= 7) return data.result_json;
  }
  return null;
}

async function updateCache(domainName: string, result: any) {
  await supabase.from('domain_cache').upsert({
    domain_name: domainName.toLowerCase(),
    result_json: result,
    created_at: new Date().toISOString()
  });
}

/**
 * Returns { data: any, cached: boolean }
 */
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal): Promise<any> => {
  // 1. Try to fetch from Sovereign Cache first
  const cached = await checkCache(domainName);
  if (cached) {
    console.log(`ISTHMIC_CACHE: Hit for ${domainName}. Skipping API.`);
    return { data: cached, cached: true };
  }

  // 2. If not in cache, call Gemini
  const result = await generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `You are a forensic domain auditor. Language: ${lang}. Analyze SEO, brand potential, and exit velocity.`,
    `Audit: ${domainName}. Ground research in live data.`,
    {
      type: Type.OBJECT,
      properties: {
        sector: { type: Type.STRING },
        probability: { type: Type.NUMBER },
        justification: { type: Type.STRING },
        technicalMetrics: {
          type: Type.OBJECT,
          properties: {
            da: { type: Type.NUMBER },
            pa: { type: Type.NUMBER },
            spamScore: { type: Type.NUMBER },
            backlinks: { type: Type.NUMBER }
          }
        }
      }
    },
    [{ googleSearch: {} }],
    signal
  );

  // 3. Save to cache for future users
  if (result && !result.error) {
    await updateCache(domainName, result);
  }

  return { data: result, cached: false };
};

export const debateDomainStrategyAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Multi-agent debate engine between Aggressive VC and Risk Auditor. Language: ${lang}`,
    `Debate acquisition strategy for: ${domainName}`,
    {
      type: Type.OBJECT,
      properties: {
        strategistView: { type: Type.STRING },
        auditorView: { type: Type.STRING },
        riskScore: { type: Type.NUMBER },
        finalVerdict: { type: Type.STRING },
        comparableSales: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              price: { type: Type.NUMBER }
            }
          }
        }
      }
    },
    [{ googleSearch: {} }]
  );
};

export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    "C-Suite investment strategist reporting engine.",
    `Generate memo for portfolio: ${JSON.stringify(stats)}. Focus: ${sectors.join(', ')}`,
    {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        capitalEfficiency: { type: Type.STRING },
        projections: { type: Type.OBJECT, properties: { liquidityTimeline: { type: Type.STRING } } }
      }
    }
  );
};

export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: string) => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Nexus Prime Intelligence. Mode: ${mode}. Language: ${lang}`,
    `Execute deep intelligence for context: ${context}`,
    {
      type: Type.OBJECT,
      properties: {
        analysisVerdict: { type: Type.STRING },
        strategicRiskAssessment: { type: Type.STRING },
        opportunities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              estimatedValue: { type: Type.STRING },
              description: { type: Type.STRING },
              aiDeduction: { type: Type.STRING },
              probability: { type: Type.NUMBER },
              marketGapScore: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  );
};
