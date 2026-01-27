
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, NexusOpportunity, PlatformStats } from "../types";

/**
 * Helper to handle retry logic for quota errors
 */
async function safeCall<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error.message?.includes('429') || error.status === 429;
    if (retries > 0 && isQuotaError) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeCall(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * محرك المناظرة الاستراتيجية: يقوم وكيلان بتحليل النطاق
 */
export const debateDomainStrategyAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a multi-agent debate for the domain: ${domainName}. 
      Agent 1 (Strategist): Argument for high ROI and market flip potential.
      Agent 2 (Auditor): Argument for risks, trademark issues, and liquidity concerns.
      Final Verdict: Consolidated executive recommendation.
      ALL OUTPUT IN ${lang === 'ar' ? 'ARABIC' : 'ENGLISH'}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategistView: { type: Type.STRING },
            auditorView: { type: Type.STRING },
            riskScore: { type: Type.NUMBER, description: "0-100" },
            comparableSales: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  domain: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                }
              } 
            },
            finalVerdict: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * البحث المعمق عن المشترين الاستراتيجيين باستخدام الخرائط والبحث
 */
export const findStrategicAcquirersAI = async (domainName: string, sector: string, lang: 'ar' | 'en' = 'ar') => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Identify 5 global corporate entities that are currently expanding in the ${sector} sector and would derive strategic value from owning ${domainName}. 
      Explain the synergy for each. Language: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              synergyReason: { type: Type.STRING },
              buyingPower: { type: Type.STRING, enum: ['High', 'Medium', 'Critical'] },
              headquarters: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

/**
 * تنفيذ تحقيق OSINT عميق للتحقق من تاريخ النطاق
 */
export const performOsintInvestigationAI = async (query: string, lang: 'ar' | 'en' = 'ar') => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute deep forensic OSINT investigation for: ${query}. Analyze history, DNS footprints, and security reputation. Output in ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatLevel: { type: Type.STRING, enum: ['Safe', 'Suspicious', 'Malicious'] },
            dnsSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
            associatedEntities: { type: Type.ARRAY, items: { type: Type.STRING } },
            dataBreachAlert: { type: Type.BOOLEAN },
            forensicVerdict: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * تنقيب السوق الاستراتيجي باستخدام البحث المعمق
 */
export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform high-stakes market mining for domain opportunities based on: ${prompt}. Language: ${lang}.`,
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
              sector: { type: Type.STRING },
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
 * تقييم النطاق بواسطة خبير استثماري
 */
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform forensic investment audit for domain: ${domainName}. Language: ${lang}.`,
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
                da: { type: Type.NUMBER },
                pa: { type: Type.NUMBER },
                spamScore: { type: Type.NUMBER }
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
 * فحص مخاطر العلامات التجارية
 */
export const checkTrademarkRiskAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Assess trademark risk for the domain "${domainName}". Provide a risk level: Safe, Low, Medium, or High.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const risk = response.text || 'Medium';
    if (risk.includes('Safe')) return 'Safe';
    if (risk.includes('Low')) return 'Low';
    if (risk.includes('High')) return 'High';
    return 'Medium';
  });
};

/**
 * التحقق من توافر النطاق عبر المسجلين
 */
export const registrarInquiryAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Verify real-time registration status and retail price for ${domainName}.`,
      config: {
        tools: [{ googleSearch: {} }],
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

/**
 * توليد عرض مخصص للمشترين بناءً على الشخصية
 */
export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft a high-conversion sales pitch for ${domainName} targeting the ${persona} at ${company.companyName}. Synergy: ${company.synergyReason || company.reason}.`,
    });
    return response.text || '';
  });
};

/**
 * توليد الهوية البصرية والعلامة التجارية للنطاق
 */
export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a cohesive brand identity for ${domainName} in the ${sector} industry.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tagline: { type: Type.STRING },
            logoUrl: { type: Type.STRING, description: "A simulated logo placeholder" },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * الحصول على إشارات السوق الحالية لكلمة مفتاحية
 */
export const getMarketSignalsAI = async (domainPart: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Retrieve current market trends and search momentum for "${domainPart}".`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, enum: ['BULLISH', 'NEUTRAL', 'BEARISH'] },
            momentumScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * توليد إثبات القيمة (Landing Page & Strategy)
 */
export const generateValueProofAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Architect a compelling value proof artifact for ${domainName} in ${sector}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bigIdea: { type: Type.STRING },
            landingPage: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING }
              }
            },
            visualIdentity: {
              type: Type.OBJECT,
              properties: {
                colors: { type: Type.ARRAY, items: { type: Type.STRING } }
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
 * تحسين إدراج النطاق في أسواق البيع
 */
export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Optimize registrar metadata for ${domainName} within the ${sector} market.`,
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
 * رادار المزادات وذكاء التدفق المالي
 */
export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Retrieve live domain auction intelligence for these sectors: ${sectors.join(', ')}.`,
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

/**
 * توليد مخطط عمل لتوليد الرصاص (Lead Gen)
 */
export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Design a lead generation engine blueprint for ${domainName} specializing in ${sector}.`,
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

/**
 * حصاد المشترين المحتملين بالجملة
 */
export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform high-volume corporate prospecting for ${domainName} within the ${sector} industry.`,
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
 * قائمة قناص السقوط للنطاقات المنتهية
 */
export const getDropSniperListAI = async (sector: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Search for high-authority domains expiring or dropping soon in the ${sector} niche.`,
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
 * تحليل دقيق لفرصة القنص (Drop Snipe)
 */
export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform deep historical and risk audit for dropping domain: ${domainName}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ['Golden', 'Standard', 'Risky'] },
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
 * توليد تقرير تنفيذي شامل للمحفظة
 */
export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft an executive investment report for a domain portfolio. Stats: ${JSON.stringify(stats)}. Sectors: ${sectors.join(', ')}.`,
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

/**
 * ذكاء نكسس برايم (Nexus Prime Core)
 */
export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en') => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute Nexus Prime protocol in ${mode} mode. Context: ${context}. Output Language: ${lang}.`,
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

/**
 * البحث عن مشترين محليين باستخدام الخرائط والبحث الموثق
 */
export const findLocalBuyersAI = async (query: string, lat?: number, lng?: number) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify businesses and entities interested in "${query}" near these coordinates: ${lat}, ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: (lat !== undefined && lng !== undefined) ? { latitude: lat, longitude: lng } : undefined
          }
        }
      }
    });
    return {
      text: response.text || '',
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};

/**
 * تحليل نبض السوق لقطاع معين
 */
export const analyzeMarketPulseAI = async (sector: string, lang: 'ar' | 'en') => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform real-time market pulse analysis for the ${sector} domain market. Language: ${lang}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['BULLISH', 'NEUTRAL', 'BEARISH'] },
            heatScore: { type: Type.NUMBER },
            strategicAdvice: { type: Type.STRING },
            recentComps: {
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
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * توليد فيديو ترويجي للنطاق باستخدام Veo
 */
export const generatePromoVideoAI = async (domainName: string, context: string) => {
  return safeCall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using Veo requires API key selection verification
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic promotional sequence for ${domainName}. Context: ${context}. 4K feel, dynamic motion.`,
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
    return `${downloadLink}&key=${process.env.API_KEY}`;
  });
};
