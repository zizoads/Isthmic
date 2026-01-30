
import { Type, GoogleGenAI } from "@google/genai";
import { safeAICall } from "./base";

/**
 * توليد الهوية البصرية - ميزة أساسية تعتمد على Gemini 3 Pro
 */
export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create brand identity for ${domainName} in ${sector}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tagline: { type: Type.STRING },
            logoUrl: { type: Type.STRING },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

/**
 * هندسة إثبات القيمة للأصول الرقمية
 */
export const generateValueProofAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Architect value proof for ${domainName} in ${sector}.`,
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
              properties: { colors: { type: Type.ARRAY, items: { type: Type.STRING } } }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};
