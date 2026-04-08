
import { AgentRole, AgentThought, Domain, PlatformStrategy, DecompositionPlan } from "../types";
import * as AIService from "./geminiService";
import { decomposeStrategyAI } from "./ai/AnalysisService";
import { BusinessLogicEnforcer } from "../architecture/BusinessLogicEnforcer";

export class MasterBrainEngine {
  private thoughts: AgentThought[] = [];
  private onThoughtUpdate: (thoughts: AgentThought[]) => void;
  private setGlobalBrainActive?: (val: boolean) => void;

  constructor(onThoughtUpdate: (thoughts: AgentThought[]) => void, _jobId?: string, setGlobalBrainActive?: (val: boolean) => void) {
    this.onThoughtUpdate = onThoughtUpdate;
    this.setGlobalBrainActive = setGlobalBrainActive;
  }

  private async addThought(role: AgentRole, message: string, status: AgentThought['status'] = 'resolved') {
    const thought: AgentThought = { role, message, timestamp: new Date().toLocaleTimeString(), status };
    this.thoughts = [thought, ...this.thoughts];
    this.onThoughtUpdate([...this.thoughts]);
  }

  async executePlan(strategy: PlatformStrategy, onPlanReady?: (plan: DecompositionPlan) => void): Promise<Domain[]> {
    return (await BusinessLogicEnforcer.executeWithTripleValidation<Domain[]>(
      'GLOBAL_STRATEGY_EXECUTION',
      async () => {
        if (this.setGlobalBrainActive) this.setGlobalBrainActive(true);
        
        await this.addThought(AgentRole.PLANNER, "Phase 1: Initializing Strategic Decomposition...", "thinking");
        const plan = await decomposeStrategyAI(strategy.investmentThesis);
        if (onPlanReady) onPlanReady(plan);

        let discoveredLeads: any[] = [];
        const auditedDomains: Domain[] = [];

        for (const node of plan.nodes) {
          await this.addThought(AgentRole.STRATEGIST, `Executing Node: ${node.label}`, "thinking");
          
          if (node.label.includes("Vector")) {
            const discovery = await AIService.rigorousDiscoveryAI(plan.strategicIntent);
            discoveredLeads = discovery.data;
          } 
          
          if (node.label.includes("Forensic")) {
            for (const lead of discoveredLeads.slice(0, 3)) {
              await this.addThought(AgentRole.AUDITOR, `Forensic Audit: ${lead.name}`, "thinking");
              const audit = await AIService.evaluateDomainExpertAI(lead.name);
              if (audit.data.probability > 0.6) {
                auditedDomains.push({
                   id: crypto.randomUUID(),
                   workspaceId: strategy.id,
                   name: lead.name,
                   price: lead.estimatedPrice || 300,
                   status: 'available',
                   sector: audit.data.sector,
                   probability: audit.data.probability,
                   justification: audit.data.justification,
                   contentStatus: 'none',
                   technicalMetrics: audit.data.technicalMetrics
                });
              }
            }
          }
        }

        if (this.setGlobalBrainActive) this.setGlobalBrainActive(false);
        return auditedDomains;
      },
      [
        (res) => ({ valid: res.length >= 0, message: "Result set must be a valid array" }),
        (res) => ({ valid: res.every(d => !!d.name), message: "All assets must have an identified name" })
      ]
    )).result;
  }
}
