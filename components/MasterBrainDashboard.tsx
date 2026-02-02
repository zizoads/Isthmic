
import React, { useState, useEffect } from 'react';
import { PlatformStats, ActivityLog, PlatformStrategy } from '../types';
import { translations } from '../translations';
import { useDomainContext } from '../context/DomainContext';

interface Props {
  stats: PlatformStats;
  activityLogs: ActivityLog[];
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  onInitiateScan?: () => void;
  onCancelScan?: () => void;
  isScanning?: boolean;
  lang: 'ar' | 'en';
  onNavigateToKeys?: () => void;
}

const MasterBrainDashboard: React.FC<Props> = ({ stats, strategy, setStrategy, onInitiateScan, onCancelScan, isScanning, lang, onNavigateToKeys }) => {
  const t = translations[lang];
  const { integrations } = useDomainContext();
  const [isKeyConnected, setIsKeyConnected] = useState(false);

  useEffect(() => {
    setIsKeyConnected(integrations.some(i => i.provider === 'google' && i.status === 'connected'));
  }, [integrations]);

  return (
    <div className="space-y-8 lg:space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className={`p-8 lg:p-10 rounded-[40px] border border-white/5 bg-gradient-to-r from-[#111113] to-[#0a0a0c] shadow-2xl relative overflow-hidden`}>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
               <button onClick={onNavigateToKeys} className={`w-20 h-20 rounded-[24px] flex items-center justify-center text-2xl transition-all ${isKeyConnected ? 'bg-[#c5a059] text-black shadow-xl shadow-[#c5a059]/20' : 'bg-white/5 text-slate-500'}`}>
                  <i className={`fas ${isKeyConnected ? 'fa-bolt' : 'fa-key'}`}></i>
               </button>
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className="prestige-heading text-2xl lg:text-3xl italic text-white mb-1">
                    {lang === 'ar' ? 'التحكم في المفتاح السيادي' : 'Sovereign Key Control'}
                  </h4>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        {isKeyConnected ? 'STABLE' : 'AWAITING LINK'}
                     </span>
                     <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${stats.alignmentVelocity * 5}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/2 border border-white/5 px-6 py-4 rounded-2xl text-center">
                  <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Velocity</div>
                  <div className="text-xl font-black text-white">+{stats.alignmentVelocity}%</div>
               </div>
               <button onClick={onNavigateToKeys} className="px-10 py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
                 {isKeyConnected ? 'Gateways' : 'Add Key'}
               </button>
            </div>
         </div>
      </section>

      <section className="square-card !p-12">
         <div className="max-w-full">
            <div className="flex justify-between items-start mb-10">
               <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                  <div className="w-10 h-1 bg-[#c5a059] rounded-full"></div>
                  <h3 className="text-3xl prestige-heading text-white italic">{t.commanderIntent}</h3>
               </div>
               
               <div className="flex items-center gap-4 bg-indigo-600/5 border border-indigo-500/10 px-6 py-3 rounded-2xl">
                  <div className="text-right">
                     <div className="text-[8px] font-black text-indigo-400 uppercase">Adaptive Filter</div>
                     <div className="text-lg font-black text-white">{stats.adaptiveThreshold}%</div>
                  </div>
                  <button 
                    onClick={() => setStrategy(prev => ({ ...prev, adaptiveThresholdEnabled: !prev.adaptiveThresholdEnabled }))}
                    className={`w-12 h-6 rounded-full relative transition-all ${strategy.adaptiveThresholdEnabled ? 'bg-indigo-600' : 'bg-white/10'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${strategy.adaptiveThresholdEnabled ? 'right-1' : 'left-1'}`}></div>
                  </button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
               <div className="xl:col-span-8">
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => setStrategy(prev => ({ ...prev, investmentThesis: e.target.value }))}
                    className="w-full bg-[#0a0a0c] border border-white/5 rounded-[24px] px-8 py-8 text-lg font-medium focus:ring-1 focus:ring-[#c5a059]/50 text-white h-48 lg:h-64 shadow-inner leading-relaxed"
                    placeholder={t.thesisPlaceholder}
                  />
               </div>
               
               <div className="xl:col-span-4 space-y-6">
                  <div className="p-8 bg-white/[0.02] rounded-[24px] border border-white/5">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">Capital Budget</label>
                     <div className="flex items-baseline gap-2 text-4xl font-light prestige-heading text-white">
                        <input type="number" value={strategy.totalBudget} onChange={(e) => setStrategy(prev => ({...prev, totalBudget: Number(e.target.value)}))} className="bg-transparent border-none w-full focus:ring-0 p-0 text-white prestige-heading font-light" />
                        <span className="text-[#c5a059]">$</span>
                     </div>
                  </div>
                  <div className="p-8 bg-white/[0.02] rounded-[24px] border border-white/5">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">Causal Memory Units</label>
                     <div className="text-2xl font-black text-white italic">{strategy.causalRejectionModels?.length || 0} / 50</div>
                     <div className="text-[8px] font-bold text-slate-600 uppercase mt-2">Active Logic Chains</div>
                  </div>
               </div>
            </div>

            <div className={`mt-10 flex gap-4 border-t border-white/5 pt-10 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
               {isScanning ? (
                 <button onClick={onCancelScan} className="bg-red-500/10 text-red-500 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                   {t.cancelMission}
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="bg-white text-black px-16 lg:px-24 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4">
                   <i className="fas fa-bolt"></i> {t.activateSniper}
                 </button>
               )}
            </div>
         </div>
      </section>
    </div>
  );
};

export default MasterBrainDashboard;
