
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// جديد: تقدير القيمة السوقية العادلة (FMV) بناءً على خوارزميات GitHub المفتوحة
export const estimateFairMarketValueAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a senior domain appraiser. Calculate the Fair Market Value (FMV) for "${domainName}" in the "${sector}" niche.
    Consider:
    1. Character count and readability.
    2. TLD (.com premium).
    3. Search volume of keywords.
    4. Recent comps.
    Return a JSON with: lowEstimate, highEstimate, justification, and liquidityRating (1-10).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lowEstimate: { type: Type.NUMBER },
          highEstimate: { type: Type.NUMBER },
          justification: { type: Type.STRING },
          liquidityRating: { type: Type.NUMBER }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

// جديد: فحص الصحة التقنية (DNS/MX/History Audit)
export const auditTechnicalHealthAI = async (domainName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the technical reputation of "${domainName}". 
    Check for potential blacklisting history, previous use cases, and SEO health. 
    Search for any historical data that could negatively impact investment value.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

export const getComparableSalesAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find recent actual sales prices of domain names similar to "${domainName}" in the ${sector} industry. 
    Look for data from NameBio, DNJournal, or Sedo sales reports. 
    Provide a list of 3-5 comparable sales with prices and dates.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: sources.map((c: any) => c.web?.uri).filter(Boolean)
  };
};

export const getMarketTrendsAI = async (sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the current investment momentum for the "${sector}" industry. 
    Is there an increase in VC funding, startup launches, or M&A activity? 
    Rate the liquidity on a scale of 1-10 for domain assets in this niche.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: sources.map((c: any) => c.web?.uri).filter(Boolean)
  };
};

export const brainstormDomainsAI = async (keywords: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 10 high-liquidity .com domains for "${keywords}". Focus on short, brandable assets. Return JSON array.`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const evaluateDomainAI = async (domainName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Strategic Professional Audit: "${domainName}". Assess: Market value, Liquidity score, and End-user demand.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sector: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          potentialClients: { type: Type.ARRAY, items: { type: Type.STRING } },
          justification: { type: Type.STRING },
          technicalMetrics: {
            type: Type.OBJECT,
            properties: {
              da: { type: Type.NUMBER },
              backlinks: { type: Type.NUMBER },
              liquidityScore: { type: Type.NUMBER },
              trademarkRisk: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const generateProspectusAI = async (domain: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Detailed Investment Prospectus for "${domain.name}". Sector ${domain.sector}, Price $${domain.price}.`,
  });
  return response.text;
};

export const findLinkedInLeadsAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Identify 3 potential LinkedIn lead profiles for "${domainName}" in ${sector}. Return JSON.`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const generateSmartOutreachAI = async (domainName: string, lead: any, sector: string, tone: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Professional pitch for "${domainName}" to ${lead.name}. Tone: ${tone}.`,
  });
  return response.text;
};

export const suggestNegotiationCounter = async (lastReply: string, currentAsk: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Counter-offer strategy for: "${lastReply}". Current ask: $${currentAsk}.`,
    config: { responseMimeType: "application/json" }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};
