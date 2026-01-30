
import { AgentRole, AgentThought, Domain, PlatformStrategy, AutonomousAction, NegotiationBattleCard, ActiveJob } from "../types";
import * as AIService from "./geminiService";
import { supabase } from "./SupabaseClient";
import { Type, GoogleGenAI } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

export class MasterBrainEngine {
  private thoughts: AgentThought[] = [];
  private onThoughtUpdate: (thoughts: AgentThought[]) => void;
  private onActionTaken?: (action: AutonomousAction) => void;
  private activeJobId?: string;

  constructor(
    onThoughtUpdate: (thoughts: AgentThought[]) => void,
    onActionTaken?: (action: AutonomousAction) => void,
    jobId?: string
  ) {
    this.onThoughtUpdate = onThoughtUpdate;
    this.onActionTaken = onActionTaken;
    this.activeJobId = jobId;
  }

  private async addThought(role: AgentRole, message: string, status: AgentThought['status'] = 'resolved') {
    const thought: AgentThought = {
      role,
      message,
      timestamp: new Date().toLocaleTimeString(),
      status
    };
    this.thoughts = [thought, ...this.thoughts];
    this.onThoughtUpdate([...this.thoughts]);

    // Save Point Strategy: Persist thoughts to Supabase instantly for session recovery
    if (this.activeJobId) {
      await supabase.from('active_jobs').update({
        thoughts: this.thoughts,
        lastUpdate: new Date().toISOString()
      }).eq('id', this.activeJobId);
    }
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

  async executeSovereignLoop(strategy: PlatformStrategy): Promise<Domain[]> {
    await this.addThought(AgentRole.STRATEGIST, "Launching Persistent Sovereign Cycle (V6)...", "thinking");
    
    // Recovery Phase: Try to fetch older thoughts if Job ID exists
    if (this.activeJobId) {
      const { data } = await supabase.from('active_jobs').select('thoughts').eq('id', this.activeJobId).single();
      if (data?.thoughts) {
        this.thoughts = data.thoughts;
        this.onThoughtUpdate([...this.thoughts]);
      }
    }

    const rawOpportunities = await AIService.rigorousDiscoveryAI(strategy.investmentThesis);
    await this.addThought(AgentRole.EXECUTOR, `Frontier sweep complete. Identified ${rawOpportunities.data.length} assets.`);

    const auditedDomains: Domain[] = [];
    for (const opp of rawOpportunities.data.slice(0, 3)) {
      await this.addThought(AgentRole.AUDITOR, `Forensic Audit: ${opp.name}...`, "thinking");
      const auditResult = await AIService.evaluateDomainExpertAI(opp.name);
      
      if (auditResult.data && auditResult.data.probability > 0.65) {
        auditedDomains.push({
          id: Math.random().toString(36).substr(2, 9),
          workspaceId: strategy.id,
          name: opp.name,
          price: opp.estimatedPrice || 250,
          status: 'available',
          contentStatus: 'none',
          sector: auditResult.data.sector,
          probability: auditResult.data.probability,
          justification: auditResult.data.justification,
          lastChecked: new Date().toISOString(),
          integrityScore: auditResult.cached ? 100 : 85,
          technicalMetrics: {
             ...auditResult.data.technicalMetrics,
             verificationStatus: auditResult.cached ? 'CROSS_REFERENCED' : 'AI_INFERRED'
          }
        });
        this.recordAction('PURCHASE', opp.name, "Asset approved for liquidity injection.", 95);
      }
    }

    await this.addThought(AgentRole.STRATEGIST, `Autonomous loop finalized. Context Saved.`);
    return auditedDomains;
  }

  /**
   * Analyzes a buyer message to generate negotiation points.
   */
  async analyzeNegotiation(domainName: string, buyerMessage: string): Promise<NegotiationBattleCard> {
    return generateStructuredAI<NegotiationBattleCard>(
      'gemini-3-flash-preview',
      "Negotiation Expert and EQ Analyst specializing in digital asset sales.",
      `Analyze this message for ${domainName}: "${buyerMessage}"`,
      {
        type: Type.OBJECT,
        properties: {
          buyerMotive: { type: Type.STRING, description: "Underlying motivation of the buyer." },
          leveragePoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tactical advantages for the seller." },
          suggestedCounter: { type: Type.NUMBER, description: "Recommended counter-offer price." },
          closingProbability: { type: Type.NUMBER, description: "Probability of closing the deal 0-100." },
          sentimentScore: { type: Type.NUMBER, description: "Buyer sentiment rating 0-10." }
        },
        required: ['buyerMotive', 'leveragePoints', 'suggestedCounter', 'closingProbability', 'sentimentScore']
      }
    );
  }

  /**
   * Generates a term sheet based on domain data.
   */
  async generateTermSheet(domain: Domain): Promise<string> {
    // Instantiate new instance for current call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, structured legal term sheet for the sale of the domain ${domain.name} for $${domain.price}. 
      Include sections for Asset Description, Purchase Price, Closing Date, Representations and Warranties, and Confidentiality.`
    });
    return response.text || '';
  }
}
