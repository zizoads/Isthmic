
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";

export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
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

export const generateValueProofAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
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

export const generatePromoVideoAI = async (domainName: string, context: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic promo for ${domainName}. Context: ${context}.`,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  });
};
