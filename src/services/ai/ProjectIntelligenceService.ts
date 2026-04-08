import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";

export interface ProjectContext {
  useCases: string;
  refactorPlan: string;
  metadata: any;
  packageJson: any;
}

export interface ProjectInsight {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  category: "Architecture" | "Security" | "Feature" | "Refactor";
}

export class ProjectIntelligenceService {
  async getProjectContext(): Promise<ProjectContext> {
    try {
      const response = await fetch("/api/project/intelligence");
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ [INTEL] API error:", response.status, text.substring(0, 100));
        throw new Error(`Failed to fetch project context: ${response.status}`);
      }
      return response.json();
    } catch (err) {
      console.error("❌ [INTEL] Fetch failed:", err);
      throw err;
    }
  }

  async generateInsights(context: ProjectContext): Promise<ProjectInsight[]> {
    const prompt = `
      Analyze the following project metadata for "Isthmic Pro Sovereign-2.3", a military-grade digital asset OS.
      
      Metadata: ${JSON.stringify(context.metadata)}
      Package Dependencies: ${JSON.stringify(context.packageJson.dependencies)}
      Current Use Cases:
      ${context.useCases}
      
      Completed Refactor Steps:
      ${context.refactorPlan}
      
      Based on this infrastructure, suggest 5 professional, high-impact next steps for the project's evolution. 
      Focus on "making real things done" and "infrastructure hardening" (inspired by the Claw Code philosophy).
    `;

    const result = await generateStructuredAI<ProjectInsight[]>(
      "gemini-1.5-flash",
      "Role: Chief Architect & Strategic Planner.",
      prompt,
      {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            category: { type: Type.STRING, enum: ["Architecture", "Security", "Feature", "Refactor"] },
          },
          required: ["title", "description", "impact", "category"],
        },
      }
    );

    return result.data;
  }
}
