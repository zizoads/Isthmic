
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { PlatformStats } from "../../types";

// Fix: Added signal parameter to match EvaluationDashboard call and Promise<any> return
export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal): Promise<any> => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `You are a forensic domain auditor. Language: ${lang}.`,
    `Audit: ${domainName}. Analyze SEO, brand potential, and exit velocity.`,
    {
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
  );
};

// Fix: Added lang parameter to match AgentReasoningLab call
export const debateDomainStrategyAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Multi-agent debate engine between Aggressive VC and Risk Auditor. Language: ${lang}`,
    `Debate acquisition strategy for: ${domainName}`,
    {
      type: Type.OBJECT,
      properties: {
        strategistView: { type: Type.STRING },
        auditorView: { type: Type.STRING },
        riskScore: { type: Type.NUMBER },
        finalVerdict: { type: Type.STRING },
        comparableSales: {
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
    },
    [{ googleSearch: {} }]
  );
};

export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    "C-Suite investment strategist reporting engine.",
    `Generate memo for portfolio: ${JSON.stringify(stats)}. Focus: ${sectors.join(', ')}`,
    {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        capitalEfficiency: { type: Type.STRING },
        projections: { type: Type.OBJECT, properties: { liquidityTimeline: { type: Type.STRING } } }
      }
    }
  );
};

// Fix: Added missing nexusPrimeIntelligenceAI function
export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: string) => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Nexus Prime Intelligence. Mode: ${mode}. Language: ${lang}`,
    `Execute deep intelligence for context: ${context}`,
    {
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
              estimatedValue: { type: Type.STRING },
              description: { type: Type.STRING },
              aiDeduction: { type: Type.STRING },
              probability: { type: Type.NUMBER },
              marketGapScore: { type: Type.NUMBER }
            }
          }
        }
      }
    }
  );
};
