
import { GoogleGenAI, Type } from "@google/genai";
import { NegotiationThread, MessageAuditInsight, NegotiationMessage } from "../../types";
import { safeAICall } from "./base";

/**
 * NegotiationService: محرك الذكاء الاصطناعي المسؤول عن تدقيق المراسلات 
 * وصياغة استراتيجيات الرد بناءً على التحليل النفسي وسياق السوق.
 */
export class NegotiationService {
  private static readonly MODEL_FLASH = 'gemini-3-flash-preview';
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';

  /**
   * إجراء تدقيق جنائي لرسالة واردة من مشتري.
   */
  static async auditMessage(
    thread: NegotiationThread, 
    newMessage: string
  ): Promise<MessageAuditInsight> {
    return safeAICall(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // سياق المحادثة السابقة لتعزيز دقة التدقيق
      const historySummary = thread.messages
        .slice(-5)
        .map(m => `${m.sender}: ${m.content}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: this.MODEL_FLASH,
        contents: `
          System Instruction: You are a FAANG-level Negotiation Forensic Auditor.
          Mission: Analyze the buyer's message for hidden psychological markers, intent, and tactical value.
          
          Context History:
          ${historySummary}
          
          New Message from Buyer:
          "${newMessage}"
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentimentScore: { type: Type.NUMBER, description: "Scale -1 (Hostile) to 1 (Very Eager)" },
              intent: { 
                type: Type.STRING, 
                enum: ['lowball', 'discovery', 'serious_offer', 'bluff', 'urgency'] 
              },
              psychologicalMarkers: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              redFlags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Signs of time-wasting or lack of funds."
              },
              suggestedAction: { 
                type: Type.STRING, 
                description: "Immediate tactical advice for the owner."
              }
            },
            required: ['sentimentScore', 'intent', 'psychologicalMarkers', 'redFlags', 'suggestedAction']
          }
        }
      });

      return JSON.parse(response.text || '{}') as MessageAuditInsight;
    });
  }

  /**
   * صياغة عرض مضاد (Counter-Offer) استراتيجي باستخدام نموذج Pro.
   */
  static async generateStrategicCounter(
    thread: NegotiationThread,
    domainName: string,
    floorPrice: number
  ): Promise<string> {
    return safeAICall(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `
          As a Chief Negotiator, draft a high-stakes counter-offer for the domain "${domainName}".
          Floor Price (Absolute Minimum): $${floorPrice}.
          Current Thread History:
          ${JSON.stringify(thread.messages)}
          
          Mission: Maximize ROI while maintaining professional leverage. Use subtle psychological anchoring.
        `
      });

      return response.text || "Strategic synthesis failed. Re-initiating protocol...";
    });
  }
}
