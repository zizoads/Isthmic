
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
    <div className="space-y-10 animate-fade-in relative pb-20">
      {/* Visual Header / Dashboard Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
         <div className="lg:col-span-8 space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
               {lang === 'ar' ? 'مركز الاستخبارات السيادية' : 'SOVEREIGN INTEL CENTER'}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed">
               {lang === 'ar' 
                  ? 'محرك الاستدلال النشط يقوم بمسح الويب، مراقبة المبيعات المقارنة، وتوليد استراتيجيات الاستحواذ القسرية بناءً على نبض السوق الحقيقي.'
                  : 'The active reasoning engine scans the web, monitors comparable sales, and synthesizes forced acquisition strategies based on real market pulse.'}
            </p>
         </div>
         <div className="lg:col-span-4 flex justify-end gap-3">
            <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/10 shadow-xl overflow-x-auto scrollbar-hide">
              <button onClick={() => setSubTab('sovereign')} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'sovereign' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
                {lang === 'ar' ? 'التحكم الآلي' : 'SOVEREIGN'}
              </button>
              <button onClick={() => setSubTab('nexus')} 
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'nexus' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
                {lang === 'ar' ? 'الرادار' : 'NEXUS'}
              </button>
            </div>
         </div>
      </div>

      <div className="pt-4">
        {subTab === 'sovereign' && (
          <div className="space-y-12">
             <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
             />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <MarketMomentumChart lang={lang} />
                <div className="bg-[#0b0e14] rounded-[40px] p-10 border border-white/5 flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden group">
                   <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-500 text-4xl shadow-[0_0_50px_rgba(79,70,229,0.1)] group-hover:scale-110 transition-transform duration-500">
                      <i className="fas fa-brain animate-pulse"></i>
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white uppercase italic">{lang === 'ar' ? 'محاكاة السيناريوهات' : 'SCENARIO SIMULATION'}</h3>
                      <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                         {lang === 'ar' ? 'يقوم وكلاء الذكاء الاصطناعي بمحاكاة 12 متغيراً اقتصادياً لتوقع العائد المستقبلي للأصول.' : 'AI agents simulate 12 economic variables to forecast future asset yield.'}
                      </p>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setSubTab('feedback')} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                         {lang === 'ar' ? 'تدريب النماذج' : 'TRAIN MODELS'}
                      </button>
                      <button onClick={() => setSubTab('strategy')} className="px-10 py-4 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">
                         {lang === 'ar' ? 'المعايير الاستراتيجية' : 'STRATEGY ARBITRAGE'}
                      </button>
                   </div>
                   <i className="fas fa-network-wired absolute right-[-50px] bottom-[-50px] text-white/2 text-[200px] pointer-events-none group-hover:rotate-12 transition-transform duration-700"></i>
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
