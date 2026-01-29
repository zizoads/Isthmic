
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, UserProfile } from '../types';
import { persistence } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { SyncService } from '../services/SyncService';
import { supabase } from '../services/SupabaseClient';

interface DomainContextType {
  activeProfile: UserProfile | null;
  profiles: UserProfile[];
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
  syncStatus: 'idle' | 'syncing' | 'healthy' | 'error';
  lastSyncTime: string | null;
  dismissNotification: (id: string) => void;
  connectService: (id: string, provider: string) => void;
  exportVault: () => Promise<void>;
  importVault: (json: string) => Promise<void>;
  wipeLocalVault: () => Promise<void>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'healthy' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
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

  useEffect(() => {
    const boot = async () => {
      try {
        await persistence.init();
        
        // التحقق من وجود "جلسة" حقيقية في Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // جلب بيانات البروفايل الحية
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const user: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: profileData?.name || 'Owner',
            role: 'Executive',
            createdAt: session.user.created_at,
            isSyncEnabled: true,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profileData?.name || 'User'}`
          };
          
          await loadWorkspaceData(user);
        }
      } catch (e) {
        console.error("Cloud Vault Connection Failed", e);
      } finally {
        setIsInitialLoading(false);
      }
    };
    boot();
  }, []);

  const loadWorkspaceData = useCallback(async (profile: UserProfile) => {
    setIsInitialLoading(true);
    setActiveProfile(profile);
    
    // جلب البيانات المحلية المرتبطة بهذا المستخدم
    const [allDomains, allStrategies, allIntegrations] = await Promise.all([
      persistence.loadAll('domains'),
      persistence.loadAll('strategy'),
      persistence.loadAll('integrations')
    ]);
    
    setDomains(allDomains.filter(d => d.workspaceId === profile.id));
    setIntegrations(allIntegrations.filter(i => i.workspaceId === profile.id));
    
    const workspaceStrategy = allStrategies.find(s => s.id === profile.id);
    if (workspaceStrategy) setStrategy(workspaceStrategy);
    else setStrategy({ id: profile.id, totalBudget: 50000, riskTolerance: 'Balanced', autoPilot: false, investmentThesis: '' });

    setIsInitialLoading(false);
    if (profile.isSyncEnabled) triggerCloudSync(profile.id);
  }, []);

  const triggerCloudSync = async (id: string) => {
    setSyncStatus('syncing');
    try {
      const syncTime = await SyncService.syncToCloud(id) as string;
      setSyncStatus('healthy');
      setLastSyncTime(syncTime);
    } catch {
      setSyncStatus('error');
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    // Fix: AuthService.signup only expects 3 arguments (name, email, pass).
    const { user } = await AuthService.signup(name, email, pass);
    await loadWorkspaceData(user);
  };

  const login = async (email: string, pass: string) => {
    const user = await AuthService.login(email, pass);
    await loadWorkspaceData(user);
  };

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setActiveProfile(null);
    setSyncStatus('idle');
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    if (!activeProfile) return;
    const log: ActivityLog = { id: crypto.randomUUID(), workspaceId: activeProfile.id, time: new Date().toLocaleTimeString(), agent, message, type };
    setActivityLogs(prev => [log, ...prev].slice(0, 100));
  }, [activeProfile]);

  const stats = useMemo(() => {
    const purchased = domains.filter(d => d.status === 'purchased');
    return {
      totalDiscovered: domains.length,
      totalPurchased: purchased.length,
      messagesSent: 0,
      openRate: 85,
      avgProfit: 250,
      estimatedPortfolioValue: purchased.reduce((acc, d) => acc + (d.price * 3.5), 0),
      systemResilienceStatus: 'nominal' as const
    };
  }, [domains]);

  const value = useMemo(() => ({
    activeProfile, profiles, domains, setDomains, strategy, setStrategy, integrations, activityLogs, notifications, stats, isInitialLoading,
    login, signup, logout, addLog, dismissNotification, syncStatus, lastSyncTime,
    exportVault: async () => {
      if (!activeProfile) return;
      const backup = await persistence.exportBackup(activeProfile.id);
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Isthmic_Vault_${activeProfile.name}.json`;
      link.click();
    },
    importVault: async (json: string) => {},
    connectService: (id: string, provider: string) => {
      if (!activeProfile) return;
      setIntegrations(prev => [...prev.filter(i => i.id !== id), { id, workspaceId: activeProfile.id, provider, name: provider.toUpperCase(), status: 'connected', impactArea: 'Global' }]);
    },
    wipeLocalVault: async () => {
      if (!activeProfile) return;
      await persistence.delete('profiles', activeProfile.id);
      logout();
    }
  }), [activeProfile, profiles, domains, strategy, integrations, activityLogs, notifications, stats, isInitialLoading, login, signup, logout, addLog, dismissNotification, syncStatus, lastSyncTime]);

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Provider context violation');
  return context;
};
