
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Domain, NexusOpportunity, PlatformStats } from "../types";

// Helper to initialize the GenAI client with the environment API Key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utility for safe API calls with retry logic for quota errors
async function safeCall<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error.message?.includes('429') || error.status === 429 || error.code === 429;
    if (retries > 0 && isQuotaError) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeCall(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Function Calling: Domain Registrar Checker
 */
const checkAvailabilityDeclaration: FunctionDeclaration = {
  name: 'checkDomainAvailability',
  parameters: {
    type: Type.OBJECT,
    description: 'Check if a domain is available and its real-time registration price.',
    properties: {
      domain: { type: Type.STRING, description: 'The domain name to check.' },
    },
    required: ['domain'],
  },
};

export const registrarInquiryAI = async (domain: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute formal registrar inquiry for ${domain}. Use your tools.`,
      config: {
        tools: [{ functionDeclarations: [checkAvailabilityDeclaration] }],
      }
    });

    if (response.functionCalls) {
      const call = response.functionCalls[0];
      if (call.name === 'checkDomainAvailability') {
        // Simulated response from a real registrar API
        return { 
          available: true, 
          price: 12.99, 
          currency: 'USD',
          registrar: 'Namecheap (Direct Sync)'
        };
      }
    }
    return { available: false, price: 0 };
  });
};

/**
 * Maps Grounding: Local Buyer Discovery
 */
export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find businesses that would benefit from this domain: ${query}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
          }
        }
      }
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};

/**
 * Tactical Discovery: Scans the market for domain opportunities
 */
export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Tactical Discovery: ${prompt}. ALL FIELDS IN ${lang === 'ar' ? 'ARABIC' : 'ENGLISH'}.`,
      config: { 
        tools: [{ googleSearch: {} }],
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
 * Domain Expert Audit: Deep forensic analysis of a domain
 */
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Audit ${domainName}.`,
      config: { 
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            justification: { type: Type.STRING },
            technicalMetrics: {
                type: Type.OBJECT,
                properties: {
                    liquidityScore: { type: Type.NUMBER }
                }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Brand DNA Engineering: Generates color schemes and taglines
 */
export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create DNA for ${domainName} in ${sector}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryColor: { type: Type.STRING },
            tagline: { type: Type.STRING },
            logoUrl: { type: Type.STRING, description: "A simulated placeholder URL for the logo asset." }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Trademark Risk Check: Analyzes IP potential conflicts
 */
export const checkTrademarkRiskAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Check global trademark risk for ${domainName}. Provide a short risk summary.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "Risk analysis unavailable.";
  });
};

/**
 * Strategic Acquirer Search: Finds potential corporate buyers
 */
export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Find strategic buyers for ${domainName} in the ${sector} industry.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              buyingPower: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

/**
 * Persona-based Pitch Generation: Creates customized sales messages
 */
export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a high-converting sales pitch for ${domainName} to ${company.companyName} targeting a ${persona}. Tone should be formal and data-driven.`,
    });
    return response.text || "";
  });
};

/**
 * Negotiation Tactic Analysis: Deconstructs buyer psychology
 */
export const analyzeNegotiationTacticsAI = async (lastReply: string, domain: string, currentAsk: number) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this negotiation reply for ${domain}: "${lastReply}". Our current ask is $${currentAsk}.`,
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

/**
 * Market Signal Monitoring: Tracks sector momentum and trends
 */
export const getMarketSignalsAI = async (keyword: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze current market momentum for the sector: ${keyword}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] },
            reasoning: { type: Type.STRING },
            momentumScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Value Proof Concept: Generates visual and business logic prototypes
 */
export const generateValueProofAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a Value Proof concept for ${domainName} in ${sector}.`,
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

/**
 * Registrar Listing Optimizer: Prepares domains for global marketplaces
 */
export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Optimize Afternic/GoDaddy listing for ${domainName} in ${sector}.`,
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
  });
};

/**
 * Auction Intelligence: Real-time tracking of domain sales and sector heat
 */
export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide auction intelligence for sectors: ${sectors.join(", ")}.`,
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

/**
 * Business Model Blueprinting: Plans lead-generation and SEO strategies
 */
export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a Lead-Gen Blueprint for ${domainName} in ${sector}.`,
      config: {
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
            seoJumpstart: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 weekly SEO action items." }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Bulk Prospect Harvesting: Extracts large sets of synergy leads from the web
 */
export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Harvest bulk prospect leads for ${domainName} in ${sector}.`,
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
  });
};

/**
 * Expired List Retrieval: Scans for high-value dropping assets
 */
export const getDropSniperListAI = async (sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Scan for high-value dropping domains in the ${sector} niche.`,
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

/**
 * Snipe Opportunity Analysis: Forensic check on pending drop assets
 */
export const analyzeSnipeOpportunityAI = async (domain: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform deep forensic analysis on the pending drop asset: ${domain}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ['Golden', 'High Pot', 'Risky', 'Skip'] },
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

/**
 * Sovereign Executive Memo Synthesis: Consolidates portfolio and market data
 */
export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize a Sovereign Executive Memo based on these stats: ${JSON.stringify(stats)} and active sectors: ${sectors.join(", ")}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            capitalEfficiency: { type: Type.STRING },
            projections: {
              type: Type.OBJECT,
              properties: {
                liquidityTimeline: { type: Type.STRING }
              }
            },
            tacticalActions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * Nexus Prime Protocol: Specialized multi-mode intelligence extraction
 */
export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en') => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Nexus Prime Protocol [Mode: ${mode}]. Context: ${context}. ALL OUTPUT IN ${lang === 'ar' ? 'ARABIC' : 'ENGLISH'}.`,
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
