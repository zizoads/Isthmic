
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
      {/* Sovereign Glass Tab Bar */}
      <div className="flex bg-white/5 backdrop-blur-xl p-2 rounded-[24px] border border-white/5 w-fit mx-auto lg:mx-0 shadow-2xl">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)} 
            className={`px-10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3
              ${subTab === tab.id ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <i className={`fas ${tab.icon} text-sm`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {currentWorkflow && (
        <div className="animate-slide-up">
           <WorkflowIndicator workflow={currentWorkflow} lang={lang} />
        </div>
      )}

      <div className="animate-fade-in space-y-12">
        {subTab === 'sovereign' && (
          <div className="space-y-12">
            <div className="glass-panel p-10 lg:p-16">
                <AutonomousControlCenter 
                    strategy={strategy} 
                    onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                    lang={lang} 
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 glass-panel p-10">
                <MarketMomentumChart lang={lang} />
              </div>
              <div className="lg:col-span-4 glass-panel p-10 flex flex-col justify-between bg-gradient-to-br from-indigo-600/10 to-transparent">
                <div className="space-y-8">
                   <h3 className="prestige-title text-3xl text-white italic">System Pulse.</h3>
                   <div className="space-y-6">
                      {[
                        { label: 'Network', val: 'STABLE', color: 'text-green-500' },
                        { label: 'Latency', val: '12ms', color: 'text-white' },
                        { label: 'Security', val: 'AES-512', color: 'text-[#d4af37]' }
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-4">
                          <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{s.label}</span>
                          <span className={`${s.color} font-black text-xs font-mono`}>{s.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="pt-10 opacity-30 italic text-[10px] text-slate-500">
                  // Multi-agent cores operational<br/>
                  // Sync: Nominal
                </div>
              </div>
            </div>
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
