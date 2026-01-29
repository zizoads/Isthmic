
import { Type } from "@google/genai";
import { getAIClient, safeAICall } from "./base";

/**
 * توليد الهوية البصرية - ميزة أساسية تعتمد على Gemini 3 Pro
 */
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

/**
 * هندسة إثبات القيمة للأصول الرقمية
 */
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

/**
 * توليد فيديو ترويجي باستخدام Veo 3.1
 * يتم استخدامه لتوليد عرض مرئي للنطاق التجاري لزيادة قيمته التسويقية
 */
export const generatePromoVideoAI = async (domainName: string, promptContext: string) => {
  return safeAICall(async () => {
    const ai = getAIClient();
    // استخدام موديل Veo لتوليد الفيديو كما هو محدد في التعليمات البرمجية
    // الموديل المستخدم يدعم توليد الفيديو عالي الجودة
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `High-end cinematic promotional commercial for the brand "${domainName}". Context: ${promptContext}. Luxury, modern aesthetic, 4k detail style, slow motion cinematography.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // الانتظار حتى اكتمال العملية (LRO - Long Running Operation)
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No output URI.");

    // جلب بيانات الفيديو كـ Blob وتحويلها لرابط محلي قابل للاستخدام في المتصفح
    // يجب إلحاق مفتاح API عند الجلب من الرابط كما هو موضح في الدليل
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error("Failed to download generated video asset.");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  });
};
