
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { supabase } from "../SupabaseClient";

/**
 * Discovery Cache Logic
 */
async function getCachedDiscovery(prompt: string) {
  const cleanPrompt = prompt.toLowerCase().trim();
  const { data } = await supabase
    .from('discovery_cache')
    .select('*')
    .eq('search_query', cleanPrompt)
    .single();

  if (data) {
    const cacheDate = new Date(data.created_at);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // تم تمديد صلاحية الكاش إلى 7 أيام لتقليل نداءات الـ API غير الضرورية
    if (diffDays <= 7) return data.results_json;
  }
  return null;
}

async function saveDiscoveryCache(prompt: string, results: any[]) {
  await supabase.from('discovery_cache').upsert({
    search_query: prompt.toLowerCase().trim(),
    results_json: results,
    created_at: new Date().toISOString()
  });
}

export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  const cached = await getCachedDiscovery(prompt);
  if (cached) {
    return { data: cached, cached: true };
  }

  // استخدام الموديل Flash بدلاً من Pro لتجنب أخطاء الـ Quota في عمليات التنقيب المتكررة
  const results = await generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
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

  if (results && results.length > 0) {
    await saveDiscoveryCache(prompt, results);
  }

  return { data: results, cached: false };
};

export const getDropSniperListAI = async (sector: string) => {
  return generateStructuredAI<any[]>(
    'gemini-3-flash-preview',
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
    'gemini-3-flash-preview',
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
