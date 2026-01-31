
import { supabase } from './SupabaseClient';
import { Domain, ResilienceMetrics, AgentRole, ActiveJob } from '../types';

export class StressTestService {
  private static isChaosMode = false;

  static toggleChaosMode(active: boolean) {
    this.isChaosMode = active;
    localStorage.setItem('isthmic_chaos_mode', active.toString());
  }

  static getChaosStatus() {
    return localStorage.getItem('isthmic_chaos_mode') === 'true';
  }

  /**
   * محاكاة تحديث دفعي لـ 100 نطاق في وقت واحد لقياس زمن استجابة النبض
   */
  static async simulateBurstUpdate(workspaceId: string): Promise<number> {
    const startTime = performance.now();
    const fakeDomains: Domain[] = Array.from({ length: 100 }).map((_, i) => ({
      id: `stress_${i}_${Date.now()}`,
      workspaceId,
      name: `stress-test-${i}.com`,
      price: Math.floor(Math.random() * 5000),
      status: 'available',
      lastChecked: new Date().toISOString()
    }));

    const { error } = await supabase.from('domains').upsert(fakeDomains);
    if (error) throw error;

    const endTime = performance.now();
    return Math.round(endTime - startTime);
  }

  /**
   * محاكاة انقطاع مفاجئ لمهمة نشطة لاختبار بروتوكول التعافي
   */
  static async simulateZombieJob(workspaceId: string): Promise<string> {
    const jobId = `zombie_${Date.now()}`;
    const initialJob: ActiveJob = {
      id: jobId,
      workspaceId,
      type: 'SOVEREIGN_LOOP',
      status: 'running',
      payload: { test: true },
      thoughts: [
        { role: AgentRole.STRATEGIST, message: "إعداد بروتوكول الفوضى...", timestamp: new Date().toLocaleTimeString(), status: 'resolved' },
        { role: AgentRole.AUDITOR, message: "بدء فحص الثغرات المتعمد...", timestamp: new Date().toLocaleTimeString(), status: 'thinking' }
      ],
      lastUpdate: new Date().toISOString()
    };

    await supabase.from('active_jobs').upsert(initialJob);
    return jobId;
  }

  static async measureIntegrity(jobId: string): Promise<boolean> {
    const { data } = await supabase.from('active_jobs').select('*').eq('id', jobId).single();
    return !!(data && data.status === 'running' && data.thoughts.length === 2);
  }
}
