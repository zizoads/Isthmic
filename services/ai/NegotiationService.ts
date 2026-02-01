
import { GoogleGenAI } from "@google/genai";
import { NegotiationThread, MessageAuditInsight, FAANGNegotiationReport, NegotiationMessage } from "../../types";
import { safeAICall } from "./base";
import { NEGOTIATION_AUDIT_SCHEMA } from "./schemas";
import { ArabicAnalysisService } from "./ArabicAnalysisService";

/**
 * NegotiationService: Sovereign high-stakes negotiation engine.
 * v2.1: Multi-Engine Logic + Sliding Window History Management.
 */
export class NegotiationService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';
  private static readonly MAX_CONTEXT_MESSAGES = 15; // Sliding window size

  private static isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * P1 Remediation: Compresses history to ensure the core logic stays within peak performance thresholds.
   */
  private static compressHistory(messages: NegotiationMessage[]): string {
    // Keep the first message (usually the opening) and the last N messages
    if (messages.length <= this.MAX_CONTEXT_MESSAGES) {
      return messages.map(m => `[${m.sender.toUpperCase()}]: ${m.content}`).join('\n');
    }

    const opening = messages[0];
    const recent = messages.slice(-(this.MAX_CONTEXT_MESSAGES - 1));
    
    return [
      `[OPENING_CONTEXT]: ${opening.content}`,
      `... [TRUNCATED ${messages.length - this.MAX_CONTEXT_MESSAGES} MESSAGES FOR OPTIMIZATION] ...`,
      ...recent.map(m => `[${m.sender.toUpperCase()}]: ${m.content}`)
    ].join('\n');
  }

  static async auditMessageDeep(
    thread: NegotiationThread, 
    newMessage: string,
    domainName: string
  ): Promise<{ insight: MessageAuditInsight, report: FAANGNegotiationReport }> {
    return safeAICall(async () => {
      const sanitizedMessage = newMessage.replace(/[<>]/g, '').slice(0, 2000);
      const isArabicInput = this.isArabic(sanitizedMessage);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Applying Sliding Window Compression
      const historyContext = this.compressHistory(thread.messages);

      const [geminiResponse, falconInsight] = await Promise.all([
        ai.models.generateContent({
          model: this.MODEL_PRO,
          contents: `
            System: You are a Forensic Negotiation Lead. 
            Mission: Perform a 4-layer audit on a signal for domain "${domainName}".
            
            Strategic Analysis: Evaluate leverage and Nash Equilibrium.
            Contextual History (Compressed Window):
            ${historyContext}
            
            Incoming Signal:
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
           result.insight.sentimentScore = Math.min(result.insight.sentimentScore, 30);
        }
      }

      return result;
    });
  }

  static async auditMessage(thread: NegotiationThread, newMessage: string): Promise<MessageAuditInsight> {
    const result = await this.auditMessageDeep(thread, newMessage, "Context_Unknown");
    return result.insight;
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
        contents: `Draft a game-theory optimized counter-offer for "${domainName}". 
        Floor: $${floorPrice}. 
        Compressed History Context:
        ${historyContext}`
      });
      return response.text || "Protocol synthesis failed.";
    });
  }
}
