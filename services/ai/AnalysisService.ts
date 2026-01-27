
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";
import { PlatformStats } from "../../types";

export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform forensic investment audit for: ${domainName}. Lang: ${lang}. 
      Analyze: 1. SEO Residual Value 2. Brandability 3. Exit Velocity.`,
      config: {
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
                spamScore: { type: Type.NUMBER },
                backlinks: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const debateDomainStrategyAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Multi-agent debate for: ${domainName}. Agent 1: Aggressive VC. Agent 2: Risk-Averse Auditor. Final Verdict must be a synthesis of both.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategistView: { type: Type.STRING },
            auditorView: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            comparableSales: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { domain: { type: Type.STRING }, price: { type: Type.NUMBER } }
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

export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Draft executive investment report. Stats: ${JSON.stringify(stats)}. Focus Sectors: ${sectors.join(', ')}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            capitalEfficiency: { type: Type.STRING },
            projections: {
              type: Type.OBJECT,
              properties: { liquidityTimeline: { type: Type.STRING } }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en') => {
  return safeAICall(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute NEXUS PRIME Protocol. Mode: ${mode}. Context: ${context}. Predict the next exponential market gap.`,
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
