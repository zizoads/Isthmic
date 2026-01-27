
import React, { useState } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import { AgentType, PlatformStats, ActivityLog, PlatformStrategy, Domain } from '../../types';

interface Props {
  stats: PlatformStats;
  activityLogs: ActivityLog[];
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  lang: 'ar' | 'en';
  onInitiateScan: () => void;
  isScanning: boolean;
  domains: Domain[];
}

const IntelligenceHub: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, lang, onInitiateScan, isScanning, domains }) => {
  const [subTab, setSubTab] = useState<'strategy' | 'nexus' | 'feedback'>('strategy');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex bg-accent/50 p-1 rounded-2xl border border-border w-fit mx-auto lg:mx-0">
        <button onClick={() => setSubTab('strategy')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'strategy' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'الاستراتيجية' : 'Strategy'}
        </button>
        <button onClick={() => setSubTab('nexus')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'nexus' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التنبؤ' : 'Nexus Prime'}
        </button>
        <button onClick={() => setSubTab('feedback')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'feedback' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
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
            onInitiateScan={onInitiateScan} 
            isScanning={isScanning} 
          />
        )}
        {subTab === 'nexus' && (
          <NexusPrimeDashboard 
            addLog={(a, m, t) => {}} 
            setDomains={() => {}} 
            lang={lang} 
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
