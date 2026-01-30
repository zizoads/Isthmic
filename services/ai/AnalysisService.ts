
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { PlatformStats } from "../../types";
import { supabase } from "../SupabaseClient";

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
    
    // صلاحية الكاش لـ 14 يوم لتقليل النداءات المتكررة لنفس النطاقات
    if (diffDays <= 14) return data.result_json;
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

export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal): Promise<any> => {
  const cached = await checkCache(domainName);
  if (cached) return { data: cached, cached: true };

  // استخدام Flash للتدقيق الأولي لزيادة سقف العمليات المسموح به قبل الوصول لـ Quota Exceeded
  const result = await generateStructuredAI<any>(
    'gemini-3-flash-preview',
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

  if (result && !result.error) {
    await updateCache(domainName, result);
  }

  return { data: result, cached: false };
};

export const debateDomainStrategyAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview', // الحفاظ على Pro للمناظرات المعقدة فقط
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
    'gemini-3-flash-preview',
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
    'gemini-3-flash-preview',
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
