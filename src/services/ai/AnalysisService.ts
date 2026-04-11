
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { PlatformStats, DecompositionPlan } from "../../types";

export const decomposeStrategyAI = async (thesis: string): Promise<DecompositionPlan> => {
  const result = await generateStructuredAI<any>(
    'gemini-3.1-pro-preview',
    `Strategic Planner (Sovereign Core). 
     Task: Decompose a high-level investment thesis into 5 discrete execution nodes.
     Nodes must follow this sequence: 1. Vector Extraction, 2. Gap Identification, 3. Forensic Filtering, 4. Liquidity Benchmarking, 5. Alpha Synthesis.`,
    `Investment Thesis: "${thesis}"`,
    {
      type: Type.OBJECT,
      properties: {
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    }
  );

  return {
    id: crypto.randomUUID(),
    strategicIntent: thesis,
    createdAt: new Date().toISOString(),
    nodes: result.data.nodes.map((n: any) => ({ ...n, status: 'pending' }))
  };
};

export const evaluateDomainExpertAI = async (domainName: string, signal?: AbortSignal) => {
  return generateStructuredAI<any>(
    'gemini-3.1-pro-preview',
    `Forensic Domain Auditor. Integrity check for SEO, Branding, and Risk.`,
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

export const debateDomainStrategyAI = async (domainName: string) => {
  const res = await generateStructuredAI<any>(
    'gemini-3.1-pro-preview',
    `Multi-agent strategist lab.`,
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
    'gemini-3.1-pro-preview',
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

export const nexusPrimeIntelligenceAI = async (mode: string, context: string, lang: 'en' = 'en') => {
  const res = await generateStructuredAI<any>(
    'gemini-3.1-pro-preview',
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
