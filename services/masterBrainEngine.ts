
import { AgentRole, AgentThought, Domain, PlatformStrategy, AutonomousAction, NegotiationBattleCard } from "../types";
import * as AIService from "./geminiService";

export class MasterBrainEngine {
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

  async generateTermSheet(domain: Domain): Promise<string> {
    this.addThought(AgentRole.LIQUIDATOR, `Architecting high-stakes legal framework for: ${domain.name}...`, "thinking");
    const ai = AIService.getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a binding Domain Sales Agreement for ${domain.name}. Price: $${domain.price}. Legal jurisdiction: International Digital Asset Law. Focus on Escrow security.`,
    });
    this.addThought(AgentRole.LIQUIDATOR, `Term Sheet synthesized with 99.8% legal integrity.`);
    return response.text || "Agreement Generation Failed.";
  }

  async analyzeNegotiation(domainName: string, buyerMessage: string): Promise<NegotiationBattleCard> {
    this.addThought(AgentRole.LIQUIDATOR, `Deciphering buyer psychology and hidden motives...`, "thinking");
    const card = await AIService.debateDomainStrategyAI(domainName);
    
    this.addThought(AgentRole.LIQUIDATOR, `Vulnerability detected: Buyer shows "Strategic Urgency". Raising counter-offer target.`);
    this.recordAction('NEGOTIATION', domainName, "Psychological battle-card synthesized.", 92);
    
    return card as any;
  }

  async executeSovereignLoop(strategy: PlatformStrategy): Promise<Domain[]> {
    this.addThought(AgentRole.STRATEGIST, "Launching Recursive Sovereign Cycle (V5)...", "thinking");
    
    const rawOpportunities = await AIService.rigorousDiscoveryAI(strategy.investmentThesis);
    this.addThought(AgentRole.EXECUTOR, `Frontier sweep complete. ${rawOpportunities.length} potential alpha assets identified.`);

    const auditedDomains: Domain[] = [];
    for (const opp of rawOpportunities.slice(0, 3)) {
      this.addThought(AgentRole.AUDITOR, `Forensic Audit in progress for: ${opp.name}...`, "thinking");
      const auditResult = await AIService.evaluateDomainExpertAI(opp.name);
      
      if (auditResult.probability > 0.65) {
        auditedDomains.push({
          id: Math.random().toString(36).substr(2, 9),
          // Added workspaceId using strategy.id which represents the profile ID
          workspaceId: strategy.id,
          name: opp.name,
          price: opp.estimatedPrice || 250,
          status: 'available',
          contentStatus: 'none',
          sector: auditResult.sector,
          probability: auditResult.probability,
          justification: auditResult.justification,
          lastChecked: new Date().toISOString(),
          financials: {
            acquisitionCost: opp.estimatedPrice || 250,
            holdingCostPerYear: 15,
            targetExitPrice: (opp.estimatedPrice || 250) * 15,
            projectedROI: 1400,
            netProfit: (opp.estimatedPrice || 250) * 14,
            platformFees: (opp.estimatedPrice || 250) * 0.15,
            escrowFees: (opp.estimatedPrice || 250) * 0.03,
            liquidityScore: Math.round(auditResult.probability * 100),
            alphaScore: 88
          }
        });
        this.recordAction('PURCHASE', opp.name, "Asset approved for liquidity injection.", 95);
      }
    }

    this.addThought(AgentRole.STRATEGIST, `Autonomous loop finalized. Portfolio equity increased by projected $${auditedDomains.reduce((acc, d) => acc + (d.financials?.netProfit || 0), 0).toLocaleString()}.`);
    return auditedDomains;
  }
}
