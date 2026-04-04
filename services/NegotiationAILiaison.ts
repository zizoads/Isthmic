
import { GoogleGenAI } from "@google/genai";
import { MessageAuditInsight, FAANGNegotiationReport } from "../types";

class NegotiationAILiaison {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  public async analyzeBuyerMessage(
    domainName: string,
    messageHistory: string,
    currentOffer: number
  ): Promise<{ insight: MessageAuditInsight; report: FAANGNegotiationReport } | null> {
    const prompt = `You are a world-class domain negotiation expert. Analyze the following buyer message for the domain "${domainName}".
    Current Offer: $${currentOffer}
    Message History:
    ${messageHistory}
    
    Tasks:
    1. Determine buyer intent (lowball, discovery, serious_offer, bluff, urgency).
    2. Identify psychological markers and red flags.
    3. Generate a FAANG-level negotiation report with leverage scores and recommended actions.
    
    Return ONLY a JSON object with two keys: "insight" (matching MessageAuditInsight) and "report" (matching FAANGNegotiationReport).`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Negotiation Analysis Error:", error);
      return null;
    }
  }
}

export const negotiationLiaison = new NegotiationAILiaison();
