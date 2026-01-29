
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

/**
 * توليد فيديو ترويجي باستخدام Veo 3.1
 * يتم استخدامه لتوليد عرض مرئي للنطاق التجاري لزيادة قيمته التسويقية
 */
export const generatePromoVideoAI = async (domainName: string, promptContext: string) => {
  // Check for API key selection as required for Veo models
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // Proceed assuming key selection was successful to avoid race condition
    }
  }

  return safeAICall(async () => {
    const ai = getAIClient();
    if (!ai) throw new Error("AI_KEY_MISSING");

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `High-end cinematic promotional commercial for the brand "${domainName}". Context: ${promptContext}. Luxury, modern aesthetic, 4k detail style, slow motion cinematography.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed: No output URI.");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) {
        if (response.status === 404) {
          // If request fails with "Requested entity was not found", it might be an API key issue
          if (typeof window !== 'undefined' && (window as any).aistudio) {
             await (window as any).aistudio.openSelectKey();
          }
        }
        throw new Error(`Failed to download video: ${response.statusText}`);
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
           await (window as any).aistudio.openSelectKey();
        }
      }
      throw err;
    }
  });
};
