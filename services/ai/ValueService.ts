
import { Type } from "@google/genai";
import { safeAICall, generateStructuredAI } from "./base";

async function uploadImageToStorage(base64Data: string, _domainName: string): Promise<string | null> {
  // Local-first strategy: Returning base64 directly to maintain data sovereignty.
  return `data:image/png;base64,${base64Data}`;
}

export const generateBrandIdentityAI = async (domainName: string, sector: string): Promise<{ logoUrl: string, tagline: string, colors: string[] }> => {
  const payload = {
    model: 'gemini-1.5-pro',
    contents: {
      parts: [{ text: `Design a high-end minimalist corporate logo and brand identity for the domain: ${domainName} in the ${sector} industry. Return identity metadata and the logo.` }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
    }
  };

  const response = await safeAICall<any>(payload);
  
  let rawBase64 = '';
  let tagline = '';

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      rawBase64 = part.inlineData.data;
    } else if (part.text) {
      const lines = part.text.split('\n');
      tagline = lines.find((l: string) => l.length > 5 && l.length < 100) || '';
    }
  }

  let finalLogoUrl = '';
  if (rawBase64) {
    const uploadedUrl = await uploadImageToStorage(rawBase64, domainName);
    finalLogoUrl = uploadedUrl || `data:image/png;base64,${rawBase64}`;
  }

  return { 
    logoUrl: finalLogoUrl, 
    tagline, 
    colors: ['#c5a059', '#ffffff', '#0a0a0c']
  };
};

export const generateValueProofAI = async (domainName: string, sector: string) => {
  const res = await generateStructuredAI<any>(
    'gemini-1.5-flash',
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
