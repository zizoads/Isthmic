
import React, { useState } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import MarketMomentumChart from '../MarketMomentumChart';
import WorkflowIndicator from '../WorkflowIndicator';
import { PlatformStats } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { useMasterBrain } from '../../hooks/useMasterBrain';

interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  onInitiateScan: () => void;
  isScanning: boolean;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang }) => {
  const { domains, activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const { isScanning, initiateScan, activeWorkflow } = useMasterBrain(strategy, lang);
  const [subTab, setSubTab] = useState<'strategy' | 'nexus' | 'feedback' | 'analytics'>('strategy');

  return (
    <div className="space-y-8 animate-fade-in relative">
      {activeWorkflow && (
        <div className="fixed bottom-12 right-10 z-[200] w-full max-w-sm px-4">
          <WorkflowIndicator workflow={activeWorkflow} lang={lang} />
        </div>
      )}

      <div className="flex bg-accent/50 p-1 rounded-2xl border border-border w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setSubTab('strategy')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'strategy' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'الاستراتيجية' : 'Strategy'}
        </button>
        <button onClick={() => setSubTab('analytics')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'analytics' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'الزخم الفني' : 'Technical Momentum'}
        </button>
        <button onClick={() => setSubTab('nexus')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'nexus' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التنبؤ' : 'Nexus Prime'}
        </button>
        <button onClick={() => setSubTab('feedback')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'feedback' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التدريب' : 'AI Training'}
        </button>
      </div>

      <div className="pt-4">
        {subTab === 'strategy' && (
          <MasterBrainDashboard 
            stats={stats} 
            activityLogs={activityLogs} 
            strategy={strategy} 
            setStrategy={setStrategy} 
            lang={lang} 
            onInitiateScan={initiateScan} 
            isScanning={isScanning} 
          />
        )}
        {subTab === 'analytics' && <MarketMomentumChart lang={lang} />}
        {subTab === 'nexus' && (
          <NexusPrimeDashboard 
            lang={lang} 
            addLog={addLog}
            setDomains={setDomains}
          />
        )}
        {subTab === 'feedback' && (
          <FeedbackDashboard domains={domains} stats={stats} />
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
