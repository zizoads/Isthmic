
import React, { useState, useEffect } from 'react';
import { PlatformStats, ActivityLog, PlatformStrategy } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';
import { translations } from '../translations';

interface Props {
  stats: PlatformStats;
  activityLogs: ActivityLog[];
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  onInitiateScan?: () => void;
  onCancelScan?: () => void;
  isScanning?: boolean;
  onKeyUpdate?: () => void;
  lang: 'ar' | 'en';
}

const MasterBrainDashboard: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, onInitiateScan, onCancelScan, isScanning, lang }) => {
  const t = translations[lang];
  const isFirstRun = stats.totalDiscovered === 0;
  const [isKeyConnected, setIsKeyConnected] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setIsKeyConnected(hasKey);
      }
    };
    checkKey();
    
    const hasQuotaError = activityLogs.some(log => 
      log.type === 'critical' && (log.message.includes('Quota') || log.message.includes('تجاوزت'))
    );
    setQuotaWarning(hasQuotaError);
  }, [activityLogs]);

  const handleOpenKeyDialog = async () => {
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setIsKeyConnected(true);
        setQuotaWarning(false);
      }
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const updateStrategy = (key: keyof PlatformStrategy, value: any) => {
    setStrategy(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className={`p-8 lg:p-14 rounded-[32px] lg:rounded-[48px] border transition-all duration-700 shadow-2xl relative overflow-hidden ${
        quotaWarning ? 'bg-red-900/20 border-red-500/30' : 'bg-gradient-to-r from-[#111113] to-[#0a0a0c] border-white/5'
      }`}>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 lg:gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10">
               <button 
                  onClick={handleOpenKeyDialog}
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-[24px] lg:rounded-[32px] flex items-center justify-center text-2xl lg:text-3xl shadow-2xl transition-all duration-700
                  ${quotaWarning ? 'bg-red-600 text-white animate-pulse' : isKeyConnected ? 'bg-[#c5a059] text-black scale-105' : 'bg-white/5 text-slate-500 hover:bg-white hover:text-black hover:scale-110'
               }`}>
                  <i className={`fas ${quotaWarning ? 'fa-exclamation-triangle' : isKeyConnected ? 'fa-bolt' : 'fa-key'}`}></i>
               </button>
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className={`prestige-heading text-2xl lg:text-3xl italic mb-2 ${quotaWarning ? 'text-red-500' : 'text-white'}`}>
                    {quotaWarning 
                      ? (lang === 'ar' ? 'تم استنفاد حصة المفتاح' : 'Key Quota Exhausted')
                      : (lang === 'ar' ? 'التحكم في المفتاح السيادي' : 'Sovereign Key Control')
                    }
                  </h4>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 lg:gap-4">
                    <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-widest ${quotaWarning ? 'text-red-400' : isKeyConnected ? 'text-[#c5a059]' : 'text-slate-600'}`}>
                      {quotaWarning 
                        ? (lang === 'ar' ? 'يرجى تبديل المفتاح أو الانتظار' : 'Please switch key or wait for reset')
                        : isKeyConnected 
                          ? (lang === 'ar' ? 'النظام مدعوم بمفتاحك الخاص' : 'System Powered by your Private Key') 
                          : (lang === 'ar' ? 'بانتظار الإشارة' : 'Awaiting Signal')
                      }
                    </span>
                    <div className="hidden sm:block h-1 w-1 bg-slate-700 rounded-full"></div>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[8px] lg:text-[10px] font-black uppercase text-indigo-400 hover:underline tracking-widest">
                      {lang === 'ar' ? 'إدارة الفوترة' : 'Manage Billing'}
                    </a>
                  </div>
               </div>
            </div>
            
            <button 
              onClick={handleOpenKeyDialog}
              className="px-6 py-3 bg-white/5 border border-white/10 text-[8px] lg:text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all"
            >
              {lang === 'ar' ? 'تبديل المفتاح' : 'Switch Key'}
            </button>
         </div>
         <i className={`fas ${quotaWarning ? 'fa-skull-crossbones' : 'fa-fingerprint'} absolute right-[-50px] bottom-[-50px] text-white/[0.02] text-[180px] lg:text-[280px] pointer-events-none`}></i>
      </section>

      <section className="square-card p-8 lg:p-20">
         <div className="max-w-5xl mx-auto">
            <div className={`flex items-center gap-4 lg:gap-6 mb-8 lg:mb-12 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
               <div className="w-10 lg:w-12 h-1 bg-[#c5a059] rounded-full"></div>
               <h3 className="text-2xl lg:text-4xl prestige-heading text-white italic">{t.commanderIntent}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
               <div className="lg:col-span-2 space-y-6">
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => updateStrategy('investmentThesis', e.target.value)}
                    className={`w-full bg-[#0a0a0c] border border-white/5 rounded-[24px] lg:rounded-[32px] px-8 lg:px-12 py-8 lg:py-10 text-base lg:text-lg font-medium focus:ring-1 focus:ring-[#c5a059]/30 text-white shadow-inner h-48 lg:h-60 placeholder:text-slate-700 leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={t.thesisPlaceholder}
                  />
               </div>
               
               <div className="space-y-6 lg:space-y-10">
                  <div className="p-8 lg:p-10 bg-white/[0.02] rounded-[24px] lg:rounded-[32px] border border-white/5 relative overflow-hidden group">
                     <label className={`text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4 lg:mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.allocatedCapital}</label>
                     <div className={`flex items-baseline gap-2 text-2xl lg:text-4xl font-light prestige-heading text-white ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <input 
                           type="number" 
                           value={strategy.totalBudget}
                           onChange={(e) => updateStrategy('totalBudget', Number(e.target.value))}
                           className={`bg-transparent border-none w-full focus:ring-0 p-0 text-white prestige-heading font-light ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                        <span className="text-[#c5a059]">$</span>
                     </div>
                  </div>

                  <div className="p-8 lg:p-10 bg-white/[0.02] rounded-[24px] lg:rounded-[32px] border border-white/5">
                     <label className={`text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4 lg:mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.attackPattern}</label>
                     <select 
                        value={strategy.riskTolerance}
                        onChange={(e) => updateStrategy('riskTolerance', e.target.value)}
                        className={`w-full bg-transparent border-none font-black text-white text-[10px] lg:text-xs uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                     >
                        <option value="Conservative" className="bg-[#111113]">{t.conservative}</option>
                        <option value="Balanced" className="bg-[#111113]">{t.balanced}</option>
                        <option value="Aggressive" className="bg-[#111113]">{t.aggressive}</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className={`mt-10 lg:mt-16 flex flex-col sm:flex-row gap-4 lg:gap-8 border-t border-white/5 pt-8 lg:pt-14 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
               {isScanning ? (
                 <button onClick={onCancelScan} className="w-full sm:w-auto bg-red-500/10 text-red-500 px-10 lg:px-16 py-4 lg:py-5 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                   {t.cancelMission}
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="w-full sm:w-auto bg-white text-black px-16 lg:px-24 py-4 lg:py-5 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 lg:gap-5">
                   <i className="fas fa-bolt"></i> {t.activateSniper}
                 </button>
               )}
            </div>
         </div>
      </section>

      {!isFirstRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
           <div className="lg:col-span-2">
              <AnalyticsDashboard stats={stats} lang={lang} />
           </div>
           <div className="square-card flex flex-col overflow-hidden h-[500px] lg:h-[650px]">
              <div className={`p-6 lg:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h3 className="font-black text-white uppercase text-base lg:text-lg tracking-tighter italic">{t.opsLog}</h3>
              </div>
              <div className={`flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 lg:space-y-10 no-scrollbar ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 {activityLogs.map(log => (
                    <div key={log.id} className={`flex gap-4 lg:gap-6 border-b border-white/5 pb-8 lg:pb-10 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                       <p className={`text-[10px] lg:text-[11px] text-slate-400 font-medium leading-relaxed italic ${lang === 'ar' ? 'order-1' : 'order-2'}`}>
                          {log.message}
                          <span className={`font-black uppercase tracking-widest ${lang === 'ar' ? 'ml-3' : 'mr-3'} ${log.type === 'critical' ? 'text-red-500' : 'text-[#c5a059]'}`}>:{log.agent}</span>
                       </p>
                       <span className={`text-[8px] lg:text-[9px] font-mono text-slate-600 shrink-0 ${lang === 'ar' ? 'order-2' : 'order-1'}`}>{log.time}</span>
                    </div>
                 ))}
                 {activityLogs.length === 0 && <div className="text-center py-20 lg:py-24 opacity-10 uppercase text-[9px] lg:text-[10px] font-black tracking-widest">{t.opsLogEmpty}</div>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MasterBrainDashboard;
