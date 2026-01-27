
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";

export const performOsintInvestigationAI = async (query: string, lang: 'ar' | 'en' = 'ar') => {
  return safeAICall(async () => {
    const ai = getAIClient();
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

export const checkTrademarkRiskAI = async (domainName: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
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
