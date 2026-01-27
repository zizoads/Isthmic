

import { GoogleGenAI, Type } from "@google/genai";
import { AgentRole, AgentThought, Domain, PlatformStrategy, AutonomousAction, NegotiationBattleCard } from "../types";

export class MasterBrainEngine {
  // Always initialize GoogleGenAI inside methods right before making a call to ensure the latest API key is used.
  private thoughts: AgentThought[] = [];
  private onThoughtUpdate: (thoughts: AgentThought[]) => void;
  private onActionTaken?: (action: AutonomousAction) => void;

  constructor(
    onThoughtUpdate: (thoughts: AgentThought[]) => void,
    onActionTaken?: (action: AutonomousAction) => void
  ) {
    this.onThoughtUpdate = onThoughtUpdate;
    this.onActionTaken = onActionTaken;
  }

  private addThought(role: AgentRole, message: string, status: AgentThought['status'] = 'resolved') {
    const thought: AgentThought = {
      role,
      message,
      timestamp: new Date().toLocaleTimeString(),
      status
    };
    this.thoughts = [thought, ...this.thoughts];
    this.onThoughtUpdate([...this.thoughts]);
  }

  private recordAction(type: AutonomousAction['type'], domainName: string, description: string, impact: number) {
    const action: AutonomousAction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      domainName,
      description,
      timestamp: new Date().toLocaleTimeString(),
      impactScore: impact,
      status: 'completed'
    };
    if (this.onActionTaken) this.onActionTaken(action);
  }

  /**
   * بروتوكول الإغلاق القسري: تحليل عرض المشتري -> توليد الرد التكتيكي -> إعداد العقد
   */
  async analyzeNegotiation(domainName: string, buyerMessage: string): Promise<NegotiationBattleCard> {
    this.addThought(AgentRole.LIQUIDATOR, `تحليل سيكولوجية المشتري لـ ${domainName}...`, "thinking");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Domain: ${domainName}. Buyer Message: "${buyerMessage}". Analyze motives, type, and generate a battle card for closing.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            buyerMotive: { type: Type.STRING },
            buyerType: { type: Type.STRING, enum: ['Strategic', 'Speculator', 'End-User'] },
            leveragePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCounter: { type: Type.NUMBER },
            sentimentScore: { type: Type.NUMBER },
            closingProbability: { type: Type.NUMBER }
          }
        }
      }
    });

    const card = JSON.parse(response.text || '{}');
    this.addThought(AgentRole.LIQUIDATOR, `تم اكتشاف ثغرة تكتيكية. المشتري من نوع ${card.buyerType}. احتمال الإغلاق: ${card.closingProbability}%`);
    this.recordAction('NEGOTIATION', domainName, "تم توليد استراتيجية الرد المضاد.", 88);
    
    return card;
  }

  async generateTermSheet(domain: Domain): Promise<string> {
    this.addThought(AgentRole.LIQUIDATOR, `توليد مسودة الإغلاق القانونية لـ ${domain.name}...`, "thinking");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a formal, high-stakes closing term sheet for ${domain.name}. Price: $${domain.battleCard?.suggestedCounter}. Professional, binding tone.`,
    });

    this.recordAction('CLOSE_DEAL', domain.name, "تم إعداد مسودة الإغلاق النهائية.", 100);
    return response.text || "";
  }

  /**
   * Added missing executeSovereignLoop method to resolve compilation error in AutonomousControlCenter.tsx
   * This method runs an autonomous CEO-style loop to discover and audit high-potential assets.
   */
  async executeSovereignLoop(strategy: PlatformStrategy): Promise<any[]> {
    this.addThought(AgentRole.STRATEGIST, "إطلاق الحلقة السيادية المستقلة لتوليد الفرص...", "thinking");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Autonomous CEO Loop. Strategy: ${strategy.investmentThesis}. Risk Tolerance: ${strategy.riskTolerance}. Find 3-5 high-value domain opportunities currently available or expiring.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              estimatedPrice: { type: Type.NUMBER },
              sector: { type: Type.STRING },
              justification: { type: Type.STRING },
              probability: { type: Type.NUMBER }
            },
            required: ['name', 'estimatedPrice', 'sector', 'justification', 'probability']
          }
        }
      }
    });

    const results = JSON.parse(response.text || '[]');
    this.addThought(AgentRole.STRATEGIST, `تم العثور على ${results.length} فرص استراتيجية جديدة وتلقيمها للنظام.`);
    this.recordAction('PURCHASE', 'N/A', `المسح السيادي اكتمل بـ ${results.length} نتائج.`, 92);
    
    return results;
  }
}
