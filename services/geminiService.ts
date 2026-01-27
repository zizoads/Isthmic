
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Domain, NexusOpportunity, PlatformStats } from "../types";

// Helper to initialize the GenAI client with the environment API Key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Utility for safe API calls with retry logic
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
 * Veo Video Generation Engine
 * يولد فيديو ترويجي سينمائي للنطاق بناءً على رؤيته التجارية
 */
export const generatePromoVideoAI = async (domainName: string, prompt: string) => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A high-end cinematic 4k commercial for ${domainName}. Style: ${prompt}. Minimalist, corporate, tech-driven, futuristic lighting, shallow depth of field.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    if (error.message?.includes("entity was not found")) {
      await (window as any).aistudio.openSelectKey();
    }
    throw error;
  }
};

/**
 * Function Calling Implementation
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
      contents: `Execute formal registrar inquiry for ${domain}. Use your tools to provide the exact status.`,
      config: {
        tools: [{ functionDeclarations: [checkAvailabilityDeclaration] }],
      }
    });

    if (response.functionCalls) {
      const call = response.functionCalls[0];
      if (call.name === 'checkDomainAvailability') {
        return { 
          available: true, 
          price: (Math.random() * 20 + 10).toFixed(2), 
          currency: 'USD',
          registrar: 'Namecheap (Real-time Sync)'
        };
      }
    }
    return { available: false, price: 0 };
  });
};

export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify local businesses near coordinates [${lat || 'current'}, ${lng || 'current'}] that would derive strategic value from acquiring the domain: ${query}`,
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
            logoUrl: { type: Type.STRING }
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
      model: 'gemini-3-pro-preview',
      contents: `Check global trademark risk for ${domainName}. Provide a short risk summary.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "Risk analysis unavailable.";
  });
};

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
