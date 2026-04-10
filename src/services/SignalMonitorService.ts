
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';

export interface IntelligenceSignal {
  id: string;
  source: 'RSS' | 'TELEGRAM' | 'API' | 'ADS-B';
  category: 'MARKET' | 'TECH' | 'LEGAL' | 'GEOPOLITICAL';
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  metadata?: any;
}

/**
 * Sovereign Signal Monitor (SSM)
 * Inspired by IRONSIGHT for high-efficiency situational awareness.
 */
export class SignalMonitorService {
  private static instance: SignalMonitorService;

  private constructor() {}

  public static getInstance(): SignalMonitorService {
    if (!SignalMonitorService.instance) {
      SignalMonitorService.instance = new SignalMonitorService();
    }
    return SignalMonitorService.instance;
  }

  /**
   * Simulates the ingestion of a new signal from external sources.
   * In a real production environment, this would be triggered by webhooks or cron jobs.
   */
  public async ingestSignal(signal: Omit<IntelligenceSignal, 'id' | 'timestamp'>) {
    const signalsRef = collection(db, 'intelligence_signals');
    try {
      await addDoc(signalsRef, {
        ...signal,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, 'intelligence_signals');
      } catch (e) {
        // Error is logged by handleFirestoreError
      }
    }
  }

  /**
   * Returns a listener for real-time signals.
   */
  public subscribeToSignals(callback: (signals: IntelligenceSignal[]) => void) {
    const signalsRef = collection(db, 'intelligence_signals');
    const q = query(signalsRef, orderBy('timestamp', 'desc'), limit(20));

    return onSnapshot(q, (snapshot) => {
      const signals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IntelligenceSignal[];
      callback(signals);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'intelligence_signals');
      } catch (e) {
        // Error is logged by handleFirestoreError
      }
    });
  }

  /**
   * Generates mock signals to demonstrate the system's capability.
   */
  public async seedMockSignals() {
    const mockSignals: Omit<IntelligenceSignal, 'id' | 'timestamp'>[] = [
      {
        source: 'RSS',
        category: 'MARKET',
        title: 'AI Sector Valuation Surge',
        content: 'Major VC firms are shifting focus to specialized AI infrastructure. .ai and .io domains in this sector are seeing 40% price increases.',
        priority: 'HIGH',
        metadata: { sector: 'AI', trend: 'Bullish' }
      },
      {
        source: 'TELEGRAM',
        category: 'TECH',
        title: 'New LLM Architecture Leaked',
        content: 'Rumors of a "Sovereign-Class" LLM that runs entirely on edge devices. Potential for new "Edge" related digital assets.',
        priority: 'MEDIUM',
        metadata: { tech: 'LLM', niche: 'Edge Computing' }
      },
      {
        source: 'API',
        category: 'LEGAL',
        title: 'Trademark Update: Meta-Health',
        content: 'Meta has filed new trademarks for health-related services. Watch for domains containing "MetaHealth" or "M-Health".',
        priority: 'CRITICAL',
        metadata: { company: 'Meta', risk: 'Trademark Conflict' }
      },
      {
        source: 'ADS-B',
        category: 'GEOPOLITICAL',
        title: 'Executive Flight Pattern Detected',
        content: 'High-frequency executive travel detected between Silicon Valley and Riyadh. Potential for major cross-border infrastructure deals.',
        priority: 'LOW',
        metadata: { route: 'SJC-RUH', significance: 'Strategic Partnership' }
      }
    ];

    for (const signal of mockSignals) {
      await this.ingestSignal(signal);
    }
  }
}
