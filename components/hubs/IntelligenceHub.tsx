
import React, { useState } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import MarketMomentumChart from '../MarketMomentumChart';
import AutonomousControlCenter from '../AutonomousControlCenter';
import WorkflowIndicator from '../WorkflowIndicator';
import { PlatformStats, WorkflowState } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { useMasterBrain } from '../../hooks/useMasterBrain';

interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  onInitiateScan: () => void;
  isScanning: boolean;
  activeWorkflow?: WorkflowState | null;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang, onInitiateScan, isScanning, activeWorkflow: propsActiveWorkflow }) => {
  const { domains, activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const [subTab, setSubTab] = useState<'sovereign' | 'nexus' | 'strategy' | 'feedback'>('sovereign');
  
  const { activeWorkflow: localActiveWorkflow } = useMasterBrain(strategy, lang);
  const currentWorkflow = propsActiveWorkflow !== undefined ? propsActiveWorkflow : localActiveWorkflow;

  const tabs = [
    { id: 'sovereign', label: 'Command', icon: 'fa-terminal' },
    { id: 'nexus', label: 'Radar', icon: 'fa-satellite-dish' },
    { id: 'strategy', label: 'Thesis', icon: 'fa-scroll' },
    { id: 'feedback', label: 'Neural', icon: 'fa-brain' }
  ];

  return (
    <div className="space-y-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sovereign Tab Bar */}
      <div className="flex bg-white/5 backdrop-blur-2xl p-1.5 rounded-[24px] border border-white/5 w-fit mx-auto lg:mx-0 shadow-2xl">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)} 
            className={`px-8 py-3 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3
              ${subTab === tab.id ? 'bg-white text-black shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <i className={`fas ${tab.icon} text-[10px]`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="animate-fade-in space-y-12">
        {subTab === 'sovereign' && (
          <div className="space-y-12">
            <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
            />
            <MarketMomentumChart lang={lang} />
          </div>
        )}
        
        {subTab === 'nexus' && <div className="glass-panel p-12"><NexusPrimeDashboard lang={lang} addLog={addLog} setDomains={setDomains} /></div>}
        {subTab === 'strategy' && <div className="glass-panel p-12"><MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} lang={lang} onInitiateScan={onInitiateScan} isScanning={isScanning} /></div>}
        {subTab === 'feedback' && <div className="glass-panel p-12"><FeedbackDashboard domains={domains} stats={stats} /></div>}
      </div>
    </div>
  );
};

export default IntelligenceHub;
