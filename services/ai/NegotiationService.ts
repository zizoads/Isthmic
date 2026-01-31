import { GoogleGenAI } from "@google/genai";
import { NegotiationThread, MessageAuditInsight, FAANGNegotiationReport } from "../../types";
import { safeAICall } from "./base";
import { NEGOTIATION_AUDIT_SCHEMA } from "./schemas";

/**
 * NegotiationService: Sovereign high-stakes negotiation engine.
 * Refactored v1.5: Decoupled schemas and consolidated logic.
 */
export class NegotiationService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';

  /**
   * Unified Audit Entry Point: Consolidates quick and deep audits.
   * Includes message sanitization to prevent prompt injection.
   */
  static async auditMessageDeep(
    thread: NegotiationThread, 
    newMessage: string,
    domainName: string
  ): Promise<{ insight: MessageAuditInsight, report: FAANGNegotiationReport }> {
    return safeAICall(async () => {
      // Basic sanitization
      const sanitizedMessage = newMessage.replace(/[<>]/g, '').slice(0, 2000);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const historyContext = thread.messages
        .slice(-10)
        .map(m => `[${m.sender.toUpperCase()}]: ${m.content}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `
          System: You are a Forensic Negotiation Lead. 
          Mission: Perform a 4-layer audit on a signal for domain "${domainName}".
          
          Linguistic Analysis: Detect emotional micro-markers.
          Strategic Analysis: Evaluate Nash Equilibrium state.
          Contextual History:
          ${historyContext}
          
          Incoming Signal:
          "${sanitizedMessage}"
        `,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: NEGOTIATION_AUDIT_SCHEMA
        }
      });

      return JSON.parse(response.text || '{}');
    });
  }

  /**
   * Alias for backwards compatibility, defaults to deep audit.
   */
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
      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `Draft a game-theory optimized counter-offer for "${domainName}". 
        Floor: $${floorPrice}. Context: ${JSON.stringify(thread.messages.slice(-3))}`
      });
      return response.text || "Protocol synthesis failed.";
    });
  }
}