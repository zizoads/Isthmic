
import React, { useState, useEffect } from 'react';
import { PlatformStats, ActivityLog, PlatformStrategy, AgentType } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';
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

const MasterBrainDashboard: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, onInitiateScan, onCancelScan, isScanning, lang, onNavigateToKeys }) => {
  const t = translations[lang];
  const { integrations } = useDomainContext();
  const [isKeyConnected, setIsKeyConnected] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState(false);

  useEffect(() => {
    const hasGemini = integrations.some(i => i.provider === 'google' && i.status === 'connected');
    setIsKeyConnected(hasGemini);
    
    const hasQuotaError = activityLogs.some(log => 
      log.type === 'critical' && (log.message.includes('Quota') || log.message.includes('تجاوزت'))
    );
    setQuotaWarning(hasQuotaError);
  }, [activityLogs, integrations]);

  return (
    <div className="space-y-8 lg:space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className={`p-8 lg:p-10 rounded-[32px] lg:rounded-[40px] border transition-all duration-700 shadow-2xl relative overflow-hidden ${
        quotaWarning ? 'bg-red-900/20 border-red-500/30' : 'bg-gradient-to-r from-[#111113] to-[#0a0a0c] border-white/5'
      }`}>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <button onClick={onNavigateToKeys} className={`w-20 h-20 rounded-[24px] flex items-center justify-center text-2xl transition-all duration-700 ${quotaWarning ? 'bg-red-600 text-white animate-pulse' : isKeyConnected ? 'bg-[#c5a059] text-black scale-105 shadow-xl shadow-[#c5a059]/20' : 'bg-white/5 text-slate-500 hover:bg-white hover:text-black'}`}>
                  <i className={`fas ${quotaWarning ? 'fa-exclamation-triangle' : isKeyConnected ? 'fa-bolt' : 'fa-key'}`}></i>
               </button>
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className={`prestige-heading text-2xl lg:text-3xl italic mb-1 ${quotaWarning ? 'text-red-500' : 'text-white'}`}>
                    {quotaWarning ? (lang === 'ar' ? 'تم استنفاد حصة المفتاح' : 'Key Quota Exhausted') : (lang === 'ar' ? 'التحكم في المفتاح السيادي' : 'Sovereign Key Control')}
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                     {isKeyConnected ? (lang === 'ar' ? 'الاتصال مستقر وآمن' : 'CONNECTION STABLE & SECURE') : (lang === 'ar' ? 'بانتظار حقن مفتاح الذكاء' : 'AWAITING NEURAL KEY INJECTION')}
                  </p>
               </div>
            </div>
            <button onClick={onNavigateToKeys} className="px-10 py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">
              {isKeyConnected ? (lang === 'ar' ? 'إدارة البوابات' : 'Manage Gateways') : (lang === 'ar' ? 'إضافة مفتاح الآن' : 'Add Key Now')}
            </button>
         </div>
      </section>

      <section className="square-card !p-8 lg:!p-12">
         <div className="max-w-full">
            <div className={`flex items-center gap-4 mb-8 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
               <div className="w-10 h-1 bg-[#c5a059] rounded-full"></div>
               <h3 className="text-2xl lg:text-3xl prestige-heading text-white italic">{t.commanderIntent}</h3>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
               <div className="xl:col-span-8">
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => setStrategy(prev => ({ ...prev, investmentThesis: e.target.value }))}
                    className={`w-full bg-[#0a0a0c] border border-white/5 rounded-[24px] px-6 py-6 text-sm lg:text-base font-medium focus:ring-1 focus:ring-[#c5a059]/50 text-white shadow-inner h-40 lg:h-48 placeholder:text-slate-500/60 leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={t.thesisPlaceholder}
                  />
               </div>
               
               <div className="xl:col-span-4 flex flex-col gap-4">
                  <div className="p-6 bg-white/[0.02] rounded-[24px] border border-white/5">
                     <label className={`text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.allocatedCapital}</label>
                     <div className={`flex items-baseline gap-2 text-2xl lg:text-3xl font-light prestige-heading text-white ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <input type="number" value={strategy.totalBudget} onChange={(e) => setStrategy(prev => ({...prev, totalBudget: Number(e.target.value)}))} className="bg-transparent border-none w-full focus:ring-0 p-0 text-white prestige-heading font-light" />
                        <span className="text-[#c5a059]">$</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className={`mt-10 flex gap-4 border-t border-white/5 pt-8 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
               {isScanning ? (
                 <button onClick={onCancelScan} className="bg-red-500/10 text-red-500 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                   {t.cancelMission}
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="bg-white text-black px-12 lg:px-16 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4">
                   <i className="fas fa-bolt"></i> {t.activateSniper}
                 </button>
               )}
            </div>
         </div>
      </section>
      
      {stats.totalDiscovered > 0 && <AnalyticsDashboard stats={stats} lang={lang} />}
    </div>
  );
};

export default MasterBrainDashboard;
