
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

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setIsKeyConnected(hasKey);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    try {
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setIsKeyConnected(true);
      }
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const updateStrategy = (key: keyof PlatformStrategy, value: any) => {
    setStrategy(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sovereign Key Management Banner */}
      <section className="bg-gradient-to-r from-[#111113] to-[#0a0a0c] p-10 lg:p-14 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-10">
               <button 
                  onClick={handleOpenKeyDialog}
                  className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-3xl shadow-2xl transition-all duration-700
                  ${isKeyConnected ? 'bg-[#c5a059] text-black scale-105' : 'bg-white/5 text-slate-500 hover:bg-white hover:text-black hover:scale-110'
               }`}>
                  <i className={`fas ${isKeyConnected ? 'fa-bolt' : 'fa-key'}`}></i>
               </button>
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className="text-white prestige-heading text-3xl italic mb-2">
                    {lang === 'ar' ? 'التحكم في المفتاح السيادي' : 'Sovereign Key Control'}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isKeyConnected ? 'text-[#c5a059]' : 'text-slate-600'}`}>
                      {isKeyConnected ? (lang === 'ar' ? 'النظام مدعوم بمفتاحك الخاص' : 'System Powered by your Private Key') : (lang === 'ar' ? 'بانتظار الإشارة' : 'Awaiting Signal')}
                    </span>
                    <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase text-indigo-400 hover:underline tracking-widest">
                      {lang === 'ar' ? 'إدارة الفوترة' : 'Manage Billing'}
                    </a>
                  </div>
               </div>
            </div>
            
            <div className="flex gap-3">
               <div className="icon-box bg-white/5 border border-white/10 text-slate-500 rounded-2xl group cursor-help" title="Supports Multiple LLMs">
                  <i className="fas fa-microchip"></i>
               </div>
               <div className="icon-box bg-white/5 border border-white/10 text-slate-500 rounded-2xl group cursor-help" title="Private Metadata Only">
                  <i className="fas fa-user-shield"></i>
               </div>
            </div>
         </div>
         <i className="fas fa-fingerprint absolute right-[-50px] bottom-[-50px] text-white/[0.02] text-[280px] pointer-events-none"></i>
      </section>

      <section className="square-card p-14 lg:p-20">
         <div className="max-w-5xl mx-auto">
            <div className={`flex items-center gap-6 mb-12 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
               <div className="w-12 h-1 bg-[#c5a059] rounded-full"></div>
               <h3 className="text-4xl prestige-heading text-white italic">{t.commanderIntent}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               <div className="lg:col-span-2 space-y-6">
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => updateStrategy('investmentThesis', e.target.value)}
                    className={`w-full bg-[#0a0a0c] border border-white/5 rounded-[32px] px-12 py-10 text-lg font-medium focus:ring-1 focus:ring-[#c5a059]/30 text-white shadow-inner h-60 placeholder:text-slate-700 leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={t.thesisPlaceholder}
                  />
               </div>
               
               <div className="space-y-10">
                  <div className="p-10 bg-white/[0.02] rounded-[32px] border border-white/5 relative overflow-hidden group">
                     <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.allocatedCapital}</label>
                     <div className={`flex items-baseline gap-3 text-4xl font-light prestige-heading text-white ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <input 
                           type="number" 
                           value={strategy.totalBudget}
                           onChange={(e) => updateStrategy('totalBudget', Number(e.target.value))}
                           className={`bg-transparent border-none w-full focus:ring-0 p-0 text-white prestige-heading font-light ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                        <span className="text-[#c5a059]">$</span>
                     </div>
                  </div>

                  <div className="p-10 bg-white/[0.02] rounded-[32px] border border-white/5">
                     <label className={`text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.attackPattern}</label>
                     <select 
                        value={strategy.riskTolerance}
                        onChange={(e) => updateStrategy('riskTolerance', e.target.value)}
                        className={`w-full bg-transparent border-none font-black text-white uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                     >
                        <option value="Conservative" className="bg-[#111113]">{t.conservative}</option>
                        <option value="Balanced" className="bg-[#111113]">{t.balanced}</option>
                        <option value="Aggressive" className="bg-[#111113]">{t.aggressive}</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className={`mt-16 flex gap-8 border-t border-white/5 pt-14 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
               {isScanning ? (
                 <button onClick={onCancelScan} className="bg-red-500/10 text-red-500 px-16 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                   {t.cancelMission}
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="bg-white text-black px-24 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-5">
                   <i className="fas fa-bolt"></i> {t.activateSniper}
                 </button>
               )}
            </div>
         </div>
      </section>

      {!isFirstRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
              <AnalyticsDashboard stats={stats} lang={lang} />
           </div>
           <div className="square-card flex flex-col overflow-hidden h-[650px]">
              <div className={`p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h3 className="font-black text-white uppercase text-lg tracking-tighter italic">{t.opsLog}</h3>
              </div>
              <div className={`flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 {activityLogs.map(log => (
                    <div key={log.id} className={`flex gap-6 border-b border-white/5 pb-10 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                       <p className={`text-[11px] text-slate-400 font-medium leading-relaxed italic ${lang === 'ar' ? 'order-1' : 'order-2'}`}>
                          {log.message}
                          <span className={`font-black uppercase tracking-widest ${lang === 'ar' ? 'ml-3' : 'mr-3'} ${log.type === 'critical' ? 'text-red-500' : 'text-[#c5a059]'}`}>:{log.agent}</span>
                       </p>
                       <span className={`text-[9px] font-mono text-slate-600 shrink-0 ${lang === 'ar' ? 'order-2' : 'order-1'}`}>{log.time}</span>
                    </div>
                 ))}
                 {activityLogs.length === 0 && <div className="text-center py-24 opacity-10 uppercase text-[10px] font-black tracking-widest">{t.opsLogEmpty}</div>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MasterBrainDashboard;
