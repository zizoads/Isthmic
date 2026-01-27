
import { GoogleGenAI, Type } from "@google/genai";
import { AgentRole, AgentThought } from "../types";

export class AgentEngine {
  private thoughts: AgentThought[] = [];
  private onThoughtUpdate: (thoughts: AgentThought[]) => void;

  constructor(onThoughtUpdate: (thoughts: AgentThought[]) => void) {
    this.onThoughtUpdate = onThoughtUpdate;
  }

  private sanitizeInput(input: string): string {
    // إزالة الرموز التي قد تستخدم لكسر سياق البرومبت
    return input.replace(/[{}<>]/g, '').trim();
  }

  private addThought(role: AgentRole, message: string, status: AgentThought['status'] = 'resolved') {
    const thought: AgentThought = {
      role,
      message,
      timestamp: new Date().toLocaleTimeString(),
      status
    };
    this.thoughts = [...this.thoughts, thought];
    this.onThoughtUpdate(this.thoughts);
  }

  async runMultiAgentSession(task: string, strategy: string): Promise<any> {
    this.thoughts = [];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const safeTask = this.sanitizeInput(task);
    const safeStrategy = this.sanitizeInput(strategy);

    this.addThought(AgentRole.ANALYZER, "Analyzing command intent and extracting parameters...", "thinking");
    
    // استخدام هيكل بيانات صارم لمنع الحقن
    const analyzerResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { text: "You are a professional investment analyzer. Analyze the following requirements strictly." },
        { text: `Task Context: ${safeTask}` },
        { text: `Strategy Framework: ${safeStrategy}` }
      ],
      config: { 
        responseMimeType: "application/json", 
        responseSchema: { 
          type: Type.OBJECT, 
          properties: { 
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } } 
          },
          required: ['requirements']
        } 
      }
    });

    const analyzerData = JSON.parse(analyzerResponse.text || '{"requirements":[]}');
    const requirements = analyzerData.requirements || [];
    this.addThought(AgentRole.ANALYZER, `Refined Requirements: ${requirements.join(", ")}`);

    // Executor Phase
    this.addThought(AgentRole.EXECUTOR, "Executing deep market search based on analyzer's protocol...", "thinking");
    const executorResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Execute search for domains matching these sanitized requirements: ${requirements.join(". ")}`,
      config: { 
        tools: [{ googleSearch: {} }], 
        responseMimeType: "application/json", 
        responseSchema: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              name: { type: Type.STRING }, 
              reason: { type: Type.STRING } 
            } 
          } 
        } 
      }
    });
    
    const rawResults = JSON.parse(executorResponse.text || '[]');
    this.addThought(AgentRole.EXECUTOR, `Found ${rawResults.length} candidates.`);

    // Auditor Phase
    this.addThought(AgentRole.AUDITOR, "Auditing candidates for trademark risk and strategic fit...", "thinking");
    const auditorResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Strategy Context: ${safeStrategy}\nAudit these candidates: ${JSON.stringify(rawResults)}`,
      config: { 
        tools: [{ googleSearch: {} }], 
        responseMimeType: "application/json", 
        responseSchema: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT, 
            properties: { 
              name: { type: Type.STRING }, 
              approved: { type: Type.BOOLEAN }, 
              critique: { type: Type.STRING } 
            } 
          } 
        } 
      }
    });
    
    const auditResults = JSON.parse(auditorResponse.text || '[]');
    const finalSelection = auditResults.filter((r: any) => r.approved);
    
    this.addThought(AgentRole.AUDITOR, `Audit complete. Approved ${finalSelection.length} assets.`);

    return finalSelection.map((f: any) => {
      const original = rawResults.find((o: any) => o.name === f.name);
      return { ...original, justification: f.critique };
    });
  }
}
