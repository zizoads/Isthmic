
// Implement all missing AI service functions and ensure compliance with Google GenAI SDK guidelines.
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, NexusOpportunity, PlatformStats } from "../types";

// Always initialize GoogleGenAI inside a function to ensure the latest API key is used.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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

// OSINT investigation using Gemini 3 Pro
export const performOsintInvestigationAI = async (query: string, lang: 'ar' | 'en' = 'ar') => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute deep OSINT investigation for: ${query}. Analyze DNS history, associated emails, corporate records, and security threats. ALL OUTPUT IN ${lang === 'ar' ? 'ARABIC' : 'ENGLISH'}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatLevel: { type: Type.STRING, enum: ['Safe', 'Suspicious', 'Malicious'] },
            dnsSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
            associatedEntities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Companies or people found' },
            dataBreachAlert: { type: Type.BOOLEAN },
            forensicVerdict: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Market pulse analysis using Gemini 3 Pro
export const analyzeMarketPulseAI = async (sector: string, lang: 'ar' | 'en' = 'ar') => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform industrial intelligence sweep for the sector: ${sector}. Find recent domain sales (2024-2025) and M&A news. Determine if the market is BULLISH or BEARISH. ALL OUTPUT IN ${lang === 'ar' ? 'ARABIC' : 'ENGLISH'}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['BULLISH', 'STABLE', 'BEARISH'] },
            heatScore: { type: Type.NUMBER },
            recentComps: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  domain: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                }
              } 
            },
            strategicAdvice: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Generate promotional video using Veo model
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

// Find local buyers using Gemini 2.5 series (required for Google Maps grounding)
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

// Market discovery and domain extraction using Gemini 3 Pro
export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Strategic Market Mining: ${prompt}. Extract high-value domains with deep forensic and financial metadata. ALL FIELDS IN ${lang === 'ar' ? 'ARABIC' : 'ENGLISH'}.`,
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
              targetExitPrice: { type: Type.NUMBER },
              justification: { type: Type.STRING },
              probability: { type: Type.NUMBER },
              alphaScore: { type: Type.NUMBER },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  da: { type: Type.NUMBER },
                  spamScore: { type: Type.NUMBER },
                  backlinks: { type: Type.NUMBER },
                  trademarkRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] }
                }
              }
            }
          } 
        } 
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

// Evaluate domain expert using Gemini 3 Pro
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

// Generate brand identity using Gemini 3 Pro
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

// Check trademark risk using Gemini 3 Pro with Search
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

// Nexus Prime intelligence using Gemini 3 Pro with Search
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

// Generate executive report using Gemini 3 Pro
export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize a high-level executive report based on these portfolio stats: ${JSON.stringify(stats)} and sectors: ${sectors.join(', ')}.`,
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
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Added missing: registrarInquiryAI
export const registrarInquiryAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Verify the availability and current market value for the domain: ${domainName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            available: { type: Type.BOOLEAN },
            price: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"available": false, "price": 0}');
  });
};

// Added missing: findStrategicAcquirersAI
export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Identify 5 strategic companies that would be ideal buyers for ${domainName} in ${sector}. Include buying power and reasoning.`,
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

// Added missing: generatePersonaPitchAI
export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a cold outreach pitch to a ${persona} at ${company.companyName} proposing they acquire ${domainName}.`,
    });
    return response.text || "";
  });
};

// Added missing: getMarketSignalsAI
export const getMarketSignalsAI = async (sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Determine current market signals, momentum, and reasoning for the ${sector} industry.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, enum: ['BUY', 'HOLD', 'SELL'] },
            momentumScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Added missing: generateValueProofAI
export const generateValueProofAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Synthesize a high-value proof-of-concept for ${domainName} in ${sector}. Include big idea, visual identity, landing page structure, and disruption score.`,
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
                aesthetic: { type: Type.STRING }
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

// Added missing: optimizeAfternicListingAI
export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate marketplace optimization data for ${domainName} in ${sector}. Include registrar categories, keywords, search snippet, and pricing strategy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            searchSnippet: { type: Type.STRING },
            pricingStrategy: {
              type: Type.OBJECT,
              properties: {
                suggestedBuyNow: { type: Type.NUMBER },
                floorPrice: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

// Added missing: getAuctionIntelligenceAI
export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide auction market intelligence for sectors: ${sectors.join(', ')}. Include hot sectors, recent sales, and strategic alerts.`,
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
                  price: { type: Type.NUMBER },
                  platform: { type: Type.STRING }
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

// Added missing: generateLeadGenBlueprintAI
export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a lead generation business blueprint for ${domainName} in ${sector}. Include revenue model, services, conversion hook, and SEO plan.`,
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

// Added missing: harvestBulkLeadsAI
export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Harvest a bulk list of 10 strategic leads who would benefit from acquiring the lead-gen potential of ${domainName} in ${sector}.`,
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

// Added missing: getDropSniperListAI
export const getDropSniperListAI = async (sector: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Search for high-value domains expiring soon in the ${sector} sector.`,
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

// Added missing: analyzeSnipeOpportunityAI
export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform deep forensic audit and tactical intelligence for expiring domain: ${domainName}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ['Golden', 'Safe', 'Avoid'] },
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
