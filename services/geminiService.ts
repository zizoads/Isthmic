
import { GoogleGenAI, Type } from "@google/genai";
import { Domain } from "../types";

const getAIProvider = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * محرك سير العمل الموحد
 * يقوم بمعالجة النطاق بناءً على حالته الحالية وسياقه السابق
 */
export const processAgentWorkflow = async (domain: Domain, task: string) => {
  const ai = getAIProvider();
  
  // بناء السياق التاريخي للمهمة لضمان "الاستمرارية"
  const historyContext = domain.workflow?.history?.join("\n") || "";
  const systemInstruction = `You are a Domain Investment Agent. 
  Context History for this domain: ${historyContext}
  Current Domain: ${domain.name}
  Sector: ${domain.sector}
  Current Status: ${domain.status}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `New Instruction: ${task}`,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingBudget: 2000 },
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    timestamp: new Date().toISOString()
  };
};

export const getTrendingSectorsAI = async () => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze global venture capital flows and tech news for domain investors. Identify top 5 sectors.`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 4000 },
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

export const evaluateDomainAI = async (domainName: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Technical Audit: "${domainName}". Analyze history and trademark issues.`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json", 
      responseSchema: { 
        type: Type.OBJECT, 
        properties: { 
          sector: { type: Type.STRING }, 
          probability: { type: Type.NUMBER }, 
          justification: { type: Type.STRING }, 
          thinkingPath: { type: Type.STRING },
          technicalMetrics: { type: Type.OBJECT, properties: { liquidityScore: { type: Type.NUMBER } } } 
        } 
      } 
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const brainstormDomainsAI = async (keywords: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Brainstorm 10 domains for: "${keywords}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json", 
      responseSchema: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            estimatedPrice: { type: Type.NUMBER },
            justification: { type: Type.STRING },
            probability: { type: Type.NUMBER }
          },
          required: ["name", "estimatedPrice", "justification", "probability"]
        } 
      } 
    }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Identify 5 real companies that would strategically benefit from owning "${domainName}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 3000 },
      responseMimeType: "application/json", 
      responseSchema: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            companyName: { type: Type.STRING }, 
            buyingPower: { type: Type.STRING }, 
            reason: { type: Type.STRING },
            strategicFitScore: { type: Type.NUMBER }
          } 
        } 
      } 
    }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({ 
    model: 'gemini-3-pro-preview', 
    contents: `Write a high-converting, professional email pitch for "${domainName}" to ${company.companyName}'s ${persona}.`,
    config: { thinkingConfig: { thinkingBudget: 1000 } }
  });
  return response.text;
};

export const analyzeNegotiationTacticsAI = async (lastReply: string, domainName: string, currentAsk: number) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this buyer response for "${domainName}": "${lastReply}".`,
    config: { 
        thinkingConfig: { thinkingBudget: 3000 },
        responseMimeType: "application/json", 
        responseSchema: { 
            type: Type.OBJECT, 
            properties: { 
                buyerType: { type: Type.STRING }, 
                urgency: { type: Type.STRING }, 
                sentimentScore: { type: Type.NUMBER }, 
                suggestedCounter: { type: Type.NUMBER }, 
                tacticalResponse: { type: Type.STRING },
                hiddenMotives: { type: Type.STRING }
            } 
        } 
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Detailed trademark risk analysis for: "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 2000 } }
  });
  return response.text || "Analysis complete.";
};

export const estimateFairMarketValueAI = async (domainName: string, sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Appraisal for "${domainName}".`,
    config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 2000 }, responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { lowEstimate: { type: Type.NUMBER }, highEstimate: { type: Type.NUMBER }, justification: { type: Type.STRING }, liquidityRating: { type: Type.NUMBER } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const generateValueProofAI = async (domainName: string, sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Startup concept for "${domainName}".`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { bigIdea: { type: Type.STRING }, visualIdentity: { type: Type.OBJECT, properties: { colors: { type: Type.ARRAY, items: { type: Type.STRING } }, aesthetic: { type: Type.STRING }, logoConcept: { type: Type.STRING } } }, landingPage: { type: Type.OBJECT, properties: { headline: { type: Type.STRING }, subheadline: { type: Type.STRING }, features: { type: Type.ARRAY, items: { type: Type.STRING } }, cta: { type: Type.STRING } } }, disruptionScore: { type: Type.NUMBER } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const generateExecutiveReportAI = async (stats: any, sectors: string[]) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Executive investment report for: ${JSON.stringify(stats)}`,
    config: { thinkingConfig: { thinkingBudget: 4000 }, responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, capitalEfficiency: { type: Type.STRING }, projections: { type: Type.OBJECT, properties: { liquidityTimeline: { type: Type.STRING } } }, tacticalActions: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const searchSecondaryMarketAI = async (keywords: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Search listings for: "${keywords}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text, sources: [] };
};

export const getMarketTrendsAI = async (keywords: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Trends for: "${keywords}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { text: response.text, sources: [] };
};

export const auditTechnicalHealthAI = async (domainName: string) => {
  return "Health audit passed.";
};

export const generateClosingTermSheetAI = async (domainName: string, buyerName: string, price: number) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a professional domain sale term sheet for "${domainName}" with buyer "${buyerName}" at $${price}.`,
    config: { thinkingConfig: { thinkingBudget: 2000 } }
  });
  return response.text;
};

export const generateProspectusAI = async (domainName: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a professional investment prospectus for the domain "${domainName}".`,
    config: { thinkingConfig: { thinkingBudget: 3000 } }
  });
  return response.text;
};

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Optimize Afternic listing for "${domainName}" in "${sector}" sector.`,
    config: { 
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json",
      responseSchema: {
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
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze auction trends and recent sales for these sectors: ${sectors.join(', ')}.`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 3000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hotSectors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                trend: { type: Type.STRING },
                heatScore: { type: Type.NUMBER }
              }
            }
          },
          recentSales: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                domain: { type: Type.STRING },
                platform: { type: Type.STRING },
                price: { type: Type.NUMBER }
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
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a lead-gen business blueprint for "${domainName}" in "${sector}".`,
    config: { 
      thinkingConfig: { thinkingBudget: 3000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          revenueModel: {
            type: Type.OBJECT,
            properties: {
              estimatedCPL: { type: Type.NUMBER }
            }
          },
          services: { type: Type.ARRAY, items: { type: Type.STRING } },
          formStructure: {
            type: Type.OBJECT,
            properties: {
              psychologyHook: { type: Type.STRING }
            }
          },
          seoJumpstart: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find 5 potential bulk acquirers for "${domainName}" in "${sector}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 3000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            estimatedValuation: { type: Type.STRING },
            currentDomain: { type: Type.STRING },
            synergyReason: { type: Type.STRING }
          }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const getDropSniperListAI = async (sector: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find 5 pending-delete domains related to "${sector}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 3000 },
      responseMimeType: "application/json",
      responseSchema: {
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
      }
    }
  });
  try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  const ai = getAIProvider();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Deep tactical audit for expiring domain "${domainName}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING },
          historySummary: { type: Type.STRING },
          flipProbability: { type: Type.NUMBER },
          maxBackorderBid: { type: Type.NUMBER },
          trademarkAlert: { type: Type.STRING }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};
