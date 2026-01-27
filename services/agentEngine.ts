
import { Type } from "@google/genai";
import { AgentRole, AgentThought } from "../types";
import { getAIClient, safeAICall } from "./ai/base";

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
    
    return safeAICall(async () => {
      const ai = getAIClient();
      
      // Phase 1: Semantic Analysis
      const analyzerResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyzer Role: Mission: ${task}. Strategy: ${strategy}. Extract 3 core search vectors.`,
        config: { 
          responseMimeType: "application/json", 
          responseSchema: { 
            type: Type.OBJECT, 
            properties: { 
              vectors: { type: Type.ARRAY, items: { type: Type.STRING } } 
            }
          } 
        }
      });

      const vectors = JSON.parse(analyzerResponse.text || '{"vectors":[]}').vectors;
      this.addThought(AgentRole.ANALYZER, `Vectors locked: ${vectors.join(", ")}`);

      // Phase 2: Tactical Execution
      this.addThought(AgentRole.EXECUTOR, "Scanning global digital frontier...", "thinking");
      const executorResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Execute acquisition sweep for: ${vectors.join(", ")}. Ground results in verified market data.`,
        config: { 
          tools: [{ googleSearch: {} }], 
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
              } 
            } 
          } 
        }
      });
      
      const results = JSON.parse(executorResponse.text || '[]');
      this.addThought(AgentRole.EXECUTOR, `Harvest complete: ${results.length} alpha assets identified.`);
      return results;
    });
  }
}
