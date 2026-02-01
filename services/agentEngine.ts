
import { Type } from "@google/genai";
import { AgentRole, AgentThought } from "../types";
import { generateStructuredAI } from "./ai/base";

export class AgentEngine {
  private thoughts: AgentThought[] = [];
  private onThoughtUpdate: (thoughts: AgentThought[]) => void;

  constructor(onThoughtUpdate: (thoughts: AgentThought[]) => void) {
    this.onThoughtUpdate = onThoughtUpdate;
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

  async runMultiAgentSession(task: string, strategy: string): Promise<any[]> {
    this.thoughts = [];
    this.addThought(AgentRole.ANALYZER, "Deconstructing mission parameters...", "thinking");
    
    // المرحلة 1: التحليل الدلالي
    const analyzerResult = await generateStructuredAI<{vectors: string[]}>(
      'gemini-3-flash-preview',
      "Analyzer Role: Extract 3 core search vectors.",
      `Mission: ${task}. Strategy: ${strategy}.`,
      { 
        type: Type.OBJECT, 
        properties: { 
          vectors: { type: Type.ARRAY, items: { type: Type.STRING } } 
        }
      }
    );

    const vectors = analyzerResult.data.vectors || [];
    this.addThought(AgentRole.ANALYZER, `Vectors locked: ${vectors.join(", ")}`);

    // المرحلة 2: التنفيذ التكتيكي
    this.addThought(AgentRole.EXECUTOR, "Scanning global digital frontier...", "thinking");
    const executorResult = await generateStructuredAI<any[]>(
      'gemini-3-pro-preview',
      "Executor Role: Execute acquisition sweep grounded in verified market data.",
      `Execute acquisition sweep for: ${vectors.join(", ")}.`,
      { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            name: { type: Type.STRING }, 
            estimatedPrice: { type: Type.NUMBER },
            sector: { type: Type.STRING },
            justification: { type: Type.STRING },
            probability: { type: Type.NUMBER }
          } 
        } 
      },
      [{ googleSearch: {} }]
    );
    
    const results = executorResult.data || [];
    this.addThought(AgentRole.EXECUTOR, `Harvest complete: ${results.length} alpha assets identified.`);
    return results;
  }
}
