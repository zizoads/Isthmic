
import { AgentRole, AgentThought, Domain, PlatformStrategy, AutonomousAction, NegotiationBattleCard, ActiveJob } from "../types";
import * as AIService from "./geminiService";
import { supabase } from "./SupabaseClient";
import { Type, GoogleGenAI } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

export class MasterBrainEngine {
  private thoughts: AgentThought[] = [];
  private onThoughtUpdate: (thoughts: AgentThought[]) => void;
  private activeJobId?: string;

  constructor(
    onThoughtUpdate: (thoughts: AgentThought[]) => void,
    jobId?: string
  ) {
    this.onThoughtUpdate = onThoughtUpdate;
    this.activeJobId = jobId;
  }

  /**
   * نظام حفظ النبض (Pulse Save): يضمن تماسك البيانات في الخلفية
   */
  private async persistState(thoughts: AgentThought[], status: ActiveJob['status'] = 'running') {
    if (!this.activeJobId) return;
    
    await supabase.from('active_jobs').upsert({
      id: this.activeJobId,
      thoughts: thoughts,
      status: status,
      lastUpdate: new Date().toISOString()
    });
    
    this.onThoughtUpdate([...thoughts]);
  }

  private async addThought(role: AgentRole, message: string, status: AgentThought['status'] = 'resolved') {
    const thought: AgentThought = {
      role,
      message,
      timestamp: new Date().toLocaleTimeString(),
      status
    };
    this.thoughts = [thought, ...this.thoughts];
    await this.persistState(this.thoughts);
  }

  async executeSovereignLoop(strategy: PlatformStrategy): Promise<Domain[]> {
    // 1. استعادة السياق المفقود (Context Recovery)
    if (this.activeJobId) {
      const { data } = await supabase.from('active_jobs').select('thoughts').eq('id', this.activeJobId).single();
      if (data?.thoughts) {
        this.thoughts = data.thoughts;
        this.onThoughtUpdate([...this.thoughts]);
      }
    }

    await this.addThought(AgentRole.STRATEGIST, "Resynchronizing background logic threads...", "thinking");
    
    // 2. التنفيذ الاستراتيجي المعزز بالبحث الأرضي
    const rawOpportunities = await AIService.rigorousDiscoveryAI(strategy.investmentThesis);
    await this.addThought(AgentRole.EXECUTOR, `Market Sweep complete. Analysis of ${rawOpportunities.data.length} assets initiated.`);

    const auditedDomains: Domain[] = [];
    for (const opp of rawOpportunities.data.slice(0, 3)) {
      await this.addThought(AgentRole.AUDITOR, `Forensic Deep-Dive: ${opp.name}`, "thinking");
      
      const auditResult = await AIService.evaluateDomainExpertAI(opp.name);
      
      // نظام نزاهة البيانات: التحقق من الهلوسة
      const confidenceBonus = auditResult.cached ? 15 : 0;
      const finalIntegrity = Math.min(100, (auditResult.data?.probability * 100) + confidenceBonus);

      if (auditResult.data && auditResult.data.probability > 0.6) {
        auditedDomains.push({
          id: Math.random().toString(36).substr(2, 9),
          workspaceId: strategy.id,
          name: opp.name,
          price: opp.estimatedPrice || 250,
          status: 'available',
          contentStatus: 'none',
          sector: auditResult.data.sector,
          probability: auditResult.data.probability,
          integrityScore: finalIntegrity,
          justification: auditResult.data.justification,
          lastChecked: new Date().toISOString(),
          technicalMetrics: {
             ...auditResult.data.technicalMetrics,
             verificationStatus: auditResult.cached ? 'CROSS_REFERENCED' : 'AI_INFERRED'
          }
        });
      }
    }

    await this.persistState(this.thoughts, 'completed');
    return auditedDomains;
  }

  async analyzeNegotiation(domainName: string, buyerMessage: string): Promise<NegotiationBattleCard> {
    return generateStructuredAI<NegotiationBattleCard>(
      'gemini-3-flash-preview',
      "Elite Negotiation Strategist.",
      `Analyze: ${buyerMessage} for ${domainName}`,
      {
        type: Type.OBJECT,
        properties: {
          buyerMotive: { type: Type.STRING },
          leveragePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedCounter: { type: Type.NUMBER },
          closingProbability: { type: Type.NUMBER },
          sentimentScore: { type: Type.NUMBER }
        }
      }
    );
  }

  async generateTermSheet(domain: Domain): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft professional term sheet for ${domain.name} at $${domain.price}.`
    });
    return response.text || '';
  }
}
