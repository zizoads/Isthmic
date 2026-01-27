
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, PlatformStats } from "../types";

// Initialization using the environment variable as per security guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robust wrapper for AI calls to handle rate limits (429) and network errors.
 * Implements exponential backoff retry logic.
 */
async function safeCall<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error.message?.includes('429') || error.status === 429 || error.code === 429;
    
    if (retries > 0 && isQuotaError) {
      console.warn(`[Gemini API] Quota exceeded (429). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeCall(fn, retries - 1, delay * 2);
    }
    
    // Throw descriptive error for the UI to handle
    if (isQuotaError) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    throw error;
  }
}

/**
 * Generate Visual Brand Identity
 */
export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Act as a world-class brand strategist. Create a professional brand DNA for the domain "${domainName}" in the "${sector}" sector. Suggest a primary hex color and a powerful tagline.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryColor: { type: Type.STRING, description: "Hex code for brand" },
            tagline: { type: Type.STRING, description: "Short, punchy brand tagline" },
            logoPrompt: { type: Type.STRING, description: "Detailed prompt for logo generation" }
          }
        }
      }
    });
    
    const brandData = JSON.parse(response.text || '{}');
    
    const logoGenResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ text: `Professional minimalist vector logo for "${domainName}", ${brandData.logoPrompt}, clean flat design, white background, high resolution.` }] 
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    let logoUrl = '';
    if (logoGenResponse.candidates?.[0]?.content?.parts) {
      for (const part of logoGenResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          logoUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return { 
      primaryColor: brandData.primaryColor,
      tagline: brandData.tagline,
      logoUrl 
    };
  });
};

/**
 * Market Sentiment Analysis
 */
export const getMarketSignalsAI = async (keyword: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze current market demand and commercial sentiment for the domain keyword: "${keyword}". Use real-time data.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, description: "BUY, HOLD, or SELL" },
            reasoning: { type: Type.STRING },
            momentumScore: { type: Type.NUMBER },
            newsCatalysts: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Sniper Discovery
 */
export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = getAI();
    const langInst = lang === 'ar' ? "ALL FIELDS IN ARABIC." : "ALL FIELDS IN ENGLISH.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Tactical Discovery Request: ${prompt}. Search for available .com domains. ${langInst}`,
      config: { 
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 8000 },
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
            }
          } 
        } 
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

/**
 * Domain Forensic Audit
 */
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep forensic audit for the domain "${domainName}". Check commercial potential and sector relevance.`,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            justification: { type: Type.STRING },
            valuationContext: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Nexus Prime Protocol
 */
export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en' = 'ar') => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `NEXUS PRIME PROTOCOL ACTIVE. Mode: ${mode}. Context: ${context}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
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
                  description: { type: Type.STRING },
                  estimatedValue: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  marketGapScore: { type: Type.NUMBER },
                  aiDeduction: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze IP and trademark risks for "${domainName}" using Google Search grounding.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text;
  });
};

export const generateExecutiveReportAI = async (stats: any, sectors: any) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize an Executive Portfolio Report. Stats: ${JSON.stringify(stats)}, Sectors: ${JSON.stringify(sectors)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            capitalEfficiency: { type: Type.STRING },
            projections: { type: Type.OBJECT, properties: { liquidityTimeline: { type: Type.STRING } } },
            tacticalActions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const analyzeNegotiationTacticsAI = async (lastReply: string, domain: string, currentAsk: number) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze negotiation message for domain ${domain} (Ask: $${currentAsk}): "${lastReply}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hiddenMotives: { type: Type.STRING },
            buyerType: { type: Type.STRING },
            sentimentScore: { type: Type.NUMBER },
            suggestedCounter: { type: Type.NUMBER },
            tacticalResponse: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateValueProofAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a business value proof for domain "${domainName}" in "${sector}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bigIdea: { type: Type.STRING },
            visualIdentity: {
              type: Type.OBJECT,
              properties: {
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                aesthetic: { type: Type.STRING },
                logoConcept: { type: Type.STRING }
              }
            },
            disruptionScore: { type: Type.NUMBER },
            landingPage: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Identify 5 strategic corporate acquirers for the domain "${domainName}" in the "${sector}" sector. Provide details on their buying power and strategic synergy reasoning.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              buyingPower: { type: Type.STRING, description: "High or Medium" },
              reason: { type: Type.STRING, description: "Strategic synergy reasoning" }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Write a highly persuasive, professional sales pitch for the domain "${domainName}" targeting the ${persona} at ${company.companyName}. Explain the strategic advantage.`,
    });
    return response.text;
  });
};

export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Optimize a sales listing for "${domainName}" on Afternic/GoDaddy. Sector: ${sector}. Include pricing strategy, categories, keywords, and search snippet.`,
      config: {
        tools: [{ googleSearch: {} }],
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
    return JSON.parse(response.text || '{}');
  });
};

export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze domain auction liquidity and trends for these sectors: ${sectors.join(', ')}. Provide recent sales data and tactical alerts.`,
      config: {
        tools: [{ googleSearch: {} }],
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
    return JSON.parse(response.text || '{}');
  });
};

export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a Lead-Gen revenue blueprint for the domain "${domainName}" in the "${sector}" niche.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revenueModel: {
              type: Type.OBJECT,
              properties: { estimatedCPL: { type: Type.NUMBER } }
            },
            services: { type: Type.ARRAY, items: { type: Type.STRING } },
            formStructure: {
              type: Type.OBJECT,
              properties: { psychologyHook: { type: Type.STRING } }
            },
            seoJumpstart: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Harvest bulk corporate leads (companies) that would benefit from acquiring "${domainName}" in the "${sector}" niche.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              currentDomain: { type: Type.STRING },
              estimatedValuation: { type: Type.STRING },
              synergyReason: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const getDropSniperListAI = async (sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Scan for high-value domains about to expire (dropping) in the "${sector}" sector. Provide a list of opportunities with drop dates, authority, and value.`,
      config: {
        tools: [{ googleSearch: {} }],
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
    return JSON.parse(response.text || '[]');
  });
};

export const analyzeSnipeOpportunityAI = async (domain: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep tactical audit for a dropping domain opportunity: "${domain}". Assess risks, trademark alerts, history, and flip potential.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "Golden or High-Risk" },
            historySummary: { type: Type.STRING },
            flipProbability: { type: Type.NUMBER },
            maxBackorderBid: { type: Type.NUMBER },
            trademarkAlert: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};
