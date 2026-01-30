
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
    <div className="stack-md" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Precision Tab Bar */}
      <div className="flex bg-[#111113] border border-white/5 shadow-[3px_3px_0px_0px_#000]">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)} 
            className={`flex-1 px-4 py-3 text-[9px] font-black uppercase tracking-widest border-r border-white/5 last:border-r-0 transition-all flex items-center justify-center gap-2
              ${subTab === tab.id ? 'bg-[#d4af37] text-black' : 'text-slate-500 hover:text-white'}`}
          >
            <i className={`fas ${tab.icon} text-[11px]`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {currentWorkflow && (
        <div className="square-box !p-4 !bg-[#d4af37]/5 border-[#d4af37]/20">
           <WorkflowIndicator workflow={currentWorkflow} lang={lang} />
        </div>
      )}

      <div className="stack-md animate-fade-in">
        {subTab === 'sovereign' && (
          <div className="stack-md">
            <div className="square-box !p-0 overflow-hidden">
               <div className="bg-white/5 px-4 py-2 text-mute text-gold">autonomous_v4</div>
               <div className="p-6">
                  <AutonomousControlCenter 
                      strategy={strategy} 
                      onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                      lang={lang} 
                  />
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 square-box !p-6 bg-black">
                <MarketMomentumChart lang={lang} />
              </div>
              <div className="square-box !p-6 bg-black">
                <h3 className="prestige-title text-xl text-[#d4af37] italic mb-6">Pulse.</h3>
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">NET_STATUS</span>
                    <span className="text-green-500 font-bold">STABLE</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500">LATENCY</span>
                    <span className="text-white">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SEC_LEVEL</span>
                    <span className="text-[#d4af37] font-black">AES-512</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {subTab === 'nexus' && (
          <div className="square-box !p-6">
            <NexusPrimeDashboard lang={lang} addLog={addLog} setDomains={setDomains} />
          </div>
        )}
        
        {subTab === 'strategy' && (
          <div className="square-box !p-6">
            <MasterBrainDashboard 
              stats={stats} 
              activityLogs={activityLogs} 
              strategy={strategy} 
              setStrategy={setStrategy} 
              lang={lang} 
              onInitiateScan={onInitiateScan}
              isScanning={isScanning}
            />
          </div>
        )}

        {subTab === 'feedback' && (
          <div className="square-box !p-6">
            <FeedbackDashboard domains={domains} stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
