
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
  // Props added to fix App.tsx type error and synchronize scanning state
  onInitiateScan: () => void;
  isScanning: boolean;
  activeWorkflow?: WorkflowState | null;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang, onInitiateScan, isScanning, activeWorkflow: propsActiveWorkflow }) => {
  const { domains, activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const [subTab, setSubTab] = useState<'sovereign' | 'nexus' | 'strategy' | 'feedback'>('sovereign');
  
  // Call useMasterBrain to get activeWorkflow if not provided via props
  const { activeWorkflow: localActiveWorkflow } = useMasterBrain(strategy, lang);
  const currentWorkflow = propsActiveWorkflow !== undefined ? propsActiveWorkflow : localActiveWorkflow;

  return (
    <div className="space-y-12 lg:space-y-24 pb-20 lg:pb-40">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-10">
         <div className="space-y-2 lg:space-y-3">
            <h2 className="text-3xl lg:text-7xl prestige-heading text-white italic">
               Atelier Intelligence
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 lg:w-12 bg-[#c5a059]/30"></div>
              <p className="text-slate-500 text-[8px] lg:text-[10px] font-black tracking-[0.2em] lg:tracking-[0.3em] uppercase opacity-70">
                 Strategic Narrative & Market Synthesis
              </p>
            </div>
         </div>
         
         <div className="flex bg-[#161618] p-1.5 rounded-[22px] border border-white/5 shadow-xl w-full lg:w-auto scroll-x-mobile">
           {[
             { id: 'sovereign', label: 'COMMAND' },
             { id: 'nexus', label: 'RADAR' },
             { id: 'strategy', label: 'THESIS' },
             { id: 'feedback', label: 'NEURAL' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)} 
                className={`flex-1 lg:flex-none px-6 lg:px-12 py-3 rounded-[16px] text-[8px] lg:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${subTab === tab.id ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      {currentWorkflow && (
        <div className="max-w-3xl mx-auto mb-12">
           <WorkflowIndicator workflow={currentWorkflow} lang={lang} />
        </div>
      )}

      <div className="bento-grid">
        {subTab === 'sovereign' && (
          <>
            <div className="bento-span-12">
               <AutonomousControlCenter 
                  strategy={strategy} 
                  onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                  lang={lang} 
               />
            </div>

            <div className="bento-span-8 square-card p-6 lg:p-14">
               <MarketMomentumChart lang={lang} />
            </div>
            
            <div className="bento-span-4 flex flex-col gap-6 lg:gap-10">
               <div className="square-card p-8 lg:p-10 flex-1 flex flex-col justify-between bg-gradient-to-br from-[#161618] to-[#0a0a0c]">
                  <div className="space-y-6 lg:space-y-10">
                    <div className="w-12 h-12 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-2xl flex items-center justify-center text-[#c5a059]">
                       <i className="fas fa-signature text-xl lg:text-2xl"></i>
                    </div>
                    <div>
                       <h3 className="text-xl lg:text-2xl prestige-heading text-white italic mb-2 lg:mb-3">Calibration Context</h3>
                       <p className="text-slate-500 text-[8px] lg:text-[10px] font-black tracking-tight uppercase opacity-70">
                         Harmonizing autonomous logic with market aesthetics.
                       </p>
                    </div>
                  </div>
                  <div className="mt-8 lg:mt-12">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[7px] lg:text-[8px] font-black text-slate-600 uppercase tracking-widest">Logic_Cohesion</span>
                       <span className="text-[9px] lg:text-[10px] font-black text-[#c5a059] data-mono">0.992</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-[#c5a059] w-[94%]"></div>
                    </div>
                  </div>
               </div>
            </div>
          </>
        )}
        
        {subTab === 'nexus' && (
          <div className="bento-span-12 square-card p-6 lg:p-16">
            <NexusPrimeDashboard lang={lang} addLog={addLog} setDomains={setDomains} />
          </div>
        )}
        
        {subTab === 'strategy' && (
          <div className="bento-span-12 square-card p-6 lg:p-16">
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
          <div className="bento-span-12 square-card p-6 lg:p-16">
            <FeedbackDashboard domains={domains} stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
