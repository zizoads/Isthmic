
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

  return (
    <div className="space-y-10 lg:space-y-16 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
         <div className="space-y-2">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] prestige-heading text-white italic leading-tight">
               Atelier Intelligence
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 lg:w-12 bg-[#c5a059]/30"></div>
              <p className="text-slate-500 text-[9px] font-black tracking-widest uppercase opacity-70">
                 Strategic Narrative & Market Synthesis
              </p>
            </div>
         </div>
         
         <div className="flex bg-[#161618] p-1 rounded-[18px] border border-white/5 shadow-xl w-full xl:w-auto overflow-x-auto no-scrollbar">
           {[
             { id: 'sovereign', label: 'COMMAND' },
             { id: 'nexus', label: 'RADAR' },
             { id: 'strategy', label: 'THESIS' },
             { id: 'feedback', label: 'NEURAL' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)} 
                className={`flex-1 xl:flex-none px-6 lg:px-10 py-2.5 rounded-[14px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${subTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      {currentWorkflow && (
        <div className="max-w-3xl mx-auto">
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

            <div className="bento-span-8 square-card">
               <MarketMomentumChart lang={lang} />
            </div>
            
            <div className="bento-span-4 flex flex-col gap-6 lg:gap-10">
               <div className="square-card flex-1 flex flex-col justify-between bg-gradient-to-br from-[#161618] to-[#0a0a0c]">
                  <div className="space-y-8">
                    <div className="w-12 h-12 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-2xl flex items-center justify-center text-[#c5a059]">
                       <i className="fas fa-signature text-xl"></i>
                    </div>
                    <div>
                       <h3 className="text-xl lg:text-2xl prestige-heading text-white italic mb-2">Calibration Context</h3>
                       <p className="text-slate-500 text-[9px] font-black tracking-tight uppercase opacity-70">
                         Harmonizing autonomous logic with market aesthetics.
                       </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Logic_Cohesion</span>
                       <span className="text-[10px] font-black text-[#c5a059] data-mono">0.992</span>
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
          <div className="bento-span-12 square-card">
            <NexusPrimeDashboard lang={lang} addLog={addLog} setDomains={setDomains} />
          </div>
        )}
        
        {subTab === 'strategy' && (
          <div className="bento-span-12 square-card">
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
          <div className="bento-span-12 square-card">
            <FeedbackDashboard domains={domains} stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
