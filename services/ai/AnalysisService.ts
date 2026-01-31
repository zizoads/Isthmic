
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { PlatformStats } from "../../types";

export const evaluateDomainExpertAI = async (domainName: string, lang: 'ar' | 'en' = 'ar', signal?: AbortSignal) => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Forensic Domain Auditor. Integrity check for SEO, Branding, and Risk. Lang: ${lang}`,
    `Audit domain: ${domainName}. Evaluate historical integrity and market liquidity.`,
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
            spamScore: { type: Type.NUMBER },
            historicalCategory: { type: Type.STRING },
            virusTotalStatus: { type: Type.STRING, enum: ['Clean', 'Malicious', 'Suspicious', 'Untested'] },
            verificationStatus: { type: Type.STRING, enum: ['AI_INFERRED', 'REGISTRY_VERIFIED'] }
          }
        }
      }
    },
    [{ googleSearch: {} }],
    undefined,
    signal
  );
};

export const debateDomainStrategyAI = async (domainName: string, lang: 'ar' | 'en' = 'ar') => {
  const res = await generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Multi-agent strategist lab. Lang: ${lang}`,
    `Debate investment value of ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        strategistView: { type: Type.STRING },
        auditorView: { type: Type.STRING },
        riskScore: { type: Type.NUMBER },
        finalVerdict: { type: Type.STRING }
      }
    }
  );
  return res.data;
};

export const generateExecutiveReportAI = async (stats: PlatformStats, sectors: string[]) => {
  const res = await generateStructuredAI<any>(
    'gemini-3-pro-preview',
    "Chief Investment Officer report synthesizer.",
    `Synthesize report for portfolio with $${stats.estimatedPortfolioValue} value in sectors: ${sectors.join(', ')}.`,
    {
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
  );
  return res.data;
};

export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'ar' | 'en') => {
  const res = await generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Nexus Prime Core Intelligence. Mode: ${mode}. Lang: ${lang}`,
    `Execute deep context analysis for: ${context}`,
    {
      type: Type.OBJECT,
      properties: {
        analysisVerdict: { type: Type.STRING },
        opportunities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};
