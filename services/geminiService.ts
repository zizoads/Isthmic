
import { GoogleGenAI, Type } from "@google/genai";
import { Domain, PlatformStats } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Nexus Prime v2: The Sovereign Strategic Intelligence
 */
export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en' = 'ar') => {
  const ai = getAI();
  const langInst = lang === 'ar' ? "RESPONSES MUST BE IN ARABIC." : "RESPONSES MUST BE IN ENGLISH.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `SYSTEM: Act as Nexus Prime v2. ${langInst}
    MISSION: High-fidelity autonomous investment synthesis.
    MODE: ${mode}
    CONTEXT: ${context}
    
    Return JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 15000 },
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
                temporalSignal: { type: Type.STRING },
                marketGapScore: { type: Type.NUMBER },
                aiDeduction: { type: Type.STRING },
                suggestedAction: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return null; }
};

/**
 * Rigorous Discovery: Sniper search for domain opportunities
 */
export const rigorousDiscoveryAI = async (prompt: string, lang: 'ar' | 'en' = 'ar') => {
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
              probability: { type: Type.NUMBER },
              marketData: {
                type: Type.OBJECT,
                properties: {
                  comparableSale: { type: Type.STRING },
                  searchVolume: { type: Type.STRING },
                  historyStatus: { type: Type.STRING }
                }
              },
              verifiedMetrics: {
                type: Type.OBJECT,
                properties: {
                  isAvailable: { type: Type.BOOLEAN },
                  historyClean: { type: Type.BOOLEAN },
                  marketMatch: { type: Type.STRING }
                }
              }
            }
          } 
        } 
      }
    });
    return JSON.parse(response.text || '[]');
  } catch { return []; }
};

/**
 * Expert Evaluation: Forensic audit of a specific domain
 */
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  const ai = getAI();
  const langInst = lang === 'ar' ? "ALL TEXT FIELDS MUST BE IN ARABIC." : "ALL TEXT FIELDS MUST BE IN ENGLISH.";
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Forensic audit: "${domainName}". ${langInst}`,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 8000 },
      responseMimeType: "application/json", 
      responseSchema: { 
        type: Type.OBJECT, 
        properties: { 
          sector: { type: Type.STRING }, 
          probability: { type: Type.NUMBER }, 
          justification: { type: Type.STRING }, 
          thinkingPath: { type: Type.STRING },
          technicalMetrics: { 
            type: Type.OBJECT, 
            properties: { 
              liquidityScore: { type: Type.NUMBER },
              da: { type: Type.NUMBER },
              backlinks: { type: Type.NUMBER },
              trademarkRisk: { type: Type.STRING },
              dnaForensics: { type: Type.STRING }
            } 
          } 
        } 
      } 
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Trademark Risk Check: Audits legal safety of a domain
 */
export const checkTrademarkRiskAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Check trademark risks for the domain: "${domainName}". Be thorough.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text || "No risk data found.";
};

/**
 * Strategic Outreach: Finds potential acquirers for a domain
 */
export const findStrategicAcquirersAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find high-intent corporate acquirers for the domain "${domainName}" in the ${sector} sector.`,
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
  try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

/**
 * Persona Pitch: Generates a tailored sales pitch
 */
export const generatePersonaPitchAI = async (domainName: string, company: any, persona: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a compelling sales pitch for the domain "${domainName}" targeting the ${persona} at ${company.companyName}. Mention why it's a strategic fit based on their current market position.`,
  });
  return response.text;
};

/**
 * Negotiation Analysis: Provides tactical advice for sales conversations
 */
export const analyzeNegotiationTacticsAI = async (lastReply: string, domain: string, currentAsk: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this buyer response for the domain "${domain}" (Ask: $${currentAsk}): "${lastReply}"`,
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
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Valuation Estimation: Calculates fair market price
 */
export const estimateFairMarketValueAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Estimate fair market value for "${domainName}" in the ${sector} sector using real comps.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lowEstimate: { type: Type.NUMBER },
          highEstimate: { type: Type.NUMBER },
          liquidityRating: { type: Type.NUMBER }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Technical Health Audit: Scans history and metrics
 */
export const auditTechnicalHealthAI = async (domainName: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a technical health audit for "${domainName}". Check history and SEO authority.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return response.text;
};

/**
 * Value Proof: Generates a brand concept for a domain
 */
export const generateValueProofAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a disruptive business concept and landing page blueprint for "${domainName}" in the ${sector} sector.`,
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
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Marketplace Optimization: Optimizes listings for Afternic/GoDaddy
 */
export const optimizeAfternicListingAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Optimize an Afternic listing for "${domainName}" (${sector}). Suggest pricing and keywords.`,
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
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Auction Intelligence: Tracks market trends and recent sales
 */
export const getAuctionIntelligenceAI = async (sectors: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze current auction trends and recent sales in these sectors: ${sectors.join(', ')}.`,
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
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Lead-Gen Blueprint: Engineers a revenue model for a domain
 */
export const generateLeadGenBlueprintAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Engineer a lead-generation revenue blueprint for the domain "${domainName}" in the ${sector} sector.`,
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
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Bulk Leads: Harvests potential bulk buyers
 */
export const harvestBulkLeadsAI = async (domainName: string, sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Harvest bulk corporate leads who would have a synergy with "${domainName}" (${sector}).`,
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
  try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

/**
 * Drop Sniper List: Identifies expiring domains
 */
export const getDropSniperListAI = async (sector: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find a list of high-value pending-delete domains in the ${sector} sector.`,
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
  try { return JSON.parse(response.text || '[]'); } catch { return []; }
};

/**
 * Snipe Analysis: Tactical audit for a drop opportunity
 */
export const analyzeSnipeOpportunityAI = async (domain: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Tactical audit for the expiring domain "${domain}". Assess IP risks and flip potential.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, description: "e.g. Golden, Silver, Risky" },
          historySummary: { type: Type.STRING },
          flipProbability: { type: Type.NUMBER },
          maxBackorderBid: { type: Type.NUMBER },
          trademarkAlert: { type: Type.STRING }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};

/**
 * Executive Report: Synthesizes a high-level investment memo
 */
export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate an executive investment memorandum based on portfolio stats: ${JSON.stringify(stats)} and sectors: ${sectors.join(', ')}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          capitalEfficiency: { type: Type.STRING },
          projections: {
            type: Type.OBJECT,
            properties: { liquidityTimeline: { type: Type.STRING } }
          },
          tacticalActions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch { return null; }
};
