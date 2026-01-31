
import { AgentRole, AgentThought, Domain, PlatformStrategy, NegotiationBattleCard, ActiveJob } from "../types";
import * as AIService from "./geminiService";
import { supabase } from "./SupabaseClient";
import { Type, GoogleGenAI } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

/**
 * MasterBrainEngine: Sovereign engine for managing autonomous operations.
 * Supports state recovery and checkpointing.
 */
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

  // Persist job state to Supabase to ensure resume capability
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

  // Add a new thought to the log with immediate DB sync
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
    // 1. Context restoration logic from previous session
    if (this.activeJobId) {
      const { data } = await supabase.from('active_jobs').select('thoughts, payload').eq('id', this.activeJobId).single();
      if (data?.thoughts) {
        this.thoughts = data.thoughts;
        this.onThoughtUpdate([...this.thoughts]);
      }
    }

    const hasCompletedDiscovery = this.thoughts.some(t => t.message.includes("PHASE_DISCOVERY_COMPLETE"));
    let rawOpportunities: any = null;

    // --- Phase 1: Market Discovery ---
    if (!hasCompletedDiscovery) {
      await this.addThought(AgentRole.STRATEGIST, "Initiating Phase 1: Strategic Market Sweep...", "thinking");
      const discoveryResult = await AIService.rigorousDiscoveryAI(strategy.investmentThesis);
      rawOpportunities = discoveryResult.data;
      
      // Store initial results in job payload for safe resumption
      if (this.activeJobId) {
        await supabase.from('active_jobs').update({ 
          payload: { ...strategy, discoveredLeads: rawOpportunities } 
        }).eq('id', this.activeJobId);
      }
      
      await this.addThought(AgentRole.STRATEGIST, `Discovery concluded (PHASE_DISCOVERY_COMPLETE): ${rawOpportunities.length} units identified.`);
    } else {
      await this.addThought(AgentRole.STRATEGIST, "Resuming from Phase 2: Forensic Audit...", "resolved");
      // Restore results from previous session payload
      const { data: jobData } = await supabase.from('active_jobs').select('payload').eq('id', this.activeJobId!).single();
      rawOpportunities = jobData?.payload?.discoveredLeads || [];
    }

    // --- Phase 2: Forensic Audit ---
    const auditedDomains: Domain[] = [];
    const alreadyAudited = this.thoughts
      .filter(t => t.message.includes("AUDIT_SUCCESS:"))
      .map(t => t.message.split(":")[1].trim());

    for (const opp of rawOpportunities) {
      // Skip domains audited successfully in previous session
      if (alreadyAudited.includes(opp.name)) continue;

      await this.addThought(AgentRole.AUDITOR, `In-depth forensic analysis: ${opp.name}`, "thinking");
      
      try {
        const auditResult = await AIService.evaluateDomainExpertAI(opp.name);
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
          await this.addThought(AgentRole.AUDITOR, `Audit successful (AUDIT_SUCCESS): ${opp.name}`);
        } else {
          await this.addThought(AgentRole.AUDITOR, `Domain rejected (AUDIT_REJECTED): ${opp.name} failed liquidity threshold.`);
        }
      } catch (e) {
        await this.addThought(AgentRole.AUDITOR, `Audit interrupted: ${opp.name}. Awaiting session resumption.`, 'failed');
        throw e; // Bubble up to allow key rotation or retry
      }
    }

    // --- Phase 3: Finalization ---
    await this.addThought(AgentRole.STRATEGIST, "Protocol complete. Injecting assets into vault.", "resolved");
    await this.persistState(this.thoughts, 'completed');
    return auditedDomains;
  }

  async analyzeNegotiation(domainName: string, buyerMessage: string): Promise<NegotiationBattleCard> {
    const result = await generateStructuredAI<NegotiationBattleCard>(
      'gemini-3-flash-preview',
      "Elite negotiation strategy expert.",
      `Analyze the following message: ${buyerMessage} for domain ${domainName}`,
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
    return result.data;
  }

  async generateTermSheet(domain: Domain): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional Term Sheet for domain ${domain.name} priced at $${domain.price}.`
    });
    return response.text || '';
  }
}
