
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
    <div className="space-y-12 animate-fade-in relative">
      {/* Visual Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
         <div className="space-y-4 flex-1">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
               {lang === 'ar' ? 'مركز الاستخبارات' : 'INTELLIGENCE HUB'}
            </h2>
            <p className="text-slate-500 text-sm max-w-3xl font-medium leading-relaxed border-r-4 border-indigo-500/20 pr-6">
               {lang === 'ar' 
                  ? 'التحليل الاستباقي للفجوات السوقية، استشعار نبض السيولة، وتوليد استراتيجيات الاستحواذ القسرية عبر وكلاء الذكاء الاصطناعي.'
                  : 'Proactive market gap analysis, liquidity pulse sensing, and forced acquisition strategy generation via AI agents.'}
            </p>
         </div>
         <div className="flex bg-[#0b0e14]/50 backdrop-blur-md p-1.5 rounded-[24px] border border-white/10 shadow-2xl">
           {[
             { id: 'sovereign', label: lang === 'ar' ? 'التحكم الآلي' : 'SOVEREIGN' },
             { id: 'nexus', label: lang === 'ar' ? 'الرادار' : 'NEXUS' },
             { id: 'strategy', label: lang === 'ar' ? 'المعايير' : 'CRITERIA' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)} 
                className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${subTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="pt-6">
        {subTab === 'sovereign' && (
          <div className="space-y-16">
             <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
             />
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                   <MarketMomentumChart lang={lang} />
                </div>
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-panel rounded-[40px] p-10 flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden group">
                      <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500 text-4xl shadow-[0_0_50px_rgba(79,70,229,0.1)] group-hover:scale-110 transition-transform duration-700">
                         <i className="fas fa-brain animate-pulse"></i>
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{lang === 'ar' ? 'محاكاة السيناريوهات' : 'SCENARIOS'}</h3>
                         <p className="text-slate-500 text-[11px] max-w-xs leading-relaxed font-medium">
                            {lang === 'ar' ? 'توقع العائد المستقبلي عبر 12 متغيراً اقتصادياً.' : 'Forecast yield via 12 economic variables.'}
                         </p>
                      </div>
                      <button onClick={() => setSubTab('feedback')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                         {lang === 'ar' ? 'تدريب النماذج' : 'TRAIN MODELS'}
                      </button>
                      <i className="fas fa-network-wired absolute right-[-50px] bottom-[-50px] text-white/2 text-[200px] pointer-events-none group-hover:rotate-12 transition-transform duration-1000"></i>
                   </div>

                   <div className="bg-indigo-600 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
                      <div className="relative z-10">
                         <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Network Integrity</h4>
                         <div className="text-3xl font-black tracking-tighter">VERIFIED</div>
                         <p className="text-[10px] text-indigo-100/60 mt-4 leading-relaxed italic">
                           All discovery cycles are grounded in verified market data via Google Search.
                         </p>
                      </div>
                      <i className="fas fa-check-circle absolute right-[-20px] bottom-[-20px] text-white/10 text-[120px]"></i>
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
        {subTab === 'feedback' && (
          <FeedbackDashboard domains={[]} stats={stats} />
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
