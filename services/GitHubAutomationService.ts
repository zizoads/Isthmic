
import { GitHubService } from "./GitHubService";
import { StrictTestingEnforcer } from "../quality/StrictTestingEnforcer";
import { generateStructuredAI } from "./ai/base";
import { Type } from "@google/genai";

export interface DispatchStep {
  id: string;
  label: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  log?: string;
}

export class GitHubAutomationService {
  private static readonly MODEL = 'gemini-3-flash-preview';

  static async generateCommitMessage(changesSummary: string): Promise<string> {
    const result = await generateStructuredAI<any>(
      this.MODEL,
      "Role: Senior DevOps Engineer. Task: Write a concise, professional Git commit message.",
      `Summarize these changes: ${changesSummary}`,
      {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING }
        }
      }
    );
    return result.data.message || "Sovereign Build Update";
  }

  static async runProductionPipeline(
    files: { path: string; content: string }[],
    token: string,
    onProgress: (steps: DispatchStep[]) => void
  ) {
    const steps: DispatchStep[] = [
      { id: 'quality', label: 'Quality Gate Audit', status: 'PENDING' },
      { id: 'security', label: 'Forensic Security Scan', status: 'PENDING' },
      { id: 'commit', label: 'AI Commit Synthesis', status: 'PENDING' },
      { id: 'dispatch', label: 'GitHub Sovereign Dispatch', status: 'PENDING' }
    ];

    const updateStep = (id: string, status: DispatchStep['status'], log?: string) => {
      const idx = steps.findIndex(s => s.id === id);
      if (idx !== -1) {
        steps[idx].status = status;
        if (log) steps[idx].log = log;
        onProgress([...steps]);
      }
    };

    try {
      // 1. Quality
      updateStep('quality', 'RUNNING');
      const qReport = await StrictTestingEnforcer.runProductionGateChecks();
      if (!qReport.passed) throw new Error("Quality Gate Failed");
      updateStep('quality', 'COMPLETED', `Score: ${qReport.score}%`);

      // 2. Security
      updateStep('security', 'RUNNING');
      if (qReport.threatLevel === 'CRITICAL') throw new Error("Security Breach Detected");
      updateStep('security', 'COMPLETED', `Threat Level: ${qReport.threatLevel}`);

      // 3. Commit
      updateStep('commit', 'RUNNING');
      const commitMsg = await this.generateCommitMessage(`Updated ${files.length} core files in production branch.`);
      updateStep('commit', 'COMPLETED', commitMsg);

      // 4. Dispatch
      updateStep('dispatch', 'RUNNING');
      for (const file of files) {
        await GitHubService.pushFile(file.path, file.content, commitMsg, token);
      }
      updateStep('dispatch', 'COMPLETED', "All files synced to main.");

    } catch (e: any) {
      const active = steps.find(s => s.status === 'RUNNING');
      if (active) updateStep(active.id, 'FAILED', e.message);
      throw e;
    }
  }
}
