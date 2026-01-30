
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";

/**
 * توليد الهوية البصرية - ميزة أساسية تعتمد على Gemini 3 Pro
 */
export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    if (!ai) throw new Error("AI_KEY_MISSING");
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
    const ai = getAIClient();
    if (!ai) throw new Error("AI_KEY_MISSING");
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

// @google/genai: generatePromoVideoAI implementation using Veo 3.1 fast model
export const generatePromoVideoAI = async (domainName: string, prompt: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    if (!ai) throw new Error("AI_KEY_MISSING");

    // Initiate video generation operation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A high-end cinematic promo video for a brand named ${domainName}. Style: sleek, professional, high-tech. Narrative context: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for operation completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation failed to return a valid download link.");
    }
    
    // Append API key for direct resource access as required by the docs for fetching video bytes
    return `${downloadLink}&key=${process.env.API_KEY}`;
  });
};
