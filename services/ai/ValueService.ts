
import { Type, GoogleGenAI } from "@google/genai";
import { safeAICall, generateStructuredAI } from "./base";
import { supabase } from "../SupabaseClient";

/**
 * وظيفة مساعدة لتحويل Base64 إلى ملف ورفعه إلى التخزين السحابي
 */
async function uploadImageToStorage(base64Data: string, domainName: string): Promise<string | null> {
  try {
    // 1. تحويل الـ Base64 إلى Uint8Array
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    const fileName = `logos/${domainName}_${Date.now()}.png`;
    
    // 2. الرفع إلى Bucket (نفرض وجود Bucket باسم 'brand-assets')
    const { data, error } = await supabase.storage
      .from('brand-assets')
      .upload(fileName, bytes, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) throw error;

    // 3. جلب الرابط العام
    const { data: { publicUrl } } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (e) {
    console.error("STORAGE_UPLOAD_ERR:", e);
    return null;
  }
}

export const generateBrandIdentityAI = async (domainName: string, sector: string) => {
  return safeAICall(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Design a high-end minimalist corporate logo and brand identity for the domain: ${domainName} in the ${sector} industry. Focus on high-value business aesthetics. Return identity metadata and the logo.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
      }
    });

    let rawBase64 = '';
    let tagline = '';
    let colors: string[] = [];

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        rawBase64 = part.inlineData.data;
      } else if (part.text) {
        // استخراج الشعار من النص إذا وجد
        const lines = part.text.split('\n');
        tagline = lines.find(l => l.length > 5 && l.length < 100) || '';
      }
    }

    // المرحلة 4.4: رفع الصورة وجلب الرابط بدلاً من إرسال الـ Base64 الخام
    let finalLogoUrl = '';
    if (rawBase64) {
      const uploadedUrl = await uploadImageToStorage(rawBase64, domainName);
      // fallback to base64 if upload fails, but prioritize the storage link
      finalLogoUrl = uploadedUrl || `data:image/png;base64,${rawBase64}`;
    }

    return { 
      logoUrl: finalLogoUrl, 
      tagline, 
      colors: ['#c5a059', '#ffffff', '#0a0a0c'] // ألوان سيادية افتراضية
    };
  });
};

export const generateValueProofAI = async (domainName: string, sector: string) => {
  const res = await generateStructuredAI<any>(
    'gemini-3-flash-preview',
    "Business artifact architect.",
    `Generate value proof for ${domainName} in ${sector}.`,
    {
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
          properties: {
            colors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    }
  );
  return res.data;
};
