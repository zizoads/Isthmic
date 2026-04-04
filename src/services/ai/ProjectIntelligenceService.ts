import { GoogleGenAI, Type } from "@google/genai";

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
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async getProjectContext(): Promise<ProjectContext> {
    const response = await fetch("/api/project/intelligence");
    if (!response.ok) throw new Error("Failed to fetch project context");
    return response.json();
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
      
      Return the response as a JSON array of objects with: title, description, impact (High/Medium/Low), and category (Architecture/Security/Feature/Refactor).
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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
        },
      },
    });

    return JSON.parse(response.text || "[]");
  }
}
