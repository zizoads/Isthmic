
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration, ActivityLog, Notification } from '../types';

interface DomainContextType {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  integrations: ServiceIntegration[];
  setIntegrations: React.Dispatch<React.SetStateAction<ServiceIntegration[]>>;
  activityLogs: ActivityLog[];
  notifications: Notification[];
  addLog: (agent: string, message: string, type?: ActivityLog['type']) => void;
  dismissNotification: (id: string) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem('ist_domains');
    return saved ? JSON.parse(saved) : [];
  });

  const [integrations, setIntegrations] = useState<ServiceIntegration[]>(() => {
    const saved = localStorage.getItem('ist_integrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [strategy, setStrategy] = useState<PlatformStrategy>(() => {
    const saved = localStorage.getItem('ist_strategy');
    return saved ? JSON.parse(saved) : {
      totalBudget: 50000,
      maxPricePerDomain: 1000,
      targetTLDs: ['.com'],
      minLiquidityScore: 70,
      targetROI: 400,
      minHoldingPeriod: 6,
      riskTolerance: 'Balanced',
      autoEvaluate: false,
      autoPilotMode: false,
      investmentThesis: ''
    };
  });

  const addLog = useCallback((agent: string, message: string, type: ActivityLog['type'] = 'info') => {
    // Handle Quota Error specifically
    let finalMessage = message;
    let finalType = type;
    
    if (message.includes("QUOTA_EXHAUSTED")) {
      finalMessage = "System Limit Reached: Please switch to a Paid API Key in Master Brain settings to continue full-scale operations.";
      finalType = 'critical';
    }

    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      agent,
      message: finalMessage,
      type: finalType
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
    
    if (finalType === 'success' || finalType === 'warning' || finalType === 'critical') {
      const notification: Notification = { id: newLog.id, agent, message: finalMessage, type: finalType };
      setNotifications(prev => [...prev, notification]);
      
      // Keep critical notifications longer
      const timeout = finalType === 'critical' ? 10000 : 6000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, timeout);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    localStorage.setItem('ist_domains', JSON.stringify(domains));
    localStorage.setItem('ist_strategy', JSON.stringify(strategy));
    localStorage.setItem('ist_integrations', JSON.stringify(integrations));
  }, [domains, strategy, integrations]);

  return (
    <DomainContext.Provider value={{ 
      domains, setDomains, 
      strategy, setStrategy, 
      integrations, setIntegrations,
      activityLogs, notifications, addLog, dismissNotification
    }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('useDomainContext must be used within a DomainProvider');
  return context;
};
