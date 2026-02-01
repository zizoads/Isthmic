
import React, { useState } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import AutonomousControlCenter from '../AutonomousControlCenter';
import WorkflowIndicator from '../WorkflowIndicator';
import { PlatformStats, WorkflowState } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { useMasterBrain } from '../../hooks/useMasterBrain';
import { useSovereignT } from '../../hooks/useTranslation';

interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  onInitiateScan: () => void;
  isScanning: boolean;
  activeWorkflow?: WorkflowState | null;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang, onInitiateScan, isScanning, activeWorkflow: propsActiveWorkflow }) => {
  const { activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const [subTab, setSubTab] = useState<'sovereign' | 'nexus' | 'strategy' | 'feedback'>('sovereign');
  const t = useSovereignT(lang);
  
  const { activeWorkflow: localActiveWorkflow } = useMasterBrain(strategy, lang);
  const currentWorkflow = propsActiveWorkflow !== undefined ? propsActiveWorkflow : localActiveWorkflow;

  const tabs = [
    { id: 'sovereign', label: t('intelligence.tabs.command'), icon: 'fa-terminal' },
    { id: 'nexus', label: t('intelligence.tabs.radar'), icon: 'fa-satellite-dish' },
    { id: 'strategy', label: t('intelligence.tabs.thesis'), icon: 'fa-scroll' },
    { id: 'feedback', label: t('intelligence.tabs.neural'), icon: 'fa-brain' }
  ];

  return (
    <div className="space-y-6 lg:space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="space-y-2 lg:space-y-4">
        <div className="flex items-center gap-3 lg:gap-4">
           <div className="w-1.5 lg:w-2 h-6 lg:h-8 bg-[#c5a059]"></div>
           <h1 className="text-2xl lg:text-5xl prestige-heading text-white italic leading-none">
             {t('intelligence.hub_title')}
           </h1>
        </div>
      </header>

      {/* Responsive Horizontal Tabs */}
      <div className="scroll-x-mobile bg-white/5 backdrop-blur-2xl p-1 rounded-[20px] border border-white/5 w-full shadow-xl">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)} 
            className={`px-6 py-2.5 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap
              ${subTab === tab.id ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <i className={`fas ${tab.icon} text-[10px]`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {currentWorkflow && (
        <div className="w-full">
          <WorkflowIndicator workflow={currentWorkflow} lang={lang} />
        </div>
      )}

      <div className="animate-fade-in space-y-8 lg:space-y-12">
        {subTab === 'sovereign' && (
          <div className="flex flex-col gap-8 lg:gap-12">
            <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
            />
          </div>
        )}
        
        {subTab === 'nexus' && <div className="glass-panel p-6 lg:p-12"><NexusPrimeDashboard lang={lang} addLog={addLog} setDomains={setDomains} /></div>}
        {subTab === 'strategy' && <div className="glass-panel p-6 lg:p-12"><MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} lang={lang} onInitiateScan={onInitiateScan} isScanning={isScanning} /></div>}
        {subTab === 'feedback' && <div className="glass-panel p-6 lg:p-12"><FeedbackDashboard domains={[]} stats={stats} /></div>}
      </div>
    </div>
  );
};

export default IntelligenceHub;
