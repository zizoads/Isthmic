import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Domain, PlatformStrategy, ServiceIntegration } from '../types';

interface DomainContextType {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  integrations: ServiceIntegration[];
  setIntegrations: React.Dispatch<React.SetStateAction<ServiceIntegration[]>>;
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

  useEffect(() => {
    localStorage.setItem('ist_domains', JSON.stringify(domains));
    localStorage.setItem('ist_strategy', JSON.stringify(strategy));
    localStorage.setItem('ist_integrations', JSON.stringify(integrations));
  }, [domains, strategy, integrations]);

  return (
    <DomainContext.Provider value={{ domains, setDomains, strategy, setStrategy, integrations, setIntegrations }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomainContext = () => {
  const context = useContext(DomainContext);
  if (!context) throw new Error('useDomainContext must be used within a DomainProvider');
  return context;
};