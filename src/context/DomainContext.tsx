
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { Domain, PlatformStats, UserProfile, ActivityLog, SystemThought } from '../types';
import { useAuth } from './AuthContext';
import { generateStructuredAI } from '../services/ai/base';

export interface DomainContextType {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  stats: PlatformStats;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical', payload?: any) => void;
  dismissLog: (id: string) => void;
  activityLogs: ActivityLog[];
  activeProfile: UserProfile | null;
  setActiveProfile: (p: UserProfile | null) => void;
  isInitialLoading: boolean;
  updateDomain: (d: Domain) => Promise<void>;
  addDomain: (d: Domain) => Promise<void>;
  triggerSystemPurge: () => void;
  isBrainActive: boolean;
  setIsBrainActive: (val: boolean) => void;
  systemThoughts: SystemThought[];
  addThought: (agent: string, thought: string, priority?: 'low' | 'medium' | 'high') => void;
  performStrategicMining: (query: string) => Promise<void>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isBrainActive, setIsBrainActive] = useState(false);
  const [systemThoughts, setSystemThoughts] = useState<SystemThought[]>([]);

  const addThought = useCallback((agent: string, thought: string, priority: 'low' | 'medium' | 'high' = 'low') => {
    const newThought: SystemThought = {
      id: Math.random().toString(36).substr(2, 9),
      agent,
      thought,
      priority,
      timestamp: new Date().toLocaleTimeString()
    };
    setSystemThoughts(prev => [newThought, ...prev].slice(0, 5));
  }, []);

  // Sync Profile
  useEffect(() => {
    if (user) {
      setActiveProfile(user);
    } else {
      setActiveProfile(null);
    }
  }, [user]);

  // Real-time Firestore Sync for Domains
  useEffect(() => {
    if (!user) {
      setDomains([]);
      setIsInitialLoading(false);
      return;
    }

    const q = query(collection(db, 'brand_opportunities'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Domain[];
      
      setDomains(docs);
      setIsInitialLoading(false);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'brand_opportunities');
      } catch (_e) {
        // Error is logged by handleFirestoreError
      }
      setIsInitialLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addLog = useCallback((agent: string, message: string, type: any = 'info', payload?: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    setActivityLogs(prev => [{
      id,
      time: new Date().toLocaleTimeString(),
      agent, message, type, payload
    }, ...prev].slice(0, 30));

    if (type !== 'critical') {
      setTimeout(() => {
        setActivityLogs(prev => prev.filter(log => log.id !== id));
      }, 5000);
    }
  }, []);

  const dismissLog = useCallback((id: string) => {
    setActivityLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  const updateDomain = async (d: Domain) => {
    try {
      const domainRef = doc(db, 'brand_opportunities', d.id);
      await updateDoc(domainRef, { ...d, updatedAt: serverTimestamp() });
      addLog('System', `Asset updated: ${d.name}`, 'success');
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `brand_opportunities/${d.id}`);
      } catch (_e) {
        // Error is logged by handleFirestoreError
      }
    }
  };

  const addDomain = async (d: Domain) => {
    try {
      await addDoc(collection(db, 'brand_opportunities'), {
        ...d,
        createdAt: serverTimestamp(),
        createdBy: user?.id
      });
      addLog('System', `New asset registered: ${d.name}`, 'success');
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'brand_opportunities');
      } catch (_e) {
        // Error is logged by handleFirestoreError
      }
    }
  };

  const triggerSystemPurge = () => { localStorage.clear(); window.location.reload(); };

  const stats: PlatformStats = useMemo(() => ({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    estimatedPortfolioValue: domains.reduce((a, b) => a + (b.price || 0), 0),
    avgProfit: 340, openRate: 92, messagesSent: 14, alignmentVelocity: 14, adaptiveThreshold: 85
  }), [domains]);

  const performStrategicMining = async (queryStr: string) => {
    addLog('Alpha Mine', `Initiating strategic sweep for: ${queryStr}`, 'info');
    setIsBrainActive(true);
    
    try {
      const schema = {
        type: "object",
        properties: {
          opportunities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                price: { type: "number" },
                sector: { type: "string" },
                justification: { type: "string" },
                strategicAlignmentScore: { type: "number" }
              },
              required: ["name", "price", "sector", "justification", "strategicAlignmentScore"]
            }
          }
        },
        required: ["opportunities"]
      };

      const systemInstruction = `You are the Alpha Mine Strategic Engine. 
      Generate high-value brand opportunities and domain names based on the user's query.
      Focus on semantic hand-reg .com assets that have high brandability.
      Provide realistic prices ($10-$15 for hand-reg).`;

      const prompt = `Generate 5 brand opportunities for the niche: ${queryStr}`;
      const userApiKey = user?.apiKeys?.gemini;

      const { data } = await generateStructuredAI<{ opportunities: any[] }>(
        'gemini-3-flash-preview',
        systemInstruction,
        prompt,
        schema,
        undefined,
        undefined,
        undefined,
        userApiKey
      );

      const opportunities = data.opportunities || [];
      
      for (const opp of opportunities) {
        await addDoc(collection(db, 'brand_opportunities'), {
          ...opp,
          id: Math.random().toString(36).substr(2, 9),
          workspaceId: 'sys',
          status: 'available',
          probability: 0.95,
          trafficSignal: Math.random() > 0.5 ? 'low' : 'none',
          trafficSource: 'Direct',
          createdAt: serverTimestamp(),
          createdBy: user?.id
        });
      }

      addLog('Alpha Mine', `Strategic sweep complete. ${opportunities.length} assets identified and saved to Firestore.`, 'success');
      if (opportunities.length > 0) {
        addThought('Alpha Mine', `Prioritizing ${opportunities[0].name}: High strategic alignment detected.`, 'high');
      }
    } catch (e: any) {
      const errorString = typeof e === 'string' ? e : JSON.stringify(e);
      let errorMsg = e.message || (errorString.includes('error') ? errorString : 'Unknown error occurred');
      
      if (errorMsg.includes('429') || errorMsg.includes('Quota exceeded') || errorString.includes('429')) {
        errorMsg = 'Rate limit exceeded. Please wait a minute before trying again (Free Tier limit is 5 requests/min).';
        console.warn("Mining Warning (Rate Limit):", errorMsg);
      } else if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('Missing or insufficient permissions') || errorString.includes('403') || errorString.includes('PERMISSION_DENIED')) {
        errorMsg = 'Database permission denied. Please ensure your Firebase security rules are deployed.';
        console.warn("Mining Warning (Permission):", errorMsg);
      } else {
        console.error("Mining Error:", e);
      }
      addLog('System', `Strategic mining failed: ${errorMsg}`, 'critical');
    } finally {
      setIsBrainActive(false);
    }
  };

  return (
    <DomainContext.Provider value={{ 
      domains, setDomains, stats, addLog, dismissLog,
      activityLogs, activeProfile, setActiveProfile, isInitialLoading, 
      updateDomain, addDomain, triggerSystemPurge,
      isBrainActive, setIsBrainActive,
      systemThoughts, addThought,
      performStrategicMining
    }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const ctx = useContext(DomainContext);
  if (!ctx) throw new Error("DomainContext outside Provider");
  return ctx;
};
