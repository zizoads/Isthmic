
import { GoogleGenAI } from "@google/genai";
import { NegotiationThread, MessageAuditInsight, FAANGNegotiationReport } from "../../types";
import { safeAICall } from "./base";
import { NEGOTIATION_AUDIT_SCHEMA } from "./schemas";
import { ArabicAnalysisService } from "./ArabicAnalysisService";

/**
 * NegotiationService: Sovereign high-stakes negotiation engine.
 * v2.0: Multi-Engine Logic (Gemini + Falcon-Arabic).
 */
export class NegotiationService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';

  private static isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
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
      
      const historyContext = thread.messages
        .slice(-10)
        .map(m => `[${m.sender.toUpperCase()}]: ${m.content}`)
        .join('\n');

      // Execute primary audit (Gemini) and specialized linguistic audit (Falcon) in parallel
      const [geminiResponse, falconInsight] = await Promise.all([
        ai.models.generateContent({
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
        }),
        isArabicInput ? ArabicAnalysisService.analyzeMessage(sanitizedMessage) : Promise.resolve(null)
      ]);

      const result = JSON.parse(geminiResponse.text || '{}');

      // Inject Falcon findings if available
      if (falconInsight && result.insight) {
        result.insight.culturalNuance = falconInsight.culturalNuance;
        // Optionally refine intent if Falcon detected something cultural Gemini missed
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
      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `Draft a game-theory optimized counter-offer for "${domainName}". 
        Floor: $${floorPrice}. Context: ${JSON.stringify(thread.messages.slice(-3))}`
      });
      return response.text || "Protocol synthesis failed.";
    });
  }
}
