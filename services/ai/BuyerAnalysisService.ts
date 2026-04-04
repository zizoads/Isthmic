
import { GoogleGenAI } from "@google/genai";
import { generateStructuredAI, safeAICall } from "./base";
import { Type } from "@google/genai";

export interface PotentialBuyer {
  name: string;
  location: string;
  industry: string;
  synergyLogic: string;
  estimatedBudget: string;
  mapsUri?: string;
}

export class BuyerAnalysisService {
  private static readonly MODEL_MAPS = 'gemini-2.5-flash';
  private static readonly MODEL_LOGIC = 'gemini-3-flash-preview';

  /**
   * استخدام Google Maps Grounding للعثور على شركات حقيقية
   */
  static async discoverGeographicBuyers(domainName: string, sector: string, region: string): Promise<{ buyers: PotentialBuyer[], narrative: string }> {
    return safeAICall(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // الخطوة 1: العثور على الكيانات عبر الخرائط
      const response = await ai.models.generateContent({
        model: this.MODEL_MAPS,
        contents: `Find 5 established businesses in ${region} that operate in the ${sector} sector and could benefit from owning the domain "${domainName}".`,
        config: {
          tools: [{ googleMaps: {} }]
        }
      });

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapsData = grounding.filter(g => g.maps).map(g => ({
        name: g.maps?.title || 'Unknown Entity',
        uri: g.maps?.uri || '#'
      }));

      // الخطوة 2: تحليل الربط الاستراتيجي لكل شركة
      const analysisResult = await generateStructuredAI<any>(
        this.MODEL_LOGIC,
        "Role: M&A Strategic Consultant. Task: Analyze potential buyer synergy.",
        `Domain: ${domainName}. Companies found: ${JSON.stringify(mapsData)}. 
         Analyze why each company would benefit from this domain specifically for local SEO or branding dominance.`,
        {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING },
            buyers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  location: { type: Type.STRING },
                  industry: { type: Type.STRING },
                  synergyLogic: { type: Type.STRING },
                  estimatedBudget: { type: Type.STRING }
                }
              }
            }
          }
        }
      );

      // دمج روابط الخرائط مع التحليل
      const finalBuyers = analysisResult.data.buyers.map((b: any, i: number) => ({
        ...b,
        mapsUri: mapsData[i]?.uri
      }));

      return {
        buyers: finalBuyers,
        narrative: analysisResult.data.narrative
      };
    });
  }

  /**
   * إنشاء رسالة عرض مخصصة مبنية على الموقع الجغرافي
   */
  static async generateLocalPitch(domainName: string, buyer: PotentialBuyer): Promise<string> {
    const result = await generateStructuredAI<any>(
      this.MODEL_LOGIC,
      "Role: High-Stakes Sales Copywriter. Task: Write a local dominance pitch.",
      `Target: ${buyer.name} in ${buyer.location}. Asset: ${domainName}. 
       Logic: ${buyer.synergyLogic}. Focus on local SEO advantage and competitor exclusion.`,
      {
        type: Type.OBJECT,
        properties: { pitch: { type: Type.STRING } }
      }
    );
    return result.data.pitch;
  }
}
