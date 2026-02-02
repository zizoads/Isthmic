
import { GoogleGenAI } from "@google/genai";
import { NegotiationThread, MessageAuditInsight, FAANGNegotiationReport, NegotiationMessage, DealState, DealStateEnum } from "../../types";
import { safeAICall, generateStructuredAI } from "./base";
import { NEGOTIATION_AUDIT_SCHEMA, STATE_INFERENCE_SCHEMA } from "./schemas";
import { ArabicAnalysisService } from "./ArabicAnalysisService";

/**
 * NegotiationService: Sovereign high-stakes negotiation engine.
 * v2.5: Integrated State Machine Inference.
 */
export class NegotiationService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';
  private static readonly MODEL_FLASH = 'gemini-3-flash-preview';
  public static readonly MAX_CONTEXT_MESSAGES = 15;

  private static isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Compresses history to ensure peak neural performance.
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
      `... [SYSTEM_REDACTION: ${messages.length - this.MAX_CONTEXT_MESSAGES} messages moved to deep memory] ...`,
      ...slidingWindow.map(m => `[${m.sender.toUpperCase()}]: ${m.content.slice(0, 1000)}`)
    ].join('\n');
  }

  /**
   * الخطوة 2: تنفيذ آلية الحالة السيادية (Sovereign State Machine)
   * تستنتج المرحلة الحالية للصفقة بناءً على السياق التراكمي.
   */
  static async inferStateTransition(
    currentMessage: string, 
    messageHistory: NegotiationMessage[], 
    currentDealState?: DealState
  ): Promise<{ newState: DealState; suggestedAction: string }> {
    const historyText = this.compressHistory(messageHistory);
    
    const result = await generateStructuredAI<any>(
      this.MODEL_FLASH,
      `You are the Sovereign Negotiation State Engine. 
       Classify the negotiation phase based on the current message and history.
       Halt transitions that are logically impossible (e.g. Agreement -> Discovery).
       
       DEAL STATES:
       - INITIAL: General inquiry, first contact.
       - DISCOVERY: Fact-finding, questions about asset history.
       - TENSION: Price haggling, lowballing, negotiation stress.
       - AGREEMENT: Verbal consensus on price/terms.
       - CLOSING: Logistics, Escrow details, Auth codes.
       - STALLED: Silence, brief non-committal replies.
       - LOST: Definite rejection or prolonged silence.`,
      `History: ${historyText}
       Current State: ${currentDealState?.currentState || 'None'}
       Incoming Signal: "${currentMessage}"`,
      STATE_INFERENCE_SCHEMA
    );

    const data = result.data;
    const newState: DealState = {
      currentState: data.currentState as DealStateEnum,
      confidenceScore: data.confidenceScore,
      previousState: currentDealState?.currentState,
      transitionReason: data.transitionReason,
      lastUpdate: new Date().toISOString()
    };

    return { newState, suggestedAction: data.suggestedAction };
  }

  static async auditMessageDeep(
    thread: NegotiationThread, 
    newMessage: string,
    domainName: string
  ): Promise<{ 
    insight: MessageAuditInsight, 
    report: FAANGNegotiationReport,
    newState?: DealState 
  }> {
    return safeAICall(async () => {
      const sanitizedMessage = newMessage.replace(/[<>]/g, '').slice(0, 3000);
      const isArabicInput = this.isArabic(sanitizedMessage);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyContext = this.compressHistory(thread.messages);

      // تشغيل محرك الحالة ومحرك التدقيق بالتوازي
      const [geminiResponse, stateResponse, falconInsight] = await Promise.all([
        ai.models.generateContent({
          model: this.MODEL_PRO,
          contents: `System: Chief Forensic Negotiator. Target: Digital Asset "${domainName}".
            Task: Perform 4-layer audit on incoming signal.
            History Context: ${historyContext}
            Incoming: "${sanitizedMessage}"`,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: NEGOTIATION_AUDIT_SCHEMA
          }
        }),
        this.inferStateTransition(sanitizedMessage, thread.messages, thread.currentState),
        isArabicInput ? ArabicAnalysisService.analyzeMessage(sanitizedMessage) : Promise.resolve(null)
      ]);

      const result = JSON.parse(geminiResponse.text || '{}');

      // دمج نتائج محرك الحالة
      const finalResult = {
        ...result,
        newState: stateResponse.newState
      };

      // دمج التحليل الثقافي إذا وجد
      if (falconInsight && finalResult.insight) {
        finalResult.insight.culturalNuance = falconInsight.culturalNuance;
        if (falconInsight.sentiment.includes("Aggressive")) {
           finalResult.insight.sentimentScore = Math.min(finalResult.insight.sentimentScore, 25);
        }
      }

      return finalResult;
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
