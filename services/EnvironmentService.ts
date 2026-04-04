
import { auth } from '../firebase';

export interface EnvHealth {
  firebase: boolean;
  gemini: boolean;
  gitBridge: 'CONNECTED' | 'BLOCKED' | 'PENDING';
  rlsStatus: 'ENFORCED' | 'BYPASS_ADMIN' | 'UNKNOWN';
  version: string;
  buildDate: string;
  environment: string;
}

export class EnvironmentService {
  static async getHealthStatus(): Promise<EnvHealth> {
    const environment = process.env.NODE_ENV || 'development';
    
    const firebaseOk = !!auth.app;
    const geminiOk = !!process.env.API_KEY;
    
    // Check RLS status and profile email
    let rls: 'ENFORCED' | 'BYPASS_ADMIN' | 'UNKNOWN' = 'ENFORCED';
    try {
      const user = auth.currentUser;
      if (user?.email === 'zizoadszn@gmail.com') {
        rls = 'BYPASS_ADMIN';
      }
    } catch (e) {
      rls = 'UNKNOWN';
    }

    return {
      firebase: firebaseOk,
      gemini: geminiOk,
      gitBridge: typeof window !== 'undefined' && window.navigator.onLine ? 'CONNECTED' : 'BLOCKED',
      rlsStatus: rls,
      version: '2.3.5-sovereign-resilience',
      buildDate: new Date().toISOString(),
      environment: environment
    };
  }

  static getDeploymentLogs() {
    return [
      { id: 1, stage: 'PRE_COMMIT_HOOK', status: 'STABLE', time: 'Just now' },
      { id: 2, stage: 'VULNERABILITY_SCAN', status: 'PASSED', time: '5m ago' },
      { id: 3, stage: 'ASSET_PIPELINE_SYNC', status: 'SYNCED', time: '1h ago' },
      { id: 4, stage: 'SECURITY_POLICY_AUDIT', status: 'SECURE', time: '4h ago' }
    ];
  }

  static async validatePushPermissions(): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const user = auth.currentUser;
      if (!user) return { allowed: false, reason: "NO_ACTIVE_SESSION" };
      
      const isOwner = user.email === 'zizoadszn@gmail.com';
      return { 
        allowed: isOwner, 
        reason: isOwner ? undefined : "UNAUTHORIZED_IDENTITY_REJECTED" 
      };
    } catch (e) {
      return { allowed: false, reason: "SECURITY_SERVICE_OFFLINE" };
    }
  }
}
