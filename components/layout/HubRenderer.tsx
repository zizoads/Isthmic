import React from 'react';
import { AgentType, Domain, PlatformStats, ServiceIntegration } from '../../types';
import IntelligenceHub from '../hubs/IntelligenceHub';
import AcquisitionDesk from '../AcquisitionDesk';
import OperationsHub from '../hubs/OperationsHub';
import LiquidationEngine from '../hubs/LiquidationEngine';
import ExecutiveSuite from '../hubs/ExecutiveSuite';
import CodeAuditorHub from '../hubs/CodeAuditorHub';
import AdminHub from '../hubs/AdminHub';
import ProtocolErrorBoundary from '../ui/ProtocolErrorBoundary';

interface Props {
  activeHub: AgentType;
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  stats: PlatformStats;
  integrations: ServiceIntegration[];
  addLog: (agent: string, message: string, type?: any) => void;
  lang: 'ar' | 'en';
}

const HubRenderer: React.FC<Props> = ({ 
  activeHub, domains, setDomains, stats, integrations, addLog, lang 
}) => {
  
  const handleInspect = (d: Domain) => {
    addLog('Inspector', `Inspecting ${d.name}...`, 'info');
  };

  const handleConnect = (id: string, key: string) => {
    addLog('Integrations', `Configuring gateway ${id}...`, 'info');
  };

  const renderHub = () => {
    switch (activeHub) {
      case AgentType.INTELLIGENCE:
        return <IntelligenceHub stats={stats} lang={lang} isScanning={false} onInitiateScan={() => {}} />;
      case AgentType.ACQUISITION:
        return <AcquisitionDesk domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />;
      case AgentType.CODE_AUDITOR:
        return <CodeAuditorHub />;
      case AgentType.ADMIN:
        return <AdminHub />;
      case AgentType.OPERATIONS:
        return <OperationsHub domains={domains} setDomains={setDomains} onInspect={handleInspect} lang={lang} />;
      case AgentType.LIQUIDATION:
        return <LiquidationEngine domains={domains} setDomains={setDomains} lang={lang} />;
      case AgentType.MANAGEMENT:
        return <ExecutiveSuite domains={domains} stats={stats} integrations={integrations} onConnect={handleConnect} lang={lang} />;
      default:
        return <IntelligenceHub stats={stats} lang={lang} isScanning={false} onInitiateScan={() => {}} />;
    }
  };

  return (
    <ProtocolErrorBoundary fallbackName={activeHub}>
      {renderHub()}
    </ProtocolErrorBoundary>
  );
};

export default HubRenderer;