
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, UserProfile } from '../types';
import { AuthService } from '../services/AuthService';
import { supabase } from '../services/SupabaseClient';

interface DomainContextType {
  activeProfile: UserProfile | null;
  setActiveProfile: (profile: UserProfile | null) => void;
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  integrations: ServiceIntegration[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  stats: PlatformStats;
  isInitialLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  addLog: (agent: string, message: string, type?: ActivityLog['type']) => void;
  connectService: (id: string, provider: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [integrations, setIntegrations] = useState<ServiceIntegration[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [strategy, setStrategy] = useState<PlatformStrategy>({
    id: 'default',
    totalBudget: 50000,
    riskTolerance: 'Balanced',
    autoPilot: false,
    investmentThesis: ''
  });

  const loadUserData = useCallback(async (profile: UserProfile) => {
    setActiveProfileState(profile);
    
    // جلب البيانات من جداول Supabase الخاصة بهذا المستخدم فقط
    const { data: userDomains } = await supabase.from('domains').select('*').eq('workspaceId', profile.id);
    const { data: userIntegrations } = await supabase.from('integrations').select('*').eq('workspaceId', profile.id);
    const { data: userStrategy } = await supabase.from('strategies').select('*').eq('id', profile.id).single();

    if (userDomains) setDomains(userDomains);
    if (userIntegrations) setIntegrations(userIntegrations);
    if (userStrategy) setStrategy(userStrategy);
    else setStrategy({ id: profile.id, totalBudget: 50000, riskTolerance: 'Balanced', autoPilot: false, investmentThesis: '' });

    setIsInitialLoading(false);
  }, []);

  useEffect(() => {
    const boot = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        const user: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: profileData?.name || 'User',
          role: profileData?.role || 'Executive',
          createdAt: session.user.created_at,
          isSyncEnabled: true,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`
        };
        await loadUserData(user);
      } else {
        setIsInitialLoading(false);
      }
    };
    boot();
  }, [loadUserData]);

  const login = async (email: string, pass: string) => {
    const user = await AuthService.login(email, pass);
    await loadUserData(user);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { user } = await AuthService.signup(name, email, pass);
    await loadUserData(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setActiveProfileState(null);
    setDomains([]);
  };

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    if (!activeProfile) return;
    const log: ActivityLog = { id: crypto.randomUUID(), workspaceId: activeProfile.id, time: new Date().toLocaleTimeString(), agent, message, type };
    setActivityLogs(prev => [log, ...prev].slice(0, 50));
  }, [activeProfile]);

  const stats = useMemo(() => ({
    totalDiscovered: domains.length,
    totalPurchased: domains.filter(d => d.status === 'purchased').length,
    messagesSent: 0,
    openRate: 85,
    avgProfit: 250,
    estimatedPortfolioValue: domains.reduce((acc, d) => acc + (d.price || 0), 0),
    systemResilienceStatus: 'nominal' as const
  }), [domains]);

  const value = useMemo(() => ({
    activeProfile, setActiveProfile: setActiveProfileState, domains, setDomains, strategy, setStrategy, integrations, activityLogs, notifications, stats, isInitialLoading,
    login, signup, logout, addLog,
    connectService: (id: string, provider: string) => {
      if (!activeProfile) return;
      setIntegrations(prev => [...prev, { id, workspaceId: activeProfile.id, provider, name: provider.toUpperCase(), status: 'connected', impactArea: 'Global' }]);
    }
  }), [activeProfile, domains, strategy, integrations, activityLogs, notifications, stats, isInitialLoading]);

  return <DomainContext.Provider value={value as any}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Context Error');
  return context;
};
