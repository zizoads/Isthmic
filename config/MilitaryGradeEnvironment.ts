// 🎖️ ISTHMIC ENVIRONMENTAL CORE v2.2
// 🛡️ Principle: Zero-latency key resolution.

export class MilitaryEnvironment {
  private static instance: MilitaryEnvironment;

  private constructor() {}

  static getInstance(): MilitaryEnvironment {
    if (!MilitaryEnvironment.instance) {
      MilitaryEnvironment.instance = new MilitaryEnvironment();
    }
    return MilitaryEnvironment.instance;
  }

  /**
   * Directly retrieves critical infrastructure variables.
   */
  get(key: string): string {
    const env = (import.meta as any).env;
    const proc = (typeof process !== 'undefined') ? process.env : {};
    
    return env?.[`VITE_${key}`] || 
           env?.[key] || 
           proc?.[`VITE_${key}`] || 
           proc?.[key] || 
           '';
  }

  /**
   * Protocol Purge
   */
  selfDestruct() {
    localStorage.clear();
    sessionStorage.clear();
    // window.location.reload(); // Disabled to prevent infinite reload loops
  }
}

const MilitaryEnv = MilitaryEnvironment.getInstance();
export default MilitaryEnv;