
import React, { useState } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import MarketMomentumChart from '../MarketMomentumChart';
import AutonomousControlCenter from '../AutonomousControlCenter';
import { PlatformStats } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { translations } from '../../translations';

interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  onInitiateScan?: () => void;
  isScanning?: boolean;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang, onInitiateScan, isScanning }) => {
  const { activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const [subTab, setSubTab] = useState<'sovereign' | 'nexus' | 'strategy' | 'feedback'>('sovereign');
  const t = translations[lang];

  return (
    <div className="space-y-20 animate-fade-in relative">
      {/* Precision Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
         <div className="space-y-2">
            <h2 className="text-4xl lg:text-5xl heading-sovereign">
               {lang === 'ar' ? 'مركز الاستخبارات' : 'Intelligence Hub'}
            </h2>
            <p className="text-slate-500 text-xs font-medium tracking-wide uppercase">
               Sovereign Strategy & Market Gap Forensics
            </p>
         </div>
         <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
           {[
             { id: 'sovereign', label: lang === 'ar' ? 'التحكم' : 'Sovereign' },
             { id: 'nexus', label: lang === 'ar' ? 'الرادار' : 'Nexus' },
             { id: 'strategy', label: lang === 'ar' ? 'الخطة' : 'Strategy' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)} 
                className={`px-8 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all
                  ${subTab === tab.id ? 'bg-white/10 text-white shadow-inner' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {subTab === 'sovereign' && (
          <div className="space-y-16">
             <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
             />
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                   <div className="surface-layer-1 p-8 lg:p-12 border border-white/5 shadow-2xl">
                      <MarketMomentumChart lang={lang} />
                   </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-10">
                   <div className="surface-layer-1 p-10 flex flex-col justify-between h-full relative overflow-hidden group border border-white/5 shadow-2xl">
                      <div>
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 text-xl mb-8 group-hover:scale-110 transition-transform">
                           <i className="fas fa-microchip"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Neural Calibration</h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          Refine agent decision logic via past acquisition feedback. Calibrate DNA extraction weights.
                        </p>
                      </div>
                      <button onClick={() => setSubTab('feedback')} className="w-full py-4 surface-layer-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white border border-white/5">
                         Train Logic Engine
                      </button>
                      <i className="fas fa-network-wired absolute right-[-50px] bottom-[-50px] text-white/2 text-[200px] pointer-events-none group-hover:rotate-12 transition-transform duration-1000"></i>
                   </div>
                </div>
             </div>
          </div>
        )}
        {subTab === 'nexus' && (
          <NexusPrimeDashboard 
            lang={lang} 
            addLog={addLog}
            setDomains={setDomains}
          />
        )}
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
      </div>
    </div>
  );
};

export default IntelligenceHub;
