

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification, PlatformStats, UserProfile } from '../types';
import { persistence } from '../services/DataService';
import { AuthService } from '../services/AuthService';
import { SyncService } from '../services/SyncService';

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
  requestRecoveryCode: (email: string) => Promise<string>;
  resetPassword: (email: string, newPass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  deleteProfile: (id: string) => Promise<void>;
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
        const savedProfiles = await persistence.loadAll('profiles');
        setProfiles(savedProfiles);
        
        const lastProfileId = localStorage.getItem('isthmic_active_profile');
        if (lastProfileId) {
          const profile = savedProfiles.find(p => p.id === lastProfileId);
          if (profile) loadWorkspaceData(profile);
        }
      } catch (e) {
        console.error("Vault Failure", e);
      } finally {
        setIsInitialLoading(false);
      }
    };
    boot();
  }, []);

  const loadWorkspaceData = useCallback(async (profile: UserProfile) => {
    setIsInitialLoading(true);
    setActiveProfile(profile);
    localStorage.setItem('isthmic_active_profile', profile.id);
    
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
    // Fixed: destructuring { user } from AuthService.signup and providing defaults for security params
    const { user } = await AuthService.signup(name, email, pass, "Default Question", "Default Answer");
    setProfiles(prev => [...prev, user]);
    await loadWorkspaceData(user);
  };

  const login = async (email: string, pass: string) => {
    const user = await AuthService.login(email, pass);
    await loadWorkspaceData(user);
  };

  const requestRecoveryCode = async (email: string) => {
    // Fixed: AuthService method name
    return await AuthService.sendRecoveryCode(email);
  };

  const resetPassword = async (email: string, newPass: string) => {
    // Fixed: AuthService method name
    return await AuthService.updatePassword(email, newPass);
  };

  const loginWithGoogle = async () => {
    setIsInitialLoading(true);
    try {
      // Fixed: AuthService method name
      const gUser = await AuthService.signInWithGoogle();
      // Fixed: property check for googleId
      const existing = profiles.find(p => p.googleId === gUser.sub || p.email === gUser.email);
      
      if (existing) {
        await loadWorkspaceData(existing);
      } else {
        const newProfile: UserProfile = {
          id: crypto.randomUUID(),
          name: gUser.name,
          email: gUser.email,
          googleId: gUser.sub, // Fixed: googleId exists in UserProfile now
          avatar: gUser.picture,
          role: 'Executive',
          createdAt: new Date().toISOString(),
          isSyncEnabled: true
        };
        await persistence.save('profiles', newProfile);
        setProfiles(prev => [...prev, newProfile]);
        await loadWorkspaceData(newProfile);
      }
    } catch (e) {
      console.error("Login Error", e);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const logout = useCallback(() => {
    setActiveProfile(null);
    localStorage.removeItem('isthmic_active_profile');
    setSyncStatus('idle');
  }, []);

  const deleteProfile = async (id: string) => {
    await persistence.delete('profiles', id);
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfile?.id === id) logout();
  };

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  const dispatchNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => dismissNotification(id), 5000);
  }, [dismissNotification]);

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    if (!activeProfile) return;
    const log: ActivityLog = { id: crypto.randomUUID(), workspaceId: activeProfile.id, time: new Date().toLocaleTimeString(), agent, message, type };
    setActivityLogs(prev => [log, ...prev].slice(0, 100));
    if (type !== 'info') dispatchNotification({ agent, message, type });
  }, [activeProfile, dispatchNotification]);

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
    login, signup, requestRecoveryCode, resetPassword, loginWithGoogle, logout, deleteProfile, addLog, dispatchNotification, dismissNotification, syncStatus, lastSyncTime,
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
      await deleteProfile(activeProfile.id);
    }
  }), [activeProfile, profiles, domains, strategy, integrations, activityLogs, notifications, stats, isInitialLoading, login, signup, requestRecoveryCode, resetPassword, loginWithGoogle, logout, deleteProfile, addLog, dispatchNotification, dismissNotification, syncStatus, lastSyncTime]);

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('Provider context violation');
  return context;
};