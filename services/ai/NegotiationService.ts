
import { GoogleGenAI } from "@google/genai";
import { NegotiationThread, MessageAuditInsight, FAANGNegotiationReport, NegotiationMessage } from "../../types";
import { safeAICall } from "./base";
import { NEGOTIATION_AUDIT_SCHEMA } from "./schemas";
import { ArabicAnalysisService } from "./ArabicAnalysisService";

/**
 * NegotiationService: Sovereign high-stakes negotiation engine.
 * v2.2: Optimized for Production with Adaptive Sliding Window.
 */
export class NegotiationService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';
  public static readonly MAX_CONTEXT_MESSAGES = 15;

  private static isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Compresses history to ensure peak neural performance.
   * Keeps the 'Global Anchor' (First message) and a sliding window of recent messages.
   */
  private static compressHistory(messages: NegotiationMessage[]): string {
    if (!messages || messages.length === 0) return "No prior context.";
    
    if (messages.length <= this.MAX_CONTEXT_MESSAGES) {
      return messages.map(m => `[${m.sender.toUpperCase()}]: ${m.content.slice(0, 1000)}`).join('\n');
    }

    const opening = messages[0];
    const slidingWindow = messages.slice(-(this.MAX_CONTEXT_MESSAGES - 1));
    
    return [
      `[GLOBAL_ANCHOR]: ${opening.content.slice(0, 1000)}`,
      `... [SYSTEM_REDACTION: ${messages.length - this.MAX_CONTEXT_MESSAGES} messages moved to deep memory for performance] ...`,
      ...slidingWindow.map(m => `[${m.sender.toUpperCase()}]: ${m.content.slice(0, 1000)}`)
    ].join('\n');
  }

  static async auditMessageDeep(
    thread: NegotiationThread, 
    newMessage: string,
    domainName: string
  ): Promise<{ insight: MessageAuditInsight, report: FAANGNegotiationReport }> {
    return safeAICall(async () => {
      const sanitizedMessage = newMessage.replace(/[<>]/g, '').slice(0, 3000);
      const isArabicInput = this.isArabic(sanitizedMessage);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Multi-Agent Context Injection
      const historyContext = this.compressHistory(thread.messages);

      const [geminiResponse, falconInsight] = await Promise.all([
        ai.models.generateContent({
          model: this.MODEL_PRO,
          contents: `
            System: Chief Forensic Negotiator. 
            Target: Digital Asset "${domainName}".
            Task: Perform 4-layer audit on incoming signal.
            
            Operational Context (Sliding Window History):
            ${historyContext}
            
            Current Incoming Signal:
            "${sanitizedMessage}"
          `,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: NEGOTIATION_AUDIT_SCHEMA
          }
        }),
        isArabicInput ? ArabicAnalysisService.analyzeMessage(sanitizedMessage) : Promise.resolve(null)
      ]);

      const result = JSON.parse(geminiResponse.text || '{}');

      if (falconInsight && result.insight) {
        result.insight.culturalNuance = falconInsight.culturalNuance;
        if (falconInsight.sentiment.includes("Aggressive")) {
           result.insight.sentimentScore = Math.min(result.insight.sentimentScore, 25);
        }
      }

      return result;
    });
  }

  static async generateStrategicCounter(
    thread: NegotiationThread,
    domainName: string,
    floorPrice: number
  ): Promise<string> {
    return safeAICall(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyContext = this.compressHistory(thread.messages);
      
      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `Draft a high-conversion, game-theory optimized response for "${domainName}". 
        Absolute floor price: $${floorPrice}. 
        Strategic Context:
        ${historyContext}`
      });
      return response.text || "Protocol synthesis failed.";
    });
  }
}
