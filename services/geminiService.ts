
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// جديد: تحديد القطاعات الأكثر سخونة في السوق حالياً
export const getTrendingSectorsAI = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze global venture capital flows, tech news, and domain secondary market reports for this week. 
    Identify the top 5 sectors with the highest liquidity and "alpha" potential for domain investors.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            growthScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["sector", "growthScore", "reasoning", "suggestedKeywords"]
        }
      }
    }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

// جديد: توليد التقرير التنفيذي الشامل
export const generateExecutiveReportAI = async (stats: any, sectors: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As a Senior Investment Analyst, synthesize the following platform data into a board-ready Executive Report.
    Stats: ${JSON.stringify(stats)}
    Active Sectors: ${sectors.join(', ')}
    
    Structure the report with:
    1. Executive Summary (The 'Alpha' perspective).
    2. Capital Utilization Efficiency.
    3. Market Momentum & Sector Heat Analysis.
    4. Risk-Adjusted Return Projections (12-24 months).
    5. Tactical Recommendations for next month.
    
    Return as structured JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          capitalEfficiency: { type: Type.STRING },
          sectorInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          projections: { 
            type: Type.OBJECT, 
            properties: { 
              expectedROI: { type: Type.STRING }, 
              liquidityTimeline: { type: Type.STRING } 
            } 
          },
          tacticalActions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "capitalEfficiency", "sectorInsights", "projections", "tacticalActions"]
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const getDropSniperListAI = async (sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Identify high-value .com domains in 'Pending Delete' for "${sector}".`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { domain: { type: Type.STRING }, dropDate: { type: Type.STRING }, estimatedAuthority: { type: Type.NUMBER }, estimatedValue: { type: Type.NUMBER }, backorderPlatform: { type: Type.STRING }, reasonToSnipe: { type: Type.STRING } } } }
    }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit dropping domain "${domainName}".`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { verdict: { type: Type.STRING }, historySummary: { type: Type.STRING }, trademarkAlert: { type: Type.STRING }, maxBackorderBid: { type: Type.NUMBER }, flipProbability: { type: Type.NUMBER } } }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Metadata for "${domainName}" in "${sector}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { pricingStrategy: { type: Type.OBJECT, properties: { suggestedBuyNow: { type: Type.NUMBER }, floorPrice: { type: Type.NUMBER }, reasoning: { type: Type.STRING } } }, categories: { type: Type.ARRAY, items: { type: Type.STRING } }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } }, searchSnippet: { type: Type.STRING } } }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Trends for: ${sectors.join(', ')}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { hotSectors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, trend: { type: Type.STRING }, heatScore: { type: Type.NUMBER } } } }, recentSales: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { domain: { type: Type.STRING }, platform: { type: Type.STRING }, price: { type: Type.NUMBER } } } }, strategicAlerts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sector: { type: Type.STRING }, action: { type: Type.STRING }, reason: { type: Type.STRING } } } } } }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Leads for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { companyName: { type: Type.STRING }, currentDomain: { type: Type.STRING }, targetPersona: { type: Type.STRING }, synergyReason: { type: Type.STRING }, estimatedValuation: { type: Type.STRING } } } } }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Blueprint for "${domainName}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { services: { type: Type.ARRAY, items: { type: Type.STRING } }, formStructure: { type: Type.OBJECT, properties: { fields: { type: Type.ARRAY, items: { type: Type.STRING } }, psychologyHook: { type: Type.STRING } } }, revenueModel: { type: Type.OBJECT, properties: { estimatedCPL: { type: Type.NUMBER }, monthlyTarget: { type: Type.STRING } } }, seoJumpstart: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Acquirers for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { companyName: { type: Type.STRING }, buyingPower: { type: Type.STRING }, reason: { type: Type.STRING } } } } }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const evaluateDomainAI = async (domainName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit: "${domainName}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { sector: { type: Type.STRING }, probability: { type: Type.NUMBER }, justification: { type: Type.STRING }, technicalMetrics: { type: Type.OBJECT, properties: { liquidityScore: { type: Type.NUMBER } } } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const brainstormDomainsAI = async (keywords: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Domains for "${keywords}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const getMarketTrendsAI = async (sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Trends for "${sector}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean) || [] };
};

export const searchSecondaryMarketAI = async (keywords: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Search listings for "${keywords}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean) || [] };
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Trademark for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

export const analyzeNegotiationTacticsAI = async (lastEmail: string, domainName: string, currentAsk: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Negotiation for "${domainName}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { buyerType: { type: Type.STRING }, urgency: { type: Type.STRING }, suggestedCounter: { type: Type.NUMBER }, tacticalResponse: { type: Type.STRING }, sentimentScore: { type: Type.NUMBER } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Pitch for "${domainName}" to ${persona} @ ${company.companyName}.`,
  });
  return response.text;
};

export const generateClosingTermSheetAI = async (domainName: string, finalPrice: number, buyerName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Terms for "${domainName}" @ $${finalPrice} to "${buyerName}".`,
  });
  return response.text;
};

export const generateProspectusAI = async (domain: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Prospectus for "${domain.name}".`,
  });
  return response.text;
};

export const auditTechnicalHealthAI = async (domainName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

export const estimateFairMarketValueAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Appraisal for "${domainName}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { lowEstimate: { type: Type.NUMBER }, highEstimate: { type: Type.NUMBER }, justification: { type: Type.STRING }, liquidityRating: { type: Type.NUMBER } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const generateValueProofAI = async (domainName: string, sector: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Proof for "${domainName}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { bigIdea: { type: Type.STRING }, visualIdentity: { type: Type.OBJECT, properties: { colors: { type: Type.ARRAY, items: { type: Type.STRING } }, aesthetic: { type: Type.STRING }, logoConcept: { type: Type.STRING } } }, landingPage: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, subheadline: { type: Type.STRING }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, cta: { type: Type.STRING } } }, disruptionScore: { type: Type.NUMBER } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};
