
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";

export const performOsintInvestigationAI = async (query: string, lang: 'ar' | 'en' = 'ar') => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
    `Deep Forensic OSINT Agent. Language: ${lang}.`,
    `Investigate: ${query}. Analyze history, DNS, and reputation.`,
    {
      type: Type.OBJECT,
      properties: {
        threatLevel: { type: Type.STRING, enum: ['Safe', 'Suspicious', 'Malicious'] },
        dnsSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
        associatedEntities: { type: Type.ARRAY, items: { type: Type.STRING } },
        dataBreachAlert: { type: Type.BOOLEAN },
        forensicVerdict: { type: Type.STRING }
      }
    },
    [{ googleSearch: {} }]
  );
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  return generateStructuredAI<string>(
    'gemini-3-flash-preview',
    "Intellectual Property Auditor.",
    `Assess trademark risk for "${domainName}". Return one word: Safe, Low, Medium, or High.`,
    { type: Type.STRING },
    [{ googleSearch: {} }]
  );
};
