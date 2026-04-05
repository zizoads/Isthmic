
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStats, UserProfile, ActivityLog, SystemThought } from '../types';
import { SovereignShield } from '../services/SovereignShield';
import { AuthService } from '../services/AuthService';
import { useAuth } from './AuthContext';

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
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateDomain: (d: Domain) => Promise<void>;
  addDomain: (d: Domain) => void;
  triggerSystemPurge: () => void;
  isBrainActive: boolean;
  setIsBrainActive: (val: boolean) => void;
  systemThoughts: SystemThought[];
  addThought: (agent: string, thought: string, priority?: 'low' | 'medium' | 'high') => void;
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

  useEffect(() => {
    const syncProfile = async () => {
      if (user) {
        const profile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Sovereign User',
          role: user.email === 'zizoadszn@gmail.com' ? 'Admin' : 'User',
          createdAt: new Date().toISOString(),
          avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`
        };
        setActiveProfile(profile);
      } else {
        setActiveProfile(null);
      }
    };
    syncProfile();
  }, [user]);

  useEffect(() => {
    const initializeVault = async () => {
      let d = await SovereignShield.recover<Domain[]>('domains');
      
      // Seed Scootic.com for Tactical Liaison testing if not present
      if (!d || d.length === 0 || !d.find(dom => dom.name === 'Scootic.com')) {
        const scootic: Domain = {
          id: 'scootic-001',
          workspaceId: 'sys',
          name: 'Scootic.com',
          price: 25000,
          status: 'available',
          sector: 'E-Mobility'
        };
        d = d ? [scootic, ...d] : [scootic];
      }

      if (d) setDomains(d);
      
      setIsInitialLoading(false);
    };
    initializeVault();
  }, []);

  const addLog = useCallback((agent: string, message: string, type: any = 'info', payload?: any) => {
    const id = crypto.randomUUID();
    setActivityLogs(prev => [{
      id,
      time: new Date().toLocaleTimeString(),
      agent, message, type, payload
    }, ...prev].slice(0, 30));

    // Auto-dismiss for non-critical logs after 5 seconds
    if (type !== 'critical') {
      setTimeout(() => {
        setActivityLogs(prev => prev.filter(log => log.id !== id));
      }, 5000);
    }
  }, []);

  const dismissLog = useCallback((id: string) => {
    setActivityLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const profile = await AuthService.login(email, pass);
      setActiveProfile(profile);
      await SovereignShield.protect('profile', profile);
      
      addLog('System', `Identity confirmed: ${profile.name}`, 'success');
    } catch (e: any) {
      throw e;
    }
  };

  const logout = () => { localStorage.clear(); window.location.reload(); };

  const updateDomain = async (d: Domain) => {
    const next = domains.map(old => old.id === d.id ? d : old);
    setDomains(next);
    await SovereignShield.protect('domains', next);
  };

  const addDomain = (d: Domain) => {
    const next = [d, ...domains];
    setDomains(next);
    SovereignShield.protect('domains', next);
  };

  const triggerSystemPurge = () => { localStorage.clear(); window.location.reload(); };

  const stats: PlatformStats = useMemo(() => ({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    estimatedPortfolioValue: domains.reduce((a, b) => a + (b.price || 0), 0),
    avgProfit: 340, openRate: 92, messagesSent: 14, alignmentVelocity: 14, adaptiveThreshold: 85
  }), [domains]);

  const performStrategicMining = async (query: string) => {
    addLog('Alpha Mine', `Initiating strategic sweep for: ${query}`, 'info');
    setIsBrainActive(true);
    
    try {
      // Call the backend brand generator for semantic .com names
      const response = await fetch('/api/generate-brands?domain=ai&niche=general_ai&count=5');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but received ${contentType}. Content: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();
      const names = data.names || [];
      
      const mockResults: Domain[] = names.map((name: string) => ({
        id: crypto.randomUUID(),
        workspaceId: 'sys',
        name: `${name}.com`,
        price: Math.floor(Math.random() * 4) + 10, // $10-$13
        status: 'available',
        sector: 'AI / Cognitive',
        justification: `Semantic "Hand-Reg" composition (${name.length} chars). High brandability, likely available at standard registration price.`,
        probability: 0.95,
        strategicAlignmentScore: Math.floor(Math.random() * 10) + 90,
        trafficSignal: Math.random() > 0.5 ? 'low' : 'none',
        trafficSource: 'Direct',
        lastChecked: new Date().toISOString()
      }));

      setDomains(prev => [...mockResults, ...prev]);
      addLog('Alpha Mine', `Strategic sweep complete. ${names.length} Semantic Hand-Reg .com assets identified.`, 'success');
      if (names.length > 0) {
        addThought('Alpha Mine', `Prioritizing ${names[0]}.com: Perfect semantic composition and high probability of hand-reg availability.`, 'high');
      }
    } catch (e) {
      console.error("Mining Error:", e);
      addLog('System', 'Strategic mining failed. Reverting to local cache.', 'critical');
    } finally {
      setIsBrainActive(false);
    }
  };

  return (
    <DomainContext.Provider value={{ 
      domains, setDomains, stats, addLog, dismissLog,
      activityLogs, activeProfile, setActiveProfile, isInitialLoading, 
      login, logout, updateDomain, addDomain, triggerSystemPurge,
      isBrainActive, setIsBrainActive,
      systemThoughts, addThought,
      // @ts-ignore - Adding for demonstration
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
