
import { NegotiationThread, MessageAuditInsight, FAANGNegotiationReport, NegotiationMessage, DealState, DealStateEnum, NegotiationSnapshot } from "../../types";
import { safeAICall, generateStructuredAI } from "./base";
import { NEGOTIATION_AUDIT_SCHEMA, STATE_INFERENCE_SCHEMA } from "./schemas";

/**
 * NegotiationService: Sovereign high-stakes negotiation engine.
 * v2.7: Added Passive Strategic Snapshot for MasterBrain orchestration.
 */
export class NegotiationService {
  private static readonly MODEL_PRO = 'gemini-3.1-pro-preview';
  private static readonly MODEL_FLASH = 'gemini-3-flash-preview';
  public static readonly MAX_CONTEXT_MESSAGES = 15;

  /**
   * getStrategicSnapshot: Passive monitoring interface.
   * Returns a lightweight operational snapshot without calling any AI model.
   */
  static getStrategicSnapshot(thread: NegotiationThread, domainName: string): NegotiationSnapshot {
    const messages = thread.messages;
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

    return {
      domainName,
      currentState: thread.currentState?.currentState || DealStateEnum.INITIAL,
      messageCount: messages.length,
      leverageScore: thread.currentLeverage || 50,
      lastBuyerIntent: lastMsg?.auditInsight?.intent || 'none',
      riskFlagsCount: lastMsg?.faangReport?.riskFlags?.length || 0,
      sentiment: lastMsg?.auditInsight?.sentimentScore || 50,
      timestamp: new Date().toISOString()
    };
  }

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
       
       DEAL STATES:
       - INITIAL: General inquiry.
       - DISCOVERY: Fact-finding, questions.
       - TENSION: Price haggling, lowballing.
       - AGREEMENT: Verbal consensus.
       - CLOSING: Logistics, Escrow, Auth codes.
       - STALLED: Silence.
       - LOST: Rejection.`,
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
      suggestedAction: data.suggestedAction,
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
      const historyContext = this.compressHistory(thread.messages);

      const [geminiResponse, stateResponse] = await Promise.all([
        safeAICall<any>({
          model: this.MODEL_PRO,
          contents: `System: Chief Forensic Negotiator. Target: Digital Asset "${domainName}".
            History Context: ${historyContext}
            Incoming: "${sanitizedMessage}"`,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: NEGOTIATION_AUDIT_SCHEMA
          }
        }),
        this.inferStateTransition(sanitizedMessage, thread.messages, thread.currentState)
      ]);

      return {
        ...geminiResponse,
        newState: stateResponse.newState
      };
    });
  }

  static async generateStrategicCounter(
    thread: NegotiationThread,
    domainName: string,
    floorPrice: number
  ): Promise<string> {
    return safeAICall(async () => {
      const historyContext = this.compressHistory(thread.messages);
      
      const response = await safeAICall<any>({
        model: this.MODEL_PRO,
        contents: `Draft a game-theory optimized response for "${domainName}". Floor: $${floorPrice}. Context: ${historyContext}`
      });
      return typeof response === 'string' ? response : response.text || "Protocol synthesis failed.";
    });
  }
}
