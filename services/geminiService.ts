
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, PlatformStats } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generate Visual Brand Identity
 */
export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex brand identity generation
    model: 'gemini-3-pro-preview',
    contents: `Create a brand identity for "${domainName}" in "${sector}". Suggest hex colors and a tagline.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primaryColor: { type: Type.STRING },
          tagline: { type: Type.STRING },
          logoPrompt: { type: Type.STRING }
        }
      }
    }
  });
  const data = JSON.parse(response.text || '{}');
  
  // Call image model for logo using gemini-2.5-flash-image as recommended
  const logoResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Professional minimalist logo for "${domainName}", ${data.logoPrompt}, flat design, vector style.` }] }
  });

  let logoBase64 = '';
  // Correctly iterate through parts to find inlineData
  if (logoResponse.candidates?.[0]?.content?.parts) {
    for (const part of logoResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        logoBase64 = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  return { ...data, logoUrl: logoBase64 };
};

/**
 * Analyze Market Sentiment & Trading Signals
 */
export const getMarketSignalsAI = async (keyword: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze current market sentiment for domain keyword "${keyword}". Provide a trading signal (BUY/HOLD/SELL) and reasoning.`,
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
};

/**
 * Sniper Discovery for high-value domains
 */
export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  const ai = getAI();
  const langInst = lang === 'ar' ? "ALL TEXT FIELDS MUST BE IN ARABIC." : "ALL TEXT FIELDS MUST BE IN ENGLISH.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Sniper Discovery: ${prompt}. ${langInst} JSON.`,
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
  } catch (e) { return []; }
};

/**
 * Expert domain evaluation with grounding
 * Fixed: Added signal parameter to support AbortController
 */
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Audit the following domain name for commercial value and market demand: "${domainName}".`,
    config: { 
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sector: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          justification: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * Identify potential strategic acquirers
 */
export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Identify 5 potential corporate buyers for the domain "${domainName}" in the "${sector}" industry.`,
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
            reason: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

/**
 * High-level intelligence for Nexus Prime mode
 */
export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en' = 'ar') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Nexus Prime Intelligence Report: Mode: ${mode}, Context: ${context}`,
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
};

/**
 * Quick trademark risk check
 */
export const checkTrademarkRiskAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze trademark risks for the domain name: "${domainName}" using Google Search grounding.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

/**
 * Generate executive portfolio report
 */
export const generateExecutiveReportAI = async (stats: any, sectors: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a high-level executive report based on these stats: ${JSON.stringify(stats)} and sectors: ${JSON.stringify(sectors)}`,
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
};

/**
 * Fix: Added missing export generatePersonaPitchAI
 */
export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a highly personalized and compelling email pitch for selling "${domainName}" to ${company.companyName}. Target the ${persona} and mention synergy reason: ${company.reason}.`,
  });
  return response.text;
};

/**
 * Fix: Added missing export analyzeNegotiationTacticsAI
 */
export const analyzeNegotiationTacticsAI = async (lastReply: string, domain: string, currentAsk: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this domain negotiation message: "${lastReply}". The domain is ${domain} and the current asking price is $${currentAsk}.`,
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
};

/**
 * Fix: Added missing export generateValueProofAI
 */
export const generateValueProofAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a compelling value proof deck for the domain "${domainName}" in the "${sector}" niche.`,
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
};

/**
 * Fix: Added missing export optimizeAfternicListingAI
 */
export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Optimize a sales listing for Afternic and GoDaddy for "${domainName}" in "${sector}".`,
    config: {
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
};

/**
 * Fix: Added missing export getAuctionIntelligenceAI
 */
export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Gather global domain auction market intelligence for these sectors: ${sectors.join(', ')}.`,
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
};

/**
 * Fix: Added missing export generateLeadGenBlueprintAI
 */
export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a lead-generation business blueprint for using the domain "${domainName}" in "${sector}".`,
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
};

/**
 * Fix: Added missing export harvestBulkLeadsAI
 */
export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find 10 high-value corporate leads who would be the perfect strategic buyers for "${domainName}" (${sector}).`,
    config: {
      tools: [{ googleSearch: {} }],
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
  return JSON.parse(response.text || '[]');
};

/**
 * Fix: Added missing export getDropSniperListAI
 */
export const getDropSniperListAI = async (sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Search for high-authority domains about to expire or drop in the "${sector}" niche.`,
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
};

/**
 * Fix: Added missing export analyzeSnipeOpportunityAI
 */
export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Conduct a deep forensic and market analysis for the dropping domain name: "${domainName}".`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, description: "Golden or Standard" },
          historySummary: { type: Type.STRING },
          flipProbability: { type: Type.NUMBER },
          maxBackorderBid: { type: Type.NUMBER },
          trademarkAlert: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
