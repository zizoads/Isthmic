
import { AgentRole, AgentThought, Domain, PlatformStrategy, NegotiationBattleCard, ActiveJob } from "../types";
import * as AIService from "./geminiService";
import { supabase } from "./SupabaseClient";
import { Type, GoogleGenAI } from "@google/genai";
import { generateStructuredAI } from "./ai/base";

/**
 * MasterBrainEngine: المحرك السيادي لإدارة العمليات المستقلة.
 * يدعم الآن استعادة الحالة (State Recovery) ونقاط الحفظ (Checkpointing).
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

  // حفظ حالة المهمة في Supabase لضمان القدرة على الاستئناف
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

  // إضافة فكرة جديدة للسجل مع تزامن فوري للقاعدة
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
    // 1. منطق استعادة السياق من الجلسة السابقة
    if (this.activeJobId) {
      const { data } = await supabase.from('active_jobs').select('thoughts, payload').eq('id', this.activeJobId).single();
      if (data?.thoughts) {
        this.thoughts = data.thoughts;
        this.onThoughtUpdate([...this.thoughts]);
      }
    }

    const hasCompletedDiscovery = this.thoughts.some(t => t.message.includes("PHASE_DISCOVERY_COMPLETE"));
    let rawOpportunities: any = null;

    // --- المرحلة 1: تنقيب السوق (Market Discovery) ---
    if (!hasCompletedDiscovery) {
      await this.addThought(AgentRole.STRATEGIST, "بدء المرحلة 1: مسح السوق الاستراتيجي...", "thinking");
      const discoveryResult = await AIService.rigorousDiscoveryAI(strategy.investmentThesis);
      rawOpportunities = discoveryResult.data;
      
      // تخزين النتائج الأولية في حمولة المهمة لضمان سلامة الاستئناف
      if (this.activeJobId) {
        await supabase.from('active_jobs').update({ 
          payload: { ...strategy, discoveredLeads: rawOpportunities } 
        }).eq('id', this.activeJobId);
      }
      
      await this.addThought(AgentRole.STRATEGIST, `تم اكتمال التنقيب (PHASE_DISCOVERY_COMPLETE): تم تحديد ${rawOpportunities.length} وحدة.`);
    } else {
      await this.addThought(AgentRole.STRATEGIST, "استئناف العمل من المرحلة 2: التدقيق الجنائي...", "resolved");
      // استعادة النتائج من حمولة الجلسة السابقة
      const { data: jobData } = await supabase.from('active_jobs').select('payload').eq('id', this.activeJobId!).single();
      rawOpportunities = jobData?.payload?.discoveredLeads || [];
    }

    // --- المرحلة 2: التدقيق الجنائي (Forensic Audit) ---
    const auditedDomains: Domain[] = [];
    const alreadyAudited = this.thoughts
      .filter(t => t.message.includes("AUDIT_SUCCESS:"))
      .map(t => t.message.split(":")[1].trim());

    for (const opp of rawOpportunities) {
      // تخطي النطاقات التي تم تدقيقها بنجاح في الجلسة السابقة
      if (alreadyAudited.includes(opp.name)) continue;

      await this.addThought(AgentRole.AUDITOR, `تحليل جنائي معمق: ${opp.name}`, "thinking");
      
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
          await this.addThought(AgentRole.AUDITOR, `تم التدقيق بنجاح (AUDIT_SUCCESS): ${opp.name}`);
        } else {
          await this.addThought(AgentRole.AUDITOR, `تم رفض النطاق (AUDIT_REJECTED): ${opp.name} لم يتجاوز عتبة السيولة.`);
        }
      } catch (e) {
        await this.addThought(AgentRole.AUDITOR, `انقطاع التدقيق: ${opp.name}. بانتظار استئناف الجلسة.`, 'failed');
        throw e; // رفع الخطأ للسماح للمستخدم بتبديل المفتاح أو الاستئناف لاحقاً
      }
    }

    // --- المرحلة 3: الإنهاء (Finalization) ---
    await this.addThought(AgentRole.STRATEGIST, "اكتمل البروتوكول. يتم الآن حقن الأصول في الخزينة.", "resolved");
    await this.persistState(this.thoughts, 'completed');
    return auditedDomains;
  }

  async analyzeNegotiation(domainName: string, buyerMessage: string): Promise<NegotiationBattleCard> {
    const result = await generateStructuredAI<NegotiationBattleCard>(
      'gemini-3-flash-preview',
      "خبير استراتيجيات التفاوض النخبوي.",
      `حلل الرسالة التالية: ${buyerMessage} للنطاق ${domainName}`,
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
      contents: `قم بصياغة ورقة شروط مهنية (Term Sheet) للنطاق ${domain.name} بسعر $${domain.price}.`
    });
    return response.text || '';
  }
}
